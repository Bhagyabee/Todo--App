const express = require("express");
const { generateOtp, verifyOtp } = require("../middlewares/otp");

const router = express.Router();

router.get("/verify-otp", (req, res) => {
  const { email, username, password } = req.query; // Get parameters from query
  res.render("verifyOtp", { email, username, password }); // Pass them to the view
});
router.post("/generate-otp", generateOtp);
router.post("/verify-otp", verifyOtp);

module.exports = router;
