import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, ScrollRestoration, useLocation } from "react-router-dom";
import { site } from "../content/site";

const NAV = [
  { to: "/projects", label: "프로젝트" },
  { to: "/behind", label: "비하인드" },
  { to: "/studio", label: "스튜디오" },
];

/** data-reveal 요소가 화면에 들어오면 한 번만 부드럽게 나타나게 한다. */
function useReveal(locationKey: string) {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-in)");
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("is-in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        }),
      { rootMargin: "0px 0px -8% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [locationKey]);
}

const SiteLayout = () => {
  const { pathname, search } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  // 첫 화면이 전면 사진인 페이지는 헤더를 투명하게 시작한다.
  const overHero = pathname === "/" || pathname.startsWith("/studio");

  useReveal(pathname + search);
  useEffect(() => setMenuOpen(false), [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
  }, [menuOpen]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const headerClass = [
    "site-header",
    overHero && !scrolled && !menuOpen ? "is-overlay" : "is-solid",
  ].join(" ");

  return (
    <div className="site">
      <header className={headerClass}>
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
            <Link to="/contact" className="btn btn-sm">
              문의하기
            </Link>
          </nav>
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

      <div id="mobile-menu" className={`mobile-menu${menuOpen ? " is-open" : ""}`} hidden={!menuOpen}>
        <nav className="container" aria-label="모바일 메뉴">
          {[...NAV, { to: "/contact", label: "문의하기" }].map((item) => (
            <NavLink key={item.to} to={item.to} className="mobile-link">
              {item.label}
            </NavLink>
          ))}
        </nav>
        <p className="container mobile-menu-foot">{site.email}</p>
      </div>

      <main className="site-main">
        <Outlet />
      </main>

      <footer className="site-footer">
        <div className="container footer-grid">
          <div>
            <p className="footer-brand">{site.brand}</p>
            <p className="footer-text">{site.tagline}</p>
          </div>
          <ul className="footer-list">
            {NAV.map((item) => (
              <li key={item.to}>
                <Link to={item.to}>{item.label}</Link>
              </li>
            ))}
            <li>
              <Link to="/contact">문의하기</Link>
            </li>
          </ul>
          <ul className="footer-list">
            <li>
              <a href={`mailto:${site.email}`}>{site.email}</a>
            </li>
            {site.phone && <li>{site.phone}</li>}
            {site.instagram && (
              <li>
                <a href={site.instagram} target="_blank" rel="noreferrer">
                  Instagram
                </a>
              </li>
            )}
            <li>{site.address}</li>
          </ul>
        </div>
        <p className="container footer-copy">
          © {new Date().getFullYear()} {site.brand}. All rights reserved.
        </p>
      </footer>
      <ScrollRestoration />
    </div>
  );
};

export default SiteLayout;
