const User  = require( "../models/user.js");
const Coach = require("../models/coach.js");
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

const isAuthenticated = (req, res, next) => {
    try {
        
        if (!req.headers.authorization) {
            throw new Error('Authorization header missing');
        }
        const token = req.headers.authorization.split(' ')[1];
        
       
        const decodedToken = jwt.verify(token, 'secret');     
        
        req.auth = {
            userId: decodedToken.id
        };

        
        next();
    } catch (error) {
        console.error(error);
        res.status(401).json({ message: "Not authorized" });
    }
};

module.exports = (requiredRoles) => {
  return (req, res, next) => {
      const userRole = req.user.role;
      if (requiredRoles.includes(userRole)) {
          next();
      } else {
          res.status(403).json({ message: "Access denied" });
      }
  };
};

module.exports = {
  protectRoute,
  isAuthenticated
};