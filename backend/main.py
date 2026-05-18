import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from backend.routers.notices import router as notices_router
from backend.config import AUDIO_CACHE_DIR

app = FastAPI(title="SchoolBridge API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(notices_router)

os.makedirs(AUDIO_CACHE_DIR, exist_ok=True)
app.mount("/api/audio", StaticFiles(directory=AUDIO_CACHE_DIR), name="audio")


@app.get("/api/health")
async def health():
    return {"status": "ok"}
