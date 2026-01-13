import { useState, useEffect } from 'react';
import type { FormulaQuestion } from '../utils/formulaQuestionGenerator';

interface FormulaFlashCardProps {
  question: FormulaQuestion;
  onNext: () => void;
  onBack: () => void;
  cardNumber: number;
}

export const FormulaFlashCard = ({ question, onNext, onBack, cardNumber }: FormulaFlashCardProps) => {
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

  // 앞면에 표시할 내용
  const frontContent = question.type === 'formula-to-name'
    ? question.compound.formula
    : question.compound.name;

  // 뒷면에 표시할 내용
  const backContent = question.type === 'formula-to-name'
    ? question.compound.name
    : question.compound.formula;

  // 라벨
  const frontLabel = question.type === 'formula-to-name' ? '화학식' : '이름';
  const backLabel = question.type === 'formula-to-name' ? '이름' : '화학식';

  return (
    <div className="flashcard-container">
      <button className="back-button" onClick={onBack}>
        ← 뒤로
      </button>

      <div className="flashcard-header">
        <span className="card-number">#{cardNumber}</span>
      </div>

      <div
        className={`flashcard ${isFlipped ? 'flipped' : ''}`}
        onClick={handleFlip}
      >
        <div className="flashcard-inner">
          <div className="flashcard-front">
            <div className="card-label">{frontLabel}</div>
            <div className="card-content formula-content">{frontContent}</div>
            {question.compound.hint && (
              <div className="card-hint">힌트: {question.compound.hint}</div>
            )}
          </div>
          <div className="flashcard-back">
            <div className="card-label">{backLabel}</div>
            <div className="card-content answer">{backContent}</div>
            <div className="card-extra">
              <div className="compound-info">
                <span>{question.compound.formula}</span>
                <span>=</span>
                <span>{question.compound.name}</span>
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
