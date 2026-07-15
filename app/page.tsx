"use client";

import { useState, useEffect, useRef } from "react";
import Nav from "@/components/Nav";
import HeroReveal from "@/components/HeroReveal";

import ScrollScrubHero from "@/components/ScrollScrubHero";
import Loader from "@/components/Loader";
const FRAME_COUNT = 90;
const FRAME_PATH = (i: number) => `/frames/f_${String(i).padStart(3, "0")}.jpg`;

export default function Home() {
  const [loaded, setLoaded]   = useState(0);
  const [ready, setReady]     = useState(false);
  const [entered, setEntered] = useState(false);
  const imagesRef = useRef<HTMLImageElement[]>([]);

  /* Preload all 90 frames at the page level */
  useEffect(() => {
    let cancelled = false;
    const imgs = Array.from({ length: FRAME_COUNT }, (_, i) => {
      const img = new Image();
      img.src = FRAME_PATH(i + 1);
      img.onload = () => {
        if (cancelled) return;
        setLoaded((c) => {
          const next = c + 1;
          if (next === FRAME_COUNT) setReady(true);
          return next;
        });
      };
      return img;
    });
    imagesRef.current = imgs;
    return () => { cancelled = true; };
  }, []);

  const pct = Math.round((loaded / FRAME_COUNT) * 100);

  return (
    <>
      {/* Full-page loader — sits above everything, dismissed on Enter click */}
      {!entered && (
        <Loader
          pct={pct}
          ready={ready}
          onEnter={() => setEntered(true)}
        />
      )}

      <main
        style={{ background: "#000", color: "#fff" }}
        data-entered={entered ? "true" : "false"}
      >
        <Nav />
        <HeroReveal entered={entered} />



        {/* Pass preloaded images so ScrollScrubHero doesn't re-fetch */}
        <ScrollScrubHero preloadedImages={imagesRef.current} />

      </main>
    </>
  );
}
