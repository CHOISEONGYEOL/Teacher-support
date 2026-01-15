/**
 * IRV 결과 시각화 컴포넌트
 * - 라운드별 득표 현황 애니메이션
 * - 표 이동 흐름 시각화
 * - 최종 당선자 발표
 */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
} from 'recharts';
import type { IRVResult, IRVRound, Candidate } from '../utils/api';
import './ResultsVisualization.css';

interface Props {
  result: IRVResult;
}

export default function ResultsVisualization({ result }: Props) {
  const [currentRound, setCurrentRound] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showAllVotes, setShowAllVotes] = useState(false);

  const candidateMap: Record<number, Candidate> = {};
  result.candidates.forEach(c => {
    candidateMap[c.id] = c;
  });

  const currentRoundData = result.rounds[currentRound];

  // 자동 재생
  useEffect(() => {
    if (isPlaying && currentRound < result.rounds.length - 1) {
      const timer = setTimeout(() => {
        setCurrentRound(prev => prev + 1);
      }, 3000);
      return () => clearTimeout(timer);
    } else if (currentRound >= result.rounds.length - 1) {
      setIsPlaying(false);
    }
  }, [isPlaying, currentRound, result.rounds.length]);

  // 차트 데이터 변환
  const chartData = Object.entries(currentRoundData.vote_counts).map(([id, count]) => {
    const candidate = candidateMap[Number(id)];
    return {
      id: Number(id),
      name: candidate?.name || `후보 ${id}`,
      votes: count,
      isEliminated: currentRoundData.eliminated_candidate_id === Number(id),
      isWinner: currentRoundData.winner_id === Number(id),
    };
  }).sort((a, b) => b.votes - a.votes);

  const getBarColor = (entry: typeof chartData[0]) => {
    if (entry.isWinner) return '#10b981';
    if (entry.isEliminated) return '#ef4444';
    return '#4f46e5';
  };

  const handlePlayPause = () => {
    if (currentRound >= result.rounds.length - 1) {
      setCurrentRound(0);
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="results-visualization">
      {/* 최종 당선자 배너 */}
      {result.winner_name && (
        <motion.div
          className="winner-banner"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="winner-icon">🎉</div>
          <h2>최종 당선자</h2>
          <div className="winner-name">{result.winner_name}</div>
          <p className="winner-stats">
            총 {result.total_votes}표 중 {result.rounds.length}라운드 후 확정
          </p>
        </motion.div>
      )}

      {/* 라운드 컨트롤 */}
      <div className="round-controls">
        <button
          className="btn btn-outline"
          onClick={() => setCurrentRound(prev => Math.max(0, prev - 1))}
          disabled={currentRound === 0}
        >
          ◀ 이전
        </button>

        <div className="round-indicator">
          <span className="round-label">라운드</span>
          <span className="round-number">{currentRound + 1}</span>
          <span className="round-total">/ {result.rounds.length}</span>
        </div>

        <button
          className="btn btn-outline"
          onClick={() => setCurrentRound(prev => Math.min(result.rounds.length - 1, prev + 1))}
          disabled={currentRound >= result.rounds.length - 1}
        >
          다음 ▶
        </button>
      </div>

      <button
        className={`btn ${isPlaying ? 'btn-danger' : 'btn-primary'} play-btn`}
        onClick={handlePlayPause}
      >
        {isPlaying ? '⏸ 일시정지' : '▶ 자동재생'}
      </button>

      {/* 라운드 정보 */}
      <div className="round-info">
        <div className="info-item">
          <span className="info-label">유효 투표수</span>
          <span className="info-value">{currentRoundData.total_votes}표</span>
        </div>
        <div className="info-item">
          <span className="info-label">과반수 기준</span>
          <span className="info-value">{currentRoundData.threshold}표</span>
        </div>
      </div>

      {/* 득표 현황 차트 */}
      <motion.div
        className="chart-container"
        key={currentRound}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <ResponsiveContainer width="100%" height={Math.max(300, chartData.length * 60)}>
          <BarChart data={chartData} layout="vertical" margin={{ left: 100, right: 50 }}>
            <XAxis type="number" domain={[0, 'dataMax']} />
            <YAxis
              type="category"
              dataKey="name"
              width={90}
              tick={{ fontSize: 14 }}
            />
            <Tooltip
              formatter={(value: number) => [`${value}표`, '득표수']}
              labelFormatter={(label) => `${label}`}
            />
            <Bar dataKey="votes" radius={[0, 8, 8, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getBarColor(entry)} />
              ))}
              <LabelList
                dataKey="votes"
                position="right"
                formatter={(value: number) => `${value}표`}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        {/* 과반수 라인 표시 */}
        <div
          className="threshold-line"
          style={{
            left: `calc(100px + ${(currentRoundData.threshold / currentRoundData.total_votes) * (100 - 150/window.innerWidth * 100)}%)`
          }}
        >
          <span>과반수</span>
        </div>
      </motion.div>

      {/* 라운드 이벤트 */}
      <AnimatePresence mode="wait">
        {currentRoundData.eliminated_candidate_name && (
          <motion.div
            className="round-event elimination"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <span className="event-icon">❌</span>
            <div className="event-content">
              <strong>{currentRoundData.eliminated_candidate_name}</strong> 탈락
              {currentRoundData.vote_transfers && (
                <div className="vote-transfers">
                  {Object.entries(
                    currentRoundData.vote_transfers[currentRoundData.eliminated_candidate_id!] || {}
                  ).map(([toId, count]) => {
                    if (toId === 'exhausted') {
                      return (
                        <span key={toId} className="transfer-item">
                          소진된 표: {count}표
                        </span>
                      );
                    }
                    const toCand = candidateMap[Number(toId)];
                    return (
                      <span key={toId} className="transfer-item">
                        → {toCand?.name}: {count}표
                      </span>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {currentRoundData.is_final && currentRoundData.winner_name && (
          <motion.div
            className="round-event winner"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <span className="event-icon">🏆</span>
            <div className="event-content">
              <strong>{currentRoundData.winner_name}</strong> 과반수 득표로 당선!
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 전체 투표 내역 공개 */}
      <div className="all-votes-section">
        <button
          className="btn btn-outline btn-block"
          onClick={() => setShowAllVotes(!showAllVotes)}
        >
          {showAllVotes ? '🔼 투표 내역 숨기기' : '🔽 전체 투표 내역 공개 (검증용)'}
        </button>

        <AnimatePresence>
          {showAllVotes && (
            <motion.div
              className="all-votes-list"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <p className="votes-header">
                총 {result.ballot_details.length}명의 투표 내역
                <br />
                <small>자신의 닉네임을 찾아 투표가 정상 기록되었는지 확인하세요!</small>
              </p>

              <div className="votes-grid">
                {result.ballot_details.map((ballot, idx) => (
                  <div key={idx} className="ballot-card">
                    <div className="ballot-nickname">{ballot.voter_nickname}</div>
                    <div className="ballot-rankings">
                      {ballot.rankings.map((ranking, rank) => (
                        <div key={rank} className="ranking-item">
                          <span className="ranking-number">{rank + 1}.</span>
                          {ranking.image_url && (
                            <img
                              src={ranking.image_url}
                              alt={ranking.name}
                              className="ranking-image"
                            />
                          )}
                          <span className="ranking-name">{ranking.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
