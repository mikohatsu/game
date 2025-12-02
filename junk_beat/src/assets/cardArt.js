const curated = {
  rustSlice: { icon: '🪓', bg: 'linear-gradient(135deg, #ff8a5c, #2e0f0f)' },
  rustSlicePlus: { icon: '🪓', bg: 'linear-gradient(135deg, #ffa67a, #3b1010)' },
  makeshiftGuard: { icon: '🛡️', bg: 'linear-gradient(135deg, #4b6bff, #0c1c3a)' },
  makeshiftGuardPlus: { icon: '🛡️', bg: 'linear-gradient(135deg, #6aa1ff, #0d244f)' },
  pulseWeak: { icon: '⚡', bg: 'linear-gradient(135deg, #ffde59, #2b1a00)' },
  pulseWeakPlus: { icon: '⚡', bg: 'linear-gradient(135deg, #ffe88c, #3b2400)' },
  overclock: { icon: '🔥', bg: 'linear-gradient(135deg, #ff5c93, #2a0b1a)' },
  empLance: { icon: '🔱', bg: 'linear-gradient(135deg, #5ce0ff, #041b26)' },
  coolantFlush: { icon: '💧', bg: 'linear-gradient(135deg, #6ee7ff, #0a2435)' },
  scrapstorm: { icon: '💥', bg: 'linear-gradient(135deg, #ff7e5f, #3c0f23)' },
  siphonPatch: { icon: '🩹', bg: 'linear-gradient(135deg, #9ef0c9, #0f2a1f)' },
  heavyShield: { icon: '🏰', bg: 'linear-gradient(135deg, #6ad1ff, #102d47)' },
  doubleCut: { icon: '✂️', bg: 'linear-gradient(135deg, #ff9b6a, #2d0d0d)' },
  chainDrive: { icon: '⛓️', bg: 'linear-gradient(135deg, #9bd4ff, #0f2336)' },
  railOver: { icon: '🚄', bg: 'linear-gradient(135deg, #ffd166, #1c0c26)' },
  anchoredShot: { icon: '⚓', bg: 'linear-gradient(135deg, #72c5ff, #0b1e33)' },
  pulseNova: { icon: '🌌', bg: 'linear-gradient(135deg, #b388ff, #0e0a2a)' },
  stackVuln: { icon: '📡', bg: 'linear-gradient(135deg, #ffb347, #1c1b38)' },
  vulnStrike: { icon: '🗡️', bg: 'linear-gradient(135deg, #ff8fab, #311014)' },
  ventedWall: { icon: '🪛', bg: 'linear-gradient(135deg, #9cf0ff, #0f2b33)' },
  bulwark: { icon: '🪨', bg: 'linear-gradient(135deg, #8bb3ff, #0b1933)' },
  tripleCut: { icon: '🔪', bg: 'linear-gradient(135deg, #ffb38a, #2f0f0f)' },
  stormTag: { icon: '🌩️', bg: 'linear-gradient(135deg, #b8e2ff, #071a2a)' },
  railLoop: { icon: '♾️', bg: 'linear-gradient(135deg, #ffd56f, #221428)' },
  overdriveSpin: { icon: '🌀', bg: 'linear-gradient(135deg, #ff7edb, #1a0b2f)' },
  cryoshield: { icon: '❄️', bg: 'linear-gradient(135deg, #9de0ff, #0b223a)' },
  doomSignal: { icon: '🚨', bg: 'linear-gradient(135deg, #ff4b6e, #270a1b)' },
  ionAnchor: { icon: '🧲', bg: 'linear-gradient(135deg, #86f0ff, #0c2630)' },
  bladeSymphony: { icon: '🎼', bg: 'linear-gradient(135deg, #ffd3a1, #231020)' },
  entropyCore: { icon: '🌀', bg: 'linear-gradient(135deg, #9c86ff, #0f0b2a)' },
}

const palettes = [
  ['#ff8a8a', '#1b0b0b'],
  ['#8affd1', '#0c1f19'],
  ['#8ac7ff', '#0a1a2a'],
  ['#ffd37f', '#2f1a0a'],
  ['#f58bff', '#1b0f2c'],
  ['#9fff8a', '#0f2c14'],
  ['#8afff8', '#0c222a'],
]

const icons = ['⚙️', '🔧', '🛰️', '🔋', '🪫', '🪤', '🪓', '🔩']

export const getCardArt = (cardId) => {
  if (curated[cardId]) return curated[cardId]
  const hash = Array.from(cardId).reduce((acc, c) => acc + c.charCodeAt(0), 0)
  const palette = palettes[hash % palettes.length]
  const icon = icons[hash % icons.length]
  return {
    icon,
    bg: `linear-gradient(135deg, ${palette[0]}, ${palette[1]})`,
  }
}
