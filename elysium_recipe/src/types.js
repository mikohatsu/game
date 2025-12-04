/**
 * 게임의 타입 정의
 * JSDoc을 사용한 타입 정의
 */

/**
 * @typedef {'S' | 'A' | 'B' | 'C' | 'F'} Grade
 * 품질 등급
 */

/**
 * @typedef {Object} Material
 * @property {string} id - 재료 ID (예: "raw_water")
 * @property {string} name - 한글 이름
 * @property {string} icon - 이모지 아이콘
 * @property {number} basePrice - 기본 가격
 * @property {number} tier - 해금 Tier
 * @property {string} description - 설명
 */

/**
 * @typedef {Object} Recipe
 * @property {string} id - 레시피 ID (예: "T1-01")
 * @property {string} name - 한글 이름
 * @property {number} tier - Tier (1-5)
 * @property {string[]} ingredients - 재료 ID 배열 (길이 2)
 * @property {ProcessParams} target - 목표 공정 파라미터
 * @property {string} description - 설명
 * @property {string[]} clues - 단서 배열
 * @property {number} baseValue - 기본 판매가
 * @property {boolean} discovered - 발견 여부
 * @property {boolean} unlocked - 해금 여부
 */

/**
 * @typedef {Object} ProcessParams
 * @property {number} temperature - 온도 (0-1000)
 * @property {number} pressure - 압력 (0.1-10.0)
 * @property {number} concentration - 농도 (0-100)
 */

/**
 * @typedef {Object} Upgrade
 * @property {string} id - 업그레이드 ID
 * @property {string} name - 이름
 * @property {string} category - 카테고리 ('equipment' | 'archive' | 'environment')
 * @property {number} level - 레벨
 * @property {number} cost - 비용
 * @property {string} effect - 효과 설명
 * @property {boolean} purchased - 구매 여부
 */

/**
 * @typedef {Object} ExperimentResult
 * @property {number} attemptNumber - 시도 횟수
 * @property {string[]} materials - 사용한 재료 ID
 * @property {ProcessParams} input - 입력 파라미터
 * @property {string} resultItem - 결과 아이템 ID
 * @property {Grade} grade - 등급
 * @property {number} deviation - 편차율 (%)
 * @property {number} timestamp - 타임스탬프
 */

/**
 * @typedef {Object} GrimoireEntry
 * @property {string} recipeId - 레시피 ID
 * @property {ProcessParams} bestParams - 최고 기록 파라미터
 * @property {Grade} bestGrade - 최고 등급
 * @property {number} bestDeviation - 최고 기록 편차율
 * @property {number} timestamp - 최초 달성 타임스탬프
 */

/**
 * @typedef {Object} GameState
 * @property {number} day - 현재 날짜
 * @property {number} week - 현재 주차
 * @property {number} gold - 골드
 * @property {number} ap - 남은 AP
 * @property {number} pollution - 오염도 (0-200)
 * @property {number} reputation - 명성
 * @property {Object.<string, number>} inventory - 인벤토리 {materialId: count}
 * @property {ExperimentResult[]} history - 실험 일지
 * @property {Object.<string, GrimoireEntry>} grimoire - 비망록 {recipeId: entry}
 * @property {string[]} purchasedUpgrades - 구매한 업그레이드 ID 목록
 * @property {Object.<string, boolean>} discoveredRecipes - 발견한 레시피 {recipeId: true}
 * @property {number} attemptCount - 총 시도 횟수
 */

export {}
