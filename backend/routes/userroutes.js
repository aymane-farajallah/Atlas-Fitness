const express = require("express");
const usercontrollers = require("../controllers/usercontrollers");
const { createCoachValidationRules, validate } = require('../middlewares/coachValidator');
const checkUser = require('../middlewares/checkUser');
const {isAuthenticated} = require('../middlewares/protectRoute');
const userroutes = express.Router();
userroutes.use(express.json());

userroutes.get('/getall', isAuthenticated,  usercontrollers.getAllusers);
userroutes.get('/getuser/:id', isAuthenticated, checkUser , usercontrollers.getuserById);
userroutes.get('/filter', isAuthenticated, usercontrollers.getuserByFilter);
userroutes.put('/putuser/:id', isAuthenticated, checkUser , createCoachValidationRules(), validate , usercontrollers.updateuserById);
userroutes.delete('/delete/:id', isAuthenticated, checkUser , usercontrollers.deleteuserById);


module.exports = userroutes ;