import { Recipe } from "../types/recipe";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { X, ShoppingCart, Print, Trash2 } from "lucide-react";

interface ShoppingListSidebarProps {
  recipes: Recipe[];
  isOpen: boolean;
  onClose: () => void;
}

export function ShoppingListSidebar({ recipes, isOpen, onClose }: ShoppingListSidebarProps) {
  if (!isOpen) return null;

  // Generate shopping list from recipes
  const generateShoppingList = () => {
    const ingredients: { [key: string]: { amount: number; unit: string; name: string } } = {};
    
    recipes.forEach(recipe => {
      recipe.ingredients.forEach(ingredient => {
        if (ingredient.isCommon) return; // Skip common ingredients
        
        const key = ingredient.name.toLowerCase();
        if (ingredients[key]) {
          ingredients[key].amount += ingredient.amount;
        } else {
          ingredients[key] = {
            amount: ingredient.amount,
            unit: ingredient.unit,
            name: ingredient.name
          };
        }
      });
    });

    return Object.values(ingredients);
  };

  const shoppingList = generateShoppingList();

  return (
    <div className="fixed inset-0 z-50 bg-black/50" onClick={onClose}>
      <div className="fixed right-0 top-0 h-full w-96 bg-background border-l shadow-lg" onClick={(e) => e.stopPropagation()}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              <h2 className="text-lg font-semibold">Shopping List</h2>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {shoppingList.length > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    {shoppingList.length} items
                  </p>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Print className="h-4 w-4" />
                    Print
                  </Button>
                </div>

                <div className="space-y-3">
                  {shoppingList.map((item, index) => (
                    <Card key={index} className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">{item.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {item.amount} {item.unit}
                          </p>
                        </div>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-medium mb-2">No items yet</h3>
                <p className="text-sm text-muted-foreground">
                  Add recipes to your schedule to generate a shopping list
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          {shoppingList.length > 0 && (
            <div className="p-6 border-t">
              <Button className="w-full" size="lg">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Shop Online
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
