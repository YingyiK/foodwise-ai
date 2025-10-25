import { Recipe } from "../types/recipe";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { ShoppingCart, Calendar, Clock } from "lucide-react";

interface SchedulePanelProps {
  availableRecipes: Recipe[];
  onGenerateShoppingList: () => void;
}

export function SchedulePanel({ availableRecipes, onGenerateShoppingList }: SchedulePanelProps) {
  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const mealTypes = ["Breakfast", "Lunch", "Dinner"];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Weekly Meal Schedule</h3>
          <p className="text-sm text-muted-foreground">
            Drag recipes to schedule your meals for the week
          </p>
        </div>
        <Button onClick={onGenerateShoppingList} className="gap-2">
          <ShoppingCart className="h-4 w-4" />
          Generate Shopping List
        </Button>
      </div>

      {/* Weekly Calendar */}
      <div className="grid grid-cols-7 gap-4">
        {daysOfWeek.map((day) => (
          <Card key={day} className="p-4">
            <div className="text-center mb-4">
              <h4 className="font-medium">{day}</h4>
            </div>
            
            <div className="space-y-3">
              {mealTypes.map((meal) => (
                <div
                  key={meal}
                  className="border-2 border-dashed border-muted-foreground/20 rounded-lg p-3 min-h-[80px] flex items-center justify-center"
                >
                  <div className="text-center">
                    <div className="text-sm font-medium text-muted-foreground">{meal}</div>
                    <div className="text-xs text-muted-foreground">Drop recipe here</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      {/* Available Recipes */}
      <div>
        <h4 className="text-lg font-semibold mb-4">Available Recipes</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {availableRecipes.slice(0, 8).map((recipe) => (
            <Card key={recipe.id} className="p-4 cursor-move hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3">
                <img
                  src={recipe.image}
                  alt={recipe.name}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                  <h5 className="font-medium text-sm line-clamp-1">{recipe.name}</h5>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs">
                      {recipe.cuisine}
                    </Badge>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {recipe.prepTime + recipe.cookTime}min
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
