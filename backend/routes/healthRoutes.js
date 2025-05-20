// backend/routes/healthRoutes.js
import express from 'express';
import {
  getHealthData,
  getHealthRecord,
  addHealthData,
  updateHealthData,
  deleteHealthData,
} from '../controllers/healthController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.route('/').get(protect, getHealthData).post(protect, addHealthData);
router
  .route('/:id')
  .get(protect, getHealthRecord)
  .put(protect, updateHealthData)
  .delete(protect, deleteHealthData);

export default router;