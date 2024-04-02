const User  = require( "../models/user.js");
const Coach = require("../models/coach.js"); // Assuming you have a Coach model
const jwt = require("jsonwebtoken");

const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if user or coach based on decoded token (adapt based on your token structure)
    let user;
    if (decoded.type === "user") {
      user = await User.findById(decoded.userId).select("-password");
    } else if (decoded.type === "coach") {
      user = await Coach.findById(decoded.userId).select("-password");
    } else {
      throw new Error("Invalid user type in token");
    }

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.log("Error in protectRoute: ", err.message);
  }
};

module.exports = protectRoute;