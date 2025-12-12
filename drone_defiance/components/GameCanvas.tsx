
import React, { useRef, useEffect, useState } from 'react';
import { GameState, Player, Enemy, Projectile, Particle, FloatingText, Vector2 } from '../types';
import { COLORS, CANVAS_WIDTH, CANVAS_HEIGHT, ENEMY_STATS, WEAPONS, JOBS } from '../constants';
import { RenderService } from '../services/RenderService';

interface Props {
  gameState: GameState;
  onGameOver: (score: number, time: number) => void;
  playerRef: React.MutableRefObject<Player>; 
  scoreRef: React.MutableRefObject<number>;
  waveRef: React.MutableRefObject<number>;
  difficulty: { hpMult: number; dmgMult: number; name: string };
  onBossDefeat: () => void;
  onOpenSkills: () => void;
}

const GameCanvas: React.FC<Props> = ({ gameState, onGameOver, playerRef, scoreRef, waveRef, difficulty, onBossDefeat, onOpenSkills }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>(0);
  
  // Game Entities Ref (To avoid re-renders)
  const enemiesRef = useRef<Enemy[]>([]);
  const projectilesRef = useRef<Projectile[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const textsRef = useRef<FloatingText[]>([]);
  const cameraRef = useRef<Vector2>({ x: 0, y: 0 });
  const inputRef = useRef({
    keys: {} as Record<string, boolean>,
    mouse: { x: 0, y: 0, left: false, right: false }
  });
  const shakeRef = useRef(0);
  const atkTimerRef = useRef(0);
  const gameTimeRef = useRef(0); // in frames
  const bossWarningTimerRef = useRef(0); // Timer for boss warning overlay
  const isGameOverTriggered = useRef(false);

  // Initialize Inputs
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => { 
        if (gameState === 'PLAYING' && e.key.toLowerCase() === 'e') {
            onOpenSkills();
            return;
        }
        inputRef.current.keys[e.key.toLowerCase()] = true; 
        inputRef.current.keys[e.code] = true; 
    };
    const handleKeyUp = (e: KeyboardEvent) => { inputRef.current.keys[e.key.toLowerCase()] = false; inputRef.current.keys[e.code] = false; };
    const handleMouseMove = (e: MouseEvent) => {
        inputRef.current.mouse.x = e.clientX;
        inputRef.current.mouse.y = e.clientY;
    };
    const handleMouseDown = (e: MouseEvent) => { 
        if(e.button === 0) inputRef.current.mouse.left = true; 
        if(e.button === 2) inputRef.current.mouse.right = true;
    };
    const handleMouseUp = (e: MouseEvent) => { 
        if(e.button === 0) inputRef.current.mouse.left = false; 
        if(e.button === 2) inputRef.current.mouse.right = false;
    };
    const handleContext = (e: MouseEvent) => e.preventDefault();

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('contextmenu', handleContext);

    if (gameState === 'PLAYING') {
        isGameOverTriggered.current = false;
        if (gameTimeRef.current === 0) {
            enemiesRef.current = [];
            projectilesRef.current = [];
            particlesRef.current = [];
            textsRef.current = [];
            bossWarningTimerRef.current = 0;
        }
    }

    return () => {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mousedown', handleMouseDown);
        window.removeEventListener('mouseup', handleMouseUp);
        window.removeEventListener('contextmenu', handleContext);
    };
  }, [gameState, onOpenSkills]);

  const spawnText = (x: number, y: number, text: string, color: string) => {
      textsRef.current.push({
          id: Math.random().toString(),
          pos: {x, y}, text, color, life: 40, velocity: {x:0, y:-1}
      });
  };

  const spawnEnemy = (player: Player) => {
    const angle = Math.random() * Math.PI * 2;
    const dist = 800;
    const x = player.pos.x + Math.cos(angle) * dist;
    const y = player.pos.y + Math.sin(angle) * dist;

    const minutes = gameTimeRef.current / 3600;
    let type: Enemy['type'] = 'scout';
    let hpScale = 1;
    let speed = 1.5 + Math.random();

    const rand = Math.random();
    if (minutes >= 12 && rand < 0.15) { type = 'sniper'; hpScale = 0.7; speed = 0.8; }
    else if (minutes >= 10 && rand < 0.25) { type = 'tank'; hpScale = 2.5; speed = 0.4; }
    else if (minutes >= 7 && rand < 0.35) { type = 'splitter'; hpScale = 1.1; speed = 1.2; }
    else if (minutes >= 5 && rand < 0.55) { type = 'dasher'; hpScale = 1.2; speed = 2; }
    else if (minutes >= 3 && rand < 0.70) { type = 'shooter'; hpScale = 0.8; speed = 1; }

    const stats = ENEMY_STATS[type];
    const baseHp = (20 + player.level * 10) * hpScale;
    const finalHp = baseHp * difficulty.hpMult;

    const newEnemy: Enemy = {
        id: Math.random().toString(),
        type,
        pos: { x, y },
        velocity: { x: 0, y: 0 },
        hp: finalHp,
        maxHp: finalHp,
        speed,
        angle: 0,
        iframe: 0,
        cd: 60 + Math.random() * 60,
        radius: stats.radius
    };
    enemiesRef.current.push(newEnemy);

    if (type.includes('boss')) {
        bossWarningTimerRef.current = 180;
    }
  };

  const fireWeapon = (player: Player) => {
      const wpn = WEAPONS[player.weapon] || WEAPONS.basic;
      
      let finalRate = wpn.rate + player.stats.fireRate; 
      
      if (player.activeEffects['rage']) finalRate *= 0.5;
      if (player.activeEffects['suppress']) finalRate *= 0.8; 
      if (player.activeEffects['inferno']) finalRate = 3; // Max speed
      
      if (finalRate < 2) finalRate = 2; 

      if (atkTimerRef.current > 0) return;

      let baseDmg = player.stats.dmg * player.stats.dmgMult * wpn.dmg;
      if (player.activeEffects['headshot']) baseDmg *= 5;
      if (player.activeEffects['mark']) baseDmg *= 1.5;
      if (player.activeEffects['siege']) baseDmg *= 2;

      const baseRange = wpn.range * player.stats.range;
      let critChance = player.stats.crit + (wpn.critBonus || 0);
      if (player.activeEffects['mark']) critChance = 100;

      for(let i=0; i<wpn.bullets; i++) {
          const spreadAngle = player.angle + (Math.random() - 0.5) * wpn.spread;
          const velocity = { x: Math.cos(spreadAngle) * wpn.speed, y: Math.sin(spreadAngle) * wpn.speed };
          
          if (wpn.homing) {
             projectilesRef.current.push({
                 id: Math.random().toString(), pos: {...player.pos}, velocity, dmg: baseDmg, life: 100, color: '#f80', isEnemy: false, radius: 4, type: 'missile', homing: true, range: baseRange, angle: spreadAngle, crit: Math.random() * 100 < critChance
             });
          } else if (wpn.aoe) {
             projectilesRef.current.push({
                id: Math.random().toString(), pos: {...player.pos}, velocity, dmg: baseDmg, life: 60, color: '#f40', isEnemy: false, radius: 6, type: 'aoe', range: wpn.aoe, crit: Math.random() * 100 < critChance
             });
          } else if (wpn.pierce) {
             projectilesRef.current.push({
                id: Math.random().toString(), pos: {...player.pos}, velocity, dmg: baseDmg, life: 30, color: '#0ff', isEnemy: false, radius: 3, type: 'shot', pierce: true, crit: Math.random() * 100 < critChance
             });
             particlesRef.current.push({
                 id: Math.random().toString(), pos: {...player.pos}, velocity: {x:0, y:0}, life: 10, maxLife: 10, color: '#0ff', size: 2, type: 'beam', angle: spreadAngle, range: baseRange
             });
          } else {
             projectilesRef.current.push({
                id: Math.random().toString(), pos: {...player.pos}, velocity, dmg: baseDmg, life: 40, color: '#67e8f9', isEnemy: false, radius: 3, type: 'shot', crit: Math.random() * 100 < critChance
             });
          }
      }
      
      if (player.activeEffects['headshot']) delete player.activeEffects['headshot'];
      atkTimerRef.current = finalRate;
  };

  const useSkill = (key: string, player: Player) => {
      let skillId = null;
      let skillData = null;

      // Base Railgun Check
      if (key === 'RMB' && player.skillTree['base_rail']) {
          skillId = 'base_rail';
          skillData = { id: 'railgun_active', name: 'ION CANNON', cd: 180, duration: 0, type: 'attack' }; 
      } else {
          let currentJobId = player.jobId;
          while (currentJobId) {
              const job = JOBS[currentJobId];
              if (job.skill && job.skill.key === key) {
                  skillId = job.skill.id;
                  skillData = job.skill;
                  break;
              }
              currentJobId = job.parent;
          }
      }

      if (!skillId || !skillData) return; 

      if ((player.activeSkills[key] || 0) > 0) return;

      let cdMult = 1 - player.stats.cdr;
      // Apply Mastery Reductions
      if (skillId === 'tac_strike' && player.skillTree['tac_skill']) cdMult -= 0.1;
      if (skillId === 'dash_shoot' && player.skillTree['gun_skill']) cdMult -= 0.1;
      if (skillId === 'dominate' && player.skillTree['ult_cd']) cdMult -= 0.1; // Example limit break

      const cd = Math.max(30, skillData.cd * cdMult);
      player.activeSkills[key] = cd;

      spawnText(player.pos.x, player.pos.y - 50, skillData.name || "SKILL", "#ffff00");

      switch(skillId) {
          case 'base_rail':
              projectilesRef.current.push({ id: Math.random().toString(), pos: {...player.pos}, velocity: { x: Math.cos(player.angle)*30, y: Math.sin(player.angle)*30 }, dmg: player.stats.dmg * 5, life: 30, color: '#22d3ee', isEnemy: false, radius: 10, type: 'beam', pierce: true, range: 1000 });
              break;

          // Tier 1
          case 'tac_strike': // 3 Burst
             for(let i=0; i<3; i++) {
                 setTimeout(() => {
                    const angle = player.angle;
                    projectilesRef.current.push({ id: Math.random().toString(), pos: {...player.pos}, velocity: { x: Math.cos(angle)*25, y: Math.sin(angle)*25 }, dmg: player.stats.dmg * 3, life: 40, color: '#a78bfa', isEnemy: false, radius: 5, type: 'shot', pierce: true });
                 }, i*100);
             }
             break;
          case 'rage':
             player.activeEffects['rage'] = skillData.duration || 150;
             break;
          case 'shield_dome':
             player.activeEffects['shield_dome'] = skillData.duration || 180;
             break;

          // Tier 2 (Mobility)
          case 'dash_shoot':
          case 'warp':
          case 'evade':
              const dist = 150;
              const angle = player.angle + (skillId === 'evade' ? Math.PI : 0);
              player.pos.x += Math.cos(angle) * dist;
              player.pos.y += Math.sin(angle) * dist;
              particlesRef.current.push({ id: Math.random().toString(), pos: {...player.pos}, velocity: {x:0,y:0}, life:20, maxLife:20, color:'#fff', size:20, type:'nova' });
              if (skillId === 'dash_shoot') fireWeapon(player);
              break;

          // Tier 3
          case 'buckshot': // Assault
              for(let i=0; i<12; i++) {
                  const a = player.angle + (Math.random()-0.5)*1.5;
                  projectilesRef.current.push({ id: Math.random().toString(), pos: {...player.pos}, velocity: {x:Math.cos(a)*15, y:Math.sin(a)*15}, dmg: player.stats.dmg, life: 30, color:'#f00', isEnemy:false, radius:4, type:'shot' });
              }
              break;
          case 'suppress': // Suppressor
              player.activeEffects['suppress'] = skillData.duration || 300;
              enemiesRef.current.forEach(e => e.speed *= 0.5); // Global Slow effect
              break;
          case 'siege': // Juggernaut
              player.activeEffects['siege'] = skillData.duration || 300;
              player.stats.spd = 0; // Immobility handled in update or here? Better not mutate permanent stat. Handled in effect check.
              break;
          case 'swarm': // Striker
              for(let i=0; i<20; i++) {
                  const a = Math.random() * Math.PI * 2;
                  projectilesRef.current.push({ id: Math.random().toString(), pos: {...player.pos}, velocity: {x:Math.cos(a)*8, y:Math.sin(a)*8}, dmg: player.stats.dmg, life: 100, color:'#22d3ee', isEnemy:false, radius:3, type:'missile', homing:true, range:600 });
              }
              break;
          case 'nuke': // Artillery
               projectilesRef.current.push({ id: Math.random().toString(), pos: {x: player.pos.x + Math.cos(player.angle)*300, y: player.pos.y + Math.sin(player.angle)*300}, velocity: {x:0,y:0}, dmg: player.stats.dmg * 20, life: 10, color: '#ef4444', isEnemy: false, radius: 250, type: 'aoe', range: 250 });
               shakeRef.current = 30;
               break;
          case 'deploy': // Commander
               for(let i=0; i<3; i++) {
                   const a = (i/3)*Math.PI*2;
                   enemiesRef.current.push({ id: Math.random().toString(), type: 'turret', pos: {x: player.pos.x + Math.cos(a)*40, y: player.pos.y + Math.sin(a)*40}, velocity: {x:0,y:0}, hp: 200, maxHp: 200, speed: 0, angle: 0, iframe: 0, cd: 20, radius: 10, owner: 'player' });
               }
               break;
          case 'headshot': // Sniper
               player.activeEffects['headshot'] = 1000; // Until shot
               break;
          case 'mark': // Hunter
               player.activeEffects['mark'] = skillData.duration || 300;
               break;
          case 'harvest': // Reaper
               player.activeEffects['harvest'] = skillData.duration || 300;
               break;

          // Tier 4 (Ultimate)
          case 'inferno': 
              player.activeEffects['inferno'] = skillData.duration || 400;
              break;
          case 'dominate':
              enemiesRef.current.forEach(e => e.hp -= player.stats.dmg * 10);
              shakeRef.current = 50;
              break;
          case 'quake':
              projectilesRef.current.push({ id: Math.random().toString(), pos: {...player.pos}, velocity:{x:0,y:0}, dmg: player.stats.dmg * 15, life: 30, color: '#fbbf24', isEnemy: false, radius: 500, type: 'aoe', range: 500 });
              break;
          case 'rain':
               for(let i=0; i<50; i++) {
                   setTimeout(() => {
                       const rx = player.pos.x + (Math.random()-0.5)*800;
                       const ry = player.pos.y + (Math.random()-0.5)*800;
                       projectilesRef.current.push({ id: Math.random().toString(), pos: {x:rx, y:ry}, velocity:{x:0,y:0}, dmg: 50, life:10, color:'#22d3ee', isEnemy:false, radius:60, type:'aoe', range:60 });
                   }, i * 20);
               }
               break;
          case 'doomsday':
               enemiesRef.current.forEach(e => { if(e.type !== 'boss') e.hp = 0; else e.hp -= 5000; });
               shakeRef.current = 100;
               particlesRef.current.push({ id: Math.random().toString(), pos: {...player.pos}, velocity:{x:0,y:0}, life:100, maxLife:100, color:'#fff', size:2000, type:'nova' });
               break;
          case 'legion':
               for(let i=0; i<10; i++) {
                   const a = (i/10)*Math.PI*2;
                   enemiesRef.current.push({ id: Math.random().toString(), type: 'turret', pos: {x: player.pos.x + Math.cos(a)*60, y: player.pos.y + Math.sin(a)*60}, velocity: {x:0,y:0}, hp: 300, maxHp: 300, speed: 0, angle: 0, iframe: 0, cd: 10, radius: 10, owner: 'player' });
               }
               break;
          case 'calc':
               player.activeEffects['calc'] = skillData.duration || 600; // Auto-crit / Dmg logic needs to be applied in fireWeapon
               break;
          case 'guillotine':
               enemiesRef.current.forEach(e => { if(e.hp < e.maxHp * 0.5) e.hp = 0; });
               break;
          case 'void':
               particlesRef.current.push({ id: Math.random().toString(), pos: {...player.pos}, velocity:{x:0,y:0}, life:100, maxLife:100, color:'#000', size:300, type:'nova' });
               enemiesRef.current.forEach(e => {
                   if (Math.hypot(e.pos.x - player.pos.x, e.pos.y - player.pos.y) < 300) {
                       e.hp -= 1000;
                       e.pos.x = player.pos.x; e.pos.y = player.pos.y;
                   }
               });
               break;
      }
  };

  // Main Loop
  const update = (dt: number, renderer: RenderService) => {
    const player = playerRef.current;
    
    if (player.stats.hp <= 0 && !isGameOverTriggered.current) {
        if (player.relics['revive_unique'] > 0 || player.relics['revive_epic'] > 0) {
            player.stats.hp = player.stats.maxHp * 0.5;
            player.relics['revive_unique'] = Math.max(0, (player.relics['revive_unique']||0) - 1);
            spawnText(player.pos.x, player.pos.y, "REVIVED!", "#ffff00");
            particlesRef.current.push({id:Math.random().toString(), pos:{...player.pos}, velocity:{x:0,y:0}, life:60, maxLife:60, color:'#fff', size:200, type:'nova'});
            enemiesRef.current.forEach(e => {
                const d = Math.hypot(e.pos.x - player.pos.x, e.pos.y - player.pos.y);
                if (d < 300) e.pos.x += (e.pos.x - player.pos.x); 
            });
            return; 
        }

        isGameOverTriggered.current = true;
        onGameOver(scoreRef.current, gameTimeRef.current);
        return;
    }

    if (isGameOverTriggered.current) return;

    gameTimeRef.current++;
    if (bossWarningTimerRef.current > 0) bossWarningTimerRef.current--;

    Object.keys(player.activeSkills).forEach(k => { if (player.activeSkills[k] > 0) player.activeSkills[k]--; });
    Object.keys(player.activeEffects).forEach(k => { if (player.activeEffects[k] > 0) player.activeEffects[k]--; else delete player.activeEffects[k]; });
    if (player.iframe > 0) player.iframe--;
    if (player.hitFlash > 0) player.hitFlash--;

    // Movement
    let dx = 0; let dy = 0;
    // Siege Mode prevents movement
    if (!player.activeEffects['siege']) {
        if (inputRef.current.keys['w']) dy -= 1;
        if (inputRef.current.keys['s']) dy += 1;
        if (inputRef.current.keys['a']) dx -= 1;
        if (inputRef.current.keys['d']) dx += 1;
    }

    if (dx !== 0 || dy !== 0) {
        const len = Math.sqrt(dx*dx + dy*dy);
        player.pos.x += (dx / len) * player.stats.spd;
        player.pos.y += (dy / len) * player.stats.spd;
    }

    const screenPlayerX = player.pos.x - cameraRef.current.x;
    const screenPlayerY = player.pos.y - cameraRef.current.y;
    player.angle = Math.atan2(inputRef.current.mouse.y - screenPlayerY, inputRef.current.mouse.x - screenPlayerX);

    const camTargetX = player.pos.x - CANVAS_WIDTH / 2;
    const camTargetY = player.pos.y - CANVAS_HEIGHT / 2;
    cameraRef.current.x += (camTargetX - cameraRef.current.x) * 0.1;
    cameraRef.current.y += (camTargetY - cameraRef.current.y) * 0.1;
    
    if (shakeRef.current > 0) {
        cameraRef.current.x += (Math.random() - 0.5) * shakeRef.current;
        cameraRef.current.y += (Math.random() - 0.5) * shakeRef.current;
        shakeRef.current *= 0.9;
        if (shakeRef.current < 0.5) shakeRef.current = 0;
    }

    if (inputRef.current.mouse.left) fireWeapon(player);
    if (atkTimerRef.current > 0) atkTimerRef.current--;

    if (inputRef.current.mouse.right) useSkill('RMB', player);
    if (inputRef.current.keys['q']) useSkill('Q', player);
    if (inputRef.current.keys[' '] || inputRef.current.keys['Space']) useSkill('SPACE', player); 
    if (inputRef.current.keys['r']) useSkill('R', player);
    if (inputRef.current.keys['f']) useSkill('F', player);


    if (enemiesRef.current.length < 20 + player.level * 0.5) {
        spawnEnemy(player);
    }

    projectilesRef.current = projectilesRef.current.filter(p => {
        if (p.homing && !p.isEnemy) {
            let closest = null, minDist = 99999;
            enemiesRef.current.filter(e => e.owner !== 'player').forEach(e => {
                const d = Math.hypot(e.pos.x - p.pos.x, e.pos.y - p.pos.y);
                if (d < minDist && d < 600) { minDist = d; closest = e; }
            });
            if (closest) {
                // @ts-ignore
                const targetAngle = Math.atan2(closest.pos.y - p.pos.y, closest.pos.x - p.pos.x);
                // @ts-ignore
                let curAngle = Math.atan2(p.velocity.y, p.velocity.x);
                const diff = targetAngle - curAngle;
                let d = diff;
                while (d > Math.PI) d -= 2*Math.PI;
                while (d < -Math.PI) d += 2*Math.PI;
                curAngle += d * 0.1;
                const speed = Math.hypot(p.velocity.x, p.velocity.y);
                p.velocity.x = Math.cos(curAngle) * speed;
                p.velocity.y = Math.sin(curAngle) * speed;
            }
        }

        p.pos.x += p.velocity.x;
        p.pos.y += p.velocity.y;
        p.life--;

        if (!p.isEnemy) {
            if (p.type === 'aoe' && p.life <= 0) {
                 particlesRef.current.push({ id: Math.random().toString(), pos: {...p.pos}, velocity:{x:0, y:0}, life:10, maxLife:10, type:'nova', color:'#f40', size: p.range || 50 });
                 enemiesRef.current.filter(e => e.owner !== 'player').forEach(e => {
                     if (Math.hypot(e.pos.x - p.pos.x, e.pos.y - p.pos.y) < (p.range || 50)) {
                         e.hp -= p.dmg;
                         spawnText(e.pos.x, e.pos.y, Math.floor(p.dmg).toString(), '#fff');
                     }
                 });
                 return false;
            }

            for (const e of enemiesRef.current) {
                if (e.owner === 'player') continue; 
                if (Math.hypot(e.pos.x - p.pos.x, e.pos.y - p.pos.y) < e.radius + p.radius) {
                    if (p.type !== 'aoe') {
                        let d = p.dmg * (p.crit ? 2 : 1);
                        if (player.activeEffects['calc']) d *= 1.5; // Mastermind Calc bonus
                        if (player.activeEffects['harvest']) d += 5; // Reaper bonus
                        
                        e.hp -= d;
                        spawnText(e.pos.x, e.pos.y - 20, Math.floor(d).toString(), p.crit ? '#ff0' : '#fff');
                        
                        if (player.relics['lifesteal_common']) { if (Math.random() < 0.1) player.stats.hp = Math.min(player.stats.maxHp, player.stats.hp + 1); }

                        if (!p.pierce) {
                            p.life = 0;
                            particlesRef.current.push({ id: Math.random().toString(), pos: {...p.pos}, velocity:{x:0,y:0}, life:5, maxLife:5, type:'spark', color:'#fff', size:2 });
                            return false; 
                        }
                    }
                }
            }
        } else {
            // Enemy Projectile Collision
            if (player.activeEffects['shield_dome']) return false;
            if (player.iframe > 0) return true;

            if (Math.hypot(player.pos.x - p.pos.x, player.pos.y - p.pos.y) < 15) {
                if (Math.random() < (player.stats.spd * 0.01)) { spawnText(player.pos.x, player.pos.y, "DODGE", "#fff"); return false; }

                let dmgTaken = p.dmg * difficulty.dmgMult;
                if (player.activeEffects['siege']) dmgTaken *= 0.8; // Reduced dmg in Siege

                player.stats.hp -= dmgTaken;
                player.iframe = 30; 
                player.hitFlash = 15;
                shakeRef.current = 20;
                spawnText(player.pos.x, player.pos.y, `-${Math.floor(dmgTaken)}`, '#ff0000');
                
                p.life = 0;
                return false;
            }
        }
        return p.life > 0;
    });

    enemiesRef.current = enemiesRef.current.filter(e => {
        if (e.owner === 'player') {
            let target = enemiesRef.current.find(t => t.owner !== 'player' && Math.hypot(t.pos.x - e.pos.x, t.pos.y - e.pos.y) < 400);
            if (target && e.cd <= 0) {
                 const ang = Math.atan2(target.pos.y - e.pos.y, target.pos.x - e.pos.x);
                 projectilesRef.current.push({ id: Math.random().toString(), pos: {...e.pos}, velocity: {x: Math.cos(ang)*15, y: Math.sin(ang)*15}, dmg: player.stats.dmg, life: 30, color: '#0ff', isEnemy: false, radius: 3, type: 'shot' });
                 e.cd = 20;
            }
            if (e.cd > 0) e.cd--;
            return e.hp > 0;
        }

        const dx = player.pos.x - e.pos.x;
        const dy = player.pos.y - e.pos.y;
        const dist = Math.hypot(dx, dy);
        const angle = Math.atan2(dy, dx);

        if (player.activeEffects['time_stop']) return true;

        if (e.type === 'shooter') {
            if (dist > 300) { e.pos.x += Math.cos(angle)*e.speed; e.pos.y += Math.sin(angle)*e.speed; }
            else if (dist < 200) { e.pos.x -= Math.cos(angle)*e.speed; e.pos.y -= Math.sin(angle)*e.speed; }
            e.cd--;
            if (e.cd <= 0) { projectilesRef.current.push({ id: Math.random().toString(), pos: {...e.pos}, velocity: {x: Math.cos(angle)*5, y: Math.sin(angle)*5}, dmg: (5 + player.level), life: 100, color: '#f87171', isEnemy: true, radius: 4, type:'shot' }); e.cd = 120; }
        } else if (e.type === 'sniper') {
             if (dist > 500) { e.pos.x += Math.cos(angle)*e.speed; e.pos.y += Math.sin(angle)*e.speed; }
             e.cd--;
             if (e.cd <= 0) { projectilesRef.current.push({ id: Math.random().toString(), pos: {...e.pos}, velocity: {x: Math.cos(angle)*8, y: Math.sin(angle)*8}, dmg: (15 + player.level*2), life: 150, color: '#f80', isEnemy: true, radius: 5, type:'shot' }); e.cd = 180; }
        } else {
            e.pos.x += Math.cos(angle)*e.speed; e.pos.y += Math.sin(angle)*e.speed;
        }

        if (dist < e.radius + 15) {
             if (!player.activeEffects['shield_dome'] && player.iframe <= 0) {
                const damage = 10 * difficulty.dmgMult;
                player.stats.hp -= damage;
                player.hitFlash = 15;
                player.iframe = 30;
                shakeRef.current = 15;
                spawnText(player.pos.x, player.pos.y, `-${Math.floor(damage)}`, '#ff0000');
             }
        }

        if (e.hp <= 0) {
            scoreRef.current += ENEMY_STATS[e.type].score * difficulty.hpMult; 
            player.xp += 10; 
            if (e.type === 'boss' || e.type === 'finalboss') { if (difficulty.name !== 'NORMAL') { onBossDefeat(); spawnText(e.pos.x, e.pos.y - 40, "CORE FRAGMENT ACQUIRED!", "#d946ef"); } }
            if (player.xp >= player.nextXp) { player.xp = 0; player.level++; player.nextXp *= 1.1; player.sp++; player.stats.hp = player.stats.maxHp; spawnText(player.pos.x, player.pos.y, "LEVEL UP!", "#0ff"); }
            if (e.type === 'splitter' && !e.isMini) { for(let i=0; i<3; i++) { const ang = i * (Math.PI*2/3); enemiesRef.current.push({ id: Math.random().toString(), type:'splitter', isMini:true, pos: {x: e.pos.x + Math.cos(ang)*30, y: e.pos.y + Math.sin(ang)*30}, velocity: {x:0, y:0}, hp: e.maxHp*0.3, maxHp: e.maxHp*0.3, speed: e.speed*1.5, angle:0, iframe:10, cd:0, radius: 10 }); } }
            return false;
        }
        return true;
    });

    particlesRef.current = particlesRef.current.filter(p => { p.life--; return p.life > 0; });
    textsRef.current = textsRef.current.filter(t => { t.life--; t.pos.y += t.velocity.y; return t.life > 0; });

    renderer.clear(CANVAS_WIDTH, CANVAS_HEIGHT);
    renderer.drawGrid(cameraRef.current, CANVAS_WIDTH, CANVAS_HEIGHT);
    renderer.drawParticles(particlesRef.current, cameraRef.current);
    projectilesRef.current.forEach(p => renderer.drawProjectile(p, p.pos.x - cameraRef.current.x, p.pos.y - cameraRef.current.y));
    enemiesRef.current.forEach(e => renderer.drawEnemy(e, e.pos.x - cameraRef.current.x, e.pos.y - cameraRef.current.y));
    renderer.drawPlayer(player, player.pos.x - cameraRef.current.x, player.pos.y - cameraRef.current.y);
    renderer.drawFloatingTexts(textsRef.current, cameraRef.current);
    if (bossWarningTimerRef.current > 0) renderer.drawBossWarning(CANVAS_WIDTH, CANVAS_HEIGHT);
    renderer.drawDamageOverlay(player.hitFlash, CANVAS_WIDTH, CANVAS_HEIGHT);
  };

  useEffect(() => {
    if (!canvasRef.current || gameState !== 'PLAYING') return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    const renderer = new RenderService(ctx);
    const loop = () => { update(16, renderer); requestRef.current = requestAnimationFrame(loop); };
    requestRef.current = requestAnimationFrame(loop);
    return () => { if (requestRef.current) cancelAnimationFrame(requestRef.current); };
  }, [gameState, onOpenSkills]);

  return (
    <canvas ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} className="block bg-slate-950 cursor-crosshair" />
  );
};

export default GameCanvas;
