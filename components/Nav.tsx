"use client";

import { useEffect, useState } from "react";

const NAV_LINKS = [
  { label: "Overview",    href: "#top" },
  { label: "Performance", href: "#performance" },
  { label: "Design",      href: "#design" },
  { label: "Gallery",     href: "#gallery" },
  { label: "Specs",       href: "#specs-section" },
];

export default function Nav() {
  const [solid, setSolid]     = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`header${solid ? " solid" : ""}`}>
      {/* Left: Logo */}
      <div className="header__left">
        <a href="#top" className="header__logo-text" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{
            display: "inline-block",
            width: 6, height: 6,
            borderRadius: "50%",
            background: "#E60000",
            flexShrink: 0,
            boxShadow: "0 0 8px rgba(230,0,0,0.8)",
          }} />
          Mustang
        </a>
      </div>

      {/* Center: Menu toggle */}
      <div className="header__center" style={{ position: "relative" }}>
        <button
          className="header__mark"
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          style={{ background: "none", border: "none", padding: "0.5rem 1rem" }}
        >
          {menuOpen ? "Close" : "Menu"}
        </button>

        {menuOpen && (
          <>
            {/* Backdrop */}
            <div
              onClick={() => setMenuOpen(false)}
              style={{ position: "fixed", inset: 0, zIndex: 150 }}
            />
            <div style={{
              position: "absolute",
              top: "calc(100% + 12px)",
              left: "50%",
              transform: "translateX(-50%)",
              background: "rgba(8,8,8,0.85)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              border: "1px solid rgba(255,255,255,0.08)",
              minWidth: "220px",
              zIndex: 200,
              overflow: "hidden",
            }}>
              {NAV_LINKS.map((item, i) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0.9rem 1.4rem",
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "0.75rem",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "rgba(245,245,245,0.55)",
                    textDecoration: "none",
                    borderBottom: i < NAV_LINKS.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
                    transition: "color 0.2s, background 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.color = "#F5F5F5";
                    (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.color = "rgba(245,245,245,0.55)";
                    (e.currentTarget as HTMLElement).style.background = "transparent";
                  }}
                >
                  {item.label}
                  <span style={{ color: "#E60000", fontSize: "0.6rem" }}>→</span>
                </a>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="header__right" />
    </header>
  );
}
