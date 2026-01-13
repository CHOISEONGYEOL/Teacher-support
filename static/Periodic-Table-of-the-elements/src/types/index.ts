// 학습 주제 타입
export type StudyTopic = 'periodic-table' | 'molecule' | 'coefficient' | 'formula-reading';

export interface Element {
  symbol: string;
  name: string;
  atomicNumber: number;
  valence: string[];
}

export type QuestionType =
  | 'symbol-to-name'      // Fe → 철
  | 'name-to-symbol'      // 철 → Fe
  | 'symbol-to-number'    // Fe → 26
  | 'number-to-symbol'    // 26 → Fe
  | 'symbol-to-valence';  // Na → 1+

export interface Question {
  type: QuestionType;
  question: string;
  correctAnswer: string;
  options: string[];
  element: Element;
}

export type GameMode = 'practice' | 'speed' | 'survival' | 'test';

// 퀴즈 카테고리: 전체 또는 특정 유형만
export type QuizCategory = 'all' | 'name' | 'number' | 'valence';

// 화학식 읽기 카테고리
export type FormulaCategory = 'all' | 'basic' | 'organic' | 'inorganic';

// 계수 맞추기 카테고리
export type CoefficientCategory = 'all' | 'easy' | 'medium' | 'hard';

// 분자 맞추기 카테고리
export type { MoleculeCategory } from '../data/moleculeQuestions';

// 테스트 모드 문항 수
export type TestQuestionCount = 5 | 10 | 15 | 20;

export interface GameState {
  mode: GameMode;
  category: QuizCategory;
  score: number;
  combo: number;
  maxCombo: number;
  lives: number;
  currentQuestion: Question | null;
  questionCount: number;
  correctCount: number;
  wrongCount: number;
  hintsUsed: number;
  isGameOver: boolean;
  isPaused: boolean;
  // 테스트 모드용
  totalQuestions?: number;
  currentQuestionIndex?: number;
}

export interface LeaderboardEntry {
  mode: GameMode;
  category: QuizCategory;
  score: number;
  correctCount: number;
  maxCombo: number;
  date: string;
}
