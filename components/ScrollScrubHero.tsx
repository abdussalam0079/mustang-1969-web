"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const FRAME_COUNT = 90;
const FRAME_PATH = (i: number) => `/frames/f_${String(i).padStart(3, "0")}.jpg`;

/* ─────────────────────────────────────────────────────────────
   SLIDES — 7 sections mapped to frame ranges, exact Ducati style
   ───────────────────────────────────────────────────────────── */
interface Slide {
  id: number;
  frameStart: number; // first frame this slide is active
  frameEnd: number;   // last frame this slide is active
  position: string;
  title: string;
  description: string | null;
  badges?: { label: string; spec: string }[];
  roadData?: string;
}

const SLIDES: Slide[] = [
  {
    id: 0,
    frameStart: 0,
    frameEnd: 14,
    position: "pos-default",
    title: "Mustang Dark Horse Centenario:\nthe most extreme road-legal\nMustang ever built",
    description: null,
    badges: [
      { label: "500 HP*", spec: "Naturally aspirated\nV8 output" },
      { label: "3,700 LBS", spec: "Curb weight\nracing configuration" },
      { label: "1.35 HP/LB*", spec: "Power-to-weight\nratio" },
    ],
    roadData: "480 HP (EU/standard specs), 3,750 lbs, 1.28 HP/lb",
  },
  {
    id: 1,
    frameStart: 14,
    frameEnd: 28,
    position: "pos-center-right",
    title: "500 landmark\nmasterpieces",
    description:
      "The Centenario livery: a deep midnight blue pulse connecting a century of American heritage to the future of performance. A MotoGP-inspired signature, destined to remain unrepeatable.",
    badges: undefined,
    roadData: undefined,
  },
  {
    id: 2,
    frameStart: 28,
    frameEnd: 43,
    position: "pos-bottom-left",
    title: "World-first: AI-assisted\nMagneRide suspension",
    description:
      "The first predictive AI suspension on a production muscle car, reading the road surface 100 times per second. A solution that combines precision, comfort, and thermal stability — clear advantages over traditional passive systems.",
    badges: undefined,
    roadData: undefined,
  },
  {
    id: 3,
    frameStart: 43,
    frameEnd: 58,
    position: "pos-bottom-left",
    title: "World-first: structural\ncarbon fiber package",
    description:
      "The brand new carbon fiber hood, front splitter, and decklid — engineered for a 12% weight reduction and unmatched body rigidity. The first full structural carbon package on a production American muscle car.",
    badges: undefined,
    roadData: undefined,
  },
  {
    id: 4,
    frameStart: 58,
    frameEnd: 70,
    position: "pos-bottom-left",
    title: "Race-bred\naerodynamics",
    description:
      "The same high-efficiency front splitter and rear diffuser used on the GT3 race car, combined with Desmosedici GP-derived sidepod styling — defining a highly efficient aerodynamic package both at full speed and at full lean.",
    badges: undefined,
    roadData: undefined,
  },
  {
    id: 5,
    frameStart: 70,
    frameEnd: 82,
    position: "pos-bottom-right",
    title: "A heart\nwithout equals",
    description:
      "500 HP of Pure Adrenaline in road configuration. The brand-new Predator 5.2L flat-plane V8: a unique engine built exclusively for this project, engineered to deliver a record-breaking power-to-weight ratio.",
    badges: undefined,
    roadData: undefined,
  },
  {
    id: 6,
    frameStart: 82,
    frameEnd: 90,
    position: "pos-bottom-center",
    title: "A carbon fiber\nmanifesto",
    description:
      "Defying the laws of physics. The only street-legal American muscle car in the world featuring carbon fiber structural components throughout. A radical pursuit of the most extreme performance ever produced.",
    badges: undefined,
    roadData: undefined,
  },
];

/* ── Ruler helper ── */
const RULER_SEGMENTS = 7;

interface ScrollScrubHeroProps {
  preloadedImages: HTMLImageElement[];
}

export default function ScrollScrubHero({ preloadedImages }: ScrollScrubHeroProps) {
  const wrapperRef    = useRef<HTMLDivElement>(null);
  const canvasRef     = useRef<HTMLCanvasElement>(null);  // front — new frame
  const backCanvasRef = useRef<HTMLCanvasElement>(null);  // back  — previous frame
  const imagesRef     = useRef<HTMLImageElement[]>(preloadedImages);
  const frameRef      = useRef(0);
  const rafRef        = useRef<number>(0);
  const fadeRafRef    = useRef<number>(0);

  const [activeSlide, setActiveSlide] = useState(0);
  const [progress,    setProgress]    = useState(0);

  useEffect(() => { imagesRef.current = preloadedImages; }, [preloadedImages]);

  /* ── Cover-fit draw onto any canvas ── */
  const drawTo = useCallback((canvas: HTMLCanvasElement, img: HTMLImageElement) => {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const cw = canvas.clientWidth, ch = canvas.clientHeight;
    if (canvas.width !== cw * dpr || canvas.height !== ch * dpr) {
      canvas.width = cw * dpr; canvas.height = ch * dpr;
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const ir = img.naturalWidth / img.naturalHeight;
    const cr = cw / ch;
    let dw: number, dh: number, dx: number, dy: number;
    if (ir > cr) { dh = ch; dw = ch * ir; dx = (cw - dw) / 2; dy = 0; }
    else          { dw = cw; dh = cw / ir; dx = 0; dy = (ch - dh) / 2; }
    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, dx, dy, dw, dh);
  }, []);

  /* ── Draw frame with crossfade ── */
  const drawFrame = useCallback((index: number) => {
    const front = canvasRef.current;
    const back  = backCanvasRef.current;
    const img   = imagesRef.current[index];
    if (!front || !back || !img?.complete || img.naturalWidth === 0) return;

    /* 1. Blit current front onto back (becomes the "from" frame) */
    const backCtx = back.getContext("2d");
    if (!backCtx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const cw = front.clientWidth, ch = front.clientHeight;
    if (back.width !== cw * dpr || back.height !== ch * dpr) {
      back.width = cw * dpr; back.height = ch * dpr;
    }
    backCtx.setTransform(1, 0, 0, 1, 0, 0);
    backCtx.clearRect(0, 0, back.width, back.height);
    backCtx.drawImage(front, 0, 0);

    /* 2. Draw new frame onto front at opacity 0, then fade to 1 */
    drawTo(front, img);
    front.style.opacity = "0";

    cancelAnimationFrame(fadeRafRef.current);
    const FADE_MS = 120;
    const start = performance.now();
    const fade = (now: number) => {
      const t = Math.min(1, (now - start) / FADE_MS);
      front.style.opacity = String(t);
      if (t < 1) fadeRafRef.current = requestAnimationFrame(fade);
    };
    fadeRafRef.current = requestAnimationFrame(fade);
  }, [drawTo]);

  /* ── 3. Wire scroll → frame + active slide ── */
  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    drawFrame(0);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      drawFrame(FRAME_COUNT - 1);
      return;
    }

    /* Fade + slide the sticky container in as the section scrolls into view */
    const stickyEl = wrapper.querySelector<HTMLElement>(".scrub-sticky");
    if (stickyEl) {
      gsap.fromTo(
        stickyEl,
        { opacity: 0, scale: 0.97 },
        {
          opacity: 1,
          scale: 1,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: wrapper,
            start: "top 90%",
            end: "top 20%",
            scrub: 1,
          },
        }
      );
    }

    /* Ruler animates in once section hits top */
    const rulerEl = wrapper.querySelector<HTMLElement>(".scrub-ruler");
    if (rulerEl) {
      gsap.fromTo(
        rulerEl,
        { opacity: 0, y: 16 },
        {
          opacity: 1, y: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: { trigger: wrapper, start: "top 10%", toggleActions: "play none none reverse" },
        }
      );
    }

    const st = ScrollTrigger.create({
      trigger : wrapper,
      start   : "top top",
      end     : "bottom bottom",
      scrub   : 1,
      onUpdate: (self) => {
        const p   = self.progress;

        /* Map progress → frame index and draw immediately — no rAF queue */
        const idx = Math.min(FRAME_COUNT - 1, Math.round(p * (FRAME_COUNT - 1)));
        if (idx !== frameRef.current) {
          frameRef.current = idx;
          drawFrame(idx);
        }

        /* Throttle React state updates so they never block the draw path */
        cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(() => {
          setProgress(p);
          const fNum = idx + 1;
          let slide  = 0;
          for (let i = SLIDES.length - 1; i >= 0; i--) {
            if (fNum >= SLIDES[i].frameStart) { slide = i; break; }
          }
          setActiveSlide(slide);
        });
      },
    });

    const onResize = () => drawFrame(frameRef.current);
    window.addEventListener("resize", onResize, { passive: true });
    return () => { st.kill(); window.removeEventListener("resize", onResize); cancelAnimationFrame(rafRef.current); cancelAnimationFrame(fadeRafRef.current); };
  }, [drawFrame]);

  return (
    /*
      OUTER wrapper — tall enough to drive the full scroll animation.
      700 vh = ~7 viewport heights of scrolling through 90 frames.
    */
    <div
      ref={wrapperRef}
      id="scrolly-section"
      style={{ position: "relative", height: "700vh" }}
    >
      {/* ── STICKY viewport container ── */}
      <div
        className="scrub-sticky"
        style={{
          position : "sticky",
          top      : 0,
          width    : "100%",
          height   : "100vh",
          overflow : "hidden",
          background: "#000",
          opacity  : 0,
        }}
      >
        {/* Back canvas — holds previous frame, always fully visible */}
        <canvas
          ref={backCanvasRef}
          style={{
            position: "absolute",
            inset    : 0,
            width    : "100%",
            height   : "100%",
            display  : "block",
          }}
        />
        {/* Front canvas — new frame, fades in over previous */}
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            inset    : 0,
            width    : "100%",
            height   : "100%",
            display  : "block",
          }}
        />

        {/* ── Gradient overlays ── */}
        {/* Bottom darkening — makes text legible */}
        <div style={{
          position  : "absolute",
          inset     : 0,
          background: "linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.0) 45%)",
          pointerEvents: "none",
        }} />
        {/* Top darkening — nav contrast */}
        <div style={{
          position  : "absolute",
          inset     : 0,
          background: "linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, transparent 20%)",
          pointerEvents: "none",
        }} />

        {/* ══════════════════════════════════════════════════
            SLIDE TEXT PANELS
            Each slide fades + translates in/out as you scroll.
            Positions mirror the Ducati layout exactly.
        ══════════════════════════════════════════════════ */}
        {SLIDES.map((slide, i) => {
          const isActive = activeSlide === i;

          /* Base inline styles per position variant */
          const posStyle = getPositionStyle(slide.position, isActive);

          return (
            <div
              key={slide.id}
              aria-hidden={!isActive}
              style={{
                position  : "absolute",
                padding   : "1.5rem 2.5rem",
                maxWidth  : "580px",
                zIndex    : 10,
                opacity   : isActive ? 1 : 0,
                clipPath  : isActive ? "inset(0% 0% 0% 0%)" : "inset(8% 0% 8% 0%)",
                transition: "opacity 0.6s ease, clip-path 0.6s cubic-bezier(0.22,1,0.36,1), transform 0.6s cubic-bezier(0.22,1,0.36,1)",
                pointerEvents: isActive ? "auto" : "none",
                ...posStyle,
              }}
            >
              {/* Slide title */}
              <h2
                style={{
                  fontFamily   : "'Orbitron', sans-serif",
                  fontSize     : "clamp(1.75rem, 4vw, 3.5rem)",
                  fontWeight   : 600,
                  letterSpacing: "-0.02em",
                  lineHeight   : 1.05,
                  color        : "#F5F5F5",
                  marginBottom : slide.badges ? "1.5rem" : "1rem",
                  whiteSpace   : "pre-line",
                }}
              >
                {slide.title}
              </h2>

              {/* Slide 0 — stat badges (Ducati-style) */}
              {slide.badges && (
                <>
                  <div style={{
                    display   : "flex",
                    flexWrap  : "wrap",
                    gap       : "0.8rem 2.5rem",
                    justifyContent: slide.position === "pos-default" ? "center" : "flex-start",
                    marginBottom: "1.2rem",
                  }}>
                    {slide.badges.map(b => (
                      <dl key={b.label} style={{ margin: 0, textAlign: "center" }}>
                        <dt style={{
                          fontFamily   : "'Orbitron', sans-serif",
                          fontSize     : "clamp(2rem, 3.5vw, 3rem)",
                          fontWeight   : 700,
                          letterSpacing: "-0.02em",
                          lineHeight   : 1,
                          color        : "#E60000",
                          display      : "block",
                        }}>
                          {b.label}
                        </dt>
                        <dd style={{
                          fontFamily   : "'Inter', sans-serif",
                          fontSize     : "0.8125rem",
                          fontWeight   : 400,
                          letterSpacing: "0.04em",
                          textTransform: "uppercase",
                          color        : "#858585",
                          lineHeight   : 1.5,
                          whiteSpace   : "pre-line",
                          margin       : "0.3rem 0 0",
                        }}>
                          {b.spec}
                        </dd>
                      </dl>
                    ))}
                  </div>
                  {slide.roadData && (
                    <p style={{
                      fontFamily   : "'Manrope', 'Inter', sans-serif",
                      fontSize     : "0.58rem",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color        : "rgba(255,255,255,0.4)",
                      borderTop    : "1px solid rgba(255,255,255,0.12)",
                      paddingTop   : "0.75rem",
                    }}>
                      <strong>Road data: </strong>{slide.roadData}
                    </p>
                  )}
                </>
              )}

              {/* Other slides — description */}
              {slide.description && (
                <p style={{
                  fontFamily   : "'Manrope', 'Inter', sans-serif",
                  fontSize     : "clamp(0.8rem, 1.2vw, 0.95rem)",
                  fontWeight   : 400,
                  letterSpacing: "0.01em",
                  lineHeight   : 1.75,
                  color        : "rgba(255,255,255,0.72)",
                  maxWidth     : "42ch",
                }}>
                  {slide.description}
                </p>
              )}
            </div>
          );
        })}

        {/* ══════════════════════════════════════════════════
            RULER — bottom progress bar
        ══════════════════════════════════════════════════ */}
        <div
          className="scrub-ruler"
          style={{
          position : "absolute",
          bottom   : "2.2rem",
          left     : "50%",
          transform: "translateX(-50%)",
          width    : "min(70%, 480px)",
          zIndex   : 20,
          opacity  : 0,
        }}>
          {/* Track */}
          <div style={{
            position  : "relative",
            width     : "100%",
            height    : "20px",
            display   : "flex",
            alignItems: "flex-end",
          }}>
            {/* Background line */}
            <div style={{
              position  : "absolute",
              bottom    : 0,
              left      : 0,
              width     : "100%",
              height    : "1px",
              background: "rgba(255,255,255,0.18)",
            }} />
            {/* Progress fill */}
            <div style={{
              position  : "absolute",
              bottom    : 0,
              left      : 0,
              height    : "1px",
              width     : `${progress * 100}%`,
              background: "white",
              transition: "width 0.08s linear",
            }} />
            {/* Ticks — 7 segments × 5 ticks each */}
            {Array.from({ length: RULER_SEGMENTS }).flatMap((_, seg) =>
              Array.from({ length: 6 }).map((__, tick) => {
                const totalTicks = RULER_SEGMENTS * 5;
                const pos        = ((seg * 5 + tick) / totalTicks) * 100;
                const isMajor    = tick === 0;
                return (
                  <div
                    key={`${seg}-${tick}`}
                    style={{
                      position  : "absolute",
                      bottom    : 0,
                      left      : `${pos}%`,
                      width     : "1px",
                      height    : isMajor ? "10px" : "5px",
                      background: isMajor ? "rgba(255,255,255,0.65)" : "rgba(255,255,255,0.3)",
                    }}
                  />
                );
              })
            )}
            {/* End tick */}
            <div style={{
              position  : "absolute",
              bottom    : 0,
              right     : 0,
              width     : "1px",
              height    : "10px",
              background: "rgba(255,255,255,0.65)",
            }} />
          </div>
        </div>

        {/* ══════════════════════════════════════════════════
            SCROLL DOWN button — disappears after 5% scroll
        ══════════════════════════════════════════════════ */}
        <div
          style={{
            position  : "absolute",
            bottom    : "2.5rem",
            right     : "3rem",
            display   : "flex",
            flexDirection: "column",
            alignItems: "center",
            gap       : "0.5rem",
            zIndex    : 20,
            opacity   : progress < 0.04 ? 1 : 0,
            transition: "opacity 0.4s ease",
            pointerEvents: "none",
          }}
        >
          <p style={{
            fontFamily   : "'Barlow Condensed', sans-serif",
            fontSize     : "0.58rem",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color        : "rgba(255,255,255,0.5)",
          }}>
            Scroll down
          </p>
          <div style={{
            width     : "1px",
            height    : "38px",
            background: "linear-gradient(to bottom, rgba(255,255,255,0.8), transparent)",
            animation : "scrollPulse 1.8s ease-in-out infinite",
          }} />
        </div>

        {/* ── CSS keyframes injected inline ── */}
        <style>{`
          @keyframes scrollPulse {
            0%, 100% { opacity: 0.3; transform: scaleY(0.6); }
            50%       { opacity: 1;   transform: scaleY(1);   }
          }
        `}</style>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Position helpers — translate Ducati CSS class names
   into inline style objects (avoids Tailwind purge issues)
   ───────────────────────────────────────────────────────────── */
function getPositionStyle(position: string, isActive: boolean): React.CSSProperties {
  const fadeY = isActive ? 0 : 14;

  switch (position) {
    case "pos-default":
      return {
        bottom   : "140px",
        left     : 0,
        right    : 0,
        margin   : "0 auto",
        textAlign: "center",
        maxWidth : "820px",
        transform: `translateY(${fadeY}px)`,
      };

    case "pos-center-right":
      return {
        top      : "50%",
        right    : "4%",
        textAlign: "right",
        transform: isActive ? "translateY(-50%)" : `translateY(calc(-50% + ${fadeY}px))`,
      };

    case "pos-bottom-left":
      return {
        bottom   : "110px",
        left     : "4%",
        textAlign: "left",
        transform: `translateY(${fadeY}px)`,
      };

    case "pos-bottom-right":
      return {
        bottom   : "110px",
        right    : "4%",
        textAlign: "right",
        transform: `translateY(${fadeY}px)`,
      };

    case "pos-bottom-center":
      return {
        bottom   : "110px",
        left     : "50%",
        textAlign: "center",
        transform: isActive ? "translateX(-50%)" : `translateX(-50%) translateY(${fadeY}px)`,
      };

    default:
      return { transform: `translateY(${fadeY}px)` };
  }
}
