const express = require("express");
const fs = require("fs");
const path = require("path");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const otpRoutes = require("./routes/otpRoutes");

const db = require("./config/db");
const todoRoutes = require("./routes/todoRoutes");
const authRoutes = require("./routes/auth");
const authMiddleWare = require("./middlewares/authMiddleware");
const User = require("./models/User");

const app = express();
const PORT = 8000;

app.use(cookieParser());
app.use(cors());
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

db();

app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => {
  res.render("Home");
});
app.use("/api/otp", otpRoutes);
app.get("/login", (req, res) => {
  console.log("user in login", req.user);
  res.render("login");
});
app.use("/api/auth", authRoutes);
app.use("/api/todo", todoRoutes);
app.use("/api/protected", authMiddleWare);

app.listen(PORT, () => {
  console.log(`server is running on ${PORT}`);
});
