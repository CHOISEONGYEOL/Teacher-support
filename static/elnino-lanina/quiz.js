// OX 퀴즈 시스템
class QuizController {
    constructor() {
        this.score = 0;
        this.currentQuestionIndex = 0;
        this.totalQuestions = 10;
        this.timeLimit = 0; // 0 = 제한 없음
        this.streak = 0;
        this.maxStreak = 0;
        this.currentQuestion = null;
        this.currentAnswer = null;
        this.usedQuestions = new Set();
        this.category = 'all';
        this.quizQuestions = [];
        this.answered = false;
        this.timer = null;
        this.timerInterval = null;
        this.remainingTime = 0;

        this.init();
    }

    init() {
        // 문항수 버튼
        document.querySelectorAll('.count-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.count-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.totalQuestions = parseInt(e.target.dataset.count);
            });
        });

        // 시간 제한 버튼
        document.querySelectorAll('.time-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.time-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.timeLimit = parseInt(e.target.dataset.time);
            });
        });

        // 카테고리 선택
        document.getElementById('quiz-category').addEventListener('change', (e) => {
            this.category = e.target.value;
        });

        // 퀴즈 시작 버튼
        document.getElementById('start-quiz-btn').addEventListener('click', () => {
            this.startQuiz();
        });

        // O 버튼
        document.getElementById('btn-o').addEventListener('click', () => {
            if (!this.answered) this.checkAnswer(true);
        });

        // X 버튼
        document.getElementById('btn-x').addEventListener('click', () => {
            if (!this.answered) this.checkAnswer(false);
        });

        // 다음 문제 버튼
        document.getElementById('next-quiz-btn').addEventListener('click', () => {
            this.nextQuestion();
        });

        // 다시 풀기 버튼
        document.getElementById('retry-quiz-btn').addEventListener('click', () => {
            this.startQuiz();
        });

        // 새 퀴즈 버튼
        document.getElementById('new-quiz-setup-btn').addEventListener('click', () => {
            this.showSetup();
        });
    }

    getQuestionPool() {
        let correctPool = [];
        let incorrectPool = [];

        switch (this.category) {
            case 'elnino':
                correctPool = quizData.elninoCorrect;
                incorrectPool = quizData.elninoIncorrect;
                break;
            case 'milankovitch':
                correctPool = quizData.milankovitchCorrect;
                incorrectPool = quizData.milankovitchIncorrect;
                break;
            default:
                correctPool = [...quizData.elninoCorrect, ...quizData.milankovitchCorrect];
                incorrectPool = [...quizData.elninoIncorrect, ...quizData.milankovitchIncorrect];
        }

        return { correctPool, incorrectPool };
    }

    generateQuizQuestions() {
        const { correctPool, incorrectPool } = this.getQuestionPool();
        this.quizQuestions = [];

        // O 문제와 X 문제를 각각 변환
        const correctQuestions = correctPool.map((q, i) => ({ question: q, answer: true, id: `correct_${i}` }));
        const incorrectQuestions = incorrectPool.map((q, i) => ({ question: q, answer: false, id: `incorrect_${i}` }));

        // 각각 셔플
        this.shuffleArray(correctQuestions);
        this.shuffleArray(incorrectQuestions);

        // O와 X를 균등하게 선택 (반반)
        const halfCount = Math.floor(this.totalQuestions / 2);
        const oCount = halfCount;
        const xCount = this.totalQuestions - halfCount; // 홀수일 경우 X가 하나 더

        const selectedO = correctQuestions.slice(0, Math.min(oCount, correctQuestions.length));
        const selectedX = incorrectQuestions.slice(0, Math.min(xCount, incorrectQuestions.length));

        // 합치고 다시 셔플
        this.quizQuestions = [...selectedO, ...selectedX];
        this.shuffleArray(this.quizQuestions);

        this.totalQuestions = this.quizQuestions.length;
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    startQuiz() {
        this.score = 0;
        this.currentQuestionIndex = 0;
        this.streak = 0;
        this.maxStreak = 0;
        this.usedQuestions.clear();
        this.answered = false;
        this.clearTimer();

        this.generateQuizQuestions();
        this.showPlay();
        this.displayQuestion();
    }

    showSetup() {
        this.clearTimer();
        document.getElementById('quiz-setup').style.display = 'block';
        document.getElementById('quiz-play').style.display = 'none';
        document.getElementById('quiz-result').style.display = 'none';
    }

    showPlay() {
        document.getElementById('quiz-setup').style.display = 'none';
        document.getElementById('quiz-play').style.display = 'block';
        document.getElementById('quiz-result').style.display = 'none';
    }

    showResult() {
        this.clearTimer();
        document.getElementById('quiz-setup').style.display = 'none';
        document.getElementById('quiz-play').style.display = 'none';
        document.getElementById('quiz-result').style.display = 'block';

        // 점수 계산 (100점 만점)
        const percentage = Math.round((this.score / this.totalQuestions) * 100);

        document.getElementById('result-score').textContent = percentage;
        document.getElementById('result-correct').textContent = this.score;
        document.getElementById('result-incorrect').textContent = this.totalQuestions - this.score;
        document.getElementById('result-total').textContent = this.totalQuestions;

        // 메시지 숨김
        document.getElementById('result-message').style.display = 'none';
    }

    displayQuestion() {
        if (this.currentQuestionIndex >= this.totalQuestions) {
            this.showResult();
            return;
        }

        const current = this.quizQuestions[this.currentQuestionIndex];
        this.currentQuestion = current.question;
        this.currentAnswer = current.answer;
        this.answered = false;

        // UI 업데이트
        document.getElementById('question-number').textContent =
            `문제 ${this.currentQuestionIndex + 1} / ${this.totalQuestions}`;
        document.getElementById('question-text').textContent = this.currentQuestion;

        // 진행률 바 업데이트
        const progressPercent = (this.currentQuestionIndex / this.totalQuestions) * 100;
        document.getElementById('progress-fill').style.width = `${progressPercent}%`;

        // 버튼 활성화
        document.getElementById('btn-o').disabled = false;
        document.getElementById('btn-x').disabled = false;
        document.getElementById('btn-o').classList.remove('correct', 'incorrect');
        document.getElementById('btn-x').classList.remove('correct', 'incorrect');

        // 피드백 초기화
        document.getElementById('feedback').textContent = '';
        document.getElementById('feedback').className = 'feedback';
        document.getElementById('explanation').textContent = '';
        document.getElementById('explanation').classList.remove('show');

        // 다음 버튼 숨기기
        document.getElementById('next-quiz-btn').style.display = 'none';

        // 점수 업데이트
        this.updateScore();

        // 타이머 시작
        if (this.timeLimit > 0) {
            this.startTimer();
        } else {
            document.getElementById('timer-display').style.display = 'none';
        }
    }

    startTimer() {
        this.clearTimer();
        this.remainingTime = this.timeLimit;

        const timerDisplay = document.getElementById('timer-display');
        const timerBar = document.getElementById('timer-bar');
        const timerText = document.getElementById('timer-text');

        timerDisplay.style.display = 'flex';
        timerText.textContent = this.remainingTime;
        timerBar.style.width = '100%';
        timerBar.classList.remove('warning', 'danger');

        this.timerInterval = setInterval(() => {
            this.remainingTime--;
            timerText.textContent = this.remainingTime;

            const percent = (this.remainingTime / this.timeLimit) * 100;
            timerBar.style.width = `${percent}%`;

            // 색상 변경
            if (this.remainingTime <= 2) {
                timerBar.classList.add('danger');
                timerBar.classList.remove('warning');
            } else if (this.remainingTime <= Math.ceil(this.timeLimit / 2)) {
                timerBar.classList.add('warning');
                timerBar.classList.remove('danger');
            }

            if (this.remainingTime <= 0) {
                this.timeUp();
            }
        }, 1000);
    }

    clearTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    timeUp() {
        this.clearTimer();
        if (!this.answered) {
            // 시간 초과 - 틀린 것으로 처리
            this.answered = true;
            this.streak = 0;

            // 버튼 비활성화
            document.getElementById('btn-o').disabled = true;
            document.getElementById('btn-x').disabled = true;

            // 정답 표시
            const btnO = document.getElementById('btn-o');
            const btnX = document.getElementById('btn-x');

            if (this.currentAnswer === true) {
                btnO.classList.add('correct');
            } else {
                btnX.classList.add('correct');
            }

            // 피드백 표시
            const feedback = document.getElementById('feedback');
            feedback.textContent = '시간 초과!';
            feedback.className = 'feedback timeout';

            // 설명 표시
            const explanation = document.getElementById('explanation');
            explanation.textContent = getExplanation(this.currentQuestion, this.currentAnswer);
            explanation.classList.add('show');

            // 점수 업데이트
            this.updateScore();

            // 1.5초 후 자동으로 다음 문제로
            setTimeout(() => {
                this.nextQuestion();
            }, 1500);
        }
    }

    checkAnswer(userAnswer) {
        if (this.answered) return;
        this.answered = true;
        this.clearTimer();

        const isCorrect = userAnswer === this.currentAnswer;

        if (isCorrect) {
            this.score++;
            this.streak++;
            if (this.streak > this.maxStreak) {
                this.maxStreak = this.streak;
            }
        } else {
            this.streak = 0;
        }

        // 버튼 비활성화
        document.getElementById('btn-o').disabled = true;
        document.getElementById('btn-x').disabled = true;

        // 정답 표시
        const btnO = document.getElementById('btn-o');
        const btnX = document.getElementById('btn-x');

        if (this.currentAnswer === true) {
            btnO.classList.add('correct');
            if (!isCorrect) btnX.classList.add('incorrect');
        } else {
            btnX.classList.add('correct');
            if (!isCorrect) btnO.classList.add('incorrect');
        }

        // 피드백 표시
        const feedback = document.getElementById('feedback');
        if (isCorrect) {
            feedback.textContent = '정답입니다!';
            feedback.className = 'feedback correct';
        } else {
            feedback.textContent = '틀렸습니다.';
            feedback.className = 'feedback incorrect';
        }

        // 설명 표시
        const explanation = document.getElementById('explanation');
        explanation.textContent = getExplanation(this.currentQuestion, this.currentAnswer);
        explanation.classList.add('show');

        // 점수 업데이트
        this.updateScore();

        // 시간 제한 모드면 자동으로 다음 문제로
        if (this.timeLimit > 0) {
            setTimeout(() => {
                this.nextQuestion();
            }, 1500);
        } else {
            // 다음 버튼 표시
            const nextBtn = document.getElementById('next-quiz-btn');
            if (this.currentQuestionIndex + 1 >= this.totalQuestions) {
                nextBtn.textContent = '결과 보기';
            } else {
                nextBtn.textContent = '다음 문제';
            }
            nextBtn.style.display = 'block';
        }
    }

    nextQuestion() {
        this.currentQuestionIndex++;
        this.displayQuestion();
    }

    updateScore() {
        document.getElementById('quiz-score').textContent =
            `점수: ${this.score} / ${this.currentQuestionIndex + (this.answered ? 1 : 0)}`;
        document.getElementById('quiz-streak').textContent = `연속 정답: ${this.streak}`;
    }
}

// 전역 인스턴스
let quizController;
