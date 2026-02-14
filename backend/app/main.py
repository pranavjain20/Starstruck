from __future__ import annotations

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sse_starlette.sse import EventSourceResponse

from app.config import settings
from app.models.schemas import MatchRequest, CoachingResponse, CoachChatRequest, CoachChatResponse
from app.graph.builder import build_graph
from app.services.llm import LLMService

app = FastAPI(title="Starstruck", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

pipeline = build_graph()
llm_service = LLMService()


@app.get("/health")
async def health():
    return {"status": "ok"}


@app.post("/run", response_model=CoachingResponse)
async def run_pipeline(request: MatchRequest):
    initial_state = {
        "user_a": {"username": request.user_a.spotify_username or ""},
        "user_b": {"username": request.user_b.spotify_username or ""},
        "include_venue": request.include_venue,
    }
    _result = await pipeline.ainvoke(initial_state)
    return CoachingResponse(user_a_cards=[], user_b_cards=[])


@app.post("/stream")
async def stream_pipeline(request: MatchRequest):
    async def event_generator():
        initial_state = {
            "user_a": {"username": request.user_a.spotify_username or ""},
            "user_b": {"username": request.user_b.spotify_username or ""},
            "include_venue": request.include_venue,
        }
        async for event in pipeline.astream(initial_state):
            yield {"event": "node_complete", "data": str(event)}
        yield {"event": "done", "data": "{}"}

    return EventSourceResponse(event_generator())


@app.post("/coach/chat", response_model=CoachChatResponse)
async def coach_chat(request: CoachChatRequest):
    reply = await llm_service.coach_chat(
        dossier_a=request.user_a_dossier,
        dossier_b=request.user_b_dossier,
        crossref=request.crossref,
        message=request.message,
        history=[msg.model_dump() for msg in request.history],
        user_a_name=request.user_a_name,
        user_b_name=request.user_b_name,
    )
    return CoachChatResponse(reply=reply)
