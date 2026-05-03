import mongoose from 'mongoose';

const alertSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['sentiment_spike', 'mention_surge', 'hashtag_trend', 'custom'],
    required: true
  },
  conditions: {
    entity: {
      type: String, // party or candidate ID
      entityType: {
        type: String,
        enum: ['party', 'candidate', 'hashtag', 'topic']
      }
    },
    metric: {
      type: String,
      enum: ['sentiment', 'mentions', 'engagement', 'growth_rate']
    },
    threshold: {
      type: Number,
      required: true
    },
    timeWindow: {
      type: Number, // in hours
      default: 24
    },
    comparison: {
      type: String,
      enum: ['increase', 'decrease', 'above', 'below'],
      default: 'increase'
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastTriggered: {
    type: Date
  },
  triggerCount: {
    type: Number,
    default: 0
  },
  notifications: {
    email: { type: Boolean, default: true },
    inApp: { type: Boolean, default: true }
  }
}, {
  timestamps: true
});

// Index for active alerts
alertSchema.index({ user: 1, isActive: 1 });

export default mongoose.model('Alert', alertSchema);
