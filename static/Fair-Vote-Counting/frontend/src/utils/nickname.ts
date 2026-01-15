/**
 * 랜덤 동물 닉네임 생성기
 * 형태: [형용사] + [동물]
 * 예: "행복한 쿼카", "졸린 호랑이"
 */

const ADJECTIVES = [
  "행복한", "즐거운", "신나는", "활기찬", "용감한",
  "지혜로운", "친절한", "씩씩한", "귀여운", "멋진",
  "똑똑한", "재빠른", "든든한", "포근한", "상냥한",
  "호기심많은", "차분한", "당당한", "빛나는", "따뜻한",
  "졸린", "배고픈", "심심한", "궁금한", "설레는",
  "수줍은", "엉뚱한", "느긋한", "부지런한", "꼼꼼한",
  "재치있는", "유쾌한", "발랄한", "산뜻한", "청량한",
  "포동포동", "말랑말랑", "반짝이는", "신비로운", "깜찍한"
];

const ANIMALS = [
  "쿼카", "호랑이", "펭귄", "토끼", "고양이",
  "강아지", "판다", "코알라", "사자", "여우",
  "다람쥐", "햄스터", "수달", "해달", "북극곰",
  "돌고래", "앵무새", "부엉이", "고슴도치", "라쿤",
  "카피바라", "알파카", "미어캣", "레서판다", "치타",
  "기린", "코끼리", "얼룩말", "캥거루", "오리",
  "병아리", "참새", "독수리", "공작새", "플라밍고",
  "거북이", "개구리", "도마뱀", "나비", "벌새"
];

/**
 * 랜덤 닉네임 생성
 * @param existingNicknames 이미 사용 중인 닉네임 Set (중복 방지)
 * @returns 생성된 닉네임
 */
export function generateNickname(existingNicknames: Set<string> = new Set()): string {
  const maxAttempts = ADJECTIVES.length * ANIMALS.length;
  let attempts = 0;

  while (attempts < maxAttempts) {
    const adjective = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
    const animal = ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
    const nickname = `${adjective} ${animal}`;

    if (!existingNicknames.has(nickname)) {
      return nickname;
    }
    attempts++;
  }

  // 모든 조합 소진 시 숫자 추가
  const baseNickname = `${ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)]} ${ANIMALS[Math.floor(Math.random() * ANIMALS.length)]}`;
  let counter = 1;
  while (existingNicknames.has(`${baseNickname} ${counter}`)) {
    counter++;
  }
  return `${baseNickname} ${counter}`;
}

/**
 * 가능한 총 닉네임 조합 수
 */
export function getTotalCombinations(): number {
  return ADJECTIVES.length * ANIMALS.length;
}
