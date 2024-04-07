const review = require("../models/review");
const jwt = require('jsonwebtoken');

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