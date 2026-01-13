import { useState, useEffect } from 'react';
import type { Question } from '../types';

interface FlashCardProps {
  question: Question;
  onNext: () => void;
  onBack: () => void;
  cardNumber: number;
}

export const FlashCard = ({ question, onNext, onBack, cardNumber }: FlashCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);

  // 문제가 바뀌면 카드 앞면으로 리셋
  useEffect(() => {
    setIsFlipped(false);
  }, [question]);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNext = () => {
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

  const getQuestionLabel = () => {
    switch (question.type) {
      case 'symbol-to-name':
        return '이 원소의 이름은?';
      case 'name-to-symbol':
        return '이 원소의 기호는?';
      case 'symbol-to-number':
        return '이 원소의 원자 번호는?';
      case 'number-to-symbol':
        return '이 번호의 원소 기호는?';
      case 'symbol-to-valence':
        return '이 원소의 원자가는?';
      default:
        return '';
    }
  };

  const getQuestionDisplay = () => {
    switch (question.type) {
      case 'symbol-to-name':
      case 'symbol-to-number':
      case 'symbol-to-valence':
        return question.element.symbol;
      case 'name-to-symbol':
        return question.element.name;
      case 'number-to-symbol':
        return `${question.element.atomicNumber}번`;
      default:
        return '';
    }
  };

  return (
    <div className="flashcard-container">
      <button className="back-button" onClick={onBack}>
        ← 나가기
      </button>

      <div className="flashcard-header">
        <span className="card-number">{cardNumber}번째 카드</span>
      </div>

      <div
        className={`flashcard ${isFlipped ? 'flipped' : ''}`}
        onClick={handleFlip}
      >
        <div className="flashcard-inner">
          {/* 앞면 - 문제 */}
          <div className="flashcard-front">
            <div className="card-label">{getQuestionLabel()}</div>
            <div className="card-content">{getQuestionDisplay()}</div>
            <div className="card-hint">탭하여 정답 보기</div>
          </div>

          {/* 뒷면 - 정답 */}
          <div className="flashcard-back">
            <div className="card-label">정답</div>
            <div className="card-content answer">{question.correctAnswer}</div>
            <div className="card-extra">
              <div className="element-info">
                <span>{question.element.symbol}</span>
                <span>{question.element.name}</span>
                <span>{question.element.atomicNumber}번</span>
                <span>{question.element.valence.join(', ')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flashcard-controls">
        <button className="btn btn-primary btn-large" onClick={handleNext}>
          다음 카드 →
        </button>
      </div>

      <div className="flashcard-shortcuts">
        <span>Space: 카드 뒤집기</span>
        <span>→ / Enter: 다음 카드</span>
      </div>
    </div>
  );
};
