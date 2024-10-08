const User = require("../models/User");

async function createUser(req, res) {
  const { name, email, password } = req.body;

  try {
    const newUser = new User({ name, email, password });
    await newUser.save();
    res
      .status(201)
      .json({ message: "user created successfully", user: newUser });
  } catch (err) {
    res.status(500).json({ err: "Error at creating user" });
  }
}

model.exports = { createUser };
