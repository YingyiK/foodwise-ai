import { Recipe } from "../types/recipe";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { X, Clock, Users, Flame, Calendar, MapPin, Heart } from "lucide-react";

interface RecipeDetailModalProps {
  recipe: Recipe | null;
  isOpen: boolean;
  onClose: () => void;
  onSchedule: (recipe: Recipe) => void;
}

export function RecipeDetailModal({ recipe, isOpen, onClose, onSchedule }: RecipeDetailModalProps) {
  if (!isOpen || !recipe) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50" onClick={onClose}>
      <div 
        className="fixed inset-4 bg-background rounded-lg shadow-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-2xl font-bold">{recipe.name}</h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Image and Info */}
              <div className="space-y-6">
                <img
                  src={recipe.image}
                  alt={recipe.name}
                  className="w-full h-64 object-cover rounded-lg"
                />

                <div className="space-y-4">
                  <p className="text-muted-foreground">{recipe.description}</p>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{recipe.prepTime + recipe.cookTime} min</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{recipe.servings} servings</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Flame className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{recipe.calories} cal</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Heart className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Health: {recipe.healthScore}</span>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">{recipe.cuisine}</Badge>
                    {recipe.dietary.map((diet) => (
                      <Badge key={diet} variant="secondary">{diet}</Badge>
                    ))}
                    {recipe.tags.map((tag) => (
                      <Badge key={tag} variant="outline">{tag}</Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column - Ingredients and Instructions */}
              <div className="space-y-6">
                {/* Ingredients */}
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Ingredients</h3>
                  <ul className="space-y-2">
                    {recipe.ingredients.map((ingredient, index) => (
                      <li key={index} className="flex justify-between">
                        <span>{ingredient.name}</span>
                        <span className="text-muted-foreground">
                          {ingredient.amount} {ingredient.unit}
                        </span>
                      </li>
                    ))}
                  </ul>
                </Card>

                {/* Instructions */}
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Instructions</h3>
                  <ol className="space-y-3">
                    {recipe.instructions.map((instruction, index) => (
                      <li key={index} className="flex gap-3">
                        <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </span>
                        <span>{instruction}</span>
                      </li>
                    ))}
                  </ol>
                </Card>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t">
            <div className="flex gap-4">
              <Button onClick={() => onSchedule(recipe)} className="flex-1 gap-2">
                <Calendar className="h-4 w-4" />
                Schedule This Recipe
              </Button>
              <Button variant="outline" className="gap-2">
                <MapPin className="h-4 w-4" />
                Find Restaurant
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
