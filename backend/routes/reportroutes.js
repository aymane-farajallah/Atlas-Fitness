const express = require("express");
const reportControllers = require("../controllers/reportcontrollers");
const {isAuthenticated} = require('../middlewares/protectRoute');
const checkAdmin = require("../middlewares/checkAdmin");
const reportRoute = express.Router();
reportRoute.use(express.json());

reportRoute.get('/reports', isAuthenticated , checkAdmin , reportControllers.getReports);
reportRoute.post('/report/:id', isAuthenticated, reportControllers.createReport);
reportRoute.get('/report-user/:id', isAuthenticated, checkAdmin ,  reportControllers.getReportsByUserId);
reportRoute.get('/report-coach/:id', isAuthenticated, checkAdmin ,  reportControllers.getReportsByCoachId);

module.exports = reportRoute ;