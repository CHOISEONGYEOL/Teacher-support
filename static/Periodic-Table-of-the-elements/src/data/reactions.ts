// 화학 반응식 데이터
export type ReactionCategory = 'all' | 'easy' | 'medium' | 'hard';

export interface ChemicalReaction {
  reactants: string[];      // 반응물 화학식 배열
  products: string[];       // 생성물 화학식 배열
  coefficients: number[];   // 정답 계수 (반응물 + 생성물 순서)
  category: ReactionCategory;
  hint?: string;            // 힌트 (반응 유형 등)
}

// 전체 반응식 데이터 (45문항)
export const reactions: ChemicalReaction[] = [
  // === 쉬운 문제 (easy) - 15문항 ===
  // 금속 + 산 → 염 + 수소
  {
    reactants: ['Mg', 'HCl'],
    products: ['MgCl₂', 'H₂'],
    coefficients: [1, 2, 1, 1],
    category: 'easy',
    hint: '금속 + 산 → 염 + 수소',
  },
  {
    reactants: ['Zn', 'HCl'],
    products: ['ZnCl₂', 'H₂'],
    coefficients: [1, 2, 1, 1],
    category: 'easy',
    hint: '금속 + 산 → 염 + 수소',
  },
  {
    reactants: ['Fe', 'HCl'],
    products: ['FeCl₂', 'H₂'],
    coefficients: [1, 2, 1, 1],
    category: 'easy',
    hint: '금속 + 산 → 염 + 수소',
  },
  // 중화 반응
  {
    reactants: ['Ca(OH)₂', 'CO₂'],
    products: ['CaCO₃', 'H₂O'],
    coefficients: [1, 1, 1, 1],
    category: 'easy',
    hint: '중화 반응',
  },
  {
    reactants: ['NaCl', 'AgNO₃'],
    products: ['AgCl', 'NaNO₃'],
    coefficients: [1, 1, 1, 1],
    category: 'easy',
    hint: '이중치환 (침전 생성)',
  },
  // 분해 반응
  {
    reactants: ['H₂O₂'],
    products: ['H₂O', 'O₂'],
    coefficients: [2, 2, 1],
    category: 'easy',
    hint: '분해 반응',
  },
  {
    reactants: ['CaCO₃'],
    products: ['CaO', 'CO₂'],
    coefficients: [1, 1, 1],
    category: 'easy',
    hint: '분해 반응',
  },
  // 합성 반응
  {
    reactants: ['Na₂O', 'H₂O'],
    products: ['NaOH'],
    coefficients: [1, 1, 2],
    category: 'easy',
    hint: '합성 반응',
  },
  {
    reactants: ['Fe', 'O₂'],
    products: ['FeO'],
    coefficients: [2, 1, 2],
    category: 'easy',
    hint: '금속 산화',
  },
  // 이중치환
  {
    reactants: ['Na₂CO₃', 'CaCl₂'],
    products: ['CaCO₃', 'NaCl'],
    coefficients: [1, 1, 1, 2],
    category: 'easy',
    hint: '이중치환 (침전 생성)',
  },
  {
    reactants: ['Na₂SO₄', 'BaCl₂'],
    products: ['BaSO₄', 'NaCl'],
    coefficients: [1, 1, 1, 2],
    category: 'easy',
    hint: '이중치환 (침전 생성)',
  },
  {
    reactants: ['AgNO₃', 'NaBr'],
    products: ['AgBr', 'NaNO₃'],
    coefficients: [1, 1, 1, 1],
    category: 'easy',
    hint: '이중치환 (침전 생성)',
  },
  // 단일치환
  {
    reactants: ['Na₂S', 'HCl'],
    products: ['NaCl', 'H₂S'],
    coefficients: [1, 2, 2, 1],
    category: 'easy',
    hint: '이중치환',
  },
  {
    reactants: ['Na', 'H₂O'],
    products: ['NaOH', 'H₂'],
    coefficients: [2, 2, 2, 1],
    category: 'easy',
    hint: '금속 + 물 반응',
  },
  {
    reactants: ['KClO₃'],
    products: ['KCl', 'O₂'],
    coefficients: [2, 2, 3],
    category: 'easy',
    hint: '분해 반응',
  },

  // === 중간 문제 (medium) - 15문항 ===
  {
    reactants: ['CuO', 'C'],
    products: ['Cu', 'CO₂'],
    coefficients: [2, 1, 2, 1],
    category: 'medium',
    hint: '금속 산화물 환원',
  },
  {
    reactants: ['Fe', 'O₂'],
    products: ['Fe₂O₃'],
    coefficients: [4, 3, 2],
    category: 'medium',
    hint: '금속 산화',
  },
  {
    reactants: ['NaHCO₃'],
    products: ['Na₂CO₃', 'H₂O', 'CO₂'],
    coefficients: [2, 1, 1, 1],
    category: 'medium',
    hint: '분해 반응',
  },
  {
    reactants: ['CaCO₃', 'HCl'],
    products: ['CaCl₂', 'CO₂', 'H₂O'],
    coefficients: [1, 2, 1, 1, 1],
    category: 'medium',
    hint: '탄산염 + 산',
  },
  {
    reactants: ['KI', 'Pb(NO₃)₂'],
    products: ['KNO₃', 'PbI₂'],
    coefficients: [2, 1, 2, 1],
    category: 'medium',
    hint: '이중치환 (침전 생성)',
  },
  {
    reactants: ['Fe₂O₃', 'CO'],
    products: ['Fe', 'CO₂'],
    coefficients: [1, 3, 2, 3],
    category: 'medium',
    hint: '금속 산화물 환원',
  },
  {
    reactants: ['Al', 'HCl'],
    products: ['AlCl₃', 'H₂'],
    coefficients: [2, 6, 2, 3],
    category: 'medium',
    hint: '금속 + 산',
  },
  {
    reactants: ['Ba(OH)₂', 'H₂SO₄'],
    products: ['BaSO₄', 'H₂O'],
    coefficients: [1, 1, 1, 2],
    category: 'medium',
    hint: '중화 반응',
  },
  {
    reactants: ['Pb(NO₃)₂', 'Na₂SO₄'],
    products: ['PbSO₄', 'NaNO₃'],
    coefficients: [1, 1, 1, 2],
    category: 'medium',
    hint: '이중치환 (침전 생성)',
  },
  {
    reactants: ['K₂CO₃', 'HNO₃'],
    products: ['KNO₃', 'H₂O', 'CO₂'],
    coefficients: [1, 2, 2, 1, 1],
    category: 'medium',
    hint: '탄산염 + 산',
  },
  {
    reactants: ['Fe₂O₃', 'H₂'],
    products: ['Fe', 'H₂O'],
    coefficients: [1, 3, 2, 3],
    category: 'medium',
    hint: '금속 산화물 환원',
  },
  {
    reactants: ['SO₂', 'O₂'],
    products: ['SO₃'],
    coefficients: [2, 1, 2],
    category: 'medium',
    hint: '합성 반응',
  },
  {
    reactants: ['P₄', 'O₂'],
    products: ['P₂O₅'],
    coefficients: [1, 5, 2],
    category: 'medium',
    hint: '비금속 산화',
  },
  {
    reactants: ['Ca', 'N₂'],
    products: ['Ca₃N₂'],
    coefficients: [3, 1, 1],
    category: 'medium',
    hint: '합성 반응',
  },
  {
    reactants: ['Na', 'O₂'],
    products: ['Na₂O'],
    coefficients: [4, 1, 2],
    category: 'medium',
    hint: '금속 산화',
  },

  // === 어려운 문제 (hard) - 15문항 ===
  {
    reactants: ['MnO₂', 'H₂O₂'],
    products: ['MnO₂', 'O₂', 'H₂O'],
    coefficients: [1, 2, 1, 1, 2],
    category: 'hard',
    hint: '촉매 반응 (MnO₂는 촉매)',
  },
  {
    reactants: ['NH₃', 'O₂'],
    products: ['NO', 'H₂O'],
    coefficients: [4, 5, 4, 6],
    category: 'hard',
    hint: '암모니아 산화',
  },
  {
    reactants: ['C₃H₈', 'O₂'],
    products: ['CO₂', 'H₂O'],
    coefficients: [1, 5, 3, 4],
    category: 'hard',
    hint: '연소 반응',
  },
  {
    reactants: ['C₂H₅OH', 'O₂'],
    products: ['CO₂', 'H₂O'],
    coefficients: [1, 3, 2, 3],
    category: 'hard',
    hint: '연소 반응',
  },
  {
    reactants: ['FeS₂', 'O₂'],
    products: ['Fe₂O₃', 'SO₂'],
    coefficients: [4, 11, 2, 8],
    category: 'hard',
    hint: '황철석 연소',
  },
  {
    reactants: ['Ca(OH)₂', 'H₃PO₄'],
    products: ['Ca₃(PO₄)₂', 'H₂O'],
    coefficients: [3, 2, 1, 6],
    category: 'hard',
    hint: '중화 반응',
  },
  {
    reactants: ['Al₂(SO₄)₃', 'Ca(OH)₂'],
    products: ['Al(OH)₃', 'CaSO₄'],
    coefficients: [1, 3, 2, 3],
    category: 'hard',
    hint: '이중치환',
  },
  {
    reactants: ['Cu', 'HNO₃'],
    products: ['Cu(NO₃)₂', 'NO₂', 'H₂O'],
    coefficients: [1, 4, 1, 2, 2],
    category: 'hard',
    hint: '금속 + 산화성 산',
  },
  {
    reactants: ['Mg₃N₂', 'H₂O'],
    products: ['Mg(OH)₂', 'NH₃'],
    coefficients: [1, 6, 3, 2],
    category: 'hard',
    hint: '질화물 + 물',
  },
  {
    reactants: ['(NH₄)₂CO₃'],
    products: ['NH₃', 'CO₂', 'H₂O'],
    coefficients: [1, 2, 1, 1],
    category: 'hard',
    hint: '분해 반응',
  },
  {
    reactants: ['NaOH', 'Cl₂'],
    products: ['NaCl', 'NaClO', 'H₂O'],
    coefficients: [2, 1, 1, 1, 1],
    category: 'hard',
    hint: '불균등화 반응',
  },
  {
    reactants: ['Fe', 'H₂O'],
    products: ['Fe₃O₄', 'H₂'],
    coefficients: [3, 4, 1, 4],
    category: 'hard',
    hint: '고온 반응',
  },
  {
    reactants: ['KMnO₄', 'HCl'],
    products: ['KCl', 'MnCl₂', 'Cl₂', 'H₂O'],
    coefficients: [2, 16, 2, 2, 5, 8],
    category: 'hard',
    hint: '산화-환원 반응',
  },
  {
    reactants: ['Ca₃(PO₄)₂', 'SiO₂', 'C'],
    products: ['P₄', 'CaSiO₃', 'CO'],
    coefficients: [2, 6, 10, 1, 6, 10],
    category: 'hard',
    hint: '인 제조',
  },
  {
    reactants: ['K₂Cr₂O₇', 'HCl'],
    products: ['KCl', 'CrCl₃', 'Cl₂', 'H₂O'],
    coefficients: [1, 14, 2, 2, 3, 7],
    category: 'hard',
    hint: '산화-환원 반응',
  },
];

// 카테고리별 반응 가져오기
export const getReactionsByCategory = (category: ReactionCategory): ChemicalReaction[] => {
  if (category === 'all') return reactions;
  return reactions.filter(r => r.category === category);
};

// 랜덤 반응 가져오기
export const getRandomReaction = (category: ReactionCategory = 'all'): ChemicalReaction => {
  const filtered = getReactionsByCategory(category);
  return filtered[Math.floor(Math.random() * filtered.length)];
};

// 반응식을 문자열로 변환 (계수 포함)
export const formatReactionWithCoefficients = (
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

// 반응식을 빈칸 형태로 변환
export const formatReactionWithBlanks = (reaction: ChemicalReaction): string => {
  const { reactants, products } = reaction;

  const reactantStr = reactants.map(r => `? ${r}`).join(' + ');
  const productStr = products.map(p => `? ${p}`).join(' + ');

  return `${reactantStr} → ${productStr}`;
};
