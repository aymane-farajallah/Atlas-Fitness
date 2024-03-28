const express = require("express");
const reviewModel = require("../models/review");
const { extractUserId, reviewSave } = require('../middlewares/reviewChecker');

const reviewRoute = express.Router();
reviewRoute.use(express.json());

// Get all reviews
reviewRoute.get('/review', extractUserId, async (req, res) => {
    try {
        const reviews = await reviewModel.find();
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get a specific review
reviewRoute.get('/review/:id', extractUserId, async (req, res) => {
    try {
        const review = await reviewModel.findById(req.params.id);
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }
        res.json(review);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create a new review
reviewRoute.post('/review', extractUserId, reviewSave, async (req, res) => {
    res.status(201).json({ message: "Review created successfully" });
});

// Update a review
reviewRoute.patch('/review/:id', extractUserId, async (req, res) => {
    try {
        const review = await reviewModel.findByIdAndUpdate(req.params.id, req.body, {
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
});

// Delete a review
reviewRoute.delete('/review/:id', extractUserId, async (req, res) => {
    try {
        const review = await reviewModel.findByIdAndDelete(req.params.id);
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }
        res.json({ message: 'Review deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = reviewRoute;