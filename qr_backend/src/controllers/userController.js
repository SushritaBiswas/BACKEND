const User = require("../models/userModel");
const resetPass = require("../models/resetPassword");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const transporter = require("../service/nodeMailer");
require("dotenv").config();

//Forgot password
const forgotPass = async (req, res) => {
  const email = req.body.email;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.json({ error: "User not found" });
    }

    const reset_token = Math.floor(Math.random() * 10000).toString();

    await resetPass.deleteMany({ userId: user._id });

    const newResetPass = new resetPass({
      userId: user._id,
      resetToken: reset_token,
    });

    await newResetPass.save();

    // Sending welcome email
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Reset your password",
      html: `
        <h1>Here is you reset code</h1>
        <h1>${reset_token}</h1>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.json({ msg: "Reset code sent to your email" });
  } catch (error) {
    console.log(error);
  }
};

//Reset password
const resetPassFunc = async (req, res) => {
  const { token } = req.params;
  const password = req.body.password;
  try {
    const resetToken = await resetPass.findOne({ resetToken: token });

    if (!resetToken) {
      return res.json({ msg: "Invalid code" });
    }

    const hashedPass = await bcrypt.hash(password, 10);

    await User.findByIdAndUpdate(resetToken.userId, {
      password: hashedPass,
    });

    await resetPass.deleteOne({ _id: resetToken._id });

    res.json({ msg: "Password has been successfully updated" });
  } catch (error) {
    console.log(error);
    return res.json({ error: "Internal server error" });
  }
};

//Loging in
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ error: "Invalid email" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Sending welcome email
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: `Welcome to QR Code Management System ${user.username}`,
      text: `Welcome to our website. You have been successfully logged in using email id: ${email}`,
    };

    await transporter.sendMail(mailOptions);

    res.json({
      token,
      user: {
        username: user.username,
        email: user.email,
        role: user.role,
      },
      success: true,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

//Creating users
const createUser = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    const requesterRole = req.user?.role;

    if (!username || !email || !password || !role) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ error: "Username already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword, role });

    await user.save();
    res.status(201).json({ message: "User created successfully", user });
  } catch (err) {
    console.error("Error creating user:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get All Users
const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    console.error("Fetch users error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Delete User by ID
const deleteUsers = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted!" });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  forgotPass,
  resetPassFunc,
  loginUser,
  createUser,
  getUsers,
  deleteUsers,
};
