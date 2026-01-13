import { useState, useCallback } from 'react';
import type { GameState, GameMode, QuizCategory } from '../types';
import { generateQuestion, getHint } from '../utils/questionGenerator';
import { saveScore } from '../utils/storage';

const INITIAL_LIVES = 3;
const COMBO_MULTIPLIER = 0.5;
const BASE_SCORE = 100;
const HINT_PENALTY = 0.5;

const createInitialState = (mode: GameMode, category: QuizCategory): GameState => ({
  mode,
  category,
  score: 0,
  combo: 0,
  maxCombo: 0,
  lives: mode === 'survival' ? INITIAL_LIVES : Infinity,
  currentQuestion: null,
  questionCount: 0,
  correctCount: 0,
  wrongCount: 0,
  hintsUsed: 0,
  isGameOver: false,
  isPaused: false,
});

interface UseGameReturn {
  gameState: GameState;
  startGame: (mode: GameMode, category: QuizCategory) => void;
  submitAnswer: (answer: string) => { isCorrect: boolean; isCombo: boolean };
  nextQuestion: () => void;
  useHint: () => string | null;
  endGame: () => void;
  resetGame: () => void;
}

export const useGame = (): UseGameReturn => {
  const [gameState, setGameState] = useState<GameState>(createInitialState('speed', 'all'));
  const [hintUsedForCurrentQuestion, setHintUsedForCurrentQuestion] = useState(false);

  const startGame = useCallback((mode: GameMode, category: QuizCategory) => {
    const newState = createInitialState(mode, category);
    newState.currentQuestion = generateQuestion(category);
    setGameState(newState);
    setHintUsedForCurrentQuestion(false);
  }, []);

  const nextQuestion = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      currentQuestion: generateQuestion(prev.category),
      questionCount: prev.questionCount + 1,
    }));
    setHintUsedForCurrentQuestion(false);
  }, []);

  const submitAnswer = useCallback((answer: string): { isCorrect: boolean; isCombo: boolean } => {
    const { currentQuestion, combo, mode } = gameState;

    if (!currentQuestion || gameState.isGameOver) {
      return { isCorrect: false, isCombo: false };
    }

    const isCorrect = answer === currentQuestion.correctAnswer;
    const isCombo = isCorrect && combo >= 2;

    setGameState(prev => {
      if (isCorrect) {
        const comboBonus = prev.combo * COMBO_MULTIPLIER;
        const hintPenalty = hintUsedForCurrentQuestion ? HINT_PENALTY : 1;
        const earnedScore = Math.floor(BASE_SCORE * (1 + comboBonus) * hintPenalty);
        const newCombo = prev.combo + 1;

        return {
          ...prev,
          score: prev.score + earnedScore,
          combo: newCombo,
          maxCombo: Math.max(prev.maxCombo, newCombo),
          correctCount: prev.correctCount + 1,
        };
      } else {
        const newLives = mode === 'survival' ? prev.lives - 1 : prev.lives;
        const isGameOver = mode === 'survival' && newLives <= 0;

        return {
          ...prev,
          combo: 0,
          lives: newLives,
          wrongCount: prev.wrongCount + 1,
          isGameOver,
        };
      }
    });

    return { isCorrect, isCombo };
  }, [gameState, hintUsedForCurrentQuestion]);

  const useHint = useCallback((): string | null => {
    if (!gameState.currentQuestion || hintUsedForCurrentQuestion) {
      return null;
    }

    const hint = getHint(gameState.currentQuestion);
    setHintUsedForCurrentQuestion(true);
    setGameState(prev => ({
      ...prev,
      hintsUsed: prev.hintsUsed + 1,
    }));

    return hint;
  }, [gameState.currentQuestion, hintUsedForCurrentQuestion]);

  const endGame = useCallback(() => {
    setGameState(prev => {
      // 리더보드에 저장
      saveScore({
        mode: prev.mode,
        category: prev.category,
        score: prev.score,
        correctCount: prev.correctCount,
        maxCombo: prev.maxCombo,
        date: new Date().toISOString(),
      });

      return {
        ...prev,
        isGameOver: true,
      };
    });
  }, []);

  const resetGame = useCallback(() => {
    setGameState(createInitialState('speed', 'all'));
    setHintUsedForCurrentQuestion(false);
  }, []);

  return {
    gameState,
    startGame,
    submitAnswer,
    nextQuestion,
    useHint,
    endGame,
    resetGame,
  };
};
