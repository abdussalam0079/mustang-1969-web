"use client";

import { useEffect, useState } from "react";

export default function Nav() {
  const [solid, setSolid] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header id="header-menu" className={`header${solid ? " solid" : ""}`}>
      {/* ── Left: Logo ── */}
      <div className="header__left">
        <a href="#top" className="header__logo-text">Mustang</a>
      </div>

      {/* ── Center: compact mark ── */}
      <div className="header__center">
        <button
          className="header__mark"
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
        >
          Menu
        </button>
        {menuOpen && (
          <div
            style={{
              position: "absolute",
              top: "calc(100% + 4px)",
              left: "50%",
              transform: "translateX(-50%)",
              background: "#101010",
              border: "1px solid #2A2A2A",
              minWidth: "200px",
              zIndex: 200,
            }}
          >
            {[
              { label: "Overview",    href: "#top" },
              { label: "Performance", href: "#performance" },
              { label: "Design",      href: "#design" },
              { label: "Gallery",     href: "#gallery" },
              { label: "Specs",       href: "#specs-section" },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                style={{
                  display: "block",
                  padding: "0.85rem 1.25rem",
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "0.8125rem",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "#B8B8B8",
                  textDecoration: "none",
                  borderBottom: "1px solid #2A2A2A",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "#F5F5F5")}
                onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "#B8B8B8")}
              >
                {item.label}
              </a>
            ))}
          </div>
        )}
      </div>

      {/* ── Right: Contact ── */}
      <div className="header__right">
        <a href="#contact" className="c-button c-button--sm c-button--ghost">
          Contact
        </a>
      </div>
    </header>
  );
}
