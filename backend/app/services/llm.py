from __future__ import annotations

import json

from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage, SystemMessage

from app.config import settings

CROSSREF_SYSTEM_PROMPT = """\
You are a compatibility analyst. Given two personality dossiers (each with public and private tiers), \
identify shared interests, complementary traits, and potential tension points between these two people.

Return ONLY valid JSON with these exact keys:

"shared": list of objects with {"signal": str, "detail": str, "source": str} — things both people have in common \
(e.g. same genre tastes, overlapping languages, similar schedule patterns). \
"source" should reference which data source(s) informed this (e.g. "spotify", "github", "both").

"complementary": list of objects with same shape — traits that are DIFFERENT but could complement each other well \
(e.g. one is a builder and the other is a designer, one likes horror films and the other likes thrillers).

"tension_points": list of objects with same shape — areas of potential friction or misalignment \
(e.g. one is a night owl and the other is early bird, very different taste profiles). \
Keep this honest but constructive — frame tensions as things to be aware of, not dealbreakers.

"citations": list of strings — short quotes or references to specific data points from either dossier that back up your analysis. \
Include at least 3 citations.

"venue_appropriate": boolean — true if the shared interests or complementary traits suggest a specific venue type \
would enhance their meetup (e.g. shared love of live music → concert venue). False if interests are too generic \
or online-focused to suggest a meaningful venue.

Do NOT wrap the JSON in markdown code fences. Return raw JSON only."""

PROFILE_SYSTEM_PROMPT = """\
You are a personality analyst. Given a user's digital footprint data from various platforms, \
synthesize a structured personality dossier split into two visibility tiers.

Return ONLY valid JSON with these exact keys:

"public" — what EVERYONE can see on the profile (keep it intriguing but vague enough to spark curiosity):
  - "vibe": one catchy sentence capturing their overall energy/aesthetic
  - "tags": list of 5-8 short, broad interest tags (e.g. "web dev", "hip hop", "sci-fi films") — NO specific artist/repo/film names
  - "schedule_pattern": one of "night_owl", "early_bird", or "mixed" (infer from activity timestamps if available)

"private" — unlocked ONLY for matches (detailed, specific):
  - "summary": 2-3 sentence detailed personality sketch
  - "traits": list of 3-6 personality trait phrases (e.g. "night owl", "deep-focus builder")
  - "interests": list of 5-10 SPECIFIC interests with names (e.g. "Drake", "Interstellar", "Python", "machine learning")
  - "deep_cuts": list of 2-4 niche or surprising details that would make great conversation starters

Do NOT wrap the JSON in markdown code fences. Return raw JSON only."""


VENUE_SYSTEM_PROMPT = """\
You are a local concierge and matchmaker. You will be used in two modes:

1. BRAINSTORM MODE:
   Given a cross-reference analysis of two people, suggest 3 creative activity types and specific search queries to find real instances of them.
   Return ONLY: {"queries": list of {"name": str, "search_query": str}}

2. RANK MODE:
   Given a cross-reference analysis and a list of real-world candidates (name, address, rating, opening_hours, etc.), select the best 3 that fit the match vibe.
   IMPORTANT: Use the candidate's `opening_hours` to ensure the venue choice aligns with the users' `schedule_pattern` from the cross-reference (e.g., don't suggest a place that closes early for a pair of night owls).
   For each selected venue, provide a reason and specific tips.
   Return ONLY: {"venues": list of objects with {"name", "address", "rating", "opening_hours", "reason", "tips", "relevance_score"}}

Do NOT wrap the JSON in markdown code fences. Return raw JSON only."""

COACHING_SYSTEM_PROMPT = """\
You are an expert dating coach and conversational strategist. Given two user profiles, their cross-reference analysis, \
and a selected venue/activity, generate a personalized briefing for ONE of the users.

Your goal is to help this user navigate the interaction smoothly, highlighting opportunities for connection \
and helping them avoid potential friction.

Return ONLY valid JSON with these exact keys:

"match_intel": 2-3 sentences on why this match has potential (or what the main challenge is).
"conversation_playbook": list of 3 specific, open-ended questions or topics to bring up, based on shared interests.
"minefield_map": list of 2 topics or sensitivities to be careful about (based on tension points or private traits).
"venue_cheat_sheet": 1-2 sentences on why the suggested venue contributes to the vibe.
"vibe_calibration": A tip on the energy to bring (e.g. "High energy", "Chill and observant").

Do NOT wrap the JSON in markdown code fences. Return raw JSON only."""


def _empty_crossref() -> dict:
    return {
        "shared": [],
        "complementary": [],
        "tension_points": [],
        "citations": [],
    }


def _empty_dossier() -> dict:
    return {
        "public": {
            "vibe": "",
            "tags": [],
            "schedule_pattern": "mixed",
        },
        "private": {
            "summary": "",
            "traits": [],
            "interests": [],
            "deep_cuts": [],
        },
        "data_sources": [],
    }


class LLMService:
    def __init__(self) -> None:
        self._llm = ChatGoogleGenerativeAI(
            model="gemini-2.0-flash",
            google_api_key=settings.gemini_api_key,
            temperature=0.7,
        )

    async def profile_analysis(self, raw_data: dict) -> dict:
        filtered = {k: v for k, v in raw_data.items() if v}
        if not filtered:
            return _empty_dossier()

        data_sources = list(filtered.keys())
        human_content = json.dumps(filtered, indent=2, default=str)

        response = await self._llm.ainvoke([
            SystemMessage(content=PROFILE_SYSTEM_PROMPT),
            HumanMessage(content=human_content),
        ])

        text = response.content.strip()
        if text.startswith("```"):
            text = text.split("\n", 1)[1].rsplit("```", 1)[0].strip()

        dossier = json.loads(text)
        dossier["data_sources"] = data_sources
        return dossier

    async def cross_reference(self, dossier_a: dict, dossier_b: dict) -> tuple[dict, bool]:
        has_a = dossier_a and any(dossier_a.get(k) for k in ("public", "private"))
        has_b = dossier_b and any(dossier_b.get(k) for k in ("public", "private"))
        if not has_a or not has_b:
            return _empty_crossref(), False

        human_content = json.dumps(
            {"person_a": dossier_a, "person_b": dossier_b},
            indent=2,
            default=str,
        )

        response = await self._llm.ainvoke([
            SystemMessage(content=CROSSREF_SYSTEM_PROMPT),
            HumanMessage(content=human_content),
        ])

        text = response.content.strip()
        if text.startswith("```"):
            text = text.split("\n", 1)[1].rsplit("```", 1)[0].strip()

        result = json.loads(text)
        venue_appropriate = result.pop("venue_appropriate", False)
        return result, venue_appropriate

    async def brainstorm_venue_queries(self, context: dict) -> list[dict]:
        human_content = json.dumps(context, indent=2, default=str)

        response = await self._llm.ainvoke([
            SystemMessage(content=VENUE_SYSTEM_PROMPT),
            HumanMessage(content=f"BRAINSTORM MODE: Suggest queries based on this analysis:\n{human_content}"),
        ])

        text = response.content.strip()
        if text.startswith("```"):
            text = text.split("\n", 1)[1].rsplit("```", 1)[0].strip()

        try:
            result = json.loads(text)
            return result.get("queries", [])
        except json.JSONDecodeError:
            return []

    async def rank_venues(self, candidates: list[dict], context: dict) -> list[dict]:
        data = {
            "analysis": context,
            "candidates": candidates
        }
        human_content = json.dumps(data, indent=2, default=str)

        response = await self._llm.ainvoke([
            SystemMessage(content=VENUE_SYSTEM_PROMPT),
            HumanMessage(content=f"RANK MODE: Select the best 3 venues from these candidates:\n{human_content}"),
        ])

        text = response.content.strip()
        if text.startswith("```"):
            text = text.split("\n", 1)[1].rsplit("```", 1)[0].strip()

        try:
            result = json.loads(text)
            return result.get("venues", [])
        except json.JSONDecodeError:
            return []

    async def generate_coaching(self, target_user: str, other_user: str, cross_ref: dict, venue: dict | None) -> dict:
        data = {
            "target_user_profile": target_user,
            "other_user_profile": other_user,
            "cross_reference": cross_ref,
            "selected_venue": venue
        }
        human_content = json.dumps(data, indent=2, default=str)

        response = await self._llm.ainvoke([
            SystemMessage(content=COACHING_SYSTEM_PROMPT),
            HumanMessage(content=f"Generate coaching briefing for the target user:\n{human_content}"),
        ])

        text = response.content.strip()
        if text.startswith("```"):
            text = text.split("\n", 1)[1].rsplit("```", 1)[0].strip()

        try:
            return json.loads(text)
        except json.JSONDecodeError:
            return {}

    async def analyze_image(self, image_url: str) -> dict:
        return {}
