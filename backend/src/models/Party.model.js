import mongoose from 'mongoose';

const partySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  abbreviation: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },
  color: {
    type: String,
    default: '#3b82f6'
  },
  logo: {
    type: String
  },
  description: {
    type: String
  },
  founded: {
    type: Date
  },
  leader: {
    type: String
  },
  keywords: [{
    type: String,
    lowercase: true
  }],
  socialMedia: {
    twitter: String,
    facebook: String,
    website: String
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for faster searches
partySchema.index({ name: 'text', abbreviation: 'text', keywords: 'text' });

export default mongoose.model('Party', partySchema);
