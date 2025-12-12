import { SymbolDef, ArtifactDef, Rarity } from './types';
import { Coins, Gem, Pickaxe, User, Skull, Sun, Moon, Sparkles, Sprout, Ghost, Zap, Anchor, Hexagon } from 'lucide-react';

export const SYMBOLS: SymbolDef[] = [
  // Commons
  { id: 'coin', name: 'BitCoin', icon: 'Coins', description: 'Basic currency.', baseValue: 1, rarity: Rarity.COMMON, type: 'resource' },
  { id: 'ore', name: 'Raw Data', icon: 'Hexagon', description: 'Worthless alone. Miners love it.', baseValue: 0, rarity: Rarity.COMMON, type: 'resource' },
  { id: 'flower', name: 'Glitch Flower', icon: 'Sprout', description: 'Grows with Sun.', baseValue: 1, rarity: Rarity.COMMON, type: 'resource' },
  { id: 'mouse', name: 'Cyber Rat', icon: 'Ghost', description: 'Small critter.', baseValue: 1, rarity: Rarity.COMMON, type: 'animal' },
  
  // Uncommons
  { id: 'gem', name: 'Neon Gem', icon: 'Gem', description: 'Shiny and valuable.', baseValue: 3, rarity: Rarity.UNCOMMON, type: 'resource' },
  { id: 'miner', name: 'Data Miner', icon: 'Pickaxe', description: 'Destroys Raw Data for big profit.', baseValue: 2, rarity: Rarity.UNCOMMON, type: 'person', destroys: ['ore'] },
  { id: 'wolf', name: 'Synth Wolf', icon: 'Zap', description: 'Gets +5 if next to Moon.', baseValue: 2, rarity: Rarity.UNCOMMON, type: 'animal', bonusPerAdjacent: { target: 'moon', amount: 5 } },
  { id: 'moon', name: 'Dark Moon', icon: 'Moon', description: 'Buffs Wolves. Night vibes.', baseValue: 3, rarity: Rarity.UNCOMMON, type: 'resource' },
  
  // Rares
  { id: 'hacker', name: 'White Hat', icon: 'User', description: 'Multiplies adjacent Gems by x2.', baseValue: 2, rarity: Rarity.RARE, type: 'person', multiplies: ['gem'] },
  { id: 'sun', name: 'Core Star', icon: 'Sun', description: 'Multiplies adjacent Flowers by x3.', baseValue: 3, rarity: Rarity.RARE, type: 'resource', multiplies: ['flower'] },
  
  // Legendaries
  { id: 'joker', name: 'Wildcard', icon: 'Sparkles', description: 'Multiplies adjacent symbols by x2.', baseValue: 1, rarity: Rarity.LEGENDARY, type: 'joker', multiplies: ['coin', 'gem', 'ore', 'flower', 'mouse', 'miner', 'wolf', 'moon', 'hacker', 'sun'] },
  { id: 'void', name: 'The Void', icon: 'Skull', description: 'Destroys everything adjacent. Gives +10 per destroy.', baseValue: 1, rarity: Rarity.LEGENDARY, type: 'wild', destroys: ['coin', 'ore', 'flower', 'mouse', 'gem', 'miner', 'wolf', 'moon', 'hacker', 'sun', 'joker'] },
];

export const ARTIFACTS: ArtifactDef[] = [
  { id: 'gpu', name: 'Golden GPU', description: 'Start each round with +5 Credits.', rarity: Rarity.UNCOMMON, effectType: 'passive_income', value: 5 },
  { id: 'prism', name: 'Light Prism', description: 'All spins give x1.1 multiplier.', rarity: Rarity.RARE, effectType: 'multiply_all', value: 1.1 },
  { id: 'battery', name: 'Overcharge', description: '+1 Spin per round.', rarity: Rarity.RARE, effectType: 'extra_spin', value: 1 },
];

export const INITIAL_DECK = ['coin', 'coin', 'coin', 'ore', 'ore', 'flower', 'mouse'];