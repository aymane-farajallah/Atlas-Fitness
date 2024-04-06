const express = require("express");
const coachcontrollers = require("../controllers/coachcontrollers");
const { createCoachValidationRules, validate } = require('../middlewares/coachValidator');
const coachroutes = express.Router();
const {isAuthenticated} = require('../middlewares/protectRoute');
const checkCoach = require("../middlewares/checkCoach");
const checkUser = require("../middlewares/checkUser");
coachroutes.use(express.json());

coachroutes.get('/getall', isAuthenticated, coachcontrollers.getAllCoaches);
coachroutes.get('/getcoach/:id', isAuthenticated, checkCoach , checkUser , coachcontrollers.getCoachById);
coachroutes.get('/filter', isAuthenticated, checkUser , coachcontrollers.getCoachByFilter);
coachroutes.put('/putcoach/:id', isAuthenticated, createCoachValidationRules(), validate , checkCoach , coachcontrollers.updateCoachById);
coachroutes.delete('/delete/:id', isAuthenticated, checkCoach , coachcontrollers.deleteCoachById);


module.exports = coachroutes ;