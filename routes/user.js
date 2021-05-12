const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");



router.get("/:id",async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(400).send("Invalid user.");
  
  const listings = await Listing.find({
        added_by: { _id:user._id },
      }).countDocuments();

  res.send({
    id: user.id,
    name: user.name,
    email: user.email,
    image:profileImage,
    listings 
  });
});
module.exports = router;
