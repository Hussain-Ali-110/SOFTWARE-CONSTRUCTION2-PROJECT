// controllers/authController.js
const User = require('../models/User');

const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists.' });
    }

    const newUser = new User({ name, email, password, role });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully!' });
  } catch (err) {
    res.status(500).json({ message: 'Server error. Try again later.' });
  }
};

const login = async (req, res) => {
  // Placeholder for login logic
  res.json({ message: 'Login route working.' });
};

module.exports = { register, login };
