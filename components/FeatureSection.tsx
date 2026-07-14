"use client";

import { useEffect, useRef } from "react";

interface Props {
  id?: string;
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  reversed?: boolean;
}

export default function FeatureSection({
  id,
  eyebrow,
  title,
  description,
  image,
  reversed = false,
}: Props) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.querySelectorAll(".reveal").forEach((el, i) => {
              setTimeout(() => el.classList.add("is-visible"), i * 100);
            });
          }
        });
      },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id={id}
      className={`feature-section${reversed ? " feature-section--reversed" : ""}`}
    >
      <img
        src={image}
        alt={title}
        className="feature-section__image"
        loading="lazy"
      />
      <div className="feature-section__content">
        {/* Eyebrow with red icon tile */}
        <div className="reveal feature-section__eyebrow">
          <div className="icon-tile">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M9 2L11.5 7H16.5L12.5 10.5L14 16L9 13L4 16L5.5 10.5L1.5 7H6.5L9 2Z"
                fill="white" />
            </svg>
          </div>
          <span className="feature-section__eyebrow-text">{eyebrow}</span>
        </div>

        <h2
          className="reveal feature-section__title"
          style={{ transitionDelay: "80ms" }}
        >
          {title}
        </h2>
        <p
          className="reveal feature-section__desc"
          style={{ transitionDelay: "160ms" }}
        >
          {description}
        </p>
      </div>
    </section>
  );
}
