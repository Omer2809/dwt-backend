// const validateObjectId = require("../middleware/validateObjectId");
// const auth = require("../middleware/auth");
// const admin = require("../middleware/admin");
// const { Member, validate } = require("../models/member");
// const { Plan } = require("../models/plan");
// const { Lead } = require("../models/lead");
// const mongoose = require("mongoose");
// const express = require("express");
// const { User } = require("../models/user");
// const router = express.Router();

// router.get("/", [auth], async (req, res) => {
//   const members = await Member.find().sort("name");
//   res.send(members);
// });

// router.post("/", [auth], async (req, res) => {
//   const { error } = validate(req.body);
//   if (error) return res.status(400).send(error.details[0].message);

//   const plan = await Plan.findById(req.body.planId);
//   if (!plan) return res.status(400).send("Invalid plan.");
//   const user = await User.findById(req.body.userId);
//   if (!user) return res.status(400).send("Invalid user.");

//   let member = new Member({
//     name: req.body.name,
//     phone: req.body.phone,
//     email: req.body.email,
//     image: req.body.image,
//     date_of_birth: req.body.date_of_birth,
//     height: req.body.height,
//     weight: req.body.weight,
//     plan: {
//       _id: plan._id,
//       name: plan.name,
//       amount: plan.amount,
//     },
//     plan_start_date: req.body.plan_start_date,
//     plan_end_date: req.body.plan_end_date,
//     updated_by: {
//       _id: user._id,
//       name: user.name,
//       email: user.email,
//     },
//   });

//   const msg = `Dear Mr.${req.body.name},
// We heartly welcome you to our Gym (FitnessDominator), your "${
//     plan.name
//   }" Plan starts from ${new Date(req.body.plan_start_date).toLocaleDateString(
//     "it-IT"
//   )} and expires on ${new Date(req.body.plan_end_date).toLocaleDateString(
//     "it-IT"
//   )}.
    
//   Thanks Fitness Dominator Center`;
//   const num = req.body.phone;
//   const send = require("../startup/TextLocalAPI");
//   // send.sendsms(num, msg);

//   member = await member.save();
//   res.send(member);
// });

// router.put("/:id", [auth, validateObjectId], async (req, res) => {
//   const { error } = validate(req.body);
//   if (error) return res.status(400).send(error.details[0].message);

//   const plan = await Plan.findById(req.body.planId);
//   if (!plan) return res.status(400).send("Invalid plan.");

//   const user = await User.findById(req.body.userId);
//   if (!user) return res.status(400).send("Invalid user.");

//   const prevMember = await Member.findById(req.params.id);
//   if (!prevMember) return res.status(400).send("Invalid Member.");

//   const member = await Member.findByIdAndUpdate(
//     req.params.id,
//     {
//       name: req.body.name,
//       phone: req.body.phone,
//       email: req.body.email,
//       image: req.body.image,
//       date_of_birth: req.body.date_of_birth,
//       height: req.body.height,
//       weight: req.body.weight,
//       plan: {
//         _id: plan._id,
//         name: plan.name,
//         amount: plan.amount,
//       },
//       plan_start_date: req.body.plan_start_date,
//       plan_end_date: req.body.plan_end_date,
//       updated_by: {
//         _id: user._id,
//         name: user.name,
//         email: user.email,
//       },
//     },
//     {
//       new: true,
//     }
//   );

//   if (!member)
//     return res.status(404).send("The member with the given ID was not found.");

//   if (new Date(prevMember.plan_end_date).getTime()
//     !== new Date(member.plan_end_date).getTime()) {
//       const msg = `Dear Mr.${req.body.name},
//       We heartly welcome you to our Gym (FitnessDominator), your "${
//           plan.name
//         }" Plan starts from ${new Date(req.body.plan_start_date).toLocaleDateString(
//           "it-IT"
//         )} and expires on ${new Date(req.body.plan_end_date).toLocaleDateString(
//           "it-IT"
//         )}.
          
//         Thanks Fitness Dominator Center`;
//         const num = req.body.phone;
//         const send = require("../startup/TextLocalAPI");
//         // send.sendsms(num, msg);
    
//     console.log("Thanks for renewing your plan....");
    
//   }
  
//   res.send(member);
// });

// router.delete("/:id", [auth, validateObjectId], async (req, res) => {
//   const member = await Member.findByIdAndRemove(req.params.id);

//   if (!member)
//     return res.status(404).send("The member with the given ID was not found.");

//   res.send(member);
// });

// router.get("/memberCount", [auth], async (req, res) => {
//   const day = 60 * 60 * 24 * 1000;

//   const totalCount = await Member.find().countDocuments();
//   const activeCount = await Member.find({
//     plan_end_date: { $gte: new Date(new Date().getTime() - day) },
//   }).countDocuments();
//   const inactiveCount = totalCount - activeCount;

//   res.send({ activeCount, inactiveCount });
// });

// router.get("/:id", [auth, validateObjectId], async (req, res) => {
//   const member = await Member.findById(req.params.id);

//   if (!member)
//     return res.status(404).send("The member with the given ID was not found.");

//   res.send(member);
// });

// module.exports = router;
