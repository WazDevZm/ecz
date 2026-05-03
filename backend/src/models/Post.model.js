import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true
  },
  source: {
    type: String,
    enum: ['twitter', 'facebook', 'reddit', 'youtube', 'news'],
    required: true
  },
  sourceId: {
    type: String,
    unique: true,
    sparse: true
  },
  author: {
    username: String,
    name: String,
    profileUrl: String
  },
  url: {
    type: String
  },
  publishedAt: {
    type: Date,
    required: true
  },
  engagement: {
    likes: { type: Number, default: 0 },
    shares: { type: Number, default: 0 },
    comments: { type: Number, default: 0 },
    views: { type: Number, default: 0 }
  },
  sentiment: {
    label: {
      type: String,
      enum: ['positive', 'negative', 'neutral'],
      required: true
    },
    score: {
      type: Number,
      min: -1,
      max: 1,
      required: true
    },
    confidence: {
      type: Number,
      min: 0,
      max: 1
    }
  },
  entities: {
    parties: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Party'
    }],
    candidates: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Candidate'
    }],
    topics: [{
      type: String,
      lowercase: true
    }],
    hashtags: [{
      type: String,
      lowercase: true
    }]
  },
  location: {
    province: String,
    district: String,
    coordinates: {
      type: { type: String, default: 'Point' },
      coordinates: [Number] // [longitude, latitude]
    }
  },
  language: {
    type: String,
    default: 'en'
  },
  isProcessed: {
    type: Boolean,
    default: false
  },
  isVerified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Indexes for performance
postSchema.index({ publishedAt: -1 });
postSchema.index({ source: 1, publishedAt: -1 });
postSchema.index({ 'sentiment.label': 1, publishedAt: -1 });
postSchema.index({ 'entities.parties': 1 });
postSchema.index({ 'entities.candidates': 1 });
postSchema.index({ 'entities.hashtags': 1 });
postSchema.index({ 'location.province': 1 });
postSchema.index({ content: 'text' });

export default mongoose.model('Post', postSchema);
