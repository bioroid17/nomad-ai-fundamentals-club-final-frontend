import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  // Legend,
  ResponsiveContainer,
} from "recharts";
import { statsAPI } from "../utils/api";
import { formatDuration } from "../utils/formatTime";
import "../styles/Dashboard.css";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        const data = await statsAPI.getStats();
        setStats(data);
      } catch (error) {
        console.error("통계 로드 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="dashboard-page">
        <p>로딩 중...</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="dashboard-page">
        <p>통계를 로드할 수 없습니다.</p>
      </div>
    );
  }

  // 과목별 데이터 (분 -> 시간으로 변환)
  const bySubjectData = stats.by_subject.map((item) => ({
    ...item,
    hours: (item.minutes / 60).toFixed(1),
  }));

  // 요일별 데이터
  const weekdayOrder = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const weekdayLabel = {
    Mon: "월",
    Tue: "화",
    Wed: "수",
    Thu: "목",
    Fri: "금",
    Sat: "토",
    Sun: "일",
  };

  const byWeekdayData = weekdayOrder.map((day) => ({
    day: weekdayLabel[day],
    minutes: stats.by_weekday[day] || 0,
  }));

  return (
    <div className="dashboard-page">
      <h1>대시보드</h1>

      {/* 통계 카드 */}
      <div className="stats-cards">
        <div className="stat-card">
          <div className="stat-label">연속 기록</div>
          <div className="stat-value">{stats.streak}일</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">전체 집중 시간</div>
          <div className="stat-value">{stats.total_hours}시간</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">이번 주 세션</div>
          <div className="stat-value">{stats.sessions_this_week}개</div>
        </div>
      </div>

      {/* 차트 섹션 */}
      <div className="charts-section">
        {/* 과목별 집중 시간 */}
        <div className="chart-container">
          <h2>과목별 집중 시간</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={bySubjectData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis
                label={{ value: "시간", angle: -90, position: "insideLeft" }}
              />
              <Tooltip
                formatter={(value) => `${value}시간`}
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #ccc",
                }}
              />
              <Bar dataKey="hours" fill="#2196F3" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 주간 패턴 */}
        <div className="chart-container">
          <h2>주간 집중 패턴</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={byWeekdayData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis
                label={{ value: "분", angle: -90, position: "insideLeft" }}
              />
              <Tooltip
                formatter={(value) => `${value}분`}
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #ccc",
                }}
              />
              <Bar dataKey="minutes" fill="#4CAF50" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 상세 정보 */}
      <div className="details-section">
        <h2>과목별 상세</h2>
        <div className="subject-details">
          {stats.by_subject.map((subject, index) => (
            <div key={index} className="subject-detail-item">
              <span className="subject-name">{subject.name}</span>
              <span className="subject-time">
                {formatDuration(subject.minutes)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
