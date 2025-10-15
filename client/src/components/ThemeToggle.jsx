import "./ThemeToggle.css" 
import { useEffect, useState } from "react"

const themes = ["dark", "light"]
const storage_key = "theme"

function applyTheme(theme) {
    const root = document.documentElement
    if (theme === "dark") {
        root.removeAttribute("data-theme")
    } else {
        root.setAttribute("data-theme", theme)
    }
}

export default function ThemeToggle() {
    const [theme, setTheme] = useState("dark")

    useEffect(() => {
        const saved = localStorage.getItem(storage_key)
        const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches
        const initial = saved || (prefersDark ? "dark" : "light")
        setTheme(initial)
        applyTheme(initial)
    }, []);

function nextTheme() {
    const idx = themes.indexOf(theme);
    const next = themes[(idx + 1) % themes.length];
    setTheme(next);
    applyTheme(next);
    localStorage.setItem(storage_key, next);
}

const label = theme === "dark" ? "Dark" : "Light";

return (
    <button className="toggle-button"
        onClick={nextTheme}
        aria-label={`Switch theme (current: ${label})`}
        >
        {theme === "light" ? "Light" : "Dark"}
    </button>
);
}