const express = require("express");
const router = express.Router();
const multer = require("multer");
const User = require("../models/User");
const Listing = require("../models/Listing");
const cloudinary = require("../utils/cloudinary");

// Configure multer for file uploads
const upload = multer({ dest: "uploads/" });

// Create a listing
/*router.post("/", async (req,res) => {
    const newPost = new Listing(req.body)
    try {
        const result = await cloudinary.uploader.upload()

        const savedPost = await newPost.save();
        res.status(200).json(savedPost);
        
    } catch (err) {
        res.status(500).json(err);
    }
}); */

// Create a listing
router.post("/", upload.array("images"), async (req, res) => {
  try {
    /*
    // Upload images to Cloudinary
    const uploads = req.files.map((file) =>
      cloudinary.uploader.upload(file.path)
    );
    const results = await Promise.all(uploads);
  */

    // Create new listing object with image data
    const newListing = new Listing({
      userId: req.body.userId,
      title: req.body.title,
      /*
      images: results.map((result) => ({
        url: result.secure_url,
        filename: result.public_id,
      })),
      */
      location: {
        address1: req.body.location.address,
        city: req.body.location.city,
        countryregion: req.body.location.countryregion,
        postalcode: req.body.location.postalcode,
        stateprovince: req.body.location.stateprovince,
        unitnumber: req.body.location.unitnumber,
      },

      moveInDate: req.body.moveInDate,
      moveOutDate: req.body.moveOutDate,
      expiryDate: req.body.expiryDate,
      price: req.body.price,

      aboutyourplace:{
        propertyType: req.body.aboutyourplace.propertyType,
        privacyType: req.body.aboutyourplace.privacyType
      },
      basics: {
        bedrooms: {
          bedType: req.body.basics.bedrooms.bedType,
          ensuite: req.body.basics.bedrooms.ensuite
        },
        bathrooms: req.body.basics.bathrooms,
      },
      /*
      amenities: {
        inUnitWasherAndDrier: req.body.amenities.inUnitWasherAndDrier,
        airConditioning: req.body.amenities.airConditioning,
        petsAllowed: req.body.amenities.petsAllowed,
        furnished: req.body.amenitiesfurnished,
        dishwasher: req.body.amenities.dishwasher,
        fitnessCenter: req.body.amenities.fitnessCenter,
        balcony: req.body.amenities.balcony,
        parking: req.body.amenities.parking,
      },
      */
      /*
      utilities: {
        hydro: req.body.utilities.hydro,
        electricity: req.body.utilities.electricity,
        water: req.body.utilities.water,
        wifi: req.body.utilities.wifi,
      },
      */
      description: req.body.description,
    });

    // Save listing to MongoDB
    const savedListing = await newListing.save();

    res.status(200).json(savedListing);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

//Update a listing (without photo update)
router.put("/:id", async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (listing.userId === req.body.userId) {
      //Check if listing belongs to user trying to update it
      await listing.updateOne({ $set: req.body });
      res.status(200).json("The listing has been updated!");
    } else {
      res.status(403).json("You can only update your own listing!");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//Delete a listing
router.delete("/:id/:userId", async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (listing.userId === req.params.userId) {
      //Check if listing belongs to user trying to delete it
      await listing.deleteOne();
      res.status(200).json("The listing has been deleted!");
    } else {
      res.status(403).json("You can only delete your own listing!");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//Get a listing
router.get("/:id", async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id).select({});
    res.status(200).json(listing);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get all of the listings in progress for a user
router.get("/listingsinprogress/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const listings = await Listing.find({ userId, published: false });
    res.send(listings);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error");
  }
});

//Get the draft group of a listing in progress
router.get("/draftgroup/:id", async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).send("Listing not found");
    }

    if (!listing.title) {
      return res.send("aboutyourplace");
    }

    if (!listing.address) {
      return res.send("location");
    }

    //TO DO: Write out all the remaining conditional statements to determine the listings draftgroup

    return res.send("No empty properties!");
  } catch (err) {
    res.status(500).json(err);
  }
});

//Get all listings with filters

router.get("/", async (req, res) => {
  const query = {};
  if (req.query.city) {
    query.city = req.query.city;
  }
  if (req.query.moveInDate) {
    query.moveInDate = {
      $gte: req.query.moveInDate[0],
      $lte: req.query.moveInDate[1],
    };
  }
  if (req.query.moveOutDate) {
    query.moveOutDate = {
      $gte: req.query.moveOutDate[0],
      $lte: req.query.moveOutDate[1],
    };
  }
  if (req.query.expiryDate) {
    query.expiryDate = {
      $gte: req.query.expiryDate[0],
      $lte: req.query.expiryDate[1],
    };
  }
  if (req.query.price) {
    query.price = { $gte: req.query.price[0], $lte: req.query.price[1] };
  }
  if (req.query.propertyType) {
    query.propertyType = req.query.propertyType;
  }
  if (req.query.numOfBedrooms) {
    query["bedrooms.length"] = {
      $gte: req.query.numOfBedrooms[0],
      $lte: req.query.numOfBedrooms[1],
    };
  }
  if (req.query.utilities) {
    const { hydro, electricity, water, wifi } = req.query.utilities;
    if (hydro) {
      query["utilities.hydro"] = hydro;
    }
    if (electricity) {
      query["utilities.electricity"] = electricity;
    }
    if (water) {
      query["utilities.water"] = water;
    }
    if (wifi) {
      query["utilities.wifi"] = wifi;
    }
  }
  try {
    const listings = await Listing.find(query).exec();
    res.status(200).json(listings);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//Get all listings
router.get("/", async (req, res) => {
  try {
    const listings = await Listing.find();
    res.status(200).json(listings);
  } catch (err) {
    res.status(500).json(err);
  }
});

//Add view to listing
router.put("/:id/view", async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    listing.views += 1;
    await listing.save();
    res.status(200).json("Views of this post +1!");
  } catch (err) {
    res.status(500).json(err);
  }
});

//Favourite a listing
router.put("/:id/favourite", async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    const currentUser = await User.findById(req.body.userId);
    const listingUser = listing.userId;

    if (currentUser == listingUser) {
      res.status(403).json("Cannot favourite your own listing");
    }

    if (!currentUser.favourites.includes(req.params.id)) {
      await currentUser.updateOne({ $push: { favourites: req.params.id } });
      res.status(200).json("Successfully favourited a listing!");
    } else {
      res.status(403).json("You have already favourited this listing!");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
