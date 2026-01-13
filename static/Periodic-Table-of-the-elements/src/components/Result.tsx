import type { GameState, QuizCategory } from '../types';
import { Leaderboard } from './Leaderboard';

const categoryNames: Record<QuizCategory, string> = {
  all: '전체 문제',
  name: '원소 이름',
  number: '원자 번호',
  valence: '원자가',
};

interface ResultProps {
  gameState: GameState;
  onRestart: () => void;
  onHome: () => void;
}

export const Result = ({ gameState, onRestart, onHome }: ResultProps) => {
  const { mode, category, score, correctCount, wrongCount, maxCombo, hintsUsed } = gameState;
  const totalQuestions = correctCount + wrongCount;
  const accuracy = totalQuestions > 0
    ? Math.round((correctCount / totalQuestions) * 100)
    : 0;

  const getGrade = () => {
    if (accuracy >= 90) return { grade: 'S', color: '#ffd700', message: '완벽해요!' };
    if (accuracy >= 80) return { grade: 'A', color: '#c0c0c0', message: '훌륭해요!' };
    if (accuracy >= 70) return { grade: 'B', color: '#cd7f32', message: '잘했어요!' };
    if (accuracy >= 60) return { grade: 'C', color: '#4a90d9', message: '괜찮아요!' };
    return { grade: 'D', color: '#888', message: '더 연습해봐요!' };
  };

  const { grade, color, message } = getGrade();

  return (
    <div className="result">
      <div className="result-header">
        <h1>게임 종료!</h1>
        <p className="game-mode">
          {mode === 'speed' ? '⚡ 스피드 모드' : '❤️ 서바이벌 모드'}
          <span className="category-tag">{categoryNames[category]}</span>
        </p>
      </div>

      <div className="grade-section">
        <div className="grade" style={{ color }}>
          {grade}
        </div>
        <p className="grade-message">{message}</p>
      </div>

      <div className="stats">
        <div className="stat-item main-stat">
          <span className="stat-value">{score}</span>
          <span className="stat-label">총 점수</span>
        </div>

        <div className="stat-grid">
          <div className="stat-item">
            <span className="stat-value">{correctCount}</span>
            <span className="stat-label">정답</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{wrongCount}</span>
            <span className="stat-label">오답</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{accuracy}%</span>
            <span className="stat-label">정확도</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{maxCombo}</span>
            <span className="stat-label">최대 콤보</span>
          </div>
        </div>

        {hintsUsed > 0 && (
          <div className="hints-used">
            💡 힌트 사용: {hintsUsed}회
          </div>
        )}
      </div>

      <Leaderboard mode={mode} category={category} />

      <div className="result-actions">
        <button className="btn btn-primary" onClick={onRestart}>
          다시 하기
        </button>
        <button className="btn btn-secondary" onClick={onHome}>
          홈으로
        </button>
      </div>
    </div>
  );
};
