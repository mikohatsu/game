/**
 * 게임의 핵심 로직 함수들
 */

/**
 * 편차율 계산 함수
 * @param {Object} input - 입력 파라미터
 * @param {number} input.temperature
 * @param {number} input.pressure
 * @param {number} input.concentration
 * @param {Object} target - 목표 파라미터
 * @param {number} target.temperature
 * @param {number} target.pressure
 * @param {number} target.concentration
 * @returns {number} 평균 편차율 (%)
 */
export function calculateDeviation(input, target) {
  const tDev = Math.abs(input.temperature - target.temperature) / (target.temperature || 1) * 100;
  const pDev = Math.abs(input.pressure - target.pressure) / (target.pressure || 1) * 100;
  const cDev = Math.abs(input.concentration - target.concentration) / (target.concentration || 1) * 100;

  return (tDev + pDev + cDev) / 3;
}

/**
 * 편차율에 따른 등급 판정
 * @param {number} deviation - 편차율 (%)
 * @returns {'S' | 'A' | 'B' | 'C' | 'F'} 등급
 */
export function getGrade(deviation) {
  if (deviation < 1.0) return 'S';
  if (deviation < 3.0) return 'A';
  if (deviation < 6.0) return 'B';
  if (deviation < 10.0) return 'C';
  return 'F';
}

/**
 * 등급에 따른 판매가 배율
 * @param {'S' | 'A' | 'B' | 'C' | 'F'} grade
 * @returns {number} 배율
 */
export function getGradeMultiplier(grade) {
  const multipliers = {
    'S': 2.0,
    'A': 1.5,
    'B': 1.0,
    'C': 0.5,
    'F': 0.0
  };
  return multipliers[grade];
}

/**
 * 등급에 따른 오염도 증가량
 * @param {'S' | 'A' | 'B' | 'C' | 'F'} grade
 * @returns {number} 오염도 증가량
 */
export function getPollutionIncrease(grade) {
  const increases = {
    'S': 1,
    'A': 3,
    'B': 5,
    'C': 10,
    'F': 25
  };
  return increases[grade];
}

/**
 * 오염도 레벨 계산
 * @param {number} pollution - 현재 오염도
 * @returns {0 | 1 | 2 | 3} 오염도 레벨
 */
export function getPollutionLevel(pollution) {
  if (pollution < 50) return 0;
  if (pollution < 100) return 1;
  if (pollution < 150) return 2;
  return 3;
}

/**
 * 오염도 레벨에 따른 효과 설명
 * @param {number} level
 * @returns {string}
 */
export function getPollutionEffect(level) {
  const effects = {
    0: '안정 - 정상 작동',
    1: '경고 - 기계 내구도 소모율 10% 증가',
    2: '위험 - 슬라이더 노이즈 발생 (±1% 변동)',
    3: '돌연변이 활성화 - 돌연변이 생성 확률 5%'
  };
  return effects[level];
}

/**
 * 돌연변이 발생 체크
 * @param {number} pollution - 현재 오염도
 * @param {'S' | 'A' | 'B' | 'C' | 'F'} grade - 등급
 * @returns {boolean} 돌연변이 발생 여부
 */
export function checkMutation(pollution, grade) {
  if (pollution < 150) return false;
  if (grade === 'F') return false; // 실패시 돌연변이 없음

  return Math.random() < 0.05; // 5% 확률
}

/**
 * 임대료 계산
 * @param {number} week - 주차
 * @returns {number} 임대료
 */
export function calculateRent(week) {
  return Math.floor(500 * Math.pow(week, 2.5));
}

/**
 * 판매 가격 계산
 * @param {number} baseValue - 기본 가격
 * @param {'S' | 'A' | 'B' | 'C' | 'F'} grade - 등급
 * @returns {number} 최종 판매가
 */
export function calculateSellPrice(baseValue, grade) {
  const multiplier = getGradeMultiplier(grade);
  const randomFactor = 1 + (Math.random() * 0.2 - 0.1); // ±10%
  return Math.floor(baseValue * multiplier * randomFactor);
}

/**
 * 슬라이더 노이즈 적용 (오염도 Lv.2 이상)
 * @param {number} value - 원래 값
 * @param {number} pollution - 현재 오염도
 * @returns {number} 노이즈가 적용된 값
 */
export function applySliderNoise(value, pollution) {
  if (pollution < 100) return value;

  const noise = (Math.random() * 2 - 1); // -1 ~ +1%
  return value + noise;
}

/**
 * 등급에 따른 색상 반환
 * @param {'S' | 'A' | 'B' | 'C' | 'F'} grade
 * @returns {string} Tailwind CSS 색상 클래스
 */
export function getGradeColor(grade) {
  const colors = {
    'S': 'text-yellow-400',
    'A': 'text-green-400',
    'B': 'text-blue-400',
    'C': 'text-orange-400',
    'F': 'text-red-400'
  };
  return colors[grade];
}

/**
 * 등급에 따른 배경색 반환
 * @param {'S' | 'A' | 'B' | 'C' | 'F'} grade
 * @returns {string} Tailwind CSS 배경색 클래스
 */
export function getGradeBgColor(grade) {
  const colors = {
    'S': 'bg-yellow-500/20',
    'A': 'bg-green-500/20',
    'B': 'bg-blue-500/20',
    'C': 'bg-orange-500/20',
    'F': 'bg-red-500/20'
  };
  return colors[grade];
}
