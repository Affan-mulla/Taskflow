import { useTheme, type Theme } from "@/shared/providers/ThemeProvider";
import { Monitor, Moon, Sun } from "@hugeicons/core-free-icons";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";

const ThemeToggler = () => {
  const { theme : currentTheme, setTheme } = useTheme();
  const item = [
    { icon: Sun, label: "Light" },
    { icon: Moon, label: "Dark" },
    { icon: Monitor, label: "System" },
  ]
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant="outline" size={"icon"}>
          <HugeiconsIcon icon={currentTheme === "light" ? Sun : currentTheme === "dark" ? Moon : Monitor} className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-42" side="right">
        <Label className="px-2 py-1  text-xs font-medium text-muted-foreground ">Select Theme</Label>
        <Separator />
        {item.map((theme) => (
          <DropdownMenuItem className="cursor-pointer" onClick={() => setTheme(theme.label.toLowerCase() as Theme)}>
          <HugeiconsIcon icon={theme.icon} strokeWidth={2} className="text-muted-foreground" />
          <span className="font-medium text-sm">{theme.label}</span>
        </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ThemeToggler;