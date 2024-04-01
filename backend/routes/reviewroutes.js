const express = require("express");
const reviewControllers = require("../controllers/reviewcontrollers");
const { extractUserId } = require('../middlewares/reviewChecker');

const reviewRoute = express.Router();
reviewRoute.use(express.json());

// Get all reviews
reviewRoute.get('/review', extractUserId, reviewControllers.getAllReviews);

// Get a specific review
reviewRoute.get('/review/:id', extractUserId, reviewControllers.getReviewById);

// Create a new review
reviewRoute.post('/review', extractUserId, reviewControllers.createReview);

// Update a review
reviewRoute.patch('/review/:id', extractUserId, reviewControllers.updateReview);

// Delete a review
reviewRoute.delete('/review/:id', extractUserId, reviewControllers.deleteReview);

module.exports = reviewRoute;