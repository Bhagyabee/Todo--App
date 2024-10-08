const express = require("express");
const authMiddleWare = require("../middlewares/authMiddleware");
const User = require("../models/User");
const router = express.Router();
const { signUp, login, logout } = require("../controllers/authControllers");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/; // Accept only jpg, jpeg, png
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb("Error: Only images are allowed!");
    }
  },
});

router.post("/upload-multiple", upload.array("files", 10), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).send("No files uploaded.");
  }
  // Handle multiple files
  res.send("Files uploaded successfully.");
});

router.get("/signUp", (req, res) => {
  res.render("signUp");
});

router.get("/profile", authMiddleWare, async (req, res) => {
  const _id = req.user.userId;
  const user = await User.findOne({ _id });
  console.log("user in profile", user);
  const defaultProfilePic = "/uploads/IMG-20220410-WA0004.jpg"; // Default image
  const profilePicUrl =
    req.user && user.profilePic
      ? user.profilePic // Profile picture if user is logged in
      : defaultProfilePic; // Default avatar
  console.log(profilePicUrl);
  res.render("profile", { profilePicUrl });
});

router.post(
  "/upload",
  authMiddleWare,
  upload.single("profilePic"),
  async (req, res) => {
    const _id = req.user.userId;

    if (!req.file) {
      return res.status(400).send("No file uploaded.");
    }
    const profilePicUrl = `/uploads/${req.file.filename}`;

    const user = await User.findOne({ _id });

    user.profilePic = profilePicUrl;
    await user.save();
    console.log("user uodated at profile", user);
    console.log("user after pp update", user);
    res.render("profile", { profilePicUrl });
  }
);
router.get("/login", (req, res) => {
  console.log("user in login", req.user);
  res.render("login");
});
router.post("/signUp", signUp);
router.post("/login", login);
router.get("/logout", logout);

module.exports = router;
