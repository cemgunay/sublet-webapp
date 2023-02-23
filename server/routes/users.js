const User = require("../models/User");
const router = require("express").Router();
const bcrypt = require("bcrypt");

//Get a user with user id
router.get("/id/:id", async (req,res)=> {
    try {
        const user = await User.findById(req.params.id);
        const {password, ...other} = user._doc; //Hide the password in the response 
        res.status(200).json(other);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;