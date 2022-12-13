// Express router is required:
const express = require("express")
const router = express.Router();
const auth = require("../../middleware/auth")

const Profile = require("../../models/Profile");
const User = require("../../models/Profile");



// @route       GET api/profile/me
// @description Get user's profile
// @access      X Private X
router.get('/me',auth,
    async (req,res) =>{
        try {
            // Find the respective user first:
            const profile = await Profile.findOne({ user: req.user.id })
            .populate('user', ['name', 'avatar']);  // Used to get other Model's data and populate the current one
            if(!profile){
                return res.status(400).json({msg: "No profile for this user"});
            }
            
        } catch (err) {
            console.log(err.message);
            res.status(500).send('Server error');
        }    
    
    });

module.exports = router;