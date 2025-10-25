export interface Recipe {
  id: string;
  name: string;
  image: string;
  description: string;
  healthScore: number; // 0-100
  preferenceMatch: number; // 0-100 (AI-powered match)
  cuisine: string;
  calories: number;
  prepTime: number; // minutes
  cookTime: number;
  servings: number;
  dietary: string[]; // e.g., "vegetarian", "vegan", "gluten-free"
  ingredients: Ingredient[];
  instructions: string[];
  nutrition: {
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
    sugar: number;
  };
  tags: string[];
}

export interface Ingredient {
  id: string;
  name: string;
  amount: number;
  unit: string;
  isCommon?: boolean; // salt, pepper, oil, etc.
}

export interface MealSlot {
  day: number; // 0-6 (Sunday-Saturday)
  mealType: "breakfast" | "lunch" | "dinner";
  recipe?: Recipe;
}

export interface SearchFilters {
  query: string;
  cuisines: string[];
  dietary: string[];
  maxCalories?: number;
  maxPrepTime?: number;
  healthGoals: string[];
}
