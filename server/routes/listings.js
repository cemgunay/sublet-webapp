const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Listing = require("../models/Listing");

//Create a listing
router.post("/", async (req,res) => {
    const newPost = new Listing(req.body)
    try {
        const savedPost = await newPost.save();
        res.status(200).json(savedPost);
        
    } catch (err) {
        res.status(500).json(err);
    }
});

//Update a listing
router.put("/:id", async(req,res)=>{

    try{
        const listing = await Listing.findById(req.params.id);
        if(listing.userId === req.body.userId){ //Check if listing belongs to user trying to update it
            await listing.updateOne({$set:req.body});
            res.status(200).json("The post has been updated!");

        } else {
        res.status(403).json("You can only update your own post!");
        }
    } catch(err){
        res.status(500).json(err);
    }
});

//Delete a listing
router.delete("/:id", async(req,res)=>{

    try{
        const listing = await Listing.findById(req.params.id);
        if(listing.userId === req.body.userId){ //Check if listing belongs to user trying to update it
            await listing.deleteOne();
            res.status(200).json("The post has been deleted!");

        } else {
            await listing.deleteOne();
        res.status(403).json("You can only delete your own post!");
        }
    } catch(err){
        res.status(500).json(err);
    }
});

//Get a listing
router.get("/:id", async (req,res) => {
    try {
        const listing = await Listing.findById(req.params.id);
        res.status(200).json(listing);
    } catch (err) {
        res.status(500).json(err);
    }
});

//Add view to listing
router.put("/:id/view", async(req,res) => {

    try {
        const listing = await Listing.findById(req.params.id);
        listing.views += 1;
        await listing.save();
        res.status(200).json("Views of this post +1!");
    }
    catch (err){
        res.status(500).json(err);
    }
});

module.exports = router;