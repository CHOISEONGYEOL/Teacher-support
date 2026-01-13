import { useState, useEffect } from 'react';
import type { Question } from '../types';

interface QuizProps {
  question: Question;
  onAnswer: (answer: string) => void;
  onHint?: () => string | null;
  disabled: boolean;
  feedback: 'correct' | 'wrong' | null;
  hideHint?: boolean;
}

export const Quiz = ({ question, onAnswer, onHint, disabled, feedback, hideHint }: QuizProps) => {
  const [hint, setHint] = useState<string | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  // 문제가 바뀌면 힌트와 선택 초기화
  useEffect(() => {
    setHint(null);
    setSelectedAnswer(null);
  }, [question]);

  const handleHint = () => {
    if (onHint) {
      const hintText = onHint();
      setHint(hintText);
    }
  };

  const handleAnswer = (answer: string) => {
    if (disabled) return;
    setSelectedAnswer(answer);
    onAnswer(answer);
  };

  const getOptionClass = (option: string) => {
    let className = 'option';

    if (selectedAnswer === option) {
      className += ' selected';
    }

    if (feedback && selectedAnswer) {
      if (option === question.correctAnswer) {
        className += ' correct';
      } else if (option === selectedAnswer && feedback === 'wrong') {
        className += ' wrong';
      }
    }

    return className;
  };

  return (
    <div className={`quiz ${feedback ? `quiz-${feedback}` : ''}`}>
      <div className="question-type">
        {question.type === 'symbol-to-name' && '원소 이름 맞추기'}
        {question.type === 'name-to-symbol' && '원소 기호 맞추기'}
        {question.type === 'symbol-to-number' && '원자 번호 맞추기'}
        {question.type === 'number-to-symbol' && '원소 기호 맞추기'}
        {question.type === 'symbol-to-valence' && '원자가 맞추기'}
      </div>

      <div className="question">
        <h2>{question.question}</h2>
      </div>

      {hint && (
        <div className="hint-display">
          💡 {hint}
        </div>
      )}

      <div className="options">
        {question.options.map((option, index) => (
          <button
            key={index}
            className={getOptionClass(option)}
            onClick={() => handleAnswer(option)}
            disabled={disabled}
          >
            <span className="option-number">{index + 1}</span>
            <span className="option-text">{option}</span>
          </button>
        ))}
      </div>

      {!hint && !disabled && !hideHint && onHint && (
        <button className="hint-button" onClick={handleHint}>
          💡 힌트 보기 (점수 50% 감점)
        </button>
      )}
    </div>
  );
};
