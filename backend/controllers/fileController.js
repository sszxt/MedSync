// backend/controllers/fileController.js
import File from '../models/File.js';
import ErrorResponse from '../utils/errorResponse.js';
import asyncHandler from '../utils/asyncHandler.js';
import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';

// @desc    Upload file to IPFS
// @route   POST /api/files
// @access  Private
export const uploadFile = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    return next(new ErrorResponse('Please upload a file', 400));
  }

  const file = req.file;

  // Check file size
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    return next(new ErrorResponse('File size exceeds 10MB limit', 400));
  }

  // Create form data
  const formData = new FormData();
  formData.append('file', file.buffer, file.originalname);
  formData.append('pinataMetadata', JSON.stringify({ name: file.originalname }));

  try {
    // Upload to IPFS via Pinata
    const response = await axios.post(
      'https://api.pinata.cloud/pinning/pinFileToIPFS',
      formData,
      {
        headers: {
          'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
          pinata_api_key: process.env.PINATA_API_KEY,
          pinata_secret_api_key: process.env.PINATA_SECRET_KEY,
        },
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
      }
    );

    // Save file info to database
    const fileData = {
      user: req.user.id,
      name: file.originalname,
      ipfs_pin_hash: response.data.IpfsHash,
      url: `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`,
      size: file.size,
      type: file.mimetype,
    };

    const savedFile = await File.create(fileData);

    res.status(201).json({
      success: true,
      data: savedFile,
    });
  } catch (err) {
    console.error(err);
    return next(new ErrorResponse('File upload failed', 500));
  }
});

// @desc    Get all files for user
// @route   GET /api/files
// @access  Private
export const getFiles = asyncHandler(async (req, res, next) => {
  const files = await File.find({ user: req.user.id }).sort('-timestamp');

  res.status(200).json({
    success: true,
    count: files.length,
    data: files,
  });
});

// @desc    Delete file from IPFS and database
// @route   DELETE /api/files/:id
// @access  Private
export const deleteFile = asyncHandler(async (req, res, next) => {
  const file = await File.findById(req.params.id);

  if (!file) {
    return next(new ErrorResponse(`No file found with id ${req.params.id}`, 404));
  }

  // Make sure user owns the file
  if (file.user.toString() !== req.user.id) {
    return next(
      new ErrorResponse(`User not authorized to delete this file`, 401)
    );
  }

  if (!file.ipfs_pin_hash) {
    return next(new ErrorResponse('No IPFS hash found for this file', 400));
  }

  try {
    await axios.delete(
      `https://api.pinata.cloud/pinning/unpin/${file.ipfs_pin_hash}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PINATA_JWT}`,
        },
      }
    );

    // Delete from database
    await file.remove();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    console.error('Pinata unpin error:', err.response?.data || err.message);
    return next(new ErrorResponse('File deletion failed', 500));
  }
});