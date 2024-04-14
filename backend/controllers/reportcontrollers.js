const jwt = require('jsonwebtoken');
const accessTokenSecret = 'secret';
const report = require("../models/report.js");

/**
 * @swagger
 * /api/reports:
 *   get:
 *     summary: Get All Reports (Admin Only)
 *     description: Retrieves a list of all report entries from the database. Requires admin access.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Reports retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: API request status (success)
 *                 TotalReports:
 *                   type: integer
 *                   description: Total number of reports in the database
 *                 Reports:
 *                   type: array
 *                   items:
 *                    $ref: '#/models/report'
 *       401:
 *         description: Unauthorized (requires admin access)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message indicating unauthorized access
 *       404:
 *         description: Reports not found (empty database)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message indicating no reports found
 *       500:
 *         description: Internal Server Error (error retrieving reports)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message indicating failed retrieval of reports
 */

/**
 * @swagger
 * /api/report-user/{id}:
 *   get:
 *     summary: Get Reports by User ID (Admin Only)
 *     description: Retrieves all report entries submitted by a specific user (identified by ID). Requires admin access.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Unique identifier of the user who submitted the reports.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Reports retrieved successfully (may be empty)
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                $ref: '#/models/report'
 *       401:
 *         description: Unauthorized (requires admin access)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message indicating unauthorized access
 *       500:
 *         description: Internal Server Error (error retrieving reports)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message indicating failed retrieval of reports
 */

/**
 * @swagger
 * /api/report-coach/{id}:
 *   get:
 *     summary: Get Reports by Coach ID (Admin Only)
 *     description: Retrieves all report entries submitted about a specific coach (identified by ID). Requires admin access.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Unique identifier of the coach reported on.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Reports retrieved successfully (may be empty)
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/models/report'
 *       401:
 *         description: Unauthorized (requires admin access)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message indicating unauthorized access
 *       500:
 *         description: Internal Server Error (error retrieving reports)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message indicating failed retrieval of reports
 */

/**
 * @swagger
 * /api/report/{coachId}:
 *   post:
 *     summary: Create Report (Authenticated User)
 *     description: Creates a new report entry for a specific coach. Requires authentication.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: coachId
 *         in: path
 *         required: true
 *         description: Unique identifier of the coach to report on.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Message:
 *                 type: string
 *                 description: Content of the report message
 *     responses:
 *       200:
 *         description: Report created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates successful report creation
 *                 message:
 *                   type: string
 *                   description: Success message (e.g., "Successfully reported")
 *       400:
 *         description: Bad Request (invalid report data or missing message)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message indicating invalid report data
 *       401:
 *         description: Unauthorized (requires valid access token)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message indicating unauthorized access
 *       500:
 *         description: Internal Server Error (error creating report)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message indicating failed report creation
 */

const getReports = async (req,res)=>{
  try {
      const Reports = await report.find();
      const reportCount = await report.countDocuments();
      if (!reportCount) {
          return res.status(404).json({ error: 'Reports not found' });
      }
      res.status(200).json({
          status:'success' ,
          TotalReports : reportCount,
          Reports : Reports
      })
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
}

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

// Get reports of a specific user
const getReportsByUserId = async (req, res) => {
  try {
    const userId = req.params.id;
    const reports = await report.find({ user_id: userId });
    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get reports of a coach
async function getReportsByCoachId(req, res) {
  try {
    const  coachId  = req.params.id;
    const reports = await report.find({ coach_id: coachId });
    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = { createReport, getReports, getReportsByUserId, getReportsByCoachId };