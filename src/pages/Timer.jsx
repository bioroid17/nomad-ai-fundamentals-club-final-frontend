import { useState, useEffect, useRef } from "react";
import { subjectsAPI, sessionsAPI } from "../utils/api";
import { formatTime } from "../utils/formatTime";
import "../styles/Timer.css";

const FOCUS_TIME = 25 * 60; // 25분 (초)
const BREAK_TIME = 5 * 60; // 5분 (초)

export default function Timer() {
  const [timeLeft, setTimeLeft] = useState(FOCUS_TIME);
  const [isRunning, setIsRunning] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [isBreakTime, setIsBreakTime] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState("");
  const [completedSessions, setCompletedSessions] = useState([]);
  const intervalRef = useRef(null);

  // 초기화: 과목 목록 가져오기 및 localStorage에서 상태 복원
  useEffect(() => {
    const loadSubjects = async () => {
      try {
        const data = await subjectsAPI.getAll();
        setSubjects(data);
        if (data.length > 0) {
          setSelectedSubject(data[0].id);
        }
      } catch (error) {
        console.error("과목 로드 실패:", error);
      }
    };

    loadSubjects();

    // localStorage에서 타이머 상태 복원
    const savedState = localStorage.getItem("timerState");
    if (savedState) {
      const state = JSON.parse(savedState);
      setTimeLeft(state.timeLeft);
      setIsBreakTime(state.isBreakTime);
    }
  }, []);

  // 세션 저장
  const saveSession = async () => {
    if (!selectedSubject) return;

    try {
      await sessionsAPI.create(selectedSubject, 25);
      setCompletedSessions((prev) => [
        ...prev,
        { subjectId: selectedSubject, duration: 25 },
      ]);
    } catch (error) {
      console.error("세션 저장 실패:", error);
    }
  };

  // 알림 재생
  const playNotification = () => {
    // 웹 오디오 API 또는 시각 효과
    const audioContext = new (
      window.AudioContext || window.webkitAudioContext
    )();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 800;
    oscillator.type = "sine";

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      audioContext.currentTime + 0.5,
    );

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  };

  // 타이머 효과
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          const newTime = prev - 1;

          if (newTime <= 0) {
            clearInterval(intervalRef.current);
            setIsRunning(false);

            if (!isBreakTime) {
              // 집중 세션 완료
              saveSession();
              playNotification();
              setIsBreakTime(true);
              setTimeLeft(BREAK_TIME);
            } else {
              // 휴식 완료
              playNotification();
              setIsBreakTime(false);
              setTimeLeft(FOCUS_TIME);
            }
          }

          return newTime;
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, isBreakTime]);

  // localStorage에 상태 저장
  useEffect(() => {
    localStorage.setItem(
      "timerState",
      JSON.stringify({
        timeLeft,
        isBreakTime,
      }),
    );
  }, [timeLeft, isBreakTime]);

  // 과목 추가
  const handleAddSubject = async () => {
    if (!newSubjectName.trim()) return;

    try {
      const newSubject = await subjectsAPI.create(newSubjectName);
      setSubjects((prev) => [...prev, newSubject]);
      setSelectedSubject(newSubject.id);
      setNewSubjectName("");
    } catch (error) {
      console.error("과목 추가 실패:", error);
    }
  };

  // 과목 삭제
  const handleDeleteSubject = async (id) => {
    try {
      await subjectsAPI.delete(id);
      setSubjects((prev) => prev.filter((s) => s.id !== id));
      if (selectedSubject === id) {
        setSelectedSubject(subjects[0]?.id || null);
      }
    } catch (error) {
      console.error("과목 삭제 실패:", error);
    }
  };

  const handleStart = () => setIsRunning(true);
  const handlePause = () => setIsRunning(false);
  const handleReset = () => {
    setIsRunning(false);
    setIsBreakTime(false);
    setTimeLeft(FOCUS_TIME);
  };

  const progress = isBreakTime
    ? ((BREAK_TIME - timeLeft) / BREAK_TIME) * 100
    : ((FOCUS_TIME - timeLeft) / FOCUS_TIME) * 100;

  return (
    <div className="timer-page">
      <h1>{isBreakTime ? "휴식 시간" : "집중 시간"}</h1>

      {/* 타이머 디스플레이 */}
      <div className="timer-display">
        <div
          className="timer-circle"
          style={{
            background: `conic-gradient(
              ${isBreakTime ? "#4CAF50" : "#2196F3"} 0deg ${progress * 3.6}deg,
              #e0e0e0 ${progress * 3.6}deg 360deg
            )`,
          }}
        >
          <div className="timer-inner">
            <div className="timer-time">{formatTime(timeLeft)}</div>
            <div className="timer-label">
              {isBreakTime ? "휴식 중" : "집중 중"}
            </div>
          </div>
        </div>
      </div>

      {/* 컨트롤 버튼 */}
      {!isBreakTime && (
        <div className="timer-controls">
          <button
            onClick={handleStart}
            disabled={isRunning}
            className="btn btn-primary"
          >
            시작
          </button>
          <button
            onClick={handlePause}
            disabled={!isRunning}
            className="btn btn-secondary"
          >
            일시정지
          </button>
          <button onClick={handleReset} className="btn btn-danger">
            리셋
          </button>
        </div>
      )}

      {isBreakTime && (
        <div className="timer-controls">
          <button
            onClick={handlePause}
            disabled={!isRunning}
            className="btn btn-secondary"
          >
            일시정지
          </button>
          <button onClick={handleReset} className="btn btn-danger">
            리셋
          </button>
        </div>
      )}

      {/* 과목 선택 */}
      {!isBreakTime && (
        <div className="subjects-section">
          <h2>과목 선택</h2>
          <div className="subjects-list">
            {subjects.map((subject) => (
              <div key={subject.id} className="subject-item">
                <button
                  className={`subject-btn ${selectedSubject === subject.id ? "active" : ""}`}
                  onClick={() => setSelectedSubject(subject.id)}
                  disabled={isRunning}
                >
                  {subject.name}
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDeleteSubject(subject.id)}
                  disabled={isRunning}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          {/* 새 과목 추가 */}
          <div className="add-subject">
            <input
              type="text"
              value={newSubjectName}
              onChange={(e) => setNewSubjectName(e.target.value)}
              placeholder="새 과목 입력"
              onKeyPress={(e) => e.key === "Enter" && handleAddSubject()}
              disabled={isRunning}
            />
            <button
              onClick={handleAddSubject}
              className="btn btn-success"
              disabled={isRunning}
            >
              추가
            </button>
          </div>
        </div>
      )}

      {/* 완료된 세션 */}
      {completedSessions.length > 0 && (
        <div className="completed-sessions">
          <h3>오늘 완료한 세션</h3>
          <p>{completedSessions.length}개 세션 완료</p>
        </div>
      )}
    </div>
  );
}
