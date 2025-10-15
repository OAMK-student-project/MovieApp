import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSun as faSunRegular } from "@fortawesome/free-regular-svg-icons"
import { faMoon as faMoonSolid } from "@fortawesome/free-solid-svg-icons"
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
const isMoon = theme === "dark";
return (
    <button
        className="login-link toggle-button"
        onClick={nextTheme}
        aria-label={`Switch theme (current: ${label})`}
        title={`Switch theme (current: ${label})`}
        type="button"
        >
        <FontAwesomeIcon
            icon={isMoon ? faMoonSolid : faSunRegular}
            className="theme-toggle_icon"
            size="lg"
            />
            
    </button>
);
}