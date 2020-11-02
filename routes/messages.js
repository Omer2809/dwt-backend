const express = require("express");
const router = express.Router();
const Joi = require("joi");
const { Expo } = require("expo-server-sdk");

const listingMapper = require("../mappers/listings");
const sendPushNotification = require("../utilities/pushNotifications");
const auth = require("../middleware/auth");
const validateWith = require("../middleware/validation");
const { Message } = require("../models/message");
const { User } = require("../models/user");
const { Listing } = require("../models/listing");

const schema = {
  message: Joi.string().required(),
  listingId: Joi.objectId().required(),
  userId: Joi.objectId().required(),
};

function getlistingss(item) {
  return { ...item, fromUser: listingMapper(item.fromUser._doc) };
}

function getObjects(item) {
  return item._doc;
}

router.get("/", auth, async (req, res) => {
  let messages = await Message.find().sort("-createdAt");
  messages = messages.map(getObjects).map(getlistingss);
  res.send(messages);
});

router.post("/", [auth, validateWith(schema)], async (req, res) => {
  const { listingId, message, userId } = req.body;
  console.log(req.body);

  let listing = await Listing.findById(listingId);
  if (!listing) return res.status(400).send("Invalid listing.");
  listing = listingMapper(listing._doc);

  console.log("after map listing image", listing.images);

  const targetUser = await User.findById(listing.added_by._id);
  if (!targetUser) return res.status(400).send("Invalid user.");

  const fromUser = await User.findById(userId);
  if (!fromUser) return res.status(400).send("Invalid user.");

  let messagee = new Message({
    fromUser: {
      _id: fromUser._id,
      name: fromUser.name,
      email: fromUser.email,
      images: fromUser.profileImage,
    },
    toUser: {
      _id: targetUser._id,
      name: targetUser.name,
      email: targetUser.email,
    },
    listing: {
      _id: listing._id,
      title: listing.title,
      description: listing.description,
      price: listing.price,
      images: listing.images,
    },
    content: message,
  });
  await messagee.save();

  const { expoPushToken } = targetUser;

  if (Expo.isExpoPushToken(expoPushToken)) {
    console.log("sending msg inside");
    await sendPushNotification(expoPushToken, message);
    console.log("sent done...");
  }

  res.status(201).send();
});

router.delete("/:id", async (req, res) => {
  const message = await Message.findByIdAndRemove(req.params.id);

  if (!message)
    return res.status(404).send("The message with the given ID was not found.");

  res.status(201).send(message);
});

module.exports = router;
