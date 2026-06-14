const User = require('../models/User');

// Create a new user document
const createUser = async (userData) => {
  const user = new User(userData);
  return await user.save();
};

// Find a user by email
const findUserByEmail = async (email) => {
  return await User.findOne({ email });
};

// Find a user by username
const findUserByUsername = async (username) => {
  return await User.findOne({ username });
};

// Find a user by ID
const findUserById = async (id) => {
  return await User.findById(id);
};

// Update a user by ID
const updateUserById = async (id, updateData) => {
  return await User.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });
};

module.exports = {
  createUser,
  findUserByEmail,
  findUserByUsername,
  findUserById,
  updateUserById,
};