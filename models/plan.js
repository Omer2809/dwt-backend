// const Joi = require("joi");
// const mongoose = require("mongoose");

// const planSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//       minlength: 4,
//       maxlength: 50,
//     },
//     amount: {
//       type: Number,
//       required: true,
//       min: 0,
//       max: 1000000,
//     },
//     isActive: Boolean,
//   },
//   {
//     timestamps: true,
//   }
// );

// const Plan = mongoose.model("Plan", planSchema);

// function validatePlan(plan) {
//   const schema = Joi.object({
//     name: Joi.string().min(4).max(50).required(),
//     amount: Joi.number().min(0).max(1000000).required(),
//     isActive: Joi.boolean().required(),
//   });

//   return schema.validate(plan);
// }

// exports.planSchema = planSchema;
// exports.Plan = Plan;
// exports.validate = validatePlan;
