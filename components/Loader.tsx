"use client";

import { useRef, useState } from "react";

interface LoaderProps {
  pct: number;
  ready: boolean;
  onEnter: () => void;
}

type Phase = "loading" | "video" | "done";

export default function Loader({ pct, ready, onEnter }: LoaderProps) {
  const [phase, setPhase] = useState<Phase>("loading");
  const [exiting, setExiting] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const startVideo = () => setPhase("video");

  const finish = () => {
    setExiting(true);
    setTimeout(() => {
      setPhase("done");
      onEnter();
    }, 900);
  };

  if (phase === "done") return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "#000",
        overflow: "hidden",
        opacity: exiting ? 0 : 1,
        transform: exiting ? "scale(1.04)" : "scale(1)",
        transition: exiting ? "opacity 0.85s cubic-bezier(0.4,0,0.2,1), transform 0.85s cubic-bezier(0.4,0,0.2,1)" : "none",
        pointerEvents: exiting ? "none" : "auto",
      }}
    >
      {/* ── VIDEO PHASE ── */}
      {phase === "video" && (
        <>
          <video
            ref={videoRef}
            src="/video after loader/videoplayback.mp4"
            autoPlay
            playsInline
            muted={false}
            onCanPlay={() => {
              if (videoRef.current) videoRef.current.playbackRate = 1.5;
            }}
            onEnded={finish}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
          {/* Skip button */}
          <button
            onClick={finish}
            type="button"
            style={{
              position: "absolute",
              bottom: "clamp(1.5rem, 3vw, 2.5rem)",
              right: "clamp(1.5rem, 4vw, 3.5rem)",
              fontFamily: "'Inter', sans-serif",
              fontSize: "clamp(0.6rem, 0.85vw, 0.75rem)",
              fontWeight: 500,
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: "rgba(245,245,245,0.7)",
              background: "none",
              border: "1px solid rgba(245,245,245,0.25)",
              padding: "0.55rem 1.3rem",
              cursor: "pointer",
              zIndex: 10,
              transition: "border-color 0.2s, color 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#E60000";
              e.currentTarget.style.color = "#E60000";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(245,245,245,0.25)";
              e.currentTarget.style.color = "rgba(245,245,245,0.7)";
            }}
          >
            Skip →
          </button>
        </>
      )}

      {/* ── LOADING PHASE ── */}
      {phase === "loading" && (
        <>
          {/* Background image */}
          <img
            src="/images/loader image.png"
            alt=""
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center",
              opacity: 0.72,
            }}
          />

          {/* Vignette */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: [
                "linear-gradient(to bottom, rgba(0,0,0,0.72) 0%, transparent 30%)",
                "linear-gradient(to top,    rgba(0,0,0,0.82) 0%, transparent 35%)",
                "linear-gradient(to right,  rgba(0,0,0,0.55) 0%, transparent 40%)",
                "linear-gradient(to left,   rgba(0,0,0,0.55) 0%, transparent 40%)",
              ].join(", "),
              pointerEvents: "none",
            }}
          />

          {/* Top bar */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              padding: "clamp(1.5rem, 3vw, 2.5rem) clamp(1.5rem, 4vw, 3.5rem)",
            }}
          >
            <div>
              <p style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "clamp(0.6rem, 0.9vw, 0.75rem)",
                fontWeight: 500,
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                color: "rgba(245,245,245,0.45)",
                marginBottom: "0.5rem",
                animation: "loaderSlideDown 0.8s cubic-bezier(0.22,1,0.36,1) 0.2s both",
              }}>
                The Legend, Reimagined.
              </p>
              <p style={{
                fontFamily: "'Orbitron', sans-serif",
                fontSize: "clamp(0.75rem, 1.1vw, 0.9375rem)",
                fontWeight: 600,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "rgba(245,245,245,0.9)",
                animation: "loaderSlideDown 0.8s cubic-bezier(0.22,1,0.36,1) 0.4s both",
              }}>
                The New Mustang Dark Horse Is Arriving.
              </p>
            </div>
          </div>

          {/* Ghost wordmark */}
          <div style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
          }}>
            <p style={{
              fontFamily: "'Orbitron', sans-serif",
              fontSize: "clamp(3.5rem, 10vw, 11rem)",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              lineHeight: 0.9,
              color: "rgba(245,245,245,0.06)",
              textTransform: "uppercase",
              userSelect: "none",
              animation: "loaderFadeIn 1.4s ease 0.1s both",
            }}>
              Mustang
            </p>
          </div>

          {/* Bottom bar */}
          <div style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            padding: "0 clamp(1.5rem, 4vw, 3.5rem) clamp(1.5rem, 3vw, 2.5rem)",
            animation: "loaderSlideUp 0.8s cubic-bezier(0.22,1,0.36,1) 0.3s both",
          }}>
            {/* Progress line */}
            <div style={{
              width: "100%",
              height: "1px",
              background: "rgba(255,255,255,0.08)",
              position: "relative",
              marginBottom: "1.25rem",
            }}>
              <div style={{
                position: "absolute",
                top: 0,
                left: 0,
                height: "100%",
                width: `${pct}%`,
                background: "#E60000",
                boxShadow: "0 0 8px 1px rgba(230,0,0,0.6)",
                transition: "width 0.3s ease",
              }} />
            </div>

            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}>
              {ready ? (
                <button
                  onClick={startVideo}
                  type="button"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "clamp(0.6rem, 0.85vw, 0.75rem)",
                    fontWeight: 500,
                    letterSpacing: "0.28em",
                    textTransform: "uppercase",
                    color: "#F5F5F5",
                    background: "none",
                    border: "1px solid rgba(245,245,245,0.35)",
                    padding: "0.6rem 1.4rem",
                    cursor: "pointer",
                    animation: "enterPulse 1.6s ease-in-out infinite",
                    transition: "border-color 0.2s, color 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#E60000";
                    e.currentTarget.style.color = "#E60000";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "rgba(245,245,245,0.35)";
                    e.currentTarget.style.color = "#F5F5F5";
                  }}
                >
                  [ Start Experience ]
                </button>
              ) : (
                <p style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "clamp(0.55rem, 0.75vw, 0.6875rem)",
                  fontWeight: 400,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: "rgba(245,245,245,0.35)",
                }}>
                  [Loading Experience]
                </p>
              )}

              <p style={{
                fontFamily: "'Orbitron', sans-serif",
                fontSize: "clamp(0.75rem, 1.2vw, 1rem)",
                fontWeight: 600,
                letterSpacing: "0.08em",
                color: "rgba(245,245,245,0.7)",
              }}>
                {pct}<span style={{ color: "#E60000" }}>%</span>
              </p>
            </div>
          </div>
        </>
      )}

      <style>{`
        @keyframes enterPulse {
          0%, 100% { opacity: 0.5; }
          50%       { opacity: 1;   }
        }
        @keyframes loaderSlideDown {
          from { opacity: 0; transform: translateY(-18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes loaderSlideUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes loaderFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @media (max-width: 768px) {
          .loader-title { font-size: 0.7rem !important; }
          .loader-subtitle { font-size: 0.8rem !important; }
        }
      `}</style>
    </div>
  );
}
