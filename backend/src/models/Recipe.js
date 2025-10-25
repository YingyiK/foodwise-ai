const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    index: true
  },
  description: String,
  image: String,
  tags: [String],
  ingredients: [{
    name: String,
    amount: String,
    unit: String
  }],
  instructions: [String],
  nutrition: {
    calories: Number,
    protein: Number,
    carbs: Number,
    fat: Number,
    fiber: Number
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Easy'
  },
  prepTime: Number, // in minutes
  cookTime: Number, // in minutes
  servings: Number,
  cuisine: String,
  dietary: [String], // ['vegetarian', 'vegan', 'gluten-free', etc.]
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  isPublic: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes for better performance
recipeSchema.index({ name: 'text', description: 'text', tags: 'text' });
recipeSchema.index({ cuisine: 1 });
recipeSchema.index({ dietary: 1 });
recipeSchema.index({ rating: -1 });

module.exports = mongoose.model('Recipe', recipeSchema);
