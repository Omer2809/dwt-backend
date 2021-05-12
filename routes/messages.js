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
  toId: Joi.objectId().required(),
  fromId: Joi.objectId().required(),
};

function getlistingss(item) {
  return { ...item, fromUser: listingMapper(item.fromUser._doc) };
}

function getObjects(item) {
  return item._doc;
}

router.get("/", async (req, res) => {
  let messages = await Message.find().sort("-createdAt");
  messages = messages.map(getObjects).map(getlistingss);
  res.send(messages);
});

router.post("/", [auth, validateWith(schema)], async (req, res) => {
  let { listingId, message, fromId, toId } = req.body;
  console.log(req.body);

  let listing = await Listing.findById(listingId);

  if (!listing) return res.status(400).send("Invalid listing.");
  listing = listingMapper(listing._doc);

  console.log("after map listing image", listing.images);

  const targetUser = await User.findById(toId);
  if (!targetUser) return res.status(400).send("Invalid user. targetUser");

  const fromUser = await User.findById(fromId);
  if (!fromUser) return res.status(400).send("Invalid user. fromUSer");

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
    participants: [{ name: fromUser.name }, { name: targetUser.name }],
  });

  message=await messagee.save();

  const { expoPushToken } = targetUser;

  if (Expo.isExpoPushToken(expoPushToken)) {
    await sendPushNotification(expoPushToken, message);
    // console.log("sent done...");
  }

  console.log(message);
  res.status(201).send(message);
});

router.delete("/forMe/:id",auth, async (req, res) => {
  let message = await Message.findById(req.params.id);

  if (!message)
    return res.status(404).send("The message with the given ID was not found.");

  console.log(req.params.id, message);

  message = await Message.updateOne(
    {
      _id: message._id,
    },
    {
      // $pull: { participants: { name: "Mohd Omer" }},
      $pull: { participants: { name: req.user.name } },
    }
  );


  //cleaning
  await Message.deleteMany({ participants: { $exists: true, $eq: [] } });


  res.status(201).send(message);
});

router.delete("/forAll/:id",auth, async (req, res) => {
  const message = await Message.findByIdAndRemove(req.params.id);

  if (!message)
    return res.status(404).send("The message with the given ID was not found.");

  res.status(201).send(message);
});



module.exports = router;
