// 복사평형 퀴즈 게임 - 핵심 로직 (공통 모듈)

// 변수 키와 한글 이름 매핑
const variableNames = {
    S: '태양 복사 총량',
    Ra: '대기 반사',
    Rs: '지표 반사',
    Aa: '태양 복사 대기 흡수',
    As: '태양 복사 지표 흡수',
    H: '대류·전도',
    LE: '잠열',
    Lup: '지표 복사 에너지',
    Lspace: '지표 복사 우주 방출',
    LaSpace: '대기 복사 우주 방출',
    LaSfc: '대기 재복사'
};

// 힌트 공식 매핑
const hintFormulas = {
    // 태양 파트
    S: {
        equation: 'S = Rₐ + Rₛ + Aₐ + Aₛ',
        explanation: '태양 복사 총량은 반사와 흡수의 합입니다.'
    },
    Ra: {
        equation: 'Rₐ = S - Rₛ - Aₐ - Aₛ',
        explanation: '대기 반사 = 총량 - 지표반사 - 대기흡수 - 지표흡수'
    },
    Rs: {
        equation: 'Rₛ = S - Rₐ - Aₐ - Aₛ',
        explanation: '지표 반사 = 총량 - 대기반사 - 대기흡수 - 지표흡수'
    },
    Aa: {
        equation: 'Aₐ = S - Rₐ - Rₛ - Aₛ',
        explanation: '대기 흡수 = 총량 - 반사들 - 지표흡수'
    },
    As: {
        equation: 'Aₛ = S - Rₐ - Rₛ - Aₐ',
        explanation: '지표 흡수 = 총량 - 반사들 - 대기흡수'
    },
    // 지표 파트
    H: {
        equation: 'H = Aₛ + L(대기→지표) - L↑ - L(우주) - LE',
        explanation: '지표 평형식을 이용: 유입 - 다른 유출들'
    },
    LE: {
        equation: 'LE = Aₛ + L(대기→지표) - L↑ - L(우주) - H',
        explanation: '지표 평형식을 이용: 유입 - 다른 유출들'
    },
    Lup: {
        equation: 'L↑ = Aₛ + L(대기→지표) - L(우주) - H - LE',
        explanation: '지표 평형식을 이용: 유입 - 다른 유출들'
    },
    Lspace: {
        equation: 'L(우주) = Aₛ + L(대기→지표) - L↑ - H - LE',
        explanation: '지표 평형식을 이용: 유입 - 다른 유출들'
    },
    // 대기 파트
    LaSpace: {
        equation: 'L(대기→우주) = Aₐ + L↑ + H + LE - L(대기→지표)',
        explanation: '대기 평형식을 이용: 유입 - 대기 재복사'
    },
    LaSfc: {
        equation: 'L(대기→지표) = Aₐ + L↑ + H + LE - L(대기→우주)',
        explanation: '대기 평형식을 이용: 유입 - 우주 방출'
    }
};

// 난이도별 설정
const difficultySettings = {
    easy: {
        unknownOptions: ['Ra', 'Rs', 'Aa', 'As', 'LE', 'H', 'LaSfc', 'LaSpace'],
        rangeMultiplier: 1
    },
    normal: {
        unknownOptions: ['S', 'Ra', 'Rs', 'Aa', 'As', 'H', 'LE', 'Lup', 'Lspace', 'LaSpace', 'LaSfc'],
        rangeMultiplier: 1.2
    },
    hard: {
        unknownOptions: ['S', 'Ra', 'Rs', 'Aa', 'As', 'H', 'LE', 'Lup', 'Lspace', 'LaSpace', 'LaSfc'],
        rangeMultiplier: 2
    }
};

/**
 * 범위 내 랜덤 값 생성
 */
function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
}

/**
 * 완전한 에너지 균형 데이터셋 생성
 */
function generateBalancedDataset(difficulty = 'easy') {
    const settings = difficultySettings[difficulty];
    const mult = settings.rangeMultiplier;

    let attempts = 0;
    const maxAttempts = 100;

    while (attempts < maxAttempts) {
        attempts++;

        const S = Math.floor(randomInRange(90, 120) * mult);
        const Ra = Math.floor(randomInRange(S * 0.15, S * 0.30));
        const Rs = Math.floor(randomInRange(S * 0.03, S * 0.10));
        const Aa = Math.floor(randomInRange(S * 0.15, S * 0.30));
        const As = S - Ra - Rs - Aa;

        if (As < 0) continue;

        const H = Math.floor(randomInRange(5, 15) * mult);
        const LE = Math.floor(randomInRange(15, 30) * mult);
        const Lup = Math.floor(randomInRange(90, 120) * mult);

        const maxLspace = Math.min(20 * mult, Aa + As - 1);
        if (maxLspace < 1) continue;
        const Lspace = Math.floor(randomInRange(2, Math.min(15, maxLspace)) * mult / mult);

        const LaSpace = Aa + As - Lspace;
        if (LaSpace < 0) continue;

        const LaSfc = Aa + Lup + H + LE - LaSpace;
        if (LaSfc < 0) continue;

        const surfaceIn = As + LaSfc;
        const surfaceOut = Lup + Lspace + H + LE;

        if (surfaceIn !== surfaceOut) {
            const adjustedLup = As + LaSfc - Lspace - H - LE;
            if (adjustedLup < 50 * mult || adjustedLup > 150 * mult) continue;

            const newLaSfc = Aa + adjustedLup + H + LE - LaSpace;
            if (newLaSfc < 0) continue;

            const newSurfaceIn = As + newLaSfc;
            const newSurfaceOut = adjustedLup + Lspace + H + LE;
            if (newSurfaceIn !== newSurfaceOut) continue;

            return {
                S, Ra, Rs, Aa, As, H, LE,
                Lup: adjustedLup, Lspace, LaSpace,
                LaSfc: newLaSfc
            };
        }

        return { S, Ra, Rs, Aa, As, H, LE, Lup, Lspace, LaSpace, LaSfc };
    }

    return {
        S: 100, Ra: 25, Rs: 5, Aa: 25, As: 45,
        H: 8, LE: 21, Lup: 100, Lspace: 4,
        LaSpace: 66, LaSfc: 88
    };
}

/**
 * 보존식 검증
 */
function verifyConservation(data) {
    const solarBalance = data.S - (data.Ra + data.Rs + data.Aa + data.As);
    const surfaceBalance = (data.As + data.LaSfc) - (data.Lup + data.Lspace + data.H + data.LE);
    const atmosphereBalance = (data.Aa + data.Lup + data.H + data.LE) - (data.LaSpace + data.LaSfc);

    return {
        solar: solarBalance === 0,
        surface: surfaceBalance === 0,
        atmosphere: atmosphereBalance === 0,
        residuals: { solar: solarBalance, surface: surfaceBalance, atmosphere: atmosphereBalance }
    };
}

/**
 * 매력적인 오답 생성 (객관식용)
 *
 * 핵심 아이디어: 학생들이 자주 하는 실수를 기반으로 오답 생성
 * - 잘못된 공식 적용 (덧셈/뺄셈 혼동)
 * - 한 항목을 빠뜨리거나 두 번 더함
 * - 다른 보존식 사용
 * - 부호 실수
 */
function generateAttractiveWrongAnswers(correctAnswer, unknownKey, problemData) {
    const wrongAnswers = new Set();

    // 1. 잘못된 공식 적용으로 인한 오답들
    const formulaBasedWrong = generateFormulaBasedWrong(unknownKey, problemData);
    formulaBasedWrong.forEach(w => wrongAnswers.add(w));

    // 2. 한 항목 누락/중복 오답
    const omissionWrong = generateOmissionWrong(unknownKey, problemData);
    omissionWrong.forEach(w => wrongAnswers.add(w));

    // 3. 부호 실수 오답
    const signErrorWrong = generateSignErrorWrong(correctAnswer, unknownKey, problemData);
    signErrorWrong.forEach(w => wrongAnswers.add(w));

    // 정답 제거
    wrongAnswers.delete(correctAnswer);

    // 음수 제거
    const validWrong = Array.from(wrongAnswers).filter(w => w > 0 && w !== correctAnswer);

    // 오답이 부족하면 근처 값으로 채움 (하지만 단순 ±1~3은 피함)
    while (validWrong.length < 4) {
        // 정답의 10~30% 범위 내에서 오답 생성
        const offset = Math.floor(correctAnswer * (0.1 + Math.random() * 0.2)) * (Math.random() > 0.5 ? 1 : -1);
        const candidate = correctAnswer + offset;

        if (candidate > 0 && candidate !== correctAnswer && !validWrong.includes(candidate)) {
            validWrong.push(candidate);
        }
    }

    // 4개만 선택 (가장 매력적인 것 우선)
    return validWrong.slice(0, 4);
}

/**
 * 잘못된 공식 적용 오답 생성
 */
function generateFormulaBasedWrong(unknownKey, data) {
    const wrongs = [];

    switch(unknownKey) {
        // 태양 파트 - 덧셈을 해야 하는데 뺄셈을 하거나 반대
        case 'S':
            // S = Ra + Rs + Aa + As 인데 하나를 빼버림
            wrongs.push(data.Ra + data.Rs + data.Aa);  // As 누락
            wrongs.push(data.Ra + data.Rs + data.As);  // Aa 누락
            wrongs.push(data.Ra + data.Aa + data.As);  // Rs 누락
            break;

        case 'Ra':
            // Ra = S - Rs - Aa - As 인데 부호 실수
            wrongs.push(data.S - data.Rs - data.Aa + data.As);  // As를 더함
            wrongs.push(data.S - data.Rs + data.Aa - data.As);  // Aa를 더함
            wrongs.push(data.S + data.Rs - data.Aa - data.As);  // Rs를 더함
            break;

        case 'Rs':
            wrongs.push(data.S - data.Ra - data.Aa + data.As);
            wrongs.push(data.S - data.Ra + data.Aa - data.As);
            wrongs.push(data.S + data.Ra - data.Aa - data.As);
            break;

        case 'Aa':
            wrongs.push(data.S - data.Ra - data.Rs + data.As);
            wrongs.push(data.S - data.Ra + data.Rs - data.As);
            wrongs.push(data.S + data.Ra - data.Rs - data.As);
            break;

        case 'As':
            wrongs.push(data.S - data.Ra - data.Rs + data.Aa);
            wrongs.push(data.S - data.Ra + data.Rs - data.Aa);
            wrongs.push(data.S + data.Ra - data.Rs - data.Aa);
            break;

        // 지표 파트
        case 'H':
            // H = As + LaSfc - Lup - Lspace - LE
            wrongs.push(data.As + data.LaSfc - data.Lup - data.Lspace + data.LE);  // LE 부호 실수
            wrongs.push(data.As + data.LaSfc + data.Lup - data.Lspace - data.LE);  // Lup 부호 실수
            wrongs.push(data.As - data.LaSfc - data.Lup - data.Lspace - data.LE);  // LaSfc 부호 실수
            break;

        case 'LE':
            wrongs.push(data.As + data.LaSfc - data.Lup - data.Lspace + data.H);
            wrongs.push(data.As + data.LaSfc + data.Lup - data.Lspace - data.H);
            wrongs.push(data.As - data.LaSfc - data.Lup - data.Lspace - data.H);
            break;

        case 'Lup':
            wrongs.push(data.As + data.LaSfc + data.Lspace - data.H - data.LE);  // Lspace 부호 실수
            wrongs.push(data.As - data.LaSfc - data.Lspace - data.H - data.LE);  // LaSfc 부호 실수
            wrongs.push(data.As + data.LaSfc - data.Lspace + data.H - data.LE);  // H 부호 실수
            break;

        case 'Lspace':
            wrongs.push(data.As + data.LaSfc + data.Lup - data.H - data.LE);  // Lup 부호 실수
            wrongs.push(data.As - data.LaSfc - data.Lup - data.H - data.LE);
            wrongs.push(data.As + data.LaSfc - data.Lup + data.H - data.LE);
            break;

        // 대기 파트
        case 'LaSpace':
            // LaSpace = Aa + Lup + H + LE - LaSfc
            wrongs.push(data.Aa + data.Lup + data.H + data.LE + data.LaSfc);  // LaSfc 부호 실수
            wrongs.push(data.Aa + data.Lup + data.H - data.LE - data.LaSfc);  // LE 부호 실수
            wrongs.push(data.Aa - data.Lup + data.H + data.LE - data.LaSfc);  // Lup 부호 실수
            // TOA 평형 혼동: Aa + As - Lspace
            wrongs.push(data.Aa + data.As + data.Lspace);  // 뺄셈을 덧셈으로
            break;

        case 'LaSfc':
            // LaSfc = Aa + Lup + H + LE - LaSpace
            wrongs.push(data.Aa + data.Lup + data.H + data.LE + data.LaSpace);  // LaSpace 부호 실수
            wrongs.push(data.Aa + data.Lup + data.H - data.LE - data.LaSpace);
            wrongs.push(data.Aa - data.Lup + data.H + data.LE - data.LaSpace);
            // 지표 평형으로 잘못 품: Lup + Lspace + H + LE - As
            wrongs.push(data.Lup + data.Lspace + data.H + data.LE + data.As);  // 부호 반대
            break;
    }

    return wrongs.filter(w => w > 0);
}

/**
 * 항목 누락/중복 오답 생성
 */
function generateOmissionWrong(unknownKey, data) {
    const wrongs = [];

    switch(unknownKey) {
        case 'S':
            // 하나만 더함
            wrongs.push(data.Ra + data.Rs);
            wrongs.push(data.Aa + data.As);
            break;

        case 'LE':
        case 'H':
            // 대류/전도와 잠열을 합침
            wrongs.push(data.H + data.LE);
            break;

        case 'Lup':
            // 지표복사와 우주직행 합침
            wrongs.push(data.Lup + data.Lspace);
            break;

        case 'LaSpace':
        case 'LaSfc':
            // 대기복사 두 항목 혼동
            wrongs.push(data.LaSpace + data.LaSfc);
            break;
    }

    return wrongs.filter(w => w > 0);
}

/**
 * 부호 실수 기반 오답
 */
function generateSignErrorWrong(correctAnswer, unknownKey, data) {
    const wrongs = [];

    // 특정 항목들의 합/차이를 정답에 더하거나 빼서 오답 생성
    const adjustments = [];

    switch(unknownKey) {
        case 'Ra':
        case 'Rs':
        case 'Aa':
        case 'As':
            // 다른 반사/흡수 항목의 2배를 더하거나 뺌
            adjustments.push(data.Ra * 2);
            adjustments.push(data.Rs * 2);
            adjustments.push(data.Aa * 2);
            adjustments.push(data.As * 2);
            break;

        case 'H':
        case 'LE':
            // 대류/전도와 잠열의 차이
            adjustments.push(Math.abs(data.H - data.LE));
            adjustments.push(data.H + data.LE);
            break;

        case 'Lup':
        case 'Lspace':
            adjustments.push(data.Lspace * 2);
            adjustments.push(Math.abs(data.Lup - data.Lspace));
            break;

        case 'LaSpace':
        case 'LaSfc':
            adjustments.push(Math.abs(data.LaSpace - data.LaSfc));
            adjustments.push(data.LaSpace);
            adjustments.push(data.LaSfc);
            break;
    }

    adjustments.forEach(adj => {
        if (adj !== 0) {
            wrongs.push(correctAnswer + adj);
            wrongs.push(correctAnswer - adj);
        }
    });

    return wrongs.filter(w => w > 0 && w !== correctAnswer);
}

/**
 * 5지선다 보기 생성 (정답 1개 + 매력적인 오답 4개)
 */
function generateChoices(correctAnswer, unknownKey, problemData) {
    const wrongAnswers = generateAttractiveWrongAnswers(correctAnswer, unknownKey, problemData);

    // 정답과 오답 4개 합치기
    const choices = [correctAnswer, ...wrongAnswers.slice(0, 4)];

    // 셔플
    for (let i = choices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [choices[i], choices[j]] = [choices[j], choices[i]];
    }

    return choices;
}
