import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Menu, Utensils, Home, Sparkles, Calendar, User } from "lucide-react";

interface FoodHeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function FoodHeader({ activeTab, onTabChange }: FoodHeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "recommendations", label: "Recommendations", icon: Sparkles },
    { id: "schedule", label: "Schedule", icon: Calendar },
    { id: "profile", label: "Profile", icon: User },
  ];

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur transition-shadow ${
        isScrolled ? "shadow-md" : ""
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="bg-primary rounded-lg p-2">
              <Utensils className="h-6 w-6 text-primary-foreground" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl">FoodWise AI</h1>
              <p className="text-xs text-muted-foreground">Smart Meal Planning</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`flex items-center gap-2 text-sm transition-colors hover:text-foreground relative ${
                    activeTab === item.id
                      ? "text-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                  {activeTab === item.id && (
                    <div className="absolute -bottom-[21px] left-0 right-0 h-0.5 bg-primary" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* User Profile */}
          <div className="flex items-center gap-4">
            <Avatar className="cursor-pointer hidden sm:flex">
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <nav className="flex flex-col gap-4 mt-8">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => onTabChange(item.id)}
                        className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                          activeTab === item.id
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-accent"
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        {item.label}
                      </button>
                    );
                  })}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
