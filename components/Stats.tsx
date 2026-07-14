import Reveal from "./Reveal";

const stats = [
  { value: "500",   unit: " HP",  caption: "Naturally aspirated V8 output" },
  { value: "3,700", unit: " LBS", caption: "Curb weight, base coupe" },
  { value: "3.5",   unit: " SEC", caption: "0–60 mph" },
  { value: "163",   unit: " MPH", caption: "Top speed, track pack" },
];

export default function Stats() {
  return (
    <section
      style={{
        background: "#000",
        padding: "120px 24px",
        borderTop: "1px solid #2A2A2A",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <Reveal>
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.8125rem",
              fontWeight: 500,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#858585",
              marginBottom: "12px",
            }}
          >
            By the numbers
          </p>
          <h2
            style={{
              fontFamily: "'Orbitron', sans-serif",
              fontSize: "clamp(1.875rem, 4vw, 3.25rem)",
              fontWeight: 600,
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              color: "#F5F5F5",
              marginBottom: "64px",
              maxWidth: "600px",
            }}
          >
            Performance, uncompromised.
          </h2>
        </Reveal>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 0,
          }}
        >
          {stats.map((s, i) => (
            <Reveal
              key={s.unit}
              delay={i * 100}
              style={{
                padding: "0 32px",
                borderLeft: i > 0 ? "1px solid #2A2A2A" : "none",
              }}
            >
              <div
                style={{
                  fontFamily: "'Orbitron', sans-serif",
                  fontSize: "clamp(2.5rem, 5vw, 4rem)",
                  fontWeight: 700,
                  lineHeight: 1,
                  letterSpacing: "-0.02em",
                  color: "#F5F5F5",
                  marginBottom: "8px",
                }}
              >
                {s.value}
                <span style={{ color: "#E60000" }}>{s.unit}</span>
              </div>
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "0.875rem",
                  color: "#858585",
                  lineHeight: 1.5,
                  maxWidth: "18ch",
                }}
              >
                {s.caption}
              </p>
            </Reveal>
          ))}
        </div>

        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "0.8125rem",
            color: "#858585",
            marginTop: "48px",
          }}
        >
          *Figures shown are illustrative — replace with your trim's official specs.
        </p>
      </div>
    </section>
  );
}
