import jwt from "jsonwebtoken";
import user from "../models/user.js"; 
const isAdmin = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_TOKEN_VERIFY);

      req.user = await user.findById(decoded.id).select("-password");

      // Check if the user is an admin
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Forbidden: Not an admin" });
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
};

export { isAdmin };