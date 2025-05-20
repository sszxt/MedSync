// backend/models/HealthData.js
import mongoose from 'mongoose';

const HealthDataSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  bloodPressure: {
    type: String,
    required: [true, 'Please add blood pressure'],
  },
  weight: {
    type: Number,
    required: [true, 'Please add weight'],
  },
  height: {
    type: Number,
    required: [true, 'Please add height'],
  },
  bloodSugar: {
    type: Number,
    required: [true, 'Please add blood sugar level'],
  },
  conditions: {
    type: [String],
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('HealthData', HealthDataSchema);