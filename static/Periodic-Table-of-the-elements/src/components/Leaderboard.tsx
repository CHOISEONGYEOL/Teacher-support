import type { GameMode, QuizCategory } from '../types';
import { getTopScores } from '../utils/storage';

interface LeaderboardProps {
  mode: GameMode;
  category: QuizCategory;
}

export const Leaderboard = ({ mode, category }: LeaderboardProps) => {
  const scores = getTopScores(mode, category, 5);

  if (scores.length === 0) {
    return null;
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  return (
    <div className="leaderboard">
      <h3>🏆 리더보드</h3>
      <div className="leaderboard-list">
        {scores.map((entry, index) => (
          <div key={index} className={`leaderboard-item rank-${index + 1}`}>
            <span className="rank">
              {index === 0 && '🥇'}
              {index === 1 && '🥈'}
              {index === 2 && '🥉'}
              {index > 2 && `${index + 1}.`}
            </span>
            <span className="entry-score">{entry.score}점</span>
            <span className="entry-detail">
              {entry.correctCount}문제 | 콤보 {entry.maxCombo}
            </span>
            <span className="entry-date">{formatDate(entry.date)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
