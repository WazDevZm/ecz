import mongoose from 'mongoose';

const candidateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  party: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Party',
    required: true
  },
  position: {
    type: String,
    enum: ['president', 'vice-president', 'mp', 'councillor', 'other'],
    default: 'president'
  },
  photo: {
    type: String
  },
  bio: {
    type: String
  },
  province: {
    type: String
  },
  constituency: {
    type: String
  },
  keywords: [{
    type: String,
    lowercase: true
  }],
  socialMedia: {
    twitter: String,
    facebook: String
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for faster searches
candidateSchema.index({ name: 'text', keywords: 'text' });
candidateSchema.index({ party: 1, position: 1 });

export default mongoose.model('Candidate', candidateSchema);
