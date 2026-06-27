import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Timer from "./pages/Timer";
import History from "./pages/History";
import Dashboard from "./pages/Dashboard";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="app">
        <nav className="navbar">
          <div className="nav-container">
            <Link to="/" className="nav-link">
              <div className="nav-brand">
                <h1>⏱️ Focus Timer</h1>
              </div>
            </Link>
            <ul className="nav-menu">
              <li>
                <Link to="/" className="nav-link">
                  타이머
                </Link>
              </li>
              <li>
                <Link to="/history" className="nav-link">
                  기록
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="nav-link">
                  대시보드
                </Link>
              </li>
            </ul>
          </div>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Timer />} />
            <Route path="/history" element={<History />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
