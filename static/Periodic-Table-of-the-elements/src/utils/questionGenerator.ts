import type { Question, QuestionType, Element, QuizCategory } from '../types';
import { elements, getRandomElements, getRandomElement } from '../data/elements';

// 카테고리별 문제 유형 매핑
const categoryToTypes: Record<QuizCategory, QuestionType[]> = {
  all: ['symbol-to-name', 'name-to-symbol', 'symbol-to-number', 'number-to-symbol', 'symbol-to-valence'],
  name: ['symbol-to-name', 'name-to-symbol'],
  number: ['symbol-to-number', 'number-to-symbol'],
  valence: ['symbol-to-valence'],
};

const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const generateQuestion = (category: QuizCategory = 'all'): Question => {
  const availableTypes = categoryToTypes[category];
  const type = availableTypes[Math.floor(Math.random() * availableTypes.length)];
  const element = getRandomElement();

  switch (type) {
    case 'symbol-to-name':
      return generateSymbolToName(element);
    case 'name-to-symbol':
      return generateNameToSymbol(element);
    case 'symbol-to-number':
      return generateSymbolToNumber(element);
    case 'number-to-symbol':
      return generateNumberToSymbol(element);
    case 'symbol-to-valence':
      return generateSymbolToValence(element);
    default:
      return generateSymbolToName(element);
  }
};

const generateSymbolToName = (element: Element): Question => {
  const wrongElements = getRandomElements(3, element);
  const options = shuffleArray([
    element.name,
    ...wrongElements.map(e => e.name),
  ]);

  return {
    type: 'symbol-to-name',
    question: `${element.symbol}의 원소 이름은?`,
    correctAnswer: element.name,
    options,
    element,
  };
};

const generateNameToSymbol = (element: Element): Question => {
  const wrongElements = getRandomElements(3, element);
  const options = shuffleArray([
    element.symbol,
    ...wrongElements.map(e => e.symbol),
  ]);

  return {
    type: 'name-to-symbol',
    question: `'${element.name}'의 원소 기호는?`,
    correctAnswer: element.symbol,
    options,
    element,
  };
};

const generateSymbolToNumber = (element: Element): Question => {
  const wrongElements = getRandomElements(3, element);
  const options = shuffleArray([
    `${element.atomicNumber}번`,
    ...wrongElements.map(e => `${e.atomicNumber}번`),
  ]);

  return {
    type: 'symbol-to-number',
    question: `${element.symbol}는 몇 번 원소?`,
    correctAnswer: `${element.atomicNumber}번`,
    options,
    element,
  };
};

const generateNumberToSymbol = (element: Element): Question => {
  const wrongElements = getRandomElements(3, element);
  const options = shuffleArray([
    element.symbol,
    ...wrongElements.map(e => e.symbol),
  ]);

  return {
    type: 'number-to-symbol',
    question: `${element.atomicNumber}번 원소의 기호는?`,
    correctAnswer: element.symbol,
    options,
    element,
  };
};

const generateSymbolToValence = (element: Element): Question => {
  // 원자가가 하나인 원소의 경우, 다른 원소들의 원자가를 보기로 사용
  const correctValence = element.valence.join(', ');

  // 다른 원소들에서 다양한 원자가 옵션 생성
  const allValences = elements
    .filter(e => e.symbol !== element.symbol)
    .map(e => e.valence.join(', '))
    .filter((v, i, arr) => arr.indexOf(v) === i); // 중복 제거

  const shuffledValences = shuffleArray(allValences);
  const wrongValences = shuffledValences
    .filter(v => v !== correctValence)
    .slice(0, 3);

  const options = shuffleArray([correctValence, ...wrongValences]);

  return {
    type: 'symbol-to-valence',
    question: `${element.symbol}의 원자가(價)는?`,
    correctAnswer: correctValence,
    options,
    element,
  };
};

export const getHint = (question: Question): string => {
  const { element, type } = question;

  switch (type) {
    case 'symbol-to-name':
      return `${element.atomicNumber}번 원소입니다`;
    case 'name-to-symbol':
      return `${element.atomicNumber}번 원소입니다`;
    case 'symbol-to-number':
      return `원소 이름은 '${element.name}'입니다`;
    case 'number-to-symbol':
      return `원소 이름은 '${element.name}'입니다`;
    case 'symbol-to-valence':
      return `${element.name}(${element.atomicNumber}번)입니다`;
    default:
      return '힌트가 없습니다';
  }
};
