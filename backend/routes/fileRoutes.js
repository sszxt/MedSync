// backend/routes/fileRoutes.js
import express from 'express';
import {
  uploadFile,
  getFiles,
  deleteFile,
} from '../controllers/fileController.js';
import { protect } from '../middleware/auth.js';
import upload from '../utils/multer.js';

const router = express.Router();

router
  .route('/')
  .get(protect, getFiles)
  .post(protect, upload.single('file'), uploadFile);

router.route('/:id').delete(protect, deleteFile);

export default router;