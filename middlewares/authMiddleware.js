const jwt = require("jsonwebtoken");
const JWT_SECRET = "secret";

const authMiddleWare = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    req.user = decoded;
    console.log("user in authm", req.user);

    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid token." });
  }
};

module.exports = authMiddleWare;
