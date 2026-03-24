import { useState, useCallback } from "react";
import { COLORS, SURFACE, FONT_FAMILY, FONT_MONO } from "../ConnectAccounts/styles";
import { API_BASE } from "../../services/api";
import type { MatchProfile, AnalysisData } from "./types";
import { CupidIcon, SendIcon } from "./icons";
import { MATCHES } from "./constants";

function CoachMatchList({ onSelectMatch }: { onSelectMatch: (m: MatchProfile) => void }) {
  return (
    <div style={{ padding: "0 16px", flex: 1, overflowY: "auto" }}>
      <h2 style={{ fontSize: 24, fontWeight: 800, color: SURFACE.textPrimary, margin: "0 0 8px 8px" }}>Dating Coach</h2>
      <p style={{ fontSize: 13, color: SURFACE.textSecondary, margin: "0 0 20px 8px", lineHeight: 1.5 }}>
        Get personalized advice from Cupid about any of your matches
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {MATCHES.map((m, i) => (
          <div
            key={m.name}
            className="card-enter"
            onClick={() => onSelectMatch(m)}
            style={{
              background: "#5823A5",
              border: `1px solid ${SURFACE.border}`,
              borderRadius: 20,
              padding: 18,
              display: "flex",
              gap: 14,
              alignItems: "center",
              cursor: "pointer",
              animationDelay: `${i * 0.06}s`,
            }}
          >
            <img
              src={m.photo}
              alt={m.name}
              style={{ width: 52, height: 52, borderRadius: 26, objectFit: "cover", flexShrink: 0 }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: SURFACE.textPrimary, marginBottom: 3 }}>
                {m.name}, {m.age}
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                {m.sharedTags.map((tag) => (
                  <span key={tag} style={{
                    fontSize: 10,
                    fontFamily: FONT_MONO,
                    fontWeight: 600,
                    color: COLORS.softPeriwinkle,
                    background: `${COLORS.softPeriwinkle}15`,
                    padding: "2px 8px",
                    borderRadius: 8,
                  }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
              flexShrink: 0,
            }}>
              <CupidIcon size={20} color={COLORS.hotFuchsia} />
              <span style={{
                fontSize: 10,
                fontFamily: FONT_MONO,
                fontWeight: 600,
                color: COLORS.hotFuchsia,
                letterSpacing: 0.5,
              }}>
                Coach
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CoachChatView({ match, userName, analysisData, onBack }: {
  match: MatchProfile;
  userName: string;
  analysisData?: AnalysisData | null;
  onBack: () => void;
}) {
  const pub = match.publicProfile;
  const priv = match.privateProfile;
  const xref = match.crossref;

  const [chatMessages, setChatMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const chatEndRef = useCallback((node: HTMLDivElement | null) => {
    if (node) node.scrollIntoView({ behavior: "smooth" });
  }, []);

  const sendMessage = async () => {
    const text = inputValue.trim();
    if (!text || isLoading) return;

    const userMsg = { role: "user" as const, content: text };
    const newMessages = [...chatMessages, userMsg];
    setChatMessages(newMessages);
    setInputValue("");
    setIsLoading(true);

    try {
      const res = await fetch(`${API_BASE}/coach/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_a_name: userName || "User",
          user_b_name: match.name,
          user_a_dossier: analysisData ? {
            public: {
              vibe: analysisData.bio,
              tags: analysisData.tags,
              schedule_pattern: "flexible",
            },
            private: {
              summary: analysisData.bio,
              traits: analysisData.tags.slice(0, 3),
              interests: analysisData.findings.map(f => f.value),
              deep_cuts: analysisData.findings.map(f => f.detail),
            },
          } : {
            public: {
              vibe: "Curious and creative with eclectic taste",
              tags: ["tech", "music", "film", "culture"],
              schedule_pattern: "flexible",
            },
            private: {
              summary: "Someone exploring new connections and shared interests.",
              traits: ["curious", "creative", "open-minded"],
              interests: ["music", "film", "technology"],
              deep_cuts: ["Always looking for the next great recommendation"],
            },
          },
          user_b_dossier: {
            public: {
              vibe: pub.vibe,
              tags: pub.tags,
              schedule_pattern: pub.schedule,
            },
            private: {
              summary: priv.summary,
              traits: priv.traits,
              interests: priv.interests,
              deep_cuts: priv.deepCuts,
            },
          },
          crossref: {
            shared: xref.shared.map((s) => ({ signal: s.title, detail: s.description, source: "both" })),
            complementary: xref.complementary.map((c) => ({ signal: c.title, detail: c.description, source: "both" })),
            tension_points: xref.tensionPoints.map((t) => ({ signal: t.title, detail: t.description, source: "both" })),
            citations: xref.citations,
          },
          message: text,
          history: newMessages.slice(0, -1).map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      const data = await res.json();
      setChatMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
    } catch {
      setChatMessages((prev) => [...prev, { role: "assistant", content: "Sorry, I couldn't connect right now. Try again in a moment." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      {/* Header */}
      <div style={{
        padding: "16px 20px",
        display: "flex",
        alignItems: "center",
        gap: 12,
        borderBottom: `1px solid ${SURFACE.border}`,
      }}>
        <button
          onClick={onBack}
          style={{ background: "none", border: "none", cursor: "pointer", padding: 0, color: SURFACE.textSecondary, fontSize: 13, fontWeight: 600, fontFamily: FONT_FAMILY }}
        >
          ←
        </button>
        <img src={match.photo} alt={match.name} style={{ width: 36, height: 36, borderRadius: 18, objectFit: "cover" }} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: SURFACE.textPrimary }}>Cupid</div>
          <div style={{ fontSize: 11, fontFamily: FONT_MONO, color: COLORS.hotFuchsia, letterSpacing: 0.5 }}>Coaching for {match.name}</div>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 16px 8px" }}>
        {chatMessages.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px 20px" }}>
            <CupidIcon size={40} color={`${COLORS.hotFuchsia}60`} />
            <div style={{ fontSize: 16, fontWeight: 700, color: SURFACE.textPrimary, marginTop: 16, marginBottom: 8 }}>
              Ask Cupid anything
            </div>
            <div style={{ fontSize: 13, color: SURFACE.textSecondary, lineHeight: 1.5, maxWidth: 260, margin: "0 auto 20px" }}>
              Get personalized advice for your connection with {match.name}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "center" }}>
              {[
                "What should we talk about?",
                "Give me a conversation starter",
                `What do ${match.name} and I have in common?`,
              ].map((q) => (
                <button
                  key={q}
                  onClick={() => { setInputValue(q); }}
                  style={{
                    background: `${COLORS.softPeriwinkle}0D`,
                    border: `1px solid ${COLORS.softPeriwinkle}20`,
                    borderRadius: 16,
                    padding: "10px 16px",
                    color: COLORS.softPeriwinkle,
                    fontSize: 13,
                    fontWeight: 600,
                    fontFamily: FONT_FAMILY,
                    cursor: "pointer",
                    maxWidth: 260,
                  }}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {chatMessages.map((msg, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
              marginBottom: 10,
            }}
          >
            {msg.role === "assistant" && (
              <div style={{
                width: 28,
                height: 28,
                borderRadius: 14,
                background: `${COLORS.hotFuchsia}20`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                marginRight: 8,
                marginTop: 2,
              }}>
                <CupidIcon size={14} color={COLORS.hotFuchsia} />
              </div>
            )}
            <div style={{
              maxWidth: "75%",
              padding: "12px 16px",
              borderRadius: msg.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
              background: msg.role === "user" ? COLORS.softPeriwinkle : "#5823A5",
              color: msg.role === "user" ? "#fff" : SURFACE.textPrimary,
              fontSize: 14,
              lineHeight: 1.5,
              fontFamily: FONT_FAMILY,
            }}>
              {msg.content}
            </div>
          </div>
        ))}

        {isLoading && (
          <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
            <div style={{
              width: 28,
              height: 28,
              borderRadius: 14,
              background: `${COLORS.hotFuchsia}20`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}>
              <CupidIcon size={14} color={COLORS.hotFuchsia} />
            </div>
            <div style={{
              padding: "12px 16px",
              borderRadius: "18px 18px 18px 4px",
              background: "#5823A5",
              color: SURFACE.textTertiary,
              fontSize: 14,
              fontFamily: FONT_MONO,
            }}>
              thinking...
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <div style={{
        padding: "12px 16px 20px",
        borderTop: `1px solid ${SURFACE.border}`,
        display: "flex",
        gap: 10,
        alignItems: "center",
      }}>
        <input
          type="text"
          placeholder="Ask Cupid..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          style={{
            flex: 1,
            height: 44,
            borderRadius: 22,
            border: `1px solid ${SURFACE.border}`,
            background: "#5823A5",
            color: SURFACE.textPrimary,
            fontSize: 14,
            fontFamily: FONT_FAMILY,
            padding: "0 18px",
            outline: "none",
          }}
        />
        <button
          onClick={sendMessage}
          disabled={!inputValue.trim() || isLoading}
          style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            border: "none",
            background: inputValue.trim() && !isLoading ? COLORS.hotFuchsia : `${COLORS.hotFuchsia}30`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: inputValue.trim() && !isLoading ? "pointer" : "default",
            flexShrink: 0,
          }}
        >
          <SendIcon size={18} color={inputValue.trim() && !isLoading ? "#fff" : "rgba(255,255,255,0.3)"} />
        </button>
      </div>
    </div>
  );
}

export function CoachView({ userName, analysisData, onSelectMatch }: {
  userName: string;
  analysisData?: AnalysisData | null;
  onSelectMatch: (m: MatchProfile) => void;
}) {
  return <CoachMatchList onSelectMatch={onSelectMatch} />;
}
