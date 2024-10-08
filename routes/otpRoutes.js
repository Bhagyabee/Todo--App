const express = require("express");
const { generateOtp, verifyOtp } = require("../middlewares/otp");

const router = express.Router();

router.post("/generate-otp", generateOtp);
router.post("/verify-otp", verifyOtp);

module.exports = router;
