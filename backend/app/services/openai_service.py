from openai import AsyncOpenAI
from typing import List, Dict
import os
import json
from dotenv import load_dotenv
import random

load_dotenv()

class OpenAIService:
    def __init__(self):
        self.client = AsyncOpenAI(api_key=os.getenv('OPENAI_API_KEY'))

    async def analyze_comments(self, comments: List[Dict]) -> Dict:
        try:
            # 분석을 위한 프롬프트 생성
            comments_text = "\n".join([f"- {comment['text']}" for comment in comments])
            prompt = f"""다음 YouTube 댓글들을 분석해주세요:

{comments_text}

다음 형식으로 분석 결과를 JSON으로 반환해주세요:
{{
    "keywords": [
        {{"word": "키워드", "count": 횟수, "examples": ["예시 댓글1", "예시 댓글2"]}}
    ],
    "sentiment": {{
        "positive": 긍정_비율,
        "negative": 부정_비율,
        "neutral": 중립_비율,
        "examples": {{
            "positive": ["긍정 댓글 예시"],
            "negative": ["부정 댓글 예시"],
            "neutral": ["중립 댓글 예시"]
        }}
    }},
    "categories": [
        {{"name": "주제", "examples": ["관련 댓글1", "관련 댓글2"]}}
    ],
    "feedback": [
        {{"type": "피드백 유형", "content": "피드백 내용", "examples": ["관련 댓글"]}}
    ]
}}"""

            response = await self.client.chat.completions.create(
                model="gpt-4-turbo-preview",  # 또는 다른 적절한 모델
                messages=[{
                    "role": "system",
                    "content": "You are a helpful assistant that analyzes YouTube comments and provides insights."
                }, {
                    "role": "user",
                    "content": prompt
                }],
                response_format={ "type": "json_object" }
            )
            
            return response.choices[0].message.content
            
        except Exception as e:
            print(f"Error analyzing comments: {str(e)}")
            return None

    async def analyze_chart_data(self, chart_type: str, data: dict) -> str:
        try:
            prompts = {
                'engagement': """
                    다음은 유튜브 채널의 참여율 데이터입니다:
                    평균 좋아요 비율: {like_ratio}%
                    평균 댓글 비율: {comment_ratio}%
                    평균 총 참여율: {total_engagement}%
                    
                    이 데이터를 바탕으로 채널의 시청자 참여도에 대해 한 문장으로 분석해주세요.
                    전문적이고 통찰력 있게 작성해주세요.
                """,
                'growth': """
                    다음은 유튜브 채널의 성장 지표입니다:
                    총 조회수: {total_views}
                    평균 조회수: {avg_views}
                    조회수 증가율: {view_growth}%
                    
                    이 데이터를 바탕으로 채널의 성장세에 대해 한 문장으로 분석해주세요.
                    전문적이고 통찰력 있게 작성해주세요.
                """,
                'upload': """
                    다음은 유튜브 채널의 업로드 패턴 데이터입니다:
                    가장 많이 업로드하는 요일: {top_day}
                    가장 많이 업로드하는 시간대: {top_hour}
                    평균 업로드 주기: {upload_interval}일
                    
                    이 데이터를 바탕으로 채널의 콘텐츠 업로드 전략에 대해 한 문장으로 분석해주세요.
                    전문적이고 통찰력 있게 작성해주세요.
                """,
                'content_performance': """
                    다음은 유튜브 채널의 영상 길이별 성과 데이터입니다:
                    가장 성과가 좋은 길이: {best_duration}
                    - 평균 조회수: {best_views}회
                    - 평균 참여율: {best_engagement}%
                    
                    10분 미만 영상 평균 조회수: {short_views}회
                    10-20분 영상 평균 조회수: {medium_views}회
                    20분 이상 영상 평균 조회수: {long_views}회
                    
                    이 데이터를 바탕으로 최적의 영상 길이 전략에 대해 한 문장으로 분석해주세요.
                    전문적이고 통찰력 있게 작성해주세요.
                """,
                'core_fans': """
                    다음은 유튜브 채널의 핵심 팬 데이터입니다:
                    핵심 팬 수: {total_core_fans}명
                    최고 활동 팬:
                    - 댓글 수: {top_fan_comments}개
                    - 받은 좋아요: {top_fan_likes}개
                    - 참여율: {top_fan_engagement}%
                    
                    핵심 팬 평균:
                    - 팬당 평균 댓글 수: {avg_comments_per_fan:.1f}개
                    - 평균 참여율: {avg_engagement_rate:.1f}%
                    
                    이 데이터를 바탕으로 채널의 팬 커뮤니티 특성에 대해 한 문장으로 분석해주세요.
                    전문적이고 통찰력 있게 작성해주세요.
                """
            }

            prompt = prompts[chart_type].format(**data)
            
            response = await self.client.chat.completions.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": "당신은 유튜브 채널 분석 전문가입니다. 데이터를 바탕으로 전문적이고 통찰력 있는 분석을 제공합니다."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_tokens=100
            )
            
            return response.choices[0].message.content
            
        except Exception as e:
            print(f"Error in analyze_chart_data: {str(e)}")
            return None

    def _prepare_comments(self, comments: List[str]) -> str:
        """댓글을 전처리하고 샘플링합니다."""
        # 빈 댓글 제거
        filtered_comments = [c for c in comments if c and len(c.strip()) > 0]
        
        # 중복 제거
        unique_comments = list(set(filtered_comments))
        
        # 댓글이 너무 많으면 샘플링
        if len(unique_comments) > 100:
            sampled_comments = random.sample(unique_comments, 100)
        else:
            sampled_comments = unique_comments
        
        # 각 댓글의 길이 제한
        processed_comments = [
            comment[:200] + '...' if len(comment) > 200 else comment
            for comment in sampled_comments
        ]
        
        return '\n'.join(processed_comments)

    def _get_empty_analysis(self) -> Dict:
        return {
            "keywords": [],
            "sentiment": {
                "positive": 0,
                "negative": 0,
                "neutral": 100,
                "examples": {
                    "positive": [],
                    "negative": [],
                    "neutral": []
                }
            },
            "categories": [],
            "feedback": []
        }

    def _get_error_analysis(self, error_message: str) -> Dict:
        return {
            "keywords": [],
            "sentiment": {
                "positive": 0,
                "negative": 0,
                "neutral": 100,
                "examples": {
                    "positive": [],
                    "negative": [],
                    "neutral": []
                }
            },
            "categories": [],
            "feedback": [{"type": "오류", "content": error_message, "examples": []}]
        }
