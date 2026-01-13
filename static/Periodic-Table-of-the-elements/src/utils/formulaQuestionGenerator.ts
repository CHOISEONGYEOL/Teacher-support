import type { CompoundCategory, Compound } from '../data/compounds';
import { getRandomCompound, getWrongOptions, getWrongFormulaOptions } from '../data/compounds';

export type FormulaQuestionType = 'formula-to-name' | 'name-to-formula';

export interface FormulaQuestion {
  type: FormulaQuestionType;
  question: string;
  correctAnswer: string;
  options: string[];
  compound: Compound;
}

// 배열 섞기
const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// 화학식 문제 생성
export const generateFormulaQuestion = (category: CompoundCategory = 'all'): FormulaQuestion => {
  const compound = getRandomCompound(category);
  const questionTypes: FormulaQuestionType[] = ['formula-to-name', 'name-to-formula'];
  const type = questionTypes[Math.floor(Math.random() * questionTypes.length)];

  let question: string;
  let correctAnswer: string;
  let wrongOptions: string[];

  if (type === 'formula-to-name') {
    question = `${compound.formula}의 이름은?`;
    correctAnswer = compound.name;
    wrongOptions = getWrongOptions(compound, 3);
  } else {
    question = `${compound.name}의 화학식은?`;
    correctAnswer = compound.formula;
    wrongOptions = getWrongFormulaOptions(compound, 3);
  }

  const options = shuffleArray([correctAnswer, ...wrongOptions]);

  return {
    type,
    question,
    correctAnswer,
    options,
    compound,
  };
};

// 카테고리별 문제 생성
export const generateFormulaQuestionByCategory = (
  category: CompoundCategory,
  questionType?: FormulaQuestionType
): FormulaQuestion => {
  const compound = getRandomCompound(category);
  const type = questionType || (['formula-to-name', 'name-to-formula'] as FormulaQuestionType[])[Math.floor(Math.random() * 2)];

  let question: string;
  let correctAnswer: string;
  let wrongOptions: string[];

  if (type === 'formula-to-name') {
    question = `${compound.formula}의 이름은?`;
    correctAnswer = compound.name;
    wrongOptions = getWrongOptions(compound, 3);
  } else {
    question = `${compound.name}의 화학식은?`;
    correctAnswer = compound.formula;
    wrongOptions = getWrongFormulaOptions(compound, 3);
  }

  const options = shuffleArray([correctAnswer, ...wrongOptions]);

  return {
    type,
    question,
    correctAnswer,
    options,
    compound,
  };
};
