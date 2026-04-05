import mongoose from 'mongoose';

const requestSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    default: 'WAITING_FOR_AI', // We'll update this when AI is plugged in
  },
  priority: {
    type: String,
    enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL', 'WAITING_FOR_AI'],
    default: 'WAITING_FOR_AI', // Set by AI later
  },
  status: {
    type: String,
    enum: ['NEW', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED'],
    default: 'NEW',
  },
  ai_summary: {
    type: String,
    default: '',
  },
  ai_suggested_resolution: {
    type: String,
    default: '',
  },
}, { timestamps: true });

export default mongoose.model('Request', requestSchema);
