"use client";

import { useEffect, useRef, useCallback } from "react";

const BASE_IMAGE   = "/images/hero-mustang.png";
const REVEAL_IMAGE = "/images/1969 Ford Mustang Boss 429 _ The Don Davis Collection _ RM Sotheby's_files/0a6a2554e482e18063e42103633e3586cab10c64.webp";
const MASK_SIZE    = 220;
const SOFT_EDGE    = 40;
const LETTERS      = "MUSTANG".split("");

interface HeroRevealProps { entered: boolean; }

export default function HeroReveal({ entered }: HeroRevealProps) {
  const sectionRef  = useRef<HTMLDivElement>(null);
  const canvasRef   = useRef<HTMLCanvasElement>(null);
  const baseImgRef  = useRef<HTMLImageElement | null>(null);
  const rafRef      = useRef<number>(0);
  const imgWrapRef  = useRef<HTMLDivElement>(null);
  const lineRef     = useRef<HTMLDivElement>(null);
  const wordmarkRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const scrollRef   = useRef<HTMLDivElement>(null);

  /* ── Cover-fit helper ── */
  const coverFit = (img: HTMLImageElement, w: number, h: number) => {
    const ir = img.naturalWidth / img.naturalHeight;
    const cr = w / h;
    let dw: number, dh: number, dx: number, dy: number;
    if (ir > cr) { dh = h; dw = h * ir; dx = (w - dw) / 2; dy = 0; }
    else          { dw = w; dh = w / ir; dx = 0; dy = (h - dh) / 2; }
    return { dw, dh, dx, dy };
  };

  const repaint = useCallback(() => {
    const canvas = canvasRef.current;
    const img    = baseImgRef.current;
    const node   = sectionRef.current;
    if (!canvas || !img || !node) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = node.clientWidth, h = node.clientHeight;
    canvas.width  = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    const ctx = canvas.getContext("2d")!;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    const { dw, dh, dx, dy } = coverFit(img, w, h);
    ctx.drawImage(img, dx, dy, dw, dh);
  }, []);

  const spotlight = useCallback((x: number, y: number) => {
    const canvas = canvasRef.current;
    const img    = baseImgRef.current;
    const node   = sectionRef.current;
    if (!canvas || !img || !node) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = node.clientWidth, h = node.clientHeight;
    const ctx = canvas.getContext("2d")!;
    const { dw, dh, dx, dy } = coverFit(img, w, h);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    ctx.drawImage(img, dx, dy, dw, dh);
    const radius   = MASK_SIZE * 0.5;
    const hardStop = Math.max(0, Math.min(100, 100 - SOFT_EDGE));
    const inner    = radius * (hardStop / 100);
    const blur     = Math.max(0.0001, radius - inner);
    ctx.globalCompositeOperation = "destination-out";
    const g = ctx.createRadialGradient(x, y, inner, x, y, radius + blur);
    g.addColorStop(0, "rgba(0,0,0,1)");
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, radius + blur, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalCompositeOperation = "source-over";
  }, []);

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => { baseImgRef.current = img; repaint(); };
    img.src = BASE_IMAGE;
    const onResize = () => repaint();
    window.addEventListener("resize", onResize, { passive: true });
    return () => { window.removeEventListener("resize", onResize); cancelAnimationFrame(rafRef.current); };
  }, [repaint]);

  /* ── Cinematic entrance — fires once entered becomes true ── */
  useEffect(() => {
    if (!entered) return;

    const imgWrap  = imgWrapRef.current;
    const line     = lineRef.current;
    const wordmark = wordmarkRef.current;
    const subtitle = subtitleRef.current;
    const scroll   = scrollRef.current;

    /* 1. Image: scale 1.08 → 1 + fade in over 1.2s */
    if (imgWrap) {
      imgWrap.style.transition = "opacity 1.2s cubic-bezier(0.22,1,0.36,1), transform 1.4s cubic-bezier(0.22,1,0.36,1)";
      imgWrap.style.opacity    = "1";
      imgWrap.style.transform  = "scale(1)";
    }

    /* 2. Horizontal line wipe at 400ms */
    const t1 = setTimeout(() => {
      if (line) {
        line.style.transition = "width 0.7s cubic-bezier(0.22,1,0.36,1), opacity 0.3s ease";
        line.style.width      = "100%";
        line.style.opacity    = "1";
      }
    }, 400);

    /* 3. Wordmark letters drop in at 600ms — driven by CSS animation class */
    const t2 = setTimeout(() => {
      if (wordmark) wordmark.classList.add("hero-animate");
    }, 600);

    /* 4. Subtitle at 1100ms */
    const t3 = setTimeout(() => {
      if (subtitle) {
        subtitle.style.transition = "opacity 0.7s ease, transform 0.7s cubic-bezier(0.22,1,0.36,1)";
        subtitle.style.opacity    = "1";
        subtitle.style.transform  = "translateY(0)";
      }
    }, 1100);

    /* 5. Scroll indicator at 1500ms */
    const t4 = setTimeout(() => {
      if (scroll) {
        scroll.style.transition = "opacity 0.6s ease";
        scroll.style.opacity    = "1";
      }
    }, 1500);

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, [entered]);

  const onPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const node = sectionRef.current;
    if (!node) return;
    const b = node.getBoundingClientRect();
    spotlight(e.clientX - b.left, e.clientY - b.top);
  }, [spotlight]);

  const onPointerLeave = useCallback(() => repaint(), [repaint]);

  return (
    <section
      id="top"
      ref={sectionRef}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        overflow: "hidden",
        background: "#000",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        cursor: "none",
        touchAction: "none",
      }}
    >
      {/* Image wrapper — starts scaled up + invisible */}
      <div
        ref={imgWrapRef}
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0,
          transform: "scale(1.08)",
        }}
      >
        <img
          src={REVEAL_IMAGE}
          alt=""
          aria-hidden
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
        />
        <canvas
          ref={canvasRef}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" }}
        />
      </div>

      {/* Gradient overlays */}
      <div className="hero-reveal__overlay" style={{ position: "absolute", inset: 0, pointerEvents: "none" }} />

      {/* Horizontal wipe line — cinematic reveal bar */}
      <div
        ref={lineRef}
        style={{
          position: "absolute",
          top: "50%",
          left: 0,
          height: "1px",
          width: "0%",
          opacity: 0,
          background: "linear-gradient(to right, transparent, rgba(230,0,0,0.8), transparent)",
          zIndex: 6,
          pointerEvents: "none",
        }}
      />

      {/* Wordmark */}
      <div
        style={{
          position: "relative",
          marginBottom: "88px",
          textAlign: "center",
          zIndex: 5,
          pointerEvents: "none",
        }}
      >
        <div
          ref={wordmarkRef}
          style={{
            fontFamily: "'Orbitron', sans-serif",
            fontSize: "clamp(3.875rem, 12vw, 13rem)",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            lineHeight: 0.9,
            color: "rgba(255,255,255,0.12)",
            display: "flex",
            justifyContent: "center",
            mixBlendMode: "overlay",
          }}
        >
          {LETTERS.map((letter, i) => (
            <span
              key={i}
              style={{
                display: "inline-block",
                opacity: 0,
                transform: "translateY(50px)",
              }}
              className={`hero-letter hero-letter-${i}`}
            >
              {letter}
            </span>
          ))}
        </div>

        {/* Red divider */}
        <div
          style={{
            width: "48px",
            height: "2px",
            background: "#E60000",
            margin: "0.75rem auto",
            opacity: 0,
          }}
          className="hero-divider"
        />

        {/* Subtitle */}
        <div
          ref={subtitleRef}
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "clamp(0.6875rem, 1vw, 0.875rem)",
            fontWeight: 500,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "#858585",
            opacity: 0,
            transform: "translateY(12px)",
          }}
        >
          Dark Horse · Centenario Edition
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        ref={scrollRef}
        style={{
          position: "absolute",
          bottom: "2.2rem",
          right: "2.5rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0.5rem",
          zIndex: 5,
          opacity: 0,
          pointerEvents: "none",
        }}
      >
        <p style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: "0.6875rem",
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "#858585",
        }}>Scroll</p>
        <div style={{
          width: "1px",
          height: "36px",
          background: "linear-gradient(to bottom, rgba(245,245,245,0.6), transparent)",
          animation: "scrollPulse 1.8s ease-in-out infinite",
        }} />
      </div>

      <style>{`
        /* Letter drop — triggered by adding .hero-animate to parent */
        .hero-animate .hero-letter {
          animation: heroDrop 0.75s cubic-bezier(0.22,1,0.36,1) forwards;
        }
        ${LETTERS.map((_, i) => `.hero-animate .hero-letter-${i} { animation-delay: ${i * 0.07}s; }`).join("\n")}

        /* Divider fades in after last letter */
        .hero-animate .hero-divider {
          animation: heroFade 0.5s ease ${LETTERS.length * 0.07 + 0.1}s forwards;
        }

        @keyframes heroDrop {
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes heroFade {
          to { opacity: 1; }
        }
        @keyframes scrollPulse {
          0%, 100% { opacity: 0.3; transform: scaleY(0.6); }
          50%       { opacity: 1;   transform: scaleY(1);   }
        }
      `}</style>
    </section>
  );
}
