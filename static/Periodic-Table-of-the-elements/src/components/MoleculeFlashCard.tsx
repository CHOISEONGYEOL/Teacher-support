import { useState, useEffect } from 'react';
import type { MoleculeQuestion } from '../data/moleculeQuestions';
import { formatReactionWithBlank, formatCorrectReaction } from '../utils/moleculeQuestionGenerator';

interface MoleculeFlashCardProps {
  question: MoleculeQuestion;
  onNext: () => void;
  onBack: () => void;
  cardNumber: number;
}

export const MoleculeFlashCard = ({
  question,
  onNext,
  onBack,
  cardNumber,
}: MoleculeFlashCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);

  // 문제가 바뀌면 카드 앞면으로
  useEffect(() => {
    setIsFlipped(false);
  }, [question]);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNext = () => {
    setIsFlipped(false);
    onNext();
  };

  // 키보드 단축키
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        handleFlip();
      } else if (e.code === 'ArrowRight' || e.code === 'Enter') {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFlipped]);

  const { beforeBlank, afterBlank } = formatReactionWithBlank(question.reaction);

  return (
    <div className="flashcard-container">
      <button className="back-button" onClick={onBack}>
        ← 뒤로
      </button>

      <div className="flashcard-header">
        <span className="card-number">#{cardNumber}</span>
        {question.hint && (
          <span className="card-hint-badge">{question.hint}</span>
        )}
      </div>

      <div
        className={`flashcard molecule-flashcard ${isFlipped ? 'flipped' : ''}`}
        onClick={handleFlip}
      >
        <div className="flashcard-inner">
          <div className="flashcard-front">
            <div className="card-label">빈칸에 들어갈 분자는?</div>
            <div className="card-content reaction-content">
              <span>{beforeBlank}</span>
              <span className="blank-box">??</span>
              <span>{afterBlank}</span>
            </div>
            <div className="card-instruction">카드를 클릭하여 정답 확인</div>
          </div>
          <div className="flashcard-back">
            <div className="card-label">정답</div>
            <div className="card-content answer molecule-answer">
              {question.answer}
            </div>
            <div className="card-extra">
              <div className="complete-reaction">
                {formatCorrectReaction(question)}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flashcard-controls">
        <button className="btn btn-primary btn-large" onClick={handleNext}>
          다음 카드
        </button>
      </div>

      <div className="flashcard-shortcuts">
        <span>Space: 뒤집기</span>
        <span>→/Enter: 다음</span>
      </div>
    </div>
  );
};
