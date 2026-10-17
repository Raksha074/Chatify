import { create } from "zustand";

const initialTheme = localStorage.getItem("chatify-theme") || "dark";
document.documentElement.setAttribute("data-theme", initialTheme);
if (initialTheme === "dark") {
  document.documentElement.classList.add("dark");
  document.documentElement.classList.remove("light");
} else {
  document.documentElement.classList.add("light");
  document.documentElement.classList.remove("dark");
}

export const useThemeStore = create((set, get) => ({
  theme: initialTheme,

  toggleTheme: () => {
    const nextTheme = get().theme === "dark" ? "light" : "dark";
    localStorage.setItem("chatify-theme", nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);

    if (nextTheme === "dark") {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    } else {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
    }

    set({ theme: nextTheme });
  },

  setTheme: (theme) => {
    localStorage.setItem("chatify-theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    } else {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
    }
    set({ theme });
  },
}));
