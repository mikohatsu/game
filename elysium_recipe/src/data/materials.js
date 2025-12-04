/**
 * 원자재 마스터 데이터
 * 화합물단서전량.md 파일에서 추출
 */

export const materials = [
  // Tier 1 재료
  { id: 'raw_water', name: '오염된 물', icon: '💧', basePrice: 10, tier: 1, description: '도시의 하수구에서 퍼올린 물. 정제가 시급해 보입니다.' },
  { id: 'charcoal', name: '숯', icon: '🔥', basePrice: 15, tier: 1, description: '타다 남은 검은 덩어리. 불순물을 제거하는 데 쓰입니다.' },
  { id: 'raw_ore', name: '원석', icon: '🪨', basePrice: 25, tier: 1, description: '금속 성분이 포함된 거친 돌덩이.' },
  { id: 'acid', name: '산성 용액', icon: '🧪', basePrice: 20, tier: 1, description: '피부에 닿으면 따끔거리는 묽은 산.' },
  { id: 'sand', name: '모래', icon: '🏖️', basePrice: 5, tier: 1, description: '유리를 만들 수 있는 고운 모래.' },
  { id: 'heat_stone', name: '열석', icon: '🔴', basePrice: 18, tier: 1, description: '만지면 따뜻한 붉은 돌.' },
  { id: 'seawater', name: '바닷물', icon: '🌊', basePrice: 8, tier: 1, description: '짠 맛이 나는 바다의 물.' },
  { id: 'wood', name: '나무', icon: '🪵', basePrice: 12, tier: 1, description: '말린 장작.' },
  { id: 'grain', name: '곡물', icon: '🌾', basePrice: 15, tier: 1, description: '발효에 사용되는 곡식.' },
  { id: 'yeast', name: '효모', icon: '🍄', basePrice: 10, tier: 1, description: '발효를 돕는 미생물.' },
  { id: 'volcanic_stone', name: '화산석', icon: '🌋', basePrice: 22, tier: 1, description: '화산 근처에서 채취한 검은 돌.' },
  { id: 'bone_powder', name: '뼈가루', icon: '🦴', basePrice: 14, tier: 1, description: '분쇄된 동물의 뼈.' },
  { id: 'humus', name: '부엽토', icon: '🟫', basePrice: 8, tier: 1, description: '썩은 나뭇잎이 쌓여 만들어진 흙.' },
  { id: 'slime_gel', name: '슬라임 젤', icon: '🟢', basePrice: 16, tier: 1, description: '끈적거리는 젤 상태의 물질.' },

  // Tier 2 재료
  { id: 'lemon', name: '레몬', icon: '🍋', basePrice: 30, tier: 2, description: '보기 드문 신선한 과일. 강한 산미가 특징.' },
  { id: 'mana_fragment', name: '마나석 파편', icon: '💎', basePrice: 150, tier: 2, description: '푸른 빛을 내는 신비한 광석 조각.' },
  { id: 'herb', name: '약초', icon: '🌿', basePrice: 25, tier: 2, description: '치유력이 있는 식물.' },

  // Tier 3 재료
  { id: 'ogre_serum', name: '오우거 혈청', icon: '👹', basePrice: 300, tier: 3, description: '엄청난 근육량을 자랑하는 오우거의 피.' },
  { id: 'harpy_feather', name: '하피의 깃털', icon: '🪶', basePrice: 250, tier: 3, description: '바람을 가르는 날카로운 깃털.' },
  { id: 'ghost_powder', name: '유령 가루', icon: '👻', basePrice: 400, tier: 3, description: '죽은 자의 흔적을 긁어모은 차가운 가루.' },
  { id: 'mercury', name: '수은', icon: '🌡️', basePrice: 200, tier: 3, description: '상온에서 액체로 존재하는 은색 금속.' },

  // Tier 4 재료 (희귀)
  { id: 'lava_essence', name: '용암 정수', icon: '🌋', basePrice: 1000, tier: 4, description: '뜨거운 마그마를 마법으로 응축한 것.' },
  { id: 'basilisk_eye', name: '석화안', icon: '👁️', basePrice: 1500, tier: 4, description: '바실리스크의 눈알. 쳐다보지 마세요.' },
  { id: 'dark_matter', name: '암흑 물질', icon: '⚫', basePrice: 2000, tier: 4, description: '빛을 흡수하는 정체불명의 물질.' },
  { id: 'diamond', name: '다이아몬드', icon: '💎', basePrice: 3000, tier: 4, description: '가장 단단하고 투명한 보석.' },
];

/**
 * ID로 재료 찾기
 * @param {string} id
 * @returns {Object | undefined}
 */
export function getMaterialById(id) {
  return materials.find(m => m.id === id);
}

/**
 * Tier로 재료 필터링
 * @param {number} tier
 * @returns {Object[]}
 */
export function getMaterialsByTier(tier) {
  return materials.filter(m => m.tier === tier);
}
