import { useEffect, useMemo, useRef, useState } from 'react'
import { cardLibrary, initialDeck, rewardPool } from '../data/cards'
import { enemies } from '../data/enemies'
import { shuffle } from '../utils/shuffle'

const BASE_ENERGY = 3
const pickOffers = () => shuffle(rewardPool).slice(0, 3)
const upgradeMap = {
  rustSlice: 'rustSlicePlus',
  makeshiftGuard: 'makeshiftGuardPlus',
  pulseWeak: 'pulseWeakPlus',
}

export const useGameEngine = () => {
  const [collection, setCollection] = useState(initialDeck)
  const [deck, setDeck] = useState(() => shuffle(initialDeck))
  const [discard, setDiscard] = useState([])
  const [hand, setHand] = useState([])
  const [energy, setEnergy] = useState(BASE_ENERGY)
  const [turn, setTurn] = useState(1)
  const [player, setPlayer] = useState({ hp: 70, maxHp: 70, block: 0, statuses: { boost: 0, heat: 0 } })
  const [enemyIndex, setEnemyIndex] = useState(0)
  const [enemy, setEnemy] = useState(() => ({
    ...enemies[0],
    hp: enemies[0].maxHp,
    block: 0,
    statuses: { vulnerable: 0, jammed: 0 },
  }))
  const [intentStep, setIntentStep] = useState(0)
  const [log, setLog] = useState(['폐허 된 공장에서 기계들의 비트가 울린다.'])
  const [floating, setFloating] = useState([])
  const [reward, setReward] = useState(null)
  const floatId = useRef(0)

  useEffect(() => {
    drawCards(5)
  }, [])

  const currentIntent = useMemo(() => enemy.pattern[intentStep % enemy.pattern.length], [enemy.pattern, intentStep])
  const timeline = useMemo(
    () => enemy.pattern.map((step, idx) => ({ label: step.note, active: idx === intentStep, detail: step.desc, intent: step.intent })),
    [enemy.pattern, intentStep],
  )

  const addLog = (text) => setLog((prev) => [text, ...prev].slice(0, 18))

  const addFloating = (value, tone = 'damage', side = 'enemy') => {
    floatId.current += 1
    const id = floatId.current
    setFloating((prev) => [...prev, { id, value, tone, side }])
    setTimeout(() => setFloating((prev) => prev.filter((f) => f.id !== id)), 950)
  }

  const drawCards = (amount) => {
    setDeck((prevDeck) => {
      let newDeck = [...prevDeck]
      const newHand = []

      setDiscard((prevDiscard) => {
        let newDiscard = [...prevDiscard]

        for (let i = 0; i < amount; i++) {
          if (newDeck.length === 0) {
            if (newDiscard.length === 0) break
            newDeck = shuffle(newDiscard)
            newDiscard = []
          }
          const card = newDeck.shift()
          if (card) newHand.push(card)
        }

        return newDiscard
      })

      setHand((prev) => [...prev, ...newHand])
      return newDeck
    })
  }

  const applyDamage = (base) => {
    setEnemy((prev) => {
      const vuln = prev.statuses.vulnerable || 0
      const boost = player.statuses.boost || 0
      let dmg = base + (boost ? Math.floor(base * 0.5) : 0)
      if (vuln) dmg = Math.floor(dmg * 1.5)
      const blocked = Math.min(prev.block || 0, dmg)
      const remainingBlock = Math.max(0, (prev.block || 0) - dmg)
      const finalDmg = Math.max(0, dmg - blocked)
      const hp = Math.max(0, prev.hp - finalDmg)
      addFloating(-dmg, 'damage', 'enemy')
      addLog(`▶ 공격 ${dmg} 피해 (${blocked} 차단)`)
      const nextState = { ...prev, hp, block: remainingBlock }
      if (nextState.hp <= 0) {
        setReward({
          options: ['fusion', 'add', 'rest'],
          offers: pickOffers(),
          stage: 'choice',
        })
      }
      return nextState
    })
    if (player.statuses.boost) setPlayer((p) => ({ ...p, statuses: { ...p.statuses, boost: 0 } }))
  }

  const addBlock = (amount, target = 'player') => {
    if (target === 'player') setPlayer((prev) => ({ ...prev, block: prev.block + amount }))
    if (target === 'enemy') setEnemy((prev) => ({ ...prev, block: (prev.block || 0) + amount }))
    addFloating(`+${amount} 실드`, 'heal', target)
  }

  const heal = (amount) => {
    setPlayer((prev) => ({ ...prev, hp: Math.min(prev.maxHp, prev.hp + amount) }))
    addFloating(`+${amount} HP`, 'heal', 'player')
  }

  const applyStatus = (key, amount) => {
    setEnemy((prev) => ({
      ...prev,
      statuses: { ...prev.statuses, [key]: (prev.statuses[key] || 0) + amount },
    }))
    addLog(`적 상태: ${key} +${amount}`)
  }

  const consumeEnemyStatus = (key) => {
    setEnemy((prev) => {
      if (!prev.statuses[key]) return prev
      return { ...prev, statuses: { ...prev.statuses, [key]: 0 } }
    })
    addLog(`적 상태 ${key}를 소거했다`)
  }

  const addStatus = (key, amount) => {
    setPlayer((prev) => ({
      ...prev,
      statuses: { ...prev.statuses, [key]: (prev.statuses[key] || 0) + amount },
    }))
    addLog(`자신 상태: ${key} +${amount}`)
  }

  const clearStatus = (key, amount) => {
    setPlayer((prev) => ({
      ...prev,
      statuses: { ...prev.statuses, [key]: Math.max(0, (prev.statuses[key] || 0) - amount) },
    }))
    addLog(`상태 ${key} 감소 ${amount}`)
  }

  const resolveEnemy = () => {
    setEnemy((prev) => {
      const intent = prev.pattern[intentStep % prev.pattern.length]
      let next = { ...prev }
      const jammed = prev.statuses.jammed || 0
      const damageMod = jammed ? Math.max(0, 1 - jammed * 0.2) : 1

      const dealToPlayer = (raw) => {
        const dmg = Math.max(0, Math.round(raw * damageMod))
        setPlayer((p) => {
          const remainingBlock = Math.max(0, p.block - dmg)
          const leftover = Math.max(0, dmg - p.block)
          const hp = Math.max(0, p.hp - leftover)
          return { ...p, hp, block: remainingBlock }
        })
        addFloating(-Math.round(raw * damageMod), 'damage', 'player')
        addLog(`◀ 적 피해 ${Math.round(raw * damageMod)}`)
      }

      if (intent.intent === 'single') dealToPlayer(intent.damage)
      if (intent.intent === 'multi') {
        for (let i = 0; i < intent.hits; i++) dealToPlayer(intent.damage)
      }
      if (intent.intent === 'buff') {
        next.block = (next.block || 0) + (intent.block || 0)
        addLog('적이 방어막을 전개했다')
      }
      if (intent.intent === 'charge') dealToPlayer(intent.damage)
      if (intent.intent === 'fortify') {
        next.block = (next.block || 0) + (intent.block || 0)
        addLog('적이 장갑을 두껍게 했다')
      }
      if (intent.intent === 'zap') dealToPlayer(intent.damage)
      if (intent.intent === 'heal') {
        next.hp = Math.min(next.maxHp, next.hp + (intent.heal || 0))
        addFloating(`+${intent.heal} HP`, 'heal', 'enemy')
      }

      if (jammed) next.statuses.jammed = Math.max(0, jammed - 1)
      if (next.statuses.vulnerable) next.statuses.vulnerable = Math.max(0, next.statuses.vulnerable - 1)
      if (next.block) next.block = Math.max(0, next.block - 4)

      setIntentStep((i) => (i + 1) % prev.pattern.length)
      return next
    })
  }

  const endTurn = () => {
    if (reward) return
    setEnergy(BASE_ENERGY)
    setHand([])
    setPlayer((p) => ({ ...p, block: 0 }))
    if (player.statuses.heat > 0) {
      const heatDmg = player.statuses.heat * 2
      setPlayer((p) => ({ ...p, hp: Math.max(0, p.hp - heatDmg) }))
      addFloating(-heatDmg, 'damage', 'player')
      addLog(`과열로 ${heatDmg} 피해를 입었다`)
    }
    resolveEnemy()
    setTurn((t) => t + 1)
    drawCards(5)
  }

  const onPlayCard = (cardId, index) => {
    if (reward) return
    const card = cardLibrary[cardId]
    if (!card) return
    if (energy < card.energy) return
    setEnergy((e) => e - card.energy)
    setHand((prev) => prev.filter((_, idx) => idx !== index))
    setDiscard((prev) => [...prev, cardId])

    card.play({
      applyDamage,
      addBlock,
      heal,
      applyStatus,
      consumeEnemyStatus,
      addStatus,
      clearStatus,
      statuses: enemy.statuses,
    })
  }

  const restart = () => {
    setReward(null)
    setDeck(shuffle(collection))
    setDiscard([])
    setHand([])
    setEnergy(BASE_ENERGY)
    setTurn(1)
    setPlayer({ hp: 70, maxHp: 70, block: 0, statuses: { boost: 0, heat: 0 } })
    setEnemy({
      ...enemies[enemyIndex],
      hp: enemies[enemyIndex].maxHp,
      block: 0,
      statuses: { vulnerable: 0, jammed: 0 },
    })
    setIntentStep(0)
    setLog(['시스템을 재부팅했다.'])
    drawCards(5)
  }

  const switchEnemy = () => {
    setReward(null)
    setEnemyIndex((idx) => {
      const next = (idx + 1) % enemies.length
      setEnemy({
        ...enemies[next],
        hp: enemies[next].maxHp,
        block: 0,
        statuses: { vulnerable: 0, jammed: 0 },
      })
      setIntentStep(0)
      setLog([`대상 전환: ${enemies[next].name}`])
      setDeck(shuffle(collection))
      setDiscard([])
      setHand([])
      drawCards(5)
      return next
    })
  }

  const handleRewardChoice = (option) => {
    if (option === 'rest') {
      heal(16)
      finalizeReward()
      return
    }
    if (option === 'add') {
      setReward((r) => ({ ...r, stage: 'add', choice: null }))
      return
    }
    if (option === 'fusion') {
      setReward((r) => ({ ...r, stage: 'fusion' }))
      return
    }
  }

  const addCardToCollection = (cardId) => {
    const updated = [...collection, cardId]
    setCollection(updated)
    setDeck(shuffle(updated))
    setDiscard([])
    setHand([])
    addLog(`${cardLibrary[cardId].name} 추가`)
    finalizeReward()
  }

  const fuseCard = (cardId) => {
    const upgrade = upgradeMap[cardId]
    if (!upgrade) {
      addLog('이 카드는 융합/업그레이드할 수 없습니다')
      return
    }
    const updated = [...collection]
    const idx = updated.indexOf(cardId)
    if (idx >= 0) updated[idx] = upgrade
    setCollection(updated)
    setDeck(shuffle(updated))
    setDiscard([])
    setHand([])
    addLog(`${cardLibrary[cardId].name} → ${cardLibrary[upgrade].name} 융합 완료`)
    finalizeReward()
  }

  const finalizeReward = () => {
    setReward(null)
    switchEnemy()
  }

  const deckList = collection

  return {
    cardLibrary,
    deckList,
    reward,
    hand,
    energy,
    turn,
    player,
    enemy,
    log,
    floating,
    currentIntent,
    timeline,
    onPlayCard,
    endTurn,
    restart,
    switchEnemy,
    handleRewardChoice,
    addCardToCollection,
    fuseCard,
    setReward,
    addLog,
    addStatus,
  }
}
