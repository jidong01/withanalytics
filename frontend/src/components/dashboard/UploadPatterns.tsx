import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
  } from 'recharts';
  
  interface Video {
    publishedAt: string;
    viewCount: string;
  }
  
  interface DayStats {
    name: string;
    count: number;
    avgViews: number;
  }
  
  interface HourStats {
    name: string;
    count: number;
    avgViews: number;
  }
  
  interface UploadPatternsProps {
    videos: Video[];
  }
  
  export default function UploadPatterns({ videos }: UploadPatternsProps) {
    // 요일별 통계
    const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
    const dayStats = videos.reduce((acc: Record<number, { count: number, totalViews: number }>, video) => {
      const day = new Date(video.publishedAt).getDay();
      if (!acc[day]) {
        acc[day] = { count: 0, totalViews: 0 };
      }
      acc[day].count += 1;
      acc[day].totalViews += parseInt(video.viewCount);
      return acc;
    }, {});
  
    const dayData: DayStats[] = dayNames.map((name, index) => ({
      name,
      count: dayStats[index]?.count || 0,
      avgViews: dayStats[index] ? Math.round(dayStats[index].totalViews / dayStats[index].count) : 0
    }));
  
    // 시간별 통계
    const hourStats = videos.reduce((acc: Record<number, { count: number, totalViews: number }>, video) => {
      const hour = new Date(video.publishedAt).getHours();
      if (!acc[hour]) {
        acc[hour] = { count: 0, totalViews: 0 };
      }
      acc[hour].count += 1;
      acc[hour].totalViews += parseInt(video.viewCount);
      return acc;
    }, {});
  
    const hourData: HourStats[] = Array.from({ length: 24 }, (_, i) => ({
      name: `${i}시`,
      count: hourStats[i]?.count || 0,
      avgViews: hourStats[i] ? Math.round(hourStats[i].totalViews / hourStats[i].count) : 0
    }));
  
    // 최적의 업로드 시간 찾기
    const bestDay = [...dayData].sort((a, b) => b.avgViews - a.avgViews)[0];
    const bestHour = [...hourData].sort((a, b) => b.avgViews - a.avgViews)[0];
  
    return (
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-bold mb-6">업로드 패턴 분석</h2>

        {/* 최적 업로드 시간 */}
        <div className="mb-6 p-4 bg-green-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-3 text-green-900">최적 업로드 시간</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-green-700">최고 성과 요일</p>
              <p className="text-xl font-semibold text-green-900">
                {bestDay.name}요일 (평균 {bestDay.avgViews.toLocaleString()}회)
              </p>
            </div>
            <div>
              <p className="text-sm text-green-700">최고 성과 시간대</p>
              <p className="text-xl font-semibold text-green-900">
                {bestHour.name} (평균 {bestHour.avgViews.toLocaleString()}회)
              </p>
            </div>
          </div>
        </div>

        {/* 요일별 분석 */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">요일별 분석</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 요일별 업로드 수 */}
            <div className="h-[300px]">
              <p className="text-sm text-gray-500 mb-2">업로드 수</p>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dayData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8884d8" name="업로드 수" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            {/* 요일별 평균 조회수 */}
            <div className="h-[300px]">
              <p className="text-sm text-gray-500 mb-2">평균 조회수</p>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dayData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="avgViews" fill="#82ca9d" name="평균 조회수" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* 시간대별 분석 */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-900">시간대별 분석</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 시간대별 업로드 수 */}
            <div className="h-[300px]">
              <p className="text-sm text-gray-500 mb-2">업로드 수</p>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={hourData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8884d8" name="업로드 수" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            {/* 시간대별 평균 조회수 */}
            <div className="h-[300px]">
              <p className="text-sm text-gray-500 mb-2">평균 조회수</p>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={hourData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="avgViews" fill="#82ca9d" name="평균 조회수" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    );
  } 