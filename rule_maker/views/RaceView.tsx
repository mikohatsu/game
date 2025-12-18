
import React, { useEffect, useRef, useState } from 'react';
import { Horse, RaceState, Artifact, PlayerState, HorseStrategy, DistanceAptitude, RaceConfig, TrackType } from '../types';
import { HorseSprite } from '../components/HorseSprite';
import { Button } from '../components/Button';

interface RaceViewProps {
  horses: Horse[];
  activeRules: Artifact[];
  betting: PlayerState['betting'];
  raceConfig: RaceConfig;
  onRaceEnd: (rankings: number[]) => void;
}

// Visual constants
const PIXELS_PER_METER = 6; 

// Effect Components
const FireEffect = () => (
  <div className="absolute inset-0 -top-4 -left-2 scale-150 mix-blend-screen opacity-80 pointer-events-none">
    <div className="w-full h-full bg-gradient-to-t from-red-500 via-orange-400 to-transparent animate-pulse rounded-full blur-md" />
  </div>
);

const WindEffect = () => (
  <div className="absolute top-1/2 -left-10 w-32 h-2 bg-gradient-to-r from-transparent via-cyan-300 to-transparent opacity-60 animate-wind pointer-events-none" />
);

const AuraEffect = ({ color }: { color: string }) => (
  <div className={`absolute inset-0 scale-125 rounded-full border-2 ${color} opacity-70 animate-ping pointer-events-none`} />
);

const updateRacePhysics = (
  currentState: RaceState, 
  rules: Artifact[],
  raceConfig: RaceConfig,
  timeScale: number
): RaceState => {
  const newState = { ...currentState, activeEffects: [] };
  const frameEffectsMap = new Map<string, number[]>(); // Grouping effects: EffectName -> HorseIDs

  const sortedByPos = [...newState.horses].sort((a, b) => b.position - a.position);
  const leader = sortedByPos[0];
  const lastPlace = sortedByPos[sortedByPos.length - 1];

  newState.horses = newState.horses.map(horse => {
    // Preserve 'RECOVERING' state from previous frame
    const wasRecovering = currentState.horses.find(h => h.id === horse.id)?.activeBuffs.includes('RECOVERING') || false;
    
    let speedMultiplier = 1.0;
    const activeBuffs: string[] = [];
    const triggerIdBase = `${horse.id}`;
    
    // --- 0. Track Affinity ---
    if (raceConfig.trackType === TrackType.DIRT && horse.trackPreference === TrackType.TURF) {
        if (!rules.some(r => r.id === 'offroad_tire')) {
            speedMultiplier -= 0.2;
        } else {
            activeBuffs.push('AURA_GOLD');
        }
    }
    if (raceConfig.trackType === TrackType.TURF && horse.trackPreference === TrackType.DIRT) {
        speedMultiplier -= 0.15;
    }

    // --- 1. Apply Rules (Artifacts) ---
    rules.forEach(rule => {
      let isTriggered = false;
      const triggerId = `${triggerIdBase}-${rule.id}`;

      // Number Rules
      if (rule.id === 'even_blessing' && horse.number % 2 === 0) {
        speedMultiplier += 0.15;
        activeBuffs.push('AURA_BLUE');
      }
      if (rule.id === 'odd_curse' && horse.number % 2 !== 0) {
        speedMultiplier -= 0.10;
        activeBuffs.push('AURA_PURPLE');
      }
      if (rule.id === 'lucky_seven' && horse.number === 7) {
        activeBuffs.push('AURA_GOLD');
      }

      // Physics Rules
      if (rule.id === 'zero_resistance' && horse.id === lastPlace.id) {
         speedMultiplier += 0.35;
         activeBuffs.push('WIND');
         if (!newState.triggeredSkills.includes(triggerId) && Math.random() < 0.05) isTriggered = true;
      }
      if (rule.id === 'mud_fight' && horse.position >= sortedByPos[2].position) {
         speedMultiplier -= 0.2;
      }
      
      const nearbyHorses = newState.horses.filter(h => h.id !== horse.id && Math.abs(h.position - horse.position) < 5);
      
      if (rule.id === 'social_distance' && nearbyHorses.length === 0) {
         speedMultiplier += 0.2;
         activeBuffs.push('WIND');
      }
      if (rule.id === 'wolf_pack' && nearbyHorses.length >= 2) {
         speedMultiplier += 0.25;
         activeBuffs.push('AURA_RED');
      }
      if (rule.id === 'sniper_sight' && (leader.position - horse.position) > 50) {
         speedMultiplier += 0.25;
         activeBuffs.push('AURA_BLUE');
      }

      if (rule.id === 'marathon_runner' && raceConfig.distance >= 2400) {
         activeBuffs.push('AURA_GOLD');
      }

      if (rule.id === 'runaway_king' && horse.strategy === HorseStrategy.RUNAWAY) {
        speedMultiplier += 0.2;
        activeBuffs.push('FIRE');
      }
      if (rule.id === 'short_sprint' && horse.distanceAptitude === DistanceAptitude.SHORT) {
        speedMultiplier += 0.2;
      }
      
      // Trigger Rules
      if (rule.id === 'prime_rebellion' && horse.tags.includes('소수') && horse.position > raceConfig.distance * 0.5) {
        speedMultiplier += 0.5;
        activeBuffs.push('AURA_GOLD');
        if (!newState.triggeredSkills.includes(triggerId)) isTriggered = true;
      }
      if (rule.id === 'adrenaline' && horse.position > raceConfig.distance - 600 && sortedByPos.findIndex(h => h.id === horse.id) > 2) {
         speedMultiplier += 1.0;
         activeBuffs.push('FIRE');
         if (!newState.triggeredSkills.includes(triggerId)) isTriggered = true;
      }
      if (rule.id === 'finish_blow' && horse.position > raceConfig.distance - 300) {
          speedMultiplier += 1.5;
          horse.staminaLeft = 0; // Burn all stamina
          activeBuffs.push('FIRE');
          if (!newState.triggeredSkills.includes(triggerId)) isTriggered = true;
      }

      if (isTriggered) {
        newState.triggeredSkills.push(triggerId);
        if (!frameEffectsMap.has(rule.name)) {
            frameEffectsMap.set(rule.name, []);
        }
        frameEffectsMap.get(rule.name)!.push(horse.id);
      }
    });

    // --- 2. Personality & Strategy ---
    const nearby = newState.horses.filter(h => h.id !== horse.id && Math.abs(h.position - horse.position) < 10);
    if (nearby.length > 0) {
      if (horse.personality === '겁쟁이') speedMultiplier -= 0.1;
      if (horse.personality === '싸움닭') {
        speedMultiplier += 0.2;
        activeBuffs.push('AURA_RED');
      }
    }
    if (horse.personality === '대담함' && horse.id === leader.id) speedMultiplier += 0.1;

    const progress = horse.position / raceConfig.distance;
    
    // Strategy Speed Curves (Determines "Pacing")
    if (horse.strategy === HorseStrategy.RUNAWAY) {
      // Runs fast early, risks burning out
      if (progress < 0.5) speedMultiplier += 0.35;
      else speedMultiplier -= 0.1;
    } else if (horse.strategy === HorseStrategy.FRONT) {
      if (progress < 0.7) speedMultiplier += 0.15;
    } else if (horse.strategy === HorseStrategy.STALKER) {
      if (progress > 0.4 && progress < 0.8) speedMultiplier += 0.2;
    } else if (horse.strategy === HorseStrategy.SWEEPER) {
      if (progress > 0.7) speedMultiplier += 0.4;
      else speedMultiplier -= 0.1; 
    } else if (horse.strategy === HorseStrategy.CLOSER) {
      if (progress > 0.85) speedMultiplier += 0.6;
      else speedMultiplier -= 0.15;
    }

    // --- 3. Stamina System (REVISED) ---
    // User Requirement: "Stamina full != speed buff."
    // User Requirement: "Recovery should be slow."
    
    let isRecovering = wasRecovering;
    
    if (isRecovering) {
        // [RECOVERY STATE]
        // Penalty: Severe slow down.
        speedMultiplier *= 0.55; 
        
        // Regen: Very slow. Takes time to get back in the race.
        const regenRate = 0.3; 
        horse.staminaLeft += regenRate * timeScale;
        
        // Exit Condition: Must be FULLY recovered to start running properly again
        if (horse.staminaLeft >= horse.maxStamina) {
            horse.staminaLeft = horse.maxStamina;
            isRecovering = false;
        } else {
            activeBuffs.push('RECOVERING');
        }
    } else {
        // [NORMAL STATE]
        // No speed bonus for having stamina. You just run at calculated speed.
        
        // Drain Calculation
        // 1. Base metabolism (just for existing)
        let drainRate = 0.05; 

        // 2. Effort Penalty: If running faster than base 100%, burn fuel EXPONENTIALLY
        // This makes "Runaway" or "Artifact Boosts" costly.
        if (speedMultiplier > 1.0) {
            const excessSpeed = speedMultiplier - 1.0;
            drainRate += excessSpeed * 0.8; 
        }

        // Modifiers
        if (horse.distanceAptitude === DistanceAptitude.SHORT && raceConfig.distance >= 2000) drainRate *= 1.5;
        if (rules.some(r => r.id === 'lucky_seven') && horse.number === 7) drainRate *= 0.7;
        if (rules.some(r => r.id === 'infinite_stamina') && horse.distanceAptitude === DistanceAptitude.LONG) drainRate = 0;
        if (rules.some(r => r.id === 'marathon_runner') && raceConfig.distance >= 2400) drainRate *= 0.5;
        if (horse.personality === '냉철함') drainRate *= 0.9;

        horse.staminaLeft -= drainRate * timeScale;

        // Entry Condition: Empty Stamina
        if (horse.staminaLeft <= 0) {
            horse.staminaLeft = 0;
            isRecovering = true;
            activeBuffs.push('RECOVERING');
        }
    }

    // --- 4. Movement ---
    const randomness = (Math.random() * 0.1) + 0.95; 
    const baseMove = (horse.stats.speed / 180) * horse.condition; 
    const moveAmount = baseMove * speedMultiplier * randomness * timeScale;
    const newPos = Math.min(horse.position + moveAmount, raceConfig.distance);
    
    if (newPos >= raceConfig.distance && !newState.finishedHorses.includes(horse.id)) {
      newState.finishedHorses.push(horse.id);
      newState.rankings.push(horse.id);
    }

    return { 
      ...horse, 
      position: newPos, 
      currentSpeed: moveAmount / timeScale, 
      activeBuffs 
    }; 
  });

  frameEffectsMap.forEach((ids, name) => {
    newState.activeEffects.push({ effectName: name, horseIds: ids });
  });

  return newState;
};

const MiniMap: React.FC<{ horses: Horse[], betting: PlayerState['betting'], distance: number }> = ({ horses, betting, distance }) => {
  return (
    <div className="w-64 h-48 bg-[#000000] border-4 border-[#333] shadow-xl relative overflow-hidden">
      <div className="absolute top-2 left-2 text-red-500 text-xs font-black animate-pulse">LIVE FEED ●</div>
      <svg viewBox="0 0 200 150" className="w-full h-full opacity-80">
        <path id="trackPath" d="M 50 40 L 150 40 C 180 40 180 110 150 110 L 50 110 C 20 110 20 40 50 40" fill="none" stroke="#222" strokeWidth="20" />
        <path d="M 50 40 L 150 40 C 180 40 180 110 150 110 L 50 110 C 20 110 20 40 50 40" fill="none" stroke="#555" strokeWidth="1" strokeDasharray="5,5" />
        <line x1="50" y1="30" x2="50" y2="50" stroke="#fff" strokeWidth="2" />
        <line x1="45" y1="30" x2="45" y2="50" stroke="#f00" strokeWidth="2" />
        {horses.map(h => {
          const percentage = Math.min(1, h.position / distance);
          const isTarget = h.id === betting.horseId || h.id === betting.secondHorseId;
          return (
            <circle key={h.id} r={isTarget ? 5 : 3} fill={h.color} stroke="white" strokeWidth={isTarget ? 2 : 0}>
              <animateMotion dur="0s" fill="freeze" repeatCount="1" keyPoints={`${percentage};${percentage}`} keyTimes="0;1" calcMode="linear">
                <mpath href="#trackPath" />
              </animateMotion>
            </circle>
          );
        })}
      </svg>
    </div>
  );
};

export const RaceView: React.FC<RaceViewProps> = ({ horses, activeRules, betting, raceConfig, onRaceEnd }) => {
  const [raceState, setRaceState] = useState<RaceState>({
    distance: raceConfig.distance,
    horses: JSON.parse(JSON.stringify(horses)),
    elapsedTime: 0,
    rankings: [],
    finishedHorses: [],
    activeEffects: [],
    triggeredSkills: []
  });
  
  const [cameraMode, setCameraMode] = useState<'LEADER' | 'BET' | 'FREE'>('LEADER');
  const [cameraOffset, setCameraOffset] = useState(0);
  const [shake, setShake] = useState(0); 
  
  // Effect Queue System
  const [effectQueue, setEffectQueue] = useState<{name: string, horseNames: string[]}[]>([]);
  const [currentEffect, setCurrentEffect] = useState<{name: string, horseNames: string[]} | null>(null);
  const [isProcessingEffect, setIsProcessingEffect] = useState(false);
  
  const timeScaleRef = useRef(1);
  const [currentTimeScale, setCurrentTimeScale] = useState(1);
  const [isSkipping, setIsSkipping] = useState(false);
  const [winnerAnnounced, setWinnerAnnounced] = useState<string | null>(null);

  const isDragging = useRef(false);
  const lastMouseX = useRef(0);
  const requestRef = useRef<number | null>(null);
  const isFinished = useRef(false);

  // Initial Rule Check
  useEffect(() => {
    const initialEffects: {name: string, horseNames: string[]}[] = [];
    
    activeRules.forEach(rule => {
      if (rule.effectType === 'PASSIVE') {
         const affectedHorses: string[] = [];
         
         horses.forEach(h => {
            let applies = false;
            if (rule.id === 'even_blessing' && h.number % 2 === 0) applies = true;
            if (rule.id === 'odd_curse' && h.number % 2 !== 0) applies = true;
            if (rule.id === 'lucky_seven' && h.number === 7) applies = true;
            if (rule.id === 'runaway_king' && h.strategy === HorseStrategy.RUNAWAY) applies = true;
            if (rule.id === 'short_sprint' && h.distanceAptitude === DistanceAptitude.SHORT) applies = true;
            if (rule.id === 'infinite_stamina' && h.distanceAptitude === DistanceAptitude.LONG) applies = true;
            if (rule.id === 'offroad_tire') applies = true; // Global
            if (rule.id === 'marathon_runner' && raceConfig.distance >= 2400) applies = true;
            
            if (applies) affectedHorses.push(`${h.number}.${h.name}`);
         });

         if (affectedHorses.length > 0) {
            initialEffects.push({ name: rule.name, horseNames: affectedHorses });
         }
      }
    });

    if (initialEffects.length > 0) {
        setEffectQueue(prev => [...prev, ...initialEffects]);
    }
  }, []);

  // Effect Queue Processor
  useEffect(() => {
    if (effectQueue.length > 0 && !isProcessingEffect) {
        setIsProcessingEffect(true);
        const nextEffect = effectQueue[0];
        setCurrentEffect(nextEffect);
        setShake(10);
        
        setTimeout(() => {
            setCurrentEffect(null);
            setEffectQueue(prev => prev.slice(1));
            setIsProcessingEffect(false);
        }, 2000);
    }
  }, [effectQueue, isProcessingEffect]);

  const handleSetTimeScale = (scale: number) => {
    timeScaleRef.current = scale;
    setCurrentTimeScale(scale);
  };

  const handleSkip = () => {
    setIsSkipping(true);
    let simulatedState = { ...raceState };
    while (simulatedState.finishedHorses.length < simulatedState.horses.length) {
      simulatedState = updateRacePhysics(simulatedState, activeRules, raceConfig, 1.0);
    }
    setRaceState(simulatedState);
  };

  const animate = () => {
    if (isSkipping) return;

    setRaceState(prevState => {
      if (prevState.finishedHorses.length === prevState.horses.length) {
        if (!isFinished.current) {
          isFinished.current = true;
          const winner = prevState.horses.find(h => h.id === prevState.rankings[0]);
          setWinnerAnnounced(winner?.name || null);
          setTimeout(() => onRaceEnd(prevState.rankings), 3000); 
        }
        return prevState;
      }

      const newState = updateRacePhysics(prevState, activeRules, raceConfig, timeScaleRef.current);
      
      if (newState.activeEffects.length > 0) {
         const newQueueItems = newState.activeEffects.map(effect => {
             const names = effect.horseIds.map(id => {
                 const h = newState.horses.find(h => h.id === id);
                 return h ? `${h.number}.${h.name}` : '';
             }).filter(n => n !== '');
             return { name: effect.effectName, horseNames: names };
         });
         
         setEffectQueue(prev => [...prev, ...newQueueItems]);
      }

      return newState;
    });

    setShake(prev => prev > 0 ? -prev * 0.8 : 0);
    
    if (!isFinished.current) {
      requestRef.current = requestAnimationFrame(animate);
    }
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  useEffect(() => {
    if (cameraMode === 'FREE') return;
    let targetX = 0;
    const sorted = [...raceState.horses].sort((a, b) => b.position - a.position);
    
    if (cameraMode === 'LEADER') {
      targetX = sorted[0].position * PIXELS_PER_METER;
    } else if (cameraMode === 'BET') {
      const myHorse = raceState.horses.find(h => h.id === betting.horseId);
      targetX = (myHorse ? myHorse.position : sorted[0].position) * PIXELS_PER_METER;
    }
    setCameraOffset(prev => prev + (targetX - prev - 400) * 0.1);
  }, [raceState.horses, cameraMode, betting.horseId, raceState.horses.map(h => h.position).join(',')]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (cameraMode === 'FREE') {
      isDragging.current = true;
      lastMouseX.current = e.clientX;
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging.current && cameraMode === 'FREE') {
      const delta = e.clientX - lastMouseX.current;
      setCameraOffset(prev => Math.max(0, prev - delta * 2));
      lastMouseX.current = e.clientX;
    }
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  // Determine ground texture based on track type
  const groundColor = raceConfig.trackType === TrackType.DIRT ? '#6d4c41' : '#2e7d32'; // Brown vs Green
  const groundTexture = raceConfig.trackType === TrackType.DIRT 
    ? 'https://www.transparenttextures.com/patterns/dirt-texture.png' 
    : 'https://www.transparenttextures.com/patterns/grass.png';

  const leaderPosition = raceState.horses.reduce((max, h) => Math.max(max, h.position), 0);

  return (
    <div 
      className="relative w-full h-full bg-[#111] overflow-hidden flex flex-col select-none cursor-grab active:cursor-grabbing"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      
      {/* HUD */}
      <div className="absolute top-0 left-0 right-0 z-30 p-4 flex justify-between items-start pointer-events-none">
        <div className="bg-black/80 p-3 border-l-4 border-yellow-600 shadow-lg text-white font-mono">
          <h3 className="text-xs text-yellow-600 font-bold mb-2 uppercase tracking-widest border-b border-gray-700 pb-1">Live Standings</h3>
          {raceState.horses
            .sort((a, b) => b.position - a.position)
            .slice(0, 5)
            .map((h, idx) => (
              <div key={h.id} className="flex items-center gap-3 mb-1">
                <span className={`font-black text-lg w-4 text-center ${idx === 0 ? 'text-yellow-500' : 'text-gray-500'}`}>{idx + 1}</span>
                <div className="w-3 h-3 rounded-sm border border-white/50" style={{backgroundColor: h.color}} />
                <span className="text-sm text-gray-200">{h.name}</span>
                {(betting.horseId === h.id || betting.secondHorseId === h.id) && <span className="text-[10px] bg-red-800 text-white px-1 ml-auto">BET</span>}
              </div>
            ))}
        </div>
        
        <div className="pointer-events-auto">
           <MiniMap horses={raceState.horses} betting={betting} distance={raceConfig.distance} />
           <div className="mt-2 flex gap-1 justify-end">
              <Button size="sm" variant={currentTimeScale === 1 ? 'primary' : 'secondary'} onClick={() => handleSetTimeScale(1)}>x1</Button>
              <Button size="sm" variant={currentTimeScale === 2 ? 'primary' : 'secondary'} onClick={() => handleSetTimeScale(2)}>x2</Button>
              <Button size="sm" variant={currentTimeScale === 4 ? 'primary' : 'secondary'} onClick={() => handleSetTimeScale(4)}>x4</Button>
              <Button size="sm" variant="danger" onClick={handleSkip}>SKIP</Button>
           </div>
        </div>
      </div>

      {/* Race Info Overlay */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
         <div className="bg-black/50 backdrop-blur-md px-4 py-1 rounded-full border border-white/20 text-white font-display text-sm">
            {raceConfig.name} <span className="text-gray-400 mx-2">|</span> 
            {raceConfig.distance}m <span className="text-gray-400 mx-2">|</span> 
            {raceConfig.trackType}
         </div>
      </div>

      {/* Rules Indicator */}
      <div className="absolute bottom-20 left-4 z-30 pointer-events-none">
         <h4 className="text-xs text-white/50 font-bold mb-1 uppercase tracking-widest">Active Variables</h4>
         <div className="flex flex-col gap-1 items-start">
            {activeRules.map(rule => (
               <div key={rule.id} className="bg-white/10 px-3 py-1 text-xs text-white border border-white/30 font-serif">
                  {rule.name}
               </div>
            ))}
         </div>
      </div>

      {/* Effects Overlay (Grouped) */}
      {currentEffect && (
        <div className="absolute top-1/4 left-0 right-0 z-50 flex flex-col items-center animate-slide-in-right pointer-events-none">
           <div className="bg-[#b91c1c] w-full py-4 flex flex-col items-center border-y-4 border-black shadow-xl relative overflow-hidden">
               <div className="absolute inset-0 bg-white/20 skew-x-12 animate-pulse"></div>
              <span className="text-5xl font-black text-white uppercase tracking-tighter drop-shadow-md z-10 mb-1">
                {currentEffect.name} !!!
              </span>
              <div className="flex flex-wrap justify-center gap-2 max-w-4xl px-4 z-10">
                  {currentEffect.horseNames.map((name, idx) => (
                      <span key={idx} className="bg-black/50 text-white px-2 py-0.5 text-sm font-mono border border-white/20">
                          {name}
                      </span>
                  ))}
              </div>
           </div>
        </div>
      )}

      {/* Winner Overlay */}
      {winnerAnnounced && (betting.horseId === raceState.rankings[0]) && (
         <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none bg-black/40">
            <div className="text-center animate-bounce-in bg-white p-8 border-8 border-double border-yellow-600 shadow-2xl transform rotate-2">
               <h1 className="text-8xl font-black text-black tracking-tighter mb-2">
                  JACKPOT
               </h1>
               <div className="text-3xl text-red-700 font-serif font-bold">
                  {winnerAnnounced} WINS!
               </div>
            </div>
         </div>
      )}

      {/* The Track */}
      <div className="flex-grow relative bg-[#a4b0be] overflow-hidden">
        <div className="absolute inset-0" style={{ transform: `translate(${Math.random() * shake}px, ${Math.random() * shake}px)` }}>
          
          {/* Sky/Background */}
          <div className="absolute inset-0 bg-[#2f3542]" style={{ backgroundPositionX: `${-cameraOffset * 0.1}px` }} />
          
          {/* Distance Markers */}
          <div className="absolute bottom-40 left-0 right-0 h-64 opacity-30" style={{ transform: `translateX(${-cameraOffset * 0.2}px)` }}>
             <div className="w-full h-full border-b border-white/20"></div>
          </div>

          <div className="absolute bottom-[200px] left-0 h-32 w-[100000px] bg-repeat-x flex items-end bg-[#57606f]" style={{ transform: `translateX(${-cameraOffset * 0.5}px)` }}>
            {Array.from({length: 300}).map((_, i) => (
                <div key={i} className={`w-2 h-16 mx-4 ${i % 5 === 0 ? 'bg-white/30' : 'bg-white/10'}`} />
            ))}
          </div>

          {/* Dynamic Track */}
          <div className="absolute bottom-0 h-[200px] w-[100000px]"
            style={{ 
              backgroundColor: groundColor,
              transform: `translateX(${-cameraOffset}px)`,
              backgroundImage: `url("${groundTexture}")`
            }}
          >
            {/* Markers */}
            {Array.from({length: Math.ceil(raceConfig.distance / 100) + 5}).map((_, i) => (
              <div key={i} className="absolute bottom-20 text-white/40 font-black text-6xl italic font-mono" style={{left: i * 100 * PIXELS_PER_METER}}>
                {(i * 100)}m
              </div>
            ))}

            {/* Finish Line */}
            <div className="absolute bottom-0 h-full w-8 bg-[url('https://www.transparenttextures.com/patterns/checkerboard.png')] z-0 flex flex-col justify-center items-center border-x-4 border-white" style={{ left: raceConfig.distance * PIXELS_PER_METER }}>
                <div className="bg-black text-white font-black py-1 px-4 whitespace-nowrap -rotate-90 border-2 border-white text-xl">FINISH</div>
            </div>

            {raceState.horses.map((horse, idx) => {
              const laneOffset = horse.lane * 22; 
              const currentPixel = horse.position * PIXELS_PER_METER;
              
              // Only show buff/debuff if significant (>20%)
              const isBuffed = horse.currentSpeed > horse.baseSpeed * 1.2; 
              const isDebuffed = horse.currentSpeed < horse.baseSpeed * 0.8;
              const isRecovering = horse.activeBuffs.includes('RECOVERING');

              // Stamina Calc
              const staminaPct = Math.max(0, (horse.staminaLeft / horse.maxStamina) * 100);
              let staminaColor = staminaPct > 50 ? 'bg-green-500' : staminaPct > 20 ? 'bg-yellow-500' : 'bg-red-600';
              if (isRecovering) staminaColor = 'bg-blue-400'; // Recovering color

              return (
                <div 
                  key={horse.id}
                  className="absolute transition-transform duration-75 ease-linear"
                  style={{ left: currentPixel, bottom: `${10 + laneOffset}px`, zIndex: 20 + idx }}
                >
                  {horse.activeBuffs.includes('FIRE') && <FireEffect />}
                  {horse.activeBuffs.includes('WIND') && <WindEffect />}
                  {horse.activeBuffs.includes('AURA_GOLD') && <AuraEffect color="border-yellow-400 bg-yellow-400/20" />}
                  {horse.activeBuffs.includes('AURA_BLUE') && <AuraEffect color="border-blue-400 bg-blue-400/20" />}
                  {horse.activeBuffs.includes('AURA_RED') && <AuraEffect color="border-red-500 bg-red-500/20" />}
                  {horse.activeBuffs.includes('AURA_PURPLE') && <AuraEffect color="border-purple-500 bg-purple-500/20" />}

                  <HorseSprite 
                    color={horse.color} 
                    isMoving={horse.position < raceConfig.distance} 
                    scale={1.3}
                    animationSpeed={horse.currentSpeed * 2.5} 
                  />
                  
                  {/* Status Icons */}
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 flex gap-1">
                     {isBuffed && <span className="text-cyan-300 font-black text-lg animate-bounce">⚡</span>}
                     {isDebuffed && <span className="text-red-500 font-black text-lg animate-pulse">🔻</span>}
                  </div>

                   {/* Stamina Bar */}
                  <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-16 h-2 bg-gray-800 border border-white/30 rounded-full overflow-hidden">
                     <div className={`h-full ${staminaColor} transition-all duration-100`} style={{ width: `${staminaPct}%` }} />
                  </div>
                  {isRecovering && (
                      <div className="absolute -top-16 left-1/2 -translate-x-1/2 text-[9px] bg-blue-900/80 text-white px-1 rounded animate-pulse whitespace-nowrap">
                          RECOVERY
                      </div>
                  )}

                  {/* Name Tag */}
                  <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center">
                      <span className="text-[9px] bg-black/80 text-white px-1 font-mono tracking-tighter whitespace-nowrap border border-white/30">
                        {horse.number}.{horse.name}
                      </span>
                  </div>

                  {/* User Indicator & Speech Bubble */}
                  {(betting.horseId === horse.id || betting.secondHorseId === horse.id) && (
                    <div className="absolute -top-20 left-1/2 -translate-x-1/2 flex flex-col items-center">
                      {/* Speech Bubble */}
                      {horse.position < raceConfig.distance && !isRecovering && (
                         <div className="mb-1 bg-white border-2 border-black rounded-xl px-2 py-1 relative shadow-md">
                            <span className="text-black font-black text-xs whitespace-nowrap">가즈아!</span>
                            <div className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-black"></div>
                            <div className="absolute bottom-[-3px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[4px] border-t-white"></div>
                         </div>
                      )}
                      
                      <div className="animate-bounce flex flex-col items-center">
                        <span className="bg-red-600 text-white font-bold text-[10px] px-1 shadow-sm">MY BET</span>
                        <span className="text-red-600 text-lg">▼</span>
                      </div>
                    </div>
                  )}

                  {isRecovering && horse.position < raceConfig.distance && (
                     <div className="absolute top-0 -right-4 text-blue-300 animate-ping text-lg">💦</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer Progress Bar (Fixed) */}
      <div className="h-16 bg-[#222] border-t border-[#444] flex items-center justify-between px-6 z-40 shadow-[0_-5px_10px_rgba(0,0,0,0.5)]">
         <div className="flex gap-2">
            <Button size="sm" variant={cameraMode === 'LEADER' ? 'primary' : 'secondary'} onClick={() => setCameraMode('LEADER')}>선두 카메라</Button>
            <Button size="sm" variant={cameraMode === 'BET' ? 'primary' : 'secondary'} onClick={() => setCameraMode('BET')} disabled={!betting.horseId}>내 말 카메라</Button>
            <Button size="sm" variant={cameraMode === 'FREE' ? 'primary' : 'secondary'} onClick={() => setCameraMode('FREE')}>자유 시점</Button>
         </div>

         <div className="flex-1 mx-8 flex flex-col justify-center relative">
             <div className="flex justify-between text-xs text-gray-400 mb-1 font-mono">
                 <span>START</span>
                 <span className="text-yellow-500 font-bold">
                    {Math.floor(leaderPosition)}m
                 </span>
                 <span>{raceConfig.distance}m</span>
             </div>
             
             {/* Progress Track */}
            <div className="h-2 bg-[#111] border border-[#333] relative mt-2">
               {/* Leader Progress */}
               <div 
                 className="absolute top-0 left-0 h-full bg-blue-700" 
                 style={{ width: `${Math.min(100, (leaderPosition / raceConfig.distance) * 100)}%` }}
               />
               
               {/* Horse Icons on Progress Bar */}
               {raceState.horses.map(h => (
                   <div 
                        key={h.id}
                        className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-white shadow-md z-10"
                        style={{ 
                            left: `${Math.min(100, (h.position / raceConfig.distance) * 100)}%`,
                            backgroundColor: h.color,
                            zIndex: (betting.horseId === h.id) ? 20 : 10
                        }}
                   >
                       {(betting.horseId === h.id || betting.secondHorseId === h.id) && (
                           <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-[10px] text-red-500 font-bold">▼</div>
                       )}
                   </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
};
