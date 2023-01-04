// Express router is required:
const express = require("express")
const router = express.Router();

const { check, validationResult } = require("express-validator");
const auth = require("../../middleware/auth");

// Models import:
const Post = require("../../models/Post");
const Profile = require("../../models/Profile");
const User = require("../../models/Users");

// @route       POST api/posts
// @description Create a post
// @access      Private
router.post('/', [auth , [
    check('text', 'Text required').not().isEmpty()
]],
async (req,res) => {
    const errors = validationResult(req);
    // Check if errors array is not empty, return err response
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array()});
    }
    try {
    // Gets the user but remove password as it is not needed:
    const user = await User.findById(req.user.id).select('-password');
    const newPost = new Post({
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id
    });
    const post = await newPost.save();

    res.json(post);
        
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
        
    }
});

module.exports = router;