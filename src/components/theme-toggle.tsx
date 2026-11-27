"use client";

import { MonitorIcon, MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

type Theme = "light" | "system" | "dark";

const THEME_OPTIONS: {
  value: Theme;
  icon: React.ElementType;
  label: string;
}[] = [
  { value: "light", icon: SunIcon, label: "Light" },
  { value: "system", icon: MonitorIcon, label: "System" },
  { value: "dark", icon: MoonIcon, label: "Dark" },
];

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch: don't render theme-aware UI until mounted on client
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Skeleton placeholder with same dimensions to prevent layout shift
    return <div className="h-8 w-[108px] rounded-md bg-muted animate-pulse" />;
  }

  return (
    <fieldset
      className="m-0 flex items-center gap-0.5 rounded-md border border-border bg-muted p-0.5"
      aria-label="Theme"
    >
      {THEME_OPTIONS.map(({ value, icon: Icon, label }) => (
        <Button
          key={value}
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setTheme(value)}
          aria-label={label}
          aria-pressed={theme === value}
          className={cn(
            "h-7 w-8 rounded-sm p-0 transition-colors",
            theme === value
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:bg-transparent hover:text-foreground",
          )}
        >
          <Icon className="size-3.5" />
        </Button>
      ))}
    </fieldset>
  );
}

export function SidebarThemeCycleButton() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentIndex = THEME_OPTIONS.findIndex((opt) => opt.value === theme);
  const current =
    currentIndex >= 0 ? THEME_OPTIONS[currentIndex] : THEME_OPTIONS[1];
  const next =
    THEME_OPTIONS[
      ((currentIndex >= 0 ? currentIndex : 1) + 1) % THEME_OPTIONS.length
    ];
  const Icon = mounted ? current.icon : MonitorIcon;

  return (
    <SidebarMenuButton
      tooltip={mounted ? `Theme: ${current.label}` : "Theme"}
      onClick={() => setTheme(next.value)}
      className="hidden h-10 gap-x-4 px-4 group-data-[collapsible=icon]:flex"
    >
      <Icon className="size-4" />
      <span>Theme: {mounted ? current.label : "System"}</span>
    </SidebarMenuButton>
  );
}
