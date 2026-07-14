"use client";

import { useEffect, useRef, useCallback } from "react";

const BASE_IMAGE   = "/images/hero-mustang.png";   // dark red car — always visible
const REVEAL_IMAGE = "/images/1969 Ford Mustang Boss 429 _ The Don Davis Collection _ RM Sotheby's_files/0a6a2554e482e18063e42103633e3586cab10c64.webp";       // lighter shot — revealed under cursor
const MASK_SIZE    = 220;   // px radius of the reveal circle
const SOFT_EDGE    = 40;    // % softness (0 = hard, 100 = fully soft)

export default function HeroReveal() {
  const sectionRef  = useRef<HTMLDivElement>(null);
  const canvasRef   = useRef<HTMLCanvasElement>(null);
  const baseImgRef  = useRef<HTMLImageElement | null>(null);
  const lastPtRef   = useRef<{ x: number; y: number } | null>(null);
  const rafRef      = useRef<number>(0);
  const titleRef    = useRef<HTMLDivElement>(null);
  const logoRef     = useRef<HTMLDivElement>(null);

  /* ── Paint base image onto canvas (cover-fit) ── */
  const repaint = useCallback(() => {
    const canvas = canvasRef.current;
    const img    = baseImgRef.current;
    const node   = sectionRef.current;
    if (!canvas || !img || !node) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w   = node.clientWidth;
    const h   = node.clientHeight;

    canvas.width  = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);

    const ctx = canvas.getContext("2d")!;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);

    // cover-fit
    const ir = img.naturalWidth / img.naturalHeight;
    const cr = w / h;
    let dw: number, dh: number, dx: number, dy: number;
    if (ir > cr) { dh = h; dw = h * ir; dx = (w - dw) / 2; dy = 0; }
    else          { dw = w; dh = w / ir; dx = 0; dy = (h - dh) / 2; }
    ctx.drawImage(img, dx, dy, dw, dh);

    lastPtRef.current = null;
  }, []);

  /* ── Spotlight: repaint base then erase only current cursor pos ── */
  const spotlight = useCallback((x: number, y: number) => {
    const canvas = canvasRef.current;
    const img    = baseImgRef.current;
    const node   = sectionRef.current;
    if (!canvas || !img || !node) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w   = node.clientWidth;
    const h   = node.clientHeight;
    const ctx = canvas.getContext("2d")!;

    // cover-fit dims
    const ir = img.naturalWidth / img.naturalHeight;
    const cr = w / h;
    let dw: number, dh: number, dx: number, dy: number;
    if (ir > cr) { dh = h; dw = h * ir; dx = (w - dw) / 2; dy = 0; }
    else          { dw = w; dh = w / ir; dx = 0; dy = (h - dh) / 2; }

    // 1. Repaint full base image
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    ctx.drawImage(img, dx, dy, dw, dh);

    // 2. Erase only the circle at current cursor
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

  /* ── Smooth reset: re-paint base over ~600ms ── */
  const resetCanvas = useCallback(() => {
    lastPtRef.current = null;
    cancelAnimationFrame(rafRef.current);

    const canvas = canvasRef.current;
    const img    = baseImgRef.current;
    const node   = sectionRef.current;
    if (!canvas || !img || !node) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w   = node.clientWidth;
    const h   = node.clientHeight;
    const ctx = canvas.getContext("2d")!;

    // cover-fit dims
    const ir = img.naturalWidth / img.naturalHeight;
    const cr = w / h;
    let dw: number, dh: number, dx: number, dy: number;
    if (ir > cr) { dh = h; dw = h * ir; dx = (w - dw) / 2; dy = 0; }
    else          { dw = w; dh = w / ir; dx = 0; dy = (h - dh) / 2; }

    const start = performance.now();
    const DURATION = 600;

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / DURATION);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.globalAlpha = t;
      ctx.drawImage(img, dx, dy, dw, dh);
      ctx.globalAlpha = 1;
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  /* ── Load base image, wire resize ── */
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => { baseImgRef.current = img; repaint(); };
    img.src = BASE_IMAGE;

    const onResize = () => repaint();
    window.addEventListener("resize", onResize, { passive: true });
    return () => { window.removeEventListener("resize", onResize); cancelAnimationFrame(rafRef.current); };
  }, [repaint]);

  /* ── Entrance animations ── */
  useEffect(() => {
    const t1 = setTimeout(() => {
      if (titleRef.current) { titleRef.current.style.opacity = "1"; titleRef.current.style.transform = "translateY(0)"; }
    }, 1200);
    const t2 = setTimeout(() => {
      if (logoRef.current) { logoRef.current.style.opacity = "1"; logoRef.current.style.transform = "translateY(0)"; }
    }, 1700);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

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
      {/* ── Reveal image — always underneath ── */}
      <img
        src={REVEAL_IMAGE}
        alt=""
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center",
        }}
      />

      {/* ── Canvas — base image painted here, erased by cursor ── */}
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          display: "block",
        }}
      />

      {/* ── Gradient overlays ── */}
      <div className="hero-reveal__overlay" style={{ position: "absolute", inset: 0, pointerEvents: "none" }} />

      {/* ── Centre subtitle ── */}
      <div
        ref={titleRef}
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, calc(-50% + 20px))",
          textAlign: "center",
          width: "90%",
          maxWidth: "820px",
          opacity: 0,
          transition: "opacity 1s ease, transform 1s cubic-bezier(0.22,1,0.36,1)",
          zIndex: 5,
          pointerEvents: "none",
        }}
      >
        <p style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: "clamp(1rem, 1.8vw, 1.375rem)",
          fontWeight: 400,
          lineHeight: 1.6,
          color: "rgba(245,245,245,0.82)",
          letterSpacing: "0.01em",
        }}>
          In the centenary year of the Mustang legend,
          <br />
          we are proud to share this landmark moment with you.
        </p>
      </div>

      {/* ── Bottom wordmark ── */}
      <div
        ref={logoRef}
        style={{
          position: "relative",
          marginBottom: "88px",
          textAlign: "center",
          opacity: 0,
          transform: "translateY(20px)",
          transition: "opacity 1s ease, transform 1s cubic-bezier(0.22,1,0.36,1)",
          zIndex: 5,
          pointerEvents: "none",
        }}
      >
        <div style={{
          fontFamily: "'Orbitron', sans-serif",
          fontSize: "clamp(3.875rem, 12vw, 13rem)",
          fontWeight: 700,
          letterSpacing: "-0.02em",
          lineHeight: 0.9,
          color: "#F5F5F5",
        }}>
          Mustang
        </div>
        <div style={{ width: "48px", height: "2px", background: "#E60000", margin: "0.75rem auto" }} />
        <div style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: "clamp(0.6875rem, 1vw, 0.875rem)",
          fontWeight: 500,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: "#858585",
        }}>
          Dark Horse · Centenario Edition
        </div>
      </div>

      {/* ── Scroll indicator ── */}
      <div style={{
        position: "absolute",
        bottom: "2.2rem",
        right: "2.5rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "0.5rem",
        zIndex: 5,
        opacity: 0,
        animation: "fadeIn 0.8s 2.5s ease forwards",
        pointerEvents: "none",
      }}>
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

      {/* ── Hint label ── */}
      <div style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, 60px)",
        zIndex: 6,
        pointerEvents: "none",
        opacity: 0,
        animation: "fadeIn 1s 2.8s ease forwards",
      }}>
        <p style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: "0.6875rem",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "rgba(245,245,245,0.35)",
        }}>Move cursor to reveal</p>
      </div>

      <style>{`
        @keyframes fadeIn { to { opacity: 1; } }
        @keyframes scrollPulse {
          0%, 100% { opacity: 0.3; transform: scaleY(0.6); }
          50%       { opacity: 1;   transform: scaleY(1);   }
        }
      `}</style>
    </section>
  );
}
