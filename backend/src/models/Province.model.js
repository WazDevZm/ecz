import mongoose from 'mongoose';

const provinceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  capital: {
    type: String
  },
  population: {
    type: Number
  },
  coordinates: {
    type: { type: String, default: 'Polygon' },
    coordinates: [[[Number]]] // GeoJSON polygon
  },
  districts: [{
    type: String
  }]
}, {
  timestamps: true
});

export default mongoose.model('Province', provinceSchema);
