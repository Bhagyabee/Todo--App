const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const JWT_SECRET = "secret";

const signUp = async (req, res) => {
  console.log(req.body);
  const { username, email, password } = req.body;

  try {
    //check if user already exist

    const existUser = await User.findOne({ email });
    if (existUser) {
      return res.status(400).json({ message: " user already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ username, email, password: hashedPassword });

    await user.save();

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "1h",
    });
    res.cookie("token", token, { httpOnly: true, secure: true });
    res.redirect("/api/auth/login");
  } catch (error) {
    console.log("Error in registering a new user");
  }
};

const login = async (req, res) => {
  const { username, email, password } = req.body;
  console.log("login function");

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    //check passwords

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    //send token to client
    req.user = user;
    console.log(user);
    const token = jwt.sign({ userId: user._id }, JWT_SECRET);
    res.cookie("token", token, { httpOnly: true, secure: true });
    res.redirect("/api/todo/");
  } catch (error) {
    console.log("error in login");
  }
};

const logout = (req, res) => {
  res.clearCookie("token");
  console.log("Log out");
  res.redirect("/");
};

module.exports = {
  signUp,
  login,
  logout,
};
