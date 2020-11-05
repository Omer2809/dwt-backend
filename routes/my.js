const express = require("express");
const router = express.Router();

const listingMapper = require("../mappers/listings");
const auth = require("../middleware/auth");
const { Favorite } = require("../models/favorite");
const { Listing } = require("../models/listing");
const { Message } = require("../models/message");
const { User } = require("../models/user");

function getObjects(item) {
  return item._doc;
}

function getlistingss(item) {
  return { ...item, added_by: listingMapper(item.added_by._doc) };
}

function getMessages(item) {
  return { ...item, fromUser: listingMapper(item.fromUser._doc) };
}

router.get("/listings", auth, async (req, res) => {
  const user = await User.findById(req.user.userId);
  if (!user) return res.status(400).send("Invalid user.");

  const listings = await Listing.find({
    "added_by._id": user._id,
  }).sort({ createdAt: -1 });

  const resources = listings
    .map(getObjects)
    .map(listingMapper)
    .map(getlistingss);

  res.send(resources);
});

router.get("/favorites", auth, async (req, res) => {
  const user = await User.findById(req.user.userId);
  if (!user) return res.status(400).send("Invalid user.");

  const favorites = await Favorite.find({
    "favorited_by._id": user._id,
  }).sort({ createdAt: -1 });

  res.send(favorites);
});

router.get("/messages/receive", auth, async (req, res) => {
  const user = await User.findById(req.user.userId);
  if (!user) return res.status(400).send("Invalid user.");

  let messages = await Message.find({
    "toUser._id": user._id,
  }).sort({ createdAt: -1 });

  messages = messages.map(getObjects).map(getMessages);
  res.send(messages);
});

router.get("/messages/send", auth, async (req, res) => {
  const user = await User.findById(req.user.userId);
  if (!user) return res.status(400).send("Invalid user.");

  const messages = await Message.find({
    "fromUser._id": user._id,
  });

  messages = messages.map(getObjects).map(getMessages);
  res.send(messages);
});

module.exports = router;
