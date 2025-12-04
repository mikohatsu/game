/**
 * 시설 업그레이드 마스터 데이터
 */

export const upgrades = [
  // 장비 (Equipment) - 정밀도 및 효율
  {
    id: 'eq_lv1',
    name: '정밀 밸브',
    category: 'equipment',
    level: 1,
    cost: 500,
    effect: '오차 범위 보정 +0.5%',
    description: '온도와 압력을 더 정밀하게 조절할 수 있게 해줍니다.',
    icon: '🔧'
  },
  {
    id: 'eq_lv2',
    name: '디지털 계기판',
    category: 'equipment',
    level: 2,
    cost: 1500,
    effect: '슬라이더 수치 소수점 첫째 자리까지 표시',
    description: '더 정확한 수치를 확인할 수 있게 해줍니다.',
    icon: '📊'
  },
  {
    id: 'eq_lv3',
    name: '자동 교반기',
    category: 'equipment',
    level: 3,
    cost: 3000,
    effect: '농도(C) 설정 시 오차 0% 고정',
    description: '농도 설정을 완벽하게 맞춰줍니다.',
    icon: '🌀'
  },
  {
    id: 'eq_lv4',
    name: '안정화 챔버',
    category: 'equipment',
    level: 4,
    cost: 5000,
    effect: "오염도에 의한 '슬라이더 노이즈' 면역",
    description: '오염도가 높아도 안정적인 실험이 가능합니다.',
    icon: '🛡️'
  },

  // 도서관 (Archive) - 탐사 효율
  {
    id: 'arc_lv1',
    name: '책장 정리',
    category: 'archive',
    level: 1,
    cost: 300,
    effect: '탐사 성공률 40% → 50%',
    description: '문서를 더 쉽게 찾을 수 있게 정리합니다.',
    icon: '📚'
  },
  {
    id: 'arc_lv2',
    name: '고대어 사전',
    category: 'archive',
    level: 2,
    cost: 1000,
    effect: '암호화 단서 해석 힌트 제공',
    description: '암호화된 단서의 키워드를 강조해줍니다.',
    icon: '📖'
  },
  {
    id: 'arc_lv3',
    name: '비서 골렘',
    category: 'archive',
    level: 3,
    cost: 2500,
    effect: '탐사 소모 AP 3 → 2',
    description: '문서 탐사를 도와주는 골렘을 고용합니다.',
    icon: '🤖'
  },
  {
    id: 'arc_lv4',
    name: '복원 마법',
    category: 'archive',
    level: 4,
    cost: 6000,
    effect: '탐사 시 대성공(정답 획득) 확률 10% → 25%',
    description: '훼손된 문서를 복원하는 강력한 마법입니다.',
    icon: '✨'
  },

  // 실험실 환경 (Environment) - 오염 및 안전
  {
    id: 'env_lv1',
    name: '환풍기',
    category: 'environment',
    level: 1,
    cost: 400,
    effect: '매일 아침 오염도 자동 -5',
    description: '실험실의 오염된 공기를 배출합니다.',
    icon: '💨'
  },
  {
    id: 'env_lv2',
    name: '배수 정화 시스템',
    category: 'environment',
    level: 2,
    cost: 1200,
    effect: '실패작 생성 시 오염도 증가량 절반 감소',
    description: '실패작을 안전하게 처리합니다.',
    icon: '🚰'
  },
  {
    id: 'env_lv3',
    name: '에테르 필터',
    category: 'environment',
    level: 3,
    cost: 3500,
    effect: '조합 성공 시 오염도 증가 0 (S/A/B등급 한정)',
    description: '오염 물질을 완벽하게 걸러냅니다.',
    icon: '🔬'
  },
  {
    id: 'env_lv4',
    name: '긴급 차폐막',
    category: 'environment',
    level: 4,
    cost: 8000,
    effect: '돌연변이 실험 실패 시 폭발(게임오버) 방지',
    description: '치명적인 사고를 막아주는 마지막 보호막입니다.',
    icon: '🛡️'
  },
];

/**
 * 카테고리별 업그레이드 가져오기
 * @param {string} category
 * @returns {Object[]}
 */
export function getUpgradesByCategory(category) {
  return upgrades.filter(u => u.category === category);
}

/**
 * ID로 업그레이드 찾기
 * @param {string} id
 * @returns {Object | undefined}
 */
export function getUpgradeById(id) {
  return upgrades.find(u => u.id === id);
}
