import { SearchFilters } from "../types/recipe";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Search, Filter, X } from "lucide-react";

interface SearchInterfaceProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
}

export function SearchInterface({ filters, onFiltersChange }: SearchInterfaceProps) {
  const cuisines = ["American", "Mediterranean", "Thai", "Italian", "Mexican", "Asian"];
  const dietary = ["vegetarian", "vegan", "gluten-free", "high-protein", "low-carb"];
  const healthGoals = ["weight-loss", "muscle-gain", "heart-healthy", "diabetes-friendly"];

  const handleCuisineToggle = (cuisine: string) => {
    const newCuisines = filters.cuisines.includes(cuisine)
      ? filters.cuisines.filter(c => c !== cuisine)
      : [...filters.cuisines, cuisine];
    onFiltersChange({ ...filters, cuisines: newCuisines });
  };

  const handleDietaryToggle = (diet: string) => {
    const newDietary = filters.dietary.includes(diet)
      ? filters.dietary.filter(d => d !== diet)
      : [...filters.dietary, diet];
    onFiltersChange({ ...filters, dietary: newDietary });
  };

  const handleHealthGoalToggle = (goal: string) => {
    const newGoals = filters.healthGoals.includes(goal)
      ? filters.healthGoals.filter(g => g !== goal)
      : [...filters.healthGoals, goal];
    onFiltersChange({ ...filters, healthGoals: newGoals });
  };

  const clearFilters = () => {
    onFiltersChange({
      query: "",
      cuisines: [],
      dietary: [],
      healthGoals: [],
    });
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          <h3 className="font-semibold">Search & Filters</h3>
        </div>

        {/* Search Query */}
        <div>
          <label className="text-sm font-medium mb-2 block">Search</label>
          <input
            type="text"
            placeholder="Search recipes..."
            value={filters.query}
            onChange={(e) => onFiltersChange({ ...filters, query: e.target.value })}
            className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
          />
        </div>

        {/* Cuisines */}
        <div>
          <label className="text-sm font-medium mb-2 block">Cuisines</label>
          <div className="flex flex-wrap gap-2">
            {cuisines.map((cuisine) => (
              <Badge
                key={cuisine}
                variant={filters.cuisines.includes(cuisine) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => handleCuisineToggle(cuisine)}
              >
                {cuisine}
              </Badge>
            ))}
          </div>
        </div>

        {/* Dietary */}
        <div>
          <label className="text-sm font-medium mb-2 block">Dietary</label>
          <div className="flex flex-wrap gap-2">
            {dietary.map((diet) => (
              <Badge
                key={diet}
                variant={filters.dietary.includes(diet) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => handleDietaryToggle(diet)}
              >
                {diet}
              </Badge>
            ))}
          </div>
        </div>

        {/* Health Goals */}
        <div>
          <label className="text-sm font-medium mb-2 block">Health Goals</label>
          <div className="flex flex-wrap gap-2">
            {healthGoals.map((goal) => (
              <Badge
                key={goal}
                variant={filters.healthGoals.includes(goal) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => handleHealthGoalToggle(goal)}
              >
                {goal}
              </Badge>
            ))}
          </div>
        </div>

        {/* Clear Filters */}
        <Button
          variant="outline"
          onClick={clearFilters}
          className="w-full"
        >
          <X className="h-4 w-4 mr-2" />
          Clear All Filters
        </Button>
      </div>
    </Card>
  );
}
