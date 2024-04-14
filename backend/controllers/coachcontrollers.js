const Coach = require('../models/coach');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');

/**
 * @swagger
 * /api/getallcoaches:
 *   get:
 *     summary: Get All Coaches
 *     description: Retrieves a list of all coach entries from the database.
 *     responses:
 *       200:
 *         description: Coaches retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                $ref: '#/models/coach'
 *       500:
 *         description: Internal Server Error (error retrieving coaches)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message indicating failed retrieval of coaches (e.g., database error)
 */

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

/**
 * @swagger
 * /api/getcoach/:id:
 *   get:
 *     summary: Get Coach by ID
 *     description: Retrieves a specific coach entry based on its unique identifier.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Unique identifier of the coach to retrieve.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Coach retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/models/coach'
 *       404:
 *         description: Coach not found (no coach found with the provided ID)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message indicating coach not found
 */

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

/**
 * @swagger
 * /api/filtercoach:
 *   get:
 *     summary: Get Coaches by Filter
 *     description: Retrieves coach entries based on provided filter criteria (optional).
 *     parameters:
 *       - name: city
 *         in: query
 *         description: Filter coaches by city (optional)
 *         schema:
 *           type: string
 *       - name: gender
 *         in: query
 *         description: Filter coaches by gender (optional)
 *         schema:
 *           type: string
 *       - name: availability
 *         in: query
 *         description: Filter coaches by availability (optional)
 *         schema:
 *           type: string
 *       - name: price
 *         in: query
 *         description: Filter coaches by price range (optional)
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Coaches retrieved based on filters (may be empty if no matches)
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/models/coach'
 *       500:
 *         description: Internal Server Error (error retrieving coaches)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message indicating failed retrieval of coaches (e.g., database error)
 */

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

/**
 * @swagger
 * /api/putcoach/:id:
 *   put:
 *     summary: Update Coach
 *     description: Updates a coach entry based on its unique identifier and provided data.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Unique identifier of the coach to update.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             # Adjust properties based on your updatable coach fields
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Coach's name (optional)
 *               email:
 *                 type: string
 *                 description: Coach's email address (optional)
 *               password:
 *                 type: string
 *                 description: Coach's password (optional, will be hashed before saving)
 *               # Add other updatable coach fields here (e.g., bio, expertise, etc.)
 *     responses:
 *       200:
 *         description: Coach updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message indicating coach update
 *       400:
 *         description: Bad Request (invalid update data)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message indicating invalid update data
 *       404:
 *         description: Coach not found (no coach found with the provided ID)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message indicating coach not found
 *       500:
 *         description: Internal Server Error (error updating coach)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message indicating failed update of coach
 */

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

/**
 * @swagger
 * /api/deletecoach/:id:
 *   delete:
 *     summary: Delete Coach
 *     description: Deletes a coach entry based on its unique identifier.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Unique identifier of the coach to delete.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Coach deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message indicating coach deletion
 *       404:
 *         description: Coach not found (no coach found with the provided ID)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message indicating coach not found
 *       500:
 *         description: Internal Server Error (error deleting coach)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message indicating failed deletion of coach
 */

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
