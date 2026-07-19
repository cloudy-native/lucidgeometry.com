import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

type Theme = "light" | "dark";

function getPreferredTheme(): Theme {
  if (typeof window === "undefined") return "dark";
  try {
    const stored = localStorage.getItem("theme");
    if (stored === "light" || stored === "dark") return stored;
  } catch {
    // ignore
  }
  return "dark";
}

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
  try {
    localStorage.setItem("theme", theme);
  } catch {
    // ignore
  }
}

export default function ThemeSwitch() {
  const [theme, setTheme] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTheme(getPreferredTheme());
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-6 w-6" aria-hidden="true" />;
  }

  const isLight = theme === "light";

  return (
    <button
      type="button"
      aria-label={isLight ? "Switch to dark mode" : "Switch to light mode"}
      className="cursor-pointer rounded-lg p-1 text-zinc-500 transition-opacity hover:opacity-80"
      onClick={() => {
        const next: Theme = isLight ? "dark" : "light";
        setTheme(next);
        applyTheme(next);
      }}
    >
      {isLight ? <Sun size={22} /> : <Moon size={22} />}
    </button>
  );
}
