import { useState, useCallback } from "react";
import "../ConnectAccounts/connectAccounts.css";
import { COLORS, SURFACE, FONT_FAMILY, FONT_MONO } from "../ConnectAccounts/styles";
import { SwipeCard, HeartIcon, XMarkIcon, StarIcon } from "./SwipeCard";
import type { Tab, MatchProfile, DateEntry, AnalysisData } from "./types";
import { MOCK_PROFILES, MATCHES, page, frame, actionBtn } from "./constants";
import { HeartOutlineIcon, FlameIcon, CalendarIcon, PersonIcon, CupidIcon } from "./icons";
import { MatchProfileDetail } from "./MatchProfileDetail";
import { MatchesView } from "./MatchesView";
import { DateDetailView } from "./DateDetailView";
import { DatesView } from "./DatesView";
import { ProfileView } from "./ProfileView";
import { CoachView, CoachChatView } from "./CoachView";

export function SwipeScreen({ userPhoto, userName, analysisData, identifiers }: {
  userPhoto?: string | null;
  userName?: string;
  analysisData?: AnalysisData | null;
  identifiers?: Record<string, string | null>;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<Tab>("swipe");
  const [matchOverlay, setMatchOverlay] = useState<MatchProfile | null>(null);
  const [matchShowText, setMatchShowText] = useState(false);
  const [matchShowButton, setMatchShowButton] = useState(false);
  const [viewingProfile, setViewingProfile] = useState<MatchProfile | null>(null);
  const [planDateIdx, setPlanDateIdx] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<DateEntry | null>(null);
  const [coachMatch, setCoachMatch] = useState<MatchProfile | null>(null);

  const handleSwipeLeft = useCallback(() => {
    setCurrentIndex((prev) => prev + 1);
  }, []);

  const handleSwipeRight = useCallback(() => {
    const swipedProfile = MOCK_PROFILES[currentIndex];
    setCurrentIndex((prev) => prev + 1);
    if (swipedProfile) {
      const matchData = MATCHES.find((m) => m.name === swipedProfile.name);
      if (matchData) {
        setMatchOverlay(matchData);
        setMatchShowText(false);
        setMatchShowButton(false);
        setTimeout(() => setMatchShowText(true), 800);
        setTimeout(() => setMatchShowButton(true), 1500);
      }
    }
  }, [currentIndex]);

  const remaining = MOCK_PROFILES.slice(currentIndex);
  const noMoreCards = remaining.length === 0;

  return (
    <div style={page}>
      <div style={frame}>
        {/* Top bar */}
        <div style={{
          padding: "16px 24px 0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 5,
          position: "relative",
        }}>
          <img
            src="/Star (7).png"
            alt="StarStruck"
            style={{ width: 80, height: 80 }}
          />
        </div>

        {activeTab === "swipe" && (
          <>
            {/* Card stack */}
            <div style={{
              flex: 1,
              position: "relative",
              margin: "12px 16px",
              overflow: "hidden",
            }}>
              {noMoreCards ? (
                <div className="card-enter" style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                  gap: 16,
                }}>
                  <StarIcon size={48} color={COLORS.softPeriwinkle} />
                  <span style={{
                    fontSize: 22,
                    fontWeight: 700,
                    color: SURFACE.textPrimary,
                  }}>
                    No more profiles
                  </span>
                  <span style={{
                    fontSize: 14,
                    color: SURFACE.textSecondary,
                    textAlign: "center",
                    maxWidth: 260,
                  }}>
                    Check back later for new matches in your area
                  </span>
                </div>
              ) : (
                remaining.slice(0, 2).reverse().map((profile, i, arr) => (
                  <SwipeCard
                    key={currentIndex + (arr.length - 1 - i)}
                    profile={profile}
                    isTop={i === arr.length - 1}
                    onSwipeLeft={handleSwipeLeft}
                    onSwipeRight={handleSwipeRight}
                  />
                ))
              )}
            </div>

            {/* Action buttons */}
            {!noMoreCards && (
              <div style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 20,
                padding: "12px 0 28px",
                zIndex: 5,
              }}>
                <button
                  onClick={handleSwipeLeft}
                  style={actionBtn(COLORS.hotFuchsia)}
                >
                  <XMarkIcon size={26} color={COLORS.hotFuchsia} />
                </button>

                <button
                  onClick={handleSwipeRight}
                  style={actionBtn(COLORS.limeCreem)}
                >
                  <HeartIcon size={26} color={COLORS.limeCreem} />
                </button>
              </div>
            )}
          </>
        )}

        {activeTab === "matches" && !viewingProfile && (
          <MatchesView
            initialPlanIdx={planDateIdx}
            onClearInitial={() => setPlanDateIdx(null)}
          />
        )}
        {activeTab === "matches" && viewingProfile && (
          <MatchProfileDetail
            match={viewingProfile}
            onBack={() => setViewingProfile(null)}
            onPlanDate={() => {
              const idx = MATCHES.findIndex((m) => m.name === viewingProfile.name);
              setPlanDateIdx(idx >= 0 ? idx : null);
              setViewingProfile(null);
            }}
          />
        )}
        {activeTab === "coach" && !coachMatch && <CoachView userName={userName || ""} analysisData={analysisData} onSelectMatch={(m) => setCoachMatch(m)} />}
        {activeTab === "coach" && coachMatch && <CoachChatView match={coachMatch} userName={userName || ""} analysisData={analysisData} onBack={() => setCoachMatch(null)} />}
        {activeTab === "dates" && !selectedDate && <DatesView onSelectDate={(d) => setSelectedDate(d)} />}
        {activeTab === "dates" && selectedDate && <DateDetailView dateEntry={selectedDate} userName={userName || ""} onBack={() => setSelectedDate(null)} analysisData={analysisData} />}
        {activeTab === "profile" && <ProfileView userName={userName} userPhoto={userPhoto} analysisData={analysisData} identifiers={identifiers} />}

        {/* Match count */}
        {!noMoreCards && activeTab === "swipe" && (
          <div style={{
            textAlign: "center",
            paddingBottom: 16,
            fontSize: 11,
            fontFamily: FONT_MONO,
            color: SURFACE.textTertiary,
            letterSpacing: 1,
            textTransform: "uppercase",
          }}>
            {remaining.length} profile{remaining.length !== 1 ? "s" : ""} nearby
          </div>
        )}

        {/* Footer tab bar */}
        <div style={{
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          padding: "12px 0 20px",
          borderTop: `1px solid ${SURFACE.border}`,
          background: "#381F7D",
          zIndex: 10,
        }}>
          {([
            { id: "swipe" as Tab, icon: FlameIcon, label: "Discover" },
            { id: "matches" as Tab, icon: HeartOutlineIcon, label: "Matches" },
            { id: "coach" as Tab, icon: CupidIcon, label: "Coach" },
            { id: "dates" as Tab, icon: CalendarIcon, label: "Dates" },
            { id: "profile" as Tab, icon: PersonIcon, label: "Profile" },
          ]).map((tab) => {
            const isActive = activeTab === tab.id;
            const color = isActive ? COLORS.softPeriwinkle : SURFACE.textTertiary;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 4,
                  padding: "4px 10px",
                }}
              >
                <tab.icon size={22} color={color} />
                <span style={{
                  fontSize: 10,
                  fontWeight: 600,
                  fontFamily: FONT_MONO,
                  color,
                  textTransform: "uppercase",
                  letterSpacing: 1,
                }}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Match overlay */}
        {matchOverlay && (
          <div className="overlay-enter" style={{
            position: "absolute",
            inset: 0,
            background: "#662288",
            zIndex: 100,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: 24,
          }}>
            <img
              src="/Star (7).png"
              alt="StarStruck"
              className="match-logo-pulse"
              style={{ width: 80, height: 80, marginBottom: 24 }}
            />

            {matchShowText && (
              <div className="match-text-enter" style={{ textAlign: "center", marginBottom: 32 }}>
                <div style={{ fontSize: 32, fontWeight: 800, color: COLORS.hotFuchsia, marginBottom: 12, letterSpacing: -0.5 }}>
                  It's a Match!
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, marginBottom: 16 }}>
                  <div style={{ width: 72, height: 72, borderRadius: 36, overflow: "hidden", border: `2px solid ${COLORS.softPeriwinkle}` }}>
                    {userPhoto ? (
                      <img src={userPhoto} alt="You" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <div style={{ width: "100%", height: "100%", background: `${COLORS.softPeriwinkle}30`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <PersonIcon size={32} color={COLORS.softPeriwinkle} />
                      </div>
                    )}
                  </div>
                  <HeartIcon size={28} color={COLORS.hotFuchsia} />
                  <img src={matchOverlay.photo} alt={matchOverlay.name} style={{ width: 72, height: 72, borderRadius: 36, objectFit: "cover", border: `2px solid ${COLORS.hotFuchsia}` }} />
                </div>
                <div style={{ fontSize: 15, color: SURFACE.textSecondary }}>
                  {userName || "You"} and {matchOverlay.name} liked each other
                </div>
              </div>
            )}

            {matchShowButton && (
              <div className="match-text-enter">
                <button
                  onClick={() => {
                    setViewingProfile(matchOverlay);
                    setActiveTab("matches");
                    setMatchOverlay(null);
                  }}
                  style={{
                    height: 52,
                    padding: "0 40px",
                    borderRadius: 26,
                    border: "none",
                    background: COLORS.hotFuchsia,
                    color: "#fff",
                    fontSize: 16,
                    fontWeight: 700,
                    fontFamily: FONT_FAMILY,
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                    cursor: "pointer",
                    marginBottom: 12,
                  }}
                >
                  View Match
                </button>
                <div style={{ textAlign: "center" }}>
                  <button
                    onClick={() => setMatchOverlay(null)}
                    style={{ background: "none", border: "none", color: SURFACE.textTertiary, fontSize: 14, cursor: "pointer", fontFamily: FONT_FAMILY, padding: 8 }}
                  >
                    Keep Swiping
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
