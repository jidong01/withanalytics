from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api import channel  # video, comment는 아직 없으므로 제거

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

@app.get("/")
async def root():
    return {"message": "YouTube Analytics API"} 