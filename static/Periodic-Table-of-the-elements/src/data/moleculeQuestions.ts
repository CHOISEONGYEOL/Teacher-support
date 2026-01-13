// 화학 반응식 분자 맞추기 데이터
// 7가지 반응 유형 템플릿 기반

export type MoleculeCategory = 'all' | 'decomposition' | 'metal-acid' | 'carbonate' | 'oxidation' | 'reduction' | 'precipitation' | 'combustion';

export interface MoleculeQuestion {
  // 반응식 (??는 빈칸)
  reaction: string;
  // 정답 분자
  answer: string;
  // 오답 보기들
  wrongOptions: string[];
  // 카테고리
  category: Exclude<MoleculeCategory, 'all'>;
  // 힌트 (반응 유형)
  hint: string;
}

// A. 과산화수소 분해 (촉매: MnO₂)
const decompositionQuestions: MoleculeQuestion[] = [
  {
    reaction: '2H₂O₂ → ?? + 2H₂O',
    answer: 'O₂',
    wrongOptions: ['H₂', 'CO₂', 'N₂'],
    category: 'decomposition',
    hint: '과산화수소 분해',
  },
  {
    reaction: '2H₂O₂ → O₂ + ??',
    answer: '2H₂O',
    wrongOptions: ['H₂O', 'H₂', '2H₂'],
    category: 'decomposition',
    hint: '과산화수소 분해',
  },
  {
    reaction: '?? → O₂ + 2H₂O',
    answer: '2H₂O₂',
    wrongOptions: ['H₂O₂', '2H₂O', 'H₂O'],
    category: 'decomposition',
    hint: '과산화수소 분해',
  },
  {
    reaction: '2KClO₃ → 2KCl + ??',
    answer: '3O₂',
    wrongOptions: ['O₂', '2O₂', 'O₃'],
    category: 'decomposition',
    hint: '염소산칼륨 분해',
  },
  {
    reaction: '2KClO₃ → ?? + 3O₂',
    answer: '2KCl',
    wrongOptions: ['KCl', 'KClO₃', '2KClO₃'],
    category: 'decomposition',
    hint: '염소산칼륨 분해',
  },
  {
    reaction: '?? → 2KCl + 3O₂',
    answer: '2KClO₃',
    wrongOptions: ['KClO₃', '2KCl', 'KCl'],
    category: 'decomposition',
    hint: '염소산칼륨 분해',
  },
  {
    reaction: '2H₂O → ?? + O₂',
    answer: '2H₂',
    wrongOptions: ['H₂', 'H₂O', '4H'],
    category: 'decomposition',
    hint: '물의 전기분해',
  },
  {
    reaction: '2H₂O → 2H₂ + ??',
    answer: 'O₂',
    wrongOptions: ['2O₂', 'O', '2O'],
    category: 'decomposition',
    hint: '물의 전기분해',
  },
];

// B. 금속 + 산 → 염 + 수소
const metalAcidQuestions: MoleculeQuestion[] = [
  {
    reaction: 'Zn + 2HCl → ZnCl₂ + ??',
    answer: 'H₂',
    wrongOptions: ['Cl₂', 'O₂', 'H₂O'],
    category: 'metal-acid',
    hint: '아연 + 염산',
  },
  {
    reaction: 'Zn + 2HCl → ?? + H₂',
    answer: 'ZnCl₂',
    wrongOptions: ['ZnCl', 'Zn₂Cl', 'ZnO'],
    category: 'metal-acid',
    hint: '아연 + 염산',
  },
  {
    reaction: '?? + 2HCl → ZnCl₂ + H₂',
    answer: 'Zn',
    wrongOptions: ['Fe', 'Cu', 'Mg'],
    category: 'metal-acid',
    hint: '아연 + 염산',
  },
  {
    reaction: 'Zn + ?? → ZnCl₂ + H₂',
    answer: '2HCl',
    wrongOptions: ['HCl', 'H₂SO₄', '2H₂SO₄'],
    category: 'metal-acid',
    hint: '아연 + 염산',
  },
  {
    reaction: 'Mg + 2HCl → MgCl₂ + ??',
    answer: 'H₂',
    wrongOptions: ['Cl₂', 'MgO', 'O₂'],
    category: 'metal-acid',
    hint: '마그네슘 + 염산',
  },
  {
    reaction: 'Mg + 2HCl → ?? + H₂',
    answer: 'MgCl₂',
    wrongOptions: ['MgCl', 'MgO', 'Mg₂Cl'],
    category: 'metal-acid',
    hint: '마그네슘 + 염산',
  },
  {
    reaction: '?? + 2HCl → MgCl₂ + H₂',
    answer: 'Mg',
    wrongOptions: ['Fe', 'Zn', 'Ca'],
    category: 'metal-acid',
    hint: '마그네슘 + 염산',
  },
  {
    reaction: 'Fe + H₂SO₄ → FeSO₄ + ??',
    answer: 'H₂',
    wrongOptions: ['SO₂', 'O₂', 'H₂O'],
    category: 'metal-acid',
    hint: '철 + 황산',
  },
  {
    reaction: 'Fe + H₂SO₄ → ?? + H₂',
    answer: 'FeSO₄',
    wrongOptions: ['Fe₂SO₄', 'FeO', 'FeCl₂'],
    category: 'metal-acid',
    hint: '철 + 황산',
  },
  {
    reaction: '?? + H₂SO₄ → FeSO₄ + H₂',
    answer: 'Fe',
    wrongOptions: ['Zn', 'Cu', 'Mg'],
    category: 'metal-acid',
    hint: '철 + 황산',
  },
  {
    reaction: '2Al + 6HCl → 2AlCl₃ + ??',
    answer: '3H₂',
    wrongOptions: ['H₂', '2H₂', '6H₂'],
    category: 'metal-acid',
    hint: '알루미늄 + 염산',
  },
  {
    reaction: '2Al + 6HCl → ?? + 3H₂',
    answer: '2AlCl₃',
    wrongOptions: ['AlCl₃', 'Al₂Cl₃', '3AlCl₃'],
    category: 'metal-acid',
    hint: '알루미늄 + 염산',
  },
];

// C. 탄산염 + 산 → 염 + 이산화탄소 + 물
const carbonateQuestions: MoleculeQuestion[] = [
  {
    reaction: 'CaCO₃ + 2HCl → CaCl₂ + ?? + H₂O',
    answer: 'CO₂',
    wrongOptions: ['O₂', 'CO', 'H₂'],
    category: 'carbonate',
    hint: '탄산칼슘 + 염산',
  },
  {
    reaction: 'CaCO₃ + 2HCl → CaCl₂ + CO₂ + ??',
    answer: 'H₂O',
    wrongOptions: ['2H₂O', 'H₂', 'O₂'],
    category: 'carbonate',
    hint: '탄산칼슘 + 염산',
  },
  {
    reaction: 'CaCO₃ + 2HCl → ?? + CO₂ + H₂O',
    answer: 'CaCl₂',
    wrongOptions: ['CaCl', 'Ca₂Cl', 'CaO'],
    category: 'carbonate',
    hint: '탄산칼슘 + 염산',
  },
  {
    reaction: '?? + 2HCl → CaCl₂ + CO₂ + H₂O',
    answer: 'CaCO₃',
    wrongOptions: ['CaO', 'Ca(OH)₂', 'CaCl₂'],
    category: 'carbonate',
    hint: '탄산칼슘 + 염산',
  },
  {
    reaction: 'Na₂CO₃ + 2HCl → 2NaCl + ?? + H₂O',
    answer: 'CO₂',
    wrongOptions: ['O₂', 'CO', 'Na₂O'],
    category: 'carbonate',
    hint: '탄산나트륨 + 염산',
  },
  {
    reaction: 'Na₂CO₃ + 2HCl → ?? + CO₂ + H₂O',
    answer: '2NaCl',
    wrongOptions: ['NaCl', 'Na₂Cl', 'NaCl₂'],
    category: 'carbonate',
    hint: '탄산나트륨 + 염산',
  },
  {
    reaction: '?? + 2HCl → 2NaCl + CO₂ + H₂O',
    answer: 'Na₂CO₃',
    wrongOptions: ['NaCO₃', 'NaHCO₃', 'Na₂O'],
    category: 'carbonate',
    hint: '탄산나트륨 + 염산',
  },
  {
    reaction: 'NaHCO₃ + HCl → NaCl + ?? + H₂O',
    answer: 'CO₂',
    wrongOptions: ['O₂', 'H₂', 'CO'],
    category: 'carbonate',
    hint: '탄산수소나트륨 + 염산',
  },
  {
    reaction: 'NaHCO₃ + HCl → ?? + CO₂ + H₂O',
    answer: 'NaCl',
    wrongOptions: ['NaCl₂', 'Na₂Cl', 'NaO'],
    category: 'carbonate',
    hint: '탄산수소나트륨 + 염산',
  },
];

// D. 금속 산화 (연소)
const oxidationQuestions: MoleculeQuestion[] = [
  {
    reaction: '2Mg + O₂ → ??',
    answer: '2MgO',
    wrongOptions: ['MgO', 'Mg₂O', 'MgO₂'],
    category: 'oxidation',
    hint: '마그네슘 연소',
  },
  {
    reaction: '?? + O₂ → 2MgO',
    answer: '2Mg',
    wrongOptions: ['Mg', 'MgO', '4Mg'],
    category: 'oxidation',
    hint: '마그네슘 연소',
  },
  {
    reaction: '2Mg + ?? → 2MgO',
    answer: 'O₂',
    wrongOptions: ['2O₂', 'O', '2O'],
    category: 'oxidation',
    hint: '마그네슘 연소',
  },
  {
    reaction: '4Fe + 3O₂ → ??',
    answer: '2Fe₂O₃',
    wrongOptions: ['Fe₂O₃', 'FeO', '4FeO'],
    category: 'oxidation',
    hint: '철의 산화',
  },
  {
    reaction: '?? + 3O₂ → 2Fe₂O₃',
    answer: '4Fe',
    wrongOptions: ['2Fe', 'Fe', '3Fe'],
    category: 'oxidation',
    hint: '철의 산화',
  },
  {
    reaction: '4Fe + ?? → 2Fe₂O₃',
    answer: '3O₂',
    wrongOptions: ['O₂', '2O₂', '6O₂'],
    category: 'oxidation',
    hint: '철의 산화',
  },
  {
    reaction: '2Cu + O₂ → ??',
    answer: '2CuO',
    wrongOptions: ['CuO', 'Cu₂O', 'CuO₂'],
    category: 'oxidation',
    hint: '구리의 산화',
  },
  {
    reaction: '?? + O₂ → 2CuO',
    answer: '2Cu',
    wrongOptions: ['Cu', '4Cu', 'CuO'],
    category: 'oxidation',
    hint: '구리의 산화',
  },
  {
    reaction: '4Al + 3O₂ → ??',
    answer: '2Al₂O₃',
    wrongOptions: ['Al₂O₃', 'AlO', '4AlO'],
    category: 'oxidation',
    hint: '알루미늄 산화',
  },
  {
    reaction: '?? + 3O₂ → 2Al₂O₃',
    answer: '4Al',
    wrongOptions: ['2Al', 'Al', '3Al'],
    category: 'oxidation',
    hint: '알루미늄 산화',
  },
];

// E. 산화물 환원
const reductionQuestions: MoleculeQuestion[] = [
  {
    reaction: 'CuO + H₂ → Cu + ??',
    answer: 'H₂O',
    wrongOptions: ['O₂', '2H₂O', 'H₂'],
    category: 'reduction',
    hint: '산화구리 환원',
  },
  {
    reaction: 'CuO + H₂ → ?? + H₂O',
    answer: 'Cu',
    wrongOptions: ['Cu₂', 'CuO', '2Cu'],
    category: 'reduction',
    hint: '산화구리 환원',
  },
  {
    reaction: '?? + H₂ → Cu + H₂O',
    answer: 'CuO',
    wrongOptions: ['Cu₂O', 'CuO₂', 'Cu'],
    category: 'reduction',
    hint: '산화구리 환원',
  },
  {
    reaction: 'CuO + ?? → Cu + H₂O',
    answer: 'H₂',
    wrongOptions: ['2H₂', 'O₂', 'CO'],
    category: 'reduction',
    hint: '산화구리 환원',
  },
  {
    reaction: 'Fe₂O₃ + 3CO → 2Fe + ??',
    answer: '3CO₂',
    wrongOptions: ['CO₂', '2CO₂', '6CO₂'],
    category: 'reduction',
    hint: '산화철 환원',
  },
  {
    reaction: 'Fe₂O₃ + 3CO → ?? + 3CO₂',
    answer: '2Fe',
    wrongOptions: ['Fe', '3Fe', 'Fe₂'],
    category: 'reduction',
    hint: '산화철 환원',
  },
  {
    reaction: '?? + 3CO → 2Fe + 3CO₂',
    answer: 'Fe₂O₃',
    wrongOptions: ['FeO', 'Fe₃O₄', '2FeO'],
    category: 'reduction',
    hint: '산화철 환원',
  },
  {
    reaction: 'Fe₂O₃ + ?? → 2Fe + 3CO₂',
    answer: '3CO',
    wrongOptions: ['CO', '2CO', '6CO'],
    category: 'reduction',
    hint: '산화철 환원',
  },
  {
    reaction: 'PbO + C → Pb + ??',
    answer: 'CO',
    wrongOptions: ['CO₂', 'O₂', 'C'],
    category: 'reduction',
    hint: '산화납 환원',
  },
  {
    reaction: 'PbO + C → ?? + CO',
    answer: 'Pb',
    wrongOptions: ['Pb₂', 'PbO', '2Pb'],
    category: 'reduction',
    hint: '산화납 환원',
  },
];

// F. 이중치환 (침전 반응)
const precipitationQuestions: MoleculeQuestion[] = [
  {
    reaction: 'AgNO₃ + NaCl → AgCl↓ + ??',
    answer: 'NaNO₃',
    wrongOptions: ['Na₂NO₃', 'NaCl', 'AgNO₃'],
    category: 'precipitation',
    hint: '염화은 침전',
  },
  {
    reaction: 'AgNO₃ + NaCl → ?? + NaNO₃',
    answer: 'AgCl↓',
    wrongOptions: ['AgCl₂', 'Ag₂Cl', 'AgNO₃'],
    category: 'precipitation',
    hint: '염화은 침전',
  },
  {
    reaction: '?? + NaCl → AgCl↓ + NaNO₃',
    answer: 'AgNO₃',
    wrongOptions: ['Ag₂NO₃', 'AgCl', 'AgO'],
    category: 'precipitation',
    hint: '염화은 침전',
  },
  {
    reaction: 'AgNO₃ + ?? → AgCl↓ + NaNO₃',
    answer: 'NaCl',
    wrongOptions: ['NaCl₂', 'Na₂Cl', 'KCl'],
    category: 'precipitation',
    hint: '염화은 침전',
  },
  {
    reaction: 'BaCl₂ + Na₂SO₄ → BaSO₄↓ + ??',
    answer: '2NaCl',
    wrongOptions: ['NaCl', 'NaCl₂', 'Na₂Cl'],
    category: 'precipitation',
    hint: '황산바륨 침전',
  },
  {
    reaction: 'BaCl₂ + Na₂SO₄ → ?? + 2NaCl',
    answer: 'BaSO₄↓',
    wrongOptions: ['BaSO₄', 'Ba₂SO₄', 'BaCl₂'],
    category: 'precipitation',
    hint: '황산바륨 침전',
  },
  {
    reaction: '?? + Na₂SO₄ → BaSO₄↓ + 2NaCl',
    answer: 'BaCl₂',
    wrongOptions: ['BaCl', 'Ba₂Cl', 'BaSO₄'],
    category: 'precipitation',
    hint: '황산바륨 침전',
  },
  {
    reaction: 'Pb(NO₃)₂ + 2KI → PbI₂↓ + ??',
    answer: '2KNO₃',
    wrongOptions: ['KNO₃', 'K₂NO₃', 'KI'],
    category: 'precipitation',
    hint: '아이오딘화납 침전',
  },
  {
    reaction: 'Pb(NO₃)₂ + 2KI → ?? + 2KNO₃',
    answer: 'PbI₂↓',
    wrongOptions: ['PbI', 'Pb₂I', 'PbNO₃'],
    category: 'precipitation',
    hint: '아이오딘화납 침전',
  },
];

// G. 연소 반응
const combustionQuestions: MoleculeQuestion[] = [
  {
    reaction: 'CH₄ + 2O₂ → CO₂ + ??',
    answer: '2H₂O',
    wrongOptions: ['H₂O', 'H₂', '4H₂O'],
    category: 'combustion',
    hint: '메탄 연소',
  },
  {
    reaction: 'CH₄ + 2O₂ → ?? + 2H₂O',
    answer: 'CO₂',
    wrongOptions: ['CO', '2CO₂', 'C'],
    category: 'combustion',
    hint: '메탄 연소',
  },
  {
    reaction: '?? + 2O₂ → CO₂ + 2H₂O',
    answer: 'CH₄',
    wrongOptions: ['C₂H₄', 'C₂H₆', 'CH₂'],
    category: 'combustion',
    hint: '메탄 연소',
  },
  {
    reaction: 'CH₄ + ?? → CO₂ + 2H₂O',
    answer: '2O₂',
    wrongOptions: ['O₂', '3O₂', '4O₂'],
    category: 'combustion',
    hint: '메탄 연소',
  },
  {
    reaction: 'C₃H₈ + 5O₂ → 3CO₂ + ??',
    answer: '4H₂O',
    wrongOptions: ['2H₂O', 'H₂O', '8H₂O'],
    category: 'combustion',
    hint: '프로판 연소',
  },
  {
    reaction: 'C₃H₈ + 5O₂ → ?? + 4H₂O',
    answer: '3CO₂',
    wrongOptions: ['CO₂', '2CO₂', '6CO₂'],
    category: 'combustion',
    hint: '프로판 연소',
  },
  {
    reaction: '?? + 5O₂ → 3CO₂ + 4H₂O',
    answer: 'C₃H₈',
    wrongOptions: ['CH₄', 'C₂H₆', 'C₄H₁₀'],
    category: 'combustion',
    hint: '프로판 연소',
  },
  {
    reaction: 'C₂H₅OH + 3O₂ → 2CO₂ + ??',
    answer: '3H₂O',
    wrongOptions: ['H₂O', '2H₂O', '6H₂O'],
    category: 'combustion',
    hint: '에탄올 연소',
  },
  {
    reaction: 'C₂H₅OH + 3O₂ → ?? + 3H₂O',
    answer: '2CO₂',
    wrongOptions: ['CO₂', '3CO₂', '4CO₂'],
    category: 'combustion',
    hint: '에탄올 연소',
  },
  {
    reaction: '?? + 3O₂ → 2CO₂ + 3H₂O',
    answer: 'C₂H₅OH',
    wrongOptions: ['CH₃OH', 'C₂H₆', 'C₃H₇OH'],
    category: 'combustion',
    hint: '에탄올 연소',
  },
  {
    reaction: '2C₂H₂ + 5O₂ → 4CO₂ + ??',
    answer: '2H₂O',
    wrongOptions: ['H₂O', '4H₂O', '5H₂O'],
    category: 'combustion',
    hint: '아세틸렌 연소',
  },
  {
    reaction: '2C₂H₂ + 5O₂ → ?? + 2H₂O',
    answer: '4CO₂',
    wrongOptions: ['2CO₂', 'CO₂', '8CO₂'],
    category: 'combustion',
    hint: '아세틸렌 연소',
  },
];

// 전체 질문 목록
export const allMoleculeQuestions: MoleculeQuestion[] = [
  ...decompositionQuestions,
  ...metalAcidQuestions,
  ...carbonateQuestions,
  ...oxidationQuestions,
  ...reductionQuestions,
  ...precipitationQuestions,
  ...combustionQuestions,
];

// 카테고리별 질문 가져오기
export const getMoleculeQuestionsByCategory = (category: MoleculeCategory): MoleculeQuestion[] => {
  if (category === 'all') {
    return allMoleculeQuestions;
  }
  return allMoleculeQuestions.filter(q => q.category === category);
};

// 카테고리 정보
export const moleculeCategoryInfo: Record<MoleculeCategory, { icon: string; title: string; description: string }> = {
  all: { icon: '🎯', title: '전체 문제', description: '모든 반응 유형이 랜덤으로 출제' },
  decomposition: { icon: '💨', title: '분해 반응', description: 'H₂O₂, KClO₃ 등의 분해' },
  'metal-acid': { icon: '⚗️', title: '금속 + 산', description: '금속과 산의 반응' },
  carbonate: { icon: '🫧', title: '탄산염 반응', description: '탄산염 + 산 → CO₂' },
  oxidation: { icon: '🔥', title: '산화 반응', description: '금속의 산화/연소' },
  reduction: { icon: '⬇️', title: '환원 반응', description: '산화물의 환원' },
  precipitation: { icon: '🧪', title: '침전 반응', description: '이중치환 침전 반응' },
  combustion: { icon: '💥', title: '연소 반응', description: '탄화수소 연소' },
};
