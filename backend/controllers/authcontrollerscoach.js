const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const sendMailUser = require("../services/emailservice");

/**
 * @swagger
 * /api/registercoach:
 *   post:
 *     summary: Register a Coach
 *     description: Allows a coach to register with the platform.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullname:
 *                 type: string
 *                 description: Coach's full name
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 description: Coach's email address
 *                 example: coach@example.com
 *               password:
 *                 type: string
 *                 description: Coach's password
 *               gender:
 *                 type: string
 *                 description: Coach's gender (optional)
 *               city:
 *                 type: string
 *                 description: Coach's city (optional)
 *               address:
 *                 type: string
 *                 description: Coach's address (optional)
 *     responses:
 *       200:
 *         description: Coach registered successfully
 *       400:
 *         description: Coach already exists or validation error
 *       500:
 *         description: Internal server error
 */

// Register function
const registercoach = async (req, res) => {
  try {
    const { fullname, email, password, gender, city, address } = req.body;

    const existingcoach = await coach.findOne({ email });
    if (existingcoach) {
      return res.status(400).json({ err: "coach already exists" });
    };

    const newcoach = new coach({
      fullname,
      email,
      password,
      gender,
      city,
      address,
    });
    
    // Hash and secure password
    const salt = await bcrypt.genSalt(10);
    newcoach.password = await bcrypt.hash(newcoach.password, salt);

    // Save new coach to database
    await newcoach.save();

    res.status(200).json({ message: "coach registered successfully" });
  } catch (error) {
    console.error("Error registering coach:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * @swagger
 * /api/logincoach:
 *   post:
 *     summary: Login a Coach
 *     description: Allows a registered coach to login to the platform.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Coach's registered email address used for login. (Matches the 'email' field in the Coach model)
 *                 example: coach@example.com
 *               password:
 *                 type: string
 *                 description: Coach's password. (Not stored in plain text, but a hashed version. Matches the 'password' field in the Coach model)
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Login success indicator
 *                 token:
 *                   type: string
 *                   description: JWT access token (prefixed with "Bearer ")
 *       400:
 *         description: Bad Request (missing fields, invalid credentials)
 *       404:
 *         description: Coach not found (Coach with the provided email address not found in the database)
 *       500:
 *         description: Internal server error
 */

// Login function
logincoach = (req, res) => {
  const { email, password } = req.body;
  // checking if coach doesnt exist
  coach.findOne({ email })
    .then((coach) => {
      if (!coach) {
        return res.status(404).json({ message: "coach not found" });
      }
      //comparing both password that is inputed and registered password
      bcrypt
        .compare(password, coach.password)
        .then((isMatch) => {
          if (isMatch) {
            const payload = { id: coach.id, name: coach.name };
            //giving coach a jwt token to the signin process of our coach
            jwt.sign({ ...payload, role: coach.role }, "secret", { expiresIn: "7d" }, (err, token) => {
              if (err) {
                return res
                  .status(500)
                  .json({ message: "Failed to generate token", error: err });
              }
              res.json({ success: true, token: "Bearer " + token });
            });
          } else {
            // displaying that the user has a wrong password
            res.status(400).json({ message: "Email or Password are incorrect" });
          }
        })
        // catching server errors
        .catch((err) =>
          res
            .status(500)
            .json({ message: "Failed to compare passwords", error: err }),
        );
    })
    .catch((err) =>
      res.status(500).json({ message: "Database error login", error: err }),
    );
};

/**
 * @swagger
 * /api/forgot-password:
 *   post:
 *     summary: Initiate Password Reset for Coach
 *     description: Allows a coach to request a password reset link via email.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Coach's registered email address.
 *                 example: coach@example.com
 *     responses:
 *       200:
 *         description: Password reset email sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message indicating email sent
 *       404:
 *         description: Coach not found (Coach with the provided email address not found in the database)
 *       500:
 *         description: Internal server error (e.g., email sending failure)
 */

// Forgot password function
forgotPassword = (req, res) => {
  //asking for the email of our user and checking if it exists
  const { email } = req.body;
  User.findOne({ email })
    .then(async (user) => {
      if (!user) {
        return res.status(404).json({ err: "user not found" });
      }
      // asigning the user to userForget to be used later
      const userForgot = user;
      /* creating a variable that stores a function we import from another file.
         this function contains 2 variables, our user's email and the reset link that ,
         we will send to our user through the email   */
      const sendMailToUser = await sendMailUser({
        userEmail: email,
        resetLink: `http://localhost:${port}/reset/${userForgot._id}`,
      });
      // catching errors, preferable if the we catch the outliar first
      if (!sendMailToUser) {
        return res.status(500).json({
          err: "internal server error related to forgot password",
        });
      }

      return res.status(200).json({
        message: "we have sent you an email with a link to reset your password",
      });
    })
    //catching any unwanted errors from the whole forgotPassword segmenet
    .catch((err) => {
      console.error("Error in forgot password:", err);
      return res.status(500).json({ err: "Internal server error" });
    });
};

/**
 * @swagger
 * /api/reset/:id:
 *   put:
 *     summary: Reset Coach Password
 *     description: Allows a coach to reset their password using a provided reset link (ID).
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Coach's unique identifier from the reset password link.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newPassword:
 *                 type: string
 *                 description: Coach's new password.
 *                 example: password123!
 *     responses:
 *       200:
 *         description: Password reset successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message indicating password reset
 *       400:
 *         description: Bad Request (missing new password)
 *       404:
 *         description: Coach not found (Coach with the provided ID not found in the database)
 *       500:
 *         description: Internal server error (e.g., database error)
 */

resetPassword = async (req, res) => {
  try {
    const coachId = req.params.id;
    // Ensuring that newPassword is present in the request body
    const newPassword = req.body.newPassword;
    // Checking if newPassword is undefined
    if (!newPassword) {
      return res.status(400).json({ error: "New password is required" });
    }
    // Check if the user with the provided ID exists
    const coach = await coach.findById(coachId);
    if (!coach) {
      return res.status(404).json({ error: "coach not found" });
    }

    // Update the user's password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    coach.password = hashedPassword;
    await coach.save();

    // Return success message
    return res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Error in resetting password:", error);
    return res.status(500).json({ error: "Internal server error in reset" });
  }
};
module.exports = { registercoach, logincoach, resetPassword, forgotPassword };