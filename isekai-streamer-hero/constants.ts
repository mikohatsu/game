import { Upgrade } from './types';

// ... (Existing Upgrades code remains exactly the same until INITIAL_UPGRADES ends) ...
export const INITIAL_UPGRADES: Upgrade[] = [
  // =====================================================================================
  // 1. CLICK TREE (WEAPON) - GOLD
  // =====================================================================================
  { id: 'w_01', name: '나무 몽둥이', category: 'CLICK', type: 'WEAPON', baseCost: 10, costMultiplier: 1.5, level: 1, effectValue: 5, currency: 'GOLD', description: '기본적인 방송 소품', persistent: false },
  { id: 'w_02', name: '뿅망치', category: 'CLICK', type: 'WEAPON', baseCost: 500, costMultiplier: 1.5, level: 0, effectValue: 50, currency: 'GOLD', description: '타격감이 찰지다', persistent: false },
  { id: 'w_03', name: '장난감 광선검', category: 'CLICK', type: 'WEAPON', baseCost: 10000, costMultiplier: 1.5, level: 0, effectValue: 600, currency: 'GOLD', description: '불도 들어옴 (만 단위)', persistent: false },
  
  // 억 ~ 해 (Eok ~ Hae)
  { id: 'w_04', name: '강화 티타늄 검', category: 'CLICK', type: 'WEAPON', baseCost: 1e8, costMultiplier: 1.6, level: 0, effectValue: 5e6, currency: 'GOLD', description: '본격적인 장비 (억 단위)', persistent: false },
  { id: 'w_05', name: '발뭉의 파편', category: 'CLICK', type: 'WEAPON', baseCost: 1e12, costMultiplier: 1.6, level: 0, effectValue: 5e10, currency: 'GOLD', description: '신화의 시작 (조 단위)', persistent: false },
  { id: 'w_06', name: '엑스칼리버 레플리카', category: 'CLICK', type: 'WEAPON', baseCost: 1e16, costMultiplier: 1.6, level: 0, effectValue: 5e14, currency: 'GOLD', description: '진품명품 출연 가능 (경 단위)', persistent: false },
  { id: 'w_07', name: '해신의 삼지창', category: 'CLICK', type: 'WEAPON', baseCost: 1e20, costMultiplier: 1.6, level: 0, effectValue: 5e18, currency: 'GOLD', description: '바다를 가르는 힘 (해 단위)', persistent: false },
  
  // 자 ~ 정 (Ja ~ Jeong)
  { id: 'w_08', name: '자수정 공허 검', category: 'CLICK', type: 'WEAPON', baseCost: 1e24, costMultiplier: 1.7, level: 0, effectValue: 5e22, currency: 'GOLD', description: '공허를 베는 검 (자 단위)', persistent: false },
  { id: 'w_09', name: '양자 분해기', category: 'CLICK', type: 'WEAPON', baseCost: 1e28, costMultiplier: 1.7, level: 0, effectValue: 5e26, currency: 'GOLD', description: '나노 단위 절단 (양 단위)', persistent: false },
  { id: 'w_10', name: '구천의 번개', category: 'CLICK', type: 'WEAPON', baseCost: 1e32, costMultiplier: 1.7, level: 0, effectValue: 5e30, currency: 'GOLD', description: '하늘의 분노 (구 단위)', persistent: false },
  { id: 'w_11', name: '간장 막야의 영혼', category: 'CLICK', type: 'WEAPON', baseCost: 1e36, costMultiplier: 1.7, level: 0, effectValue: 5e34, currency: 'GOLD', description: '전설의 부부 검 (간 단위)', persistent: false },
  { id: 'w_12', name: '정신 지배 지팡이', category: 'CLICK', type: 'WEAPON', baseCost: 1e40, costMultiplier: 1.8, level: 0, effectValue: 5e38, currency: 'GOLD', description: '시청자도 지배함 (정 단위)', persistent: false },
  
  // 재 ~ 극 (Jae ~ Geuk)
  { id: 'w_13', name: '재앙의 불꽃', category: 'CLICK', type: 'WEAPON', baseCost: 1e44, costMultiplier: 1.8, level: 0, effectValue: 5e42, currency: 'GOLD', description: '모든 것을 태우는 힘 (재 단위)', persistent: false },
  { id: 'w_14', name: '극한의 절대영도', category: 'CLICK', type: 'WEAPON', baseCost: 1e48, costMultiplier: 1.8, level: 0, effectValue: 5e46, currency: 'GOLD', description: '시간조차 얼어붙음 (극 단위)', persistent: false },
  
  // 동양 대수 단위 (Hanghasa ~ Muryangdaesu)
  { id: 'w_15', name: '항하사 샌드 엣지', category: 'CLICK', type: 'WEAPON', baseCost: 1e52, costMultiplier: 1.9, level: 0, effectValue: 5e50, currency: 'GOLD', description: '갠지스강의 모래만큼 아픔 (항하사)', persistent: false },
  { id: 'w_16', name: '아승기 차원 절단기', category: 'CLICK', type: 'WEAPON', baseCost: 1e56, costMultiplier: 1.9, level: 0, effectValue: 5e54, currency: 'GOLD', description: '셀 수 없는 데미지 (아승기)', persistent: false },
  { id: 'w_17', name: '나유타의 관통창', category: 'CLICK', type: 'WEAPON', baseCost: 1e60, costMultiplier: 2.0, level: 0, effectValue: 5e58, currency: 'GOLD', description: '인식을 초월한 창 (나유타)', persistent: false },
  { id: 'w_18', name: '불가사의 존재의 손톱', category: 'CLICK', type: 'WEAPON', baseCost: 1e64, costMultiplier: 2.1, level: 0, effectValue: 5e62, currency: 'GOLD', description: '이해할 수 없는 힘 (불가사의)', persistent: false },
  { id: 'w_19', name: '무량대수 코스믹 소드', category: 'CLICK', type: 'WEAPON', baseCost: 1e68, costMultiplier: 2.2, level: 0, effectValue: 5e66, currency: 'GOLD', description: '무한에 가까운 검 (무량대수)', persistent: false },
  
  // Modern/Scientific Units (Googol path)
  { id: 'w_20', name: '빅뱅 제네레이터', category: 'CLICK', type: 'WEAPON', baseCost: 1e75, costMultiplier: 2.5, level: 0, effectValue: 1e72, currency: 'GOLD', description: '우주 탄생의 에너지', persistent: false },
  { id: 'w_21', name: '멀티버스 브레이커', category: 'CLICK', type: 'WEAPON', baseCost: 1e85, costMultiplier: 3.0, level: 0, effectValue: 1e82, currency: 'GOLD', description: '평행우주 파괴', persistent: false },
  { id: 'w_22', name: '구골플렉스 슬래셔', category: 'CLICK', type: 'WEAPON', baseCost: 1e100, costMultiplier: 5.0, level: 0, effectValue: 1e98, currency: 'GOLD', description: '숫자의 끝을 베는 검 (Googol)', persistent: false },

  // =====================================================================================
  // 2. AUTO TREE (ALLIES) - VIEWERS
  // =====================================================================================
  { id: 'a_01', name: '떠돌이 슬라임', category: 'AUTO', type: 'ALLY', baseCost: 100, costMultiplier: 1.5, level: 0, effectValue: 10, currency: 'VIEWERS', description: '귀여운 마스코트', persistent: false },
  { id: 'a_02', name: '수습 매니저', category: 'AUTO', type: 'ALLY', baseCost: 5000, costMultiplier: 1.5, level: 0, effectValue: 200, currency: 'VIEWERS', description: '채팅창 관리 시작', persistent: false },
  
  // 억 ~ 해
  { id: 'a_03', name: '오크 경호원', category: 'AUTO', type: 'ALLY', baseCost: 1e8, costMultiplier: 1.6, level: 0, effectValue: 1e6, currency: 'VIEWERS', description: '든든한 보디가드 (억)', persistent: false },
  { id: 'a_04', name: '엘프 저격수', category: 'AUTO', type: 'ALLY', baseCost: 1e12, costMultiplier: 1.6, level: 0, effectValue: 1e10, currency: 'VIEWERS', description: '원거리 지원 사격 (조)', persistent: false },
  { id: 'a_05', name: '왕실 근위대장', category: 'AUTO', type: 'ALLY', baseCost: 1e16, costMultiplier: 1.6, level: 0, effectValue: 1e14, currency: 'VIEWERS', description: '국가급 전력 (경)', persistent: false },
  { id: 'a_06', name: '심해의 크라켄', category: 'AUTO', type: 'ALLY', baseCost: 1e20, costMultiplier: 1.6, level: 0, effectValue: 1e18, currency: 'VIEWERS', description: '촉수물 아님 (해)', persistent: false },

  // 자 ~ 정
  { id: 'a_07', name: '자율주행 골렘', category: 'AUTO', type: 'ALLY', baseCost: 1e24, costMultiplier: 1.7, level: 0, effectValue: 1e22, currency: 'VIEWERS', description: '알아서 잘 싸움 (자)', persistent: false },
  { id: 'a_08', name: '태양의 사제', category: 'AUTO', type: 'ALLY', baseCost: 1e28, costMultiplier: 1.7, level: 0, effectValue: 1e26, currency: 'VIEWERS', description: '양기를 불어넣음 (양)', persistent: false },
  { id: 'a_09', name: '구미호 아이돌', category: 'AUTO', type: 'ALLY', baseCost: 1e32, costMultiplier: 1.7, level: 0, effectValue: 1e30, currency: 'VIEWERS', description: '홀려서 데미지 줌 (구)', persistent: false },
  { id: 'a_10', name: '차원 간수', category: 'AUTO', type: 'ALLY', baseCost: 1e36, costMultiplier: 1.7, level: 0, effectValue: 1e34, currency: 'VIEWERS', description: '시공간 관리자 (간)', persistent: false },
  { id: 'a_11', name: '정령왕', category: 'AUTO', type: 'ALLY', baseCost: 1e40, costMultiplier: 1.8, level: 0, effectValue: 1e38, currency: 'VIEWERS', description: '자연의 주인 (정)', persistent: false },

  // 재 ~ 극
  { id: 'a_12', name: '재벌가 회장님', category: 'AUTO', type: 'ALLY', baseCost: 1e44, costMultiplier: 1.8, level: 0, effectValue: 1e42, currency: 'VIEWERS', description: '돈으로 때림 (재)', persistent: false },
  { id: 'a_13', name: '극악 무도회 챔피언', category: 'AUTO', type: 'ALLY', baseCost: 1e48, costMultiplier: 1.8, level: 0, effectValue: 1e46, currency: 'VIEWERS', description: '무력 최강자 (극)', persistent: false },

  // 동양 대수 단위
  { id: 'a_14', name: '항하사 모래 병정', category: 'AUTO', type: 'ALLY', baseCost: 1e52, costMultiplier: 1.9, level: 0, effectValue: 1e50, currency: 'VIEWERS', description: '끝없는 군단 (항하사)', persistent: false },
  { id: 'a_15', name: '아승기 마도공학자', category: 'AUTO', type: 'ALLY', baseCost: 1e56, costMultiplier: 1.9, level: 0, effectValue: 1e54, currency: 'VIEWERS', description: '미래 기술력 (아승기)', persistent: false },
  { id: 'a_16', name: '나유타 드래곤', category: 'AUTO', type: 'ALLY', baseCost: 1e60, costMultiplier: 2.0, level: 0, effectValue: 1e58, currency: 'VIEWERS', description: '행성보다 거대함 (나유타)', persistent: false },
  { id: 'a_17', name: '불가사의 고대신', category: 'AUTO', type: 'ALLY', baseCost: 1e64, costMultiplier: 2.1, level: 0, effectValue: 1e62, currency: 'VIEWERS', description: '형언할 수 없음 (불가사의)', persistent: false },
  { id: 'a_18', name: '무량대수 초월자', category: 'AUTO', type: 'ALLY', baseCost: 1e68, costMultiplier: 2.2, level: 0, effectValue: 1e66, currency: 'VIEWERS', description: '신의 영역 (무량대수)', persistent: false },

  // Modern
  { id: 'a_19', name: '전 우주 시청자 연합', category: 'AUTO', type: 'ALLY', baseCost: 1e80, costMultiplier: 2.5, level: 0, effectValue: 1e78, currency: 'VIEWERS', description: '모든 생명체가 아군', persistent: false },
  { id: 'a_20', name: '개념적 존재', category: 'AUTO', type: 'ALLY', baseCost: 1e100, costMultiplier: 5.0, level: 0, effectValue: 1e98, currency: 'VIEWERS', description: '존재 그 자체 (Googol)', persistent: false },

  // =====================================================================================
  // 3. UTILITY TREE (GEAR/SYSTEM) - VIEWERS
  // =====================================================================================
  { id: 'u_01', name: '구형 웹캠', category: 'UTILITY', type: 'CAMERA', baseCost: 200, costMultiplier: 1.4, level: 0, effectValue: 0.1, currency: 'VIEWERS', description: '골드 획득량 +10%', persistent: false },
  { id: 'u_02', name: '중고 마이크', category: 'UTILITY', type: 'MIC', baseCost: 4000, costMultiplier: 1.4, level: 0, effectValue: 0.2, currency: 'VIEWERS', description: '시청자 유입 +20%', persistent: false },

  // 억 ~ 해
  { id: 'u_03', name: '4K DSLR', category: 'UTILITY', type: 'CAMERA', baseCost: 1e8, costMultiplier: 1.5, level: 0, effectValue: 0.5, currency: 'VIEWERS', description: '골드 획득 +50% (억)', persistent: false },
  { id: 'u_04', name: '조명판 세트', category: 'UTILITY', type: 'SYSTEM', baseCost: 1e12, costMultiplier: 1.5, level: 0, effectValue: 0.8, currency: 'VIEWERS', description: '시청자 유입 +80% (조)', persistent: false },
  { id: 'u_05', name: '경량화 드론 캠', category: 'UTILITY', type: 'CAMERA', baseCost: 1e16, costMultiplier: 1.5, level: 0, effectValue: 1.5, currency: 'VIEWERS', description: '골드 획득 +150% (경)', persistent: false },
  { id: 'u_06', name: '해저 케이블', category: 'UTILITY', type: 'SYSTEM', baseCost: 1e20, costMultiplier: 1.5, level: 0, effectValue: 2.0, currency: 'VIEWERS', description: '시청자 유입 +200% (해)', persistent: false },

  // 자 ~ 정
  { id: 'u_07', name: '자기부상 스태빌라이저', category: 'UTILITY', type: 'CAMERA', baseCost: 1e24, costMultiplier: 1.6, level: 0, effectValue: 4.0, currency: 'VIEWERS', description: '골드 획득 +400% (자)', persistent: false },
  { id: 'u_08', name: '양자 인터넷 공유기', category: 'UTILITY', type: 'SYSTEM', baseCost: 1e28, costMultiplier: 1.6, level: 0, effectValue: 5.0, currency: 'VIEWERS', description: '시청자 유입 +500% (양)', persistent: false },
  { id: 'u_09', name: '구체형 홀로그램', category: 'UTILITY', type: 'CAMERA', baseCost: 1e32, costMultiplier: 1.6, level: 0, effectValue: 10.0, currency: 'VIEWERS', description: '골드 획득 +1000% (구)', persistent: false },
  { id: 'u_10', name: '간섭 차단 쉴드', category: 'UTILITY', type: 'MIC', baseCost: 1e36, costMultiplier: 1.6, level: 0, effectValue: 12.0, currency: 'VIEWERS', description: '시청자 유입 +1200% (간)', persistent: false },
  { id: 'u_11', name: '정밀 타격 알고리즘', category: 'UTILITY', type: 'SYSTEM', baseCost: 1e40, costMultiplier: 1.7, level: 0, effectValue: 20.0, currency: 'VIEWERS', description: '골드 획득 +2000% (정)', persistent: false },

  // 재 ~ 극
  { id: 'u_12', name: '재창조 편집 툴', category: 'UTILITY', type: 'SYSTEM', baseCost: 1e44, costMultiplier: 1.7, level: 0, effectValue: 30.0, currency: 'VIEWERS', description: '시청자 유입 +3000% (재)', persistent: false },
  { id: 'u_13', name: '극한의 화질 80K', category: 'UTILITY', type: 'CAMERA', baseCost: 1e48, costMultiplier: 1.7, level: 0, effectValue: 50.0, currency: 'VIEWERS', description: '골드 획득 +5000% (극)', persistent: false },

  // 동양 대수 단위
  { id: 'u_14', name: '항하사 데이터 센터', category: 'UTILITY', type: 'SYSTEM', baseCost: 1e52, costMultiplier: 1.8, level: 0, effectValue: 100.0, currency: 'VIEWERS', description: '시청자 유입 +1만% (항하사)', persistent: false },
  { id: 'u_15', name: '아승기 코어 프로세서', category: 'UTILITY', type: 'CAMERA', baseCost: 1e56, costMultiplier: 1.8, level: 0, effectValue: 200.0, currency: 'VIEWERS', description: '골드 획득 +2만% (아승기)', persistent: false },
  { id: 'u_16', name: '나유타 클라우드', category: 'UTILITY', type: 'SYSTEM', baseCost: 1e60, costMultiplier: 1.9, level: 0, effectValue: 500.0, currency: 'VIEWERS', description: '시청자 유입 +5만% (나유타)', persistent: false },
  { id: 'u_17', name: '불가사의 송출 장치', category: 'UTILITY', type: 'MIC', baseCost: 1e64, costMultiplier: 2.0, level: 0, effectValue: 1000.0, currency: 'VIEWERS', description: '골드 획득 +10만% (불가사의)', persistent: false },
  { id: 'u_18', name: '무량대수 네트워크', category: 'UTILITY', type: 'SYSTEM', baseCost: 1e68, costMultiplier: 2.1, level: 0, effectValue: 5000.0, currency: 'VIEWERS', description: '시청자 유입 +50만% (무량대수)', persistent: false },

  // Modern
  { id: 'u_19', name: '옴니버스 방송국', category: 'UTILITY', type: 'SYSTEM', baseCost: 1e85, costMultiplier: 2.5, level: 0, effectValue: 100000.0, currency: 'VIEWERS', description: '모든 우주에 동시 송출', persistent: false },
  { id: 'u_20', name: '현실 조작 인터페이스', category: 'UTILITY', type: 'SYSTEM', baseCost: 1e100, costMultiplier: 3.0, level: 0, effectValue: 1000000.0, currency: 'VIEWERS', description: '좋아요가 현실이 됨 (Googol)', persistent: false },


  // =====================================================================================
  // 4. STAR SHOP (REINCARNATION) - STAR POINTS (30+ Items)
  // =====================================================================================
  // Tier 1: Basic (Cost 1~10)
  { id: 's_dmg_1', name: '공격력 입문', category: 'STAR', type: 'PERK', baseCost: 1, costMultiplier: 2.0, level: 0, effectValue: 2.0, currency: 'STAR', description: '데미지 2배 증가', persistent: true },
  { id: 's_gold_1', name: '골드 수집가', category: 'STAR', type: 'PERK', baseCost: 1, costMultiplier: 2.0, level: 0, effectValue: 1.5, currency: 'STAR', description: '골드 획득 1.5배 증가', persistent: true },
  { id: 's_auto_1', name: '오토 클리커 V1', category: 'STAR', type: 'SYSTEM', baseCost: 5, costMultiplier: 3.0, level: 0, effectValue: 5, currency: 'STAR', description: '초당 5회 자동 클릭', persistent: true },
  { id: 's_crit_1', name: '치명적 매력 I', category: 'STAR', type: 'PERK', baseCost: 8, costMultiplier: 1.5, level: 0, effectValue: 0.05, currency: 'STAR', description: '치명타 확률 +5%', persistent: true },
  
  // Tier 2: Intermediate (Cost 10~100)
  { id: 's_dmg_2', name: '차원 돌파 I', category: 'STAR', type: 'PERK', baseCost: 20, costMultiplier: 2.2, level: 0, effectValue: 5.0, currency: 'STAR', description: '데미지 5배 증가', persistent: true },
  { id: 's_view_1', name: '알고리즘의 선택', category: 'STAR', type: 'PERK', baseCost: 30, costMultiplier: 1.8, level: 0, effectValue: 2.0, currency: 'STAR', description: '시청자 유입 2배', persistent: true },
  { id: 's_cdmg_1', name: '팩트 폭력 I', category: 'STAR', type: 'PERK', baseCost: 40, costMultiplier: 1.6, level: 0, effectValue: 2.0, currency: 'STAR', description: '치명타 데미지 +200%', persistent: true },
  { id: 's_fever_1', name: '흥분 상태', category: 'STAR', type: 'PERK', baseCost: 50, costMultiplier: 2.0, level: 0, effectValue: 5, currency: 'STAR', description: '피버 지속시간 +5초', persistent: true },
  { id: 's_rank_1', name: '스트리머 랭킹 진입!', category: 'STAR', type: 'SYSTEM', baseCost: 50, costMultiplier: 1.0, level: 0, effectValue: 1, currency: 'STAR', description: '우주 스트리머 랭킹 시스템 해금 (목표: 1위 창조주)', persistent: true },
  { id: 's_auto_2', name: '오토 클리커 V2', category: 'STAR', type: 'SYSTEM', baseCost: 80, costMultiplier: 3.0, level: 0, effectValue: 15, currency: 'STAR', description: '초당 +15회 자동 클릭', persistent: true },
  
  // Tier 3: Advanced (Cost 100~1000)
  { id: 's_dmg_3', name: '차원 돌파 II', category: 'STAR', type: 'PERK', baseCost: 150, costMultiplier: 2.3, level: 0, effectValue: 10.0, currency: 'STAR', description: '데미지 10배 증가', persistent: true },
  { id: 's_viral_1', name: '바이럴 마케팅', category: 'STAR', type: 'PERK', baseCost: 200, costMultiplier: 1.5, level: 0, effectValue: 0.02, currency: 'STAR', description: '바이럴(대박) 몹 출현 +2%', persistent: true },
  { id: 's_boss_1', name: '보스 슬레이어', category: 'STAR', type: 'PERK', baseCost: 300, costMultiplier: 1.8, level: 0, effectValue: 3.0, currency: 'STAR', description: '보스 대상 데미지 3배', persistent: true },
  { id: 's_offline_1', name: '잠방 수익', category: 'STAR', type: 'SYSTEM', baseCost: 400, costMultiplier: 2.0, level: 0, effectValue: 0.1, currency: 'STAR', description: '시청자 감소율 -10% 완화', persistent: true },
  { id: 's_sub_1', name: '구독 뱃지', category: 'STAR', type: 'PERK', baseCost: 500, costMultiplier: 2.5, level: 0, effectValue: 0.5, currency: 'STAR', description: '구독자 증가량 +50%', persistent: true },
  
  // Tier 4: Master (Cost 1000~10000)
  { id: 's_dmg_4', name: '차원 돌파 III', category: 'STAR', type: 'PERK', baseCost: 1500, costMultiplier: 2.4, level: 0, effectValue: 50.0, currency: 'STAR', description: '데미지 50배 증가', persistent: true },
  { id: 's_crit_2', name: '치명적 매력 II', category: 'STAR', type: 'PERK', baseCost: 2000, costMultiplier: 2.0, level: 0, effectValue: 0.1, currency: 'STAR', description: '치명타 확률 +10%', persistent: true },
  { id: 's_auto_3', name: '오토 클리커 V3', category: 'STAR', type: 'SYSTEM', baseCost: 3000, costMultiplier: 3.0, level: 0, effectValue: 50, currency: 'STAR', description: '초당 +50회 자동 클릭', persistent: true },
  { id: 's_gold_2', name: '연금술', category: 'STAR', type: 'PERK', baseCost: 5000, costMultiplier: 2.5, level: 0, effectValue: 10.0, currency: 'STAR', description: '골드 획득 10배 증가', persistent: true },
  { id: 's_start_1', name: '금수저 스타트', category: 'STAR', type: 'PERK', baseCost: 8000, costMultiplier: 4.0, level: 0, effectValue: 10, currency: 'STAR', description: '환생 시 10 스테이지부터 시작', persistent: true },
  
  // Tier 5: Legend (Cost 10000+)
  { id: 's_dmg_5', name: '초월적 힘', category: 'STAR', type: 'PERK', baseCost: 15000, costMultiplier: 2.5, level: 0, effectValue: 100.0, currency: 'STAR', description: '데미지 100배 증가', persistent: true },
  { id: 's_viral_2', name: '온 우주가 도와줌', category: 'STAR', type: 'PERK', baseCost: 20000, costMultiplier: 2.0, level: 0, effectValue: 0.05, currency: 'STAR', description: '바이럴 몹 출현 +5%', persistent: true },
  { id: 's_cdmg_2', name: '팩트 폭력 II', category: 'STAR', type: 'PERK', baseCost: 30000, costMultiplier: 2.0, level: 0, effectValue: 10.0, currency: 'STAR', description: '치명타 데미지 +1000%', persistent: true },
  { id: 's_speed_1', name: '광속 진행', category: 'STAR', type: 'PERK', baseCost: 50000, costMultiplier: 3.0, level: 0, effectValue: 0.5, currency: 'STAR', description: '몬스터 리젠 속도 50% 단축', persistent: true },
  { id: 's_veteran', name: '쌉고인물', category: 'STAR', type: 'PERK', baseCost: 60000, costMultiplier: 1.0, level: 0, effectValue: 50000.0, currency: 'STAR', description: '기본 장비(몽둥이, 슬라임, 웹캠) 효율 1조배(1e12) 증가', persistent: true },
  { id: 's_click_god', name: '클릭이 신이 됩니다', category: 'STAR', type: 'PERK', baseCost: 90000, costMultiplier: 1.0, level: 0, effectValue: 10000.0, currency: 'STAR', description: '클릭 데미지 10,000배 (신계의 손가락)', persistent: true },
  { id: 's_auto_max', name: 'AI 대리 방송', category: 'STAR', type: 'SYSTEM', baseCost: 100000, costMultiplier: 5.0, level: 0, effectValue: 200, currency: 'STAR', description: '초당 +200회 자동 클릭', persistent: true },
  
  // Tier 6: God (Cost 1M+)
  { id: 's_god_1', name: '신성 모독', category: 'STAR', type: 'PERK', baseCost: 1000000, costMultiplier: 3.0, level: 0, effectValue: 1000.0, currency: 'STAR', description: '데미지 1,000배 증가', persistent: true },
  { id: 's_god_2', name: '무한의 재화', category: 'STAR', type: 'PERK', baseCost: 5000000, costMultiplier: 3.0, level: 0, effectValue: 1000.0, currency: 'STAR', description: '골드 획득 1,000배 증가', persistent: true },
  { id: 's_god_3', name: '시간 역행', category: 'STAR', type: 'PERK', baseCost: 10000000, costMultiplier: 10.0, level: 0, effectValue: 50, currency: 'STAR', description: '환생 시 50 스테이지 스킵', persistent: true },
  { id: 's_final', name: '우주 정복', category: 'STAR', type: 'PERK', baseCost: 100000000, costMultiplier: 100.0, level: 0, effectValue: 10000.0, currency: 'STAR', description: '모든 능력치 10,000배 폭증', persistent: true },
];

export const STORY_ARCS = [
  { 
    subLimit: 0, 
    name: '하꼬의 숲', 
    themes: ['Fantasy Forest', 'Peaceful Meadow'],
    monsters: ['슬라임', '고블린', '멧돼지', '도적', '관심종자 늑대', '어그로 식물', '훈련용 허수아비'],
    bosses: ['숲의 주인 베어', '거대 슬라임 킹', '오크 정찰대장', '타락한 숲의 정령']
  },
  { 
    subLimit: 100000, 
    name: '실버 마운틴 (10만+)', 
    themes: ['Dark Volcanic Pass', 'Dungeon Entrance'],
    monsters: ['해골 병사', '용암 거미', '다크 엘프', '트롤', '가고일', '악플러 임프', '사이버 렉카'],
    bosses: ['지옥의 문지기 케르베로스', '화염 마신 이프리트', '언데드 나이트', '붉은 용의 환영']
  },
  { 
    subLimit: 10000000, 
    name: '골드 시티 (천만+)', 
    themes: ['Cyberpunk City', 'Golden Palace'],
    monsters: ['경비 로봇', '황금 슬라임', '사이보그 닌자', '타락한 천사', '미디어 재벌', '저작권 트롤'],
    bosses: ['황금의 제왕 미다스', '메카 드래곤', '대천사 메타트론', '심연의 감시자']
  },
  { 
    subLimit: 10000000000, 
    name: '다이아몬드 차원 (100억+)', 
    themes: ['Cosmic Void', 'Abstract Dimension'],
    monsters: ['공허의 유령', '차원 기생충', '블랙홀 스폰', '시간의 모래시계', '데이터 조각', '존재하지 않는 자'],
    bosses: ['우주의 포식자', '시간의 지배자 크로노스', '엔트로피의 화신', '창조주의 그림자']
  }
];

export const CHAT_MESSAGES_IDLE = ["용사님 나죽어~", "딜 실화냐?", "구독하면 몬스터가 죽나요?", "알고리즘 타고 옴", "광고 좀 스킵해", "와 퀄리티 무엇", "도네 쏜다!", "ㅋㅋㅋㅋㅋ", "나락 가나요?", "용사님 화이팅", "방종 하지마세요", "채팅 읽어줘!", "레전드 갱신 ㄷㄷ", "이게 게임이지", "ㄴㅇㄱ", "와 샌즈!"];
export const CHAT_USERS = ["알고리즘수호자", "치즈왕자", "칼바람망령", "팬", "안티", "시청자A", "회장님", "뉴비", "지나가던사람", "개발자", "GM", "성이름", "마이리틀포니", "노찬우", "뚝배기브레이커"];
export const CHAT_COLORS = ["text-blue-400", "text-[#00FFA3]", "text-yellow-400", "text-pink-400", "text-purple-400", "text-white", "text-red-400"];

export const RANKER_NAMES = [
  "전설의 용사", "차원유랑자", "슬라임헌터", "빛의 수호자", "어둠의 군주", "만렙토끼", "소드마스터", 
  "화염의 마법사", "얼음여왕", "그림자 암살자", "시간여행자", "드래곤슬레이어", "무한의 주인", 
  "별의 인도자", "공허의 지배자", "신성기사", "대마도사", "정령왕", "천둥군주", "바람의 방랑자",
  "붉은 혜성", "심해의 제왕", "황금기사", "크리스탈", "네크로맨서", "비스트마스터", "룬마스터",
  "천상의 목소리", "지옥의 불꽃", "우주방위대", "갤럭시", "스타로드", "코스믹 호러", "엔트로피",
  "슈뢰딩거의 고양이", "라플라스의 악마", "맥스웰의 도깨비", "파인만", "아인슈타인", "호킹",
  "제우스", "포세이돈", "하데스", "아레스", "아테나", "아폴론", "아르테미스", "헤파이스토스",
  "오딘", "토르", "로키", "프레이야", "발키리", "펜릴", "요르문간드", "수르트",
  "라", "아누비스", "오시리스", "이시스", "호루스", "세트", "토트",
  "가브리엘", "미카엘", "루시퍼", "벨제붑", "아스모데우스", "리바이어던", "베헤모스",
  "길가메시", "엔키두", "이스칸달", "멀린", "아서왕", "잔다르크", "쿠훌린",
  "손오공", "저팔계", "사오정", "삼장법사", "우마왕", "나타태자",
  "드라큘라", "프랑켄슈타인", "늑대인간", "미라", "투명인간", "팬텀"
];
