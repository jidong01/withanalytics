from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api import channel, video, comment
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://withanalytics.vercel.app",
        "http://localhost:3000"  # 로컬 개발용
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(channel.router, prefix="/api/channel", tags=["channel"])
app.include_router(video.router, prefix="/api/video", tags=["video"])
app.include_router(comment.router, prefix="/api/comment", tags=["comment"])

@app.get("/")
async def root():
    return {"message": "YouTube Analytics API"} 