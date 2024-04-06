const express = require("express");
const usercontrollers = require("../controllers/usercontrollers");
const { createCoachValidationRules, validate } = require('../middlewares/coachValidator');
const checkUser = require('../middlewares/checkUser');
const {isAuthenticated} = require('../middlewares/protectRoute');
const checkAdmin = require("../middlewares/checkAdmin");
const userroutes = express.Router();
userroutes.use(express.json());

userroutes.get('/getall', isAuthenticated, checkAdmin ,  usercontrollers.getAllusers);
userroutes.get('/getuser/:id', isAuthenticated, checkUser , checkAdmin , usercontrollers.getuserById);
userroutes.get('/filter', isAuthenticated, checkAdmin , usercontrollers.getuserByFilter);
userroutes.put('/putuser/:id', isAuthenticated, checkUser , checkAdmin , createCoachValidationRules(), validate , usercontrollers.updateuserById);
userroutes.delete('/delete/:id', isAuthenticated, checkUser , checkAdmin , usercontrollers.deleteuserById);


module.exports = userroutes ;