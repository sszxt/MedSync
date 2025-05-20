import Medication from '../models/Medication.js';
import MedicationCourse from '../models/MedicationCourse.js';

// Get all medications for the logged-in user
export const getMedications = async (req, res) => {
  const meds = await Medication.find({ user: req.user.id });
  res.json(meds);
};

// Get one medication
export const getMedication = async (req, res) => {
  const med = await Medication.findOne({ _id: req.params.id, user: req.user.id });
  if (!med) return res.status(404).json({ error: 'Medication not found' });
  res.json(med);
};

// Add new medication
export const addMedication = async (req, res) => {
  const med = await Medication.create({ ...req.body, user: req.user.id });
  res.status(201).json(med);
};

// Update medication
export const updateMedication = async (req, res) => {
  const med = await Medication.findOneAndUpdate(
    { _id: req.params.id, user: req.user.id },
    req.body,
    { new: true }
  );
  if (!med) return res.status(404).json({ error: 'Medication not found' });
  res.json(med);
};

// Delete medication
export const deleteMedication = async (req, res) => {
  const med = await Medication.findOneAndDelete({ _id: req.params.id, user: req.user.id });
  if (!med) return res.status(404).json({ error: 'Medication not found' });
  await MedicationCourse.deleteMany({ medication: req.params.id });
  res.json({ message: 'Medication and related courses deleted' });
};

// Get all medication courses for the logged-in user
export const getMedicationCourses = async (req, res) => {
  const courses = await MedicationCourse.find({ user: req.user.id });
  res.json(courses);
};

// Add a medication course
export const addMedicationCourse = async (req, res) => {
  const course = await MedicationCourse.create({
    ...req.body,
    user: req.user.id,
  });
  res.status(201).json(course);
};

// End a medication course (set status to completed)
export const endMedicationCourse = async (req, res) => {
  const course = await MedicationCourse.findOneAndUpdate(
    { _id: req.params.id, user: req.user.id },
    { status: 'completed' },
    { new: true }
  );
  if (!course) return res.status(404).json({ error: 'Course not found' });
  res.json(course);
};

// Delete a medication course
export const deleteMedicationCourse = async (req, res) => {
  const course = await MedicationCourse.findOneAndDelete({
    _id: req.params.id,
    user: req.user.id,
  });
  if (!course) return res.status(404).json({ error: 'Course not found' });
  res.json({ message: 'Course deleted' });
};
