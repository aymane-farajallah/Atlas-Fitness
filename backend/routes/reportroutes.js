const express = require("express");
const reportControllers = require("../controllers/reportcontrollers");
const {isAuthenticated} = require('../middlewares/protectRoute');
const reportRoute = express.Router();
reportRoute.use(express.json());


reportRoute.post('/report/:id', isAuthenticated, reportControllers.createReport);

module.exports = reportRoute ;