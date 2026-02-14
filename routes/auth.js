const express = require('express');
const router = express.Router();
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

router.post('/register', async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // 1. Check if email exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) return res.status(400).json({ message: "Email already registered" });

    // 2. Check if username exists
    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).json({ message: "Username already taken" });

    // 3. HASH THE PASSWORD
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Create user with the HASHED password
    const user = new User({ 
      username, 
      email, 
      password: hashedPassword, // Store the hash, never the plain text
      role 
    });

    await user.save();

    res.status(201).json({ message: "Success! You can now login." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error during registration" });
  }
});
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: "User not found" });

    // Compare Hashed Password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // Send role back to frontend
    res.json({
      token: "your_generated_jwt_token", // Replace with your actual JWT logic
      role: user.role,
      username: user.username
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});
// Add to your existing auth routes file
router.post('/logout', (req, res) => {
  // If using cookies: res.clearCookie('token');
  res.status(200).json({ message: "Successfully logged out" });
});
module.exports = router;