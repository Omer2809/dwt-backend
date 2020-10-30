const express = require("express");
const categories = require("../routes/categories");
const listings = require("../routes/listings");
const users = require("../routes/users");
// const user = require("../routes/user");
const auth = require("../routes/auth");
const my = require("../routes/my");
const messages = require("../routes/messages");
const expoPushTokens = require("../routes/expoPushTokens");
const error = require("../middleware/error");

const app = express();
const allowAccess = require("./allowAccess");

module.exports = function (app) {
  app.use(express.json());
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Credentials", true);
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  });

  app.use(express.static("public"));
  app.use(express.json());

  app.use("/api/categories", categories);
  app.use("/api/listings", listings);
  // app.use("/api/user", user);
  app.use("/api/users", users);
  app.use("/api/auth", auth);
  app.use("/api/my", my);
  app.use("/api/expoPushTokens", expoPushTokens);
  app.use("/api/messages", messages);

  app.use(error);
};
