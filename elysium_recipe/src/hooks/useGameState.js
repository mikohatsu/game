import { useState, useEffect, useCallback } from 'react';
import { calculateDeviation, getGrade, getPollutionIncrease, calculateRent, checkMutation } from '../utils/gameLogic';
import { materials } from '../data/materials';
import { recipes, findRecipeByIngredients, getRecipesByTier } from '../data/recipes';
import { getMutationByRecipeId } from '../data/mutations';
import { upgrades, getUpgradeById } from '../data/upgrades';

const STORAGE_KEY = 'elysium_recipe_save';
const MAX_AP = 10;

const initialState = {
  day: 1,
  week: 1,
  gold: 1000,
  ap: MAX_AP,
  pollution: 0,
  reputation: 0,
  inventory: {},
  history: [],
  grimoire: {},
  purchasedUpgrades: [],
  discoveredRecipes: {
    'T1-01': true,
    'T1-02': true,
    'T1-03': true,
    'T1-04': true,
    'T1-05': true,
  },
  attemptCount: 0,
  gameOver: false,
  gameWon: false,
  endingType: null,
  hasSeenIntro: false,
  hasSeenTutorial: false,
};

export function useGameState() {
  const [gameState, setGameState] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to load save:', e);
        return initialState;
      }
    }
    return initialState;
  });

  // 자동 저장
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
  }, [gameState]);

  // 세이브 초기화
  const resetGame = useCallback(() => {
    setGameState(initialState);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  // 인트로/튜토리얼 완료 표시
  const markIntroSeen = useCallback(() => {
    setGameState(prev => ({ ...prev, hasSeenIntro: true }));
  }, []);

  const markTutorialSeen = useCallback(() => {
    setGameState(prev => ({ ...prev, hasSeenTutorial: true }));
  }, []);

  // 재료 구매
  const buyMaterial = useCallback((materialId, quantity = 1) => {
    const material = materials.find(m => m.id === materialId);
    if (!material) return false;

    const totalCost = material.basePrice * quantity;
    if (gameState.gold < totalCost) return false;

    setGameState(prev => ({
      ...prev,
      gold: prev.gold - totalCost,
      inventory: {
        ...prev.inventory,
        [materialId]: (prev.inventory[materialId] || 0) + quantity,
      },
    }));
    return true;
  }, [gameState.gold]);

  // 재료 판매
  const sellItem = useCallback((itemId, quantity = 1) => {
    if (!gameState.inventory[itemId] || gameState.inventory[itemId] < quantity) {
      return false;
    }

    const recipe = recipes.find(r => r.id === itemId);
    const material = materials.find(m => m.id === itemId);
    const basePrice = recipe?.baseValue || material?.basePrice || 0;

    const sellPrice = Math.floor(basePrice * 0.7 * quantity);

    setGameState(prev => ({
      ...prev,
      gold: prev.gold + sellPrice,
      inventory: {
        ...prev.inventory,
        [itemId]: prev.inventory[itemId] - quantity,
      },
    }));
    return true;
  }, [gameState.inventory]);

  // 조합 실험 (돌연변이 포함)
  const performSynthesis = useCallback((mat1Id, mat2Id, inputParams) => {
    if (gameState.ap < 2) return { success: false, message: 'AP가 부족합니다!' };

    if (!gameState.inventory[mat1Id] || !gameState.inventory[mat2Id]) {
      return { success: false, message: '재료가 부족합니다!' };
    }

    const recipe = findRecipeByIngredients(mat1Id, mat2Id);
    if (!recipe) {
      return { success: false, message: '알 수 없는 조합입니다!' };
    }

    const deviation = calculateDeviation(inputParams, recipe.target);
    const grade = getGrade(deviation);
    const pollutionIncrease = getPollutionIncrease(grade);

    // 돌연변이 체크
    const isMutation = grade !== 'F' && checkMutation(gameState.pollution, grade);
    const mutation = isMutation ? getMutationByRecipeId(recipe.id) : null;

    const resultItemId = mutation ? mutation.id : recipe.id;
    const resultItem = mutation || recipe;

    const result = {
      attemptNumber: gameState.attemptCount + 1,
      materials: [mat1Id, mat2Id],
      input: inputParams,
      resultItem: resultItemId,
      grade,
      deviation,
      isMutation,
      timestamp: Date.now(),
    };

    setGameState(prev => {
      const newState = {
        ...prev,
        ap: prev.ap - 2,
        pollution: Math.min(200, prev.pollution + pollutionIncrease),
        attemptCount: prev.attemptCount + 1,
        history: [result, ...prev.history].slice(0, 100),
        inventory: {
          ...prev.inventory,
          [mat1Id]: prev.inventory[mat1Id] - 1,
          [mat2Id]: prev.inventory[mat2Id] - 1,
        },
      };

      if (grade !== 'F') {
        newState.inventory[resultItemId] = (prev.inventory[resultItemId] || 0) + 1;

        // 비망록 업데이트 (돌연변이는 기록 안함)
        if (!mutation) {
          const existing = prev.grimoire[recipe.id];
          if (!existing ||
              grade < existing.bestGrade ||
              (grade === existing.bestGrade && deviation < existing.bestDeviation)) {
            newState.grimoire = {
              ...prev.grimoire,
              [recipe.id]: {
                recipeId: recipe.id,
                bestParams: inputParams,
                bestGrade: grade,
                bestDeviation: deviation,
                timestamp: Date.now(),
              },
            };
          }
        }

        if (!prev.discoveredRecipes[recipe.id]) {
          newState.discoveredRecipes = {
            ...prev.discoveredRecipes,
            [recipe.id]: true,
          };
        }
      }

      return newState;
    });

    return {
      success: true,
      result,
      recipe: resultItem,
      isMutation,
    };
  }, [gameState.ap, gameState.inventory, gameState.attemptCount, gameState.pollution]);

  // 탐사 시스템
  const performExploration = useCallback(() => {
    const hasArchiveLv3 = gameState.purchasedUpgrades.includes('arc_lv3');
    const apCost = hasArchiveLv3 ? 2 : 3;

    if (gameState.ap < apCost) {
      return { success: false, message: 'AP가 부족합니다!' };
    }

    // 업그레이드에 따른 확률 조정
    const hasArchiveLv1 = gameState.purchasedUpgrades.includes('arc_lv1');
    const hasArchiveLv4 = gameState.purchasedUpgrades.includes('arc_lv4');

    const successRate = hasArchiveLv1 ? 0.5 : 0.4;
    const criticalRate = hasArchiveLv4 ? 0.25 : 0.1;

    const roll = Math.random();

    // 현재 주차에 맞는 Tier 결정
    let targetTier = 1;
    if (gameState.week >= 3) targetTier = 3;
    else if (gameState.week >= 2) targetTier = 2;

    // 발견 가능한 레시피 목록
    const availableRecipes = getRecipesByTier(targetTier).filter(
      r => !gameState.discoveredRecipes[r.id]
    );

    if (availableRecipes.length === 0) {
      return {
        success: false,
        message: `현재 Tier ${targetTier}의 모든 레시피를 발견했습니다!`
      };
    }

    const randomRecipe = availableRecipes[Math.floor(Math.random() * availableRecipes.length)];

    setGameState(prev => ({
      ...prev,
      ap: prev.ap - apCost,
    }));

    // 대성공 (정답 획득)
    if (roll < criticalRate) {
      setGameState(prev => ({
        ...prev,
        discoveredRecipes: {
          ...prev.discoveredRecipes,
          [randomRecipe.id]: true,
        },
      }));

      return {
        success: true,
        type: 'critical',
        message: `📜 대성공! ${randomRecipe.icon} ${randomRecipe.name}의 완벽한 레시피를 발견했습니다!`,
        recipe: randomRecipe,
      };
    }
    // 성공 (단서 획득)
    else if (roll < successRate) {
      setGameState(prev => ({
        ...prev,
        discoveredRecipes: {
          ...prev.discoveredRecipes,
          [randomRecipe.id]: true,
        },
      }));

      return {
        success: true,
        type: 'success',
        message: `📄 성공! ${randomRecipe.icon} ${randomRecipe.name}의 단서를 발견했습니다!`,
        recipe: randomRecipe,
      };
    }
    // 실패
    else {
      return {
        success: true,
        type: 'fail',
        message: '🔍 실패... 유용한 정보를 찾지 못했습니다.',
      };
    }
  }, [gameState.ap, gameState.week, gameState.purchasedUpgrades, gameState.discoveredRecipes]);

  // 하루 종료
  const endDay = useCallback(() => {
    const newDay = gameState.day + 1;
    const newWeek = Math.ceil(newDay / 7);
    const isRentDay = newDay % 7 === 0;

    // 업그레이드 효과
    const hasVentilation = gameState.purchasedUpgrades.includes('env_lv1');
    const pollutionReduction = hasVentilation ? 5 : 0;

    if (isRentDay) {
      const rent = calculateRent(newWeek);
      if (gameState.gold < rent) {
        setGameState(prev => ({
          ...prev,
          gameOver: true,
          endingType: 'bankruptcy',
        }));
        return { success: false, message: '임대료를 내지 못해 게임오버입니다!', rent };
      }

      setGameState(prev => ({
        ...prev,
        day: newDay,
        week: newWeek,
        ap: MAX_AP,
        gold: prev.gold - rent,
        pollution: Math.max(0, prev.pollution - pollutionReduction),
      }));

      return { success: true, message: `임대료 ${rent}G를 납부했습니다!`, rent };
    }

    setGameState(prev => ({
      ...prev,
      day: newDay,
      week: newWeek,
      ap: MAX_AP,
      pollution: Math.max(0, prev.pollution - pollutionReduction),
    }));

    return { success: true, message: '새로운 하루가 시작되었습니다!' };
  }, [gameState.day, gameState.gold, gameState.purchasedUpgrades]);

  // 업그레이드 구매
  const purchaseUpgrade = useCallback((upgradeId) => {
    const upgrade = getUpgradeById(upgradeId);
    if (!upgrade) return { success: false, message: '업그레이드를 찾을 수 없습니다!' };
    if (gameState.gold < upgrade.cost) return { success: false, message: '골드가 부족합니다!' };
    if (gameState.purchasedUpgrades.includes(upgradeId)) {
      return { success: false, message: '이미 구매한 업그레이드입니다!' };
    }

    setGameState(prev => ({
      ...prev,
      gold: prev.gold - upgrade.cost,
      purchasedUpgrades: [...prev.purchasedUpgrades, upgradeId],
    }));

    return { success: true, message: `${upgrade.icon} ${upgrade.name} 구매 완료!` };
  }, [gameState.gold, gameState.purchasedUpgrades]);

  // 엔딩 체크
  const checkEnding = useCallback((recipeId) => {
    if (recipeId === 'T5-03') {
      setGameState(prev => ({
        ...prev,
        gameWon: true,
        gameOver: true,
        endingType: 'true_ending',
      }));
    } else if (recipeId === 'T5-01') {
      setGameState(prev => ({
        ...prev,
        gameWon: true,
        gameOver: true,
        endingType: 'normal_a',
      }));
    } else if (recipeId === 'T5-02') {
      setGameState(prev => ({
        ...prev,
        gameWon: true,
        gameOver: true,
        endingType: 'normal_b',
      }));
    }
  }, []);

  return {
    gameState,
    actions: {
      resetGame,
      markIntroSeen,
      markTutorialSeen,
      buyMaterial,
      sellItem,
      performSynthesis,
      performExploration,
      endDay,
      purchaseUpgrade,
      checkEnding,
    },
  };
}
