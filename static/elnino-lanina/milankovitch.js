// 밀란코비치 주기 다이어그램 제어
class MilankovitchController {
    constructor() {
        this.precession = 0; // 0 ~ 26000년
        this.obliquity = 23.5; // 22.1 ~ 24.5도
        this.eccentricity = 0.017; // 0 ~ 0.06

        this.init();
    }

    init() {
        // 세차운동 슬라이더 이벤트
        document.getElementById('precession-slider').addEventListener('input', (e) => {
            this.precession = parseInt(e.target.value);
            this.updatePrecessionDisplay();
            this.update3DPrecession();
            this.updateLabels();
            this.updateTemperatureEffects();
        });

        // 자전축 기울기 슬라이더 이벤트
        document.getElementById('obliquity-slider').addEventListener('input', (e) => {
            this.obliquity = parseFloat(e.target.value);
            this.updateObliquityDisplay();
            this.update3DPrecession();
            this.updateInfoDisplay();
            this.updateTemperatureEffects();
        });

        // 이심률 슬라이더 이벤트
        document.getElementById('eccentricity-slider').addEventListener('input', (e) => {
            this.eccentricity = parseFloat(e.target.value);
            this.updateEccentricityDisplay();
            this.update3DPrecession();
            this.updateInfoDisplay();
            this.updateTemperatureEffects();
        });

        // 초기 상태
        this.updatePrecessionDisplay();
        this.updateObliquityDisplay();
        this.updateEccentricityDisplay();
        this.updateLabels();
        this.updateInfoDisplay();
        this.updateTemperatureEffects();
    }

    updatePrecessionDisplay() {
        const display = document.getElementById('precession-value');
        const year = 2000 + this.precession;
        if (this.precession === 0) {
            display.textContent = `현재 (서기 2000년)`;
        } else {
            display.textContent = `서기 ${year.toLocaleString()}년`;
        }
    }

    updateObliquityDisplay() {
        const display = document.getElementById('obliquity-value');
        const diff = this.obliquity - 23.5;
        let status = '(현재)';
        if (Math.abs(diff) > 0.1) {
            status = diff > 0 ? '(현재보다 큼)' : '(현재보다 작음)';
        }
        display.textContent = `${this.obliquity.toFixed(1)}° ${status}`;
    }

    updateEccentricityDisplay() {
        const display = document.getElementById('eccentricity-value');
        const diff = this.eccentricity - 0.017;
        let status = '(현재)';
        if (Math.abs(diff) > 0.002) {
            status = diff > 0 ? '(현재보다 큼)' : '(현재보다 작음)';
        }
        display.textContent = `${this.eccentricity.toFixed(3)} ${status}`;
    }

    // 3D 세차운동 시뮬레이션 업데이트
    update3DPrecession() {
        if (typeof window.updatePrecessionFromSlider === 'function') {
            window.updatePrecessionFromSlider(this.precession, this.obliquity, this.eccentricity);
        }
    }

    updateLabels() {
        // 세차운동에 따른 계절 변화 (13000년마다 반전)
        const halfCycle = this.precession % 26000;

        if (halfCycle < 13000) {
            // 현재 ~ 13000년: 현재 상태 유지
            document.getElementById('info-hemisphere').textContent = '현재: 북반구 여름 = 원일점';
            document.getElementById('info-distance').textContent = '북반구 여름이 태양에서 멀어 온화함';
        } else {
            // 13000년 ~ 26000년: 반전
            document.getElementById('info-hemisphere').textContent = '세차 후: 북반구 여름 = 근일점';
            document.getElementById('info-distance').textContent = '북반구 여름이 태양에 가까워 더 더움';
        }

        this.updateInfoDisplay();
    }

    updateInfoDisplay() {
        document.getElementById('info-tilt').textContent = `자전축 기울기: ${this.obliquity.toFixed(1)}°`;
        document.getElementById('info-eccentricity').textContent = `이심률: ${this.eccentricity.toFixed(3)}`;
    }

    updateTemperatureEffects() {
        const tempSummer = document.getElementById('temp-summer');
        const tempWinter = document.getElementById('temp-winter');
        const tempRange = document.getElementById('temp-range');
        const tempSouth = document.getElementById('temp-south');

        // 복합 효과 계산
        let summerEffect = 0;
        let winterEffect = 0;

        // 1. 세차운동 효과 (13000년마다 반전)
        const halfCycle = this.precession % 26000;
        if (halfCycle >= 13000) {
            // 북반구 여름이 근일점
            summerEffect += 1;
            winterEffect -= 1;
        }

        // 2. 자전축 기울기 효과
        const obliquityDiff = this.obliquity - 23.5;
        if (obliquityDiff > 0.5) {
            summerEffect += 1;
            winterEffect -= 1;
        } else if (obliquityDiff < -0.5) {
            summerEffect -= 1;
            winterEffect += 1;
        }

        // 3. 이심률 효과
        const eccentricityDiff = this.eccentricity - 0.017;
        if (halfCycle < 13000) {
            // 현재: 원일점 = 북반구 여름
            if (eccentricityDiff > 0.01) {
                summerEffect -= 1;
                winterEffect += 1;
            } else if (eccentricityDiff < -0.01) {
                summerEffect += 0.5;
                winterEffect -= 0.5;
            }
        } else {
            // 13000년 후: 근일점 = 북반구 여름
            if (eccentricityDiff > 0.01) {
                summerEffect += 1;
                winterEffect -= 1;
            }
        }

        // 결과 표시
        const getSummerText = () => {
            if (summerEffect > 0.5) return '북반구 여름: 상승 ↑';
            if (summerEffect < -0.5) return '북반구 여름: 하강 ↓';
            return '북반구 여름: 기준';
        };

        const getWinterText = () => {
            if (winterEffect > 0.5) return '북반구 겨울: 상승 ↑';
            if (winterEffect < -0.5) return '북반구 겨울: 하강 ↓';
            return '북반구 겨울: 기준';
        };

        const getAnnualRange = () => {
            const range = summerEffect - winterEffect;
            if (range > 1) return '연교차: 커짐 ↑';
            if (range < -1) return '연교차: 작아짐 ↓';
            return '연교차: 기준';
        };

        tempSummer.textContent = getSummerText();
        tempWinter.textContent = getWinterText();
        tempRange.textContent = getAnnualRange();
        tempSouth.textContent = '남반구: 반대 효과';

        // 색상 업데이트
        tempSummer.style.color = summerEffect > 0 ? '#FF6B6B' : summerEffect < 0 ? '#4ECDC4' : '#aaa';
        tempWinter.style.color = winterEffect > 0 ? '#FF6B6B' : winterEffect < 0 ? '#4ECDC4' : '#aaa';
        tempRange.style.color = (summerEffect - winterEffect) > 0 ? '#FFD93D' : '#aaa';
    }

    // 주기 정보 하이라이트
    highlightCycle(cycle) {
        document.querySelectorAll('.cycle-item').forEach(item => {
            item.style.borderColor = '#4ECDC4';
            item.style.background = 'rgba(255, 255, 255, 0.05)';
        });

        const targetItem = document.getElementById(`${cycle}-info`);
        if (targetItem) {
            targetItem.style.borderColor = '#FFD93D';
            targetItem.style.background = 'rgba(255, 215, 61, 0.1)';
        }
    }
}

// 전역 인스턴스
let milankovitchController;
