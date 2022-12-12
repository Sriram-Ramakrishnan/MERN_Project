// Express router is required:
const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const User = require('../../models/Users');
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

module.exports = router;