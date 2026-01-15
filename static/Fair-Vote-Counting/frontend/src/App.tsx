/**
 * 메인 애플리케이션 - 라우팅 설정
 */
import React from 'react';
import { Routes, Route } from 'react-router-dom';

// 페이지 컴포넌트
import HomePage from './pages/HomePage';
import CreateRoomPage from './pages/CreateRoomPage';
import AdminDashboard from './pages/AdminDashboard';
import JoinRoomPage from './pages/JoinRoomPage';
import VotingPage from './pages/VotingPage';
import ResultsPage from './pages/ResultsPage';

function App() {
  return (
    <Routes>
      {/* 홈 */}
      <Route path="/" element={<HomePage />} />

      {/* 관리자 (교사) */}
      <Route path="/create" element={<CreateRoomPage />} />
      <Route path="/admin/:roomCode" element={<AdminDashboard />} />

      {/* 참가자 (학생) */}
      <Route path="/join" element={<JoinRoomPage />} />
      <Route path="/join/:roomCode" element={<JoinRoomPage />} />
      <Route path="/vote/:roomCode" element={<VotingPage />} />

      {/* 결과 */}
      <Route path="/results/:roomCode" element={<ResultsPage />} />

      {/* 404 */}
      <Route
        path="*"
        element={
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <h1>404</h1>
            <p>페이지를 찾을 수 없습니다</p>
            <a href="/" className="btn btn-primary" style={{ marginTop: 20 }}>
              홈으로 돌아가기
            </a>
          </div>
        }
      />
    </Routes>
  );
}

export default App;
