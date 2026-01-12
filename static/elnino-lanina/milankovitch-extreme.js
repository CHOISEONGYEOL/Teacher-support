// 밀란코비치 주기 (과장된 버전) 제어
class MilankovitchExtremeController {
    constructor() {
        this.precession = 0; // 0 ~ 26000년
        this.obliquity = 23.5; // 0 ~ 90도 (과장)
        this.eccentricity = 0.017; // 0 ~ 0.9 (과장)

        this.init();
    }

    init() {
        // 세차운동 슬라이더
        document.getElementById('precession-slider-ex').addEventListener('input', (e) => {
            this.precession = parseInt(e.target.value);
            this.updatePrecessionDisplay();
            this.update3D();
            this.updateLabels();
        });

        // 자전축 기울기 슬라이더 (과장: 0~90도)
        document.getElementById('obliquity-slider-ex').addEventListener('input', (e) => {
            this.obliquity = parseFloat(e.target.value);
            this.updateObliquityDisplay();
            this.update3D();
            this.updateInfoDisplay();
        });

        // 이심률 슬라이더 (과장: 0~0.9)
        document.getElementById('eccentricity-slider-ex').addEventListener('input', (e) => {
            this.eccentricity = parseFloat(e.target.value);
            this.updateEccentricityDisplay();
            this.update3D();
            this.updateInfoDisplay();
        });

        // 초기 상태
        this.updatePrecessionDisplay();
        this.updateObliquityDisplay();
        this.updateEccentricityDisplay();
        this.updateLabels();
        this.updateInfoDisplay();
    }

    updatePrecessionDisplay() {
        const display = document.getElementById('precession-value-ex');
        const year = 2000 + this.precession;
        if (this.precession === 0) {
            display.textContent = `현재 (서기 2000년)`;
        } else {
            display.textContent = `서기 ${year.toLocaleString()}년`;
        }
    }

    updateObliquityDisplay() {
        const display = document.getElementById('obliquity-value-ex');
        let status = '';
        if (this.obliquity === 0) {
            status = '(계절 없음)';
        } else if (this.obliquity === 90) {
            status = '(극단적 계절)';
        } else if (Math.abs(this.obliquity - 23.5) < 1) {
            status = '(현재와 유사)';
        } else if (this.obliquity < 23.5) {
            status = '(계절차 감소)';
        } else {
            status = '(계절차 증가)';
        }
        display.textContent = `${this.obliquity.toFixed(0)}° ${status}`;
    }

    updateEccentricityDisplay() {
        const display = document.getElementById('eccentricity-value-ex');
        let status = '';
        if (this.eccentricity === 0) {
            status = '(완전한 원)';
        } else if (this.eccentricity >= 0.8) {
            status = '(극단적 타원)';
        } else if (Math.abs(this.eccentricity - 0.017) < 0.01) {
            status = '(현재와 유사)';
        } else if (this.eccentricity < 0.017) {
            status = '(원에 가까움)';
        } else {
            status = '(타원형)';
        }
        display.textContent = `${this.eccentricity.toFixed(2)} ${status}`;
    }

    update3D() {
        if (typeof window.updateExtremeFromSlider === 'function') {
            window.updateExtremeFromSlider(this.precession, this.obliquity, this.eccentricity);
        }
    }

    updateLabels() {
        const halfCycle = this.precession % 26000;

        if (halfCycle < 13000) {
            document.getElementById('info-hemisphere-ex').textContent = '현재: 북반구 여름 = 원일점';
            document.getElementById('info-distance-ex').textContent = '북반구 여름이 태양에서 멀어 온화함';
        } else {
            document.getElementById('info-hemisphere-ex').textContent = '세차 후: 북반구 여름 = 근일점';
            document.getElementById('info-distance-ex').textContent = '북반구 여름이 태양에 가까워 더 더움';
        }

        this.updateInfoDisplay();
        this.updateTemperatureEffects();
    }

    updateInfoDisplay() {
        document.getElementById('info-tilt-ex').textContent = `자전축 기울기: ${this.obliquity.toFixed(0)}°`;
        document.getElementById('info-eccentricity-ex').textContent = `이심률: ${this.eccentricity.toFixed(2)}`;
    }

    updateTemperatureEffects() {
        const tempSummer = document.getElementById('temp-summer-ex');
        const tempWinter = document.getElementById('temp-winter-ex');
        const tempRange = document.getElementById('temp-range-ex');
        const tempSouth = document.getElementById('temp-south-ex');

        // 극단적 효과 계산
        let summerEffect = 0;
        let winterEffect = 0;

        // 1. 세차운동 효과
        const halfCycle = this.precession % 26000;
        if (halfCycle >= 13000) {
            summerEffect += 2;
            winterEffect -= 2;
        }

        // 2. 자전축 기울기 효과 (극단적)
        if (this.obliquity > 45) {
            summerEffect += 3;
            winterEffect -= 3;
        } else if (this.obliquity > 30) {
            summerEffect += 2;
            winterEffect -= 2;
        } else if (this.obliquity < 10) {
            summerEffect -= 2;
            winterEffect += 2;
        }

        // 3. 이심률 효과 (극단적)
        if (this.eccentricity > 0.5) {
            if (halfCycle >= 13000) {
                summerEffect += 3;
                winterEffect -= 3;
            } else {
                summerEffect -= 2;
                winterEffect += 2;
            }
        } else if (this.eccentricity < 0.01) {
            // 원형 궤도 = 거리 차이 없음
            summerEffect *= 0.5;
            winterEffect *= 0.5;
        }

        // 결과 표시
        const getSummerText = () => {
            if (summerEffect > 3) return '북반구 여름: 극단적 상승 ↑↑↑';
            if (summerEffect > 1) return '북반구 여름: 크게 상승 ↑↑';
            if (summerEffect > 0) return '북반구 여름: 상승 ↑';
            if (summerEffect < -1) return '북반구 여름: 크게 하강 ↓↓';
            if (summerEffect < 0) return '북반구 여름: 하강 ↓';
            return '북반구 여름: 기준';
        };

        const getWinterText = () => {
            if (winterEffect > 1) return '북반구 겨울: 크게 상승 ↑↑';
            if (winterEffect > 0) return '북반구 겨울: 상승 ↑';
            if (winterEffect < -3) return '북반구 겨울: 극단적 하강 ↓↓↓';
            if (winterEffect < -1) return '북반구 겨울: 크게 하강 ↓↓';
            if (winterEffect < 0) return '북반구 겨울: 하강 ↓';
            return '북반구 겨울: 기준';
        };

        const getAnnualRange = () => {
            const range = summerEffect - winterEffect;
            if (range > 4) return '연교차: 극단적으로 커짐 ↑↑↑';
            if (range > 2) return '연교차: 크게 커짐 ↑↑';
            if (range > 0) return '연교차: 커짐 ↑';
            if (range < -2) return '연교차: 크게 작아짐 ↓↓';
            if (range < 0) return '연교차: 작아짐 ↓';
            return '연교차: 기준';
        };

        tempSummer.textContent = getSummerText();
        tempWinter.textContent = getWinterText();
        tempRange.textContent = getAnnualRange();
        tempSouth.textContent = '남반구: 반대 효과';

        // 색상
        tempSummer.style.color = summerEffect > 0 ? '#FF6B6B' : summerEffect < 0 ? '#4ECDC4' : '#aaa';
        tempWinter.style.color = winterEffect > 0 ? '#FF6B6B' : winterEffect < 0 ? '#4ECDC4' : '#aaa';
        tempRange.style.color = (summerEffect - winterEffect) > 0 ? '#FFD93D' : '#aaa';
    }
}

// 전역 인스턴스
let milankovitchExtremeController;
