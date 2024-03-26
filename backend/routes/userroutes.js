const express = require("express");
const usercontrollers = require("../controllers/usercontrollers");
const { createCoachValidationRules, validate } = require('../middlewares/coachValidator');
const userroutes = express.Router();
userroutes.use(express.json());

userroutes.get('/getall', usercontrollers.getAllusers);
userroutes.get('/getuser/:id', usercontrollers.getuserById);
userroutes.get('/filter', usercontrollers.getuserByFilter);
userroutes.put('/putuser/:id', createCoachValidationRules(), validate , usercontrollers.updateuserById);
userroutes.delete('/delete/:id', usercontrollers.deleteuserById);


module.exports = userroutes ;