"use client";

interface LoaderProps {
  pct: number;
  ready: boolean;
  onEnter: () => void;
}

export default function Loader({ pct, ready, onEnter }: LoaderProps) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "#000",
        overflow: "hidden",
      }}
    >
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

      {/* ── Top bar ── */}
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
          }}>
            The New Mustang Dark Horse Is Arriving.
          </p>
        </div>
        <button
          type="button"
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "clamp(0.6rem, 0.8vw, 0.6875rem)",
            fontWeight: 500,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "rgba(245,245,245,0.4)",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
          }}
        >
          Language
        </button>
      </div>

      {/* ── Ghost wordmark ── */}
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
        }}>
          Mustang
        </p>
      </div>

      {/* ── Bottom bar ── */}
      <div style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        padding: "0 clamp(1.5rem, 4vw, 3.5rem) clamp(1.5rem, 3vw, 2.5rem)",
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
          {/* Left: loading label OR enter button */}
          {ready ? (
            <button
              onClick={onEnter}
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
                (e.currentTarget as HTMLButtonElement).style.borderColor = "#E60000";
                (e.currentTarget as HTMLButtonElement).style.color = "#E60000";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(245,245,245,0.35)";
                (e.currentTarget as HTMLButtonElement).style.color = "#F5F5F5";
              }}
            >
              [ Enter Experience ]
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

          {/* Right: percentage */}
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

      <style>{`
        @keyframes enterPulse {
          0%, 100% { opacity: 0.5; }
          50%       { opacity: 1;   }
        }
      `}</style>
    </div>
  );
}
