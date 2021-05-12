const express = require("express");
const router = express.Router();
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const multer = require("multer");

const validateWith = require("../middleware/validation");
const auth = require("../middleware/auth");
const imageResize = require("../middleware/imageResize");
const delay = require("../middleware/delay");
const listingMapper = require("../mappers/listings");
const config = require("config");
const { Listing } = require("../models/listing");
const validateObjectId = require("../middleware/validateObjectId");
const { User } = require("../models/user");
const { Category } = require("../models/categories");
const { Favorite } = require("../models/favorite");

const upload = multer({
  dest: "uploads/",
  limits: { fieldSize: 25 * 1024 * 1024 },
});

const schema = {
  title: Joi.string().required(),
  description: Joi.string().allow(""),
  bidding: Joi.string().allow(""),
  bidder: Joi.string().allow(""),
  price: Joi.number().required().min(1),
  days: Joi.number(),
  categoryId: Joi.objectId(),
  userId: Joi.objectId(),
  // images:Joi.array().items(Joi.string()).optional(),
  images: Joi.string().allow(""),
  location: Joi.object({
    latitude: Joi.number(),
    longitude: Joi.number(),
  }).optional(),
  oldImages: Joi.array().items(Joi.string()).optional(),
};

function getObjects(item) {
  return item._doc;
}
function getImages(item) {
  return item.added_by;
}

function getlistingss(item) {
  return { ...item, added_by: listingMapper(item.added_by._doc) };
}

router.get("/", async (req, res) => {
  let listings = await Listing.find().sort("-createdAt");
  listings = listings.map(getObjects).map(listingMapper).map(getlistingss);
  res.send(listings);
});

router.get("/:id", validateObjectId, async (req, res) => {
  const listing = await Listing.findById(req.params.id);

  if (!listing)
    return res.status(404).send("The listing with the given ID was not found.");

  let resource = listingMapper(listing._doc);
  resource.added_by = listingMapper(resource.added_by._doc);
  res.send(resource);
});

router.post(
  "/",
  [
    // Order of these middleware matters.
    // "upload" should come before other "validate" because we have to handle
    // multi-part form data. Once the upload middleware from multer applied,
    // request.body will be populated and we can validate it. This means
    // if the request is invalid, we'll end up with one or more image files
    // stored in the uploads folder. We'll need to clean up this folder
    // using a separate process.
    // auth,
    upload.array("images", config.get("maxImageCount")),
    validateWith(schema),
    imageResize,
  ],
  async (req, res) => {
    const category = await Category.findById(req.body.categoryId);
    if (!category) return res.status(400).send("Invalid category.");

    const user = await User.findById(req.body.userId);
    if (!user) return res.status(400).send("Invalid user.");

    let count = await Listing.find({
      "added_by._id": user._id,
    }).countDocuments();

    let listing = {
      title: req.body.title,
      price: parseFloat(req.body.price),
      categoryId: {
        _id: category._id,
        label: category.label,
        icon: category.icon,
        backgroundColor: category.backgroundColor,
      },
      description: req.body.description,
      bidding: req.body.bidding,
      added_by: {
        _id: user._id,
        name: user.name,
        email: user.email,
        images: user.profileImage,
        listingCount: count + 1,
      },
    };

    if (req.body.days) listing.days = req.body.days;


    console.log("req.images:",req.images);
    listing.images = req.images.map((fileName) => ({ fileName: fileName }));
    console.log("listing.images:",listing.images);

    if (req.body.location) listing.location = JSON.parse(req.body.location);

    listing = new Listing(listing);
    await listing.save();

    await Listing.updateMany(
      {
        "added_by._id": user._id,
      },
      {
        $set: {
          "added_by.listingCount": count + 1,
        },
      }
    );

    console.log("IN post last:" + listing);
    // const result = await Listing.insertMany(listingsArray, { ordered: true });
    res.status(201).send(listing);
  }
);

router.put(
  "/:id",
  [
    validateObjectId,
    upload.array("images", config.get("maxImageCount")),
    validateWith(schema),
    imageResize,
  ],
  async (req, res) => {
    console.log("in put req body", req.body);

    const category = await Category.findById(req.body.categoryId);
    if (!category) return res.status(400).send("Invalid category.");

    const user = await User.findById(req.body.userId);
    if (!user) return res.status(400).send("Invalid user.");

    let count = await Listing.find({
      "added_by._id": user._id,
    }).countDocuments();

    let listing = {
      title: req.body.title,
      price: parseFloat(req.body.price),
      categoryId: {
        _id: category._id,
        label: category.label,
        icon: category.icon,
        backgroundColor: category.backgroundColor,
      },
      description: req.body.description,
      bidding: req.body.bidding,
      bidder: req.body.bidder,
      days: req.body.days,
      added_by: {
        _id: user._id,
        name: user.name,
        email: user.email,
        images: user.profileImage,
        listingCount: count,
      },
    };
    console.log(req.body.oldImages);
    console.log(JSON.parse(req.body.oldImages));
    console.log(req.images);
    
    listing.images = req.body.oldImages
    ? req.images
    .concat(JSON.parse(req.body.oldImages))
    .map((fileName) => ({ fileName: fileName }))
    : req.images.map((fileName) => ({ fileName: fileName }));
    
    console.log(listing.images);

    if (req.body.location) listing.location = JSON.parse(req.body.location);

    listing = await Listing.findByIdAndUpdate(req.params.id, listing, {
      new: true,
    });

    console.log("IN put last:" + listing);
    res.status(201).send(listing);
  }
);

router.delete("/:id", async (req, res) => {
  const listing = await Listing.findByIdAndRemove(req.params.id);

  if (!listing)
    return res.status(404).send("The listing with the given ID was not found.");

  await Favorite.deleteMany({
    "listing._id": listing._id,
  });

  res.status(201).send(listing);
});

router.post("/updatePrice", auth, async (req, res) => {
  const { listingId, userId, bid } = req.body;
  console.log("update bid req boday", req.body);

  let listing = await Listing.findById(listingId);
  if (!listing) return res.status(400).send("Invalid listing.");

  const user = await User.findById(userId);
  if (!user) return res.status(400).send("Invalid user.");

  listing = await Listing.update(
    {
      _id: listing._id,
    },
    {
      $set: {
        price: bid,
        bidder: user.name,
      },
    }
  );

  console.log("updated listing:", listing);
  res.status(201).send();
});

module.exports = router;
