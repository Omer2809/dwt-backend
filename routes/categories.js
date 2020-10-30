const express = require("express");
const validateObjectId = require("../middleware/validateObjectId");
const { Category } = require("../models/categories");
const router = express.Router();

router.get("/", async (req, res) => {
  let categories = await Category.find().sort("label");
  // const result = await Category.insertMany(categoriesArray, { ordered: true });
  res.send(categories);
});

router.get("/:id", validateObjectId, async (req, res) => {
  // const listing = store.getListing(parseInt(req.params.id));
  const category = await Category.findById(req.params.id);

  if (!category)
    return res.status(404).send("The category with the given ID was not found.");

  res.send(category);
});

module.exports = router;
