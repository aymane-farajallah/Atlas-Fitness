const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const sendMailUser = require("../services/emailservice");

// Register function
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
    // Hash and secure password
    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(newUser.password, salt);

    // Save new user to database
    await newUser.save();

    res.json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Internal server error" });

  }
};

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
            jwt.sign(payload, "secret", { expiresIn: "7d" }, (err, token) => {
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