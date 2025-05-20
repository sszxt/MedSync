// backend/controllers/userController.js

import User from '../models/User.js';
import ErrorResponse from '../utils/errorResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

// @desc    Get user profile
// @route   GET /api/users/me
// @access  Private
export const getUserProfile = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('-password');

  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc    Update user profile
// @route   PUT /api/users/me
// @access  Private
export const updateUserProfile = asyncHandler(async (req, res, next) => {
  const fieldsToUpdate = {
    name: req.body.name,
    email: req.body.email,
  };

  // If password is being updated
  if (req.body.password) {
    fieldsToUpdate.password = req.body.password;
  }

  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true,
  }).select('-password');

  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc    Delete user account
// @route   DELETE /api/users/me
// @access  Private
export const deleteUserAccount = asyncHandler(async (req, res, next) => {
  await User.findByIdAndDelete(req.user.id);

  res.status(200).json({
    success: true,
    data: {},
  });
});