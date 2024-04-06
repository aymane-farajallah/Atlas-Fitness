const jwt = require('jsonwebtoken');
const accessTokenSecret = 'secret';
const report = require("../models/report.js");

const createReport = async(req,res)=>{
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token is missing or invalid' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, accessTokenSecret);

    const userId = decoded.id;
    const coachId = req.params.id;

     const newReport = new report({
        coach_id: coachId,
        user_id: userId,
        message: req.body.Message
    });

    await newReport.save()
    res.status(200).json({success: true , message: 'Successfully reported'}); 

  } catch (error) {
      if (error.name === 'ValidationError') {
          // Handle Mongoose errors
          return res.status(400).json({ error: error.message });
      } else {
          // Handle other errors
          res.status(500).json({ error: error.message });
      }
  }
}

// Get all reports
async function getReports(req, res) {
  try {
    const reports = await Report.find({});
    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Get reports by user ID
async function getReportsByUserId(req, res) {
  try {
    const { userId } = req.params;
    const reports = await Report.find({ user_id: userId });
    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Get reports by coach ID
async function getReportsByCoachId(req, res) {
  try {
    const { coachId } = req.params;
    const reports = await Report.find({ coach_id: coachId });
    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = { createReport, getReports, getReportsByUserId, getReportsByCoachId };