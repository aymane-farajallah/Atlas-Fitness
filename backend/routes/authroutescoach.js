const express = require("express");
const authRouter = express.Router(); 
const authControllercoach = require("../controllers/authcontrollerscoach");
const checkCoach = require('../middlewares/checkCoach');
const {isAuthenticated} = require('../middlewares/protectRoute');
const multer = require('multer');
const {uploadCoach} = require('../config/multercoach');

authRouter.post("/logincoach", authControllercoach.logincoach);
authRouter.post("/registercoach", uploadCoach.single('image'), authControllercoach.registercoach);
authRouter.patch("/reset/:id", isAuthenticated , checkCoach , authControllercoach.resetPassword);
authRouter.post("/forgot-password", isAuthenticated ,  checkCoach , authControllercoach.forgotPassword);

module.exports = authRouter ;