// backend/routes/userRoutes.js
import express from 'express';
import {
  getUserProfile,
  updateUserProfile,
  deleteUserAccount,
} from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router
  .route('/me')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile)
  .delete(protect, deleteUserAccount);

export default router;