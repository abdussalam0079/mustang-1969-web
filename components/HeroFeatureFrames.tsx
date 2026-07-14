"use client";

import React, { useMemo } from "react";

/**
 * Frame-beneath-hero section using your existing FeatureSection visual language.
 * IMPORTANT: This is NOT the ScrollScrubHero GSAP canvas frame-pilot.
 * It’s a static “frame” backdrop + matching text reveal blocks under HeroReveal.
 */
export default function HeroFeatureFrames() {
  const frames = useMemo(() => {
    // Uses your already-present public/frames assets.
    // Pick a subset for performance.
    const nums = [1, 8, 16, 24, 32, 40, 48, 56, 64, 72, 80, 88];
    return nums.map((n) => `/frames/f_${String(n).padStart(3, "0")}.jpg`);
  }, []);

  return (
    <section
      className="hero-feature-frames"
      style={{ position: "relative", background: "#000", overflow: "hidden" }}
    >
      {/* Frame backdrop strip (original) */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          display: "grid",
          gridTemplateColumns: "repeat(12, 1fr)",
          gap: 0,
          opacity: 0.9,
        }}
      >
        {frames.map((src, i) => (
          <div
            key={src}
            style={{
              gridColumn: `span ${i % 3 === 0 ? 2 : 1}`,
              backgroundImage: `url(${src})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "contrast(1.05) saturate(1.05)",
              transform: `translateY(${(i % 4) * 2}px)`,
            }}
          />
        ))}
      </div>




      {/* Content overlay */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          padding: "clamp(2rem, 4vw, 4rem) 6vw",
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: "2rem",
          color: "#fff",
        }}
      >
        <div
          className="reveal"
          style={{
            maxWidth: 900,
            justifySelf: "start",
          }}
        >
          <div className="icon-tile" style={{ width: 40, height: 40 }}>
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              style={{ margin: "auto", display: "block" }}
            >
              <path
                d="M9 2L11.5 7H16.5L12.5 10.5L14 16L9 13L4 16L5.5 10.5L1.5 7H6.5L9 2Z"
                fill="white"
              />
            </svg>
          </div>

          <div style={{ marginTop: 14, fontFamily: "'Manrope', 'Inter', sans-serif" }}>
            <div
              style={{
                fontSize: 12,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.6)",
              }}
            >
              A frame beneath the hero
            </div>
            <h2
              style={{
                marginTop: 10,
                fontFamily: "'Orbitron', sans-serif",
                fontWeight: 700,
                letterSpacing: "-0.02em",
                fontSize: "clamp(2rem, 4.2vw, 3.3rem)",
                lineHeight: 1.05,
                whiteSpace: "pre-line",
              }}
            >
              Mustang Dark Horse
              <br />
              exposed in motion
            </h2>
            <p
              style={{
                marginTop: 14,
                fontFamily: "'Manrope', 'Inter', sans-serif",
                fontSize: "clamp(0.95rem, 1.2vw, 1.05rem)",
                lineHeight: 1.7,
                color: "rgba(255,255,255,0.72)",
                maxWidth: 60 * 10,
              }}
            >
              Instead of inserting a new scroll-canvas pilot, this section uses your
              existing frame assets to build the “bent-hero” vibe, then reveals the
              feature copy in the same visual language as your FeatureSection.
            </p>
          </div>
        </div>

        {/* Minimal overlay to match the “frame card” feel */}
        <div
          className="reveal"
          style={{
            maxWidth: 1100,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 16,
          }}
        >
          {[
            { k: "500 HP*", v: "Naturally aspirated\nV8 output" },
            { k: "3,700 LBS", v: "Curb weight\nracing configuration" },
            { k: "1.35 HP/LB*", v: "Power-to-weight\nratio" },
          ].map((item) => (
            <div
              key={item.k}
              style={{
                background: "rgba(0,0,0,0.45)",
                border: "1px solid rgba(255,255,255,0.10)",
                padding: "1.1rem 1.1rem",
                borderRadius: 14,
                backdropFilter: "blur(6px)",
              }}
            >
              <div
                style={{
                  fontFamily: "'Orbitron', sans-serif",
                  fontWeight: 800,
                  color: "#E60000",
                  letterSpacing: "-0.02em",
                  fontSize: "1.8rem",
                  lineHeight: 1,
                }}
              >
                {item.k}
              </div>
              <div
                style={{
                  marginTop: 8,
                  whiteSpace: "pre-line",
                  fontFamily: "'Inter', sans-serif",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "rgba(255,255,255,0.58)",
                  fontSize: "0.72rem",
                  lineHeight: 1.5,
                }}
              >
                {item.v}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

