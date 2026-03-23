import { useEffect, useState } from "react";

const FONT_FAMILY = "'DM Sans', system-ui, -apple-system, sans-serif";
const FONT_MONO = "'JetBrains Mono', 'SF Mono', monospace";

interface LandingProps {
  onCreateProfile: () => void;
  onTryDemo: () => void;
}


export function Landing({ onCreateProfile, onTryDemo }: LandingProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{
      minHeight: "100vh",
      background: "radial-gradient(ellipse at 50% 30%, #4A2494 0%, #381F7D 40%, #2A1560 100%)",
      fontFamily: FONT_FAMILY,
      display: "flex",
      justifyContent: "center",
      alignItems: "flex-start",
      overflow: "hidden",
      position: "relative",
    }}>
      {/* Ambient glow behind logo */}
      <div style={{
        position: "absolute",
        top: "30%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: 300,
        height: 300,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(187,151,255,0.15) 0%, transparent 70%)",
        filter: "blur(40px)",
        animation: "pulseGlow 4s ease-in-out infinite",
        pointerEvents: "none",
      }} />

      {/* Main content */}
      <div style={{
        width: 390,
        maxWidth: "100vw",
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 32px",
        boxSizing: "border-box",
        textAlign: "center",
        position: "relative",
        zIndex: 2,
      }}>
        {/* Logo */}
        <div style={{
          opacity: mounted ? 1 : 0,
          transform: mounted ? "translateY(0) scale(1)" : "translateY(20px) scale(0.9)",
          transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s",
        }}>
          <img
            src="/Star (7).png"
            alt="StarStruck"
            style={{
              width: 120,
              height: 120,
              filter: "drop-shadow(0 0 30px rgba(187,151,255,0.3))",
            }}
          />
        </div>

        {/* Tagline */}
        <p style={{
          fontSize: 20,
          fontWeight: 500,
          color: "rgba(255,255,255,0.85)",
          lineHeight: 1.5,
          margin: "20px 0 0",
          maxWidth: 280,
          opacity: mounted ? 1 : 0,
          transform: mounted ? "translateY(0)" : "translateY(16px)",
          transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.5s",
        }}>
          Dating profiles built from your{" "}
          <span style={{
            background: "linear-gradient(135deg, #BB97FF, #D9FF82)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontWeight: 700,
          }}>
            real online presence
          </span>
        </p>

        {/* Subtitle */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          margin: "16px 0 44px",
          opacity: mounted ? 1 : 0,
          transform: mounted ? "translateY(0)" : "translateY(12px)",
          transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.7s",
        }}>
          {["connect", "analyze", "match"].map((word, i) => (
            <div key={word} style={{ display: "flex", alignItems: "center", gap: 12 }}>
              {i > 0 && <div style={{
                width: 4,
                height: 4,
                borderRadius: "50%",
                background: "rgba(187,151,255,0.4)",
              }} />}
              <span style={{
                fontSize: 12,
                fontFamily: FONT_MONO,
                fontWeight: 500,
                color: "rgba(187,151,255,0.6)",
                letterSpacing: 1.5,
                textTransform: "uppercase",
              }}>
                {word}
              </span>
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div style={{
          width: "100%",
          maxWidth: 280,
          opacity: mounted ? 1 : 0,
          transform: mounted ? "translateY(0)" : "translateY(16px)",
          transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.9s",
        }}>
          <button
            onClick={onCreateProfile}
            style={{
              width: "100%",
              height: 52,
              borderRadius: 26,
              border: "none",
              background: "linear-gradient(135deg, #BB97FF 0%, #9B6FFF 100%)",
              color: "#fff",
              fontSize: 15,
              fontWeight: 700,
              fontFamily: FONT_FAMILY,
              letterSpacing: 0.5,
              cursor: "pointer",
              marginBottom: 12,
              boxShadow: "0 4px 24px rgba(155,111,255,0.35), inset 0 1px 0 rgba(255,255,255,0.15)",
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-1px)";
              e.currentTarget.style.boxShadow = "0 6px 32px rgba(155,111,255,0.45), inset 0 1px 0 rgba(255,255,255,0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 24px rgba(155,111,255,0.35), inset 0 1px 0 rgba(255,255,255,0.15)";
            }}
          >
            Create Your Profile
          </button>
          <button
            onClick={onTryDemo}
            style={{
              width: "100%",
              height: 52,
              borderRadius: 26,
              border: "1px solid rgba(187,151,255,0.3)",
              background: "rgba(187,151,255,0.08)",
              backdropFilter: "blur(10px)",
              color: "rgba(187,151,255,0.9)",
              fontSize: 15,
              fontWeight: 600,
              fontFamily: FONT_FAMILY,
              letterSpacing: 0.5,
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(187,151,255,0.15)";
              e.currentTarget.style.borderColor = "rgba(187,151,255,0.5)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(187,151,255,0.08)";
              e.currentTarget.style.borderColor = "rgba(187,151,255,0.3)";
            }}
          >
            Try Demo
          </button>
        </div>

        {/* Footer note */}
        <p style={{
          fontSize: 11,
          fontFamily: FONT_MONO,
          color: "rgba(255,255,255,0.18)",
          marginTop: 36,
          letterSpacing: 0.5,
          opacity: mounted ? 1 : 0,
          transition: "opacity 1s ease 1.4s",
        }}>
          no sign-up required
        </p>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.6; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 1; transform: translate(-50%, -50%) scale(1.15); }
        }
      `}</style>
    </div>
  );
}
