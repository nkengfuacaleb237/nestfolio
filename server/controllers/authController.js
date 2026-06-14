const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {
  createUser,
  findUserByEmail,
  findUserByUsername,
} = require('../repositories/userRepository');

// Generate a JWT for a given user
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// @desc    Register a new user
// @route   POST /api/auth/register
const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Basic validation
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Please provide username, email, and password' });
    }

    // Check if email or username already exists
    const existingEmail = await findUserByEmail(email);
    if (existingEmail) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const existingUsername = await findUserByUsername(username);
    if (existingUsername) {
      return res.status(400).json({ message: 'Username already taken' });
    }

    // Hash the password with a salt round of 10
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await createUser({
      username,
      email,
      password: hashedPassword,
    });

    const token = generateToken(newUser);

    res.status(201).json({
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      token,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(user);

    res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { registerUser, loginUser };