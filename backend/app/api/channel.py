from fastapi import APIRouter, HTTPException
from ..services.youtube_service import YouTubeService
from ..services.openai_service import OpenAIService
from typing import Dict, Any

router = APIRouter()
youtube_service = YouTubeService()
openai_service = OpenAIService()

@router.get("/{channel_id}")
async def get_channel_info(channel_id: str):
    try:
        channel_info = await youtube_service.get_channel_info(channel_id)
        return channel_info
    except Exception as e:
        return {"error": str(e)}

@router.get("/{channel_id}/videos")
async def get_channel_videos(channel_id: str):
    try:
        videos = await youtube_service.get_channel_videos(channel_id)
        return videos
    except Exception as e:
        return {"error": str(e)}

@router.get("/videos/{video_id}/comments")
async def get_video_comments(video_id: str):
    comments = await youtube_service.get_video_comments(video_id)
    if not comments:
        raise HTTPException(status_code=404, detail="Comments not found")
    return comments

@router.get("/videos/{video_id}/analysis")
async def analyze_video_comments(video_id: str):
    try:
        # 1. 비디오 댓글 가져오기
        comments = await youtube_service.get_video_comments(video_id)
        if not comments:
            raise HTTPException(status_code=404, detail="Comments not found")
            
        # 2. OpenAI로 댓글 분석
        analysis = await openai_service.analyze_comments(comments)
        if not analysis:
            raise HTTPException(status_code=500, detail="Analysis failed")
            
        return analysis
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/channel/{channel_id}/comments")
async def get_channel_comments(channel_id: str):
    comments = await youtube_service.get_channel_comments(channel_id)
    if not comments:
        raise HTTPException(status_code=404, detail="Comments not found")
    return comments

@router.post("/analysis/chart")
async def analyze_chart(
    chart_type: str,
    data: dict
):
    analysis = await openai_service.analyze_chart_data(chart_type, data)
    if not analysis:
        raise HTTPException(status_code=500, detail="Analysis failed")
    return {"analysis": analysis} 