// 메인 애플리케이션
class App {
    constructor() {
        this.currentSection = 'elnino';
        this.init();
    }

    init() {
        // 네비게이션 버튼 이벤트
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const section = e.target.dataset.section;
                this.switchSection(section);
            });
        });

        // 컨트롤러 초기화
        elninoController = new ElNinoController();
        milankovitchController = new MilankovitchController();
        milankovitchExtremeController = new MilankovitchExtremeController();
        quizController = new QuizController();

        // 키보드 단축키
        document.addEventListener('keydown', (e) => {
            this.handleKeyboard(e);
        });

        // 초기 섹션 표시
        this.switchSection('elnino');

        console.log('🌊 기후 변화 학습 도구가 로드되었습니다!');
    }

    switchSection(section) {
        this.currentSection = section;

        // 네비게이션 버튼 업데이트
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.section === section) {
                btn.classList.add('active');
            }
        });

        // 섹션 표시/숨김
        document.querySelectorAll('.section').forEach(sec => {
            sec.classList.remove('active');
        });

        document.getElementById(`${section}-section`).classList.add('active');

        // 섹션별 초기화
        if (section === 'elnino') {
            // 엘니뇨 다이어그램 새로고침
            if (elninoController) {
                elninoController.setMode(elninoController.currentMode);
            }
        } else if (section === 'milankovitch') {
            // 세차운동 3D 초기화
            if (typeof initPrecession === 'function') {
                initPrecession();
            }
        } else if (section === 'milankovitch-extreme') {
            // 과장된 버전 3D 초기화
            if (typeof initPrecessionExtreme === 'function') {
                initPrecessionExtreme();
            }
        }
    }

    handleKeyboard(e) {
        // 퀴즈 섹션에서만 단축키 활성화
        if (this.currentSection === 'quiz') {
            if (e.key === 'o' || e.key === 'O') {
                const btnO = document.getElementById('btn-o');
                if (!btnO.disabled) {
                    btnO.click();
                }
            } else if (e.key === 'x' || e.key === 'X') {
                const btnX = document.getElementById('btn-x');
                if (!btnX.disabled) {
                    btnX.click();
                }
            } else if (e.key === 'n' || e.key === 'N' || e.key === ' ') {
                document.getElementById('new-quiz-btn').click();
            }
        }

        // 섹션 전환 단축키 (1, 2, 3, 4)
        if (e.key === '1') {
            this.switchSection('elnino');
        } else if (e.key === '2') {
            this.switchSection('milankovitch');
        } else if (e.key === '3') {
            this.switchSection('milankovitch-extreme');
        } else if (e.key === '4') {
            this.switchSection('quiz');
        }

        // 엘니뇨 섹션에서 단축키
        if (this.currentSection === 'elnino') {
            if (e.key === 'e' || e.key === 'E') {
                elninoController.setMode('elnino');
            } else if (e.key === 'l' || e.key === 'L') {
                elninoController.setMode('lanina');
            } else if (e.key === 'p' || e.key === 'P') {
                elninoController.setMode('normal');
            }
        }
    }
}

// 애플리케이션 시작
document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
});

// 도움말 표시 (콘솔)
console.log(`
╔════════════════════════════════════════════════════════════╗
║           🌊 기후 변화 학습 도구 - 단축키 안내 🌊            ║
╠════════════════════════════════════════════════════════════╣
║  [1] 엘니뇨/라니냐 섹션                                     ║
║  [2] 밀란코비치 주기 섹션                                   ║
║  [3] OX 퀴즈 섹션                                          ║
║                                                            ║
║  엘니뇨/라니냐 섹션:                                        ║
║    [E] 엘니뇨 모드                                         ║
║    [L] 라니냐 모드                                         ║
║    [P] 평상시 모드                                         ║
║                                                            ║
║  OX 퀴즈 섹션:                                             ║
║    [O] O 선택                                              ║
║    [X] X 선택                                              ║
║    [N] 또는 [스페이스바] 새 문제                            ║
╚════════════════════════════════════════════════════════════╝
`);
