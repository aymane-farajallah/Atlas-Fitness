const User = require('../models/user');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');

/**
 * @swagger
 * /api/users/getall:
 *   get:
 *     summary: Get All Users (Admin Only)
 *     description: Retrieves a list of all user entries from the database. Requires admin access.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/models/user'
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
 *         description: Internal Server Error (error retrieving users)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message indicating failed retrieval of users
 */

/**
 * @swagger
 * /api/users/getuser/{id}:
 *   get:
 *     summary: Get User by ID
 *     description: Retrieves a specific user entry identified by its unique ID. Requires appropriate authentication level (user or admin).
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Unique identifier of the user to retrieve.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/models/user'
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
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message indicating user not found
 *       500:
 *         description: Internal Server Error (error retrieving user)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message indicating failed retrieval of user
 */

/**
 * @swagger
 * /api/users/putuser/{id}:
 *   put:
 *     summary: Update User by ID (Authenticated User)
 *     description: Updates an existing user entry identified by its unique ID. Requires valid access token and potentially user or admin access depending on the updated fields.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Unique identifier of the user to update.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullname:
 *                 type: string
 *                 description: Updated full name (optional)
 *               email:
 *                 type: string
 *                 description: Updated email address (restricted access)
 *               password:
 *                 type: string
 *                 description: Updated password (optional)
 *               role:
 *                 type: string
 *                 description: Updated user role (restricted access)
 *               gender:
 *                 type: string
 *                 description: Updated gender (optional)
 *               height:
 *                 type: number
 *                 description: Updated height (optional)
 *               weight:
 *                 type: number
 *                 description: Updated weight (optional)
 *               city:
 *                 type: string
 *                 description: Updated city (optional)
 *               location:
 *                 type: string
 *                 description: Updated location details (optional)
 *               bank_details:
 *                 type: string
 *                 description: Updated bank details (restricted access)
 *               address:
 *                 type: string
 *                 description: Updated address (optional)
 *               image:
 *                 type: string
 *                 description: Updated profile image URL/path (optional)
 *               phone_number:
 *                 type: number
 *                 description: Updated phone number (optional)
 *               card:
 *                 type: object
 *                 description: Updated credit/debit card details (restricted access)
 *                   properties:
 *                     name:
 *                       type: string
 *                     number:
 *                       type: string
 *                     exp_month:
 *                       type: number
 *                     exp_year:
 *                       type: number
 *                     cvc:
 *                       type: string
 *                     address_country:
 *                       type: string
 *                     address_zip:
 *                       type: string
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message indicating user update
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
 *         description: Unauthorized (requires valid access token or permission to update specific fields)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message indicating unauthorized access or missing permission
 *       500:
 *         description: Internal Server Error (error updating user)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message indicating failed update of the user
 */

/**
 * @swagger
 * /api/users/filter:
 *   get:
 *     summary: Get Users by Filter (Admin or User with Appropriate Permissions)
 *     description: Retrieves a list of user entries matching specific filter criteria (city, gender, availability). Requires admin access or appropriate user permissions.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: city
 *         in: query
 *         description: Filter users by city
 *         schema:
 *           type: string
 *       - name: gender
 *         in: query
 *         description: Filter users by gender
 *         schema:
 *           type: string
 *       - name: availability
 *         in: query
 *         description: Filter users by availability (optional)
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Users retrieved successfully (matching filters)
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/models/user'
 *       401:
 *         description: Unauthorized (requires valid access token and permission)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message indicating unauthorized access or missing permission
 *       500:
 *         description: Internal Server Error (error retrieving users)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message indicating failed retrieval of users
 */

/**
 * @swagger
 * /api/users/delete/:id:
 *   delete:
 *     summary: Delete User by ID (Admin Only)
 *     description: Deletes an existing user entry identified by its unique ID. Requires admin access.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Unique identifier of the user to delete.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message indicating user deletion
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
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message indicating user not found
 *       500:
 *         description: Internal Server Error (error deleting user)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message indicating failed deletion of the user
 */

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
