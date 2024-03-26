const express = require("express");
const authRouter = express.Router();
const authController = require("../controllers/authcontrollersusers");

authRouter.post("/loginuser", authController.loginUser);
authRouter.post("/registeruser", authController.registerUser);
authRouter.patch("/reset/:id", authController.resetPassword);
authRouter.post("/forgot-password", authController.forgotPassword);

module.exports = authRouter;