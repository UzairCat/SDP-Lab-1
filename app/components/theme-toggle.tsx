"use client";

import { useEffect, useState } from "react";

type ThemeMode = "light" | "dark";

const storageKey = "todo-appearance-mode";

export function ThemeToggle() {
  const [mode, setMode] = useState<ThemeMode>("light");

  useEffect(() => {
    const savedMode = window.localStorage.getItem(storageKey);
    const nextMode = savedMode === "dark" ? "dark" : "light";

    setMode(nextMode);
    applyTheme(nextMode);
  }, []);

  function handleChange(checked: boolean) {
    const nextMode = checked ? "dark" : "light";

    setMode(nextMode);
    window.localStorage.setItem(storageKey, nextMode);
    applyTheme(nextMode);
  }

  return (
    <label className="theme-toggle">
      <span>Dark mode</span>
      <input
        aria-label="Use dark mode"
        checked={mode === "dark"}
        onChange={(event) => handleChange(event.target.checked)}
        type="checkbox"
      />
      <span className="theme-slider" aria-hidden="true" />
    </label>
  );
}

function applyTheme(mode: ThemeMode) {
  document.documentElement.dataset.theme = mode;
}
