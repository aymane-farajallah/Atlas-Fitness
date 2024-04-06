const express = require("express");
const reportControllers = require("../controllers/reportcontrollers");
const {isAuthenticated} = require('../middlewares/protectRoute');
const checkUser = require("../middlewares/checkUser");
const reportRoute = express.Router();
reportRoute.use(express.json());


reportRoute.post('/report/:id', isAuthenticated, checkUser , reportControllers.createReport);

module.exports = reportRoute ;