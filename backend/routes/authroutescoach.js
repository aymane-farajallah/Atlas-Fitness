const express = require("express");
const authRouter = express.Router();
const authControllercoach = require("../controllers/authcontrollerscoach");

authRouter.post("/logincoach", authControllercoach.logincoach);
authRouter.post("/registercoach", authControllercoach.registercoach);
authRouter.patch("/reset/:id", authControllercoach.resetPassword);
authRouter.post("/forgot-password", authControllercoach.forgotPassword);

module.exports = authRouter;