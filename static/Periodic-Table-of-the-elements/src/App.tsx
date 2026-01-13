import { useState, useEffect, useCallback, useRef } from 'react';
import type { GameMode, QuizCategory, Question, TestQuestionCount, StudyTopic, FormulaCategory, CoefficientCategory, MoleculeCategory } from './types';
import { useGame } from './hooks/useGame';
import { useTimer } from './hooks/useTimer';
import { useSound } from './hooks/useSound';
import { generateQuestion } from './utils/questionGenerator';
import { generateFormulaQuestion, type FormulaQuestion } from './utils/formulaQuestionGenerator';
import { generateMoleculeQuestion, type MoleculeQuizQuestion } from './utils/moleculeQuestionGenerator';
import { generateCoefficientQuestion, type CoefficientQuizQuestion } from './utils/coefficientQuestionGenerator';
import type { CompoundCategory } from './data/compounds';
import type { ReactionCategory, ChemicalReaction } from './data/reactions';
import { getRandomReaction } from './data/reactions';
import type { MoleculeQuestion } from './data/moleculeQuestions';
import { LandingPage } from './components/LandingPage';
import { StartScreen, CategorySelect, QuestionCountSelect, FormulaCategorySelect, FormulaQuestionCountSelect, CoefficientCategorySelect, CoefficientQuestionCountSelect, MoleculeCategorySelect, MoleculeQuestionCountSelect } from './components/StartScreen';
import { Quiz } from './components/Quiz';
import { Timer } from './components/Timer';
import { Lives } from './components/Lives';
import { Score } from './components/Score';
import { Result } from './components/Result';
import { FlashCard } from './components/FlashCard';
import { FormulaFlashCard } from './components/FormulaFlashCard';
import { CoefficientQuiz } from './components/CoefficientQuiz';
import { CoefficientFlashCard } from './components/CoefficientFlashCard';
import { MoleculeQuiz } from './components/MoleculeQuiz';
import { MoleculeFlashCard } from './components/MoleculeFlashCard';
import './App.css';

type Screen = 'landing' | 'start' | 'category' | 'questionCount' | 'game' | 'test' | 'practice' | 'result' | 'testResult'
  | 'formulaCategory' | 'formulaQuestionCount' | 'formulaGame' | 'formulaTest' | 'formulaPractice' | 'formulaResult' | 'formulaTestResult'
  | 'coefficientCategory' | 'coefficientQuestionCount' | 'coefficientGame' | 'coefficientTest' | 'coefficientPractice' | 'coefficientResult' | 'coefficientTestResult'
  | 'moleculeCategory' | 'moleculeQuestionCount' | 'moleculeGame' | 'moleculeTest' | 'moleculePractice' | 'moleculeResult' | 'moleculeTestResult';

const SPEED_MODE_TIME = 60;
const TEST_QUESTION_TIME = 5;

function App() {
  const [screen, setScreen] = useState<Screen>('landing');
  const [selectedTopic, setSelectedTopic] = useState<StudyTopic>('periodic-table');
  const [selectedMode, setSelectedMode] = useState<GameMode>('speed');
  const [selectedCategory, setSelectedCategory] = useState<QuizCategory>('all');
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [practiceCard, setPracticeCard] = useState<Question | null>(null);
  const [practiceCardNumber, setPracticeCardNumber] = useState(1);

  // 화학식 읽기 상태
  const [selectedFormulaCategory, setSelectedFormulaCategory] = useState<FormulaCategory>('all');
  const [formulaPracticeCard, setFormulaPracticeCard] = useState<FormulaQuestion | null>(null);
  const [formulaPracticeCardNumber, setFormulaPracticeCardNumber] = useState(1);
  const [formulaQuestions, setFormulaQuestions] = useState<FormulaQuestion[]>([]);
  const [formulaCurrentIndex, setFormulaCurrentIndex] = useState(0);
  const [formulaCorrectCount, setFormulaCorrectCount] = useState(0);
  const [formulaTimeLeft, setFormulaTimeLeft] = useState(TEST_QUESTION_TIME);
  const [formulaTotalQuestions, setFormulaTotalQuestions] = useState<TestQuestionCount>(10);
  const formulaTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [formulaScore, setFormulaScore] = useState(0);
  const [formulaCombo, setFormulaCombo] = useState(0);
  const [formulaMaxCombo, setFormulaMaxCombo] = useState(0);
  const [formulaLives, setFormulaLives] = useState(3);
  const [formulaWrongCount, setFormulaWrongCount] = useState(0);
  const [formulaCurrentQuestion, setFormulaCurrentQuestion] = useState<FormulaQuestion | null>(null);

  // 계수 맞추기 상태
  const [selectedCoefficientCategory, setSelectedCoefficientCategory] = useState<CoefficientCategory>('all');
  const [coefficientPracticeReaction, setCoefficientPracticeReaction] = useState<ChemicalReaction | null>(null);
  const [coefficientPracticeNumber, setCoefficientPracticeNumber] = useState(1);
  const [coefficientQuestions, setCoefficientQuestions] = useState<CoefficientQuizQuestion[]>([]);
  const [coefficientCurrentIndex, setCoefficientCurrentIndex] = useState(0);
  const [coefficientCorrectCount, setCoefficientCorrectCount] = useState(0);
  const [coefficientTimeLeft, setCoefficientTimeLeft] = useState(TEST_QUESTION_TIME);
  const [coefficientTotalQuestions, setCoefficientTotalQuestions] = useState<TestQuestionCount>(10);
  const coefficientTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [coefficientScore, setCoefficientScore] = useState(0);
  const [coefficientCombo, setCoefficientCombo] = useState(0);
  const [coefficientMaxCombo, setCoefficientMaxCombo] = useState(0);
  const [coefficientLives, setCoefficientLives] = useState(3);
  const [coefficientWrongCount, setCoefficientWrongCount] = useState(0);
  const [coefficientCurrentQuestion, setCoefficientCurrentQuestion] = useState<CoefficientQuizQuestion | null>(null);

  // 분자 맞추기 상태
  const [selectedMoleculeCategory, setSelectedMoleculeCategory] = useState<MoleculeCategory>('all');
  const [moleculePracticeCard, setMoleculePracticeCard] = useState<MoleculeQuestion | null>(null);
  const [moleculePracticeCardNumber, setMoleculePracticeCardNumber] = useState(1);
  const [moleculeQuestions, setMoleculeQuestions] = useState<MoleculeQuizQuestion[]>([]);
  const [moleculeCurrentIndex, setMoleculeCurrentIndex] = useState(0);
  const [moleculeCorrectCount, setMoleculeCorrectCount] = useState(0);
  const [moleculeTimeLeft, setMoleculeTimeLeft] = useState(TEST_QUESTION_TIME);
  const [moleculeTotalQuestions, setMoleculeTotalQuestions] = useState<TestQuestionCount>(10);
  const moleculeTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [moleculeScore, setMoleculeScore] = useState(0);
  const [moleculeCombo, setMoleculeCombo] = useState(0);
  const [moleculeMaxCombo, setMoleculeMaxCombo] = useState(0);
  const [moleculeLives, setMoleculeLives] = useState(3);
  const [moleculeWrongCount, setMoleculeWrongCount] = useState(0);
  const [moleculeCurrentQuestion, setMoleculeCurrentQuestion] = useState<MoleculeQuizQuestion | null>(null);

  // 테마 상태
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'dark';
  });

  // 테마 적용
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const handleToggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  // TEST 모드 상태
  const [testQuestions, setTestQuestions] = useState<Question[]>([]);
  const [testCurrentIndex, setTestCurrentIndex] = useState(0);
  const [testCorrectCount, setTestCorrectCount] = useState(0);
  const [testTimeLeft, setTestTimeLeft] = useState(TEST_QUESTION_TIME);
  const [testTotalQuestions, setTestTotalQuestions] = useState<TestQuestionCount>(10);
  const testTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const { gameState, startGame, submitAnswer, nextQuestion, useHint, endGame, resetGame } = useGame();
  const { playSound } = useSound();

  const handleTimeUp = useCallback(() => {
    // 화학식 읽기 스피드 모드인 경우
    if (selectedTopic === 'formula-reading') {
      playSound('gameOver');
      setScreen('formulaResult');
    } else if (selectedTopic === 'coefficient') {
      playSound('gameOver');
      setScreen('coefficientResult');
    } else if (selectedTopic === 'molecule') {
      playSound('gameOver');
      setScreen('moleculeResult');
    } else {
      endGame();
      playSound('gameOver');
      setScreen('result');
    }
  }, [endGame, playSound, selectedTopic]);

  const { timeLeft, start: startTimer, reset: resetTimer } = useTimer(
    SPEED_MODE_TIME,
    handleTimeUp
  );

  // 주제 선택 -> 모드 선택 화면으로
  const handleSelectTopic = (topic: StudyTopic) => {
    setSelectedTopic(topic);
    setScreen('start');
  };

  // 모드 선택 -> 카테고리 선택 화면으로
  const handleSelectMode = (mode: GameMode) => {
    setSelectedMode(mode);
    // 주제에 따라 다른 카테고리 선택 화면으로
    if (selectedTopic === 'formula-reading') {
      setScreen('formulaCategory');
    } else if (selectedTopic === 'coefficient') {
      setScreen('coefficientCategory');
    } else if (selectedTopic === 'molecule') {
      setScreen('moleculeCategory');
    } else {
      setScreen('category');
    }
  };

  // 카테고리 선택
  const handleSelectCategory = (category: QuizCategory) => {
    setSelectedCategory(category);

    if (selectedMode === 'practice') {
      // 연습 모드: 플래시카드 시작
      setPracticeCard(generateQuestion(category));
      setPracticeCardNumber(1);
      setScreen('practice');
    } else if (selectedMode === 'test') {
      // TEST 모드: 문항수 선택 화면으로
      setScreen('questionCount');
    } else {
      // 퀴즈 모드: 게임 시작
      startGame(selectedMode, category);
      setScreen('game');
      setFeedback(null);

      if (selectedMode === 'speed') {
        resetTimer(SPEED_MODE_TIME);
        startTimer();
      }
    }
  };

  // TEST 모드: 문항수 선택 -> 테스트 시작
  const handleSelectQuestionCount = (count: TestQuestionCount) => {
    setTestTotalQuestions(count);

    // 문제 생성
    const questions: Question[] = [];
    for (let i = 0; i < count; i++) {
      questions.push(generateQuestion(selectedCategory));
    }
    setTestQuestions(questions);
    setTestCurrentIndex(0);
    setTestCorrectCount(0);
    setTestTimeLeft(TEST_QUESTION_TIME);
    setFeedback(null);
    setScreen('test');
  };

  // TEST 모드 타이머
  useEffect(() => {
    if (screen !== 'test' || feedback !== null) return;

    testTimerRef.current = setInterval(() => {
      setTestTimeLeft(prev => {
        if (prev <= 1) {
          // 시간 초과 - 오답 처리
          clearInterval(testTimerRef.current!);
          handleTestTimeout();
          return TEST_QUESTION_TIME;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (testTimerRef.current) clearInterval(testTimerRef.current);
    };
  }, [screen, testCurrentIndex, feedback]);

  // 화학식 TEST 모드 타이머
  useEffect(() => {
    if (screen !== 'formulaTest' || feedback !== null) return;

    formulaTimerRef.current = setInterval(() => {
      setFormulaTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(formulaTimerRef.current!);
          handleFormulaTestTimeout();
          return TEST_QUESTION_TIME;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (formulaTimerRef.current) clearInterval(formulaTimerRef.current);
    };
  }, [screen, formulaCurrentIndex, feedback]);

  // TEST 모드: 시간 초과 처리
  const handleTestTimeout = () => {
    playSound('wrong');
    setFeedback('wrong');

    setTimeout(() => {
      moveToNextTestQuestion();
    }, 800);
  };

  // TEST 모드: 답변 처리
  const handleTestAnswer = (answer: string) => {
    if (feedback !== null) return;

    if (testTimerRef.current) clearInterval(testTimerRef.current);

    const currentQuestion = testQuestions[testCurrentIndex];
    const isCorrect = answer === currentQuestion.correctAnswer;

    setFeedback(isCorrect ? 'correct' : 'wrong');

    if (isCorrect) {
      setTestCorrectCount(prev => prev + 1);
      playSound('correct');
    } else {
      playSound('wrong');
    }

    setTimeout(() => {
      moveToNextTestQuestion();
    }, 800);
  };

  // TEST 모드: 다음 문제로 이동
  const moveToNextTestQuestion = () => {
    setFeedback(null);

    if (testCurrentIndex + 1 >= testTotalQuestions) {
      // 테스트 종료
      playSound('gameOver');
      setScreen('testResult');
    } else {
      setTestCurrentIndex(prev => prev + 1);
      setTestTimeLeft(TEST_QUESTION_TIME);
    }
  };

  // 연습 모드: 다음 카드
  const handleNextCard = () => {
    setPracticeCard(generateQuestion(selectedCategory));
    setPracticeCardNumber(prev => prev + 1);
  };

  // 연습 모드: 홈으로 돌아가기
  const handlePracticeBack = () => {
    setPracticeCard(null);
    setPracticeCardNumber(1);
    setScreen('start');
  };

  // 뒤로가기 (모드 선택 -> 랜딩)
  const handleBackToLanding = () => {
    setScreen('landing');
  };

  // 뒤로가기 (카테고리 -> 모드 선택)
  const handleBackToModeSelect = () => {
    setScreen('start');
  };

  // 뒤로가기 (문항수 선택 -> 카테고리 선택)
  const handleBackToCategory = () => {
    setScreen('category');
  };

  // === 화학식 읽기 관련 핸들러 ===

  // 화학식 카테고리 선택
  const handleSelectFormulaCategory = (category: FormulaCategory) => {
    setSelectedFormulaCategory(category);
    const compoundCategory = category as CompoundCategory;

    if (selectedMode === 'practice') {
      // 연습 모드: 플래시카드 시작
      setFormulaPracticeCard(generateFormulaQuestion(compoundCategory));
      setFormulaPracticeCardNumber(1);
      setScreen('formulaPractice');
    } else if (selectedMode === 'test') {
      // TEST 모드: 문항수 선택 화면으로
      setScreen('formulaQuestionCount');
    } else {
      // 스피드/서바이벌 모드
      startFormulaGame(compoundCategory);
    }
  };

  // 화학식 게임 시작
  const startFormulaGame = (category: CompoundCategory) => {
    setFormulaScore(0);
    setFormulaCombo(0);
    setFormulaMaxCombo(0);
    setFormulaLives(3);
    setFormulaCorrectCount(0);
    setFormulaWrongCount(0);
    setFormulaCurrentQuestion(generateFormulaQuestion(category));
    setScreen('formulaGame');
    setFeedback(null);

    if (selectedMode === 'speed') {
      resetTimer(SPEED_MODE_TIME);
      startTimer();
    }
  };

  // 화학식 TEST 모드: 문항수 선택
  const handleSelectFormulaQuestionCount = (count: TestQuestionCount) => {
    setFormulaTotalQuestions(count);
    const compoundCategory = selectedFormulaCategory as CompoundCategory;

    const questions: FormulaQuestion[] = [];
    for (let i = 0; i < count; i++) {
      questions.push(generateFormulaQuestion(compoundCategory));
    }
    setFormulaQuestions(questions);
    setFormulaCurrentIndex(0);
    setFormulaCorrectCount(0);
    setFormulaTimeLeft(TEST_QUESTION_TIME);
    setFeedback(null);
    setScreen('formulaTest');
  };

  // 화학식 연습 모드: 다음 카드
  const handleNextFormulaCard = () => {
    const compoundCategory = selectedFormulaCategory as CompoundCategory;
    setFormulaPracticeCard(generateFormulaQuestion(compoundCategory));
    setFormulaPracticeCardNumber(prev => prev + 1);
  };

  // 화학식 연습 모드: 뒤로가기
  const handleFormulaPracticeBack = () => {
    setFormulaPracticeCard(null);
    setFormulaPracticeCardNumber(1);
    setScreen('start');
  };

  // 화학식 카테고리 -> 모드 선택으로 뒤로가기
  const handleBackToModeSelectFromFormula = () => {
    setScreen('start');
  };

  // 화학식 문항수 -> 카테고리로 뒤로가기
  const handleBackToFormulaCategory = () => {
    setScreen('formulaCategory');
  };

  // 화학식 게임 답변 처리
  const handleFormulaAnswer = (answer: string) => {
    if (!formulaCurrentQuestion) return;

    const isCorrect = answer === formulaCurrentQuestion.correctAnswer;
    setFeedback(isCorrect ? 'correct' : 'wrong');

    if (isCorrect) {
      const newCombo = formulaCombo + 1;
      setFormulaCombo(newCombo);
      if (newCombo > formulaMaxCombo) setFormulaMaxCombo(newCombo);
      setFormulaCorrectCount(prev => prev + 1);

      const comboBonus = newCombo >= 5 ? 50 : newCombo >= 3 ? 25 : 0;
      setFormulaScore(prev => prev + 100 + comboBonus);

      if (newCombo >= 3) {
        playSound('combo');
      } else {
        playSound('correct');
      }
    } else {
      setFormulaCombo(0);
      setFormulaWrongCount(prev => prev + 1);
      if (selectedMode === 'survival') {
        setFormulaLives(prev => prev - 1);
      }
      playSound('wrong');
    }

    setTimeout(() => {
      setFeedback(null);

      // 서바이벌 모드 게임오버 체크
      if (selectedMode === 'survival' && formulaLives <= 1 && !isCorrect) {
        playSound('gameOver');
        setScreen('formulaResult');
      } else {
        const compoundCategory = selectedFormulaCategory as CompoundCategory;
        setFormulaCurrentQuestion(generateFormulaQuestion(compoundCategory));
      }
    }, 800);
  };

  // 화학식 TEST 모드: 답변 처리
  const handleFormulaTestAnswer = (answer: string) => {
    if (feedback !== null) return;

    if (formulaTimerRef.current) clearInterval(formulaTimerRef.current);

    const currentQuestion = formulaQuestions[formulaCurrentIndex];
    const isCorrect = answer === currentQuestion.correctAnswer;

    setFeedback(isCorrect ? 'correct' : 'wrong');

    if (isCorrect) {
      setFormulaCorrectCount(prev => prev + 1);
      playSound('correct');
    } else {
      playSound('wrong');
    }

    setTimeout(() => {
      moveToNextFormulaTestQuestion();
    }, 800);
  };

  // 화학식 TEST 모드: 다음 문제로
  const moveToNextFormulaTestQuestion = () => {
    setFeedback(null);

    if (formulaCurrentIndex + 1 >= formulaTotalQuestions) {
      playSound('gameOver');
      setScreen('formulaTestResult');
    } else {
      setFormulaCurrentIndex(prev => prev + 1);
      setFormulaTimeLeft(TEST_QUESTION_TIME);
    }
  };

  // 화학식 TEST 모드: 시간 초과
  const handleFormulaTestTimeout = () => {
    playSound('wrong');
    setFeedback('wrong');

    setTimeout(() => {
      moveToNextFormulaTestQuestion();
    }, 800);
  };

  // 화학식 게임 재시작
  const handleFormulaRestart = () => {
    const compoundCategory = selectedFormulaCategory as CompoundCategory;
    if (selectedMode === 'test') {
      handleSelectFormulaQuestionCount(formulaTotalQuestions);
    } else {
      startFormulaGame(compoundCategory);
    }
  };

  // 화학식 TEST 재시작
  const handleFormulaTestRestart = () => {
    handleSelectFormulaQuestionCount(formulaTotalQuestions);
  };

  // === 계수 맞추기 관련 핸들러 ===

  // 계수 카테고리 선택
  const handleSelectCoefficientCategory = (category: CoefficientCategory) => {
    setSelectedCoefficientCategory(category);
    const reactionCategory = category as ReactionCategory;

    if (selectedMode === 'practice') {
      // 연습 모드: 플래시카드 시작
      setCoefficientPracticeReaction(getRandomReaction(reactionCategory));
      setCoefficientPracticeNumber(1);
      setScreen('coefficientPractice');
    } else if (selectedMode === 'test') {
      // TEST 모드: 문항수 선택 화면으로
      setScreen('coefficientQuestionCount');
    } else {
      // 스피드/서바이벌 모드
      startCoefficientGame(category);
    }
  };

  // 계수 게임 시작 (5지선다)
  const startCoefficientGame = (category: CoefficientCategory) => {
    setCoefficientScore(0);
    setCoefficientCombo(0);
    setCoefficientMaxCombo(0);
    setCoefficientLives(3);
    setCoefficientCorrectCount(0);
    setCoefficientWrongCount(0);
    setCoefficientCurrentQuestion(generateCoefficientQuestion(category));
    setScreen('coefficientGame');
    setFeedback(null);

    if (selectedMode === 'speed') {
      resetTimer(SPEED_MODE_TIME);
      startTimer();
    }
  };

  // 계수 TEST 모드: 문항수 선택
  const handleSelectCoefficientQuestionCount = (count: TestQuestionCount) => {
    setCoefficientTotalQuestions(count);

    const questions: CoefficientQuizQuestion[] = [];
    for (let i = 0; i < count; i++) {
      questions.push(generateCoefficientQuestion(selectedCoefficientCategory));
    }
    setCoefficientQuestions(questions);
    setCoefficientCurrentIndex(0);
    setCoefficientCorrectCount(0);
    setCoefficientTimeLeft(TEST_QUESTION_TIME);
    setFeedback(null);
    setScreen('coefficientTest');
  };

  // 계수 연습 모드: 다음 카드
  const handleNextCoefficientCard = () => {
    const reactionCategory = selectedCoefficientCategory as ReactionCategory;
    setCoefficientPracticeReaction(getRandomReaction(reactionCategory));
    setCoefficientPracticeNumber(prev => prev + 1);
  };

  // 계수 연습 모드: 뒤로가기
  const handleCoefficientPracticeBack = () => {
    setCoefficientPracticeReaction(null);
    setCoefficientPracticeNumber(1);
    setScreen('start');
  };

  // 계수 카테고리 -> 모드 선택으로 뒤로가기
  const handleBackToModeSelectFromCoefficient = () => {
    setScreen('start');
  };

  // 계수 문항수 -> 카테고리로 뒤로가기
  const handleBackToCoefficientCategory = () => {
    setScreen('coefficientCategory');
  };

  // 계수 게임 답변 처리 (5지선다)
  const handleCoefficientAnswer = (isCorrect: boolean) => {
    if (!coefficientCurrentQuestion) return;

    setFeedback(isCorrect ? 'correct' : 'wrong');

    if (isCorrect) {
      const newCombo = coefficientCombo + 1;
      setCoefficientCombo(newCombo);
      if (newCombo > coefficientMaxCombo) setCoefficientMaxCombo(newCombo);
      setCoefficientCorrectCount(prev => prev + 1);

      const comboBonus = newCombo >= 5 ? 50 : newCombo >= 3 ? 25 : 0;
      setCoefficientScore(prev => prev + 100 + comboBonus);

      if (newCombo >= 3) {
        playSound('combo');
      } else {
        playSound('correct');
      }
    } else {
      setCoefficientCombo(0);
      setCoefficientWrongCount(prev => prev + 1);
      if (selectedMode === 'survival') {
        setCoefficientLives(prev => prev - 1);
      }
      playSound('wrong');
    }

    setTimeout(() => {
      setFeedback(null);

      // 서바이벌 모드 게임오버 체크
      if (selectedMode === 'survival' && coefficientLives <= 1 && !isCorrect) {
        playSound('gameOver');
        setScreen('coefficientResult');
      } else {
        setCoefficientCurrentQuestion(generateCoefficientQuestion(selectedCoefficientCategory));
      }
    }, 800);
  };

  // 계수 TEST 모드: 답변 처리
  const handleCoefficientTestAnswer = (isCorrect: boolean) => {
    if (feedback !== null) return;

    if (coefficientTimerRef.current) clearInterval(coefficientTimerRef.current);

    setFeedback(isCorrect ? 'correct' : 'wrong');

    if (isCorrect) {
      setCoefficientCorrectCount(prev => prev + 1);
      playSound('correct');
    } else {
      playSound('wrong');
    }

    setTimeout(() => {
      moveToNextCoefficientTestQuestion();
    }, 800);
  };

  // 계수 TEST 모드: 다음 문제로
  const moveToNextCoefficientTestQuestion = () => {
    setFeedback(null);

    if (coefficientCurrentIndex + 1 >= coefficientTotalQuestions) {
      playSound('gameOver');
      setScreen('coefficientTestResult');
    } else {
      setCoefficientCurrentIndex(prev => prev + 1);
      setCoefficientTimeLeft(TEST_QUESTION_TIME);
    }
  };

  // 계수 TEST 모드: 시간 초과
  const handleCoefficientTestTimeout = () => {
    playSound('wrong');
    setFeedback('wrong');

    setTimeout(() => {
      moveToNextCoefficientTestQuestion();
    }, 800);
  };

  // 계수 게임 재시작
  const handleCoefficientRestart = () => {
    if (selectedMode === 'test') {
      handleSelectCoefficientQuestionCount(coefficientTotalQuestions);
    } else {
      startCoefficientGame(selectedCoefficientCategory);
    }
  };

  // 계수 TEST 재시작
  const handleCoefficientTestRestart = () => {
    handleSelectCoefficientQuestionCount(coefficientTotalQuestions);
  };

  // === 분자 맞추기 관련 핸들러 ===

  // 분자 카테고리 선택
  const handleSelectMoleculeCategory = (category: MoleculeCategory) => {
    setSelectedMoleculeCategory(category);

    if (selectedMode === 'practice') {
      // 연습 모드: 플래시카드 시작
      const question = generateMoleculeQuestion(category);
      if (question) {
        setMoleculePracticeCard(question);
        setMoleculePracticeCardNumber(1);
        setScreen('moleculePractice');
      }
    } else if (selectedMode === 'test') {
      // TEST 모드: 문항수 선택 화면으로
      setScreen('moleculeQuestionCount');
    } else {
      // 스피드/서바이벌 모드
      startMoleculeGame(category);
    }
  };

  // 분자 게임 시작
  const startMoleculeGame = (category: MoleculeCategory) => {
    setMoleculeScore(0);
    setMoleculeCombo(0);
    setMoleculeMaxCombo(0);
    setMoleculeLives(3);
    setMoleculeCorrectCount(0);
    setMoleculeWrongCount(0);
    setMoleculeCurrentQuestion(generateMoleculeQuestion(category));
    setScreen('moleculeGame');
    setFeedback(null);

    if (selectedMode === 'speed') {
      resetTimer(SPEED_MODE_TIME);
      startTimer();
    }
  };

  // 분자 TEST 모드: 문항수 선택
  const handleSelectMoleculeQuestionCount = (count: TestQuestionCount) => {
    setMoleculeTotalQuestions(count);

    const questions: MoleculeQuizQuestion[] = [];
    for (let i = 0; i < count; i++) {
      const q = generateMoleculeQuestion(selectedMoleculeCategory);
      if (q) questions.push(q);
    }
    setMoleculeQuestions(questions);
    setMoleculeCurrentIndex(0);
    setMoleculeCorrectCount(0);
    setMoleculeTimeLeft(TEST_QUESTION_TIME);
    setFeedback(null);
    setScreen('moleculeTest');
  };

  // 분자 연습 모드: 다음 카드
  const handleNextMoleculeCard = () => {
    const question = generateMoleculeQuestion(selectedMoleculeCategory);
    if (question) {
      setMoleculePracticeCard(question);
      setMoleculePracticeCardNumber(prev => prev + 1);
    }
  };

  // 분자 연습 모드: 뒤로가기
  const handleMoleculePracticeBack = () => {
    setMoleculePracticeCard(null);
    setMoleculePracticeCardNumber(1);
    setScreen('start');
  };

  // 분자 카테고리 -> 모드 선택으로 뒤로가기
  const handleBackToModeSelectFromMolecule = () => {
    setScreen('start');
  };

  // 분자 문항수 -> 카테고리로 뒤로가기
  const handleBackToMoleculeCategory = () => {
    setScreen('moleculeCategory');
  };

  // 분자 게임 답변 처리
  const handleMoleculeAnswer = (isCorrect: boolean) => {
    if (!moleculeCurrentQuestion) return;

    setFeedback(isCorrect ? 'correct' : 'wrong');

    if (isCorrect) {
      const newCombo = moleculeCombo + 1;
      setMoleculeCombo(newCombo);
      if (newCombo > moleculeMaxCombo) setMoleculeMaxCombo(newCombo);
      setMoleculeCorrectCount(prev => prev + 1);

      const comboBonus = newCombo >= 5 ? 50 : newCombo >= 3 ? 25 : 0;
      setMoleculeScore(prev => prev + 100 + comboBonus);

      if (newCombo >= 3) {
        playSound('combo');
      } else {
        playSound('correct');
      }
    } else {
      setMoleculeCombo(0);
      setMoleculeWrongCount(prev => prev + 1);
      if (selectedMode === 'survival') {
        setMoleculeLives(prev => prev - 1);
      }
      playSound('wrong');
    }

    setTimeout(() => {
      setFeedback(null);

      // 서바이벌 모드 게임오버 체크
      if (selectedMode === 'survival' && moleculeLives <= 1 && !isCorrect) {
        playSound('gameOver');
        setScreen('moleculeResult');
      } else {
        setMoleculeCurrentQuestion(generateMoleculeQuestion(selectedMoleculeCategory));
      }
    }, 800);
  };

  // 분자 TEST 모드: 답변 처리
  const handleMoleculeTestAnswer = (isCorrect: boolean) => {
    if (feedback !== null) return;

    if (moleculeTimerRef.current) clearInterval(moleculeTimerRef.current);

    setFeedback(isCorrect ? 'correct' : 'wrong');

    if (isCorrect) {
      setMoleculeCorrectCount(prev => prev + 1);
      playSound('correct');
    } else {
      playSound('wrong');
    }

    setTimeout(() => {
      moveToNextMoleculeTestQuestion();
    }, 800);
  };

  // 분자 TEST 모드: 다음 문제로
  const moveToNextMoleculeTestQuestion = () => {
    setFeedback(null);

    if (moleculeCurrentIndex + 1 >= moleculeTotalQuestions) {
      playSound('gameOver');
      setScreen('moleculeTestResult');
    } else {
      setMoleculeCurrentIndex(prev => prev + 1);
      setMoleculeTimeLeft(TEST_QUESTION_TIME);
    }
  };

  // 분자 TEST 모드: 시간 초과
  const handleMoleculeTestTimeout = () => {
    playSound('wrong');
    setFeedback('wrong');

    setTimeout(() => {
      moveToNextMoleculeTestQuestion();
    }, 800);
  };

  // 분자 게임 재시작
  const handleMoleculeRestart = () => {
    if (selectedMode === 'test') {
      handleSelectMoleculeQuestionCount(moleculeTotalQuestions);
    } else {
      startMoleculeGame(selectedMoleculeCategory);
    }
  };

  // 분자 TEST 재시작
  const handleMoleculeTestRestart = () => {
    handleSelectMoleculeQuestionCount(moleculeTotalQuestions);
  };

  // 분자 TEST 모드 타이머
  useEffect(() => {
    if (screen !== 'moleculeTest' || feedback !== null) return;

    moleculeTimerRef.current = setInterval(() => {
      setMoleculeTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(moleculeTimerRef.current!);
          handleMoleculeTestTimeout();
          return TEST_QUESTION_TIME;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (moleculeTimerRef.current) clearInterval(moleculeTimerRef.current);
    };
  }, [screen, moleculeCurrentIndex, feedback]);

  // 계수 TEST 모드 타이머
  useEffect(() => {
    if (screen !== 'coefficientTest' || feedback !== null) return;

    coefficientTimerRef.current = setInterval(() => {
      setCoefficientTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(coefficientTimerRef.current!);
          handleCoefficientTestTimeout();
          return TEST_QUESTION_TIME;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (coefficientTimerRef.current) clearInterval(coefficientTimerRef.current);
    };
  }, [screen, coefficientCurrentIndex, feedback]);

  const handleAnswer = (answer: string) => {
    const { isCorrect, isCombo } = submitAnswer(answer);

    setFeedback(isCorrect ? 'correct' : 'wrong');

    if (isCorrect) {
      if (isCombo) {
        playSound('combo');
      } else {
        playSound('correct');
      }
    } else {
      playSound('wrong');
    }

    // 피드백 표시 후 다음 문제로
    setTimeout(() => {
      setFeedback(null);

      // 게임오버 체크 (서바이벌 모드)
      if (gameState.mode === 'survival' && gameState.lives <= 1 && !isCorrect) {
        endGame();
        playSound('gameOver');
        setScreen('result');
      } else {
        nextQuestion();
      }
    }, 800);
  };

  const handleRestart = () => {
    if (gameState.mode === 'test') {
      // TEST 모드 재시작
      handleSelectQuestionCount(testTotalQuestions);
    } else {
      startGame(gameState.mode, gameState.category);
      setScreen('game');
      setFeedback(null);

      if (gameState.mode === 'speed') {
        resetTimer(SPEED_MODE_TIME);
        startTimer();
      }
    }
  };

  const handleTestRestart = () => {
    handleSelectQuestionCount(testTotalQuestions);
  };

  const handleHome = () => {
    resetGame();
    resetTimer();
    if (testTimerRef.current) clearInterval(testTimerRef.current);
    setScreen('landing');
  };

  // 게임 오버 감지 (서바이벌 모드)
  useEffect(() => {
    if (gameState.isGameOver && screen === 'game') {
      setScreen('result');
    }
  }, [gameState.isGameOver, screen]);

  // 키보드 단축키
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 일반 게임 모드
      if (screen === 'game' && gameState.currentQuestion && feedback === null) {
        const keyNum = parseInt(e.key);
        if (keyNum >= 1 && keyNum <= 4) {
          const option = gameState.currentQuestion.options[keyNum - 1];
          if (option) {
            handleAnswer(option);
          }
        }
      }
      // TEST 모드
      if (screen === 'test' && testQuestions[testCurrentIndex] && feedback === null) {
        const keyNum = parseInt(e.key);
        if (keyNum >= 1 && keyNum <= 4) {
          const option = testQuestions[testCurrentIndex].options[keyNum - 1];
          if (option) {
            handleTestAnswer(option);
          }
        }
      }
      // 화학식 게임 모드
      if (screen === 'formulaGame' && formulaCurrentQuestion && feedback === null) {
        const keyNum = parseInt(e.key);
        if (keyNum >= 1 && keyNum <= 4) {
          const option = formulaCurrentQuestion.options[keyNum - 1];
          if (option) {
            handleFormulaAnswer(option);
          }
        }
      }
      // 화학식 TEST 모드
      if (screen === 'formulaTest' && formulaQuestions[formulaCurrentIndex] && feedback === null) {
        const keyNum = parseInt(e.key);
        if (keyNum >= 1 && keyNum <= 4) {
          const option = formulaQuestions[formulaCurrentIndex].options[keyNum - 1];
          if (option) {
            handleFormulaTestAnswer(option);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [screen, gameState.currentQuestion, testQuestions, testCurrentIndex, feedback, formulaCurrentQuestion, formulaQuestions, formulaCurrentIndex]);

  // TEST 결과 계산
  const testScore = Math.round((testCorrectCount / testTotalQuestions) * 100);

  return (
    <div className="app">
      <div className="container">
        {screen === 'landing' && (
          <LandingPage
            onSelectTopic={handleSelectTopic}
            isDarkMode={isDarkMode}
            onToggleTheme={handleToggleTheme}
          />
        )}

        {screen === 'start' && (
          <StartScreen
            topic={selectedTopic}
            onSelectMode={handleSelectMode}
            onBack={handleBackToLanding}
            isDarkMode={isDarkMode}
            onToggleTheme={handleToggleTheme}
          />
        )}

        {screen === 'category' && (
          <CategorySelect
            mode={selectedMode}
            onSelectCategory={handleSelectCategory}
            onBack={handleBackToModeSelect}
          />
        )}

        {screen === 'questionCount' && (
          <QuestionCountSelect
            category={selectedCategory}
            onSelectCount={handleSelectQuestionCount}
            onBack={handleBackToCategory}
          />
        )}

        {screen === 'game' && gameState.currentQuestion && (
          <div className="game-screen">
            <button className="back-button game-back-button" onClick={handleHome}>
              ← 나가기
            </button>
            <div className="game-header">
              {gameState.mode === 'speed' && (
                <Timer timeLeft={timeLeft} totalTime={SPEED_MODE_TIME} />
              )}
              {gameState.mode === 'survival' && (
                <Lives lives={gameState.lives} />
              )}
              <Score score={gameState.score} combo={gameState.combo} />
            </div>

            <Quiz
              question={gameState.currentQuestion}
              onAnswer={handleAnswer}
              onHint={useHint}
              disabled={feedback !== null}
              feedback={feedback}
            />

            <div className="game-footer">
              <span className="question-count">
                {gameState.correctCount + gameState.wrongCount + 1}번째 문제
              </span>
              <span className="keyboard-hint">
                키보드 1~4로 빠르게 답변!
              </span>
            </div>
          </div>
        )}

        {screen === 'test' && testQuestions[testCurrentIndex] && (
          <div className="game-screen test-screen">
            <button className="back-button game-back-button" onClick={handleHome}>
              ← 나가기
            </button>
            <div className="game-header">
              <div className="test-progress">
                <span className="test-progress-text">
                  {testCurrentIndex + 1} / {testTotalQuestions}
                </span>
                <div className="test-progress-bar">
                  <div
                    className="test-progress-fill"
                    style={{ width: `${((testCurrentIndex + 1) / testTotalQuestions) * 100}%` }}
                  />
                </div>
              </div>
              <div className={`test-timer ${testTimeLeft <= 2 ? 'timer-warning' : ''}`}>
                <span className="test-timer-value">{testTimeLeft}</span>
                <span className="test-timer-label">초</span>
              </div>
            </div>

            <Quiz
              question={testQuestions[testCurrentIndex]}
              onAnswer={handleTestAnswer}
              disabled={feedback !== null}
              feedback={feedback}
              hideHint
            />

            <div className="game-footer">
              <span className="question-count">
                맞은 문제: {testCorrectCount}개
              </span>
              <span className="keyboard-hint">
                키보드 1~4로 빠르게 답변!
              </span>
            </div>
          </div>
        )}

        {screen === 'practice' && practiceCard && (
          <FlashCard
            question={practiceCard}
            onNext={handleNextCard}
            onBack={handlePracticeBack}
            cardNumber={practiceCardNumber}
          />
        )}

        {screen === 'result' && (
          <Result
            gameState={gameState}
            onRestart={handleRestart}
            onHome={handleHome}
          />
        )}

        {screen === 'testResult' && (
          <div className="result test-result">
            <div className="result-header">
              <h1>시험 종료!</h1>
              <p className="game-mode">
                📝 TEST 모드
                <span className="category-tag">{testTotalQuestions}문제</span>
              </p>
            </div>

            <div className="test-score-section">
              <div className="test-score-circle">
                <span className="test-score-value">{testScore}</span>
                <span className="test-score-unit">점</span>
              </div>
              <p className="test-score-message">
                {testScore >= 90 ? '완벽해요! 🎉' :
                 testScore >= 80 ? '훌륭해요! 👏' :
                 testScore >= 70 ? '잘했어요! 👍' :
                 testScore >= 60 ? '괜찮아요! 💪' :
                 '더 연습해봐요! 📚'}
              </p>
            </div>

            <div className="stats">
              <div className="stat-grid test-stat-grid">
                <div className="stat-item">
                  <span className="stat-value">{testCorrectCount}</span>
                  <span className="stat-label">정답</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">{testTotalQuestions - testCorrectCount}</span>
                  <span className="stat-label">오답</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">{testTotalQuestions}</span>
                  <span className="stat-label">총 문항</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">{Math.round((testCorrectCount / testTotalQuestions) * 100)}%</span>
                  <span className="stat-label">정답률</span>
                </div>
              </div>
            </div>

            <div className="result-actions">
              <button className="btn btn-primary" onClick={handleTestRestart}>
                다시 시험보기
              </button>
              <button className="btn btn-secondary" onClick={handleHome}>
                홈으로
              </button>
            </div>
          </div>
        )}

        {/* 화학식 읽기 화면들 */}
        {screen === 'formulaCategory' && (
          <FormulaCategorySelect
            mode={selectedMode}
            onSelectCategory={handleSelectFormulaCategory}
            onBack={handleBackToModeSelectFromFormula}
          />
        )}

        {screen === 'formulaQuestionCount' && (
          <FormulaQuestionCountSelect
            category={selectedFormulaCategory}
            onSelectCount={handleSelectFormulaQuestionCount}
            onBack={handleBackToFormulaCategory}
          />
        )}

        {screen === 'formulaPractice' && formulaPracticeCard && (
          <FormulaFlashCard
            question={formulaPracticeCard}
            onNext={handleNextFormulaCard}
            onBack={handleFormulaPracticeBack}
            cardNumber={formulaPracticeCardNumber}
          />
        )}

        {screen === 'formulaGame' && formulaCurrentQuestion && (
          <div className="game-screen">
            <button className="back-button game-back-button" onClick={handleHome}>
              ← 나가기
            </button>
            <div className="game-header">
              {selectedMode === 'speed' && (
                <Timer timeLeft={timeLeft} totalTime={SPEED_MODE_TIME} />
              )}
              {selectedMode === 'survival' && (
                <Lives lives={formulaLives} />
              )}
              <Score score={formulaScore} combo={formulaCombo} />
            </div>

            <div className={`quiz ${feedback ? `feedback-${feedback}` : ''}`}>
              <div className="question">
                <h2>{formulaCurrentQuestion.question}</h2>
              </div>

              <div className="options">
                {formulaCurrentQuestion.options.map((option, index) => (
                  <button
                    key={index}
                    className={`option ${
                      feedback && option === formulaCurrentQuestion.correctAnswer ? 'correct' : ''
                    } ${
                      feedback === 'wrong' && option !== formulaCurrentQuestion.correctAnswer ? 'wrong' : ''
                    }`}
                    onClick={() => handleFormulaAnswer(option)}
                    disabled={feedback !== null}
                  >
                    <span className="option-number">{index + 1}</span>
                    <span className="option-text">{option}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="game-footer">
              <span className="question-count">
                {formulaCorrectCount + formulaWrongCount + 1}번째 문제
              </span>
              <span className="keyboard-hint">
                키보드 1~4로 빠르게 답변!
              </span>
            </div>
          </div>
        )}

        {screen === 'formulaTest' && formulaQuestions[formulaCurrentIndex] && (
          <div className="game-screen test-screen">
            <button className="back-button game-back-button" onClick={handleHome}>
              ← 나가기
            </button>
            <div className="game-header">
              <div className="test-progress">
                <span className="test-progress-text">
                  {formulaCurrentIndex + 1} / {formulaTotalQuestions}
                </span>
                <div className="test-progress-bar">
                  <div
                    className="test-progress-fill"
                    style={{ width: `${((formulaCurrentIndex + 1) / formulaTotalQuestions) * 100}%` }}
                  />
                </div>
              </div>
              <div className={`test-timer ${formulaTimeLeft <= 2 ? 'timer-warning' : ''}`}>
                <span className="test-timer-value">{formulaTimeLeft}</span>
                <span className="test-timer-label">초</span>
              </div>
            </div>

            <div className={`quiz ${feedback ? `feedback-${feedback}` : ''}`}>
              <div className="question">
                <h2>{formulaQuestions[formulaCurrentIndex].question}</h2>
              </div>

              <div className="options">
                {formulaQuestions[formulaCurrentIndex].options.map((option, index) => (
                  <button
                    key={index}
                    className={`option ${
                      feedback && option === formulaQuestions[formulaCurrentIndex].correctAnswer ? 'correct' : ''
                    } ${
                      feedback === 'wrong' && option !== formulaQuestions[formulaCurrentIndex].correctAnswer ? 'wrong' : ''
                    }`}
                    onClick={() => handleFormulaTestAnswer(option)}
                    disabled={feedback !== null}
                  >
                    <span className="option-number">{index + 1}</span>
                    <span className="option-text">{option}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="game-footer">
              <span className="question-count">
                맞은 문제: {formulaCorrectCount}개
              </span>
              <span className="keyboard-hint">
                키보드 1~4로 빠르게 답변!
              </span>
            </div>
          </div>
        )}

        {screen === 'formulaResult' && (
          <div className="result">
            <div className="result-header">
              <h1>게임 종료!</h1>
              <p className="game-mode">
                {selectedMode === 'speed' ? '⚡ 스피드 모드' : '❤️ 서바이벌 모드'}
                <span className="category-tag">📖 화학식 읽기</span>
              </p>
            </div>

            <div className="final-score">
              <span className="score-label">최종 점수</span>
              <span className="score-value">{formulaScore}</span>
            </div>

            <div className="stats">
              <div className="stat-grid">
                <div className="stat-item">
                  <span className="stat-value">{formulaCorrectCount}</span>
                  <span className="stat-label">정답</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">{formulaWrongCount}</span>
                  <span className="stat-label">오답</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">{formulaMaxCombo}</span>
                  <span className="stat-label">최대 콤보</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">
                    {formulaCorrectCount + formulaWrongCount > 0
                      ? Math.round((formulaCorrectCount / (formulaCorrectCount + formulaWrongCount)) * 100)
                      : 0}%
                  </span>
                  <span className="stat-label">정답률</span>
                </div>
              </div>
            </div>

            <div className="result-actions">
              <button className="btn btn-primary" onClick={handleFormulaRestart}>
                다시 하기
              </button>
              <button className="btn btn-secondary" onClick={handleHome}>
                홈으로
              </button>
            </div>
          </div>
        )}

        {screen === 'formulaTestResult' && (
          <div className="result test-result">
            <div className="result-header">
              <h1>시험 종료!</h1>
              <p className="game-mode">
                📝 TEST 모드
                <span className="category-tag">{formulaTotalQuestions}문제 · 📖 화학식 읽기</span>
              </p>
            </div>

            <div className="test-score-section">
              <div className="test-score-circle">
                <span className="test-score-value">{Math.round((formulaCorrectCount / formulaTotalQuestions) * 100)}</span>
                <span className="test-score-unit">점</span>
              </div>
              <p className="test-score-message">
                {Math.round((formulaCorrectCount / formulaTotalQuestions) * 100) >= 90 ? '완벽해요! 🎉' :
                 Math.round((formulaCorrectCount / formulaTotalQuestions) * 100) >= 80 ? '훌륭해요! 👏' :
                 Math.round((formulaCorrectCount / formulaTotalQuestions) * 100) >= 70 ? '잘했어요! 👍' :
                 Math.round((formulaCorrectCount / formulaTotalQuestions) * 100) >= 60 ? '괜찮아요! 💪' :
                 '더 연습해봐요! 📚'}
              </p>
            </div>

            <div className="stats">
              <div className="stat-grid test-stat-grid">
                <div className="stat-item">
                  <span className="stat-value">{formulaCorrectCount}</span>
                  <span className="stat-label">정답</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">{formulaTotalQuestions - formulaCorrectCount}</span>
                  <span className="stat-label">오답</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">{formulaTotalQuestions}</span>
                  <span className="stat-label">총 문항</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">{Math.round((formulaCorrectCount / formulaTotalQuestions) * 100)}%</span>
                  <span className="stat-label">정답률</span>
                </div>
              </div>
            </div>

            <div className="result-actions">
              <button className="btn btn-primary" onClick={handleFormulaTestRestart}>
                다시 시험보기
              </button>
              <button className="btn btn-secondary" onClick={handleHome}>
                홈으로
              </button>
            </div>
          </div>
        )}

        {/* 계수 맞추기 화면들 */}
        {screen === 'coefficientCategory' && (
          <CoefficientCategorySelect
            mode={selectedMode}
            onSelectCategory={handleSelectCoefficientCategory}
            onBack={handleBackToModeSelectFromCoefficient}
          />
        )}

        {screen === 'coefficientQuestionCount' && (
          <CoefficientQuestionCountSelect
            category={selectedCoefficientCategory}
            onSelectCount={handleSelectCoefficientQuestionCount}
            onBack={handleBackToCoefficientCategory}
          />
        )}

        {screen === 'coefficientPractice' && coefficientPracticeReaction && (
          <CoefficientFlashCard
            reaction={coefficientPracticeReaction}
            onNext={handleNextCoefficientCard}
            onBack={handleCoefficientPracticeBack}
            cardNumber={coefficientPracticeNumber}
          />
        )}

        {screen === 'coefficientGame' && coefficientCurrentQuestion && (
          <div className="game-screen">
            <button className="back-button game-back-button" onClick={handleHome}>
              ← 나가기
            </button>
            <div className="game-header">
              {selectedMode === 'speed' && (
                <Timer timeLeft={timeLeft} totalTime={SPEED_MODE_TIME} />
              )}
              {selectedMode === 'survival' && (
                <Lives lives={coefficientLives} />
              )}
              <Score score={coefficientScore} combo={coefficientCombo} />
            </div>

            <CoefficientQuiz
              question={coefficientCurrentQuestion}
              onAnswer={handleCoefficientAnswer}
              disabled={feedback !== null}
              feedback={feedback}
            />

            <div className="game-footer">
              <span className="question-count">
                {coefficientCorrectCount + coefficientWrongCount + 1}번째 문제
              </span>
              <span className="keyboard-hint">
                1-5: 보기 선택
              </span>
            </div>
          </div>
        )}

        {screen === 'coefficientTest' && coefficientQuestions[coefficientCurrentIndex] && (
          <div className="game-screen test-screen">
            <button className="back-button game-back-button" onClick={handleHome}>
              ← 나가기
            </button>
            <div className="game-header">
              <div className="test-progress">
                <span className="test-progress-text">
                  {coefficientCurrentIndex + 1} / {coefficientTotalQuestions}
                </span>
                <div className="test-progress-bar">
                  <div
                    className="test-progress-fill"
                    style={{ width: `${((coefficientCurrentIndex + 1) / coefficientTotalQuestions) * 100}%` }}
                  />
                </div>
              </div>
              <div className={`test-timer ${coefficientTimeLeft <= 2 ? 'timer-warning' : ''}`}>
                <span className="test-timer-value">{coefficientTimeLeft}</span>
                <span className="test-timer-label">초</span>
              </div>
            </div>

            <CoefficientQuiz
              question={coefficientQuestions[coefficientCurrentIndex]}
              onAnswer={handleCoefficientTestAnswer}
              disabled={feedback !== null}
              feedback={feedback}
              hideHint
            />

            <div className="game-footer">
              <span className="question-count">
                맞은 문제: {coefficientCorrectCount}개
              </span>
              <span className="keyboard-hint">
                1-5: 보기 선택
              </span>
            </div>
          </div>
        )}

        {screen === 'coefficientResult' && (
          <div className="result">
            <div className="result-header">
              <h1>게임 종료!</h1>
              <p className="game-mode">
                {selectedMode === 'speed' ? '⚡ 스피드 모드' : '❤️ 서바이벌 모드'}
                <span className="category-tag">🔢 계수 맞추기</span>
              </p>
            </div>

            <div className="final-score">
              <span className="score-label">최종 점수</span>
              <span className="score-value">{coefficientScore}</span>
            </div>

            <div className="stats">
              <div className="stat-grid">
                <div className="stat-item">
                  <span className="stat-value">{coefficientCorrectCount}</span>
                  <span className="stat-label">정답</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">{coefficientWrongCount}</span>
                  <span className="stat-label">오답</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">{coefficientMaxCombo}</span>
                  <span className="stat-label">최대 콤보</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">
                    {coefficientCorrectCount + coefficientWrongCount > 0
                      ? Math.round((coefficientCorrectCount / (coefficientCorrectCount + coefficientWrongCount)) * 100)
                      : 0}%
                  </span>
                  <span className="stat-label">정답률</span>
                </div>
              </div>
            </div>

            <div className="result-actions">
              <button className="btn btn-primary" onClick={handleCoefficientRestart}>
                다시 하기
              </button>
              <button className="btn btn-secondary" onClick={handleHome}>
                홈으로
              </button>
            </div>
          </div>
        )}

        {screen === 'coefficientTestResult' && (
          <div className="result test-result">
            <div className="result-header">
              <h1>시험 종료!</h1>
              <p className="game-mode">
                📝 TEST 모드
                <span className="category-tag">{coefficientTotalQuestions}문제 · 🔢 계수 맞추기</span>
              </p>
            </div>

            <div className="test-score-section">
              <div className="test-score-circle">
                <span className="test-score-value">{Math.round((coefficientCorrectCount / coefficientTotalQuestions) * 100)}</span>
                <span className="test-score-unit">점</span>
              </div>
              <p className="test-score-message">
                {Math.round((coefficientCorrectCount / coefficientTotalQuestions) * 100) >= 90 ? '완벽해요! 🎉' :
                 Math.round((coefficientCorrectCount / coefficientTotalQuestions) * 100) >= 80 ? '훌륭해요! 👏' :
                 Math.round((coefficientCorrectCount / coefficientTotalQuestions) * 100) >= 70 ? '잘했어요! 👍' :
                 Math.round((coefficientCorrectCount / coefficientTotalQuestions) * 100) >= 60 ? '괜찮아요! 💪' :
                 '더 연습해봐요! 📚'}
              </p>
            </div>

            <div className="stats">
              <div className="stat-grid test-stat-grid">
                <div className="stat-item">
                  <span className="stat-value">{coefficientCorrectCount}</span>
                  <span className="stat-label">정답</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">{coefficientTotalQuestions - coefficientCorrectCount}</span>
                  <span className="stat-label">오답</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">{coefficientTotalQuestions}</span>
                  <span className="stat-label">총 문항</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">{Math.round((coefficientCorrectCount / coefficientTotalQuestions) * 100)}%</span>
                  <span className="stat-label">정답률</span>
                </div>
              </div>
            </div>

            <div className="result-actions">
              <button className="btn btn-primary" onClick={handleCoefficientTestRestart}>
                다시 시험보기
              </button>
              <button className="btn btn-secondary" onClick={handleHome}>
                홈으로
              </button>
            </div>
          </div>
        )}

        {/* 분자 맞추기 화면들 */}
        {screen === 'moleculeCategory' && (
          <MoleculeCategorySelect
            mode={selectedMode}
            onSelectCategory={handleSelectMoleculeCategory}
            onBack={handleBackToModeSelectFromMolecule}
          />
        )}

        {screen === 'moleculeQuestionCount' && (
          <MoleculeQuestionCountSelect
            category={selectedMoleculeCategory}
            onSelectCount={handleSelectMoleculeQuestionCount}
            onBack={handleBackToMoleculeCategory}
          />
        )}

        {screen === 'moleculePractice' && moleculePracticeCard && (
          <MoleculeFlashCard
            question={moleculePracticeCard}
            onNext={handleNextMoleculeCard}
            onBack={handleMoleculePracticeBack}
            cardNumber={moleculePracticeCardNumber}
          />
        )}

        {screen === 'moleculeGame' && moleculeCurrentQuestion && (
          <MoleculeQuiz
            question={moleculeCurrentQuestion}
            onAnswer={handleMoleculeAnswer}
            onBack={handleHome}
            mode={selectedMode as 'speed' | 'survival' | 'test'}
            score={moleculeScore}
            combo={moleculeCombo}
            lives={moleculeLives}
            timeLeft={timeLeft}
          />
        )}

        {screen === 'moleculeTest' && moleculeQuestions[moleculeCurrentIndex] && (
          <MoleculeQuiz
            question={moleculeQuestions[moleculeCurrentIndex]}
            onAnswer={handleMoleculeTestAnswer}
            onBack={handleHome}
            mode="test"
            currentQuestion={moleculeCurrentIndex + 1}
            totalQuestions={moleculeTotalQuestions}
            timeLeft={moleculeTimeLeft}
          />
        )}

        {screen === 'moleculeResult' && (
          <div className="result">
            <div className="result-header">
              <h1>게임 종료!</h1>
              <p className="game-mode">
                {selectedMode === 'speed' ? '⚡ 스피드 모드' : '❤️ 서바이벌 모드'}
                <span className="category-tag">🧪 분자 맞추기</span>
              </p>
            </div>

            <div className="final-score">
              <span className="score-label">최종 점수</span>
              <span className="score-value">{moleculeScore}</span>
            </div>

            <div className="stats">
              <div className="stat-grid">
                <div className="stat-item">
                  <span className="stat-value">{moleculeCorrectCount}</span>
                  <span className="stat-label">정답</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">{moleculeWrongCount}</span>
                  <span className="stat-label">오답</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">{moleculeMaxCombo}</span>
                  <span className="stat-label">최대 콤보</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">
                    {moleculeCorrectCount + moleculeWrongCount > 0
                      ? Math.round((moleculeCorrectCount / (moleculeCorrectCount + moleculeWrongCount)) * 100)
                      : 0}%
                  </span>
                  <span className="stat-label">정답률</span>
                </div>
              </div>
            </div>

            <div className="result-actions">
              <button className="btn btn-primary" onClick={handleMoleculeRestart}>
                다시 하기
              </button>
              <button className="btn btn-secondary" onClick={handleHome}>
                홈으로
              </button>
            </div>
          </div>
        )}

        {screen === 'moleculeTestResult' && (
          <div className="result test-result">
            <div className="result-header">
              <h1>시험 종료!</h1>
              <p className="game-mode">
                📝 TEST 모드
                <span className="category-tag">{moleculeTotalQuestions}문제 · 🧪 분자 맞추기</span>
              </p>
            </div>

            <div className="test-score-section">
              <div className="test-score-circle">
                <span className="test-score-value">{Math.round((moleculeCorrectCount / moleculeTotalQuestions) * 100)}</span>
                <span className="test-score-unit">점</span>
              </div>
              <p className="test-score-message">
                {Math.round((moleculeCorrectCount / moleculeTotalQuestions) * 100) >= 90 ? '완벽해요! 🎉' :
                 Math.round((moleculeCorrectCount / moleculeTotalQuestions) * 100) >= 80 ? '훌륭해요! 👏' :
                 Math.round((moleculeCorrectCount / moleculeTotalQuestions) * 100) >= 70 ? '잘했어요! 👍' :
                 Math.round((moleculeCorrectCount / moleculeTotalQuestions) * 100) >= 60 ? '괜찮아요! 💪' :
                 '더 연습해봐요! 📚'}
              </p>
            </div>

            <div className="stats">
              <div className="stat-grid test-stat-grid">
                <div className="stat-item">
                  <span className="stat-value">{moleculeCorrectCount}</span>
                  <span className="stat-label">정답</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">{moleculeTotalQuestions - moleculeCorrectCount}</span>
                  <span className="stat-label">오답</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">{moleculeTotalQuestions}</span>
                  <span className="stat-label">총 문항</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">{Math.round((moleculeCorrectCount / moleculeTotalQuestions) * 100)}%</span>
                  <span className="stat-label">정답률</span>
                </div>
              </div>
            </div>

            <div className="result-actions">
              <button className="btn btn-primary" onClick={handleMoleculeTestRestart}>
                다시 시험보기
              </button>
              <button className="btn btn-secondary" onClick={handleHome}>
                홈으로
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
