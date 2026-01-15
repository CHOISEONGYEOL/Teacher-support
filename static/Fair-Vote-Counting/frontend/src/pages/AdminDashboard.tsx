/**
 * 관리자 대시보드
 * - QR 코드 표시
 * - 실시간 참가자/투표 현황
 * - 투표 시작/종료 컨트롤
 * - 결과 확인
 */
import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  getRoom,
  getQRCode,
  startVoting,
  closeVoting,
  getResults,
  subscribeToRoom,
  type VotingRoom,
  type QRCodeData,
  type IRVResult,
} from '../utils/api';
import { useAdminToken } from '../hooks/useSession';
import ResultsVisualization from '../components/ResultsVisualization';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const { roomCode } = useParams<{ roomCode: string }>();
  const navigate = useNavigate();
  const { adminToken } = useAdminToken(roomCode || '');

  const [room, setRoom] = useState<VotingRoom | null>(null);
  const [qrCode, setQRCode] = useState<QRCodeData | null>(null);
  const [results, setResults] = useState<IRVResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);

  // 초기 데이터 로드
  useEffect(() => {
    if (!roomCode) return;

    const loadData = async () => {
      try {
        const [roomData, qrData] = await Promise.all([
          getRoom(roomCode),
          getQRCode(roomCode),
        ]);
        setRoom(roomData);
        setQRCode(qrData);
      } catch (err: any) {
        setError('투표방 정보를 불러올 수 없습니다');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [roomCode]);

  // 실시간 상태 업데이트 (Firebase 실시간 리스너)
  useEffect(() => {
    if (!roomCode) return;

    const unsubscribe = subscribeToRoom(roomCode, (updatedRoom) => {
      if (updatedRoom) {
        setRoom(updatedRoom);
      }
    });

    return () => unsubscribe();
  }, [roomCode]);

  const handleStartVoting = async () => {
    if (!roomCode || !adminToken) return;

    try {
      await startVoting(roomCode, adminToken);
      setRoom((prev) => (prev ? { ...prev, status: 'active' } : prev));
    } catch (err: any) {
      setError(err.message || '투표 시작에 실패했습니다');
    }
  };

  const handleCloseVoting = async () => {
    if (!roomCode || !adminToken) return;

    if (!window.confirm('정말 투표를 종료하시겠습니까? 종료 후에는 추가 투표가 불가능합니다.')) {
      return;
    }

    try {
      await closeVoting(roomCode, adminToken);
      setRoom((prev) => (prev ? { ...prev, status: 'closed' } : prev));

      // 결과 로드
      const resultData = await getResults(roomCode, adminToken);
      setResults(resultData);
    } catch (err: any) {
      setError(err.message || '투표 종료에 실패했습니다');
    }
  };

  const handleViewResults = async () => {
    if (!roomCode || !adminToken) return;

    try {
      const resultData = await getResults(roomCode, adminToken);
      setResults(resultData);
    } catch (err: any) {
      setError(err.message || '결과를 불러올 수 없습니다');
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner" />
        <p>로딩 중...</p>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="error-container">
        <h2>⚠️ 오류</h2>
        <p>{error || '투표방을 찾을 수 없습니다'}</p>
        <button className="btn btn-primary" onClick={() => navigate('/')}>
          홈으로 돌아가기
        </button>
      </div>
    );
  }

  if (!adminToken) {
    return (
      <div className="error-container">
        <h2>🔒 권한 없음</h2>
        <p>이 투표방의 관리자가 아닙니다</p>
        <button className="btn btn-primary" onClick={() => navigate('/')}>
          홈으로 돌아가기
        </button>
      </div>
    );
  }

  // 전체화면 QR 모드
  if (isFullscreen && qrCode) {
    return (
      <div className="fullscreen-qr" onClick={toggleFullscreen}>
        <div className="fullscreen-content">
          <h1>{room.title}</h1>
          <div className="qr-code">
            <img
              src={`data:image/png;base64,${qrCode.qr_image_base64}`}
              alt="QR Code"
            />
          </div>
          <p className="room-code-display">접속 코드: {room.room_code}</p>
          <p className="join-url">{qrCode.join_url}</p>

          <div className="live-stats">
            <div className="stat">
              <span className="stat-value">{room.voter_count}</span>
              <span className="stat-label">참가자</span>
            </div>
            <div className="stat">
              <span className="stat-value">{room.vote_count}</span>
              <span className="stat-label">투표 완료</span>
            </div>
          </div>

          <p className="click-hint">화면을 클릭하면 대시보드로 돌아갑니다</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="page-header">
        <Link to="/" className="back-button">← 홈으로</Link>
        <h1>📊 관리자 대시보드</h1>
        <p>{room.title}</p>
      </div>

      <div className="container">
        {error && (
          <motion.div
            className="error-message"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            ⚠️ {error}
          </motion.div>
        )}

        <div className="dashboard-grid">
          {/* 상태 및 컨트롤 */}
          <div className="card status-card">
            <div className="status-badge-container">
              <span className={`badge badge-${room.status === 'active' ? 'success' : room.status === 'closed' ? 'danger' : 'warning'}`}>
                {room.status === 'waiting' && '대기 중'}
                {room.status === 'active' && '진행 중'}
                {room.status === 'closed' && '종료됨'}
              </span>
            </div>

            <div className="stats-row">
              <div className="stat-item">
                <div className="stat-value">{room.voter_count}</div>
                <div className="stat-label">참가자</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">{room.vote_count}</div>
                <div className="stat-label">투표 완료</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">{room.candidates.length}</div>
                <div className="stat-label">선택지</div>
              </div>
            </div>

            <div className="control-buttons">
              {room.status === 'waiting' && (
                <button
                  className="btn btn-secondary btn-large btn-block"
                  onClick={handleStartVoting}
                >
                  ▶️ 투표 시작하기
                </button>
              )}
              {room.status === 'active' && (
                <button
                  className="btn btn-danger btn-large btn-block"
                  onClick={handleCloseVoting}
                >
                  ⏹️ 투표 종료하기
                </button>
              )}
              {room.status === 'closed' && !results && (
                <button
                  className="btn btn-primary btn-large btn-block"
                  onClick={handleViewResults}
                >
                  📈 결과 보기
                </button>
              )}
            </div>
          </div>

          {/* QR 코드 */}
          {qrCode && room.status !== 'closed' && (
            <div className="card qr-card">
              <h3>📱 참가 QR 코드</h3>
              <div className="qr-container" onClick={toggleFullscreen}>
                <img
                  src={`data:image/png;base64,${qrCode.qr_image_base64}`}
                  alt="QR Code"
                  className="qr-image"
                />
              </div>
              <p className="room-code">코드: <strong>{room.room_code}</strong></p>
              <button className="btn btn-outline btn-block" onClick={toggleFullscreen}>
                🖥️ 전체 화면으로 보기
              </button>
            </div>
          )}

          {/* 선택지 목록 */}
          <div className="card candidates-card">
            <h3>📋 선택지 목록</h3>
            <ul className="candidates-list">
              {room.candidates.map((candidate, idx) => (
                <li key={candidate.id} className="candidate-item">
                  <span className="candidate-order">{idx + 1}</span>
                  <div className="candidate-info">
                    <strong>{candidate.name}</strong>
                    {candidate.description && (
                      <small>{candidate.description}</small>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 결과 시각화 */}
        {results && (
          <div className="results-section">
            <h2>📊 투표 결과</h2>
            <ResultsVisualization result={results} />
          </div>
        )}
      </div>
    </div>
  );
}
