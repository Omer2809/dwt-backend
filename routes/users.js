const express = require("express");
const router = express.Router();
const { User, validate } = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Listing } = require("../models/listing");
const multer = require("multer");
const validateObjectId = require("../middleware/validateObjectId");
const config = require("config");
const imageResize = require("../middleware/imageResize");

const upload = multer({
  dest: "uploads/",
  limits: { fieldSize: 25 * 1024 * 1024 },
});

router.get("/", async (req, res) => {
  const users = await User.find().sort("name");
  res.send(users);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user)
    return res.status(400).send("A user with the given email already exists.");

  const { name, email, password } = req.body;
  user = new User({ name, email, password });

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  await user.save();

  const token = jwt.sign(
    { userId: user.id, name: user.name, email: user.email },
    "jwtPrivateKey"
  );

  res.status(201).send(token);
});

router.get("/:id", async (req, res) => {
  // const userId = parseInt(req.params.id);
  const user = await User.findById(req.params.id);
  if (!user) return res.status(400).send("Invalid user.");

  // const listings = listingsStore.filterListings(
  //   listing => listing.userId === userId
  // );

  const listings = await Listing.find({
    added_by: { _id: user._id },
  }).countDocuments();

  res.send({
    id: user.id,
    name: user.name,
    email: user.email,
    listings,
  });
});

router.put(
  "/:id",
  [
    validateObjectId,
    upload.array("images", config.get("maxImageCount")),
    imageResize,
  ],
  async (req, res) => {
    const userStored = await User.findById(req.params.id);
    if (!userStored) return res.status(400).send("Invalid user.");

    let user = {
      name: userStored.name,
      email: userStored.email,
      password: userStored.password,
    };

    user.profileImage = req.images.map((fileName) => ({ fileName: fileName }));

    user = await User.findByIdAndUpdate(req.params.id, user, {
      new: true,
    });

    console.log("user after put:", user);

    res.status(201).send(user);
  }
);

router.put("/deleteProfileImage/:id", validateObjectId, async (req, res) => {
  const userStored = await User.findById(req.params.id);
  if (!userStored) return res.status(400).send("Invalid user.");

  let user = {
    name: userStored.name,
    email: userStored.email,
    password: userStored.password,
  };

  user.profileImage = [];

  user = await User.findByIdAndUpdate(req.params.id, user, {
    new: true,
  });

  console.log("user after delte profile image:", user);

  res.status(201).send(user);
});

module.exports = router;
