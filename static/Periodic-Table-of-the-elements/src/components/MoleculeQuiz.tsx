import { useState, useEffect } from 'react';
import type { MoleculeQuizQuestion } from '../utils/moleculeQuestionGenerator';
import { formatReactionWithBlank } from '../utils/moleculeQuestionGenerator';

interface MoleculeQuizProps {
  question: MoleculeQuizQuestion;
  onAnswer: (isCorrect: boolean) => void;
  onBack: () => void;
  mode: 'speed' | 'survival' | 'test';
  // 게임 상태
  score?: number;
  combo?: number;
  lives?: number;
  timeLeft?: number;
  // 테스트 모드용
  currentQuestion?: number;
  totalQuestions?: number;
}

export const MoleculeQuiz = ({
  question,
  onAnswer,
  onBack,
  mode,
  score = 0,
  combo = 0,
  lives = 3,
  timeLeft = 60,
  currentQuestion = 1,
  totalQuestions = 10,
}: MoleculeQuizProps) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  // 문제가 바뀌면 상태 초기화
  useEffect(() => {
    setSelectedAnswer(null);
    setShowResult(false);
    setIsCorrect(false);
  }, [question]);

  const handleSelectAnswer = (answer: string) => {
    if (showResult) return;

    setSelectedAnswer(answer);
    const correct = answer === question.answer;
    setIsCorrect(correct);
    setShowResult(true);

    // 잠시 후 다음 문제로
    setTimeout(() => {
      onAnswer(correct);
    }, 800);
  };

  // 키보드 단축키 (1, 2, 3, 4)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showResult) return;

      const keyNum = parseInt(e.key);
      if (keyNum >= 1 && keyNum <= 4) {
        const index = keyNum - 1;
        if (question.options[index]) {
          handleSelectAnswer(question.options[index]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [question, showResult]);

  const { beforeBlank, afterBlank } = formatReactionWithBlank(question.reaction);

  return (
    <div className={`quiz-container molecule-quiz ${showResult ? (isCorrect ? 'correct-flash' : 'wrong-shake') : ''}`}>
      <button className="back-button game-back-button" onClick={onBack}>
        ← 나가기
      </button>

      {/* 상단 상태 표시 */}
      <div className="quiz-header">
        {mode === 'speed' && (
          <>
            <div className="stat-box">
              <span className="stat-label">시간</span>
              <span className={`stat-value ${timeLeft <= 10 ? 'time-warning' : ''}`}>
                {timeLeft}초
              </span>
            </div>
            <div className="stat-box">
              <span className="stat-label">점수</span>
              <span className="stat-value">{score}</span>
            </div>
            <div className="stat-box">
              <span className="stat-label">콤보</span>
              <span className="stat-value combo">{combo > 0 ? `x${combo}` : '-'}</span>
            </div>
          </>
        )}

        {mode === 'survival' && (
          <>
            <div className="stat-box lives">
              <span className="stat-label">목숨</span>
              <span className="stat-value">{'❤️'.repeat(lives)}{'🖤'.repeat(3 - lives)}</span>
            </div>
            <div className="stat-box">
              <span className="stat-label">점수</span>
              <span className="stat-value">{score}</span>
            </div>
            <div className="stat-box">
              <span className="stat-label">콤보</span>
              <span className="stat-value combo">{combo > 0 ? `x${combo}` : '-'}</span>
            </div>
          </>
        )}

        {mode === 'test' && (
          <>
            <div className="stat-box">
              <span className="stat-label">문제</span>
              <span className="stat-value">{currentQuestion}/{totalQuestions}</span>
            </div>
            <div className="stat-box">
              <span className="stat-label">시간</span>
              <span className={`stat-value ${timeLeft <= 2 ? 'time-warning' : ''}`}>
                {timeLeft}초
              </span>
            </div>
          </>
        )}
      </div>

      {/* 힌트 배지 */}
      {question.hint && (
        <div className="hint-badge">{question.hint}</div>
      )}

      {/* 반응식 표시 */}
      <div className="molecule-question">
        <div className="reaction-display">
          <span className="reaction-part">{beforeBlank}</span>
          <span className="reaction-blank">??</span>
          <span className="reaction-part">{afterBlank}</span>
        </div>
      </div>

      {/* 4지선다 보기 */}
      <div className="molecule-options">
        {question.options.map((option, index) => {
          let buttonClass = 'molecule-option';
          if (showResult) {
            if (option === question.answer) {
              buttonClass += ' correct';
            } else if (option === selectedAnswer) {
              buttonClass += ' wrong';
            }
          } else if (option === selectedAnswer) {
            buttonClass += ' selected';
          }

          return (
            <button
              key={index}
              className={buttonClass}
              onClick={() => handleSelectAnswer(option)}
              disabled={showResult}
            >
              <span className="option-number">{index + 1}</span>
              <span className="option-text">{option}</span>
            </button>
          );
        })}
      </div>

      {/* 키보드 단축키 안내 */}
      <div className="keyboard-hint">
        1-4: 보기 선택
      </div>
    </div>
  );
};
