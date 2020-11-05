const express = require("express");
const router = express.Router();
const Joi = require("joi");

const auth = require("../middleware/auth");
const validateWith = require("../middleware/validation");
const { Favorite } = require("../models/favorite");
const { User } = require("../models/user");
const { Listing } = require("../models/listing");
const listingMapper = require("../mappers/listings");

const schema = {
  listingId: Joi.objectId().required(),
  userId: Joi.objectId().required(),
};

router.get("/", auth, async (req, res) => {
  let favorites = await Favorite.find().sort("-createdAt");
  res.send(favorites);
});

router.post("/", [auth, validateWith(schema)], async (req, res) => {
  const { listingId, userId } = req.body;
  console.log(req.body);

  let listing = await Listing.findById(listingId);
  if (!listing) return res.status(400).send("Invalid listing.");
  listing = listingMapper(listing._doc);

  const user = await User.findById(userId);
  if (!user) return res.status(400).send("Invalid user.");

  const favorite = new Favorite({
    favorited_by: {
      _id: user._id,
      name: user.name,
      email: user.email,
    },
    listing: {
      _id: listing._id,
      title: listing.title,
      description: listing.description,
      price: listing.price,
      images: listing.images,
    },
  });
  await favorite.save();

  console.log("added to favorated:", favorite);
  res.status(201).send();
});

router.post("/favorited", auth, async (req, res) => {
  const { listingId, userId } = req.body;
  console.log(req.body);
  console.log(listingId, userId);

  const favorite = await Favorite.find({
    "favorited_by._id": userId,
    "listing._id": listingId,
  });

  console.log("check favorated:", favorite);

  res.send(favorite);
});

router.post("/deleteParticular", auth, async (req, res) => {
  const { listingId, userId } = req.body;

  const favorites = await Favorite.deleteMany({
    "favorited_by._id": userId,
    "listing._id": listingId,
  });

  // if (!favorites)
  //   return res
  //     .status(404)
  //     .send("The favorite with the given ID was not found.");

  console.log("delete favorated:", favorites);
  res.status(201).send(favorites);
});

router.delete("/:id", async (req, res) => {
  const favorite = await Favorite.findByIdAndRemove(req.params.id);

  if (!favorite)
    return res
      .status(404)
      .send("The favorite with the given ID was not found.");

  res.status(201).send(favorite);
});

module.exports = router;
