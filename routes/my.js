const express = require("express");
const router = express.Router();

// const listingsStore = require("../store/listings");
// const auth = require("../middleware/auth");
const listingMapper = require("../mappers/listings");
const auth = require("../middleware/auth");
const { Listing } = require("../models/listing");
const { Message } = require("../models/message");
const { User } = require("../models/user");

function getObjects(item) {
  return item._doc;
}

router.get("/listings", auth, async (req, res) => {
  const user = await User.findById(req.user.userId);
  if (!user) return res.status(400).send("Invalid user.");

  const listings = await Listing.find({
    "added_by._id": user._id,
  }).sort({ createdAt: -1 });

  const resources = listings.map(getObjects).map(listingMapper);

  res.send(resources);
});
// function changeListing(item) {
//   return { ...item, listing: listingMapper(item.listing) };
// }

// router.get("/", async (req, res) => {
//   let listings = await Listing.find().sort("title");
//   const resources = listings.map(getObjects).map(listingMapper);
//   res.send(resources);
// });
router.get("/messages/receive", auth, async (req, res) => {
  const user = await User.findById(req.user.userId);
  if (!user) return res.status(400).send("Invalid user.");

  let messages = await Message.find({
    "toUser._id": user._id,
  }).sort({ createdAt: -1 });

  // console.log(messages);
  // console.log(messages.map(getObjects).map(listingMapper));
  // messages.listing = listingMapper(messages.listing);
  // messages = messages.map(changeListing);
  // console.log(messages[0].listing.images);
  // console.log(messages[0]._doc.listing);
  res.send(messages);
});

router.get("/messages/send", auth, async (req, res) => {
  const user = await User.findById(req.user.userId);
  if (!user) return res.status(400).send("Invalid user.");

  const messages = await Message.find({
    "fromUser._id": user._id,
  });

  res.send(messages);
});

module.exports = router;
