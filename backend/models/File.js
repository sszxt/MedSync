import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema({
  name: String,
  ipfs_pin_hash: String,
  url: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  size: Number,
  type: String,
  createdAt: { type: Date, default: Date.now }
});



export default mongoose.model('File', fileSchema);