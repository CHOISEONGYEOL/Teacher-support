// 물수지 평형 퀴즈 - 핵심 로직 (6변수 시스템)

// 변수 정의: 5개 플럭스 + 1개 저장량
const VARIABLES = {
    R: { name: 'R', label: '유출량', unit: '', type: 'flux' },
    E_l: { name: 'Eₗ', label: '육지 증발량', unit: '', type: 'flux' },
    P_l: { name: 'Pₗ', label: '육지 강수량', unit: '', type: 'flux' },
    E_o: { name: 'Eₒ', label: '해양 증발량', unit: '', type: 'flux' },
    P_o: { name: 'Pₒ', label: '해양 강수량', unit: '', type: 'flux' },
    W: { name: 'W', label: '대기 중 수증기', unit: '', type: 'stock' }
};

// 보존식 정의
const CONSERVATION_EQUATIONS = {
    land: {
        name: '육지 물수지',
        formula: 'Pₗ = Eₗ + R',
        description: '육지에서의 강수량은 증발량과 유출량의 합'
    },
    ocean: {
        name: '해양 물수지',
        formula: 'Eₒ = Pₒ + R',
        description: '해양에서의 증발량은 강수량과 유입량의 합'
    },
    atmosphere: {
        name: '대기 물수지 (정상상태)',
        formula: 'W = Eₗ + Eₒ = Pₗ + Pₒ',
        description: '대기 중 수증기량은 총 증발량 또는 총 강수량과 같다'
    }
};

// 균형 잡힌 데이터셋 생성 (6변수)
// 기준값: Pₗ=96, R=36, Eₗ=60, Eₒ=320, Pₒ=284, W=380
function generateBalancedDataset() {
    // 1. Eₗ (육지 증발량) 랜덤 생성: 40~80
    const E_l = Math.floor(Math.random() * 41) + 40;

    // 2. R (유출량) 랜덤 생성: 20~50
    const R = Math.floor(Math.random() * 31) + 20;

    // 3. Pₗ (육지 강수량) 계산: Pₗ = Eₗ + R
    const P_l = E_l + R;

    // 4. Pₒ (해양 강수량) 랜덤 생성: 200~350
    const P_o = Math.floor(Math.random() * 151) + 200;

    // 5. Eₒ (해양 증발량) 계산: Eₒ = Pₒ + R
    const E_o = P_o + R;

    // 6. W (대기 중 수증기) 계산: W = Pₗ + Pₒ = Eₗ + Eₒ (정상상태)
    const W = P_l + P_o;  // = E_l + E_o 와 같음

    return { R, E_l, P_l, E_o, P_o, W };
}

// 역산 공식 (빈칸 값 계산)
function solveForVariable(variableName, knownValues) {
    const { R, E_l, P_l, E_o, P_o, W } = knownValues;

    switch(variableName) {
        case 'R':
            // R = Pₗ - Eₗ 또는 R = Eₒ - Pₒ
            if (P_l !== undefined && E_l !== undefined) return P_l - E_l;
            if (E_o !== undefined && P_o !== undefined) return E_o - P_o;
            break;
        case 'E_l':
            // Eₗ = Pₗ - R 또는 Eₗ = W - Eₒ
            if (P_l !== undefined && R !== undefined) return P_l - R;
            if (W !== undefined && E_o !== undefined) return W - E_o;
            break;
        case 'P_l':
            // Pₗ = Eₗ + R 또는 Pₗ = W - Pₒ
            if (E_l !== undefined && R !== undefined) return E_l + R;
            if (W !== undefined && P_o !== undefined) return W - P_o;
            break;
        case 'E_o':
            // Eₒ = Pₒ + R 또는 Eₒ = W - Eₗ
            if (P_o !== undefined && R !== undefined) return P_o + R;
            if (W !== undefined && E_l !== undefined) return W - E_l;
            break;
        case 'P_o':
            // Pₒ = Eₒ - R 또는 Pₒ = W - Pₗ
            if (E_o !== undefined && R !== undefined) return E_o - R;
            if (W !== undefined && P_l !== undefined) return W - P_l;
            break;
        case 'W':
            // W = Pₗ + Pₒ 또는 W = Eₗ + Eₒ
            if (P_l !== undefined && P_o !== undefined) return P_l + P_o;
            if (E_l !== undefined && E_o !== undefined) return E_l + E_o;
            break;
    }
    return null;
}

// 문제에 사용할 빈칸 선택 (1~2개)
function selectBlanks(dataset) {
    const variableKeys = ['R', 'E_l', 'P_l', 'E_o', 'P_o', 'W'];
    const numBlanks = Math.random() < 0.6 ? 1 : 2;

    const blanks = [];
    const availableKeys = [...variableKeys];

    for (let i = 0; i < numBlanks && availableKeys.length > 0; i++) {
        const randomIndex = Math.floor(Math.random() * availableKeys.length);
        blanks.push(availableKeys[randomIndex]);
        availableKeys.splice(randomIndex, 1);
    }

    // 빈칸이 2개일 때, 풀 수 있는 조합인지 확인
    if (blanks.length === 2) {
        // 풀 수 없는 조합들: 같은 평형식에서 2개를 빼면 풀 수 없음
        const invalidPairs = [
            ['E_l', 'P_l'],  // 같은 육지 평형식 (R 없이)
            ['E_o', 'P_o'],  // 같은 해양 평형식 (R 없이)
        ];

        for (const pair of invalidPairs) {
            if (blanks.includes(pair[0]) && blanks.includes(pair[1])) {
                // 유효하지 않은 조합이면 1개만 선택
                return [blanks[0]];
            }
        }
    }

    return blanks;
}

// 힌트 생성
function generateHint(blankVariable, dataset) {
    switch(blankVariable) {
        case 'R':
            return '힌트: 육지 물수지 Pₗ = Eₗ + R 를 이용하세요. R = Pₗ - Eₗ';
        case 'E_l':
            return '힌트: 육지 물수지 Pₗ = Eₗ + R 를 이용하세요. Eₗ = Pₗ - R';
        case 'P_l':
            return '힌트: 육지 물수지 Pₗ = Eₗ + R 또는 대기 물수지 W = Pₗ + Pₒ 를 이용하세요.';
        case 'E_o':
            return '힌트: 해양 물수지 Eₒ = Pₒ + R 를 이용하세요.';
        case 'P_o':
            return '힌트: 해양 물수지 Eₒ = Pₒ + R 를 이용하세요. Pₒ = Eₒ - R';
        case 'W':
            return '힌트: 대기 물수지 W = Pₗ + Pₒ 또는 W = Eₗ + Eₒ 를 이용하세요.';
    }
    return '';
}

// 매력적인 오답 생성
function generateAttractiveWrongAnswers(correctAnswer, blankVariable, dataset) {
    const wrongAnswers = new Set();
    const { R, E_l, P_l, E_o, P_o, W } = dataset;

    // 총 강수량, 총 증발량
    const P_tot = P_l + P_o;
    const E_tot = E_l + E_o;

    // 1. 부호 실수 오답 (덧셈/뺄셈 혼동)
    switch(blankVariable) {
        case 'R':
            wrongAnswers.add(P_l + E_l);      // 덧셈 실수
            wrongAnswers.add(E_o + P_o);      // 덧셈 실수
            wrongAnswers.add(E_l - P_l);      // 순서 실수
            wrongAnswers.add(P_o - E_o);      // 순서 실수
            break;
        case 'E_l':
            wrongAnswers.add(P_l + R);        // 덧셈 실수
            wrongAnswers.add(R - P_l);        // 순서 실수
            wrongAnswers.add(E_o);            // 다른 증발량 혼동
            wrongAnswers.add(W - P_l);        // W에서 Pₗ 빼기 (잘못된 공식)
            break;
        case 'P_l':
            wrongAnswers.add(E_l - R);        // 뺄셈 실수
            wrongAnswers.add(R - E_l);        // 순서 실수
            wrongAnswers.add(P_o);            // 다른 강수량 혼동
            wrongAnswers.add(W - E_l);        // W에서 Eₗ 빼기 (잘못된 공식)
            break;
        case 'E_o':
            wrongAnswers.add(P_o - R);        // 뺄셈 실수
            wrongAnswers.add(R - P_o);        // 순서 실수
            wrongAnswers.add(E_l);            // 다른 증발량 혼동
            wrongAnswers.add(W - P_o);        // W에서 Pₒ 빼기 (잘못된 공식)
            break;
        case 'P_o':
            wrongAnswers.add(E_o + R);        // 덧셈 실수
            wrongAnswers.add(R - E_o);        // 순서 실수
            wrongAnswers.add(P_l);            // 다른 강수량 혼동
            wrongAnswers.add(W - E_o);        // W에서 Eₒ 빼기 (잘못된 공식)
            break;
        case 'W':
            wrongAnswers.add(P_l - P_o);      // 뺄셈 실수
            wrongAnswers.add(E_l - E_o);      // 뺄셈 실수
            wrongAnswers.add(P_l + E_l);      // 육지만 더함
            wrongAnswers.add(P_o + E_o);      // 해양만 더함
            wrongAnswers.add(E_o - E_l);      // 해양-육지 증발
            wrongAnswers.add(P_tot + R);      // R을 더함
            wrongAnswers.add(E_tot + R);      // R을 더함
            break;
    }

    // 2. 다른 변수 값 사용 실수
    [R, E_l, P_l, E_o, P_o].forEach(val => {
        if (val !== correctAnswer && val > 0) {
            wrongAnswers.add(val);
        }
    });

    // 3. W 혼동 오답
    if (blankVariable !== 'W') {
        wrongAnswers.add(W);
    }

    // 4. 근사값 오답
    wrongAnswers.add(Math.round(correctAnswer * 1.1));
    wrongAnswers.add(Math.round(correctAnswer * 0.9));
    wrongAnswers.add(correctAnswer + 10);
    wrongAnswers.add(correctAnswer - 10);

    // 음수와 정답 제거, 정렬
    const filtered = Array.from(wrongAnswers)
        .filter(v => v > 0 && v !== correctAnswer && Number.isInteger(v))
        .sort((a, b) => Math.abs(a - correctAnswer) - Math.abs(b - correctAnswer));

    // 상위 4개 선택
    return filtered.slice(0, 4);
}

// 5지선다 보기 생성
function generateChoices(correctAnswer, wrongAnswers) {
    // 오답이 4개 미만이면 랜덤 값으로 채우기
    while (wrongAnswers.length < 4) {
        const offset = Math.floor(Math.random() * 40) - 20;
        const newWrong = correctAnswer + offset;
        if (newWrong > 0 && newWrong !== correctAnswer && !wrongAnswers.includes(newWrong)) {
            wrongAnswers.push(newWrong);
        }
    }

    const choices = [correctAnswer, ...wrongAnswers.slice(0, 4)];

    // 셔플
    for (let i = choices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [choices[i], choices[j]] = [choices[j], choices[i]];
    }

    return choices;
}

// 문제 생성
function generateProblem() {
    const dataset = generateBalancedDataset();
    const blanks = selectBlanks(dataset);

    // 빈칸 정보와 정답 저장
    const answers = {};
    const hints = {};

    blanks.forEach(blank => {
        answers[blank] = dataset[blank];
        hints[blank] = generateHint(blank, dataset);
    });

    // 표시용 데이터 (빈칸은 null로)
    const displayData = { ...dataset };
    blanks.forEach(blank => {
        displayData[blank] = null;
    });

    return {
        dataset,
        displayData,
        blanks,
        answers,
        hints
    };
}

// 보존식 검증
function verifyConservation(data) {
    const { R, E_l, P_l, E_o, P_o, W } = data;

    const P_tot = P_l + P_o;
    const E_tot = E_l + E_o;

    const landBalance = P_l - E_l - R;
    const oceanBalance = E_o - P_o - R;
    const atmosphereBalance = W - P_tot;  // W = Pₗ + Pₒ
    const evapCheck = W - E_tot;          // W = Eₗ + Eₒ

    return {
        land: {
            equation: `Pₗ - Eₗ - R = ${P_l} - ${E_l} - ${R} = ${landBalance}`,
            balanced: landBalance === 0
        },
        ocean: {
            equation: `Eₒ - Pₒ - R = ${E_o} - ${P_o} - ${R} = ${oceanBalance}`,
            balanced: oceanBalance === 0
        },
        atmosphere: {
            equation: `W = Pₗ + Pₒ → ${W} = ${P_l} + ${P_o} = ${P_tot}`,
            balanced: atmosphereBalance === 0
        },
        evaporation: {
            equation: `W = Eₗ + Eₒ → ${W} = ${E_l} + ${E_o} = ${E_tot}`,
            balanced: evapCheck === 0
        }
    };
}

// 내보내기
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        VARIABLES,
        CONSERVATION_EQUATIONS,
        generateBalancedDataset,
        solveForVariable,
        selectBlanks,
        generateHint,
        generateAttractiveWrongAnswers,
        generateChoices,
        generateProblem,
        verifyConservation
    };
}
