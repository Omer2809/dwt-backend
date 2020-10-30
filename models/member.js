// const Joi = require("joi");
// const mongoose = require("mongoose");

// const { planSchema } = require("./plan");

// const memberSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//       minlength: 4,
//       maxlength: 50,
//     },
//     phone: {
//       type: String,
//       required: true,
//       minlength: 5,
//       maxlength: 50,
//     },
//     email: {
//       type: String,
//       minlength: 5,
//       maxlength: 255,
//     },
//     image: {
//       type: String,
//     },
//     date_of_birth: {
//       type: Date,
//     },
//     height: {
//       type: String,
//       minlength: 0,
//       maxlength: 10,
//     },
//     weight: {
//       type: String,
//       minlength: 0,
//       maxlength: 10,
//     },
//     plan: {
//       type: planSchema,
//       required: true,
//     },
//     plan_start_date: {
//       type: Date,
//       required: true,
//     },
//     plan_end_date: {
//       type: Date,
//       required: true,
//     },
//     updated_by: {
//       type: new mongoose.Schema({
//         name: {
//           type: String,
//           required: true,
//           minlength: 5,
//           maxlength: 50,
//         },
//         email: {
//           type: String,
//           required: true,
//           minlength: 5,
//           maxlength: 255,
//         },
//       }),
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// const Member = mongoose.model("Member", memberSchema);

// function validateMember(member) {
//   const schema = Joi.object({
//     name: Joi.string().min(4).required().max(50),
//     phone: Joi.string().min(5).max(50).required(),
//     email: Joi.string().min(5).max(255).email(),
//     image: Joi.string(),
//     date_of_birth: Joi.date(),
//     height: Joi.string().min(0).max(10),
//     weight: Joi.string().min(0).max(10),
//     planId: Joi.objectId().required(),
//     plan_start_date: Joi.date().required(),
//     plan_end_date: Joi.date().greater(Joi.ref("plan_start_date")).required(),
//     userId: Joi.objectId().required(),
//   });

//   return schema.validate(member);
// }

// exports.Member = Member;
// exports.validate = validateMember;
