const express = require("express");
const coachcontrollers = require("../controllers/coachcontrollers");
const { createCoachValidationRules, validate } = require('../middlewares/coachValidator');
const coachroutes = express.Router();
coachroutes.use(express.json());

coachroutes.get('/getall', coachcontrollers.getAllCoaches);
coachroutes.get('/getcoach/:id', coachcontrollers.getCoachById);
coachroutes.get('/filter', coachcontrollers.getCoachByFilter);
coachroutes.put('/putcoach/:id', createCoachValidationRules(), validate , coachcontrollers.updateCoachById);
coachroutes.delete('/delete/:id', coachcontrollers.deleteCoachById);


module.exports = coachroutes ;