const express = require("express");
const authRouter = express.Router();
const authController = require("../controllers/authcontrollersusers");
const checkUser = require('../middlewares/checkUser');
const {isAuthenticated} = require('../middlewares/protectRoute');
const multer = require('multer');
const {uploaduser} = require('../config/multeruser');

authRouter.post("/loginuser", authController.loginUser);
authRouter.post("/registeruser", uploaduser.single('image'), authController.registerUser);
authRouter.patch("/reset-U/:id", isAuthenticated , checkUser, authController.resetPassword);
authRouter.post("/U-forgot-password", isAuthenticated ,  checkUser ,authController.forgotPassword);

module.exports = authRouter;