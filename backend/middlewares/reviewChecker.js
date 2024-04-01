const jwt = require('jsonwebtoken');
const userModel = require('../models/user');

exports.extractUserId = (req, res, next) => {
    const token = req.header("Authorization");
    if (!token) {
        return res.status(401).json({ message: 'Token is required' });
    }

    const tokenId = token.replace('Bearer ', '');
    jwt.verify(tokenId, process.env.JWT_TOKEN_VERIFY, async (error, decoded) => {
        if (error) {
            return res.status(401).json({ error: 'Invalid token' });
        } else {
            req.userId = decoded.userid;

            try {
                const user = await userModel.findById(decoded.userid);
                if (!user) {
                    return res.status(404).json({ message: 'User not found' });
                }
                next();
            } catch (error) {
                console.error(error);
                res.status(500).send("Internal Server Error");
            }
        }
    });
};

exports.reviewSave = async (req, res, next) => {
    try {
        const userId = req.userId;
        const reviewModel = require('../models/review');

        const newReview = new reviewModel({
            user_id: userId,
            coach_id: req.body.coach_id,
            rating: req.body.rating,
            comment: req.body.comment
        });
        await newReview.save();
        next(); // Pass control to the next middleware/controller
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};