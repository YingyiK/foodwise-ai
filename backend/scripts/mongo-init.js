// MongoDB initialization script
db = db.getSiblingDB('foodwise');

// Create collections with initial data
db.createCollection('recipes');
db.createCollection('users');
db.createCollection('restaurants');

// Create indexes for better performance
db.recipes.createIndex({ "name": "text", "description": "text", "tags": "text" });
db.recipes.createIndex({ "cuisine": 1 });
db.recipes.createIndex({ "dietary": 1 });
db.recipes.createIndex({ "rating": -1 });

db.users.createIndex({ "email": 1 });
db.users.createIndex({ "preferences.dietary": 1 });

db.restaurants.createIndex({ "address.coordinates": "2dsphere" });
db.restaurants.createIndex({ "categories": 1 });
db.restaurants.createIndex({ "rating": -1 });

// Insert sample data
db.recipes.insertMany([
  {
    name: "Grilled Salmon with Asparagus",
    description: "Healthy and delicious grilled salmon with fresh asparagus",
    image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288",
    tags: ["healthy", "protein", "low-carb"],
    ingredients: [
      { name: "Salmon fillet", amount: "1", unit: "lb" },
      { name: "Asparagus", amount: "1", unit: "bunch" },
      { name: "Olive oil", amount: "2", unit: "tbsp" },
      { name: "Lemon", amount: "1", unit: "piece" },
      { name: "Salt", amount: "1", unit: "tsp" },
      { name: "Black pepper", amount: "1/2", unit: "tsp" }
    ],
    instructions: [
      "Preheat grill to medium-high heat",
      "Season salmon with salt and pepper",
      "Brush asparagus with olive oil",
      "Grill salmon for 4-5 minutes per side",
      "Grill asparagus for 3-4 minutes",
      "Serve with lemon wedges"
    ],
    nutrition: {
      calories: 350,
      protein: 35,
      carbs: 8,
      fat: 18,
      fiber: 3
    },
    difficulty: "Easy",
    prepTime: 10,
    cookTime: 15,
    servings: 2,
    cuisine: "American",
    dietary: ["gluten-free", "keto-friendly"],
    rating: 4.5,
    reviewCount: 128,
    isPublic: true
  }
]);

print("✅ MongoDB initialized with sample data");
