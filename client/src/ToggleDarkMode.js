import { useState, useEffect } from "react";
import { LuSun } from "react-icons/lu";
import { LuMoon } from "react-icons/lu";

const ToggleDarkMode = () => {

    const [isChecked, setIsChecked] = useState(false);
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem("theme") || "light";
    });

    const toggleDarkMode = () => {
        setTheme(prev => (prev === "dark" ? "light" : "dark"));
        setIsChecked(prev =>(prev === true ? false : true));
    };

    useEffect(() => {
        document.body.classList.toggle("dark", theme === "dark");
        localStorage.setItem("theme", theme);
    }, [theme]);

    return (
        // <button onClick={toggleDarkMode}>
        //     {theme === "dark" ? "Light Mode" : "Dark Mode"}
        // </button>
        <label id="themeSwitch">
            <input type="checkbox" id="darkCheckbox" onChange={toggleDarkMode} />
            <div className="toggler">{isChecked ? <LuMoon /> : <LuSun />}</div>
        </label>
    );

}
export default ToggleDarkMode;