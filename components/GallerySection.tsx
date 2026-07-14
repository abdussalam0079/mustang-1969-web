"use client";

import { useEffect, useRef } from "react";

const GALLERY_IMAGES = [
  { src: "/images/frame_001.jpg", alt: "Mustang Dark Horse — Front" },
  { src: "/images/frame_002.jpg", alt: "Mustang Dark Horse — Profile" },
  { src: "/images/frame_004.jpg", alt: "Mustang Dark Horse — Rear" },
  { src: "/images/frame_007.jpg", alt: "Mustang Dark Horse — Interior" },
  { src: "/images/frame_009.jpg", alt: "Mustang Dark Horse — Engine" },
  { src: "/images/frame_011.jpg", alt: "Mustang Dark Horse — Track" },
];

export default function GallerySection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.querySelectorAll(".reveal").forEach((el, i) => {
              setTimeout(() => el.classList.add("is-visible"), i * 80);
            });
          }
        });
      },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} id="gallery" className="gallery-section">
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Header row */}
        <div style={{ marginBottom: "48px" }}>
          <p className="reveal t-eyebrow" style={{ marginBottom: "16px" }}>
            Gallery
          </p>
          <h2
            className="reveal t-h2"
            style={{ transitionDelay: "60ms", maxWidth: "520px" }}
          >
            Mustang Dark Horse
          </h2>
          <p
            className="reveal t-body"
            style={{
              transitionDelay: "120ms",
              maxWidth: "52ch",
              marginTop: "16px",
            }}
          >
            A hundred years of American muscle, distilled into 500 landmark
            machines. Every one individually numbered. None will be repeated.
          </p>
        </div>

        {/* Grid */}
        <div className="gallery-grid reveal" style={{ transitionDelay: "180ms" }}>
          {GALLERY_IMAGES.map((img) => (
            <img key={img.src} src={img.src} alt={img.alt} loading="lazy" />
          ))}
        </div>

        {/* Actions */}
        <div
          className="reveal"
          style={{
            display: "flex",
            gap: "16px",
            flexWrap: "wrap",
            transitionDelay: "260ms",
          }}
        >
          <a href="#contact" className="c-button c-button--primary">
            Request It Now
          </a>
          <a href="#specs-section" className="c-button c-button--ghost">
            Tech Specs
          </a>
        </div>
      </div>
    </section>
  );
}
