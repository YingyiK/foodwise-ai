const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  name: {
    type: String,
    required: true
  },
  preferences: {
    dietary: [String], // ['vegetarian', 'vegan', 'gluten-free', etc.]
    allergies: [String],
    cuisine: [String],
    spiceLevel: {
      type: String,
      enum: ['Mild', 'Medium', 'Hot', 'Very Hot'],
      default: 'Medium'
    },
    healthGoals: [String] // ['weight_loss', 'muscle_gain', 'heart_health', etc.]
  },
  healthProfile: {
    age: Number,
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other']
    },
    weight: Number,
    height: Number,
    activityLevel: {
      type: String,
      enum: ['Sedentary', 'Light', 'Moderate', 'Active', 'Very Active'],
      default: 'Moderate'
    },
    medicalConditions: [String]
  },
  schedule: {
    type: Map,
    of: {
      breakfast: mongoose.Schema.Types.Mixed,
      lunch: mongoose.Schema.Types.Mixed,
      dinner: mongoose.Schema.Types.Mixed,
      snack: mongoose.Schema.Types.Mixed
    }
  },
  favorites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Recipe'
  }],
  shoppingList: [{
    ingredient: String,
    amount: String,
    unit: String,
    purchased: {
      type: Boolean,
      default: false
    }
  }],
  lastLogin: Date,
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ 'preferences.dietary': 1 });
userSchema.index({ 'healthProfile.activityLevel': 1 });

module.exports = mongoose.model('User', userSchema);
