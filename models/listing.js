const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 100,
    },
    description: {
      type: String,
      minlength: 2,
      maxlength: 200,
    },
    price: {
      type: Number,
      required: true,
      min: 1,
      max: 1000000,
    },
    days: {
      type: Number,
      // required: true,
      min: 0,
      max: 1000,
      default: 0,
    },
    bidding: {
      type: String,
      // required: true,
      default: "No",
    },
    bidder: {
      type: String,
      // required: true,
      default: "none",
    },
    categoryId: {
      type: new mongoose.Schema({
        label: {
          type: String,
        },
        icon: {
          type: String,
        },
        backgroundColor: {
          type: String,
        },
      }),
    },
    images: [
      {
        fileName: { type: String, default: "", trim: true },
      },
    ],
    location: {
      latitude: { type: Number },
      longitude: { type: Number },
    },
    added_by: {
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
        listingCount: {
          type: Number,
        },
      }),
    },
  },
  {
    timestamps: true,
  }
);

const Listing = mongoose.model("Listing", listingSchema);

exports.Listing = Listing;
