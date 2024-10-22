import { useEffect } from "react";
import { useThemeStore } from "../zustand/useThemeStore";
import { FaSun, FaMoon } from "react-icons/fa"; // Import icons
import "../styles/Header.css"; // Import the CSS file from styles folder

const Header = () => {
  const { theme, toggleTheme } = useThemeStore();

  useEffect(() => {
    document.body.className = theme; // Apply theme to the body
  }, [theme]);

  return (
    <header className="header">
      <p>Header</p>
      {/* Theme Toggle Button */}
      <button className="theme-toggle-button" onClick={toggleTheme}>
        {theme === "light" ? <FaMoon /> : <FaSun />}{" "}
        {/* Toggle icon based on the current theme */}
      </button>
    </header>
  );
};

export default Header;
