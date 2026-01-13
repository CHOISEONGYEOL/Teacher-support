// 화학식 데이터
export interface Compound {
  formula: string;      // 화학식 (아래첨자 포함)
  name: string;         // 한글 이름
  category: CompoundCategory;
  hint?: string;        // 힌트 (구성 원소 등)
}

export type CompoundCategory = 'basic' | 'organic' | 'inorganic' | 'all';

export const compounds: Compound[] = [
  // 기본 분자
  { formula: 'H₂', name: '수소', category: 'basic', hint: '가장 가벼운 기체' },
  { formula: 'O₂', name: '산소', category: 'basic', hint: '호흡에 필요한 기체' },
  { formula: 'N₂', name: '질소', category: 'basic', hint: '공기의 약 78%' },
  { formula: 'Cl₂', name: '염소', category: 'basic', hint: '노란-녹색 기체' },
  { formula: 'F₂', name: '플루오린', category: 'basic', hint: '가장 반응성이 큰 원소' },
  { formula: 'O₃', name: '오존', category: 'basic', hint: '산소 원자 3개' },

  // 무기 화합물
  { formula: 'H₂O', name: '물', category: 'inorganic', hint: '생명의 근원' },
  { formula: 'H₂O₂', name: '과산화수소', category: 'inorganic', hint: '소독제로 사용' },
  { formula: 'HCl', name: '염화수소', category: 'inorganic', hint: '위산의 주성분' },
  { formula: 'HF', name: '플루오린화수소', category: 'inorganic', hint: '유리를 녹임' },
  { formula: 'HBr', name: '브로민화수소', category: 'inorganic', hint: '할로젠화수소' },
  { formula: 'HI', name: '아이오딘화수소', category: 'inorganic', hint: '할로젠화수소' },
  { formula: 'H₂S', name: '황화수소', category: 'inorganic', hint: '썩은 달걀 냄새' },
  { formula: 'NH₃', name: '암모니아', category: 'inorganic', hint: '자극적인 냄새의 기체' },
  { formula: 'CO', name: '일산화탄소', category: 'inorganic', hint: '독성 기체' },
  { formula: 'CO₂', name: '이산화탄소', category: 'inorganic', hint: '탄산음료의 기포' },
  { formula: 'NO', name: '일산화질소', category: 'inorganic', hint: '대기 오염 물질' },
  { formula: 'NO₂', name: '이산화질소', category: 'inorganic', hint: '갈색 기체' },
  { formula: 'N₂O', name: '아산화질소', category: 'inorganic', hint: '웃음 가스' },
  { formula: 'SO₂', name: '이산화황', category: 'inorganic', hint: '산성비의 원인' },
  { formula: 'SO₃', name: '삼산화황', category: 'inorganic', hint: '황산 제조에 사용' },

  // 산
  { formula: 'H₂SO₄', name: '황산', category: 'inorganic', hint: '강산' },
  { formula: 'HNO₃', name: '질산', category: 'inorganic', hint: '강산, 산화제' },
  { formula: 'H₃PO₄', name: '인산', category: 'inorganic', hint: '콜라에 포함' },
  { formula: 'H₂CO₃', name: '탄산', category: 'inorganic', hint: '탄산음료' },

  // 염기/수산화물
  { formula: 'NaOH', name: '수산화나트륨', category: 'inorganic', hint: '양잿물' },
  { formula: 'KOH', name: '수산화칼륨', category: 'inorganic', hint: '강염기' },
  { formula: 'Ca(OH)₂', name: '수산화칼슘', category: 'inorganic', hint: '소석회' },
  { formula: 'Mg(OH)₂', name: '수산화마그네슘', category: 'inorganic', hint: '제산제' },
  { formula: 'Ba(OH)₂', name: '수산화바륨', category: 'inorganic', hint: '강염기' },

  // 염
  { formula: 'NaCl', name: '염화나트륨', category: 'inorganic', hint: '소금' },
  { formula: 'KCl', name: '염화칼륨', category: 'inorganic', hint: '저나트륨 소금' },
  { formula: 'CaCl₂', name: '염화칼슘', category: 'inorganic', hint: '제습제' },
  { formula: 'MgCl₂', name: '염화마그네슘', category: 'inorganic', hint: '두부 응고제' },
  { formula: 'NaHCO₃', name: '탄산수소나트륨', category: 'inorganic', hint: '베이킹 소다' },
  { formula: 'Na₂CO₃', name: '탄산나트륨', category: 'inorganic', hint: '소다회' },
  { formula: 'CaCO₃', name: '탄산칼슘', category: 'inorganic', hint: '석회석, 대리석' },
  { formula: 'CaSO₄', name: '황산칼슘', category: 'inorganic', hint: '석고' },
  { formula: 'BaSO₄', name: '황산바륨', category: 'inorganic', hint: 'X선 조영제' },
  { formula: 'AgNO₃', name: '질산은', category: 'inorganic', hint: '사진 현상' },
  { formula: 'CuSO₄', name: '황산구리', category: 'inorganic', hint: '파란색 결정' },
  { formula: 'FeSO₄', name: '황산철(II)', category: 'inorganic', hint: '철분 보충제' },
  { formula: 'Fe₂O₃', name: '산화철(III)', category: 'inorganic', hint: '녹, 적철석' },
  { formula: 'Al₂O₃', name: '산화알루미늄', category: 'inorganic', hint: '보크사이트' },
  { formula: 'SiO₂', name: '이산화규소', category: 'inorganic', hint: '석영, 모래' },

  // 유기 화합물 - 탄화수소
  { formula: 'CH₄', name: '메테인', category: 'organic', hint: '천연가스의 주성분' },
  { formula: 'C₂H₆', name: '에테인', category: 'organic', hint: '탄소 2개 알케인' },
  { formula: 'C₃H₈', name: '프로페인', category: 'organic', hint: 'LPG 성분' },
  { formula: 'C₄H₁₀', name: '뷰테인', category: 'organic', hint: '라이터 연료' },
  { formula: 'C₂H₄', name: '에틸렌', category: 'organic', hint: '과일 숙성 호르몬' },
  { formula: 'C₂H₂', name: '아세틸렌', category: 'organic', hint: '용접에 사용' },
  { formula: 'C₆H₆', name: '벤젠', category: 'organic', hint: '방향족 화합물' },

  // 유기 화합물 - 알코올, 산
  { formula: 'CH₃OH', name: '메탄올', category: 'organic', hint: '목정, 독성' },
  { formula: 'C₂H₅OH', name: '에탄올', category: 'organic', hint: '술의 알코올' },
  { formula: 'CH₃COOH', name: '아세트산', category: 'organic', hint: '식초의 주성분' },
  { formula: 'HCOOH', name: '폼산', category: 'organic', hint: '개미산' },

  // 유기 화합물 - 생체 분자
  { formula: 'C₆H₁₂O₆', name: '포도당', category: 'organic', hint: '혈당' },
  { formula: 'C₁₂H₂₂O₁₁', name: '설탕', category: 'organic', hint: '수크로스' },
  { formula: '(C₆H₁₀O₅)ₙ', name: '녹말', category: 'organic', hint: '탄수화물' },
  { formula: '(C₆H₁₀O₅)ₙ', name: '셀룰로오스', category: 'organic', hint: '식물 세포벽' },

  // 기타 유기 화합물
  { formula: 'C₉H₈O₄', name: '아세틸살리실산', category: 'organic', hint: '아스피린' },
  { formula: 'CH₂O', name: '폼알데하이드', category: 'organic', hint: '포르말린' },
  { formula: 'C₃H₆O', name: '아세톤', category: 'organic', hint: '매니큐어 제거제' },
  { formula: 'C₆H₈O₇', name: '시트르산', category: 'organic', hint: '레몬의 신맛' },
  { formula: 'CO(NH₂)₂', name: '요소', category: 'organic', hint: '비료, 화장품' },
];

// 카테고리별 필터링
export const getCompoundsByCategory = (category: CompoundCategory): Compound[] => {
  if (category === 'all') return compounds;
  return compounds.filter(c => c.category === category);
};

// 랜덤 화합물 가져오기
export const getRandomCompound = (category: CompoundCategory = 'all'): Compound => {
  const filtered = getCompoundsByCategory(category);
  return filtered[Math.floor(Math.random() * filtered.length)];
};

// 오답 보기 생성 (같은 카테고리 우선)
export const getWrongOptions = (correct: Compound, count: number = 3): string[] => {
  const sameCategory = compounds.filter(c => c.name !== correct.name && c.category === correct.category);
  const others = compounds.filter(c => c.name !== correct.name && c.category !== correct.category);

  const pool = [...sameCategory, ...others];
  const shuffled = pool.sort(() => Math.random() - 0.5);

  return shuffled.slice(0, count).map(c => c.name);
};

// 화학식 오답 보기 생성
export const getWrongFormulaOptions = (correct: Compound, count: number = 3): string[] => {
  const sameCategory = compounds.filter(c => c.formula !== correct.formula && c.category === correct.category);
  const others = compounds.filter(c => c.formula !== correct.formula && c.category !== correct.category);

  const pool = [...sameCategory, ...others];
  const shuffled = pool.sort(() => Math.random() - 0.5);

  return shuffled.slice(0, count).map(c => c.formula);
};
