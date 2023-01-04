// Express router is required:
const express = require("express")
const router = express.Router();

const { check, validationResult } = require("express-validator");
const req = require("express/lib/request");
const res = require("express/lib/response");
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

// @route       GET api/posts
// @description Get all posts
// @access      Private

router.get('/',[auth], 
    async (req,res)=>{
    try {
    const posts = await Post.find().sort({date: -1});
    res.json(posts);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
    });

// @route       GET api/posts/:id
// @description Get posts by id
// @access      Private

router.get('/:id',[auth], 
    async (req,res)=>{
    try {
    const posts = await Post.findById(req.params.id);
    if (!posts){        
        return res.status(404).json({msg: "Post not found"});
    }
    res.json(posts);
    } catch (error) {
        if (error.kind === "ObjectId"){
            return res.status(404).json({msg: "Post not found"});
        }
        console.error(error.message);
        res.status(500).send('Server Error');
    }
    });


// @route       DELETE api/posts/:id
// @description Delete posts by id
// @access      Private

router.delete('/:id',[auth], 
    async (req,res)=>{
    try {
        const post = await Post.findById(req.params.id);
    
        if (!post){        
            return res.status(404).json({msg: "Post not found"});
        }
        // Check user
        if (post.user.toString() !== req.user.id){        
            return res.status(401).json({msg: "User not authorized"});
        }
        await post.remove();

        res.json({msg:"Post Removed"});
    } catch (error) {
        if (error.kind === "ObjectId"){
            return res.status(404).json({msg: "Post not found"});
        }
        console.error(error.message);
        res.status(500).send('Server Error');
    }
    });

// @route       PUT api/posts/like/:id
// @description Like a Post
// @access      Private

router.put('/like/:id',auth,
async (req,res)=>{
    try {
        const post = await Post.findById(req.params.id);
        // Check if already liked
        if(
            post.likes.filter(
                like => 
                like.user.toString() === req.user.id
            ).length > 0
        ){
            res.status(400).json({msg: "Post already liked"});
        }

        post.likes.unshift({ user: req.user.id });
        await post.save();
        res.json(post.likes);
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route       PUT api/posts/unlike/:id
// @description Unlike a Post
// @access      Private

router.put('/unlike/:id',auth,
async (req,res)=>{
    try {
        const post = await Post.findById(req.params.id);
        // Check if like exist
        if(
            post.likes.filter(
                like => 
                like.user.toString() === req.user.id
            ).length === 0
        ){
            res.status(400).json({msg: "Post not liked yet"});
        }
        // If liked, we need to obtain the index of the like
        const removeIndex = post.likes.map(like => like.user.toString()).indexOf(req.user.id);
        post.likes.splice(removeIndex,1);

        await post.save();
        res.json(post.likes);
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route       POST api/posts/comment/:id
// @description Comment on a post
// @access      Private
router.post('/comment/:id', [auth , [
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
    const post = await Post.findById(req.params.id);
    const newComment = {
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id
    }

    post.comments.unshift(newComment);
    await post.save();
    res.json(post.comments);
        
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');  
    }
});

// @route       DELETE api/posts/comment/:id/:comment_id
// @description Delete Comments on a post
// @access      Private

router.delete('/comment/:id/:comment_id',auth,
    async (req,res) =>{
        try {
            // Get post:
            const post = await Post.findById(req.params.id);
            // Get comment:
            const comment = post.comments.find(comment => comment.id === req.params.comment_id);
            // Condition for comment exists:
            if(!comment){
                return res.status(404).json({msg: "Comment does not exist"});
            }
            if(comment.user.toString()!==req.user.id){
                return res.status(401).json({msg: "User not authorized"});
            }
        
            const removeIndex = post.comments
            .map(comment => comment.user.toString()).indexOf(req.user.id);
        post.comments.splice(removeIndex,1);

        await post.save();
        res.json(post.comments);

        }catch(err){
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }
    );



module.exports = router;