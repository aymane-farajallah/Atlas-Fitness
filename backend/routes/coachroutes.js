const express = require("express");
const coachcontrollers = require("../controllers/coachcontrollers");
const { createCoachValidationRules, validate } = require('../middlewares/coachValidator');
const coachroutes = express.Router();
const {isAuthenticated} = require('../middlewares/protectRoute');
const checkCoach = require("../middlewares/checkCoach");
const checkUser = require("../middlewares/checkUser");
const checkAdmin = require("../middlewares/checkAdmin");
coachroutes.use(express.json());

coachroutes.get('/getall', isAuthenticated, checkAdmin , coachcontrollers.getAllCoaches);
coachroutes.get('/getcoach/:id', isAuthenticated, checkCoach , checkAdmin , checkUser , coachcontrollers.getCoachById);
coachroutes.get('/filter', isAuthenticated, checkUser , checkAdmin , coachcontrollers.getCoachByFilter);
coachroutes.put('/putcoach/:id', isAuthenticated, createCoachValidationRules(), validate , checkCoach , checkAdmin , coachcontrollers.updateCoachById);
coachroutes.delete('/delete/:id', isAuthenticated, checkCoach , checkAdmin , coachcontrollers.deleteCoachById);


module.exports = coachroutes ;