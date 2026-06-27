import { useState, useEffect } from "react";
import { sessionsAPI, subjectsAPI } from "../utils/api";
import {
  // formatDate,
  formatDateTime,
  formatDuration,
} from "../utils/formatTime";
import "../styles/History.css";

export default function History() {
  const [sessions, setSessions] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [filters, setFilters] = useState({
    subject_id: null,
    range: "all", // week, month, all
  });
  const [loading, setLoading] = useState(true);

  // 세션 로드
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [sessionsData, subjectsData] = await Promise.all([
          sessionsAPI.getAll(filters),
          subjectsAPI.getAll(),
        ]);
        setSessions(sessionsData);
        setSubjects(subjectsData);
      } catch (error) {
        console.error("데이터 로드 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [filters]);

  // 세션 삭제
  const handleDeleteSession = async (id) => {
    if (!window.confirm("이 세션을 삭제하시겠습니까?")) return;

    try {
      await sessionsAPI.delete(id);
      setSessions((prev) => prev.filter((s) => s.id !== id));
    } catch (error) {
      console.error("세션 삭제 실패:", error);
    }
  };

  // 필터 변경
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // 범위별 라벨
  const rangeLabel = {
    week: "이번 주",
    month: "이번 달",
    all: "전체",
  };

  return (
    <div className="history-page">
      <h1>세션 기록</h1>

      {/* 필터 */}
      <div className="filters">
        <div className="filter-group">
          <label>과목</label>
          <select
            value={filters.subject_id || ""}
            onChange={(e) =>
              handleFilterChange("subject_id", e.target.value || null)
            }
          >
            <option value="">전체</option>
            {subjects.map((subject) => (
              <option key={subject.id} value={subject.id}>
                {subject.name}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>기간</label>
          <select
            value={filters.range}
            onChange={(e) => handleFilterChange("range", e.target.value)}
          >
            <option value="week">이번 주</option>
            <option value="month">이번 달</option>
            <option value="all">전체</option>
          </select>
        </div>
      </div>

      {/* 세션 목록 */}
      <div className="sessions-section">
        {loading ? (
          <p className="loading">로딩 중...</p>
        ) : sessions.length === 0 ? (
          <p className="no-sessions">완료된 세션이 없습니다.</p>
        ) : (
          <>
            <p className="sessions-count">
              {rangeLabel[filters.range]} {sessions.length}개 세션
            </p>
            <div className="sessions-list">
              {sessions.map((session) => (
                <div key={session.id} className="session-item">
                  <div className="session-info">
                    <div className="session-subject">
                      {session.subject_name}
                    </div>
                    <div className="session-meta">
                      <span className="session-duration">
                        {formatDuration(session.duration)}
                      </span>
                      <span className="session-date">
                        {formatDateTime(session.created_at)}
                      </span>
                    </div>
                  </div>
                  <button
                    className="delete-btn"
                    onClick={() => handleDeleteSession(session.id)}
                    title="삭제"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
