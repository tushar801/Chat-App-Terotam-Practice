import mongoose from 'mongoose';

// Define log schema for MongoDB
const logSchema = new mongoose.Schema({
  action: String,
  complaintId: Number,
  message: String,
  timestamp: { type: Date, default: Date.now },
});

const Log = mongoose.model('Log', logSchema);

export async function logAction(action: string, complaintId: number, message: string): Promise<void> {
  try {
    const logEntry = new Log({ action, complaintId, message });
    await logEntry.save();
    console.log(`Log entry created for action: ${action}`);
  } catch (error) {
    console.error('Error logging action to MongoDB:', error);
  }
}

