const express = require("express");
const reviewControllers = require("../controllers/reviewcontrollers");
const { extractUserId } = require('../middlewares/reviewChecker');
const reviewRoute = express.Router();

reviewRoute.use(express.json());

// Get all reviews
reviewRoute.get('/review', extractUserId, reviewControllers.getReviews);

// Get a specific review
reviewRoute.get('/review/:id', extractUserId, reviewControllers.getReviewById);

// Create a new review
reviewRoute.post('/review', extractUserId, reviewControllers.createReview);

// Update a review
reviewRoute.patch('/review/:id', extractUserId, reviewControllers.patchReview);

// Delete a review
reviewRoute.delete('/review/:id', extractUserId, reviewControllers.deleteReview);

module.exports = reviewRoute;