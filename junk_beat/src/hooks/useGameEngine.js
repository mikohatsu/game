import { useEffect, useMemo, useRef, useState } from 'react'
import { artifacts as artifactList } from '../data/artifacts'
import { cardLibrary, fusionCards, fusionRecipes, initialDeck, rewardPool } from '../data/cards'
import { bossEnemy, enemies, specialEnemies } from '../data/enemies'
import { shuffle } from '../utils/shuffle'

const BASE_ENERGY = 3

const createFusionKey = (a, b) => [a, b].sort().join('+')

export const useGameEngine = () => {
  const [customCards, setCustomCards] = useState({})
  const [collection, setCollection] = useState(initialDeck)
  const [deck, setDeck] = useState(() => shuffle(initialDeck))
  const [discard, setDiscard] = useState([])
  const [hand, setHand] = useState([])
  const [energy, setEnergy] = useState(BASE_ENERGY)
  const [turn, setTurn] = useState(1)
  const [player, setPlayer] = useState({ hp: 70, maxHp: 70, block: 0, statuses: { boost: 0, heat: 0, drawNext: 0 } })
  const [enemyIndex, setEnemyIndex] = useState(0)
  const [enemy, setEnemy] = useState(() => ({
    ...enemies[0],
    hp: enemies[0].maxHp,
    block: 0,
    statuses: { vulnerable: 0, jammed: 0 },
    kind: 'normal',
  }))
  const [intentStep, setIntentStep] = useState(0)
  const [log, setLog] = useState(['폐허 된 공장에서 기계들의 비트가 울린다.'])
  const [floating, setFloating] = useState([])
  const [reward, setReward] = useState(null)
  const [fusionSources, setFusionSources] = useState({})
  const [artifacts, setArtifacts] = useState([])
  const [encounter, setEncounter] = useState(1)
  const [fusionCodex, setFusionCodex] = useState([])
  const floatId = useRef(0)

  const mergedCards = useMemo(() => ({ ...cardLibrary, ...fusionCards, ...customCards }), [customCards])

  const energyCap = useMemo(() => {
    const bonus = artifacts.reduce((acc, id) => {
      const art = artifactList.find((a) => a.id === id)
      return acc + (art?.effect?.energyMax || 0)
    }, 0)
    return BASE_ENERGY + bonus
  }, [artifacts])

  const currentIntent = useMemo(() => enemy.pattern[intentStep % enemy.pattern.length], [enemy.pattern, intentStep])
  const timeline = useMemo(() => {
    const step = enemy.pattern[intentStep % enemy.pattern.length]
    return step ? [{ label: step.note, active: true, detail: step.desc, intent: step.intent }] : []
  }, [enemy.pattern, intentStep])

  const addLog = (text) => setLog((prev) => [text, ...prev].slice(0, 22))

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

  useEffect(() => {
    drawCards(5)
  }, [])

  const lifestealRatio = useMemo(() => {
    const art = artifacts.find((id) => artifactList.find((a) => a.id === id && a.effect.lifesteal))
    if (!art) return 0
    const found = artifactList.find((a) => a.id === art)
    return found.effect.lifesteal || 0
  }, [artifacts])

  const attackBonus = useMemo(
    () => artifacts.reduce((acc, id) => acc + (artifactList.find((a) => a.id === id)?.effect?.attackBonus || 0), 0),
    [artifacts],
  )

  const applyDamage = (base) => {
    const bonus = attackBonus
    setEnemy((prev) => {
      const vuln = prev.statuses.vulnerable || 0
      const boost = player.statuses.boost || 0
      let dmg = base + bonus + (boost ? Math.floor(base * 0.5) : 0)
      if (vuln) dmg = Math.floor(dmg * 1.5)
      const blocked = Math.min(prev.block || 0, dmg)
      const remainingBlock = Math.max(0, (prev.block || 0) - dmg)
      const finalDmg = Math.max(0, dmg - blocked)
      const hp = Math.max(0, prev.hp - finalDmg)
      addFloating(-dmg, 'damage', 'enemy')
      addLog(`▶ 공격 ${dmg} 피해 (${blocked} 차단)`)
      if (lifestealRatio && finalDmg > 0) {
        const healAmount = Math.max(1, Math.floor(finalDmg * lifestealRatio))
        heal(healAmount)
      }
      const nextState = { ...prev, hp, block: remainingBlock }
      if (nextState.hp <= 0) handleVictory()
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
      const scale = 1 + 0.04 * encounter
      const dealToPlayer = (raw) => {
        const dmg = Math.max(0, Math.round(raw * damageMod * scale))
        setPlayer((p) => {
          const remainingBlock = Math.max(0, p.block - dmg)
          const leftover = Math.max(0, dmg - p.block)
          const hp = Math.max(0, p.hp - leftover)
          return { ...p, hp, block: remainingBlock }
        })
        addFloating(-Math.round(raw * damageMod * scale), 'damage', 'player')
        addLog(`◀ 적 피해 ${Math.round(raw * damageMod * scale)}`)
      }

      if (intent.intent === 'single') dealToPlayer(intent.damage)
      if (intent.intent === 'multi') {
        for (let i = 0; i < intent.hits; i++) dealToPlayer(intent.damage)
      }
      if (intent.intent === 'buff') {
        next.block = (next.block || 0) + Math.round((intent.block || 0) * scale)
        addLog('적이 방어막을 전개했다')
      }
      if (intent.intent === 'charge') dealToPlayer(intent.damage)
      if (intent.intent === 'fortify') {
        next.block = (next.block || 0) + Math.round((intent.block || 0) * scale)
        addLog('적이 장갑을 두껍게 했다')
      }
      if (intent.intent === 'zap') dealToPlayer(intent.damage)
      if (intent.intent === 'heal') {
        next.hp = Math.min(next.maxHp, next.hp + Math.round((intent.heal || 0) * scale))
        addFloating(`+${Math.round((intent.heal || 0) * scale)} HP`, 'heal', 'enemy')
      }

      if (jammed) next.statuses.jammed = Math.max(0, jammed - 1)
      if (next.statuses.vulnerable) next.statuses.vulnerable = Math.max(0, next.statuses.vulnerable - 1)
      if (next.block) next.block = Math.max(0, next.block - 4)

      setIntentStep(() => Math.floor(Math.random() * prev.pattern.length))
      return next
    })
  }

  const endTurn = () => {
    if (reward) return
    const drawNext = player.statuses.drawNext || 0
    setEnergy(energyCap)
    setHand([])
    setPlayer((p) => ({ ...p, block: 0, statuses: { ...p.statuses, drawNext: 0 } }))
    if (player.statuses.heat > 0) {
      const heatDmg = player.statuses.heat * 2
      setPlayer((p) => ({ ...p, hp: Math.max(0, p.hp - heatDmg) }))
      addFloating(-heatDmg, 'damage', 'player')
      addLog(`과열로 ${heatDmg} 피해를 입었다`)
    }
    resolveEnemy()
    setTurn((t) => t + 1)
    drawCards(5 + drawNext)
  }

  const onPlayCard = (cardId, index) => {
    if (reward) return
    const card = mergedCards[cardId]
    if (!card) return
    if (energy < card.energy) return
    setEnergy((e) => e - card.energy)
    setHand((prev) => prev.filter((_, idx) => idx !== index))
    setDiscard((prev) => [...prev, cardId])

    card.play?.({
      applyDamage,
      addBlock,
      heal,
      applyStatus,
      consumeEnemyStatus,
      addStatus,
      clearStatus,
      statuses: enemy.statuses,
      drawCard: (n) => drawCards(n),
    })
  }

  const handleVictory = () => {
    const isBoss = enemy.kind === 'boss'
    const isSpecial = enemy.kind === 'special'
    const relicRoll = isBoss ? 1 : isSpecial ? Math.random() < 0.3 : false
    const availableArtifacts = artifactList.filter((a) => !artifacts.includes(a.id))
    const relicOptions = relicRoll ? shuffle(availableArtifacts).slice(0, isBoss ? 3 : 1) : []
    const cardOffers = shuffle(rewardPool).slice(0, 3)
    const fusionReady = turn % 4 === 0
    const upgradeReady = turn % 3 === 0

    setReward({
      stage: 'choice',
      cardOffers,
      fusionReady,
      upgradeReady,
      relicOptions,
    })
  }

  const restart = () => {
    setReward(null)
    const freshDeck = shuffle(collection)
    setDeck(freshDeck)
    setDiscard([])
    setHand([])
    setEnergy(energyCap)
    setTurn(1)
    const baseHp = 70 + artifacts.reduce((acc, id) => acc + (artifactList.find((a) => a.id === id)?.effect?.maxHpBonus || 0), 0)
    const baseBlock = artifacts.reduce((acc, id) => acc + (artifactList.find((a) => a.id === id)?.effect?.startBlock || 0), 0)
    setPlayer({ hp: baseHp, maxHp: baseHp, block: baseBlock, statuses: { boost: 0, heat: 0, drawNext: 0 } })
    pickEnemy(encounter)
    setIntentStep(0)
    setLog(['시스템을 재부팅했다.'])
    setTimeout(() => drawCards(5), 0)
  }

  const pickEnemy = (enc) => {
    let pool = enemies
    let kind = 'normal'
    if (enc % 10 === 0) {
      pool = [bossEnemy]
      kind = 'boss'
    } else if (enc % 5 === 0) {
      pool = specialEnemies
      kind = 'special'
    }
    const selected = pool[Math.floor(Math.random() * pool.length)]
    const scale = 1 + 0.08 * (enc - 1)
    const multiplier = kind === 'boss' ? 1.3 : kind === 'special' ? 1.15 : 1
    const maxHp = Math.round(selected.maxHp * scale * multiplier)
    setEnemy({
      ...selected,
      hp: maxHp,
      maxHp,
      block: 0,
      kind,
      statuses: { vulnerable: 0, jammed: 0 },
      pattern: selected.pattern.map((p) => ({
        ...p,
        damage: p.damage ? Math.round(p.damage * (1 + 0.04 * (enc - 1)) * multiplier) : p.damage,
        block: p.block ? Math.round(p.block * (1 + 0.04 * (enc - 1)) * multiplier) : p.block,
        heal: p.heal ? Math.round(p.heal * (1 + 0.04 * (enc - 1)) * multiplier) : p.heal,
      })),
    })
  }

  const nextEnemy = (collectionOverride) => {
    const sourceCollection = collectionOverride || collection
    const freshDeck = shuffle(sourceCollection)
    setEncounter((c) => {
      const next = c + 1
      pickEnemy(next)
      return next
    })
    setReward(null)
    setDeck(freshDeck)
    setDiscard([])
    setHand([])
    setEnergy(energyCap)
    setTurn(1)
    const baseHp = 70 + artifacts.reduce((acc, id) => acc + (artifactList.find((a) => a.id === id)?.effect?.maxHpBonus || 0), 0)
    const baseBlock = artifacts.reduce((acc, id) => acc + (artifactList.find((a) => a.id === id)?.effect?.startBlock || 0), 0)
    setPlayer({ hp: baseHp, maxHp: baseHp, block: baseBlock, statuses: { boost: 0, heat: 0, drawNext: 0 } })
    setIntentStep(0)
    setLog(['새 적을 찾았다.'])
    setTimeout(() => drawCards(5), 0)
  }

  const handleRewardChoice = (option) => {
    if (!reward) return
    if (option === 'card') setReward((r) => ({ ...r, stage: 'card' }))
    if (option === 'fusion') setReward((r) => ({ ...r, stage: 'fusion' }))
    if (option === 'upgrade') setReward((r) => ({ ...r, stage: 'upgrade' }))
    if (option === 'relic') setReward((r) => ({ ...r, stage: 'relic' }))
  }

  const addCardToCollection = (cardId) => {
    const updated = [...collection, cardId]
    setCollection(updated)
    setDeck(shuffle(updated))
    setDiscard([])
    setHand([])
    addLog(`${mergedCards[cardId].name} 추가`)
    finalizeReward(updated)
  }

  const fuseCardLegacy = (cardId) => {
    const upgrade = fusionRecipes[cardId]
    if (!upgrade) {
      addLog('융합/업그레이드 불가 카드입니다')
      return
    }
    const updated = [...collection]
    const idx = updated.indexOf(cardId)
    if (idx >= 0) updated[idx] = upgrade
    setCollection(updated)
    setDeck(shuffle(updated))
    setDiscard([])
    setHand([])
    addLog(`${mergedCards[cardId].name} → ${mergedCards[upgrade].name} 융합 완료`)
    finalizeReward()
  }

  const fuseTwoCards = (mainId, subId) => {
    const main = mergedCards[mainId]
    const sub = mergedCards[subId]
    if (!main || !sub) {
      addLog('카드를 선택하세요')
      return
    }
    const key = createFusionKey(mainId, subId)
    const recipeResult = fusionRecipes[key]
    if (recipeResult && fusionCards[recipeResult]) {
      // 전용 융합 카드
      const updatedCollection = (() => {
        const copy = [...collection]
        let removed = 0
        for (let i = 0; i < copy.length && removed < 2; i++) {
          if (copy[i] === mainId || copy[i] === subId) {
            copy.splice(i, 1)
            i--
            removed++
          }
        }
        copy.push(recipeResult)
        return copy
      })()
      setCollection(updatedCollection)
      setFusionSources((prev) => ({ ...prev, [recipeResult]: [mainId, subId] }))
      setDeck(shuffle(updatedCollection))
      setDiscard([])
      setHand([])
      addLog(`전용 융합: ${fusionCards[recipeResult].name}`)
      setFusionCodex((prev) => (prev.includes(key) ? prev : [...prev, key]))
      finalizeReward(updatedCollection)
      return
    }
    const newId = `fusion-${Date.now()}-${Math.floor(Math.random() * 999)}`
    const energyCost = Math.max(1, (main.energy || 0) + (sub.energy || 0) - 1)
    const newCard = {
      name: `${main.name}+`,
      type: '융합',
      rarity: 'rare',
      energy: energyCost,
      desc: `${main.desc}\n${sub.desc}`,
      play: (ctx) => {
        main.play?.(ctx)
        sub.play?.(ctx)
      },
    }
    addLog('전용 조합 없음: 능력 합산 융합')
    setCustomCards((prev) => ({ ...prev, [newId]: newCard }))
    setFusionSources((prev) => ({ ...prev, [newId]: [mainId, subId] }))
    const updatedCollection = (() => {
      const copy = [...collection]
      let removed = 0
      for (let i = 0; i < copy.length && removed < 2; i++) {
        if (copy[i] === mainId || copy[i] === subId) {
          copy.splice(i, 1)
          i--
          removed++
        }
      }
      copy.push(newId)
      return copy
    })()
    setCollection(updatedCollection)
    setDeck(shuffle(updatedCollection))
    setDiscard([])
    setHand([])
    addLog(`융합 완료: ${newCard.name}`)
    finalizeReward(updatedCollection)
  }

  const upgradeCard = (cardId) => {
    const upgradeMap = {
      rustSlice: 'rustSlicePlus',
      makeshiftGuard: 'makeshiftGuardPlus',
      pulseWeak: 'pulseWeakPlus',
    }
    const upgraded = upgradeMap[cardId]
    if (upgraded) {
      const updatedCollection = (() => {
        const copy = [...collection]
        const idx = copy.indexOf(cardId)
        if (idx >= 0) copy[idx] = upgraded
        return copy
      })()
      setCollection(updatedCollection)
      addLog(`${mergedCards[cardId].name} 강화 완료`)
      setDeck(shuffle(updatedCollection))
      setDiscard([])
      setHand([])
      finalizeReward(updatedCollection)
      return
    } else {
      // 수치 강화 카드 생성
      const base = mergedCards[cardId]
      const newId = `${cardId}-up-${Date.now()}`
      const desc = `${base.desc}\n(강화)`
      const addBonus = artifactList.reduce((acc, art) => {
        if (!artifacts.includes(art.id)) return acc
        return acc + (art.effect.upgradeBonus || 0)
      }, 2)
      const play = base.play
      const wrapped = {
        ...base,
        energy: Math.max(0, base.energy - (artifactList.find((a) => artifacts.includes(a.id) && a.effect.upgradeEnergyDiscount)?.effect.upgradeEnergyDiscount || 0)),
        desc,
        play: (ctx) => {
          const originalDamage = ctx.applyDamage
          const boostedCtx = {
            ...ctx,
            applyDamage: (val) => originalDamage(val + addBonus),
            addBlock: (val, target) => ctx.addBlock(val + addBonus, target),
          }
          play?.(boostedCtx)
        },
      }
      setCustomCards((prev) => ({ ...prev, [newId]: wrapped }))
      const updatedCollection = (() => {
        const copy = [...collection]
        const idx = copy.indexOf(cardId)
        if (idx >= 0) copy[idx] = newId
        return copy
      })()
      setCollection(updatedCollection)
      addLog(`${base.name} 강화(수치) 완료`)
      setDeck(shuffle(updatedCollection))
      setDiscard([])
      setHand([])
      finalizeReward(updatedCollection)
      return
    }
  }

  const gainArtifact = (artifactId) => {
    setArtifacts((prev) => [...prev, artifactId])
    addLog(`유물 획득: ${artifactList.find((a) => a.id === artifactId)?.name}`)
    finalizeReward()
  }

  const finalizeReward = (collectionOverride) => {
    setReward(null)
    nextEnemy(collectionOverride)
  }

  const deckList = collection

  return {
    cards: mergedCards,
    deckList,
    fusionSources,
    fusionCodex,
    reward,
    hand,
    energy,
    energyCap,
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
    nextEnemy,
    handleRewardChoice,
    addCardToCollection,
    fuseTwoCards,
    upgradeCard,
    gainArtifact,
  }
}
