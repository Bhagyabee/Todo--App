const cors = require("cors");
const nodemailer = require("nodemailer");
const otpGenerator = require("otp-generator");
const OTP = require("../models/otp");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const generateOtp = async (req, res) => {
  const { email, username, password } = req.body;
  console.log(email);
  const existUser = await User.findOne({ email });
  if (existUser) {
    return res.render("already");
  }

  const otp = otpGenerator.generate(6, {
    digits: true,
    alphabets: false,
    upperCase: false,
    specialChars: false,
  });

  try {
    await OTP.create({ email, otp });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "bhagyabeeb@gmail.com",
        pass: "ryunkpmqcxtxxjrt",
      },
    });

    await transporter.sendMail({
      from: "bhagyabeeb@gmail.com",
      to: email,
      subject: "OTP Verification",
      text: `Your OTP for verification is ${otp}`,
    });

    res.render("verifyOtp", { email, username, password });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error sending OTP");
  }
};

const verifyOtp = async (req, res) => {
  const { email, otp, password, username } = req.body;
  console.log(email, otp, password, username);
  try {
    const otpRecord = await OTP.findOne({ email, otp }).exec();

    if (!otpRecord) {
      return res.render("invalidOtp.ejs");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ username, email, password: hashedPassword });

    res.redirect("/api/auth/login");
  } catch (err) {
    console.log(err);
    res.status(500).send("Error Verifying OTP");
  }
};

module.exports = {
  generateOtp,
  verifyOtp,
};
