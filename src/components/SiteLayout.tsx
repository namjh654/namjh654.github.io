import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, ScrollRestoration, useLocation } from "react-router-dom";
import { games } from "../content";
import { site } from "../content/site";

const NAV = [
  { to: "/projects", label: "프로젝트" },
  ...(games.length ? [{ to: "/games", label: "게임" }] : []),
  { to: "/career", label: "커리어" },
  { to: "/blog", label: "블로그" },
  { to: "/about", label: "소개" },
];

const SiteLayout = () => {
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => setMenuOpen(false), [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
  }, [menuOpen]);

  return (
    <div className="site">
      <header className="site-header">
        <div className="container header-inner">
          <Link to="/" className="brand" aria-label={`${site.brandKo} 홈`}>
            {site.brand}
          </Link>
          <nav className="nav-desktop" aria-label="주 메뉴">
            {NAV.map((item) => (
              <NavLink key={item.to} to={item.to} className="nav-link">
                {item.label}
              </NavLink>
            ))}
          </nav>
          <Link to="/contact" className="btn btn-sm header-cta">
            문의하기
          </Link>
          <button
            type="button"
            className="menu-toggle"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "메뉴 닫기" : "메뉴 열기"}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            <span />
            <span />
          </button>
        </div>
      </header>

      <div id="mobile-menu" className="mobile-menu" hidden={!menuOpen}>
        <nav className="container" aria-label="모바일 메뉴">
          {[...NAV, { to: "/contact", label: "문의하기" }].map((item) => (
            <NavLink key={item.to} to={item.to} className="mobile-link">
              {item.label}
            </NavLink>
          ))}
          <a href={site.github} className="mobile-link" target="_blank" rel="noreferrer">
            GitHub ↗
          </a>
        </nav>
      </div>

      <main className="site-main">
        <Outlet />
      </main>

      <footer className="site-footer">
        <div className="container">
          <div className="footer-top">
            <p className="footer-brand">{site.brand}</p>
            <ul className="footer-links">
              {NAV.map((item) => (
                <li key={item.to}>
                  <Link to={item.to}>{item.label}</Link>
                </li>
              ))}
              <li>
                <Link to="/contact">문의하기</Link>
              </li>
            </ul>
          </div>
          <p className="footer-info">
            <a href={`mailto:${site.email}`}>{site.email}</a>
            {"  |  "}
            <a href={site.github} target="_blank" rel="noreferrer">
              github.com/namjh654
            </a>
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
