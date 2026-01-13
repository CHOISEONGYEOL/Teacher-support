import type { Element } from '../types';

export const elements: Element[] = [
  // 1번~20번 (주요 원소)
  { symbol: 'H', name: '수소', atomicNumber: 1, valence: ['1+'] },
  { symbol: 'He', name: '헬륨', atomicNumber: 2, valence: ['0'] },
  { symbol: 'Li', name: '리튬', atomicNumber: 3, valence: ['1+'] },
  { symbol: 'Be', name: '베릴륨', atomicNumber: 4, valence: ['2+'] },
  { symbol: 'B', name: '붕소', atomicNumber: 5, valence: ['3+'] },
  { symbol: 'C', name: '탄소', atomicNumber: 6, valence: ['4+', '4-'] },
  { symbol: 'N', name: '질소', atomicNumber: 7, valence: ['3-'] },
  { symbol: 'O', name: '산소', atomicNumber: 8, valence: ['2-'] },
  { symbol: 'F', name: '플루오린', atomicNumber: 9, valence: ['1-'] },
  { symbol: 'Ne', name: '네온', atomicNumber: 10, valence: ['0'] },
  { symbol: 'Na', name: '나트륨', atomicNumber: 11, valence: ['1+'] },
  { symbol: 'Mg', name: '마그네슘', atomicNumber: 12, valence: ['2+'] },
  { symbol: 'Al', name: '알루미늄', atomicNumber: 13, valence: ['3+'] },
  { symbol: 'Si', name: '규소', atomicNumber: 14, valence: ['4+', '4-'] },
  { symbol: 'P', name: '인', atomicNumber: 15, valence: ['3-'] },
  { symbol: 'S', name: '황', atomicNumber: 16, valence: ['2-'] },
  { symbol: 'Cl', name: '염소', atomicNumber: 17, valence: ['1-'] },
  { symbol: 'Ar', name: '아르곤', atomicNumber: 18, valence: ['0'] },
  { symbol: 'K', name: '칼륨', atomicNumber: 19, valence: ['1+'] },
  { symbol: 'Ca', name: '칼슘', atomicNumber: 20, valence: ['2+'] },

  // 전이 금속
  { symbol: 'Cr', name: '크로뮴', atomicNumber: 24, valence: ['2+', '3+', '4+', '5+', '6+'] },
  { symbol: 'Mn', name: '망가니즈', atomicNumber: 25, valence: ['2+', '3+', '4+', '5+', '6+', '7+'] },
  { symbol: 'Fe', name: '철', atomicNumber: 26, valence: ['2+', '3+', '4+', '6+'] },
  { symbol: 'Co', name: '코발트', atomicNumber: 27, valence: ['2+', '3+'] },
  { symbol: 'Ni', name: '니켈', atomicNumber: 28, valence: ['2+', '3+', '4+'] },
  { symbol: 'Cu', name: '구리', atomicNumber: 29, valence: ['1+', '2+', '3+'] },
  { symbol: 'Zn', name: '아연', atomicNumber: 30, valence: ['2+'] },

  // 기타 원소
  { symbol: 'Br', name: '브로민', atomicNumber: 35, valence: ['1-'] },
  { symbol: 'Kr', name: '크립톤', atomicNumber: 36, valence: ['0'] },
  { symbol: 'Rb', name: '루비듐', atomicNumber: 37, valence: ['1+'] },
  { symbol: 'Sr', name: '스트론튬', atomicNumber: 38, valence: ['2+'] },
  { symbol: 'Ag', name: '은', atomicNumber: 47, valence: ['1+'] },
  { symbol: 'Cd', name: '카드뮴', atomicNumber: 48, valence: ['2+'] },
  { symbol: 'Sn', name: '주석', atomicNumber: 50, valence: ['2+', '4+'] },
  { symbol: 'I', name: '아이오딘', atomicNumber: 53, valence: ['1-'] },
  { symbol: 'Xe', name: '제논', atomicNumber: 54, valence: ['0'] },
  { symbol: 'Cs', name: '세슘', atomicNumber: 55, valence: ['1+'] },
  { symbol: 'Ba', name: '바륨', atomicNumber: 56, valence: ['2+'] },
  { symbol: 'Au', name: '금', atomicNumber: 79, valence: ['1+', '3+'] },
  { symbol: 'Hg', name: '수은', atomicNumber: 80, valence: ['2+'] },
  { symbol: 'Pb', name: '납', atomicNumber: 82, valence: ['2+', '4+'] },
  { symbol: 'Rn', name: '라돈', atomicNumber: 86, valence: ['0'] },
];

export const getRandomElements = (count: number, exclude?: Element): Element[] => {
  const available = exclude
    ? elements.filter(e => e.symbol !== exclude.symbol)
    : elements;

  const shuffled = [...available].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

export const getRandomElement = (): Element => {
  return elements[Math.floor(Math.random() * elements.length)];
};
