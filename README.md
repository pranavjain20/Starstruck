# Starstruck

AI-powered dating app that builds personality profiles from your real online presence. Instead of writing a bio, connect your GitHub, Instagram, or Letterboxd — the app scrapes your data, runs it through an LLM pipeline, and generates a personality profile based on who you actually are.

**[Live Demo](https://starstruck-eta.vercel.app)**

> **Note:** The backend runs on Render's free tier and may take 30-60 seconds to wake up on first request.

## How It Works

1. **Upload a photo** — selfie for your profile card
2. **Connect accounts** — GitHub, Instagram, Letterboxd
3. **Get your profile** — AI-generated bio, vibe tags, and personality breakdown
4. **Swipe** — see compatibility scores, AI-suggested date spots, and a conversational dating coach

The connectors pull real data (repos, commit patterns, film ratings, Instagram bios), feed it into a multi-stage LLM pipeline, and produce a two-tier personality dossier — a public profile for browsing and a private profile unlocked on match.

## Architecture

```
React/Vite Frontend ──► FastAPI Backend ──► LangGraph Pipeline
                                                │
                              ┌─────────────────┼─────────────────┐
                              ▼                 ▼                 ▼
                          Connectors         LLM Analysis      Matching
                          (GitHub,           (Personality       (Crossref,
                          Letterboxd,        Profiling)         Venue,
                          Instagram)                            Coach)
```

### Pipeline Nodes

| Node | What it does |
|------|-------------|
| **Ingest** | Dispatches connectors concurrently via `asyncio.gather`. GitHub REST API, Letterboxd RSS/XML, Instagram via headless Playwright. Aggregates into `UserDataBundle`. |
| **Analyze** | Sends raw data to Gemini 2.5 Flash via LangChain. Returns a two-tier personality profile: public (vibe, tags, schedule) and private (traits, interests, deep cuts). |
| **Crossref** | Feeds both users' profiles into an LLM comparison prompt. Returns `shared_interests[]`, `complementary_traits[]`, `tension_points[]` + compatibility score. |
| **Venue** | Uses crossref output + Google Places API to suggest a real date spot matching shared interests. |
| **Coach** | LLM-powered dating coach that generates personalized icebreakers and conversation advice grounded in actual shared data points. |

The pipeline runs as a **LangGraph DAG** — each node is an async function reading/writing to a shared `PipelineState` (nested `TypedDict`). State is immutable between nodes; each returns a partial dict merged upstream.

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Backend**: Python 3.12, FastAPI, LangGraph, LangChain
- **Connectors**: `httpx` (GitHub, Letterboxd), Playwright (Instagram)
- **LLM**: Gemini 2.5 Flash via LangChain
- **Deployment**: Vercel (frontend), Render (backend, Docker)

## Project Structure

```
starstruck/
├── backend/
│   ├── app/
│   │   ├── main.py                 # FastAPI app + API endpoints
│   │   ├── config.py               # Pydantic settings
│   │   ├── connectors/             # Data scrapers (GitHub, Letterboxd, Instagram)
│   │   ├── graph/                  # LangGraph pipeline
│   │   │   ├── builder.py          # DAG definition + edges
│   │   │   └── nodes/              # ingest, analyze, crossref, venue, coach
│   │   ├── models/
│   │   │   ├── schemas.py          # Pydantic request/response models
│   │   │   └── state.py            # Pipeline state TypedDicts
│   │   └── services/
│   │       ├── llm.py              # LLM service (profile analysis, crossref, coaching)
│   │       ├── places.py           # Google Places API integration
│   │       ├── preview.py          # Connector data → preview strings
│   │       └── findings.py         # Dossier → findings cards
│   ├── tests/
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── App.tsx                 # Step-based flow (photo → connect → analyze → swipe)
│   │   ├── components/
│   │   │   ├── PhotoUpload/        # Camera/upload step
│   │   │   ├── ConnectAccounts/    # Service connection UI
│   │   │   ├── ProfileAnalysis/    # AI profile review + edit
│   │   │   └── SwipeScreen/        # Match cards, compatibility, dating coach
│   │   └── services/
│   │       └── api.ts              # API client
│   └── package.json
└── README.md
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/connect` | Run one connector, return preview + avatar |
| `POST` | `/api/analyze` | Run all connectors + LLM analysis for one user |
| `POST` | `/api/match` | Full pipeline for two users → compatibility result |
| `POST` | `/run` | Run complete LangGraph pipeline |
| `POST` | `/stream` | Stream pipeline execution via SSE |
| `POST` | `/coach/chat` | Interactive dating coach conversation |

## Setup

### Backend

```bash
cd backend
pip install -r requirements.txt
playwright install chromium

# Set environment variables
export GEMINI_API_KEY=your_key
export GITHUB_TOKEN=your_token  # optional, avoids rate limits

uvicorn app.main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Set `VITE_API_BASE_URL` to point at your backend (defaults to production deployment).

### Tests

```bash
cd backend
pytest tests/ -v
```

## Author

Built by Pranav Jain.
