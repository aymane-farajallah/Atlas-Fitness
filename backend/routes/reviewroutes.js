const express = require("express");
const reviewControllers = require("../controllers/reviewcontrollers");
const { extractUserId } = require('../middlewares/reviewChecker');
const reviewRoute = express.Router();
const {isAuthenticated} = require('../middlewares/protectRoute');
const checkUser = require("../middlewares/checkUser");
const checkCoach = require("../middlewares/checkCoach");
const checkAdmin = require("../middlewares/checkAdmin");
reviewRoute.use(express.json());

// Get all reviews
reviewRoute.get('/review', isAuthenticated, checkAdmin , extractUserId, reviewControllers.getReviews);

// Get a specific review
reviewRoute.get('/review/:id', isAuthenticated, extractUserId, reviewControllers.getReviewById);

// Create a new review
reviewRoute.post('/review/:id', isAuthenticated, reviewControllers.createReview);

// Update a review
reviewRoute.put('/review/:id', isAuthenticated, extractUserId, reviewControllers.patchReview);

// Delete a review
reviewRoute.delete('/review/:id', isAuthenticated, extractUserId, reviewControllers.deleteReview);

module.exports = reviewRoute;