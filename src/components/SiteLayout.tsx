import { useEffect } from "react";
import { Link, NavLink, Outlet, ScrollRestoration } from "react-router-dom";
import { FiMoon, FiSun } from "react-icons/fi";
import { site } from "../content/site";
import { useThemeStore } from "../zustand/useThemeStore";

const NAV = [
  { to: "/projects", label: "프로젝트" },
  { to: "/behind", label: "비하인드" },
  { to: "/studio", label: "스튜디오" },
  { to: "/contact", label: "문의" },
];

const SiteLayout = () => {
  const { theme, toggleTheme } = useThemeStore();

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  return (
    <div className="site">
      <p className="notice">{site.tagline}</p>
      <header className="site-header">
        <div className="container header-inner">
          <Link to="/" className="brand" aria-label={`${site.brand} 홈`}>
            {site.brandShort}
          </Link>
          <nav className="nav" aria-label="주 메뉴">
            {NAV.map((item) => (
              <NavLink key={item.to} to={item.to} className="pill">
                {item.label}
              </NavLink>
            ))}
            <button
              type="button"
              className="pill pill-icon"
              onClick={toggleTheme}
              aria-label={theme === "light" ? "다크 모드" : "라이트 모드"}
            >
              {theme === "light" ? <FiMoon /> : <FiSun />}
            </button>
          </nav>
        </div>
      </header>

      <main className="site-main">
        <Outlet />
      </main>

      <footer className="site-footer">
        <div className="container footer-inner">
          <p className="footer-brand">{site.brandShort}</p>
          <p>
            <a href={`mailto:${site.email}`}>{site.email}</a>
            {site.phone && <> · {site.phone}</>}
            {site.instagram && (
              <>
                {" · "}
                <a href={site.instagram} target="_blank" rel="noreferrer">
                  Instagram
                </a>
              </>
            )}
            {" · "}
            {site.address}
          </p>
          <p className="footer-copy">
            © {new Date().getFullYear()} {site.brand}. All rights reserved.
          </p>
        </div>
      </footer>
      <ScrollRestoration />
    </div>
  );
};

export default SiteLayout;
