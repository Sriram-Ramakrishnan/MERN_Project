// Express router is required:
const express = require("express")
const router = express.Router();
const auth = require("../../middleware/auth")

const { check, validationResult } = require("express-validator");


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

// @route       POST api/profile
// @description Create/Update user's profile
// @access      X Private X

router.post('/', [
    auth, 
    [
        check('status', 'Status reqd').not().isEmpty(), 
        check('skills', 'Skills reqd').not().isEmpty()
    ] 
    ],
    async (req,res)=>{
        const errors = validationResult(req);
        if(!errors.isEmpty()){ 
            return res.status(400).json({ errors: errors.array()});
        }
        // Pull all fields out:
        const {company, website, location, bio, status, githubusername, skills, youtube, facebook, twitter, instagram, linkedin } = req.body;

        const profileFields = {}
        profileFields.user = req.user.id;
        if(company) profileFields.company = company;
        if(website) profileFields.website = website;
        if(location) profileFields.location = location;
        if(bio) profileFields.bio = bio;
        if(status) profileFields.status = status;
        if(githubusername) profileFields.githubusername = githubusername;

        if(skills){
            profileFields.skills = skills.split(',').map(skill => skill.trim());
        }
        console.log(profileFields.skills);
        // Social object:
        profileFields.social = {};
        if(youtube) profileFields.social.youtube = youtube;
        if(twitter) profileFields.social.twitter = twitter;
        if(instagram) profileFields.social.instagram = instagram;
        if(linkedin) profileFields.social.linkedin = linkedin;
        if(facebook) profileFields.social.facebook = facebook;

        try {
            let profile = await Profile.findOne({ user: req.user.id });
            if(profile){
                // Update:
                profile = await Profile.findOneAndUpdate(
                    { user: req.user.id },
                    {$set: profileFields},
                    { new: true }
                    );
                return res.json(profile);
            }

            // Create:
            profile = new Profile(profileFields);
            await profile.save();
            res.json(profile);
            
        } catch (err) {
            console.error(err.message);
            return res.status(500).send("SERVER ERROR");

        }
        // Send a response:
        res.send("Profile response POST");
});

module.exports = router;