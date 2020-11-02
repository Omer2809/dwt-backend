const Joi = require("joi");
const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    fromUser: {
      type: new mongoose.Schema({
        name: {
          type: String,
        },
        email: {
          type: String,
        },
        images: [
          {
            fileName: { type: String, default: "", trim: true },
          },
        ],
      }),
    },
    toUser: {
      type: new mongoose.Schema({
        name: {
          type: String,
        },
        email: {
          type: String,
        },
      }),
    },
    listing: {
      type: new mongoose.Schema({
        title: {
          type: String,
        },
        description: {
          type: String,
        },
        price: {
          type: Number,
        },
        images: [
          {
            url: { type: String },
            thumbnailUrl: { type: String },
          },
        ],
      }),
    },
    content: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Message = mongoose.model("Message", messageSchema);

function validateMessage(message) {
  const schema = Joi.object({
    fromUserId: Joi.objectId(),
    toUserId: Joi.objectId(),
    listingId: Joi.objectId(),
    content: Joi.string(),
  });

  return schema.validate(message);
}

exports.Message = Message;
exports.validate = validateMessage;
