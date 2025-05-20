import express from 'express';
import {
  getMedications,
  getMedication,
  addMedication,
  updateMedication,
  deleteMedication,
  getMedicationCourses,
  addMedicationCourse,
  endMedicationCourse,
  deleteMedicationCourse,
} from '../controllers/medController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.route('/').get(protect, getMedications).post(protect, addMedication);


router
.route('/courses')
.get(protect, getMedicationCourses)
.post(protect, addMedicationCourse);
router
  .route('/:id')
  .get(protect, getMedication)
  .put(protect, updateMedication)
  .delete(protect, deleteMedication);

router
  .route('/courses/:id/end')
  .put(protect, endMedicationCourse);

router
  .route('/courses/:id')
  .delete(protect, deleteMedicationCourse);

export default router;
