import { useState, useEffect } from 'react';
import type { ChemicalReaction } from '../data/reactions';
import { formatCorrectAnswer } from '../utils/coefficientQuestionGenerator';

interface CoefficientFlashCardProps {
  reaction: ChemicalReaction;
  onNext: () => void;
  onBack: () => void;
  cardNumber: number;
}

export const CoefficientFlashCard = ({
  reaction,
  onNext,
  onBack,
  cardNumber,
}: CoefficientFlashCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);

  // 문제가 바뀌면 카드 앞면으로
  useEffect(() => {
    setIsFlipped(false);
  }, [reaction]);

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

  // 앞면: 빈칸 반응식
  const formatQuestionSide = () => {
    const { reactants, products } = reaction;
    const reactantStr = reactants.map(r => `? ${r}`).join(' + ');
    const productStr = products.map(p => `? ${p}`).join(' + ');
    return `${reactantStr} → ${productStr}`;
  };

  // 뒷면: 정답 반응식
  const formatAnswerSide = () => {
    return formatCorrectAnswer(reaction);
  };

  return (
    <div className="flashcard-container">
      <button className="back-button" onClick={onBack}>
        ← 뒤로
      </button>

      <div className="flashcard-header">
        <span className="card-number">#{cardNumber}</span>
        {reaction.hint && (
          <span className="card-hint-badge">{reaction.hint}</span>
        )}
      </div>

      <div
        className={`flashcard coefficient-flashcard ${isFlipped ? 'flipped' : ''}`}
        onClick={handleFlip}
      >
        <div className="flashcard-inner">
          <div className="flashcard-front">
            <div className="card-label">반응식 균형 맞추기</div>
            <div className="card-content reaction-content">
              {formatQuestionSide()}
            </div>
            <div className="card-instruction">카드를 클릭하여 정답 확인</div>
          </div>
          <div className="flashcard-back">
            <div className="card-label">정답</div>
            <div className="card-content answer reaction-answer">
              {formatAnswerSide()}
            </div>
            {reaction.hint && (
              <div className="card-extra">
                <div className="reaction-type-info">
                  <span>{reaction.hint}</span>
                </div>
              </div>
            )}
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
