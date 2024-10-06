const express = require("express");
const multer = require('multer');
const authRouter = express.Router(); 
const authControllercoach = require("../controllers/authcontrollerscoach");
const checkCoach = require('../middlewares/checkCoach');
const { isAuthenticated } = require('../middlewares/protectRoute');
const uploadCoach = require('../config/multercoach');

const cpUpload = uploadCoach.fields([
    { name: 'image', maxCount: 1 },
    { name: 'cin', maxCount: 1 },
    { name: 'cv', maxCount: 1 }
]);

authRouter.post("/logincoach", authControllercoach.logincoach);
authRouter.post("/registercoach", cpUpload, authControllercoach.registercoach);
authRouter.patch("/reset/:id", isAuthenticated, checkCoach, authControllercoach.resetPassword);
authRouter.post("/forgot-password", isAuthenticated, checkCoach, authControllercoach.forgotPassword);

module.exports = authRouter;