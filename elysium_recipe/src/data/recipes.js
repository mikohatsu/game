/**
 * 레시피 마스터 데이터
 * 화합물단서전량.md 파일 기반
 */

export const recipes = [
  // Tier 1: 기초 물질 (10종)
  {
    id: 'T1-01',
    name: '정제수',
    tier: 1,
    ingredients: ['raw_water', 'charcoal'],
    target: { temperature: 100, pressure: 1.0, concentration: 0 },
    description: '깨끗하게 정제된 물',
    clues: ['"물(100도)을 끓여 숯으로 거른다. 압력은 대기압(1.0)."'],
    baseValue: 50,
    icon: '💧'
  },
  {
    id: 'T1-02',
    name: '유리 가루',
    tier: 1,
    ingredients: ['sand', 'heat_stone'],
    target: { temperature: 800, pressure: 1.0, concentration: 0 },
    description: '고온에서 녹인 모래 가루',
    clues: ['"모래가 녹는 고온(800도)과 표준 압력."'],
    baseValue: 80,
    icon: '✨'
  },
  {
    id: 'T1-03',
    name: '철가루',
    tier: 1,
    ingredients: ['raw_ore', 'acid'],
    target: { temperature: 200, pressure: 2.0, concentration: 50 },
    description: '산으로 추출한 순수한 철 가루',
    clues: ['"200도의 열과 2배의 압력, 산성 용액 절반(50%)."'],
    baseValue: 100,
    icon: '⚙️'
  },
  {
    id: 'T1-04',
    name: '구리 조각',
    tier: 1,
    ingredients: ['raw_ore', 'heat_stone'],
    target: { temperature: 400, pressure: 1.5, concentration: 20 },
    description: '붉은 빛을 띠는 구리 금속',
    clues: ['"400도, 1.5기압, 농도는 20%면 충분하다."'],
    baseValue: 120,
    icon: '🟠'
  },
  {
    id: 'T1-05',
    name: '소금 결정',
    tier: 1,
    ingredients: ['seawater', 'charcoal'],
    target: { temperature: 50, pressure: 0.5, concentration: 0 },
    description: '바닷물에서 얻은 순수한 소금',
    clues: ['"50도의 미열로 증발. 압력은 절반(0.5). 촉매 불필요."'],
    baseValue: 40,
    icon: '🧂'
  },
  {
    id: 'T1-06',
    name: '알코올',
    tier: 1,
    ingredients: ['grain', 'yeast'],
    target: { temperature: 80, pressure: 1.0, concentration: 70 },
    description: '발효된 순수한 알코올',
    clues: ['"발효 온도 80도. 대기압. 효모 농도 70%."'],
    baseValue: 90,
    icon: '🍶'
  },
  {
    id: 'T1-07',
    name: '황',
    tier: 1,
    ingredients: ['volcanic_stone', 'T1-01'], // 정제수 필요
    target: { temperature: 300, pressure: 3.0, concentration: 10 },
    description: '노란색 유황 가루',
    clues: ['"300도의 열, 3.0의 압력, 물은 10%만."'],
    baseValue: 110,
    icon: '🟡'
  },
  {
    id: 'T1-08',
    name: '석회',
    tier: 1,
    ingredients: ['bone_powder', 'charcoal'],
    target: { temperature: 500, pressure: 1.0, concentration: 0 },
    description: '뼈를 태워 만든 석회',
    clues: ['"500도 가열. 대기압(1.0). 촉매 없음."'],
    baseValue: 70,
    icon: '🤍'
  },
  {
    id: 'T1-09',
    name: '석유',
    tier: 1,
    ingredients: ['humus', 'heat_stone'],
    target: { temperature: 600, pressure: 5.0, concentration: 5 },
    description: '검은 점성의 원유',
    clues: ['"600도의 고열, 5.0의 고압, 5%의 촉매."'],
    baseValue: 130,
    icon: '🛢️'
  },
  {
    id: 'T1-10',
    name: '기본 촉매제',
    tier: 1,
    ingredients: ['slime_gel', 'acid'],
    target: { temperature: 10, pressure: 1.0, concentration: 30 },
    description: '반응을 촉진하는 기본 촉매',
    clues: ['"10도의 저온, 대기압, 산도 30%."'],
    baseValue: 60,
    icon: '⚗️'
  },

  // Tier 2: 화합물 및 기초 포션 (15종)
  {
    id: 'T2-01',
    name: '왕수',
    tier: 2,
    ingredients: ['acid', 'T1-05'], // 소금 결정
    target: { temperature: 150, pressure: 0.8, concentration: 70 },
    description: '금을 녹일 수 있는 강산',
    clues: ['"150도에서 섞어라. 기압은 0.8로 낮추고, 농도는 진하게(70)."'],
    baseValue: 200,
    icon: '🧪'
  },
  {
    id: 'T2-02',
    name: '흑색 화약',
    tier: 2,
    ingredients: ['T1-07', 'charcoal'], // 황, 숯
    target: { temperature: 550, pressure: 3.0, concentration: 60 },
    description: '폭발성 흑색 화약',
    clues: ['"폭발 위험. 550도, 3기압, 6:4 비율(60%)."'],
    baseValue: 250,
    icon: '💥'
  },
  {
    id: 'T2-03',
    name: '생석회',
    tier: 2,
    ingredients: ['T1-08', 'T1-01'], // 석회, 정제수
    target: { temperature: 200, pressure: 0.8, concentration: 0 },
    description: '물과 반응하는 생석회',
    clues: ['"200도의 열, 0.8기압. 물은 필요 없다(0)."'],
    baseValue: 150,
    icon: '⚪'
  },
  {
    id: 'T2-04',
    name: '청동 합금',
    tier: 2,
    ingredients: ['T1-04', 'T1-03'], // 구리 조각, 철가루
    target: { temperature: 600, pressure: 5.0, concentration: 40 },
    description: '구리와 철의 합금',
    clues: ['"600도의 용광로. 5기압의 프레스. 40% 혼합."'],
    baseValue: 280,
    icon: '🟤'
  },
  {
    id: 'T2-05',
    name: '정제염',
    tier: 2,
    ingredients: ['T1-05', 'charcoal'], // 소금 결정, 숯
    target: { temperature: 50, pressure: 0.3, concentration: 10 },
    description: '불순물을 제거한 순수한 소금',
    clues: ['"50도 저온 정제. 0.3기압 진공. 10% 필터링."'],
    baseValue: 100,
    icon: '🧂'
  },
  {
    id: 'T2-06',
    name: '황산',
    tier: 2,
    ingredients: ['T1-07', 'T1-01'], // 황, 정제수
    target: { temperature: 250, pressure: 1.5, concentration: 80 },
    description: '강력한 부식성 황산',
    clues: ['"250도 가열. 1.5기압. 80% 고농축."'],
    baseValue: 220,
    icon: '🔴'
  },
  {
    id: 'T2-07',
    name: '탈취제',
    tier: 2,
    ingredients: ['T1-06', 'lemon'], // 알코올, 레몬
    target: { temperature: 70, pressure: 0.5, concentration: 50 },
    description: '상쾌한 향의 탈취 스프레이',
    clues: ['"알코올이 날아가는 70도. 0.5기압. 반반 섞기(50)."'],
    baseValue: 180,
    icon: '🍋'
  },
  {
    id: 'T2-08',
    name: '마나 가루',
    tier: 2,
    ingredients: ['mana_fragment', 'charcoal'], // 마나석, 숯
    target: { temperature: 30, pressure: 2.0, concentration: 20 },
    description: '마법력이 담긴 푸른 가루',
    clues: ['"30도 상온. 2배 압력. 20%의 숯."'],
    baseValue: 350,
    icon: '✨'
  },
  {
    id: 'T2-09',
    name: '태닝 오일',
    tier: 2,
    ingredients: ['T1-09', 'acid'], // 석유, 산성 용액
    target: { temperature: 150, pressure: 3.0, concentration: 10 },
    description: '가죽을 가공하는 오일',
    clues: ['"150도 가열. 3기압. 10% 희석."'],
    baseValue: 190,
    icon: '🟤'
  },
  {
    id: 'T2-10',
    name: '회복 물약',
    tier: 2,
    ingredients: ['herb', 'T1-01'], // 약초, 정제수
    target: { temperature: 120, pressure: 1.0, concentration: 90 },
    description: '상처를 치유하는 빨간 물약',
    clues: ['"약초를 달이는 120도. 대기압. 90% 농축."'],
    baseValue: 300,
    icon: '❤️'
  },
  {
    id: 'T2-11',
    name: '마나 물약',
    tier: 2,
    ingredients: ['mana_fragment', 'T1-01'], // 마나석, 정제수
    target: { temperature: 15, pressure: 5.0, concentration: 50 },
    description: '마법력을 회복하는 푸른 물약',
    clues: ['"15도의 차가운 물. 5기압. 50% 용해."'],
    baseValue: 320,
    icon: '💙'
  },
  {
    id: 'T2-12',
    name: '신속 물약',
    tier: 2,
    ingredients: ['lemon', 'T1-06'], // 레몬, 알코올
    target: { temperature: 180, pressure: 1.2, concentration: 75 },
    description: '빠르게 움직이게 하는 물약',
    clues: ['"180도 급속 가열. 1.2기압. 75% 추출."'],
    baseValue: 280,
    icon: '⚡'
  },
  {
    id: 'T2-13',
    name: '보호 물약',
    tier: 2,
    ingredients: ['raw_ore', 'T2-08'], // 원석, 마나 가루
    target: { temperature: 350, pressure: 4.0, concentration: 65 },
    description: '방어력을 높이는 물약',
    clues: ['"돌을 녹이는 350도. 4기압. 65% 코팅."'],
    baseValue: 330,
    icon: '🛡️'
  },
  {
    id: 'T2-14',
    name: '수면 가루',
    tier: 2,
    ingredients: ['herb', 'T1-06'], // 약초, 알코올
    target: { temperature: 90, pressure: 0.6, concentration: 50 },
    description: '잠을 유도하는 가루',
    clues: ['"90도 가열. 0.6기압. 절반 농도(50)."'],
    baseValue: 200,
    icon: '😴'
  },
  {
    id: 'T2-15',
    name: '기본 독',
    tier: 2,
    ingredients: ['acid', 'T1-10'], // 산성 용액, 기본 촉매제
    target: { temperature: 10, pressure: 0.5, concentration: 100 },
    description: '생명체를 해치는 독',
    clues: ['"10도 저온. 0.5기압. 100% 원액."'],
    baseValue: 240,
    icon: '☠️'
  },

  // Tier 3: 상급 연금술 (10종)
  {
    id: 'T3-01',
    name: '가짜 금',
    tier: 3,
    ingredients: ['T1-04', 'T1-07'], // 구리 조각, 황
    target: { temperature: 800, pressure: 2.5, concentration: 60 },
    description: '금처럼 보이는 합금',
    clues: ['"8세기의 연금술. 2와 반 개의 동전. 6할의 거짓말."'],
    baseValue: 500,
    icon: '🪙'
  },
  {
    id: 'T3-02',
    name: '괴력 물약',
    tier: 3,
    ingredients: ['ogre_serum', 'T1-06'], // 오우거혈청, 알코올
    target: { temperature: 450, pressure: 5.0, concentration: 90 },
    description: '엄청난 힘을 주는 물약',
    clues: ['"종이가 불타는 온도(451). 5손가락의 압력. 완전함에 가까운 90."'],
    baseValue: 600,
    icon: '💪'
  },
  {
    id: 'T3-03',
    name: '비행 연고',
    tier: 3,
    ingredients: ['harpy_feather', 'T1-09'], // 깃털, 석유
    target: { temperature: 550, pressure: 1.0, concentration: 70 },
    description: '하늘을 날 수 있게 하는 연고',
    clues: ['"5와 5의 대칭(550). 기준점(1.0). 행운의 숫자 7(70)."'],
    baseValue: 550,
    icon: '🪶'
  },
  {
    id: 'T3-04',
    name: '투명 실',
    tier: 3,
    ingredients: ['ghost_powder', 'T2-08'], // 유령 가루, 마나 가루
    target: { temperature: 10, pressure: 0.1, concentration: 95 },
    description: '보이지 않는 마법의 실',
    clues: ['"가장 낮은 두 자리(10). 가장 낮은 소수점(0.1). 꽉 찬 달에서 조금 부족한(95)."'],
    baseValue: 650,
    icon: '👻'
  },
  {
    id: 'T3-05',
    name: '수은 촉매',
    tier: 3,
    ingredients: ['mercury', 'T1-10'], // 수은, 기본 촉매제
    target: { temperature: 300, pressure: 3.0, concentration: 85 },
    description: '강력한 수은 기반 촉매',
    clues: ['"전통적인 300. 삼위일체(3.0). 85번째 원소처럼."'],
    baseValue: 480,
    icon: '🌡️'
  },
  {
    id: 'T3-06',
    name: '현자의 소금',
    tier: 3,
    ingredients: ['T2-05', 'T2-06'], // 정제염, 황산
    target: { temperature: 400, pressure: 5.0, concentration: 60 },
    description: '연금술의 핵심 재료',
    clues: ['"4계절의 100배. 5대양의 압력. 6대주의 농도."'],
    baseValue: 700,
    icon: '🧂'
  },
  {
    id: 'T3-07',
    name: '거인 정수',
    tier: 3,
    ingredients: ['ogre_serum', 'T1-01'], // 오우거혈청, 정제수
    target: { temperature: 100, pressure: 8.0, concentration: 50 },
    description: '거인의 힘이 농축된 액체',
    clues: ['"물 끓는 점. 문어의 다리 개수(8). 반타작(50)."'],
    baseValue: 520,
    icon: '🧪'
  },
  {
    id: 'T3-08',
    name: '폭발 젤',
    tier: 3,
    ingredients: ['T2-02', 'T1-06'], // 흑색 화약, 알코올
    target: { temperature: 750, pressure: 6.0, concentration: 70 },
    description: '강력한 폭발성 젤',
    clues: ['"750의 화력. 6각형의 압축. 7할의 파괴력."'],
    baseValue: 580,
    icon: '💥'
  },
  {
    id: 'T3-09',
    name: '치유 엘릭서',
    tier: 3,
    ingredients: ['T2-10', 'T2-08'], // 회복 물약, 마나 가루
    target: { temperature: 150, pressure: 1.5, concentration: 99 },
    description: '거의 모든 상처를 치유하는 엘릭서',
    clues: ['"150년의 수명. 1.5배의 활력. 구구단 끝자리(99)."'],
    baseValue: 620,
    icon: '💚'
  },
  {
    id: 'T3-10',
    name: '맹독',
    tier: 3,
    ingredients: ['T2-15', 'T2-06'], // 기본 독, 황산
    target: { temperature: 120, pressure: 1.0, concentration: 100 },
    description: '치명적인 독',
    clues: ['"12달의 10배. 유일한 기준(1.0). 끝까지 채워라(100)."'],
    baseValue: 540,
    icon: '☠️'
  },

  // Tier 4: 전설적 물질 (6종)
  {
    id: 'T4-01',
    name: '불사조의 재',
    tier: 4,
    ingredients: ['lava_essence', 'harpy_feather'],
    target: { temperature: 888, pressure: 4.4, concentration: 77 },
    description: '불사조가 남긴 신비한 재',
    clues: ['"무한의 세 번 반복(888). 죽음의 두 번 반복(4.4). 행운의 두 번 반복(77)."'],
    baseValue: 2000,
    icon: '🔥'
  },
  {
    id: 'T4-02',
    name: '골렘 코어',
    tier: 4,
    ingredients: ['basilisk_eye', 'T1-03'], // 석화안, 철가루
    target: { temperature: 777, pressure: 7.7, concentration: 100 },
    description: '골렘의 심장부',
    clues: ['"세븐 잭팟(777). 럭키 세븐(7.7). 완벽한 숫자(100)."'],
    baseValue: 2200,
    icon: '🗿'
  },
  {
    id: 'T4-03',
    name: '공허의 정수',
    tier: 4,
    ingredients: ['dark_matter', 'T1-01'], // 암흑 물질, 정제수
    target: { temperature: 1, pressure: 0.1, concentration: 1 },
    description: '무(無)의 힘을 담은 액체',
    clues: ['"시작이자 끝(1). 가장 작은 존재(0.1). 유일한 진리(1)."'],
    baseValue: 2500,
    icon: '⚫'
  },
  {
    id: 'T4-04',
    name: '변성 엘릭서',
    tier: 4,
    ingredients: ['mercury', 'diamond'],
    target: { temperature: 900, pressure: 9.0, concentration: 90 },
    description: '물질을 변환시키는 엘릭서',
    clues: ['"천에서 백을 뺀 수(900). 한 자리 수의 끝(9.0). 직각(90)."'],
    baseValue: 3000,
    icon: '✨'
  },
  {
    id: 'T4-05',
    name: '불멸의 액체',
    tier: 4,
    ingredients: ['lava_essence', 'ogre_serum'],
    target: { temperature: 500, pressure: 5.5, concentration: 88 },
    description: '영원한 생명을 주는 액체',
    clues: ['"절반의 천년(500). 5와 그 절반(5.5). 무한대를 세우다(88)."'],
    baseValue: 2800,
    icon: '🧬'
  },
  {
    id: 'T4-06',
    name: '현자의 돌 (파편)',
    tier: 4,
    ingredients: ['mercury', 'T3-06'], // 수은, 현자의 소금
    target: { temperature: 666, pressure: 6.6, concentration: 66 },
    description: '현자의 돌 파편',
    clues: ['"악마의 숫자(666). 악마의 소수(6.6). 악마의 비율(66)."'],
    baseValue: 5000,
    icon: '🔴'
  },

  // Tier 5: 최종 목표 (3종)
  {
    id: 'T5-01',
    name: '호문쿨루스',
    tier: 5,
    ingredients: ['T4-06', 'ogre_serum'], // 현자의 돌, 오우거혈청
    target: { temperature: 370, pressure: 3.7, concentration: 37 },
    description: '인공 생명체',
    clues: ['"인간의 체온 10배(370). 37의 1/10. 생명의 수 37."'],
    baseValue: 10000,
    icon: '🧬'
  },
  {
    id: 'T5-02',
    name: '황금의 손',
    tier: 5,
    ingredients: ['T4-06', 'diamond'], // 현자의 돌, 다이아몬드
    target: { temperature: 999, pressure: 9.9, concentration: 9 },
    description: '모든 것을 황금으로 만드는 힘',
    clues: ['"가장 꽉 찬 숫자 999. 9.9. 9."'],
    baseValue: 15000,
    icon: '👑'
  },
  {
    id: 'T5-03',
    name: '아테리우스',
    tier: 5,
    ingredients: ['T4-06', 'T4-03'], // 현자의 돌, 공허의 정수
    target: { temperature: 314, pressure: 3.1, concentration: 41 },
    description: '연금술의 궁극, 우주의 진리',
    clues: ['"원주율(π)의 첫 세 자리(314). 그 다음 두 자리(3.1/3.14의 근사). 뒤집힌 14(41)."'],
    baseValue: 20000,
    icon: '🌟'
  },
];

/**
 * ID로 레시피 찾기
 * @param {string} id
 * @returns {Object | undefined}
 */
export function getRecipeById(id) {
  return recipes.find(r => r.id === id);
}

/**
 * Tier로 레시피 필터링
 * @param {number} tier
 * @returns {Object[]}
 */
export function getRecipesByTier(tier) {
  return recipes.filter(r => r.tier === tier);
}

/**
 * 재료로 만들 수 있는 레시피 찾기
 * @param {string} mat1
 * @param {string} mat2
 * @returns {Object | null}
 */
export function findRecipeByIngredients(mat1, mat2) {
  return recipes.find(r =>
    (r.ingredients[0] === mat1 && r.ingredients[1] === mat2) ||
    (r.ingredients[0] === mat2 && r.ingredients[1] === mat1)
  ) || null;
}
