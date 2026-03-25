import { useEffect, useState } from "react";

const FONT_FAMILY = "'DM Sans', system-ui, -apple-system, sans-serif";
const FONT_MONO = "'JetBrains Mono', 'SF Mono', monospace";

interface LandingProps {
  onCreateProfile: () => void;
  onTryDemo: () => void;
  onWatchDemo?: () => void;
}

const FLOATING_ICONS = [
  { emoji: "🎵", x: 12, y: 18, size: 28, delay: 0, duration: 6 },
  { emoji: "🎬", x: 82, y: 22, size: 24, delay: 1.2, duration: 7 },
  { emoji: "💻", x: 8, y: 65, size: 22, delay: 2.5, duration: 5.5 },
  { emoji: "📸", x: 88, y: 58, size: 26, delay: 0.8, duration: 6.5 },
  { emoji: "⭐", x: 20, y: 42, size: 18, delay: 3.2, duration: 5 },
  { emoji: "🎧", x: 78, y: 75, size: 20, delay: 1.8, duration: 7.5 },
  { emoji: "✨", x: 92, y: 38, size: 16, delay: 4, duration: 6 },
  { emoji: "🎯", x: 6, y: 82, size: 18, delay: 2, duration: 5.8 },
];

export function Landing({ onCreateProfile, onTryDemo, onWatchDemo }: LandingProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{
      minHeight: "100vh",
      background: "#1a0e35",
      fontFamily: FONT_FAMILY,
      display: "flex",
      justifyContent: "center",
      alignItems: "flex-start",
      overflow: "hidden",
      position: "relative",
    }}>
      {/* Mesh gradient background */}
      <div style={{
        position: "absolute",
        inset: 0,
        background: `
          radial-gradient(ellipse 80% 60% at 50% 20%, rgba(88,35,165,0.6) 0%, transparent 60%),
          radial-gradient(ellipse 60% 50% at 20% 60%, rgba(155,111,255,0.15) 0%, transparent 50%),
          radial-gradient(ellipse 60% 40% at 80% 70%, rgba(217,255,130,0.08) 0%, transparent 50%),
          radial-gradient(ellipse 100% 100% at 50% 50%, #1a0e35 0%, #0f0820 100%)
        `,
        pointerEvents: "none",
      }} />

      {/* Large ambient glow behind logo */}
      <div style={{
        position: "absolute",
        top: "28%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: 500,
        height: 500,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(155,111,255,0.25) 0%, rgba(88,35,165,0.1) 40%, transparent 70%)",
        filter: "blur(60px)",
        animation: "pulseGlow 4s ease-in-out infinite",
        pointerEvents: "none",
      }} />

      {/* Secondary glow - lime accent */}
      <div style={{
        position: "absolute",
        top: "35%",
        left: "55%",
        transform: "translate(-50%, -50%)",
        width: 300,
        height: 300,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(217,255,130,0.08) 0%, transparent 60%)",
        filter: "blur(50px)",
        animation: "pulseGlow 5s ease-in-out infinite 1s",
        pointerEvents: "none",
      }} />

      {/* Floating icons */}
      {FLOATING_ICONS.map((icon, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${icon.x}%`,
            top: `${icon.y}%`,
            fontSize: icon.size,
            opacity: mounted ? 0.15 : 0,
            transition: `opacity 1.5s ease ${icon.delay + 0.5}s`,
            animation: mounted ? `floatIcon ${icon.duration}s ease-in-out infinite ${icon.delay}s` : "none",
            pointerEvents: "none",
            zIndex: 1,
            filter: "blur(0.5px)",
          }}
        >
          {icon.emoji}
        </div>
      ))}

      {/* Subtle grid pattern overlay */}
      <div style={{
        position: "absolute",
        inset: 0,
        backgroundImage: `
          linear-gradient(rgba(187,151,255,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(187,151,255,0.03) 1px, transparent 1px)
        `,
        backgroundSize: "60px 60px",
        pointerEvents: "none",
        maskImage: "radial-gradient(ellipse at 50% 40%, black 20%, transparent 70%)",
        WebkitMaskImage: "radial-gradient(ellipse at 50% 40%, black 20%, transparent 70%)",
      }} />

      {/* Main content */}
      <div style={{
        width: 420,
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
          transform: mounted ? "translateY(0) scale(1)" : "translateY(30px) scale(0.85)",
          transition: "all 1s cubic-bezier(0.16, 1, 0.3, 1) 0.2s",
          position: "relative",
        }}>
          {/* Logo ring effect */}
          <div style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 220,
            height: 220,
            borderRadius: "50%",
            border: "1px solid rgba(187,151,255,0.1)",
            animation: "ringPulse 3s ease-in-out infinite",
          }} />
          <div style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 280,
            height: 280,
            borderRadius: "50%",
            border: "1px solid rgba(187,151,255,0.05)",
            animation: "ringPulse 3s ease-in-out infinite 0.5s",
          }} />
          <img
            src="/Star (7).png"
            alt="StarStruck"
            style={{
              width: 180,
              height: 180,
              filter: "drop-shadow(0 0 40px rgba(155,111,255,0.4)) drop-shadow(0 0 80px rgba(155,111,255,0.15))",
              position: "relative",
              zIndex: 1,
            }}
          />
        </div>

        {/* Tagline */}
        <p style={{
          fontSize: 24,
          fontWeight: 500,
          color: "rgba(255,255,255,0.9)",
          lineHeight: 1.45,
          margin: "28px 0 0",
          maxWidth: 320,
          opacity: mounted ? 1 : 0,
          transform: mounted ? "translateY(0)" : "translateY(20px)",
          transition: "all 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.5s",
          letterSpacing: -0.3,
        }}>
          Dating profiles built from your{" "}
          <span style={{
            background: "linear-gradient(135deg, #BB97FF 0%, #D9FF82 50%, #BB97FF 100%)",
            backgroundSize: "200% 100%",
            animation: "shimmerText 3s ease-in-out infinite",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontWeight: 700,
          }}>
            real online presence
          </span>
        </p>

        {/* Subtitle pills */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          margin: "20px 0 48px",
          opacity: mounted ? 1 : 0,
          transform: mounted ? "translateY(0)" : "translateY(12px)",
          transition: "all 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.7s",
        }}>
          {["connect", "analyze", "match"].map((word, i) => (
            <div key={word} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {i > 0 && <div style={{
                width: 3,
                height: 3,
                borderRadius: "50%",
                background: "rgba(187,151,255,0.3)",
              }} />}
              <span style={{
                fontSize: 11,
                fontFamily: FONT_MONO,
                fontWeight: 500,
                color: "rgba(187,151,255,0.5)",
                letterSpacing: 2,
                textTransform: "uppercase",
                padding: "4px 10px",
                borderRadius: 20,
                border: "1px solid rgba(187,151,255,0.08)",
                background: "rgba(187,151,255,0.04)",
              }}>
                {word}
              </span>
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div style={{
          width: "100%",
          maxWidth: 300,
          opacity: mounted ? 1 : 0,
          transform: mounted ? "translateY(0)" : "translateY(20px)",
          transition: "all 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.9s",
        }}>
          <button
            onClick={onCreateProfile}
            style={{
              width: "100%",
              height: 56,
              borderRadius: 28,
              border: "none",
              background: "linear-gradient(135deg, #BB97FF 0%, #9B6FFF 50%, #7C4DFF 100%)",
              color: "#fff",
              fontSize: 16,
              fontWeight: 700,
              fontFamily: FONT_FAMILY,
              letterSpacing: 0.3,
              cursor: "pointer",
              marginBottom: 14,
              boxShadow: "0 4px 24px rgba(155,111,255,0.35), 0 12px 48px rgba(155,111,255,0.15), inset 0 1px 0 rgba(255,255,255,0.2)",
              transition: "transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s ease",
              position: "relative",
              overflow: "hidden",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px) scale(1.01)";
              e.currentTarget.style.boxShadow = "0 6px 32px rgba(155,111,255,0.5), 0 16px 56px rgba(155,111,255,0.2), inset 0 1px 0 rgba(255,255,255,0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0) scale(1)";
              e.currentTarget.style.boxShadow = "0 4px 24px rgba(155,111,255,0.35), 0 12px 48px rgba(155,111,255,0.15), inset 0 1px 0 rgba(255,255,255,0.2)";
            }}
          >
            Create Your Profile
          </button>
          {onWatchDemo && (
            <button
              onClick={onWatchDemo}
              style={{
                width: "100%",
                height: 56,
                borderRadius: 28,
                border: `1px solid ${"#FF4466"}30`,
                background: `${"#FF4466"}0A`,
                backdropFilter: "blur(20px)",
                color: "#FF4466",
                fontSize: 16,
                fontWeight: 600,
                fontFamily: FONT_FAMILY,
                letterSpacing: 0.3,
                cursor: "pointer",
                marginBottom: 14,
                transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = `${"#FF4466"}15`;
                e.currentTarget.style.borderColor = `${"#FF4466"}50`;
                e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = `${"#FF4466"}0A`;
                e.currentTarget.style.borderColor = `${"#FF4466"}30`;
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              Watch Demo
            </button>
          )}
          <button
            onClick={onTryDemo}
            style={{
              width: "100%",
              height: 56,
              borderRadius: 28,
              border: "1px solid rgba(187,151,255,0.2)",
              background: "rgba(187,151,255,0.06)",
              backdropFilter: "blur(20px)",
              color: "rgba(187,151,255,0.85)",
              fontSize: 16,
              fontWeight: 600,
              fontFamily: FONT_FAMILY,
              letterSpacing: 0.3,
              cursor: "pointer",
              transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(187,151,255,0.12)";
              e.currentTarget.style.borderColor = "rgba(187,151,255,0.4)";
              e.currentTarget.style.transform = "translateY(-1px)";
              e.currentTarget.style.color = "rgba(187,151,255,1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(187,151,255,0.06)";
              e.currentTarget.style.borderColor = "rgba(187,151,255,0.2)";
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.color = "rgba(187,151,255,0.85)";
            }}
          >
            Try Demo
          </button>
        </div>

        {/* Footer note */}
        <p style={{
          fontSize: 11,
          fontFamily: FONT_MONO,
          color: "rgba(255,255,255,0.15)",
          marginTop: 40,
          letterSpacing: 1,
          opacity: mounted ? 1 : 0,
          transition: "opacity 1.2s ease 1.6s",
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
        @keyframes ringPulse {
          0%, 100% { opacity: 0.4; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 0.8; transform: translate(-50%, -50%) scale(1.06); }
        }
        @keyframes floatIcon {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          25% { transform: translateY(-12px) rotate(3deg); }
          75% { transform: translateY(8px) rotate(-2deg); }
        }
        @keyframes shimmerText {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  );
}
