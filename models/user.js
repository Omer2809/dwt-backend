// const config = require("config");
// const jwt = require("jsonwebtoken");
const Joi = require("joi");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 255,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 1024,
    },
    profileImage: [
      {
        fileName: { type: String, default: "", trim: true },
      },
    ],
    expoPushToken: {
      type: String,
    },
    isAdmin: Boolean,
  },
  {
    timestamps: true,
  }
);

// userSchema.methods.generateAuthToken = function () {
//   const token = jwt.sign(
//     {
//       _id: this._id,
//       isAdmin: this.isAdmin,
//       name: this.name,
//       email: this.email,
//     },
//     config.get("jwtPrivateKey")
//   );
//   return token;
// };

const User = mongoose.model("User", userSchema);

function validateUser(user) {
  const schema = Joi.object({
    name: Joi.string().min(2).max(50).required(),
    isAdmin: Joi.boolean(),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
    profileImage: Joi.array().items(Joi.string()).optional(),
  });

  return schema.validate(user);
}

exports.User = User;
exports.validate = validateUser;
