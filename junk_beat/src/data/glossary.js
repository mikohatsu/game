export const glossary = {
  jammed: { label: '방해', color: '#6ae4ff', desc: '적이 주는 피해가 턴마다 20%씩 감소하며 1씩 사라짐.' },
  vulnerable: { label: '취약', color: '#ff8aa7', desc: '해당 적이 받는 피해 50% 증가, 턴 종료 시 1 감소.' },
  boost: { label: '부스트', color: '#ffdf78', desc: '다음 공격 피해 +50% 후 소모.' },
  heat: { label: '열', color: '#ff6b6b', desc: '턴 종료 시 열×2 만큼 자가 피해.' },
  block: { label: '실드', color: '#6ae4ff', desc: '받는 피해를 차단. 적 실드도 동일.' },
  rest: { label: '휴식', color: '#72f5c8', desc: '전투 사이에서 체력을 회복.' },
}

export const intentGlossary = {
  single: { label: '단일 공격', desc: '플레이어에게 단일 피해를 줍니다.' },
  multi: { label: '연속 타격', desc: '여러 번의 타격으로 블록을 깎습니다.' },
  buff: { label: '방어 강화', desc: '적이 실드를 얻습니다.' },
  charge: { label: '차지', desc: '강한 단일 공격.' },
  fortify: { label: '장갑 강화', desc: '많은 실드를 얻습니다.' },
  zap: { label: '감전 펄스', desc: '단일 전기 피해.' },
  heal: { label: '자가 수복', desc: 'HP를 회복합니다.' },
}
