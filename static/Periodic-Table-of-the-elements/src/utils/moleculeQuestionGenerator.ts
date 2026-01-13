import { getMoleculeQuestionsByCategory, type MoleculeQuestion, type MoleculeCategory } from '../data/moleculeQuestions';

export type { MoleculeQuestion, MoleculeCategory };

// 배열 셔플 함수
const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// 문제 생성 (4지선다 옵션 포함)
export interface MoleculeQuizQuestion extends MoleculeQuestion {
  options: string[];
}

// 랜덤 문제 생성
export const generateMoleculeQuestion = (
  category: MoleculeCategory,
  usedQuestions?: Set<string>
): MoleculeQuizQuestion | null => {
  const questions = getMoleculeQuestionsByCategory(category);

  // 사용하지 않은 문제만 필터링
  let availableQuestions = questions;
  if (usedQuestions && usedQuestions.size > 0) {
    availableQuestions = questions.filter(q => !usedQuestions.has(q.reaction));
  }

  // 모든 문제를 사용했으면 리셋
  if (availableQuestions.length === 0) {
    availableQuestions = questions;
  }

  if (availableQuestions.length === 0) {
    return null;
  }

  // 랜덤 선택
  const randomIndex = Math.floor(Math.random() * availableQuestions.length);
  const question = availableQuestions[randomIndex];

  // 4지선다 옵션 생성 (정답 + 오답 3개)
  const options = shuffleArray([question.answer, ...question.wrongOptions]);

  return {
    ...question,
    options,
  };
};

// 정답 확인
export const checkMoleculeAnswer = (
  userAnswer: string,
  correctAnswer: string
): boolean => {
  return userAnswer === correctAnswer;
};

// 반응식 포맷팅 (??를 빈칸 스타일로)
export const formatReactionWithBlank = (reaction: string): {
  beforeBlank: string;
  afterBlank: string;
} => {
  const parts = reaction.split('??');
  return {
    beforeBlank: parts[0] || '',
    afterBlank: parts[1] || '',
  };
};

// 정답 반응식 생성
export const formatCorrectReaction = (question: MoleculeQuestion): string => {
  return question.reaction.replace('??', question.answer);
};
