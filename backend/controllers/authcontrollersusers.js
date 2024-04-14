const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const sendMailUser = require("../services/emailservice");

/**
 * @swagger
 * /api/regiteruser:
 *   post:
 *     summary: Register a User
 *     description: Allows a user to register with the platform.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullname:
 *                 type: string
 *                 description: user's full name
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 description: user's email address
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 description: user's password
 *               gender:
 *                 type: string
 *                 description: user's gender 
 *               city:
 *                 type: string
 *                 description: user's city 
 *               address:
 *                 type: string
 *                 description: user's address 
 *     responses:
 *       200:
 *         description: user registered successfully
 *       400:
 *         description: user already exists or validation error
 *       500:
 *         description: Internal server error
 */

registerUser = async (req, res) => {
  try {
    const { fullname, email, password, gender } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ err: "User already exists" });
    }

    const newUser = new User({
      fullname,
      email,
      password,
      gender

    });
    
    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(newUser.password, salt);

    await newUser.save();

    res.json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Internal server error" });

  }
};

/**
 * @swagger
 * /api/loginuser:
 *   post:
 *     summary: Login a User
 *     description: Allows a registered user to login to the platform.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: user's registered email address used for login. (Matches the 'email' field in the user model)
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 description: user's password. (Not stored in plain text, but a hashed version. Matches the 'password' field in the user model)
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
 *         description: user not found (user with the provided email address not found in the database)
 *       500:
 *         description: Internal server error
 */

// Login function
loginUser = (req, res) => {
  const { email, password } = req.body;
  // checking if user doesnt exist
  User.findOne({ email })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      //comparing both password that is inputed and registered password
      bcrypt
        .compare(password, user.password)
        .then((isMatch) => {
          if (isMatch) {
            const payload = { id: user.id, name: user.name };
            //giving user a jwt token to the signin process of our user
            jwt.sign({ ...payload, role: user.role }, "secret", { expiresIn: "7d" }, (err, token) => {
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
 * /api/U-forgot-password:
 *   post:
 *     summary: Initiate Password Reset for user
 *     description: Allows a user to request a password reset link via email.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: user's registered email address.
 *                 example: user@example.com
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
 *         description: user not found (user with the provided email address not found in the database)
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
      
      const userForgot = user;

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
 * /api/reset-U/:id:
 *   put:
 *     summary: Reset user Password
 *     description: Allows a user to reset their password using a provided reset link (ID).
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: user's unique identifier from the reset password link.
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
 *                 description: user's new password.
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
 *         description: user not found (user with the provided ID not found in the database)
 *       500:
 *         description: Internal server error (e.g., database error)
 */

resetPassword = async (req, res) => {
  try {
    const userId = req.params.id;
    // Ensuring that newPassword is present in the request body
    const newPassword = req.body.newPassword;
    // Checking if newPassword is undefined
    if (!newPassword) {
      return res.status(400).json({ error: "New password is required" });
    }
    // Check if the user with the provided ID exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update the user's password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashedPassword;
    await user.save();

    // Return success message
    return res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Error in resetting password:", error);
    return res.status(500).json({ error: "Internal server error in reset" });
  }
};
module.exports = { registerUser, loginUser, resetPassword, forgotPassword };