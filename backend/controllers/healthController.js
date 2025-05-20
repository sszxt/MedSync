// backend/controllers/healthController.js
import HealthData from '../models/HealthData.js';
import ErrorResponse from '../utils/errorResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

// @desc    Get all health data for user
// @route   GET /api/health
// @access  Private
export const getHealthData = asyncHandler(async (req, res, next) => {
  const healthData = await HealthData.find({ user: req.user.id }).sort(
    '-createdAt'
  );

  res.status(200).json({
    success: true,
    count: healthData.length,
    data: healthData,
  });
});

// @desc    Get single health data record
// @route   GET /api/health/:id
// @access  Private
export const getHealthRecord = asyncHandler(async (req, res, next) => {
  const healthRecord = await HealthData.findOne({
    _id: req.params.id,
    user: req.user.id,
  });

  if (!healthRecord) {
    return next(
      new ErrorResponse(
        `No health record found with id ${req.params.id} for this user`,
        404
      )
    );
  }

  res.status(200).json({
    success: true,
    data: healthRecord,
  });
});

// @desc    Add health data
// @route   POST /api/health
// @access  Private
export const addHealthData = asyncHandler(async (req, res, next) => {
  req.body.user = req.user.id;

  const healthData = await HealthData.create(req.body);

  res.status(201).json({
    success: true,
    data: healthData,
  });
});

// @desc    Update health data
// @route   PUT /api/health/:id
// @access  Private
export const updateHealthData = asyncHandler(async (req, res, next) => {
  let healthData = await HealthData.findById(req.params.id);

  if (!healthData) {
    return next(
      new ErrorResponse(`No health record found with id ${req.params.id}`, 404)
    );
  }

  // Make sure user owns the health record
  if (healthData.user.toString() !== req.user.id) {
    return next(
      new ErrorResponse(
        `User not authorized to update this health record`,
        401
      )
    );
  }

  healthData = await HealthData.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: healthData,
  });
});

// @desc    Delete health data
// @route   DELETE /api/health/:id
// @access  Private
export const deleteHealthData = asyncHandler(async (req, res, next) => {
  const healthData = await HealthData.findById(req.params.id);

  if (!healthData) {
    return next(
      new ErrorResponse(`No health record found with id ${req.params.id}`, 404)
    );
  }

  // Make sure user owns the health record
  if (healthData.user.toString() !== req.user.id) {
    return next(
      new ErrorResponse(
        `User not authorized to delete this health record`,
        401
      )
    );
  }

  await healthData.remove();

  res.status(200).json({
    success: true,
    data: {},
  });
});