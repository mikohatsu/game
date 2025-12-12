import { SymbolDef, GameState, GRID_TOTAL, GRID_SIZE, Rarity } from '../types';
import { SYMBOLS } from '../constants';

// Helper to get symbol from ID
export const getSymbol = (id: string): SymbolDef => {
  return SYMBOLS.find(s => s.id === id) || SYMBOLS[0];
};

// Check if index is valid
const isValid = (idx: number) => idx >= 0 && idx < GRID_TOTAL;

// Get adjacent indices (Up, Down, Left, Right)
const getAdjacents = (idx: number): number[] => {
  const row = Math.floor(idx / GRID_SIZE);
  const col = idx % GRID_SIZE;
  const adjs: number[] = [];

  if (row > 0) adjs.push(idx - GRID_SIZE); // Top
  if (row < GRID_SIZE - 1) adjs.push(idx + GRID_SIZE); // Bottom
  if (col > 0) adjs.push(idx - 1); // Left
  if (col < GRID_SIZE - 1) adjs.push(idx + 1); // Right

  return adjs;
};

interface SpinResult {
  score: number;
  grid: (SymbolDef | null)[];
  animations: { idx: number, type: 'destroy' | 'buff' | 'transform', value?: number | string }[];
  breakdown: string[];
}

export const calculateSpinScore = (grid: (SymbolDef | null)[]): SpinResult => {
  let score = 0;
  const animations: any[] = [];
  const breakdown: string[] = [];
  
  // Clone grid to handle transformations/destruction safely
  // We actually need a multi-pass system: 
  // Pass 1: Synergies that change state (Destroy/Transform)
  // Pass 2: Calculation of values
  
  // However, for simplicity in this version, we calculate value based on current snapshot, 
  // but if something is "destroyed", it yields value but disappears for next turn? 
  // In Luck be a Landlord, destruction happens during scoring.
  
  // Let's do a simplified version: We iterate through the grid.
  // We mark items for destruction.
  
  const destroyedIndices = new Set<number>();
  const multipliers = new Map<number, number>(); // Index -> Multiplier
  const baseValues = new Map<number, number>(); // Index -> Base Value
  const flatBonuses = new Map<number, number>(); // Index -> Added Value

  // Initialize
  grid.forEach((sym, idx) => {
    if (!sym) return;
    multipliers.set(idx, 1);
    baseValues.set(idx, sym.baseValue);
    flatBonuses.set(idx, 0);
  });

  // Synergy Pass
  grid.forEach((source, idx) => {
    if (!source) return;

    const adjacents = getAdjacents(idx);

    // Destruction Logic
    if (source.destroys && source.destroys.length > 0) {
      adjacents.forEach(adjIdx => {
        const target = grid[adjIdx];
        if (target && source.destroys!.includes(target.id) && !destroyedIndices.has(adjIdx)) {
            destroyedIndices.add(adjIdx);
            // Being destroyed usually gives a massive bonus to the destroyer or just removes the junk
            if (source.id === 'miner') {
                flatBonuses.set(idx, (flatBonuses.get(idx) || 0) + 10);
                breakdown.push(`Miner mined Ore (+10)`);
                animations.push({ idx: adjIdx, type: 'destroy' });
                animations.push({ idx, type: 'buff', value: '+10' });
            } else if (source.id === 'cat') {
                // Example logic not in constants yet, but generic pattern
            } else if (source.id === 'void') {
                flatBonuses.set(idx, (flatBonuses.get(idx) || 0) + 10);
                breakdown.push(`Void consumed ${target.name} (+10)`);
                animations.push({ idx: adjIdx, type: 'destroy' });
            }
        }
      });
    }

    // Multiplier Logic
    if (source.multiplies && source.multiplies.length > 0) {
        adjacents.forEach(adjIdx => {
            const target = grid[adjIdx];
            if (target && source.multiplies!.includes(target.id)) {
                // If it's a specific multiplier like Sun -> Flower
                let mult = 2;
                if (source.id === 'sun') mult = 3;
                
                multipliers.set(adjIdx, (multipliers.get(adjIdx) || 1) * mult);
                breakdown.push(`${source.name} boosted ${target.name} (x${mult})`);
                animations.push({ idx: adjIdx, type: 'buff', value: `x${mult}` });
            }
        });
    }

    // Adjacency Bonus Logic
    if (source.bonusPerAdjacent) {
        let count = 0;
        adjacents.forEach(adjIdx => {
            const target = grid[adjIdx];
            if (target && target.id === source.bonusPerAdjacent!.target) {
                count++;
            }
        });
        if (count > 0) {
            const bonus = count * source.bonusPerAdjacent.amount;
            flatBonuses.set(idx, (flatBonuses.get(idx) || 0) + bonus);
            breakdown.push(`${source.name} near ${source.bonusPerAdjacent.target} (+${bonus})`);
            animations.push({ idx, type: 'buff', value: `+${bonus}` });
        }
    }
  });

  // Final Calculation
  grid.forEach((sym, idx) => {
    if (!sym) return;
    
    // If destroyed, it usually doesn't score itself in some games, but in others it scores then dies.
    // Let's say destroyed items DO NOT score to encourage removing them, 
    // UNLESS the destroyer absorbed their value (handled in destruction logic above).
    if (destroyedIndices.has(idx)) return;

    let itemScore = (baseValues.get(idx)! + flatBonuses.get(idx)!) * multipliers.get(idx)!;
    score += itemScore;
  });

  // Construct new grid (remove destroyed items)
  // In a real slot machine, items might shift down, but here let's just leave empty spots 
  // or have them be null (which will be refilled next spin)
  const newGrid = grid.map((s, i) => destroyedIndices.has(i) ? null : s);

  return { score: Math.floor(score), grid: newGrid, animations, breakdown };
};

export const getRandomSymbol = (inventory: SymbolDef[]): SymbolDef => {
    // Simple random pick from inventory
    // If inventory is smaller than grid, we might get duplicates or empties?
    // In this game, Inventory is a "Deck". We draw from deck.
    // If deck > grid size, we pick random. If deck < grid size, we add "Empty" symbols?
    // Let's assume inventory is the pool we pick from with replacement.
    const idx = Math.floor(Math.random() * inventory.length);
    return inventory[idx];
};

export const generateShopOptions = (): SymbolDef[] => {
    // Weighted random for rarity
    const roll = Math.random();
    let rarityPool = Rarity.COMMON;
    if (roll > 0.95) rarityPool = Rarity.LEGENDARY;
    else if (roll > 0.80) rarityPool = Rarity.RARE;
    else if (roll > 0.50) rarityPool = Rarity.UNCOMMON;

    const pool = SYMBOLS.filter(s => s.rarity === rarityPool);
    const options: SymbolDef[] = [];
    
    // Pick 3 distinct
    for(let i=0; i<3; i++) {
        // Fallback to random common if pool empty (unlikely)
        const item = pool.length > 0 
            ? pool[Math.floor(Math.random() * pool.length)]
            : SYMBOLS[0];
        options.push(item);
    }
    return options;
}
