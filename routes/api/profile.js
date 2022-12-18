// Express router is required:
const express = require("express")
const router = express.Router();
const auth = require("../../middleware/auth")

const { check, validationResult } = require("express-validator");


const Profile = require("../../models/Profile");
// Fetch user model from Users.js
const User = require("../../models/Users");




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

router.post('/', 
    [
        auth, // Middleware array: Consisting of auth and validators
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

});

// @route       GET api/profile
// @description Get all profiles 
// @access      Public

router.get('/',
    async (req,res) => {
        try {
            const profiles = await Profile.find().populate('user', ['name','avatar']);
            res.json(profiles);
        } catch (err) {
            console.log(err.message);
            res.status(500).send('Server error');
        }
    }
);

// @route       GET api/profile/user/:user_id
// @description Get specific user's profile
// @access      Public

router.get('/user/:user_id',
    async (req,res) => {
        try {
            const profile = await Profile.findOne({user: req.params.user_id }).populate('user', ['name','avatar']);
            if(!profile) {
                return res.status(400).json({'msg': "Profile not found"});
            }
            // Return profile if exists:
            res.json(profile);

        } catch (err) {
            console.log(err.message);
            if(err.kind == 'ObjectId'){
                // To return the message if the entered user_id doesnt exist
                return res.status(400).json({'msg': "Profile not found"});

            }
            res.status(500).send('Server error');
        }
    }
);

// @route       DELETE api/profile
// @description Delete profile & user
// @access      Private

router.delete('/', auth, 
    async (req,res)=>{
        try {
            // Delete profile:
            await Profile.findOneAndRemove({ user: req.user.id });
            // Delete user:
            await User.findOneAndRemove({ _id: req.user.id});
            res.json({"msg":"Deleted"});
            
        } catch (err) {
            console.error(err.message);
            res.status(500).send("Server Error");
        }
});

// @route       PUT api/profile/experience
// @description Add Experience
// @access      Private

router.put('/experience', 
[
    auth, // Middleware array: Consisting of auth and validators
    [
        check('title', 'Title required').not().isEmpty(), 
        check('company', 'Company is required').not().isEmpty(),
        check('from', 'From date is required').not().isEmpty()
    ] 
],
    async (req,res)=>{
        const errors = validationResult(req);
        if(!errors.isEmpty()){ 
            return res.status(400).json({ errors: errors.array()});
        }
        // Get Data
        const {title, company, location, from, to, current, description} = req.body;
        const newExperience = {
            title, // Same as title: title
            company, 
            location, 
            from, 
            to, 
            current, 
            description
        }
        try {
            let profile = await Profile.findOne({user: req.user.id});
            // unshift pushes to the beginning rather than the end:
            profile.experience.unshift(newExperience);
            await profile.save();
            res.json(profile);
            
        } catch (err) {
            console.error(err.message);
            res.status(500).send("Server Error");
        }

    });


// @route       DELETE api/profile/experience/:exp_id
// @description Delete experience from profile
// @access      Private

router.delete('/experience/:exp_id', auth, 
    async (req,res)=>{
        try {
            const profile = await Profile.findOne({ user: req.user.id});

            // Get remove index:
            /* First, the entire array (experience) has many fields,
            We use the map function to convert it into an array of experience ids
            Then we use the indexOf(exp_id) to get the experience we need to delete*/
            const removeIndex = profile.experience.map(item => item.id).indexOf(req.params.exp_id);

            profile.experience.splice(removeIndex,1); //splice(index,number_of_times_to_be_deleted)
            await profile.save();
            res.json(profile);
            
        } catch (err) {
            console.error(err.message);
            res.status(500).send("Server Error");
        }
});

// @route       PUT api/profile/education
// @description Add education
// @access      Private

router.put('/education', 
[
    auth, // Middleware array: Consisting of auth and validators
    [
        check('school', 'School required').not().isEmpty(), 
        check('degree', 'Degree is required').not().isEmpty(),
        check('fieldofstudy', 'Field of study is required').not().isEmpty(),
        check('from', 'From date is required').not().isEmpty()
    ] 
],
    async (req,res)=>{
        const errors = validationResult(req);
        if(!errors.isEmpty()){ 
            return res.status(400).json({ errors: errors.array()});
        }
        // Get Data
        const {school, degree, fieldofstudy, from, to, current, description} = req.body;
        const newEd = {
            school, 
            degree, 
            fieldofstudy, 
            from, 
            to, 
            current, 
            description
        }
        try {
            let profile = await Profile.findOne({user: req.user.id});
            // unshift pushes to the beginning rather than the end:
            profile.education.unshift(newEd);
            await profile.save();
            res.json(profile);
            
        } catch (err) {
            console.error(err.message);
            res.status(500).send("Server Error");
        }

    });


// @route       DELETE api/profile/education/:edu_id
// @description Delete education from profile
// @access      Private

router.delete('/education/:edu_id', auth, 
    async (req,res)=>{
        try {
            const profile = await Profile.findOne({ user: req.user.id});

            // Get remove index:
            /* First, the entire array (education) has many fields,
            We use the map function to convert it into an array of education ids
            Then we use the indexOf(exp_id) to get the education we need to delete*/
            const removeIndex = profile.education.map(item => item.id).indexOf(req.params.edu_id);

            profile.education.splice(removeIndex,1); //splice(index,number_of_times_to_be_deleted)
            await profile.save();
            res.json(profile);
            
        } catch (err) {
            console.error(err.message);
            res.status(500).send("Server Error");
        }
});

// @route       GET api/profile/github/:username
// @description Get user's repositories from GitHub
// @access      Public

const request = require('request');
const config = require('config');

router.get('/github/:username', (req,res) =>{
    try {
        const options = {
            uri: `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc&clientid=${config.get('githubClientId')}&client_secret=${config.get('githubSecret')}`,
            method: 'GET',
            headers: { 'user-agent':'node.js' }
        }
        request(options, (error,response, body) =>{
            if(error) console.error(error);

            if(response.statusCode != 200){
                return res.status(404).json({msg: "No GitHub profile found" });

            }
            res.json(JSON.parse(body));
        })
        
    } catch (err) {
        console.error(err.message);
        res,status(500).send("Server error!");
    }
})

module.exports = router;