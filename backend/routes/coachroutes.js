const express = require("express");
const coachcontrollers = require("../controllers/coachcontrollers");
const { createCoachValidationRules, validate } = require('../middlewares/coachValidator');
const coachroutes = express.Router();
const {isAuthenticated} = require('../middlewares/protectRoute');
const checkUserAdmin = require('../middlewares/checkUserAdmin');
const checkCoachAdmin = require('../middlewares/checkCoachAdmin');
const checkAdmin = require("../middlewares/checkAdmin");
coachroutes.use(express.json());

coachroutes.get('/getallcoaches', isAuthenticated, checkAdmin , coachcontrollers.getAllCoaches);
coachroutes.get('/getcoach/:id', isAuthenticated, coachcontrollers.getCoachById);
coachroutes.get('/filtercoach', isAuthenticated, checkUserAdmin , coachcontrollers.getCoachByFilter);
coachroutes.put('/putcoach/:id', isAuthenticated, createCoachValidationRules(), validate , checkCoachAdmin , coachcontrollers.updateCoachById);
coachroutes.delete('/deletecoach/:id', isAuthenticated, checkCoachAdmin , coachcontrollers.deleteCoachById);


module.exports = coachroutes ;