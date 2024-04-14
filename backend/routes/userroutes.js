const express = require("express");
const usercontrollers = require("../controllers/usercontrollers");
const { createCoachValidationRules, validate } = require('../middlewares/coachValidator');
const checkUser = require('../middlewares/checkUser');
const {isAuthenticated} = require('../middlewares/protectRoute');
const checkAdmin = require("../middlewares/checkAdmin");
const checkUserAdmin = require('../middlewares/checkUserAdmin');
const userroutes = express.Router();
userroutes.use(express.json());

userroutes.get('/getall', isAuthenticated, checkAdmin ,  usercontrollers.getAllusers);
userroutes.get('/getuser/:id', isAuthenticated, checkUserAdmin , usercontrollers.getuserById);
userroutes.get('/filter', isAuthenticated, checkUserAdmin , usercontrollers.getuserByFilter);
userroutes.put('/putuser/:id', isAuthenticated, checkUser , createCoachValidationRules(), validate , usercontrollers.updateuserById);
userroutes.delete('/delete/:id', isAuthenticated, checkUserAdmin , usercontrollers.deleteuserById);


module.exports = userroutes ;