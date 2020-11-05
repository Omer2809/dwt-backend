const Joi = require("joi");
const mongoose = require("mongoose");

const favoriteSchema = new mongoose.Schema(
  {
    favorited_by: {
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
  },
  {
    timestamps: true,
  }
);

const Favorite = mongoose.model("Favorite", favoriteSchema);

function validateFavorite(favorite) {
  const schema = Joi.object({
    userId: Joi.objectId(),
    listingId: Joi.objectId(),
  });

  return schema.validate(favorite);
}

exports.Favorite = Favorite;
exports.validate = validateFavorite;




