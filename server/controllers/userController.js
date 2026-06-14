const bcrypt = require('bcryptjs');
const {
  findUserById,
  updateUserById,
} = require('../repositories/userRepository');

// @desc    Get logged-in user's profile
// @route   GET /api/users/profile
// @access  Private
const getProfile = async (req, res) => {
  try {
    const user = await findUserById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      phone: user.phone,
      avatar: user.avatar,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update profile info (name, phone, avatar)
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const { username, phone, avatar } = req.body;

    const updateData = {};
    if (username) updateData.username = username;
    if (phone !== undefined) updateData.phone = phone;
    if (avatar !== undefined) updateData.avatar = avatar;

    const updatedUser = await updateUserById(req.user.id, updateData);

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      phone: updatedUser.phone,
      avatar: updatedUser.avatar,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Change password (requires old password verification)
// @route   PUT /api/users/password
// @access  Private
const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: 'Please provide old and new password' });
    }

    const user = await findUserById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify old password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Old password is incorrect' });
    }

    // Hash and save new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await updateUserById(req.user.id, { password: hashedPassword });

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { getProfile, updateProfile, changePassword };