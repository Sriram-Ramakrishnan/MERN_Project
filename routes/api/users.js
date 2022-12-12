// Express router is required:
const express = require("express");
const { format } = require("express/lib/response");
const router = express.Router();

// Password Hashing module
const bcrypt = require('bcryptjs');

// JWT:
const jwt = require('jsonwebtoken');
const config = require('config'); //

const { check, validationResult } = require("express-validator")



// Get Avatar of the email
const gravatar = require('gravatar');
// Get user model
const User = require("../../models/Users")

// @route       POST api/users -> Post user data for registration
// @description Register a user
// @access      Public
router.post('/', 
    [
        check('name', 'Name is required').not().isEmpty(),
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Please enter a password with 6 or more characters').isLength({min:6}),
    ],
    async (req,res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()});
        }

        const { name,email,password } = req.body;
        try {
            // See if user exists
            let user =  await User.findOne({ email });

            if(user){
                return res.status(400).json({errors: [{msg: 'User already exists'}]});
            }
            
            // Get user's avatar
            const avatar = gravatar.url(email, {
                s: '200',
                r: 'pg',
                d: 'mm' // 404 gives you a not found error, mm gives default
            })

            // Does not save the user yet
            user = new User({
                name,
                email,
                avatar,
                password
            })

            // Encrypt password
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password,salt); // Hashes the password
            await user.save();

            // Return jsonwebtoken to login right after signing up
            const payload = {
                user: {
                    id: user.id  // In MongoDB, we see _id, but mongoose uses abstraction so we can use id instead of _id
                }
            }

            jwt.sign(payload,
                config.get('jwtToken'), // Add your personal JWT Secret key in default.json
                { expiresIn: 360000 }, // Change this to 3600 during production!! 
                (err, token)=>{
                    if (err) throw err;
                    return res.json({ token: token });
                }); 
            
        } catch (err) {
            console.log(err.message);
            res.status(500).send('Server error');
        }
    }
    );

module.exports = router;