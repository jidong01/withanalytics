import { useState, useEffect, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { analyzeVideoComments } from '@/lib/api';

interface Keyword {
  word: string;
  count: number;
  examples: string[];
}

interface SentimentData {
  positive: number;
  negative: number;
  neutral: number;
  examples: {
    positive: string[];
    negative: string[];
    neutral: string[];
  };
}

interface Category {
  name: string;
  examples: string[];
}

interface Feedback {
  type: string;
  content: string;
  examples: string[];
}

interface AnalysisResult {
  keywords: Keyword[];
  sentiment: SentimentData;
  categories: Category[];
  feedback: Feedback[];
}

export default function CommentAnalysis({ videoId }: { videoId: string }) {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAnalysis();
  }, [videoId]);

  const fetchAnalysis = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // 캐시 키 생성
      const cacheKey = `comment-analysis-${videoId}`;
      
      // 캐시된 데이터 확인
      const cachedData = sessionStorage.getItem(cacheKey);
      if (cachedData) {
        setAnalysis(JSON.parse(cachedData));
        setIsLoading(false);
        return;
      }

      const data = await analyzeVideoComments(videoId);
      const parsedData = typeof data === 'string' ? JSON.parse(data) : data;
      
      // 데이터 캐싱
      sessionStorage.setItem(cacheKey, JSON.stringify(parsedData));
      setAnalysis(parsedData);
    } catch (err) {
      setError(err instanceof Error ? err.message : '분석 중 오류가 발생했습니다');
    } finally {
      setIsLoading(false);
    }
  };

  // 감정 분석 데이터 메모이제이션
  const sentimentData = useMemo(() => {
    if (!analysis) return null;
    
    return {
      positive: (analysis.sentiment.positive).toFixed(1),
      negative: (analysis.sentiment.negative).toFixed(1),
      neutral: (analysis.sentiment.neutral).toFixed(1)
    };
  }, [analysis]);

  // 차트 데이터 메모이제이션
  const chartData = useMemo(() => {
    if (!analysis?.sentiment) return [];
    
    return [
      { name: '긍정', value: analysis.sentiment.positive *100 },
      { name: '부정', value: analysis.sentiment.negative *100 },
      { name: '중립', value: analysis.sentiment.neutral *100 }
    ];
  }, [analysis]);

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500" />
          <p className="text-gray-600 text-lg">댓글을 분석하고 있습니다...</p>
          <p className="text-gray-500 text-sm">잠시만 기다려주세요</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <div className="text-red-500">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <p className="text-red-600 text-lg font-medium">분석 중 오류가 발생했습니다</p>
          <p className="text-gray-500 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-center py-8">
          <div className="text-lg text-gray-600">분석 결과가 없습니다.</div>
        </div>
      </div>
    );
  }

  const SENTIMENT_COLORS = ['#00C49F', '#FF8042', '#FFBB28'];

  return (
    <div className="space-y-6">
      {analysis ? (
        <>
          {/* 키워드 분석 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">주요 키워드</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {analysis.keywords.map((keyword, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  <p className="text-lg font-semibold">{keyword.word}</p>
                  <p className="text-sm text-gray-600">언급 횟수: {keyword.count}회</p>
                  <div className="mt-2">
                    <p className="text-xs text-gray-500">예시 댓글:</p>
                    <ul className="text-sm">
                      {keyword.examples.slice(0, 2).map((example, i) => (
                        <li key={i} className="text-gray-600 mt-1">{example}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 감정 분석 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">감정 분석</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-green-50 rounded-lg p-4">
                <p className="text-green-600 font-semibold">긍정적 반응</p>
                <p className="text-2xl font-bold text-green-700">
                  {sentimentData?.positive}%
                </p>
                <div className="mt-2">
                  <p className="text-sm text-green-600">예시:</p>
                  <ul className="text-sm">
                    {analysis.sentiment.examples.positive.slice(0, 2).map((example, i) => (
                      <li key={i} className="text-green-600 mt-1">{example}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="bg-red-50 rounded-lg p-4">
                <p className="text-red-600 font-semibold">부정적인 반응</p>
                <p className="text-2xl font-bold text-red-700">
                  {sentimentData?.negative}%
                </p>
                <div className="mt-2">
                  <p className="text-sm text-red-600">예시:</p>
                  <ul className="text-sm">
                    {analysis.sentiment.examples.negative.slice(0, 2).map((example, i) => (
                      <li key={i} className="text-red-600 mt-1">{example}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-600 font-semibold">중립적인 반응</p>
                <p className="text-2xl font-bold text-gray-700">
                  {sentimentData?.neutral}%
                </p>
                <div className="mt-2">
                  <p className="text-sm text-gray-600">예시:</p>
                  <ul className="text-sm">
                    {analysis.sentiment.examples.neutral.slice(0, 2).map((example, i) => (
                      <li key={i} className="text-gray-600 mt-1">{example}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* 주제 요약 */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold mb-6 text-gray-900">주요 주제</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {analysis.categories.map((category, index) => (
                <div key={index} className="bg-gray-50 p-3 rounded-lg">
                  <span className="text-gray-800">{category.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 피드백 요약 */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-900">주요 피드백</h3>
            <div className="space-y-2">
              {analysis.feedback.map((item, index) => (
                <div key={index} className="bg-gray-50 p-3 rounded-lg">
                  <span className="font-medium text-gray-800">{item.type}:</span>
                  <span className="text-gray-700 ml-2">{item.content}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600">분석 중입니다...</p>
        </div>
      )}

      {/* 상세 댓글 분석 */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold mb-6 text-gray-900">상세 댓글 분석</h2>

        {/* 키워드별 댓글 */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">키워드별 댓글</h3>
          <div className="space-y-4">
            {analysis.keywords.map((keyword, index) => (
              <div key={index} className="border rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-2">"{keyword.word}" 관련 댓글</h4>
                <div className="pl-4 border-l-2 border-blue-200 space-y-2">
                  {keyword.examples.map((example, i) => (
                    <p key={i} className="text-gray-600">"{example}"</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 감정별 댓글 */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">감정별 댓글</h3>
          <div className="space-y-4">
            <div className="border-l-4 border-green-500 pl-4 py-2">
              <h4 className="font-semibold text-green-700 mb-2">긍정적인 댓글</h4>
              {analysis.sentiment.examples.positive.map((comment, i) => (
                <p key={i} className="text-gray-600 mb-2">"{comment}"</p>
              ))}
            </div>
            <div className="border-l-4 border-red-500 pl-4 py-2">
              <h4 className="font-semibold text-red-700 mb-2">부정적인 댓글</h4>
              {analysis.sentiment.examples.negative.map((comment, i) => (
                <p key={i} className="text-gray-600 mb-2">"{comment}"</p>
              ))}
            </div>
            <div className="border-l-4 border-gray-500 pl-4 py-2">
              <h4 className="font-semibold text-gray-700 mb-2">중립적인 댓글</h4>
              {analysis.sentiment.examples.neutral.map((comment, i) => (
                <p key={i} className="text-gray-600 mb-2">"{comment}"</p>
              ))}
            </div>
          </div>
        </div>

        {/* 주제별 댓글 */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">주제별 댓글</h3>
          <div className="space-y-4">
            {analysis.categories.map((category, index) => (
              <div key={index} className="border rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-2">{category.name}</h4>
                <div className="pl-4 border-l-2 border-gray-200 space-y-2">
                  {category.examples.map((example, i) => (
                    <p key={i} className="text-gray-600">"{example}"</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 피드백별 댓글 */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-900">피드백별 댓글</h3>
          <div className="space-y-4">
            {analysis.feedback.map((item, index) => (
              <div key={index} className="border rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-2">
                  {item.type}: {item.content}
                </h4>
                <div className="pl-4 border-l-2 border-gray-200 space-y-2">
                  {item.examples.map((example, i) => (
                    <p key={i} className="text-gray-600">"{example}"</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
