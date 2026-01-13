import { useState, useEffect } from 'react';
import type { CoefficientQuizQuestion } from '../utils/coefficientQuestionGenerator';
import { formatCoefficientOption } from '../utils/coefficientQuestionGenerator';

interface CoefficientQuizProps {
  question: CoefficientQuizQuestion;
  onAnswer: (isCorrect: boolean) => void;
  disabled?: boolean;
  feedback?: 'correct' | 'wrong' | null;
  hideHint?: boolean;
}

export const CoefficientQuiz = ({
  question,
  onAnswer,
  disabled = false,
  feedback,
  hideHint = false,
}: CoefficientQuizProps) => {
  const { reaction, options, correctIndex } = question;
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  // 문제가 바뀌면 선택 초기화
  useEffect(() => {
    setSelectedIndex(null);
  }, [question]);

  const handleSelectOption = (index: number) => {
    if (disabled || feedback !== null) return;

    setSelectedIndex(index);
    const isCorrect = index === correctIndex;
    onAnswer(isCorrect);
  };

  // 키보드 단축키 (1-5)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (disabled || feedback !== null) return;

      const keyNum = parseInt(e.key);
      if (keyNum >= 1 && keyNum <= 5) {
        const index = keyNum - 1;
        if (options[index]) {
          handleSelectOption(index);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [disabled, feedback, options, correctIndex]);

  // 균형 안 맞는 반응식 표시 (물음표로)
  const displayUnbalancedReaction = () => {
    const { reactants, products } = reaction;
    const reactantStr = reactants.map(r => `?${r}`).join(' + ');
    const productStr = products.map(p => `?${p}`).join(' + ');
    return `${reactantStr} → ${productStr}`;
  };

  return (
    <div className={`coefficient-quiz-mc ${feedback ? `feedback-${feedback}` : ''}`}>
      {/* 문제: 균형 안 맞는 반응식 */}
      <div className="coefficient-question">
        <h2 className="question-title">다음 반응식의 계수를 맞추세요</h2>
        <div className="unbalanced-reaction">
          {displayUnbalancedReaction()}
        </div>
        {!hideHint && reaction.hint && (
          <div className="reaction-hint-badge">{reaction.hint}</div>
        )}
      </div>

      {/* 5지선다 보기 */}
      <div className="coefficient-options">
        {options.map((coefficients, index) => {
          let optionClass = 'coefficient-option';

          if (feedback) {
            if (index === correctIndex) {
              optionClass += ' correct';
            } else if (index === selectedIndex && index !== correctIndex) {
              optionClass += ' wrong';
            }
          } else if (index === selectedIndex) {
            optionClass += ' selected';
          }

          return (
            <button
              key={index}
              className={optionClass}
              onClick={() => handleSelectOption(index)}
              disabled={disabled || feedback !== null}
            >
              <span className="option-number">{index + 1}</span>
              <span className="option-reaction">
                {formatCoefficientOption(reaction, coefficients)}
              </span>
            </button>
          );
        })}
      </div>

      {/* 키보드 안내 */}
      <div className="keyboard-hint">
        1-5: 보기 선택
      </div>
    </div>
  );
};
