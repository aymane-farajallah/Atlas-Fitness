const Coach = require('../models/coach');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');

const getAllCoaches = async (req, res) => {
    try {
        const coaches = await Coach.find();
        if(!coaches){
        res.status(500).json({message:"No coach available"});
        }
        res.json(coaches);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getCoachById = async (req, res) => {
    try {
        const coach = await Coach.findById(req.params.id);
        if (!coach) {
        res.status(404).json({ message: 'Coach not found' });
        }else{
        res.json(coach);
    }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getCoachByFilter = async (req, res) => {
    try {
        const { city, gender, availability, price } = req.query;
        const coaches = await Coach.find({ city, gender, availability, price });
        if(!coaches){
        res.status(500).json({message:"No coach with specific criteria"});
        }
        res.json(coaches);
    } catch (err){
        res.status(500).json({ message: err.message });
    }
};

const updateCoachById = async (req, res) => {
    try {
        const coachExists = await Coach.exists({ _id: req.params.id });
        if (!coachExists) {
            return res.status(404).json({ message: 'Coach not found' });
        }

        if (req.body.password) {
            req.body.password = await bcrypt.hash(req.body.password, 10);
        }

        const coach = await Coach.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!coach) {
        return res.status(404).json({ message: 'Coach not found' });
        }
        res.status(200).json({ message: 'Coach modified successfully'});
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const deleteCoachById = async (req, res) => {
    try {
        const coach = await Coach.findByIdAndDelete(req.params.id);
        if (!coach) {
            return res.status(404).json({ message: 'Coach not found' });
        }
        res.json({ message: 'Coach deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    getAllCoaches,
    getCoachById,
    getCoachByFilter,
    updateCoachById,
    deleteCoachById
};
