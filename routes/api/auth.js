// Express router is required:
const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const User = require('../../models/Users');

// JWT:
const jwt = require('jsonwebtoken');
const config = require('config'); //
const bcrypt = require('bcryptjs');

const { check, validationResult } = require("express-validator");


// @route       GET api/auth
// @description Test route
// @access      Public
router.get('/',auth, 
    async (req,res) => {
    try {
        // Middleware sends the user in the request, hence we can fetch it:
        const user = await User.findById(req.user.id).select("-password");
        res.json(user);
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Server error");
    }
});

// @route       POST api/auth -> Post user data for login
// @description Logging in a user
// @access      Public
router.post('/', 
    [
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Please enter a password with 6 or more characters').exists(),
    ],
    async (req,res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()});
        }

        const {email,password } = req.body;
        try {
            // See if user exists
            let user =  await User.findOne({ email });

            if(!user){
                return res.status(400).json({errors: [{msg: 'Invalid Credentials'}]});
            }

            // Match the password
            const isMatch = await bcrypt.compare(password,user.password);

            if(!isMatch){
                return res.status(400).json({errors: [{msg: 'Invalid Credentials'}]});

            }

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