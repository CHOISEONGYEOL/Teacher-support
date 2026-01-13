import type { LeaderboardEntry, GameMode, QuizCategory } from '../types';

const STORAGE_KEY = 'periodic-quiz-leaderboard';

export const getLeaderboard = (): LeaderboardEntry[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const saveScore = (entry: LeaderboardEntry): void => {
  const leaderboard = getLeaderboard();
  leaderboard.push(entry);

  // 점수 기준 내림차순 정렬 후 상위 50개만 유지
  leaderboard.sort((a, b) => b.score - a.score);
  const trimmed = leaderboard.slice(0, 50);

  localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
};

export const getTopScores = (mode: GameMode, category?: QuizCategory, limit: number = 5): LeaderboardEntry[] => {
  const leaderboard = getLeaderboard();
  return leaderboard
    .filter(e => e.mode === mode && (category === undefined || e.category === category))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
};

export const clearLeaderboard = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};
