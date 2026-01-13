import type { ChemicalReaction } from '../data/reactions';
import { getRandomReaction } from '../data/reactions';

// 계수 배열을 문자열로 변환 (비교용)
const coefficientsToString = (coefficients: number[]): string => {
  return coefficients.join(',');
};

// 계수 배열이 유효한지 확인 (모두 양수)
const isValidCoefficients = (coefficients: number[]): boolean => {
  return coefficients.every(c => c >= 1 && c <= 20);
};

// 매력적인 오답 생성
const generateWrongOptions = (
  correctCoefficients: number[],
  count: number = 4
): number[][] => {
  const wrongOptions: number[][] = [];
  const usedStrings = new Set<string>();
  usedStrings.add(coefficientsToString(correctCoefficients));

  // 전략 1: 하나의 계수만 변경
  for (let i = 0; i < correctCoefficients.length && wrongOptions.length < count; i++) {
    // +1
    const option1 = [...correctCoefficients];
    option1[i] = correctCoefficients[i] + 1;
    if (isValidCoefficients(option1) && !usedStrings.has(coefficientsToString(option1))) {
      wrongOptions.push(option1);
      usedStrings.add(coefficientsToString(option1));
    }

    // -1 (1보다 큰 경우만)
    if (correctCoefficients[i] > 1) {
      const option2 = [...correctCoefficients];
      option2[i] = correctCoefficients[i] - 1;
      if (!usedStrings.has(coefficientsToString(option2))) {
        wrongOptions.push(option2);
        usedStrings.add(coefficientsToString(option2));
      }
    }

    // x2
    const option3 = [...correctCoefficients];
    option3[i] = correctCoefficients[i] * 2;
    if (isValidCoefficients(option3) && !usedStrings.has(coefficientsToString(option3))) {
      wrongOptions.push(option3);
      usedStrings.add(coefficientsToString(option3));
    }
  }

  // 전략 2: 두 개의 계수 교환
  for (let i = 0; i < correctCoefficients.length - 1 && wrongOptions.length < count; i++) {
    for (let j = i + 1; j < correctCoefficients.length && wrongOptions.length < count; j++) {
      if (correctCoefficients[i] !== correctCoefficients[j]) {
        const swapped = [...correctCoefficients];
        [swapped[i], swapped[j]] = [swapped[j], swapped[i]];
        if (!usedStrings.has(coefficientsToString(swapped))) {
          wrongOptions.push(swapped);
          usedStrings.add(coefficientsToString(swapped));
        }
      }
    }
  }

  // 전략 3: 모든 계수에 배수 적용 (잘못된 배수)
  const multipliers = [2, 3];
  for (const mult of multipliers) {
    if (wrongOptions.length >= count) break;
    const multiplied = correctCoefficients.map(c => c * mult);
    if (isValidCoefficients(multiplied) && !usedStrings.has(coefficientsToString(multiplied))) {
      wrongOptions.push(multiplied);
      usedStrings.add(coefficientsToString(multiplied));
    }
  }

  // 전략 4: 반응물/생성물 측 전체 계수 조정
  if (wrongOptions.length < count) {
    const halfPoint = Math.ceil(correctCoefficients.length / 2);
    const option = [...correctCoefficients];
    for (let i = halfPoint; i < option.length; i++) {
      option[i] = Math.min(20, correctCoefficients[i] + 1);
    }
    if (!usedStrings.has(coefficientsToString(option))) {
      wrongOptions.push(option);
      usedStrings.add(coefficientsToString(option));
    }
  }

  // 전략 5: 랜덤 변형 (부족한 경우)
  let attempts = 0;
  while (wrongOptions.length < count && attempts < 50) {
    attempts++;
    const randomOption = correctCoefficients.map(c => {
      const delta = Math.random() < 0.5 ? 1 : -1;
      const shouldChange = Math.random() < 0.4;
      if (shouldChange) {
        return Math.max(1, Math.min(20, c + delta));
      }
      return c;
    });

    if (isValidCoefficients(randomOption) && !usedStrings.has(coefficientsToString(randomOption))) {
      wrongOptions.push(randomOption);
      usedStrings.add(coefficientsToString(randomOption));
    }
  }

  return wrongOptions.slice(0, count);
};

// 계수를 보기 문자열로 변환
export const formatCoefficientOption = (
  reaction: ChemicalReaction,
  coefficients: number[]
): string => {
  const { reactants, products } = reaction;

  const formatTerm = (formula: string, coef: number) => {
    return coef === 1 ? formula : `${coef}${formula}`;
  };

  const reactantStr = reactants
    .map((r, i) => formatTerm(r, coefficients[i]))
    .join(' + ');

  const productStr = products
    .map((p, i) => formatTerm(p, coefficients[reactants.length + i]))
    .join(' + ');

  return `${reactantStr} → ${productStr}`;
};

// 5지선다 문제 인터페이스
export interface CoefficientQuizQuestion {
  reaction: ChemicalReaction;
  options: number[][];  // 5개의 계수 배열 (정답 포함)
  correctIndex: number;  // 정답 인덱스
}

// 5지선다 계수 문제 생성
export const generateCoefficientQuestion = (category: string = 'all'): CoefficientQuizQuestion => {
  const reaction = getRandomReaction(category as 'all' | 'easy' | 'medium' | 'hard');
  const correctCoefficients = reaction.coefficients;

  // 오답 4개 생성
  const wrongOptions = generateWrongOptions(correctCoefficients, 4);

  // 정답과 오답을 합쳐서 셔플
  const allOptions = [correctCoefficients, ...wrongOptions];

  // Fisher-Yates 셔플
  for (let i = allOptions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allOptions[i], allOptions[j]] = [allOptions[j], allOptions[i]];
  }

  // 정답 인덱스 찾기
  const correctIndex = allOptions.findIndex(
    opt => coefficientsToString(opt) === coefficientsToString(correctCoefficients)
  );

  return {
    reaction,
    options: allOptions,
    correctIndex,
  };
};

// 정답 확인
export const checkCoefficientAnswer = (
  selectedIndex: number,
  correctIndex: number
): boolean => {
  return selectedIndex === correctIndex;
};

// 계수 정답 확인 (이전 버전 호환용)
export const checkCoefficients = (
  userCoefficients: number[],
  correctCoefficients: number[]
): boolean => {
  if (userCoefficients.length !== correctCoefficients.length) return false;
  return userCoefficients.every((coef, i) => coef === correctCoefficients[i]);
};

// 정답 표시용 포맷
export const formatCorrectAnswer = (reaction: ChemicalReaction): string => {
  return formatCoefficientOption(reaction, reaction.coefficients);
};
