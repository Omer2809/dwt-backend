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

// { "fromUserId":"5f8706c516f3a20f68f984bf", "listingId":"6085c45a45655a23f028ca8d","toUserId":"5f87082516f3a20f68f984c1" }

router.post("/chat", async (req, res) => {
  // const user = await User.findById(req.user.userId);
  // if (!user) return res.status(400).send("Invalid user.");
  // console.log(req.body);
  // {$or:[{region: "NA"},{sector:"Some Sector"}]
  const { fromUserId, toUserId, listingId } = req.body;

  let messages = await Message.find({
    $or: [
      {
        "fromUser._id": fromUserId,
        "toUser._id": toUserId,
        "listing._id": listingId,
      },
      {
        "fromUser._id": toUserId,
        "toUser._id": fromUserId,
        "listing._id": listingId,
      },
    ],
  }).sort("createdAt");

  console.log(messages);

  messages = messages.map(getObjects).map(getMessages);

  res.send(messages);
});

router.delete("/chat/:id",auth, async (req, res) => {
  const message = await Message.findById(req.params.id);

  if (!message)
    return res.status(404).send("The message with the given ID was not found.");

  console.log(req.user);
  
  const user = await User.findById(req.user.userId);

  // await Favorite.deleteMany({
  //   "listing._id": listing._id,
  // });
  const user2Id =
    user._id === message.fromUser._id
      ? message.toUser._id
      : message.fromUser._id;

  messages = await Message.updateMany(
    {
      $or: [
        {
          "fromUser._id": user._id,
          "toUser._id": user2Id,
          "listing._id": message.listing._id,
        },
        {
          "fromUser._id": user2Id,
          "toUser._id": user._id,
          "listing._id": message.listing._id,
        },
      ],
    },
    {
      $pull: {
        participants: { name: user.name },
      },
    }
  );

  //cleaning
  await Message.deleteMany({ participants: { $exists: true, $eq: [] } });

  res.status(201).send(message);
});

module.exports = router;
