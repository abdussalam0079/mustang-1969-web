"use client";

import { useEffect, useRef } from "react";

export default function ClosingCTA() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.querySelectorAll(".reveal").forEach((el, i) => {
              setTimeout(() => el.classList.add("is-visible"), i * 120);
            });
          }
        });
      },
      { threshold: 0.25 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} id="contact" className="cta-section">
      <img
        src="/images/frame_009.jpg"
        alt="Mustang Dark Horse Centenario"
        className="cta-section__bg"
      />
      <div className="cta-section__overlay" />

      <div className="cta-section__content">
        <p
          className="reveal t-eyebrow"
          style={{ marginBottom: "20px" }}
        >
          Configure yours
        </p>
        <h2
          className="reveal cta-section__title"
          style={{ transitionDelay: "80ms" }}
        >
          Ready to find your perfect car?
        </h2>
        <p
          className="reveal cta-section__body"
          style={{ transitionDelay: "140ms" }}
        >
          Beyond the showroom. A seamless acquisition experience for the most
          discerning automotive enthusiasts.
        </p>
        <div
          className="reveal"
          style={{
            display: "flex",
            gap: "16px",
            justifyContent: "center",
            flexWrap: "wrap",
            transitionDelay: "200ms",
          }}
        >
          <a href="#" className="c-button c-button--primary">
            Request It Now
          </a>
          <a href="#" className="c-button c-button--ghost">
            Find a Dealer
          </a>
        </div>
      </div>
    </section>
  );
}
