"use client";

import { useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const FRAME_COUNT = 90;

interface Slide {
  frameStart: number;
  frameEnd: number;
  position: string;
  title: string;
  description: string | null;
  badges?: { label: string; spec: string }[];
  roadData?: string;
}

const SLIDES: Slide[] = [
  {
    frameStart: 0, frameEnd: 14, position: "pos-default",
    title: "Mustang Dark Horse Centenario:\nthe most extreme road-legal\nMustang ever built",
    description: null,
    badges: [
      { label: "500 HP*",      spec: "Naturally aspirated\nV8 output" },
      { label: "3,700 LBS",    spec: "Curb weight\nracing configuration" },
      { label: "1.35 HP/LB*",  spec: "Power-to-weight\nratio" },
    ],
    roadData: "480 HP (EU/standard specs), 3,750 lbs, 1.28 HP/lb",
  },
  { frameStart: 14, frameEnd: 28, position: "pos-center-right",  title: "500 landmark\nmasterpieces",              description: "The Centenario livery: a deep midnight blue pulse connecting a century of American heritage to the future of performance. A MotoGP-inspired signature, destined to remain unrepeatable." },
  { frameStart: 28, frameEnd: 43, position: "pos-bottom-left",   title: "World-first: AI-assisted\nMagneRide suspension", description: "The first predictive AI suspension on a production muscle car, reading the road surface 100 times per second. A solution that combines precision, comfort, and thermal stability." },
  { frameStart: 43, frameEnd: 58, position: "pos-bottom-left",   title: "World-first: structural\ncarbon fiber package",  description: "The brand new carbon fiber hood, front splitter, and decklid — engineered for a 12% weight reduction and unmatched body rigidity." },
  { frameStart: 58, frameEnd: 70, position: "pos-bottom-left",   title: "Race-bred\naerodynamics",                description: "The same high-efficiency front splitter and rear diffuser used on the GT3 race car — defining a highly efficient aerodynamic package." },
  { frameStart: 70, frameEnd: 82, position: "pos-bottom-right",  title: "A heart\nwithout equals",               description: "500 HP of Pure Adrenaline. The brand-new Predator 5.2L flat-plane V8: engineered to deliver a record-breaking power-to-weight ratio." },
  { frameStart: 82, frameEnd: 90, position: "pos-bottom-center", title: "A carbon fiber\nmanifesto",              description: "The only street-legal American muscle car featuring carbon fiber structural components throughout." },
];

const RULER_SEGMENTS = 7;

interface Props { preloadedImages: HTMLImageElement[]; }

export default function ScrollScrubHero({ preloadedImages }: Props) {
  const wrapperRef   = useRef<HTMLDivElement>(null);
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const imagesRef    = useRef(preloadedImages);
  const frameRef     = useRef(0);
  const slideRef     = useRef(0);
  const progressRef  = useRef(0);
  /* DOM refs for zero-React-state updates */
  const slideEls     = useRef<HTMLDivElement[]>([]);
  const progressFill = useRef<HTMLDivElement>(null);
  const scrollDown   = useRef<HTMLDivElement>(null);

  useEffect(() => { imagesRef.current = preloadedImages; }, [preloadedImages]);

  /* ── Draw frame directly onto canvas ── */
  const drawFrame = useCallback((index: number) => {
    const canvas = canvasRef.current;
    const img    = imagesRef.current[index];
    if (!canvas || !img?.complete || img.naturalWidth === 0) return;
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

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const isMobile = window.innerWidth <= 768;

    drawFrame(0);

    /* Fade section in when it enters viewport */
    const sticky = wrapper.querySelector<HTMLElement>(".scrub-sticky");
    if (sticky) {
      gsap.fromTo(sticky, { opacity: 0 }, {
        opacity: 1, duration: 0.5, ease: "power2.out",
        scrollTrigger: { trigger: wrapper, start: "top 85%", toggleActions: "play none none none" },
      });
    }

    const st = ScrollTrigger.create({
      trigger  : wrapper,
      start    : "top top",
      end      : `+=${window.innerHeight * (isMobile ? 4 : 7)}`,
      pin      : true,
      scrub    : true,          // true = perfectly 1:1 with scroll, no lag
      onUpdate : (self) => {
        const p = self.progress;

        /* ── 1. Frame draw — pure DOM, zero React ── */
        const idx = Math.min(FRAME_COUNT - 1, Math.round(p * (FRAME_COUNT - 1)));
        if (idx !== frameRef.current) {
          frameRef.current = idx;
          drawFrame(idx);
        }

        /* ── 2. Progress bar — direct DOM ── */
        if (progressFill.current) {
          progressFill.current.style.width = `${p * 100}%`;
        }

        /* ── 3. Scroll-down hint ── */
        if (scrollDown.current) {
          scrollDown.current.style.opacity = p < 0.04 ? "1" : "0";
        }

        /* ── 4. Active slide — direct DOM class toggle ── */
        const fNum = idx + 1;
        let newSlide = 0;
        for (let i = SLIDES.length - 1; i >= 0; i--) {
          if (fNum >= SLIDES[i].frameStart) { newSlide = i; break; }
        }
        if (newSlide !== slideRef.current) {
          slideEls.current[slideRef.current]?.classList.remove("is-active");
          slideEls.current[newSlide]?.classList.add("is-active");
          slideRef.current = newSlide;
        }

        progressRef.current = p;
      },
    });

    const onResize = () => drawFrame(frameRef.current);
    window.addEventListener("resize", onResize, { passive: true });
    return () => { st.kill(); window.removeEventListener("resize", onResize); };
  }, [drawFrame]);

  return (
    <div ref={wrapperRef} id="scrolly-section" style={{ position: "relative" }}>
      <div
        className="scrub-sticky"
        style={{ position: "sticky", top: 0, width: "100%", height: "100vh", overflow: "hidden", background: "#000", opacity: 0 }}
      >
        <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" }} />

        {/* Gradients */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.72) 0%, transparent 45%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, transparent 20%)", pointerEvents: "none" }} />

        {/* Slide panels — toggled via CSS class, zero React state */}
        {SLIDES.map((slide, i) => (
          <div
            key={i}
            ref={el => { if (el) slideEls.current[i] = el; }}
            className={`scrub-slide scrub-slide--${slide.position}${i === 0 ? " is-active" : ""}`}
          >
            <h2 className="scrub-slide__title">{slide.title}</h2>

            {slide.badges && (
              <>
                <div className="scrub-slide__badges">
                  {slide.badges.map(b => (
                    <dl key={b.label} style={{ margin: 0, textAlign: "center" }}>
                      <dt className="scrub-badge__value">{b.label}</dt>
                      <dd className="scrub-badge__spec">{b.spec}</dd>
                    </dl>
                  ))}
                </div>
                {slide.roadData && (
                  <p className="scrub-slide__road">
                    <strong>Road data: </strong>{slide.roadData}
                  </p>
                )}
              </>
            )}

            {slide.description && <p className="scrub-slide__desc">{slide.description}</p>}
          </div>
        ))}

        {/* Ruler */}
        <div className="scrub-ruler" style={{ position: "absolute", bottom: "2.2rem", left: "50%", transform: "translateX(-50%)", width: "min(70%, 480px)", zIndex: 20 }}>
          <div style={{ position: "relative", width: "100%", height: "20px", display: "flex", alignItems: "flex-end" }}>
            <div style={{ position: "absolute", bottom: 0, left: 0, width: "100%", height: "1px", background: "rgba(255,255,255,0.18)" }} />
            <div ref={progressFill} style={{ position: "absolute", bottom: 0, left: 0, height: "1px", width: "0%", background: "white" }} />
            {Array.from({ length: RULER_SEGMENTS }).flatMap((_, seg) =>
              Array.from({ length: 6 }).map((__, tick) => {
                const pos = ((seg * 5 + tick) / (RULER_SEGMENTS * 5)) * 100;
                const isMajor = tick === 0;
                return <div key={`${seg}-${tick}`} style={{ position: "absolute", bottom: 0, left: `${pos}%`, width: "1px", height: isMajor ? "10px" : "5px", background: isMajor ? "rgba(255,255,255,0.65)" : "rgba(255,255,255,0.3)" }} />;
              })
            )}
            <div style={{ position: "absolute", bottom: 0, right: 0, width: "1px", height: "10px", background: "rgba(255,255,255,0.65)" }} />
          </div>
        </div>

        {/* Scroll down hint */}
        <div ref={scrollDown} style={{ position: "absolute", bottom: "2.5rem", right: "3rem", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem", zIndex: 20, opacity: 1, transition: "opacity 0.4s ease", pointerEvents: "none" }}>
          <p style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "0.58rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)" }}>Scroll down</p>
          <div style={{ width: "1px", height: "38px", background: "linear-gradient(to bottom, rgba(255,255,255,0.8), transparent)", animation: "scrollPulse 1.8s ease-in-out infinite" }} />
        </div>

        <style>{`
          .scrub-slide {
            position: absolute;
            padding: 1.5rem 2.5rem;
            max-width: 580px;
            z-index: 10;
            opacity: 0;
            transform: translateY(14px);
            transition: opacity 0.55s ease, transform 0.55s ease, clip-path 0.55s ease;
            clip-path: inset(8% 0% 8% 0%);
            pointer-events: none;
          }
          .scrub-slide.is-active {
            opacity: 1;
            transform: translateY(0);
            clip-path: inset(0% 0% 0% 0%);
            pointer-events: auto;
          }
          .scrub-slide--pos-default      { bottom: 140px; left: 0; right: 0; margin: 0 auto; text-align: center; max-width: 820px; }
          .scrub-slide--pos-center-right { top: 50%; right: 4%; text-align: right; transform: translateY(calc(-50% + 14px)); }
          .scrub-slide--pos-center-right.is-active { transform: translateY(-50%); }
          .scrub-slide--pos-bottom-left  { bottom: 110px; left: 4%; }
          .scrub-slide--pos-bottom-right { bottom: 110px; right: 4%; text-align: right; }
          .scrub-slide--pos-bottom-center { bottom: 110px; left: 50%; text-align: center; transform: translateX(-50%) translateY(14px); }
          .scrub-slide--pos-bottom-center.is-active { transform: translateX(-50%) translateY(0); }

          .scrub-slide__title {
            font-family: 'Orbitron', sans-serif;
            font-size: clamp(1.75rem, 4vw, 3.5rem);
            font-weight: 600;
            letter-spacing: -0.02em;
            line-height: 1.05;
            color: #F5F5F5;
            margin-bottom: 1rem;
            white-space: pre-line;
          }
          .scrub-slide__badges { display: flex; flex-wrap: wrap; gap: 0.8rem 2.5rem; justify-content: center; margin-bottom: 1.2rem; }
          .scrub-badge__value  { font-family: 'Orbitron', sans-serif; font-size: clamp(2rem, 3.5vw, 3rem); font-weight: 700; letter-spacing: -0.02em; line-height: 1; color: #E60000; display: block; }
          .scrub-badge__spec   { font-family: 'Inter', sans-serif; font-size: 0.8125rem; letter-spacing: 0.04em; text-transform: uppercase; color: #858585; line-height: 1.5; white-space: pre-line; margin: 0.3rem 0 0; }
          .scrub-slide__road   { font-family: 'Inter', sans-serif; font-size: 0.58rem; letter-spacing: 0.1em; text-transform: uppercase; color: rgba(255,255,255,0.4); border-top: 1px solid rgba(255,255,255,0.12); padding-top: 0.75rem; }
          .scrub-slide__desc   { font-family: 'Manrope', 'Inter', sans-serif; font-size: clamp(0.8rem, 1.2vw, 0.95rem); font-weight: 400; line-height: 1.75; color: rgba(255,255,255,0.72); max-width: 42ch; }

          @keyframes scrollPulse {
            0%, 100% { opacity: 0.3; transform: scaleY(0.6); }
            50%       { opacity: 1;   transform: scaleY(1); }
          }
        `}</style>
      </div>
    </div>
  );
}
