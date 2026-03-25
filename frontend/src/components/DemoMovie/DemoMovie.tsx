import { useState, useEffect, useCallback } from "react";
import { COLORS, SURFACE, FONT_FAMILY, FONT_MONO } from "../ConnectAccounts/styles";
import "../ConnectAccounts/connectAccounts.css";
import { DEMO_USER, DEMO_ANALYSIS, DEMO_MATCH, DEMO_COACH_REPLY, DEMO_VENUE } from "./demoData";

const PAGE: React.CSSProperties = {
  minHeight: "100vh",
  background: "#381F7D",
  fontFamily: FONT_FAMILY,
  display: "flex",
  justifyContent: "center",
  alignItems: "flex-start",
};

const FRAME: React.CSSProperties = {
  width: 390,
  maxWidth: "100vw",
  height: "100dvh",
  position: "relative",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
};

const CARD: React.CSSProperties = {
  background: "#5823A5",
  border: `1px solid ${SURFACE.border}`,
  borderRadius: 20,
  padding: 20,
};

interface Scene {
  duration: number;
  label: string;
}

const SCENES: Scene[] = [
  { duration: 4000, label: "Upload Photo" },
  { duration: 4000, label: "Connect GitHub" },
  { duration: 3500, label: "Connect Instagram" },
  { duration: 3500, label: "Connect Letterboxd" },
  { duration: 5000, label: "AI Analysis" },
  { duration: 4500, label: "Your Profile" },
  { duration: 8000, label: "Swipe & Match" },
  { duration: 4500, label: "Match Details" },
  { duration: 5000, label: "AI Coach" },
  { duration: 7500, label: "Plan a Date" },
  { duration: 4000, label: "" },
];

const TOTAL_DURATION = SCENES.reduce((a, s) => a + s.duration, 0);

function StepHeader({ step, title, subtitle }: { step: string; title: string; subtitle?: string }) {
  return (
    <div style={{ padding: "16px 24px 0" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
        <img src="/Star (7).png" alt="StarStruck" style={{ width: 60, height: 60 }} />
      </div>
      <div style={{ fontSize: 11, fontFamily: FONT_MONO, fontWeight: 500, letterSpacing: 1.5, textTransform: "uppercase", color: COLORS.softPeriwinkle, marginBottom: 8 }}>{step}</div>
      <h2 style={{ fontSize: 24, fontWeight: 800, color: SURFACE.textPrimary, margin: "0 0 6px" }}>{title}</h2>
      {subtitle && <p style={{ fontSize: 13, color: SURFACE.textSecondary, margin: 0, lineHeight: 1.5 }}>{subtitle}</p>}
    </div>
  );
}

function ServiceCard({ name, icon, connected, preview, avatar, accent, delay }: {
  name: string; icon: string; connected: boolean; preview?: string; avatar?: string; accent: string; delay?: string;
}) {
  return (
    <div className="card-enter" style={{
      ...CARD,
      display: "flex",
      alignItems: "center",
      gap: 14,
      position: "relative",
      overflow: "hidden",
      borderColor: connected ? `${accent}40` : SURFACE.border,
      animationDelay: delay,
    }}>
      {connected && <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, background: "#4ADE80", borderRadius: "20px 0 0 20px" }} />}
      <span style={{ fontSize: 24, flexShrink: 0 }}>{icon}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: SURFACE.textPrimary }}>{name}</div>
        {connected && preview && (
          <div style={{ fontSize: 12, color: "#4ADE80", marginTop: 4 }}>{preview}</div>
        )}
      </div>
      {connected ? (
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {avatar && <img src={avatar} alt="" style={{ width: 28, height: 28, borderRadius: 14, objectFit: "cover" }} />}
          <span style={{ fontSize: 12, fontWeight: 600, color: "#4ADE80" }}>Connected</span>
        </div>
      ) : (
        <span style={{ fontSize: 12, fontWeight: 600, color: COLORS.softPeriwinkle, border: `1px solid ${COLORS.softPeriwinkle}`, borderRadius: 16, padding: "4px 14px" }}>Connect</span>
      )}
    </div>
  );
}

function SignalBar({ pct }: { pct: number }) {
  return (
    <div style={{ margin: "20px 0", padding: "0 24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
        <span style={{ fontSize: 11, fontFamily: FONT_MONO, color: SURFACE.textTertiary, textTransform: "uppercase", letterSpacing: 1 }}>Signal Strength</span>
        <span style={{ fontSize: 11, fontFamily: FONT_MONO, color: COLORS.limeCreem, fontWeight: 600 }}>{pct}%</span>
      </div>
      <div style={{ height: 4, borderRadius: 2, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct}%`, borderRadius: 2, background: `linear-gradient(90deg, ${COLORS.softPeriwinkle}, ${COLORS.limeCreem})`, transition: "width 0.8s ease" }} />
      </div>
    </div>
  );
}

function AnalysisSpinner({ stepIdx, progress }: { stepIdx: number; progress: number }) {
  const steps = ["Analyzing coding habits\u2026", "Reading film reviews\u2026", "Scanning music taste\u2026", "Mapping your vibe\u2026", "Generating bio\u2026"];
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 24px" }}>
      <div className="pulse-border" style={{ width: 64, height: 64, borderRadius: 32, border: `2px solid ${COLORS.softPeriwinkle}40`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
        <div style={{ width: 48, height: 48, borderRadius: 24, border: `3px solid transparent`, borderTopColor: COLORS.softPeriwinkle, animation: "spin 0.8s linear infinite" }} />
      </div>
      <div style={{ fontSize: 14, fontWeight: 600, color: SURFACE.textSecondary, marginBottom: 16, textAlign: "center" }}>{steps[stepIdx % steps.length]}</div>
      <div style={{ width: 200, height: 4, borderRadius: 2, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${progress}%`, borderRadius: 2, background: `linear-gradient(90deg, ${COLORS.softPeriwinkle}, ${COLORS.limeCreem})`, transition: "width 0.1s linear" }} />
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function FindingCard({ label, value, detail, color, delay }: { label: string; value: string; detail: string; color: string; delay: string }) {
  return (
    <div className="card-enter" style={{ ...CARD, padding: "14px 16px 14px 20px", position: "relative", overflow: "hidden", animationDelay: delay }}>
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 4, background: color, borderRadius: "20px 0 0 20px" }} />
      <div style={{ fontSize: 10, fontFamily: FONT_MONO, fontWeight: 700, color, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 15, fontWeight: 700, color: SURFACE.textPrimary, marginBottom: 4 }}>{value}</div>
      <div style={{ fontSize: 13, color: SURFACE.textSecondary, lineHeight: 1.5 }}>{detail}</div>
    </div>
  );
}

export function DemoMovie({ onExit }: { onExit: () => void }) {
  const [sceneIndex, setSceneIndex] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [paused, setPaused] = useState(false);

  const totalElapsed = SCENES.slice(0, sceneIndex).reduce((a, s) => a + s.duration, 0) + elapsed;
  const progress = (totalElapsed / TOTAL_DURATION) * 100;
  const sceneProgress = elapsed / SCENES[sceneIndex].duration;

  useEffect(() => {
    if (paused) return;
    const interval = setInterval(() => {
      setElapsed(prev => {
        const next = prev + 50;
        if (next >= SCENES[sceneIndex].duration) {
          if (sceneIndex < SCENES.length - 1) {
            setSceneIndex(i => i + 1);
            return 0;
          }
          return prev;
        }
        return next;
      });
    }, 50);
    return () => clearInterval(interval);
  }, [sceneIndex, paused]);

  const scene = SCENES[sceneIndex];

  const renderScene = () => {
    switch (sceneIndex) {
      // Scene 0: Photo Upload
      case 0: {
        const photoVisible = sceneProgress > 0.2;
        const nameProgress = Math.max(0, (sceneProgress - 0.5) / 0.4);
        const nameText = DEMO_USER.name.slice(0, Math.floor(nameProgress * DEMO_USER.name.length));
        return (
          <div style={{ flex: 1, padding: "0 24px", overflowY: "auto" }}>
            <StepHeader step="Step 1 of 4" title="Add your photos" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginTop: 24 }}>
              <div style={{
                aspectRatio: "1",
                borderRadius: 16,
                overflow: "hidden",
                border: `2px solid ${COLORS.softPeriwinkle}40`,
                opacity: photoVisible ? 1 : 0,
                transform: photoVisible ? "scale(1)" : "scale(0.8)",
                transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
                position: "relative",
              }}>
                <img src={DEMO_USER.photo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <div style={{ position: "absolute", bottom: 6, left: 6, fontSize: 9, fontFamily: FONT_MONO, color: "#fff", background: COLORS.softPeriwinkle, padding: "2px 8px", borderRadius: 8, fontWeight: 600 }}>Profile</div>
              </div>
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} style={{ aspectRatio: "1", borderRadius: 16, border: `1px dashed rgba(255,255,255,0.1)`, background: "rgba(255,255,255,0.02)" }} />
              ))}
            </div>
            <div style={{ marginTop: 24 }}>
              <div style={{ fontSize: 11, fontFamily: FONT_MONO, color: SURFACE.textTertiary, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Your name</div>
              <div style={{
                height: 48, borderRadius: 16, border: `1px solid ${COLORS.softPeriwinkle}30`, background: "#5823A5",
                display: "flex", alignItems: "center", padding: "0 16px",
                fontSize: 16, color: SURFACE.textPrimary, fontFamily: FONT_FAMILY,
              }}>
                {nameText}<span style={{ borderRight: `2px solid ${COLORS.softPeriwinkle}`, marginLeft: 1, animation: "blink 1s step-end infinite" }}>&nbsp;</span>
              </div>
              <style>{`@keyframes blink { 50% { opacity: 0; } }`}</style>
            </div>
          </div>
        );
      }

      // Scenes 1-3: Connect Services
      case 1:
      case 2:
      case 3: {
        const ghConnected = sceneIndex >= 1;
        const igConnected = sceneIndex >= 2;
        const lbConnected = sceneIndex >= 3;
        const currentConnecting = sceneIndex === 1 ? "github" : sceneIndex === 2 ? "instagram" : "letterboxd";
        const animating = sceneProgress < 0.5;
        const pct = ghConnected && igConnected && lbConnected ? 100 : ghConnected && igConnected ? 75 : ghConnected ? 40 : 0;

        return (
          <div style={{ flex: 1, overflowY: "auto" }}>
            <StepHeader step="Step 2 of 4" title="Connect your world" subtitle="We analyze your taste to find your perfect match." />
            <div style={{ padding: "20px 24px 0", display: "flex", flexDirection: "column", gap: 12 }}>
              <ServiceCard
                name="GitHub" icon="💻"
                connected={ghConnected && !(currentConnecting === "github" && animating)}
                preview={DEMO_USER.github.preview}
                avatar={DEMO_USER.github.avatar}
                accent={COLORS.softPeriwinkle}
              />
              <ServiceCard
                name="Instagram" icon="📸"
                connected={igConnected && !(currentConnecting === "instagram" && animating)}
                preview={DEMO_USER.instagram.preview}
                avatar={DEMO_USER.instagram.avatar}
                accent={COLORS.hotFuchsia}
              />
              <ServiceCard
                name="Letterboxd" icon="🎬"
                connected={lbConnected && !(currentConnecting === "letterboxd" && animating)}
                preview={DEMO_USER.letterboxd.preview}
                accent="#00E054"
              />
            </div>
            <SignalBar pct={pct} />
          </div>
        );
      }

      // Scene 4: AI Analysis loading
      case 4: {
        const stepIdx = Math.floor(sceneProgress * 5);
        const progressPct = Math.min(90, sceneProgress * 95);
        return (
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <StepHeader step="Step 3 of 4" title="Analyzing your vibe" />
            <AnalysisSpinner stepIdx={stepIdx} progress={progressPct} />
          </div>
        );
      }

      // Scene 5: Analysis Results
      case 5: {
        const colors = [COLORS.limeCreem, COLORS.brightAmber, COLORS.softPeriwinkle];
        return (
          <div style={{ flex: 1, overflowY: "auto", padding: "0 24px 24px" }}>
            <StepHeader step="Step 3 of 4" title="Your profile" />
            <div className="card-enter" style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: 16, marginBottom: 12 }}>
              <img src={DEMO_USER.photo} alt="" style={{ width: 80, height: 80, borderRadius: 40, objectFit: "cover", border: `2px solid ${COLORS.softPeriwinkle}40`, marginBottom: 10 }} />
              <span style={{ fontSize: 20, fontWeight: 800, color: SURFACE.textPrimary }}>{DEMO_USER.name}</span>
            </div>
            <div style={{ ...CARD, marginBottom: 16 }}>
              <div style={{ fontSize: 15, color: SURFACE.textPrimary, fontStyle: "italic", lineHeight: 1.5 }}>
                &ldquo;{DEMO_ANALYSIS.bio}&rdquo;
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
              {DEMO_ANALYSIS.findings.map((f, i) => (
                <FindingCard key={f.label} label={f.label} value={f.value} detail={f.detail} color={colors[i]} delay={`${i * 0.15}s`} />
              ))}
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {DEMO_ANALYSIS.tags.map(tag => (
                <span key={tag} className="card-enter" style={{
                  fontSize: 12, fontWeight: 600, color: COLORS.softPeriwinkle,
                  background: `${COLORS.softPeriwinkle}1A`, padding: "5px 12px",
                  borderRadius: 20, border: `1px solid ${COLORS.softPeriwinkle}30`,
                }}>{tag}</span>
              ))}
            </div>
          </div>
        );
      }

      // Scene 6: Swipe & Match (view Ava → X button press → view Luna → heart button press → match)
      case 6: {
        // Timeline: 0-0.2 view Ava | 0.2-0.25 X press | 0.25-0.35 card exits left | 0.35-0.55 view Luna | 0.55-0.6 heart press | 0.6-0.7 card exits right | 0.7+ match
        const xBtnPress = sceneProgress >= 0.2 && sceneProgress < 0.25;
        const card1Exit = sceneProgress >= 0.25 && sceneProgress < 0.35;
        const heartBtnPress = sceneProgress >= 0.55 && sceneProgress < 0.6;
        const card2Exit = sceneProgress >= 0.6 && sceneProgress < 0.7;
        const matchOverlay = sceneProgress >= 0.7;
        const matchText = sceneProgress >= 0.8;

        // Card 1 (Ava): still until X pressed, then exits left
        const card1Visible = sceneProgress < 0.35;
        const card1X = card1Exit ? -((sceneProgress - 0.25) / 0.1) * 500 : 0;

        // Card 2 (Luna): still until heart pressed, then exits right
        const card2Visible = sceneProgress >= 0.35 && sceneProgress < 0.7;
        const card2X = card2Exit ? ((sceneProgress - 0.6) / 0.1) * 500 : 0;

        const btnStyle = (color: string, pressed: boolean): React.CSSProperties => ({
          width: 56, height: 56, borderRadius: 28,
          background: pressed ? `${color}40` : `${color}15`,
          border: `2px solid ${pressed ? color : `${color}40`}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          transform: pressed ? "scale(0.85)" : "scale(1)",
          transition: "all 0.15s ease",
        });

        return (
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            {/* Card area */}
            <div style={{ flex: 1, position: "relative", margin: "12px 16px", overflow: "hidden" }}>
              {/* Ava */}
              {card1Visible && (
                <div style={{
                  position: "absolute", inset: 0, borderRadius: 20, overflow: "hidden",
                  transform: `translateX(${card1X}px) rotate(${card1X * 0.06}deg)`,
                  opacity: Math.max(0, 1 - Math.abs(card1X) / 400),
                  transition: card1Exit ? "none" : "transform 0.3s ease",
                }}>
                  <img src="/profile_photos/1.png" alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "50%", background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)" }} />
                  <div style={{ position: "absolute", bottom: 20, left: 20 }}>
                    <span style={{ fontSize: 28, fontWeight: 800, color: "#fff" }}>Ava</span>
                    <span style={{ fontSize: 22, fontWeight: 400, color: "rgba(255,255,255,0.7)", marginLeft: 8 }}>26</span>
                  </div>
                </div>
              )}

              {/* Luna */}
              {card2Visible && (
                <div className={!card2Exit ? "card-enter" : ""} style={{
                  position: "absolute", inset: 0, borderRadius: 20, overflow: "hidden",
                  transform: `translateX(${card2X}px) rotate(${card2X * 0.06}deg)`,
                  opacity: Math.max(0, 1 - Math.abs(card2X) / 400),
                  transition: card2Exit ? "none" : "transform 0.3s ease",
                }}>
                  <img src={DEMO_MATCH.photo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "50%", background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)" }} />
                  <div style={{ position: "absolute", bottom: 20, left: 20 }}>
                    <span style={{ fontSize: 28, fontWeight: 800, color: "#fff" }}>{DEMO_MATCH.name}</span>
                    <span style={{ fontSize: 22, fontWeight: 400, color: "rgba(255,255,255,0.7)", marginLeft: 8 }}>{DEMO_MATCH.age}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Action buttons */}
            {!matchOverlay && (
              <div style={{
                display: "flex", justifyContent: "center", alignItems: "center", gap: 20,
                padding: "12px 0 28px", zIndex: 5,
              }}>
                <div style={btnStyle(COLORS.hotFuchsia, xBtnPress)}>
                  <svg width={26} height={26} viewBox="0 0 24 24" fill="none" stroke={COLORS.hotFuchsia} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </div>
                <div style={btnStyle(COLORS.limeCreem, heartBtnPress)}>
                  <svg width={26} height={26} viewBox="0 0 24 24" fill={COLORS.limeCreem} stroke="none">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                </div>
              </div>
            )}

            {/* Match overlay */}
            {matchOverlay && (
              <div className="overlay-enter" style={{
                position: "absolute", inset: 0, background: "#662288", zIndex: 10,
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24,
              }}>
                <img src="/Star (7).png" alt="" className="match-logo-pulse" style={{ width: 80, height: 80, marginBottom: 24 }} />
                {matchText && (
                  <div className="match-text-enter" style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 32, fontWeight: 800, color: COLORS.hotFuchsia, marginBottom: 12, letterSpacing: -0.5 }}>It's a Match!</div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, marginBottom: 16 }}>
                      <img src={DEMO_USER.photo} alt="" style={{ width: 72, height: 72, borderRadius: 36, objectFit: "cover", border: `2px solid ${COLORS.softPeriwinkle}` }} />
                      <svg width={28} height={28} viewBox="0 0 24 24" fill={COLORS.hotFuchsia} stroke="none"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
                      <img src={DEMO_MATCH.photo} alt="" style={{ width: 72, height: 72, borderRadius: 36, objectFit: "cover", border: `2px solid ${COLORS.hotFuchsia}` }} />
                    </div>
                    <div style={{ fontSize: 15, color: SURFACE.textSecondary }}>Pranav and {DEMO_MATCH.name} liked each other</div>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      }

      // Scene 7: Match Profile / Crossref
      case 7: {
        return (
          <div style={{ flex: 1, overflowY: "auto", padding: "0 20px 24px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 16, marginBottom: 16 }}>
              <img src={DEMO_MATCH.photo} alt="" style={{ width: 64, height: 64, borderRadius: 32, objectFit: "cover" }} />
              <div>
                <div style={{ fontSize: 24, fontWeight: 800, color: SURFACE.textPrimary }}>{DEMO_MATCH.name}, {DEMO_MATCH.age}</div>
                <div style={{ fontSize: 13, fontFamily: FONT_MONO, color: COLORS.limeCreem }}>{DEMO_MATCH.compatibility} compatible</div>
              </div>
            </div>
            <div style={{ fontSize: 11, fontFamily: FONT_MONO, fontWeight: 700, color: SURFACE.textTertiary, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 10, marginTop: 20 }}>Shared</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {DEMO_MATCH.shared.map((item, i) => (
                <div key={item.title} className="card-enter" style={{ background: `${COLORS.limeCreem}0D`, border: `1px solid ${COLORS.limeCreem}20`, borderRadius: 16, padding: "14px 16px", animationDelay: `${i * 0.15}s` }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.limeCreem, marginBottom: 4 }}>{item.title}</div>
                  <div style={{ fontSize: 13, color: SURFACE.textSecondary, lineHeight: 1.5 }}>{item.description}</div>
                </div>
              ))}
            </div>
            <div style={{ fontSize: 11, fontFamily: FONT_MONO, fontWeight: 700, color: SURFACE.textTertiary, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 10, marginTop: 20 }}>Complementary</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {DEMO_MATCH.complementary.map((item, i) => (
                <div key={item.title} className="card-enter" style={{ background: `${COLORS.brightAmber}0D`, border: `1px solid ${COLORS.brightAmber}20`, borderRadius: 16, padding: "14px 16px", animationDelay: `${(i + 2) * 0.15}s` }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.brightAmber, marginBottom: 4 }}>{item.title}</div>
                  <div style={{ fontSize: 13, color: SURFACE.textSecondary, lineHeight: 1.5 }}>{item.description}</div>
                </div>
              ))}
            </div>
          </div>
        );
      }

      // Scene 8: Coach Chat
      case 8: {
        const questionVisible = sceneProgress > 0.1;
        const replyVisible = sceneProgress > 0.5;
        return (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
            <div style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: 12, borderBottom: `1px solid ${SURFACE.border}` }}>
              <img src={DEMO_MATCH.photo} alt="" style={{ width: 36, height: 36, borderRadius: 18, objectFit: "cover" }} />
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: SURFACE.textPrimary }}>Cupid</div>
                <div style={{ fontSize: 11, fontFamily: FONT_MONO, color: COLORS.hotFuchsia, letterSpacing: 0.5 }}>Coaching for {DEMO_MATCH.name}</div>
              </div>
            </div>
            <div style={{ flex: 1, overflowY: "auto", padding: "16px 16px 8px" }}>
              {questionVisible && (
                <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 10 }}>
                  <div style={{ maxWidth: "75%", padding: "12px 16px", borderRadius: "18px 18px 4px 18px", background: COLORS.softPeriwinkle, color: "#fff", fontSize: 14, lineHeight: 1.5, fontFamily: FONT_FAMILY }}>
                    What should we talk about on our first date?
                  </div>
                </div>
              )}
              {replyVisible && (
                <div className="card-enter" style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                  <div style={{ width: 28, height: 28, borderRadius: 14, background: `${COLORS.hotFuchsia}20`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={COLORS.hotFuchsia} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                      <path d="M12 8v4" /><path d="M12 16h.01" />
                    </svg>
                  </div>
                  <div style={{ maxWidth: "75%", padding: "12px 16px", borderRadius: "18px 18px 18px 4px", background: "#5823A5", color: SURFACE.textPrimary, fontSize: 14, lineHeight: 1.5, fontFamily: FONT_FAMILY }}>
                    {DEMO_COACH_REPLY}
                  </div>
                </div>
              )}
              {questionVisible && !replyVisible && (
                <div style={{ display: "flex", gap: 8 }}>
                  <div style={{ width: 28, height: 28, borderRadius: 14, background: `${COLORS.hotFuchsia}20`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={COLORS.hotFuchsia} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                      <path d="M12 8v4" /><path d="M12 16h.01" />
                    </svg>
                  </div>
                  <div style={{ padding: "12px 16px", borderRadius: "18px 18px 18px 4px", background: "#5823A5", color: SURFACE.textTertiary, fontSize: 14, fontFamily: FONT_MONO }}>thinking...</div>
                </div>
              )}
            </div>
          </div>
        );
      }

      // Scene 9: Date Planning
      case 9: {
        const planning = sceneProgress < 0.35;
        const showVenue = sceneProgress >= 0.35;
        const planProgress = planning ? (sceneProgress / 0.35) * 100 : 100;
        return (
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            {planning ? (
              <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 24px" }}>
                <img src={DEMO_MATCH.photo} alt="" style={{ width: 72, height: 72, borderRadius: 36, objectFit: "cover", marginBottom: 20, border: `2px solid ${COLORS.softPeriwinkle}40` }} />
                <div style={{ fontSize: 18, fontWeight: 700, color: SURFACE.textPrimary, marginBottom: 16 }}>Planning a date with {DEMO_MATCH.name}</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: SURFACE.textSecondary, marginBottom: 12 }}>Scouting date spots in NYC\u2026</div>
                <div style={{ width: 200, height: 4, borderRadius: 2, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${planProgress}%`, borderRadius: 2, background: `linear-gradient(90deg, ${COLORS.softPeriwinkle}, ${COLORS.limeCreem})`, transition: "width 0.1s linear" }} />
                </div>
              </div>
            ) : (
              <div className="card-enter" style={{ flex: 1, overflowY: "auto", padding: "20px 20px 24px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
                  <img src={DEMO_MATCH.photo} alt="" style={{ width: 56, height: 56, borderRadius: 28, objectFit: "cover" }} />
                  <div style={{ fontSize: 20, fontWeight: 800, color: SURFACE.textPrimary }}>{DEMO_MATCH.name}, {DEMO_MATCH.age}</div>
                </div>
                <div style={{ fontSize: 13, fontFamily: FONT_MONO, fontWeight: 700, color: SURFACE.textSecondary, textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>Date Suggestion</div>
                <div style={{ ...CARD, position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, background: COLORS.limeCreem, borderRadius: "20px 0 0 20px" }} />
                  <div style={{ fontSize: 17, fontWeight: 700, color: SURFACE.textPrimary, marginBottom: 4 }}>{DEMO_VENUE.place}</div>
                  <div style={{ fontSize: 13, color: SURFACE.textSecondary, marginBottom: 6 }}>{DEMO_VENUE.address}</div>
                  <div style={{ fontSize: 12, fontFamily: FONT_MONO, color: COLORS.brightAmber, marginBottom: 12 }}>{DEMO_VENUE.date}</div>
                  <div style={{ fontSize: 14, color: SURFACE.textSecondary, lineHeight: 1.5, fontStyle: "italic" }}>"{DEMO_VENUE.reason}"</div>
                </div>
              </div>
            )}
          </div>
        );
      }

      // Scene 10: End Card
      case 10:
        return (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 32 }}>
            <img src="/Star (7).png" alt="" style={{ width: 80, height: 80, marginBottom: 24 }} />
            <div style={{ fontSize: 28, fontWeight: 800, color: SURFACE.textPrimary, textAlign: "center", marginBottom: 8 }}>That's StarStruck</div>
            <div style={{ fontSize: 14, color: SURFACE.textSecondary, textAlign: "center", lineHeight: 1.5, maxWidth: 280, marginBottom: 32 }}>
              AI-powered personality profiles from your real online presence. No fake bios.
            </div>
            <button
              onClick={onExit}
              style={{
                width: "100%", maxWidth: 260, height: 52, borderRadius: 26, border: "none",
                background: "linear-gradient(135deg, #BB97FF 0%, #9B6FFF 50%, #7C4DFF 100%)",
                color: "#fff", fontSize: 16, fontWeight: 700, fontFamily: FONT_FAMILY,
                cursor: "pointer", marginBottom: 12,
                boxShadow: "0 4px 24px rgba(155,111,255,0.35)",
              }}
            >
              Try It Yourself
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div style={PAGE}>
      <div style={FRAME}>
        {/* Progress bar */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 50, height: 3, background: "rgba(255,255,255,0.06)" }}>
          <div style={{ height: "100%", width: `${progress}%`, background: `linear-gradient(90deg, ${COLORS.softPeriwinkle}, ${COLORS.limeCreem})`, transition: "width 0.05s linear" }} />
        </div>

        {/* Controls */}
        <div style={{ position: "absolute", top: 8, left: 12, right: 12, zIndex: 50, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <button onClick={onExit} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 12, fontFamily: FONT_MONO, color: SURFACE.textTertiary, padding: "4px 8px", letterSpacing: 0.5 }}>
            Skip
          </button>
          {scene.label && (
            <span style={{ fontSize: 10, fontFamily: FONT_MONO, color: SURFACE.textTertiary, letterSpacing: 1, textTransform: "uppercase" }}>{scene.label}</span>
          )}
          <button onClick={() => setPaused(p => !p)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 16, color: SURFACE.textTertiary, padding: "4px 8px" }}>
            {paused ? "\u25B6" : "\u23F8"}
          </button>
        </div>

        {/* Scene content */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", paddingTop: 32, overflow: "hidden" }}>
          {renderScene()}
        </div>
      </div>
    </div>
  );
}
