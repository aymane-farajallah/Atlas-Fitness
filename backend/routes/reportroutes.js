const express = require("express");
const reportControllers = require("../controllers/reportcontrollers");
const {isAuthenticated} = require('../middlewares/protectRoute');
const checkUser = require("../middlewares/checkUser");
const reportRoute = express.Router();
reportRoute.use(express.json());

reportRoute.get('/reports', isAuthenticated , reportControllers.getReports);
reportRoute.post('/report/:id', isAuthenticated, checkUser , reportControllers.createReport);
reportRoute.get('/report-user/:id', isAuthenticated,  reportControllers.getReportsByUserId);
reportRoute.get('/report-coach/:id', isAuthenticated,  reportControllers.getReportsByCoachId);

module.exports = reportRoute ;