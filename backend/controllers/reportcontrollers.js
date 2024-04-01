import Report from "../models/report.js";

// Create a new report
async function createReport(req, res) {
  try {
    const { userId, coachId, message, date } = req.body;

    const newReport = new Report({
      user_id: userId,
      coach_id: coachId,
      message: message,
      date: date || new Date(), // Use provided date or current date
    });

    await newReport.save();

    res.status(201).json(newReport);
  } catch (error) {
    res.status(500).json({ error: error.message });
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

export { createReport, getReports, getReportsByUserId, getReportsByCoachId };