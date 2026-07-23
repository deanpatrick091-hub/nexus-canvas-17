import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Switch } from "@/components/ui/switch";

const STORAGE_KEY = "nexus-theme";

function getInitial(): boolean {
  if (typeof window === "undefined") return false;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) return stored === "dark";
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export function ThemeToggle() {
  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const initial = getInitial();
    setDark(initial);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem(STORAGE_KEY, dark ? "dark" : "light");
  }, [dark, mounted]);

  return (
    <label className="flex items-center gap-2 px-2 h-9 rounded-md cursor-pointer select-none" aria-label="Toggle dark mode">
      <Sun className={`w-4 h-4 transition-colors ${dark ? "text-muted-foreground" : "text-foreground"}`} />
      <Switch checked={dark} onCheckedChange={setDark} aria-label="Dark mode" />
      <Moon className={`w-4 h-4 transition-colors ${dark ? "text-foreground" : "text-muted-foreground"}`} />
    </label>
  );
}
