// 엘니뇨/라니냐 다이어그램 제어
class ElNinoController {
    constructor() {
        this.currentMode = 'normal';
        this.rainIntervals = { west: null, east: null };
        this.init();
    }

    init() {
        // 토글 버튼 이벤트
        document.querySelectorAll('.toggle-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const mode = e.target.dataset.mode;
                this.setMode(mode);
            });
        });

        // 초기 상태 설정
        this.setMode('normal');
    }

    setMode(mode) {
        this.currentMode = mode;

        // 버튼 활성화 상태 업데이트
        document.querySelectorAll('.toggle-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.mode === mode) {
                btn.classList.add('active');
            }
        });

        // 다이어그램 업데이트
        this.updateDiagram(mode);

        // 정보 패널 업데이트
        this.updateInfoPanel(mode);
    }

    updateDiagram(mode) {
        const svg = document.getElementById('ocean-diagram');

        switch (mode) {
            case 'elnino':
                this.animateToElNino();
                break;
            case 'lanina':
                this.animateToLaNina();
                break;
            default:
                this.animateToNormal();
        }
    }

    animateToNormal() {
        // 온난 수역 - 서태평양 (두꺼움)
        const warmWest = document.getElementById('warm-layer-west');
        warmWest.setAttribute('d', 'M 0 200 L 0 320 Q 225 320 450 280 L 450 200 Z');

        // 온난 수역 - 동태평양 (얇음)
        const warmEast = document.getElementById('warm-layer-east');
        warmEast.setAttribute('d', 'M 450 200 L 450 280 Q 675 240 900 230 L 900 200 Z');

        // 냉수역
        const coldLayer = document.getElementById('cold-layer');
        coldLayer.setAttribute('d', 'M 0 320 Q 225 320 450 280 Q 675 240 900 230 L 900 400 L 0 400 Z');

        // 무역풍 (보통)
        this.setWindStrength('normal');

        // 용승 (보통)
        this.setUpwellingStrength('normal');

        // 구름과 비
        this.setClouds('normal');

        // 기압
        document.getElementById('pressure-west-text').textContent = '저기압';
        document.getElementById('pressure-east-text').textContent = '고기압';

        // 라벨 위치 업데이트
        document.getElementById('thermocline-east-label').setAttribute('y', '260');
        document.getElementById('cold-label-east').setAttribute('y', '220');
    }

    animateToElNino() {
        // 온난 수역 - 서태평양 (얇아짐) - Q 커브를 사용하되 수평에 가깝게
        const warmWest = document.getElementById('warm-layer-west');
        warmWest.setAttribute('d', 'M 0 200 L 0 280 Q 225 280 450 280 L 450 200 Z');

        // 온난 수역 - 동태평양 (두꺼워짐) - Q 커브를 사용하되 수평에 가깝게
        const warmEast = document.getElementById('warm-layer-east');
        warmEast.setAttribute('d', 'M 450 200 L 450 280 Q 675 280 900 280 L 900 200 Z');

        // 냉수역 - Q 커브를 사용하되 수평에 가깝게
        const coldLayer = document.getElementById('cold-layer');
        coldLayer.setAttribute('d', 'M 0 280 Q 225 280 450 280 Q 675 280 900 280 L 900 400 L 0 400 Z');

        // 무역풍 (약함)
        this.setWindStrength('weak');

        // 용승 (약함)
        this.setUpwellingStrength('weak');

        // 구름과 비
        this.setClouds('elnino');

        // 기압
        document.getElementById('pressure-west-text').textContent = '고기압';
        document.getElementById('pressure-east-text').textContent = '저기압';

        // 라벨 위치 업데이트
        document.getElementById('thermocline-east-label').setAttribute('y', '350');
        document.getElementById('cold-label-east').setAttribute('y', '260');
    }

    animateToLaNina() {
        // 온난 수역 - 서태평양 (더 두꺼워짐)
        const warmWest = document.getElementById('warm-layer-west');
        warmWest.setAttribute('d', 'M 0 200 L 0 360 Q 225 360 450 300 L 450 200 Z');

        // 온난 수역 - 동태평양 (더 얇아짐)
        const warmEast = document.getElementById('warm-layer-east');
        warmEast.setAttribute('d', 'M 450 200 L 450 300 Q 675 230 900 215 L 900 200 Z');

        // 냉수역
        const coldLayer = document.getElementById('cold-layer');
        coldLayer.setAttribute('d', 'M 0 360 Q 225 360 450 300 Q 675 230 900 215 L 900 400 L 0 400 Z');

        // 무역풍 (강함)
        this.setWindStrength('strong');

        // 용승 (강함)
        this.setUpwellingStrength('strong');

        // 구름과 비
        this.setClouds('lanina');

        // 기압
        document.getElementById('pressure-west-text').textContent = '저기압';
        document.getElementById('pressure-east-text').textContent = '고기압';

        // 라벨 위치 업데이트
        document.getElementById('thermocline-east-label').setAttribute('y', '240');
        document.getElementById('cold-label-east').setAttribute('y', '210');
    }

    setWindStrength(strength) {
        const windArrow1 = document.getElementById('wind-arrow-1');
        const windArrow2 = document.getElementById('wind-arrow-2');
        const windLabel = document.querySelector('.wind-label');

        switch (strength) {
            case 'weak':
                windArrow1.setAttribute('stroke-width', '2');
                windArrow2.setAttribute('stroke-width', '2');
                windArrow1.setAttribute('x2', '550');
                windArrow2.setAttribute('x1', '550');
                windArrow2.setAttribute('x2', '400');
                windLabel.textContent = '약한 무역풍';
                break;
            case 'strong':
                windArrow1.setAttribute('stroke-width', '6');
                windArrow2.setAttribute('stroke-width', '6');
                windArrow1.setAttribute('x2', '450');
                windArrow2.setAttribute('x1', '450');
                windArrow2.setAttribute('x2', '200');
                windLabel.textContent = '강한 무역풍';
                break;
            default:
                windArrow1.setAttribute('stroke-width', '4');
                windArrow2.setAttribute('stroke-width', '4');
                windArrow1.setAttribute('x2', '500');
                windArrow2.setAttribute('x1', '500');
                windArrow2.setAttribute('x2', '300');
                windLabel.textContent = '무역풍 (동풍)';
        }
    }

    setUpwellingStrength(strength) {
        const upwellingArrow = document.getElementById('upwelling-arrow');
        const upwellingLabel = document.querySelector('.upwelling-label');

        switch (strength) {
            case 'weak':
                upwellingArrow.setAttribute('stroke-width', '2');
                upwellingArrow.setAttribute('y2', '320');
                upwellingArrow.setAttribute('opacity', '0.5');
                upwellingLabel.textContent = '약한 용승';
                break;
            case 'strong':
                upwellingArrow.setAttribute('stroke-width', '8');
                upwellingArrow.setAttribute('y2', '240');
                upwellingArrow.setAttribute('opacity', '1');
                upwellingLabel.textContent = '강한 용승';
                break;
            default:
                upwellingArrow.setAttribute('stroke-width', '5');
                upwellingArrow.setAttribute('y2', '280');
                upwellingArrow.setAttribute('opacity', '1');
                upwellingLabel.textContent = '용승';
        }
    }

    setClouds(mode) {
        const cloudWest = document.getElementById('cloud-west');
        const cloudEast = document.getElementById('cloud-east');
        const rainWest = document.getElementById('rain-west');
        const rainEast = document.getElementById('rain-east');

        // 기존 비 제거
        this.clearRain();

        switch (mode) {
            case 'elnino':
                // 서태평양: 구름 작아짐, 비 적음
                cloudWest.setAttribute('opacity', '0.5');
                cloudWest.setAttribute('transform', 'scale(0.7) translate(50, 40)');

                // 동태평양: 구름 커짐, 비 많음
                cloudEast.setAttribute('opacity', '1');
                cloudEast.setAttribute('transform', 'scale(1.3) translate(-100, -20)');

                this.startRain('east', 15);
                this.startRain('west', 3);
                break;

            case 'lanina':
                // 서태평양: 구름 커짐, 비 많음
                cloudWest.setAttribute('opacity', '1');
                cloudWest.setAttribute('transform', 'scale(1.3) translate(-20, -20)');

                // 동태평양: 구름 작아짐, 비 적음
                cloudEast.setAttribute('opacity', '0.3');
                cloudEast.setAttribute('transform', 'scale(0.6) translate(200, 50)');

                this.startRain('west', 15);
                this.startRain('east', 2);
                break;

            default:
                // 평상시
                cloudWest.setAttribute('opacity', '1');
                cloudWest.setAttribute('transform', 'scale(1) translate(0, 0)');

                cloudEast.setAttribute('opacity', '0.3');
                cloudEast.setAttribute('transform', 'scale(1) translate(0, 0)');

                this.startRain('west', 8);
                this.startRain('east', 3);
        }
    }

    clearRain() {
        if (this.rainIntervals.west) clearInterval(this.rainIntervals.west);
        if (this.rainIntervals.east) clearInterval(this.rainIntervals.east);

        document.getElementById('rain-west').innerHTML = '';
        document.getElementById('rain-east').innerHTML = '';
    }

    startRain(side, intensity) {
        const rainGroup = document.getElementById(`rain-${side}`);
        const baseX = side === 'west' ? 100 : 700;

        const createRainDrop = () => {
            const drop = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            const x = baseX + (Math.random() - 0.5) * 120;
            drop.setAttribute('x1', x);
            drop.setAttribute('y1', 130);
            drop.setAttribute('x2', x);
            drop.setAttribute('y2', 140);
            drop.setAttribute('stroke', '#87CEEB');
            drop.setAttribute('stroke-width', '2');
            drop.setAttribute('class', 'rain-drop');
            drop.style.animationDelay = `${Math.random() * 0.5}s`;
            rainGroup.appendChild(drop);

            setTimeout(() => {
                if (drop.parentNode) {
                    drop.remove();
                }
            }, 1000);
        };

        // 빗방울 생성 간격 (intensity에 따라)
        const interval = Math.max(50, 500 / intensity);
        this.rainIntervals[side] = setInterval(createRainDrop, interval);
    }

    updateInfoPanel(mode) {
        const data = phenomenonData[mode];

        document.getElementById('phenomenon-title').textContent = data.title;
        document.getElementById('phenomenon-description').innerHTML = `<p>${data.description}</p>`;

        // 테이블 업데이트
        const updateCell = (id, value, className = '') => {
            const cell = document.getElementById(id);
            cell.textContent = value;
            cell.className = className;
        };

        // 해수면 온도
        updateCell('sst-west', data.westSST, data.westSST.includes('↓') ? 'decrease' : data.westSST.includes('↑') ? 'increase' : '');
        updateCell('sst-east', data.eastSST, data.eastSST.includes('↑') ? 'increase' : data.eastSST.includes('↓') ? 'decrease' : '');

        // 기압
        updateCell('pressure-west-cell', data.westPressure);
        updateCell('pressure-east-cell', data.eastPressure);

        // 강수량
        updateCell('rain-west-cell', data.westRain, data.westRain.includes('↓') ? 'decrease' : data.westRain.includes('↑') ? 'increase' : '');
        updateCell('rain-east-cell', data.eastRain, data.eastRain.includes('↑') ? 'increase' : data.eastRain.includes('↓') ? 'decrease' : '');

        // 온난 수역 두께
        updateCell('warm-west-cell', data.westWarmLayer, data.westWarmLayer.includes('↓') ? 'decrease' : data.westWarmLayer.includes('↑') ? 'increase' : '');
        updateCell('warm-east-cell', data.eastWarmLayer, data.eastWarmLayer.includes('↑') ? 'increase' : data.eastWarmLayer.includes('↓') ? 'decrease' : '');

        // 수온약층 깊이
        updateCell('thermo-west-cell', data.westThermocline, data.westThermocline.includes('↑') ? 'decrease' : data.westThermocline.includes('↓') ? 'increase' : '');
        updateCell('thermo-east-cell', data.eastThermocline, data.eastThermocline.includes('↓') ? 'increase' : data.eastThermocline.includes('↑') ? 'decrease' : '');

        // 용승
        updateCell('upwelling-cell', data.upwelling, data.upwelling.includes('↓') ? 'weak' : data.upwelling.includes('↑') ? 'strong' : '');

        // 무역풍
        updateCell('wind-cell', data.wind, data.wind.includes('약한') ? 'weak' : data.wind.includes('강한') ? 'strong' : '');
    }
}

// 전역 인스턴스
let elninoController;
