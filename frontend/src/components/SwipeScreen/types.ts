export type Tab = "swipe" | "matches" | "coach" | "dates" | "profile";

export type MatchPhase = "grid" | "confirm" | "analyzing" | "suggestion" | "sent";

export interface Profile {
  name: string;
  age: number;
  photo: string;
  bio: string;
  tags: string[];
  distance: string;
}

export interface MatchProfile {
  name: string;
  age: number;
  photo: string;
  compatibility: string;
  sharedTags: string[];
  suggestion: { place: string; address: string; date: string; reason: string };
  publicProfile: {
    vibe: string;
    tags: string[];
    schedule: string;
  };
  privateProfile: {
    summary: string;
    traits: string[];
    interests: string[];
    deepCuts: string[];
    dataSources: string[];
  };
  crossref: {
    shared: { title: string; description: string }[];
    complementary: { title: string; description: string }[];
    tensionPoints: { title: string; description: string }[];
    citations: string[];
  };
}

export interface DateEntry {
  name: string;
  photo: string;
  place: string;
  date: string;
  status: "confirmed" | "pending";
  matchRef: MatchProfile;
}

export interface AnalysisData {
  bio: string;
  tags: string[];
  findings: { label: string; value: string; detail: string }[];
}
