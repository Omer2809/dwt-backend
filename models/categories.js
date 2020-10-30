const Joi = require("joi");
const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    label: {
      type: String,
    },
    icon: {
      type: String,
    },
    backgroundColor: {
      type: String,
    },
    color: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Category = mongoose.model("Category", categorySchema);

 function validateCategory(category) {
    const schema = Joi.object({
      label: Joi.string(),
      icon: Joi.string(),
      backgroundColor: Joi.string(),
      color: Joi.string(),
    });
  
    return schema.valiCategory(category);
  }
  
 exports.Category = Category;
  exports.validate = validateCategory;
