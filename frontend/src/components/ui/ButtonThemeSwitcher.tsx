import { Moon, Sun } from "lucide-react";
import { Button } from "./button";
import { useTheme } from "./theme-provider";

const ButtonThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div>
      {theme == "dark" ? (
        <Button
          variant="ghost"
          className="hover:cursor-pointer"
          onClick={() => setTheme("light")}
        >
          <Sun className="w-4 h-4" />{" "}
        </Button>
      ) : (
        <Button
          variant="ghost"
          className="hover:cursor-pointer"
          onClick={() => setTheme("dark")}
        >
          <Moon className="w-4 h-4" />{" "}
        </Button>
      )}
    </div>
  );
};

export default ButtonThemeSwitcher;
