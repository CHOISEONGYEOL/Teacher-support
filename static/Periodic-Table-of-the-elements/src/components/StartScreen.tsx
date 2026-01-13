import type { GameMode, QuizCategory, TestQuestionCount, StudyTopic, FormulaCategory, CoefficientCategory, MoleculeCategory } from '../types';
import { moleculeCategoryInfo } from '../data/moleculeQuestions';

// 주제별 정보
const topicInfo: Record<StudyTopic, { icon: string; title: string; subtitle: string }> = {
  'periodic-table': {
    icon: '⚛️',
    title: '주기율표 퀴즈',
    subtitle: '원소 기호, 이름, 원자 번호, 원자가를 테스트해보세요!',
  },
  'molecule': {
    icon: '🧪',
    title: '화학 반응식 분자 맞추기',
    subtitle: '화학 반응식에서 분자를 맞춰보세요!',
  },
  'coefficient': {
    icon: '🔢',
    title: '화학 반응식 계수 맞추기',
    subtitle: '화학 반응식의 계수를 맞춰 균형을 잡아보세요!',
  },
  'formula-reading': {
    icon: '📖',
    title: '화학식 읽기',
    subtitle: '화학식을 읽고 이름을 맞춰보세요!',
  },
};

interface StartScreenProps {
  topic: StudyTopic;
  onSelectMode: (mode: GameMode) => void;
  onBack: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export const StartScreen = ({ topic, onSelectMode, onBack, isDarkMode, onToggleTheme }: StartScreenProps) => {
  const info = topicInfo[topic];

  return (
    <div className="start-screen">
      <button className="back-button" onClick={onBack}>
        ← 뒤로
      </button>
      <button className="theme-toggle" onClick={onToggleTheme} title={isDarkMode ? '라이트 모드' : '다크 모드'}>
        {isDarkMode ? '☀️' : '🌙'}
      </button>

      <div className="title-section">
        <div className="topic-badge">{info.icon}</div>
        <h1>{info.title}</h1>
        <p className="subtitle">{info.subtitle}</p>
      </div>

      <div className="mode-selection">
        <div className="mode-card practice-card" onClick={() => onSelectMode('practice')}>
          <div className="mode-icon">📚</div>
          <h2>연습 모드</h2>
          <p>플래시카드로 편하게 공부하기</p>
          <ul>
            <li>카드를 뒤집어 정답 확인</li>
            <li>시간 제한 없이 자유롭게!</li>
          </ul>
        </div>

        <div className="mode-card" onClick={() => onSelectMode('speed')}>
          <div className="mode-icon">⚡</div>
          <h2>스피드 모드</h2>
          <p>60초 안에 최대한 많이 맞추기</p>
          <ul>
            <li>연속 정답 시 콤보 보너스</li>
            <li>시간이 생명!</li>
          </ul>
        </div>

        <div className="mode-card" onClick={() => onSelectMode('survival')}>
          <div className="mode-icon">❤️</div>
          <h2>서바이벌 모드</h2>
          <p>목숨 3개로 얼마나 버틸 수 있을까?</p>
          <ul>
            <li>틀리면 목숨 1개 감소</li>
            <li>최장 연속 기록 도전!</li>
          </ul>
        </div>

        <div className="mode-card test-card" onClick={() => onSelectMode('test')}>
          <div className="mode-icon">📝</div>
          <h2>TEST 모드</h2>
          <p>실전처럼 시험 보기</p>
          <ul>
            <li>문항당 5초 제한</li>
            <li>100점 만점 환산</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

// 카테고리 정보
const categoryInfo: Record<QuizCategory, { icon: string; title: string; description: string }> = {
  all: { icon: '🎯', title: '전체 문제', description: '모든 유형이 랜덤으로 출제' },
  name: { icon: '📝', title: '원소 이름', description: '기호 ↔ 이름 맞추기' },
  number: { icon: '🔢', title: '원자 번호', description: '기호 ↔ 원자 번호 맞추기' },
  valence: { icon: '⚗️', title: '원자가', description: '기호 → 원자가 맞추기' },
};

interface CategorySelectProps {
  mode: GameMode;
  onSelectCategory: (category: QuizCategory) => void;
  onBack: () => void;
}

export const CategorySelect = ({ mode, onSelectCategory, onBack }: CategorySelectProps) => {
  const categories: QuizCategory[] = ['all', 'name', 'number', 'valence'];

  const getModeDisplay = () => {
    switch (mode) {
      case 'speed': return '⚡ 스피드 모드';
      case 'survival': return '❤️ 서바이벌 모드';
      case 'practice': return '📚 연습 모드';
      case 'test': return '📝 TEST 모드';
    }
  };

  const getTitle = () => {
    if (mode === 'practice') return '학습 유형 선택';
    if (mode === 'test') return '시험 유형 선택';
    return '퀴즈 유형 선택';
  };

  const getSubtitle = () => {
    if (mode === 'practice') return '어떤 내용을 공부할까요?';
    if (mode === 'test') return '어떤 유형을 시험 볼까요?';
    return '어떤 문제를 풀어볼까요?';
  };

  return (
    <div className="start-screen">
      <button className="back-button" onClick={onBack}>
        ← 뒤로
      </button>

      <div className="title-section">
        <div className="selected-mode">{getModeDisplay()}</div>
        <h1>{getTitle()}</h1>
        <p className="subtitle">{getSubtitle()}</p>
      </div>

      <div className="category-selection">
        {categories.map(cat => (
          <div
            key={cat}
            className="category-card"
            onClick={() => onSelectCategory(cat)}
          >
            <div className="category-icon">{categoryInfo[cat].icon}</div>
            <div className="category-info">
              <h3>{categoryInfo[cat].title}</h3>
              <p>{categoryInfo[cat].description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 테스트 모드 문항수 선택
interface QuestionCountSelectProps {
  category: QuizCategory;
  onSelectCount: (count: TestQuestionCount) => void;
  onBack: () => void;
}

export const QuestionCountSelect = ({ category, onSelectCount, onBack }: QuestionCountSelectProps) => {
  const counts: TestQuestionCount[] = [5, 10, 15, 20];

  return (
    <div className="start-screen">
      <button className="back-button" onClick={onBack}>
        ← 뒤로
      </button>

      <div className="title-section">
        <div className="selected-mode">📝 TEST 모드</div>
        <div className="selected-category">{categoryInfo[category].icon} {categoryInfo[category].title}</div>
        <h1>문항 수 선택</h1>
        <p className="subtitle">몇 문제를 풀어볼까요?</p>
      </div>

      <div className="count-selection">
        {counts.map(count => (
          <div
            key={count}
            className="count-card"
            onClick={() => onSelectCount(count)}
          >
            <div className="count-number">{count}</div>
            <div className="count-info">
              <span className="count-label">문제</span>
              <span className="count-time">{count * 5}초</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 화학식 읽기 카테고리 정보
const formulaCategoryInfo: Record<FormulaCategory, { icon: string; title: string; description: string }> = {
  all: { icon: '🎯', title: '전체 문제', description: '모든 화학식이 랜덤으로 출제' },
  basic: { icon: '💨', title: '기본 분자', description: 'H₂, O₂, N₂ 등 기본 기체' },
  inorganic: { icon: '🧪', title: '무기 화합물', description: '산, 염기, 염 등' },
  organic: { icon: '🌿', title: '유기 화합물', description: '탄화수소, 알코올 등' },
};

// 화학식 카테고리 선택
interface FormulaCategorySelectProps {
  mode: GameMode;
  onSelectCategory: (category: FormulaCategory) => void;
  onBack: () => void;
}

export const FormulaCategorySelect = ({ mode, onSelectCategory, onBack }: FormulaCategorySelectProps) => {
  const categories: FormulaCategory[] = ['all', 'basic', 'inorganic', 'organic'];

  const getModeDisplay = () => {
    switch (mode) {
      case 'speed': return '⚡ 스피드 모드';
      case 'survival': return '❤️ 서바이벌 모드';
      case 'practice': return '📚 연습 모드';
      case 'test': return '📝 TEST 모드';
    }
  };

  const getTitle = () => {
    if (mode === 'practice') return '학습 유형 선택';
    if (mode === 'test') return '시험 유형 선택';
    return '퀴즈 유형 선택';
  };

  const getSubtitle = () => {
    if (mode === 'practice') return '어떤 화학식을 공부할까요?';
    if (mode === 'test') return '어떤 유형을 시험 볼까요?';
    return '어떤 화학식을 풀어볼까요?';
  };

  return (
    <div className="start-screen">
      <button className="back-button" onClick={onBack}>
        ← 뒤로
      </button>

      <div className="title-section">
        <div className="selected-mode">{getModeDisplay()}</div>
        <h1>{getTitle()}</h1>
        <p className="subtitle">{getSubtitle()}</p>
      </div>

      <div className="category-selection">
        {categories.map(cat => (
          <div
            key={cat}
            className="category-card"
            onClick={() => onSelectCategory(cat)}
          >
            <div className="category-icon">{formulaCategoryInfo[cat].icon}</div>
            <div className="category-info">
              <h3>{formulaCategoryInfo[cat].title}</h3>
              <p>{formulaCategoryInfo[cat].description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 화학식 테스트 모드 문항수 선택
interface FormulaQuestionCountSelectProps {
  category: FormulaCategory;
  onSelectCount: (count: TestQuestionCount) => void;
  onBack: () => void;
}

export const FormulaQuestionCountSelect = ({ category, onSelectCount, onBack }: FormulaQuestionCountSelectProps) => {
  const counts: TestQuestionCount[] = [5, 10, 15, 20];

  return (
    <div className="start-screen">
      <button className="back-button" onClick={onBack}>
        ← 뒤로
      </button>

      <div className="title-section">
        <div className="selected-mode">📝 TEST 모드</div>
        <div className="selected-category">{formulaCategoryInfo[category].icon} {formulaCategoryInfo[category].title}</div>
        <h1>문항 수 선택</h1>
        <p className="subtitle">몇 문제를 풀어볼까요?</p>
      </div>

      <div className="count-selection">
        {counts.map(count => (
          <div
            key={count}
            className="count-card"
            onClick={() => onSelectCount(count)}
          >
            <div className="count-number">{count}</div>
            <div className="count-info">
              <span className="count-label">문제</span>
              <span className="count-time">{count * 5}초</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 계수 맞추기 카테고리 정보
const coefficientCategoryInfo: Record<CoefficientCategory, { icon: string; title: string; description: string }> = {
  all: { icon: '🎯', title: '전체 문제', description: '모든 난이도가 랜덤으로 출제' },
  easy: { icon: '🌱', title: '쉬움', description: '기본적인 반응식' },
  medium: { icon: '🌿', title: '보통', description: '중급 난이도 반응식' },
  hard: { icon: '🔥', title: '어려움', description: '복잡한 산화-환원 반응 등' },
};

// 계수 카테고리 선택
interface CoefficientCategorySelectProps {
  mode: GameMode;
  onSelectCategory: (category: CoefficientCategory) => void;
  onBack: () => void;
}

export const CoefficientCategorySelect = ({ mode, onSelectCategory, onBack }: CoefficientCategorySelectProps) => {
  const categories: CoefficientCategory[] = ['all', 'easy', 'medium', 'hard'];

  const getModeDisplay = () => {
    switch (mode) {
      case 'speed': return '⚡ 스피드 모드';
      case 'survival': return '❤️ 서바이벌 모드';
      case 'practice': return '📚 연습 모드';
      case 'test': return '📝 TEST 모드';
    }
  };

  const getTitle = () => {
    if (mode === 'practice') return '난이도 선택';
    if (mode === 'test') return '시험 난이도 선택';
    return '퀴즈 난이도 선택';
  };

  const getSubtitle = () => {
    if (mode === 'practice') return '어떤 난이도로 공부할까요?';
    if (mode === 'test') return '어떤 난이도를 시험 볼까요?';
    return '어떤 난이도로 풀어볼까요?';
  };

  return (
    <div className="start-screen">
      <button className="back-button" onClick={onBack}>
        ← 뒤로
      </button>

      <div className="title-section">
        <div className="selected-mode">{getModeDisplay()}</div>
        <h1>{getTitle()}</h1>
        <p className="subtitle">{getSubtitle()}</p>
      </div>

      <div className="category-selection">
        {categories.map(cat => (
          <div
            key={cat}
            className="category-card"
            onClick={() => onSelectCategory(cat)}
          >
            <div className="category-icon">{coefficientCategoryInfo[cat].icon}</div>
            <div className="category-info">
              <h3>{coefficientCategoryInfo[cat].title}</h3>
              <p>{coefficientCategoryInfo[cat].description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 계수 테스트 모드 문항수 선택
interface CoefficientQuestionCountSelectProps {
  category: CoefficientCategory;
  onSelectCount: (count: TestQuestionCount) => void;
  onBack: () => void;
}

export const CoefficientQuestionCountSelect = ({ category, onSelectCount, onBack }: CoefficientQuestionCountSelectProps) => {
  const counts: TestQuestionCount[] = [5, 10, 15, 20];

  return (
    <div className="start-screen">
      <button className="back-button" onClick={onBack}>
        ← 뒤로
      </button>

      <div className="title-section">
        <div className="selected-mode">📝 TEST 모드</div>
        <div className="selected-category">{coefficientCategoryInfo[category].icon} {coefficientCategoryInfo[category].title}</div>
        <h1>문항 수 선택</h1>
        <p className="subtitle">몇 문제를 풀어볼까요?</p>
      </div>

      <div className="count-selection">
        {counts.map(count => (
          <div
            key={count}
            className="count-card"
            onClick={() => onSelectCount(count)}
          >
            <div className="count-number">{count}</div>
            <div className="count-info">
              <span className="count-label">문제</span>
              <span className="count-time">{count * 15}초</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 분자 맞추기 카테고리 선택
interface MoleculeCategorySelectProps {
  mode: GameMode;
  onSelectCategory: (category: MoleculeCategory) => void;
  onBack: () => void;
}

export const MoleculeCategorySelect = ({ mode, onSelectCategory, onBack }: MoleculeCategorySelectProps) => {
  const categories: MoleculeCategory[] = ['all', 'decomposition', 'metal-acid', 'carbonate', 'oxidation', 'reduction', 'precipitation', 'combustion'];

  const getModeDisplay = () => {
    switch (mode) {
      case 'speed': return '⚡ 스피드 모드';
      case 'survival': return '❤️ 서바이벌 모드';
      case 'practice': return '📚 연습 모드';
      case 'test': return '📝 TEST 모드';
    }
  };

  const getTitle = () => {
    if (mode === 'practice') return '반응 유형 선택';
    if (mode === 'test') return '시험 유형 선택';
    return '퀴즈 유형 선택';
  };

  const getSubtitle = () => {
    if (mode === 'practice') return '어떤 반응을 공부할까요?';
    if (mode === 'test') return '어떤 유형을 시험 볼까요?';
    return '어떤 반응을 풀어볼까요?';
  };

  return (
    <div className="start-screen">
      <button className="back-button" onClick={onBack}>
        ← 뒤로
      </button>

      <div className="title-section">
        <div className="selected-mode">{getModeDisplay()}</div>
        <h1>{getTitle()}</h1>
        <p className="subtitle">{getSubtitle()}</p>
      </div>

      <div className="category-selection molecule-category-selection">
        {categories.map(cat => (
          <div
            key={cat}
            className="category-card"
            onClick={() => onSelectCategory(cat)}
          >
            <div className="category-icon">{moleculeCategoryInfo[cat].icon}</div>
            <div className="category-info">
              <h3>{moleculeCategoryInfo[cat].title}</h3>
              <p>{moleculeCategoryInfo[cat].description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 분자 테스트 모드 문항수 선택
interface MoleculeQuestionCountSelectProps {
  category: MoleculeCategory;
  onSelectCount: (count: TestQuestionCount) => void;
  onBack: () => void;
}

export const MoleculeQuestionCountSelect = ({ category, onSelectCount, onBack }: MoleculeQuestionCountSelectProps) => {
  const counts: TestQuestionCount[] = [5, 10, 15, 20];

  return (
    <div className="start-screen">
      <button className="back-button" onClick={onBack}>
        ← 뒤로
      </button>

      <div className="title-section">
        <div className="selected-mode">📝 TEST 모드</div>
        <div className="selected-category">{moleculeCategoryInfo[category].icon} {moleculeCategoryInfo[category].title}</div>
        <h1>문항 수 선택</h1>
        <p className="subtitle">몇 문제를 풀어볼까요?</p>
      </div>

      <div className="count-selection">
        {counts.map(count => (
          <div
            key={count}
            className="count-card"
            onClick={() => onSelectCount(count)}
          >
            <div className="count-number">{count}</div>
            <div className="count-info">
              <span className="count-label">문제</span>
              <span className="count-time">{count * 5}초</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
