import mongoose from 'mongoose';

const MedicationCourseSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  medication: {
    type: mongoose.Schema.ObjectId,
    ref: 'Medication',
    required: true,
  },
  startDate: {
    type: Date,
    required: [true, 'Please add start date'],
  },
  endDate: {
    type: Date,
    required: [true, 'Please add end date'],
  },
  status: {
    type: String,
    enum: ['active', 'completed'],
    default: 'active',
  },
});

export default mongoose.model('MedicationCourse', MedicationCourseSchema);
