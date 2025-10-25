const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  yelpId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
    coordinates: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        index: '2dsphere'
      }
    }
  },
  phone: String,
  website: String,
  priceRange: {
    type: String,
    enum: ['$', '$$', '$$$', '$$$$']
  },
  categories: [String],
  rating: {
    type: Number,
    min: 0,
    max: 5
  },
  reviewCount: Number,
  imageUrl: String,
  hours: {
    monday: String,
    tuesday: String,
    wednesday: String,
    thursday: String,
    friday: String,
    saturday: String,
    sunday: String
  },
  isOpen: {
    type: Boolean,
    default: true
  },
  deliveryAvailable: {
    type: Boolean,
    default: false
  },
  takeoutAvailable: {
    type: Boolean,
    default: true
  },
  menu: [{
    name: String,
    description: String,
    price: Number,
    category: String,
    dietary: [String]
  }],
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Geospatial index for location-based queries
restaurantSchema.index({ 'address.coordinates': '2dsphere' });
restaurantSchema.index({ categories: 1 });
restaurantSchema.index({ rating: -1 });
restaurantSchema.index({ priceRange: 1 });

module.exports = mongoose.model('Restaurant', restaurantSchema);
