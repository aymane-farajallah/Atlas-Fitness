const review = require("../models/review");
const jwt = require('jsonwebtoken');

/**
 * @swagger
 * /api/review:
 *   get:
 *     summary: Get All Reviews (Admin Only)
 *     description: Retrieves a list of all review entries from the database, optionally filtered by user ID (requires admin access).
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: userId (optional)
 *         in: query
 *         description: Unique identifier of the user who submitted the reviews (for filtering).
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Reviews retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: API request status (success)
 *                 TotalReviews:
 *                   type: integer
 *                   description: Total number of reviews in the database (or filtered by userId)
 *                 Reviews:
 *                   type: array
 *                   items:
 *                     $ref: '#/models/review'
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
 *         description: Internal Server Error (error retrieving reviews)
 *         content:
 *           application/json:
 *             schema:
 *               type: object:
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message indicating failed retrieval of reviews
 */

/**
 * @swagger
 * /api/review/{id}:
 *   post:
 *     summary: Create Review (Authenticated User)
 *     description: Creates a new review entry for a specific coach. Requires authentication.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Unique identifier of the coach to be reviewed.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: integer
 *                 required: true
 *                 description: Rating given to the coach (1-5)
 *               comment:
 *                 type: string
 *                 required: true
 *                 description: User's comment about the coach
 *     responses:
 *       200:
 *         description: Review created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates successful review creation
 *                 message:
 *                   type: string
 *                   description: Success message (e.g., "Successfully reviewed")
 *       400:
 *         description: Bad Request (invalid review data, missing rating or comment, or rating out of range)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message indicating invalid review data
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
 *         description: Internal Server Error (error creating review)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message indicating failed review creation
 */

/**
 * @swagger
 * /api/review/{id}:
 *   post:
 *     summary: Create Review (Authenticated User)
 *     description: Creates a new review entry for a specific coach. Requires authentication.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Unique identifier of the coach to be reviewed.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: integer
 *                 required: true
 *                 description: Rating given to the coach (1-5)
 *               comment:
 *                 type: string
 *                 required: true
 *                 description: User's comment about the coach
 *     responses:
 *       200:
 *         description: Review created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates successful review creation
 *                 message:
 *                   type: string
 *                   description: Success message (e.g., "Successfully reviewed")
 *       400:
 *         description: Bad Request (invalid review data, missing rating or comment, or rating out of range)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message indicating invalid review data
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
 *         description: Internal Server Error (error creating review)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message indicating failed review creation
 */

/**
 * @swagger
 * /api/review/{id}:
 *   put:
 *     summary: Update Review (Authenticated User)
 *     description: Updates an existing review entry identified by its unique ID. Requires authentication and ownership of the review (user_id matches authenticated user).
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Unique identifier of the review to update.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: integer
 *                 description: Updated rating for the coach (optional)
 *               comment:
 *                 type: string
 *                 description: Updated comment about the coach (optional)
 *     responses:
 *       200:
 *         description: Review updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 review:
 *                   $ref: '#/models/review'
 *                   description: The updated review object
 *       400:
 *         description: Bad Request (invalid update data or unauthorized access)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message indicating invalid update data or unauthorized access
 *       401:
 *         description: Unauthorized (requires valid access token or ownership of the review)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message indicating unauthorized access or missing ownership
 *       404:
 *         description: Review not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message indicating review not found
 *       500:
 *         description: Internal Server Error (error updating review)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message indicating failed update of the review
 */

/**
 * @swagger
 * /api/review/{id}:
 *   delete:
 *     summary: Delete Review (Authenticated User)
 *     description: Deletes an existing review entry identified by its unique ID. Requires authentication and ownership of the review (user_id matches authenticated user).
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Unique identifier of the review to delete.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Review deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message indicating review deletion
 *       401:
 *         description: Unauthorized (requires valid access token or ownership of the review)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message indicating unauthorized access or missing ownership
 *       404:
 *         description: Review not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message indicating review not found
 *       500:
 *         description: Internal Server Error (error deleting review)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message indicating failed deletion of the review
 */

// Get all reviews
const getReviews = async (req,res)=>{
    try {
        const Reviews = await review.find();
        const reviewCount = await review.countDocuments();
        if (!reviewCount) {
            return res.status(404).json({ error: 'Reviews not found' });
        }
        res.status(200).json({
            status:'success' ,
            TotalReviews : reviewCount,
            Reviews : Reviews
        })
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Get a specific review
const getReviewById = async (req,res) =>{
    try {
        const Review = await review.findById(req.params.id);
        if (!Review) {
            return res.status(404).json({ error: 'Review not found' });
        }
        res.status(200).json({
            status:'success' ,
            review : Review
        });
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(404).json({ error: 'Review not found' });
        }
        res.status(500).json({ error: error.message });
    }
}


// Create a new review
const createReview = async(req,res)=>{
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Token is missing or invalid' });
      }
  
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, 'secret');
  
      const userId = decoded.id;
      const coachId = req.params.id;
  
       const newReview = new review({
          coach_id: coachId,
          user_id: userId,
          rating : req.body.rating,
          comment: req.body.comment
      });
  
      await newReview.save()
      res.status(200).json({success: true , message: 'Successfully reviewed'}); 
  
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


// Update a review
const patchReview = async (req, res) => {
    try {
        const review = await review.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }
        res.json(review);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a review
const deleteReview = async (req, res) => {
    try {
        const review = await review.findByIdAndDelete(req.params.id);
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }
        res.json({ message: 'Review deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getReviews,
    getReviewById,
    createReview,
    patchReview,
    deleteReview
};