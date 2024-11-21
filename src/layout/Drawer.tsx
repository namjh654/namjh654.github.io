import { useThemeStore } from "../zustand/useThemeStore";
import {
  FaHome,
  FaInfoCircle,
  FaCode,
  FaMobileAlt,
  FaDesktop,
  FaUserCircle,
  FaChrome,
  FaRegCalendarAlt,
  FaDelicious,
  FaBookmark,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import useDrawerStore from "../zustand/useDrawerStore";
import "../styles/Drawer.css";
import profile from "../assets/logo/bbeb.jpg";
const DrawerLayout = () => {
  const { theme } = useThemeStore();
  const navigate = useNavigate();
  const { closeDrawer } = useDrawerStore();

  // 하위 메뉴 상태 관리
  const [openSubMenus, setOpenSubMenus] = useState<{ [key: string]: boolean }>({
    development: false,
    personal: false,
  });

  const handleNavigate = (path: string) => {
    navigate(path);
    closeDrawer();
  };

  const toggleSubMenu = (menu: string) => {
    setOpenSubMenus((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }));
  };

  return (
    <div className={`drawer ${theme}`}>
      {/* Profile Section */}
      <div className="profile-section">
        <div className="profile-background">
          <img src={profile} alt="Profile" className="profile-image" />
          <p className="user-role">주인장</p>
          <h2 className="profile-name">봉봉이 블로그</h2>
          <p className="profile-email">namjh654@naver.com</p>
        </div>
      </div>

      {/* Menu Section */}
      <div className="menu-section">
        <button onClick={() => handleNavigate("/")} className="menu-item">
          <FaHome className="icon" /> 홈
        </button>

        {/* Development Section with Submenu */}
        <button
          onClick={() => toggleSubMenu("development")}
          className="menu-item"
        >
          <FaCode className="icon" /> 개발
        </button>
        {openSubMenus["development"] && (
          <div className="submenu">
            <button
              onClick={() => handleNavigate("/webdev")}
              className="submenu-item"
            >
              <FaChrome className="icon" />웹 개발
            </button>
            <button
              onClick={() => handleNavigate("/appdev")}
              className="submenu-item"
            >
              <FaMobileAlt className="icon" />앱 개발
            </button>
            <button
              onClick={() => handleNavigate("/devops")}
              className="submenu-item"
            >
              <FaDesktop className="icon" />
              환경구축
            </button>
          </div>
        )}

        {/* Personal Section with Submenu */}
        <button onClick={() => toggleSubMenu("personal")} className="menu-item">
          <FaUserCircle className="icon" /> 개인
        </button>
        {openSubMenus["personal"] && (
          <div className="submenu">
            <button
              onClick={() => handleNavigate("/daily")}
              className="submenu-item"
            >
              <FaBookmark className="icon" /> 일상
            </button>
            <button
              onClick={() => handleNavigate("/schedule")}
              className="submenu-item"
            >
              <FaRegCalendarAlt className="icon" /> 일정
            </button>
          </div>
        )}

        {/* Other Independent Menu Items */}
        <button
          onClick={() => handleNavigate("/dashboard")}
          className="menu-item"
        >
          <FaDelicious className="icon" /> 통계
        </button>
        <button onClick={() => handleNavigate("/about")} className="menu-item">
          <FaInfoCircle className="icon" /> 정보
        </button>
      </div>
    </div>
  );
};

export default DrawerLayout;
