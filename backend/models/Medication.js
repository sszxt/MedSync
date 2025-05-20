import mongoose from 'mongoose';

const MedicationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: [true, 'Please add medication name'],
  },
  dosage: {
    type: String,
    required: [true, 'Please add dosage'],
  },
  frequency: {
    type: String,
    required: [true, 'Please add frequency'],
    enum: [
      'Once daily',
      'Twice daily',
      'Three times daily',
      'Weekly',
      'As needed',
    ],
  },
});

export default mongoose.model('Medication', MedicationSchema);
