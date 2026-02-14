from __future__ import annotations

import json

from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage, SystemMessage

from app.config import settings

CROSSREF_SYSTEM_PROMPT = """\
You are a compatibility analyst. Given two personality dossiers for {name_a} and {name_b} (each with public and private tiers), \
identify shared interests, complementary traits, and potential tension points between them.

IMPORTANT: Always refer to the two people by their names "{name_a}" and "{name_b}" — never use "Person A", "Person B", \
"this person", "the user", etc.

Return ONLY valid JSON with these exact keys:

"shared": list of objects with {{"signal": str, "detail": str, "source": str}} — things {name_a} and {name_b} have in common \
(e.g. same genre tastes, overlapping languages, similar schedule patterns). \
"source" should reference which data source(s) informed this (e.g. "spotify", "github", "both").

"complementary": list of objects with same shape — traits that are DIFFERENT but could complement each other well \
(e.g. one is a builder and the other is a designer, one likes horror films and the other likes thrillers). \
Use {name_a} and {name_b} by name.

"tension_points": list of objects with same shape — areas of potential friction or misalignment \
(e.g. one is a night owl and the other is early bird, very different taste profiles). \
Keep this honest but constructive — frame tensions as things to be aware of, not dealbreakers. \
Use {name_a} and {name_b} by name.

"citations": list of strings — short quotes or references to specific data points from either dossier that back up your analysis. \
Use {name_a} and {name_b} by name. Include at least 3 citations.

"venue_appropriate": boolean — true if the shared interests or complementary traits suggest a specific venue type \
would enhance their meetup (e.g. shared love of live music → concert venue). False if interests are too generic \
or online-focused to suggest a meaningful venue.

Do NOT wrap the JSON in markdown code fences. Return raw JSON only."""

COACH_CHAT_SYSTEM_PROMPT = """\
You are a warm, witty dating coach. You have access to detailed profile analyses and compatibility data \
for two people who matched on a dating app.

The user asking you for advice is {user_a_name}. Their match is {user_b_name}.

Here is the context you have:

## {user_a_name}'s Profile:
{dossier_a}

## {user_b_name}'s Profile:
{dossier_b}

## Compatibility Analysis:
{crossref}

Use this data to give specific, actionable dating advice. Address {user_a_name} by name and refer to their match \
as {user_b_name}. Reference actual interests, traits, and data points from the profiles. \
Be encouraging but honest. Keep responses concise (2-4 paragraphs max). \
If the user asks about conversation starters, date ideas, or what to talk about, pull from the shared interests \
and complementary traits. If they ask about potential issues, reference the tension points constructively.

Never reveal raw data or JSON. Speak naturally as a coach would."""

PROFILE_SYSTEM_PROMPT = """\
You are a personality analyst. Given a user named {name} and their digital footprint data from various platforms, \
synthesize a structured personality dossier split into two visibility tiers.

IMPORTANT: Always refer to this person as "{name}" — never use "this person", "the user", "Person A", etc.

Return ONLY valid JSON with these exact keys:

"public" — what EVERYONE can see on the profile (keep it intriguing but vague enough to spark curiosity):
  - "vibe": one catchy sentence capturing {name}'s overall energy/aesthetic (use their name)
  - "tags": list of 5-8 short, broad interest tags (e.g. "web dev", "hip hop", "sci-fi films") — NO specific artist/repo/film names
  - "schedule_pattern": one of "night_owl", "early_bird", or "mixed" (infer from activity timestamps if available)

"private" — unlocked ONLY for matches (detailed, specific):
  - "summary": 2-3 sentence detailed personality sketch of {name} (use their name, not "this person")
  - "traits": list of 3-6 personality trait phrases (e.g. "night owl", "deep-focus builder")
  - "interests": list of 5-10 SPECIFIC interests with names (e.g. "Drake", "Interstellar", "Python", "machine learning")
  - "deep_cuts": list of 2-4 niche or surprising details that would make great conversation starters

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

    async def profile_analysis(self, raw_data: dict, name: str = "") -> dict:
        filtered = {k: v for k, v in raw_data.items() if v}
        if not filtered:
            return _empty_dossier()

        data_sources = list(filtered.keys())
        human_content = json.dumps(filtered, indent=2, default=str)
        prompt = PROFILE_SYSTEM_PROMPT.format(name=name or "this person")

        response = await self._llm.ainvoke([
            SystemMessage(content=prompt),
            HumanMessage(content=human_content),
        ])

        text = response.content.strip()
        if text.startswith("```"):
            text = text.split("\n", 1)[1].rsplit("```", 1)[0].strip()

        dossier = json.loads(text)
        dossier["data_sources"] = data_sources
        return dossier

    async def cross_reference(self, dossier_a: dict, dossier_b: dict, name_a: str = "", name_b: str = "") -> tuple[dict, bool]:
        has_a = dossier_a and any(dossier_a.get(k) for k in ("public", "private"))
        has_b = dossier_b and any(dossier_b.get(k) for k in ("public", "private"))
        if not has_a or not has_b:
            return _empty_crossref(), False

        human_content = json.dumps(
            {name_a or "person_a": dossier_a, name_b or "person_b": dossier_b},
            indent=2,
            default=str,
        )
        prompt = CROSSREF_SYSTEM_PROMPT.format(
            name_a=name_a or "Person A",
            name_b=name_b or "Person B",
        )

        response = await self._llm.ainvoke([
            SystemMessage(content=prompt),
            HumanMessage(content=human_content),
        ])

        text = response.content.strip()
        if text.startswith("```"):
            text = text.split("\n", 1)[1].rsplit("```", 1)[0].strip()

        result = json.loads(text)
        venue_appropriate = result.pop("venue_appropriate", False)
        return result, venue_appropriate

    async def rank_venues(self, venues: list[dict], context: dict) -> list[dict]:
        return []

    async def generate_coaching(self, cross_ref: dict, profile: dict, venues: list[dict]) -> dict:
        return {}

    async def coach_chat(
        self,
        dossier_a: dict,
        dossier_b: dict,
        crossref: dict,
        message: str,
        history: list[dict],
        user_a_name: str = "",
        user_b_name: str = "",
    ) -> str:
        system_prompt = COACH_CHAT_SYSTEM_PROMPT.format(
            user_a_name=user_a_name or "the user",
            user_b_name=user_b_name or "their match",
            dossier_a=json.dumps(dossier_a, indent=2, default=str),
            dossier_b=json.dumps(dossier_b, indent=2, default=str),
            crossref=json.dumps(crossref, indent=2, default=str),
        )

        messages: list = [SystemMessage(content=system_prompt)]
        for msg in history:
            if msg["role"] == "user":
                messages.append(HumanMessage(content=msg["content"]))
            else:
                from langchain_core.messages import AIMessage
                messages.append(AIMessage(content=msg["content"]))
        messages.append(HumanMessage(content=message))

        response = await self._llm.ainvoke(messages)
        return response.content.strip()

    async def analyze_image(self, image_url: str) -> dict:
        return {}
