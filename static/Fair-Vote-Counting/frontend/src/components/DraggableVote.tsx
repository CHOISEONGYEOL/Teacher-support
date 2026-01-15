/**
 * 클릭 기반 투표 컴포넌트
 * - 클릭 순서대로 순위 지정
 * - 다시 클릭하면 선택 취소
 */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import type { Candidate } from '../utils/api';
import './DraggableVote.css';

interface ClickableItemProps {
  candidate: Candidate;
  rank: number | null;
  onClick: () => void;
}

function ClickableItem({ candidate, rank, onClick }: ClickableItemProps) {
  const isSelected = rank !== null;

  return (
    <motion.div
      className={`clickable-item ${isSelected ? 'selected' : ''}`}
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className={`rank-badge ${isSelected ? 'active' : 'inactive'}`}>
        {isSelected ? (
          <>
            <span className="rank-number">{rank}</span>
            <span className="rank-label">순위</span>
          </>
        ) : (
          <span className="rank-placeholder">?</span>
        )}
      </div>

      {candidate.image_url && (
        <div className="candidate-image">
          <img src={candidate.image_url} alt={candidate.name} />
        </div>
      )}

      <div className="candidate-info">
        <h4 className="candidate-name">{candidate.name}</h4>
        {candidate.description && (
          <p className="candidate-description">{candidate.description}</p>
        )}
      </div>

      {isSelected && (
        <div className="selected-check">✓</div>
      )}
    </motion.div>
  );
}

interface DraggableVoteProps {
  candidates: Candidate[];
  onSubmit: (rankings: Record<string, number>) => void;
  isSubmitting: boolean;
}

export default function DraggableVote({
  candidates,
  onSubmit,
  isSubmitting,
}: DraggableVoteProps) {
  // 선택된 순서대로 candidate id 저장
  const [selectedOrder, setSelectedOrder] = useState<number[]>([]);

  const handleClick = (candidateId: number) => {
    setSelectedOrder((prev) => {
      const index = prev.indexOf(candidateId);
      if (index !== -1) {
        // 이미 선택됨 -> 취소 (해당 항목과 이후 모두 제거)
        return prev.slice(0, index);
      } else {
        // 새로 선택
        return [...prev, candidateId];
      }
    });
  };

  const getRank = (candidateId: number): number | null => {
    const index = selectedOrder.indexOf(candidateId);
    return index !== -1 ? index + 1 : null;
  };

  const isComplete = selectedOrder.length === candidates.length;

  const handleSubmit = () => {
    if (!isComplete) return;

    // 순위별 candidate ID 매핑 생성
    const rankings: Record<string, number> = {};
    selectedOrder.forEach((candidateId, index) => {
      rankings[String(index + 1)] = candidateId;
    });

    onSubmit(rankings);
  };

  const handleReset = () => {
    setSelectedOrder([]);
  };

  return (
    <div className="draggable-vote-container">
      <div className="vote-instructions">
        <div className="instruction-icon">👆</div>
        <h3>순위를 정해주세요</h3>
        <p>
          선택지를 <strong>클릭한 순서대로</strong> 순위가 정해집니다.<br />
          다시 클릭하면 해당 순위부터 취소됩니다.
        </p>
      </div>

      <div className="progress-indicator">
        <span className="progress-text">
          {selectedOrder.length} / {candidates.length} 선택 완료
        </span>
        {selectedOrder.length > 0 && (
          <button
            type="button"
            className="reset-btn"
            onClick={handleReset}
          >
            초기화
          </button>
        )}
      </div>

      <div className="clickable-list">
        {candidates.map((candidate) => (
          <ClickableItem
            key={candidate.id}
            candidate={candidate}
            rank={getRank(candidate.id)}
            onClick={() => handleClick(candidate.id)}
          />
        ))}
      </div>

      {selectedOrder.length > 0 && (
        <div className="vote-summary">
          <h4>내 선택</h4>
          <div className="summary-list">
            {selectedOrder.map((candidateId, index) => {
              const candidate = candidates.find((c) => c.id === candidateId);
              return (
                <div key={candidateId} className="summary-item">
                  <span className="summary-rank">{index + 1}순위</span>
                  <span className="summary-name">{candidate?.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <motion.button
        className="btn btn-primary btn-large btn-block submit-vote-btn"
        onClick={handleSubmit}
        disabled={isSubmitting || !isComplete}
        whileHover={isComplete ? { scale: 1.02 } : {}}
        whileTap={isComplete ? { scale: 0.98 } : {}}
      >
        {isSubmitting ? (
          <>
            <div className="spinner" style={{ width: 20, height: 20 }} />
            투표 제출 중...
          </>
        ) : !isComplete ? (
          `모든 선택지의 순위를 정해주세요 (${candidates.length - selectedOrder.length}개 남음)`
        ) : (
          '🗳️ 투표하기'
        )}
      </motion.button>
    </div>
  );
}
