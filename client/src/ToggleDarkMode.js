import { useState, useEffect } from "react";

const ToggleDarkMode = () => {

    const [theme, setTheme] = useState(() => {
        return localStorage.getItem("theme") || "light";
    });

    const toggleDarkMode = () => {
        setTheme(prev => (prev === "dark" ? "light" : "dark"));
    };

    useEffect(() => {
        document.body.classList.toggle("dark", theme === "dark");
        localStorage.setItem("theme", theme);
    }, [theme]);

    return (
        <button onClick={toggleDarkMode}>
            {theme === "dark" ? "Light Mode" : "Dark Mode"}
        </button>
    );

}
export default ToggleDarkMode;