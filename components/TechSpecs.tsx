"use client";

import { useEffect, useRef } from "react";

const specs = [
  {
    group: "Engine",
    items: [
      { label: "Displacement",   value: "5.2L" },
      { label: "Configuration",  value: "V8 Flat-Plane" },
      { label: "Induction",      value: "Naturally Aspirated" },
      { label: "Power Output",   value: "500 HP*" },
      { label: "Torque",         value: "418 lb-ft" },
      { label: "Redline",        value: "8,250 RPM" },
    ],
  },
  {
    group: "Performance",
    items: [
      { label: "0–60 mph",       value: "3.5 sec*" },
      { label: "Quarter Mile",   value: "11.6 sec*" },
      { label: "Top Speed",      value: "180 mph*" },
      { label: "Braking 60–0",   value: "99 ft*" },
    ],
  },
  {
    group: "Chassis & Body",
    items: [
      { label: "Curb Weight",       value: "3,700 lbs" },
      { label: "Power-to-Weight",   value: "1.35 HP/lb" },
      { label: "Front Suspension",  value: "MagneRide 4.0" },
      { label: "Rear Suspension",   value: "Torsen LSD" },
      { label: "Brake System",      value: "Brembo Carbon-Ceramic" },
      { label: "Wheel Size",        value: "20\" Forged Alloy" },
    ],
  },
  {
    group: "Dimensions",
    items: [
      { label: "Length",          value: "188.5 in" },
      { label: "Width",           value: "75.4 in" },
      { label: "Height",          value: "54.5 in" },
      { label: "Wheelbase",       value: "107.1 in" },
      { label: "Fuel Capacity",   value: "16.0 gal" },
      { label: "Production Run",  value: "500 units" },
    ],
  },
];

export default function TechSpecs() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.querySelectorAll(".reveal").forEach((el, i) => {
              setTimeout(() => el.classList.add("is-visible"), i * 40);
            });
          }
        });
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="specs-section"
      style={{
        background: "#101010",
        padding: "120px 24px",
        borderTop: "1px solid #2A2A2A",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div className="reveal" style={{ marginBottom: "64px" }}>
          <p className="specs-group-label" style={{ marginBottom: "16px" }}>
            Technical Specifications
          </p>
          <h2
            style={{
              fontFamily: "'Orbitron', sans-serif",
              fontSize: "clamp(1.875rem, 4vw, 3.25rem)",
              fontWeight: 600,
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              color: "#F5F5F5",
              marginBottom: "16px",
            }}
          >
            Engineered for the extreme.
          </h2>
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "clamp(0.9375rem, 1.1vw, 1.0625rem)",
              color: "#B8B8B8",
              lineHeight: 1.65,
              maxWidth: "48ch",
            }}
          >
            Every specification exists for a reason. Every component chosen to push
            further than anything that came before.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "48px",
          }}
        >
          {specs.map((group, gi) => (
            <div key={group.group}>
              <p
                className="reveal specs-group-label"
                style={{ transitionDelay: `${gi * 40}ms` }}
              >
                {group.group}
              </p>
              {group.items.map((item, ii) => (
                <div
                  key={item.label}
                  className="reveal specs-row"
                  style={{ transitionDelay: `${gi * 40 + ii * 25}ms` }}
                >
                  <span className="specs-label">{item.label}</span>
                  <span className="specs-value">{item.value}</span>
                </div>
              ))}
            </div>
          ))}
        </div>

        <p
          className="reveal"
          style={{
            marginTop: "48px",
            fontFamily: "'Inter', sans-serif",
            fontSize: "0.8125rem",
            color: "#858585",
            lineHeight: 1.7,
          }}
        >
          *Figures shown are illustrative — replace with your trim&apos;s official specifications.
          Actual performance may vary based on conditions and configuration.
        </p>
      </div>
    </section>
  );
}
