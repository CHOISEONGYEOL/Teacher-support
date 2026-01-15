/**
 * 투표 참가 페이지
 * - 코드 직접 입력 또는 QR 스캔으로 접근
 */
import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import './JoinRoomPage.css';

export default function JoinRoomPage() {
  const navigate = useNavigate();
  const { roomCode: urlRoomCode } = useParams<{ roomCode: string }>();
  const [roomCode, setRoomCode] = useState(urlRoomCode || '');
  const [error, setError] = useState('');

  // URL에 코드가 있으면 자동 이동
  React.useEffect(() => {
    if (urlRoomCode) {
      navigate(`/vote/${urlRoomCode}`);
    }
  }, [urlRoomCode, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const code = roomCode.trim().toUpperCase();
    if (!code) {
      setError('참가 코드를 입력해주세요');
      return;
    }

    if (code.length !== 6) {
      setError('참가 코드는 6자리입니다');
      return;
    }

    navigate(`/vote/${code}`);
  };

  return (
    <div className="join-room-page">
      <div className="page-header">
        <Link to="/" className="back-button">← 홈으로</Link>
        <h1>📱 투표 참가하기</h1>
        <p>참가 코드를 입력하거나 QR 코드를 스캔하세요</p>
      </div>

      <div className="container-sm">
        <form onSubmit={handleSubmit} className="join-form card">
          {error && (
            <motion.div
              className="error-message"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              ⚠️ {error}
            </motion.div>
          )}

          <div className="input-group">
            <label htmlFor="roomCode">참가 코드</label>
            <input
              type="text"
              id="roomCode"
              className="input code-input"
              placeholder="예: ABC123"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              maxLength={6}
              autoComplete="off"
              autoFocus
            />
          </div>

          <motion.button
            type="submit"
            className="btn btn-primary btn-large btn-block"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            🚀 참가하기
          </motion.button>
        </form>

        <div className="qr-hint">
          <div className="qr-icon">📷</div>
          <p>
            관리자가 보여주는 QR 코드를 스마트폰 카메라로 스캔해도
            바로 참가할 수 있어요!
          </p>
        </div>
      </div>
    </div>
  );
}
