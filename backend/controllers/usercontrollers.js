const User = require('../models/user');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');

const getAllusers = async (req, res) => {
    try {
        const users = await User.find();
        if(!users){
        res.status(500).json({message:"No user available"});
        }
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getuserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
        res.status(404).json({ message: 'User not found' });
        }else{
        res.json(user);
    }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getuserByFilter = async (req, res) => {
    try {
        const { city, gender, availability } = req.query;
        const users = await User.find({ city, gender, availability });
        if(!users){
        res.status(500).json({message:"No user with specific criteria"});
        }
        res.json(users);
    } catch (err){
        res.status(500).json({ message: err.message });
    }
};

const updateuserById = async (req, res) => {
    try {
        const userExists = await User.exists({ _id: req.params.id });
        if (!userExists) {
            return res.status(404).json({ message: 'user not found' });
        }

        if (req.body.password) {
            req.body.password = await bcrypt.hash(req.body.password, 10);
        }

        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!user) {
        return res.status(404).json({ message: 'user not found' });
        }
        res.status(200).json({ message: 'user modified successfully'});
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const deleteuserById = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'user not found' });
        }
        res.json({ message: 'user deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    getAllusers,
    getuserById,
    getuserByFilter,
    updateuserById,
    deleteuserById
};
