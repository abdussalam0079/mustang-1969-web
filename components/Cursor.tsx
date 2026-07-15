"use client";

import { useEffect, useRef } from "react";

export default function Cursor() {
  const dotRef  = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot  = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mx = -100, my = -100;
    let rx = -100, ry = -100;
    let raf: number;

    const onMove = (e: MouseEvent) => { mx = e.clientX; my = e.clientY; };
    window.addEventListener("mousemove", onMove, { passive: true });

    const tick = () => {
      /* Dot snaps instantly */
      dot.style.left = `${mx}px`;
      dot.style.top  = `${my}px`;

      /* Ring lerps behind */
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      ring.style.left = `${rx}px`;
      ring.style.top  = `${ry}px`;

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    /* Grow ring on hoverable elements */
    const grow  = () => { ring.style.width = "60px"; ring.style.height = "60px"; ring.style.borderColor = "rgba(230,0,0,0.7)"; };
    const shrink = () => { ring.style.width = "36px"; ring.style.height = "36px"; ring.style.borderColor = "rgba(255,255,255,0.5)"; };

    document.querySelectorAll("a, button, [role=button]").forEach(el => {
      el.addEventListener("mouseenter", grow);
      el.addEventListener("mouseleave", shrink);
    });

    const obs = new MutationObserver(() => {
      document.querySelectorAll("a, button, [role=button]").forEach(el => {
        el.removeEventListener("mouseenter", grow);
        el.removeEventListener("mouseleave", shrink);
        el.addEventListener("mouseenter", grow);
        el.addEventListener("mouseleave", shrink);
      });
    });
    obs.observe(document.body, { childList: true, subtree: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      obs.disconnect();
    };
  }, []);

  return (
    <div className="cursor">
      <div ref={ringRef} className="cursor__ring" style={{ position: "fixed" }} />
      <div ref={dotRef}  className="cursor__dot"  style={{ position: "fixed" }} />
    </div>
  );
}
