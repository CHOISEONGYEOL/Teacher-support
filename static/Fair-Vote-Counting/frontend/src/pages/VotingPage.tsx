/**
 * 투표 페이지
 * - 동물 닉네임 표시
 * - 드래그 앤 드롭 투표
 * - 투표 영수증
 */
import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  getRoom,
  joinRoom,
  submitVote,
  subscribeToRoom,
  type VotingRoom,
  type Voter,
  type VoteReceipt,
} from '../utils/api';
import { useSession } from '../hooks/useSession';
import DraggableVote from '../components/DraggableVote';
import './VotingPage.css';

type PageState = 'loading' | 'waiting' | 'voting' | 'receipt' | 'closed' | 'error';

export default function VotingPage() {
  const { roomCode } = useParams<{ roomCode: string }>();
  const navigate = useNavigate();
  const { sessionId } = useSession();

  const [pageState, setPageState] = useState<PageState>('loading');
  const [room, setRoom] = useState<VotingRoom | null>(null);
  const [voter, setVoter] = useState<Voter | null>(null);
  const [receipt, setReceipt] = useState<VoteReceipt | null>(null);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 초기 로드 및 참가
  useEffect(() => {
    if (!roomCode || !sessionId) return;

    const loadAndJoin = async () => {
      try {
        // 투표방 정보 조회
        const roomData = await getRoom(roomCode);
        setRoom(roomData);

        // 투표방 참가 (닉네임 받기)
        const voterData = await joinRoom(roomCode, sessionId);
        setVoter(voterData);

        // 상태 결정
        if (roomData.status === 'closed') {
          setPageState('closed');
        } else if (voterData.has_voted) {
          setPageState('receipt');
        } else if (roomData.status === 'active') {
          setPageState('voting');
        } else {
          setPageState('waiting');
        }
      } catch (err: any) {
        setError(err.message || '투표방에 참가할 수 없습니다');
        setPageState('error');
      }
    };

    loadAndJoin();
  }, [roomCode, sessionId]);

  // 실시간 상태 확인 (Firebase 실시간 리스너)
  useEffect(() => {
    if (!roomCode || pageState === 'receipt' || pageState === 'error') return;

    const unsubscribe = subscribeToRoom(roomCode, (updatedRoom) => {
      if (!updatedRoom) return;

      setRoom(updatedRoom);

      if (updatedRoom.status === 'active' && pageState === 'waiting') {
        setPageState('voting');
      } else if (updatedRoom.status === 'closed' && pageState !== 'receipt') {
        setPageState('closed');
      }
    });

    return () => unsubscribe();
  }, [roomCode, pageState]);

  const handleVoteSubmit = async (rankings: Record<string, number>) => {
    if (!roomCode || !sessionId) return;

    setIsSubmitting(true);
    try {
      const receiptData = await submitVote(roomCode, sessionId, rankings);
      setReceipt(receiptData);
      setPageState('receipt');
    } catch (err: any) {
      setError(err.message || '투표 제출에 실패했습니다');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 로딩 상태
  if (pageState === 'loading') {
    return (
      <div className="voting-page">
        <div className="loading-container">
          <div className="spinner" />
          <p>참가 중...</p>
        </div>
      </div>
    );
  }

  // 에러 상태
  if (pageState === 'error') {
    return (
      <div className="voting-page">
        <div className="error-container">
          <h2>😢 참가 실패</h2>
          <p>{error}</p>
          <button className="btn btn-primary" onClick={() => navigate('/join')}>
            다시 시도하기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="voting-page">
      {/* 닉네임 헤더 */}
      {voter && (
        <div className="nickname-header">
          <div className="nickname-tag">{voter.animal_nickname}</div>
          <p>당신의 익명 닉네임입니다. 결과에서 이 이름으로 검증할 수 있어요!</p>
        </div>
      )}

      <AnimatePresence mode="wait">
        {/* 대기 중 */}
        {pageState === 'waiting' && room && (
          <motion.div
            key="waiting"
            className="state-container waiting-state"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="waiting-header">
              <div className="waiting-badge">대기 중</div>
              <h2>{room.title}</h2>
              {room.description && <p className="waiting-description">{room.description}</p>}
              <p className="waiting-notice">관리자가 투표를 시작하면 자동으로 투표 화면으로 전환됩니다</p>
            </div>

            <div className="candidates-preview-grid">
              <h3>투표할 선택지 미리보기</h3>
              <div className="preview-grid">
                {room.candidates.map((candidate, index) => (
                  <motion.div
                    key={candidate.id}
                    className="preview-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {candidate.image_url ? (
                      <div className="preview-image">
                        <img src={candidate.image_url} alt={candidate.name} />
                      </div>
                    ) : (
                      <div className="preview-image-placeholder">
                        <span>{index + 1}</span>
                      </div>
                    )}
                    <div className="preview-info">
                      <h4>{candidate.name}</h4>
                      {candidate.description && (
                        <p>{candidate.description}</p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* 투표 중 */}
        {pageState === 'voting' && room && (
          <motion.div
            key="voting"
            className="state-container"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
          >
            <div className="voting-content">
              <h2 className="room-title">{room.title}</h2>
              {room.description && (
                <p className="room-description">{room.description}</p>
              )}

              {error && (
                <div className="error-message">⚠️ {error}</div>
              )}

              <DraggableVote
                candidates={room.candidates}
                onSubmit={handleVoteSubmit}
                isSubmitting={isSubmitting}
              />
            </div>
          </motion.div>
        )}

        {/* 투표 완료 (영수증) */}
        {pageState === 'receipt' && receipt && room && (
          <motion.div
            key="receipt"
            className="state-container"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="receipt-content card">
              <div className="receipt-icon">✅</div>
              <h2>투표 완료!</h2>
              <p>투표가 정상적으로 제출되었습니다.</p>

              <div className="receipt-details">
                <div className="receipt-nickname">
                  <span className="label">내 닉네임</span>
                  <span className="nickname-tag">{receipt.voter_nickname}</span>
                </div>

                <div className="receipt-rankings">
                  <span className="label">내 선택</span>
                  <ul>
                    {Object.entries(receipt.rankings)
                      .sort(([a], [b]) => Number(a) - Number(b))
                      .map(([rank, candidateId]) => (
                        <li key={rank}>
                          <span className="rank">{rank}순위</span>
                          {receipt.candidate_images[candidateId] && (
                            <img
                              src={receipt.candidate_images[candidateId]!}
                              alt={receipt.candidate_names[candidateId]}
                              className="receipt-candidate-image"
                            />
                          )}
                          <span className="name">
                            {receipt.candidate_names[candidateId]}
                          </span>
                        </li>
                      ))}
                  </ul>
                </div>

                <div className="receipt-time">
                  <span className="label">투표 시간</span>
                  <span className="time">
                    {new Date(receipt.voted_at).toLocaleString('ko-KR')}
                  </span>
                </div>
              </div>

              <div className="receipt-notice">
                <p>
                  💡 결과 발표 후, 전체 투표 내역에서 <strong>{receipt.voter_nickname}</strong>을
                  찾아 투표가 조작되지 않았는지 확인할 수 있습니다.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* 종료됨 */}
        {pageState === 'closed' && (
          <motion.div
            key="closed"
            className="state-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="closed-content card">
              <div className="closed-icon">🏁</div>
              <h2>투표가 종료되었습니다</h2>
              <p>관리자가 곧 결과를 공개할 예정입니다.</p>

              {voter?.has_voted && (
                <p className="voted-notice">
                  ✅ 당신은 <strong>{voter.animal_nickname}</strong>으로 투표하셨습니다.
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
