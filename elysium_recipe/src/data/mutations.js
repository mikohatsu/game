/**
 * 돌연변이 아이템 데이터
 * 오염도 Lv.3(150+)에서 5% 확률로 생성
 */

export const mutations = [
  {
    id: 'MUT-01',
    name: '변이된 정제수',
    baseRecipeId: 'T1-01',
    icon: '💧',
    baseValue: 150,
    description: '오염된 에너지가 스며든 물. 기묘한 빛을 발한다.',
    tier: 1
  },
  {
    id: 'MUT-02',
    name: '혼돈의 화약',
    baseRecipeId: 'T2-02',
    icon: '💥',
    baseValue: 750,
    description: '예측 불가능한 폭발력을 가진 위험한 화약.',
    tier: 2
  },
  {
    id: 'MUT-03',
    name: '불안정한 마나 가루',
    baseRecipeId: 'T2-08',
    icon: '✨',
    baseValue: 1050,
    description: '마나석이 오염되어 불안정해졌다. 강력하지만 위험하다.',
    tier: 2
  },
  {
    id: 'MUT-04',
    name: '타락한 회복 물약',
    baseRecipeId: 'T2-10',
    icon: '🖤',
    baseValue: 900,
    description: '치유 대신 이상한 힘을 부여하는 검은 물약.',
    tier: 2
  },
  {
    id: 'MUT-05',
    name: '왜곡된 금',
    baseRecipeId: 'T3-01',
    icon: '🪙',
    baseValue: 1500,
    description: '시간과 공간이 왜곡된 듯한 황금빛 금속.',
    tier: 3
  },
  {
    id: 'MUT-06',
    name: '광기의 물약',
    baseRecipeId: 'T3-02',
    icon: '🔮',
    baseValue: 1800,
    description: '초인적인 힘과 함께 광기를 안겨주는 물약.',
    tier: 3
  },
  {
    id: 'MUT-07',
    name: '공허의 실',
    baseRecipeId: 'T3-04',
    icon: '🕸️',
    baseValue: 1950,
    description: '차원의 틈을 꿰맬 수 있는 신비한 실.',
    tier: 3
  },
  {
    id: 'MUT-08',
    name: '현자의 저주',
    baseRecipeId: 'T3-06',
    icon: '💀',
    baseValue: 2100,
    description: '현자의 소금이 오염되어 저주받은 물질이 되었다.',
    tier: 3
  },
  {
    id: 'MUT-09',
    name: '혼돈의 불사조 재',
    baseRecipeId: 'T4-01',
    icon: '🔥',
    baseValue: 6000,
    description: '부활과 파괴를 동시에 가져오는 혼돈의 재.',
    tier: 4
  },
  {
    id: 'MUT-10',
    name: '폭주하는 골렘 코어',
    baseRecipeId: 'T4-02',
    icon: '💢',
    baseValue: 6600,
    description: '제어 불능 상태의 골렘 심장. 엄청난 에너지를 방출한다.',
    tier: 4
  },
];

/**
 * 레시피 ID로 돌연변이 아이템 찾기
 * @param {string} recipeId
 * @returns {Object | null}
 */
export function getMutationByRecipeId(recipeId) {
  return mutations.find(m => m.baseRecipeId === recipeId) || null;
}

/**
 * Tier로 돌연변이 필터링
 * @param {number} tier
 * @returns {Object[]}
 */
export function getMutationsByTier(tier) {
  return mutations.filter(m => m.tier === tier);
}
