"use client";

import { useState, useEffect, useRef } from "react";
import Nav from "@/components/Nav";
import HeroReveal from "@/components/HeroReveal";

import ScrollScrubHero from "@/components/ScrollScrubHero";
import GallerySection from "@/components/GallerySection";
import FeatureSection from "@/components/FeatureSection";
import TechSpecs from "@/components/TechSpecs";
import ClosingCTA from "@/components/ClosingCTA";
import Footer from "@/components/Footer";
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

      <main style={{ background: "#000", color: "#fff" }}>
        <Nav />
        <HeroReveal />



        {/* Pass preloaded images so ScrollScrubHero doesn't re-fetch */}
        <ScrollScrubHero preloadedImages={imagesRef.current} />
        <GallerySection />


        <FeatureSection
          id="design"
          eyebrow="A heritage reborn"
          title={"Sixty years of\nAmerican muscle, reimagined."}
          description="Every line traces back to 1964 — the long hood, the fastback silhouette, the tri-bar taillights. Nothing about this shape is accidental. Everything has been preserved and perfected for 2026."
          image="/images/frame_001.jpg"
        />
        <FeatureSection
          eyebrow="A heart without equal"
          title={"Naturally aspirated.\nUnapologetically loud."}
          description="No turbos, no shortcuts. Just 5.2 liters of flat-plane V8 fury, 500 horsepower, and a throttle response that reminds you why the internal combustion engine still matters in the electric age."
          image="/images/frame_002.jpg"
          reversed
        />
        <FeatureSection
          id="performance"
          eyebrow="Built to be driven"
          title={"Chassis tuned for\nthe edge, not the showroom."}
          description="MagneRide 4.0 adaptive dampers reading the road 100 times per second. A Torsen limited-slip differential. Wider front track. Every component exists to give you more of the road."
          image="/images/frame_004.jpg"
        />
        <FeatureSection
          eyebrow="Race-bred details"
          title={"Aerodynamics that do\nmore than look fast."}
          description="Carbon fiber front splitter, rear diffuser, and decklid spoiler developed with the GT3 race team to generate meaningful downforce at triple-digit speeds. Not decorative — functional."
          image="/images/frame_007.jpg"
          reversed
        />
        <FeatureSection
          eyebrow="A collector's piece"
          title={"500 built.\nNone repeated."}
          description="Individually numbered on an aluminium plaque, hand-finished by a dedicated team. Built in a run so small that owning one means something — permanently and undeniably."
          image="/images/frame_011.jpg"
        />

        <TechSpecs />
        <ClosingCTA />
        <Footer />
      </main>
    </>
  );
}
