import React, { useEffect } from "react";
import "./Root.css";
import { useThemeStore } from "./zustand/useThemeStore";
import { Outlet } from "react-router";
import Layout from "./layout/Layout";

function Root() {
  const { theme, toggleTheme } = useThemeStore();

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  return (
    <Layout>
      <div className="App">
        asdasdasd
        {/* Outlet으로 하위 페이지 호출 */}
        <Outlet />
      </div>
    </Layout>
  );
}

export default Root;
