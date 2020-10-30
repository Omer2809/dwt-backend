const express = require("express");
const router = express.Router();
const Joi = require("joi");

const usersStore = require("../store/users");
const auth = require("../middleware/auth");
const validateWith = require("../middleware/validation");
const { User } = require("../models/user");

router.post(
  "/",
  [auth, validateWith({ token: Joi.string().required() })],
  async (req, res) => {
    let userr = await User.findById(req.user.userId);
    //   if (!user) return res.status(400).send("Invalid user.");
    // const user = usersStore.getUserById(req.user.userId);
    console.log(userr);
    let newUser = {
      name:userr.name,
      password:userr.password,
      email:userr.email,
      expoPushToken: req.body.token,
    };

    let user = await User.findByIdAndUpdate(userr._id, newUser, {
      new: true,
    });

    if (!user) return res.status(400).send({ error: "Invalid user." });
    // user.expoPushToken = req.body.token;
    console.log("User registered for notifications: ", user);
    res.status(201).send();
  }
);

module.exports = router;
