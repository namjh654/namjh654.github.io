import React, { useEffect } from "react";
import { FaBars, FaMoon, FaSun } from "react-icons/fa"; // 드로어 아이콘과 테마 아이콘
import { useThemeStore } from "../zustand/useThemeStore";
import "../styles/Header.css";
import useDrawerStore from "../zustand/useDrawerStore";

const Header = () => {
  const { theme, toggleTheme } = useThemeStore();
  const { toggleDrawer } = useDrawerStore();
  useEffect(() => {
    document.body.className = theme; // Apply theme to the body
  }, [theme]);

  return (
    <header className="header">
      {/* Left: Drawer Button */}
      <button className="drawer-button" onClick={toggleDrawer}>
        <FaBars />
      </button>

      {/* Center: Header title */}
      <p className="header-title">BongBongE2Blog :3B </p>

      {/* Right: Theme Toggle Button and Profile Picture */}
      <div className="header-right">
        <button className="theme-toggle-button" onClick={toggleTheme}>
          {theme === "light" ? <FaMoon /> : <FaSun />}
        </button>
        <img
          src="https://picsum.photos/50/50" // 프로필 이미지 경로
          alt="Profile"
          className="profile-picture"
        />
      </div>
    </header>
  );
};

export default Header;
