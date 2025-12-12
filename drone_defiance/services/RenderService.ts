
import { Enemy, Particle, Player, Projectile, Vector2 } from '../types';
import { COLORS } from '../constants';

export class RenderService {
  private ctx: CanvasRenderingContext2D;

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
  }

  clear(width: number, height: number) {
    this.ctx.fillStyle = '#050b14'; 
    this.ctx.fillRect(0, 0, width, height);
  }

  drawGrid(camera: Vector2, width: number, height: number) {
    this.ctx.strokeStyle = '#1a2530';
    this.ctx.lineWidth = 1;
    this.ctx.beginPath();
    
    const gridSize = 100;
    const offsetX = -camera.x % gridSize;
    const offsetY = -camera.y % gridSize;

    for (let x = offsetX; x < width; x += gridSize) {
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, height);
    }
    for (let y = offsetY; y < height; y += gridSize) {
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(width, y);
    }
    this.ctx.stroke();
  }

  drawBossWarning(width: number, height: number) {
      const time = Date.now();
      if (Math.floor(time / 500) % 2 === 0) return; // Blink text

      this.ctx.save();
      this.ctx.fillStyle = 'rgba(239, 68, 68, 0.2)';
      this.ctx.fillRect(0, height/2 - 60, width, 120);
      
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      
      this.ctx.font = '900 60px "Orbitron", sans-serif';
      this.ctx.fillStyle = '#ef4444';
      this.ctx.shadowColor = '#000';
      this.ctx.shadowBlur = 10;
      this.ctx.fillText("WARNING", width/2, height/2 - 20);

      this.ctx.font = '700 30px "Rajdhani", sans-serif';
      this.ctx.fillStyle = '#fff';
      this.ctx.fillText("MASSIVE SIGNAL DETECTED", width/2, height/2 + 30);
      
      this.ctx.restore();
  }

  // --- PLAYER RENDERING ---
  drawPlayer(player: Player, screenX: number, screenY: number) {
    this.ctx.save();
    this.ctx.translate(screenX, screenY);
    this.ctx.rotate(player.angle);

    if (player.iframe > 0) {
        this.ctx.globalAlpha = Math.floor(Date.now() / 50) % 2 === 0 ? 0.5 : 1.0;
    }

    const isHit = player.hitFlash > 0;
    const job = player.jobId || 'basic';
    
    if (job === 'basic') {
        this.drawDroneBasic(isHit);
    } else if (['tactician', 'berserker', 'guardian'].includes(job)) {
        this.drawDroneTier1(job, isHit);
    } else {
        this.drawDroneAdvanced(job, isHit);
    }

    // Shield Visual
    if ((player.activeEffects && player.activeEffects['shield']) || (player.activeEffects && player.activeEffects['shield_dome'])) {
        this.drawShield(player.shieldHitFlash);
    }

    this.ctx.restore();
  }

  drawDamageOverlay(hitFlash: number, width: number, height: number) {
      if (hitFlash <= 0) return;
      const opacity = Math.min(0.6, hitFlash / 15);
      this.ctx.save();
      const gradient = this.ctx.createRadialGradient(width/2, height/2, height/4, width/2, height/2, height);
      gradient.addColorStop(0, `rgba(255, 0, 0, 0)`);
      gradient.addColorStop(1, `rgba(220, 20, 20, ${opacity})`);
      this.ctx.fillStyle = gradient;
      this.ctx.fillRect(0, 0, width, height);
      if (hitFlash > 8) {
          this.ctx.fillStyle = `rgba(255, 0, 0, ${opacity * 0.3})`;
          this.ctx.fillRect(0, 0, width, height);
      }
      this.ctx.restore();
  }

  // --- SPECIFIC DRONE DRAWING LOGIC ---

  private drawDroneBasic(isHit: boolean) {
      const frameColor = isHit ? '#ffffff' : '#334155';
      const coreColor = isHit ? '#ffffff' : '#0f172a';
      const glowColor = isHit ? '#ffffff' : '#22d3ee';
      this.ctx.strokeStyle = frameColor;
      this.ctx.lineWidth = 3;
      this.ctx.beginPath();
      this.ctx.moveTo(15, 15); this.ctx.lineTo(-15, -15);
      this.ctx.moveTo(15, -15); this.ctx.lineTo(-15, 15);
      this.ctx.stroke();
      this.ctx.fillStyle = coreColor;
      this.ctx.strokeStyle = glowColor;
      this.ctx.lineWidth = 2;
      this.ctx.beginPath();
      this.ctx.arc(0, 0, 8, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.stroke();
      this.drawRotors(22, 22, glowColor, 4, isHit);
  }

  private drawDroneTier1(job: string, isHit: boolean) {
      let baseColor = '#22d3ee';
      if (job === 'berserker') baseColor = '#f87171';
      if (job === 'guardian') baseColor = '#34d399';
      if (job === 'tactician') baseColor = '#a78bfa';

      const frameColor = isHit ? '#ffffff' : '#475569';
      const bodyColor = isHit ? '#ffffff' : '#1e293b';
      const accentColor = isHit ? '#ffffff' : baseColor;

      this.ctx.strokeStyle = frameColor;
      this.ctx.lineWidth = 4;
      this.ctx.beginPath();
      this.ctx.moveTo(18, 18); this.ctx.lineTo(-18, -18);
      this.ctx.moveTo(18, -18); this.ctx.lineTo(-18, 18);
      this.ctx.stroke();

      this.ctx.fillStyle = bodyColor;
      this.ctx.strokeStyle = accentColor;
      this.ctx.lineWidth = 2;
      this.ctx.beginPath();
      if (job === 'berserker') {
          // Sharp Triangle
          this.ctx.moveTo(20, 0); this.ctx.lineTo(-12, 14); this.ctx.lineTo(-12, -14);
      } else if (job === 'guardian') {
          // Square/Blocky
          this.ctx.rect(-14, -14, 28, 28);
      } else {
          // Hexagon
          for(let i=0; i<6; i++) { const a = i * Math.PI/3; this.ctx.lineTo(Math.cos(a)*14, Math.sin(a)*14); }
      }
      this.ctx.closePath();
      this.ctx.fill();
      this.ctx.stroke();

      this.ctx.fillStyle = accentColor;
      this.ctx.beginPath();
      this.ctx.arc(0, 0, 4, 0, Math.PI*2);
      this.ctx.fill();
      this.drawRotors(24, 24, accentColor, 4, isHit);
  }

  private drawDroneAdvanced(job: string, isHit: boolean) {
      // Dispatch based on specific job ID for unique visuals
      switch (job) {
          // --- GUNNER LINE ---
          case 'gunner': this.drawGunner(isHit, 2); break;
          // Shotgun Branch
          case 'assault': this.drawAssault(isHit, 3); break;
          case 'warmonger': this.drawAssault(isHit, 4); break;
          // Heavy Branch
          case 'suppressor': this.drawSuppressor(isHit, 3); break;
          case 'warlord': this.drawSuppressor(isHit, 4); break;
          // Tank Branch
          case 'juggernaut': this.drawJuggernaut(isHit, 3); break;
          case 'titan': this.drawJuggernaut(isHit, 4); break;

          // --- LANCER LINE ---
          case 'lancer': this.drawLancer(isHit, 2); break;
          // Swarm Branch
          case 'striker': this.drawStriker(isHit, 3); break;
          case 'devastator': this.drawStriker(isHit, 4); break;
          // Nuke Branch
          case 'artillery': this.drawArtillery(isHit, 3); break;
          case 'apocalypse': this.drawArtillery(isHit, 4); break;
          // Drone Branch
          case 'commander': this.drawCommander(isHit, 3); break;
          case 'overlord': this.drawCommander(isHit, 4); break;

          // --- MARKSMAN LINE ---
          case 'marksman': this.drawMarksman(isHit, 2); break;
          // Railgun Branch
          case 'job_sniper': this.drawSniper(isHit, 3); break; 
          case 'mastermind': this.drawSniper(isHit, 4); break;
          // Crit Branch
          case 'hunter': this.drawHunter(isHit, 3); break;
          case 'executioner': this.drawHunter(isHit, 4); break;
          // Pierce Branch
          case 'reaper': this.drawReaper(isHit, 3); break;
          case 'annihilator': this.drawReaper(isHit, 4); break;
          
          default: this.drawDroneBasic(isHit); break;
      }
  }

  // --- INDIVIDUAL JOB DRAWERS ---

  // 1. GUNNER (Minigun Base)
  private drawGunner(isHit: boolean, tier: number) {
      const color = isHit ? '#fff' : '#0ea5e9'; // Sky Blue
      this.drawGenericBody(color, isHit);
      // Minigun Barrel
      this.ctx.fillStyle = '#64748b';
      this.ctx.fillRect(10, -6, 20, 12);
      this.ctx.fillStyle = '#334155';
      this.ctx.fillRect(10, -3, 24, 6); // Inner barrel
      this.drawRotors(25, 25, color, 4, isHit);
  }
  
  // Assault (Shotgun: Wide, Multiple short barrels)
  private drawAssault(isHit: boolean, tier: number) {
      const color = isHit ? '#fff' : (tier === 4 ? '#ef4444' : '#f97316'); // Red/Orange
      const width = tier === 4 ? 20 : 15;
      
      // Wide Body
      this.ctx.fillStyle = isHit ? '#fff' : '#1e293b';
      this.ctx.strokeStyle = color;
      this.ctx.lineWidth = 2;
      this.ctx.beginPath();
      this.ctx.moveTo(10, width); this.ctx.lineTo(-10, width + 5);
      this.ctx.lineTo(-15, 0); 
      this.ctx.lineTo(-10, -width - 5); this.ctx.lineTo(10, -width);
      this.ctx.closePath();
      this.ctx.fill();
      this.ctx.stroke();

      // Triple Barrels
      this.ctx.fillStyle = '#475569';
      this.ctx.fillRect(8, -8, 12, 4);
      this.ctx.fillRect(10, -2, 12, 4);
      this.ctx.fillRect(8, 4, 12, 4);
      
      this.drawRotors(22, 25, color, 6, isHit);
  }

  // Suppressor (Heavy: Circular drum, bulky)
  private drawSuppressor(isHit: boolean, tier: number) {
      const color = isHit ? '#fff' : (tier === 4 ? '#7c3aed' : '#8b5cf6'); // Violet
      
      // Drum Body
      this.ctx.fillStyle = isHit ? '#fff' : '#1e293b';
      this.ctx.strokeStyle = color;
      this.ctx.lineWidth = 3;
      this.ctx.beginPath();
      this.ctx.arc(0, 0, 16, 0, Math.PI*2);
      this.ctx.fill();
      this.ctx.stroke();

      // Side Ammo Boxes
      this.ctx.fillStyle = '#334155';
      this.ctx.fillRect(-10, -22, 20, 6);
      this.ctx.fillRect(-10, 16, 20, 6);

      // Heavy Barrel
      this.ctx.fillStyle = '#475569';
      this.ctx.fillRect(14, -8, 14 + (tier*2), 16);
      // Glow vents
      this.ctx.fillStyle = color;
      this.ctx.fillRect(16, -4, 10, 2);
      this.ctx.fillRect(16, 2, 10, 2);

      this.drawRotors(25, 25, color, 4, isHit);
  }

  // Juggernaut (Tank: Square, Armor plates)
  private drawJuggernaut(isHit: boolean, tier: number) {
      const color = isHit ? '#fff' : (tier === 4 ? '#059669' : '#10b981'); // Emerald
      
      // Armor Plates (Shield shape)
      this.ctx.fillStyle = isHit ? '#fff' : '#1e293b';
      this.ctx.strokeStyle = color;
      this.ctx.lineWidth = 3;
      this.ctx.beginPath();
      this.ctx.moveTo(15, 15); 
      this.ctx.lineTo(-10, 20); 
      this.ctx.lineTo(-20, 0); 
      this.ctx.lineTo(-10, -20);
      this.ctx.lineTo(15, -15);
      this.ctx.closePath();
      this.ctx.fill();
      this.ctx.stroke();

      // Cannon
      this.ctx.fillStyle = '#334155';
      this.ctx.fillRect(10, -6, 22, 12);
      this.ctx.lineWidth = 1;
      this.ctx.strokeRect(10, -6, 22, 12);

      this.drawRotors(28, 28, color, 4, isHit);
  }


  // 2. LANCER (Missile Base)
  private drawLancer(isHit: boolean, tier: number) {
      const color = isHit ? '#fff' : '#f472b6'; // Pink
      this.drawGenericBody(color, isHit);
      // Missile Pods
      this.ctx.fillStyle = '#475569';
      this.ctx.fillRect(-5, -18, 8, 10);
      this.ctx.fillRect(-5, 8, 8, 10);
      this.drawRotors(25, 20, color, 4, isHit);
  }

  // Striker (Swarm: V-shape, many holes)
  private drawStriker(isHit: boolean, tier: number) {
      const color = isHit ? '#fff' : (tier === 4 ? '#db2777' : '#e879f9'); // Magenta
      
      // V-Wing Body
      this.ctx.fillStyle = isHit ? '#fff' : '#1e293b';
      this.ctx.strokeStyle = color;
      this.ctx.lineWidth = 2;
      this.ctx.beginPath();
      this.ctx.moveTo(10, 0);
      this.ctx.lineTo(-10, 25);
      this.ctx.lineTo(-5, 0);
      this.ctx.lineTo(-10, -25);
      this.ctx.closePath();
      this.ctx.fill();
      this.ctx.stroke();

      // Missile Dots
      this.ctx.fillStyle = '#fff';
      [ -15, -10, 10, 15].forEach(y => {
          this.ctx.beginPath(); this.ctx.arc(-8, y, 2, 0, Math.PI*2); this.ctx.fill();
      });

      this.drawRotors(15, 25, color, 4, isHit);
  }

  // Artillery (Nuke: Big tube on back)
  private drawArtillery(isHit: boolean, tier: number) {
      const color = isHit ? '#fff' : (tier === 4 ? '#f59e0b' : '#fbbf24'); // Amber
      
      // Big Launcher Tube on Top
      this.ctx.fillStyle = '#334155';
      this.ctx.fillRect(-20, -10, 35, 20);
      this.ctx.strokeStyle = color;
      this.ctx.strokeRect(-20, -10, 35, 20);
      
      // Warhead tip
      this.ctx.fillStyle = color;
      this.ctx.beginPath();
      this.ctx.arc(15, 0, 8, -Math.PI/2, Math.PI/2);
      this.ctx.fill();

      // Side stabilizers
      this.ctx.fillStyle = '#1e293b';
      this.ctx.beginPath();
      this.ctx.moveTo(-10, 10); this.ctx.lineTo(-20, 25); this.ctx.lineTo(-10, 25);
      this.ctx.moveTo(-10, -10); this.ctx.lineTo(-20, -25); this.ctx.lineTo(-10, -25);
      this.ctx.fill();

      this.drawRotors(20, 30, color, 4, isHit);
  }

  // Commander (Drone: Radar Dish / Antenna)
  private drawCommander(isHit: boolean, tier: number) {
      const color = isHit ? '#fff' : (tier === 4 ? '#eab308' : '#facc15'); // Yellow
      
      // H-Shape Platform
      this.ctx.fillStyle = isHit ? '#fff' : '#1e293b';
      this.ctx.strokeStyle = color;
      this.ctx.lineWidth = 2;
      this.ctx.fillRect(-15, -15, 30, 30);
      this.ctx.strokeRect(-15, -15, 30, 30);
      
      // Rotating Radar Dish logic (visual only)
      const time = Date.now() / 200;
      this.ctx.strokeStyle = isHit ? '#fff' : color;
      this.ctx.beginPath();
      this.ctx.ellipse(0, 0, 10, 4, time, 0, Math.PI*2);
      this.ctx.stroke();
      
      // Antennas
      this.ctx.beginPath();
      this.ctx.moveTo(-15, -15); this.ctx.lineTo(-25, -25);
      this.ctx.moveTo(-15, 15); this.ctx.lineTo(-25, 25);
      this.ctx.stroke();

      this.drawRotors(30, 30, color, 6, isHit);
  }


  // 3. MARKSMAN (Sniper Base)
  private drawMarksman(isHit: boolean, tier: number) {
      const color = isHit ? '#fff' : '#a78bfa'; // Purple
      this.drawGenericBody(color, isHit);
      // Long Barrel
      this.ctx.strokeStyle = color;
      this.ctx.lineWidth = 2;
      this.ctx.beginPath();
      this.ctx.moveTo(10, 0); this.ctx.lineTo(35, 0);
      this.ctx.stroke();
      this.drawRotors(20, 20, color, 4, isHit);
  }

  // Sniper (Railgun: Long, thin, glowing core)
  private drawSniper(isHit: boolean, tier: number) {
      const color = isHit ? '#fff' : (tier === 4 ? '#3b82f6' : '#60a5fa'); // Blue
      const len = tier === 4 ? 50 : 40;

      // Rail Body
      this.ctx.fillStyle = '#1e293b';
      this.ctx.fillRect(-10, -5, 20, 10);
      
      // Rails
      this.ctx.strokeStyle = '#475569';
      this.ctx.lineWidth = 2;
      this.ctx.beginPath();
      this.ctx.moveTo(10, -4); this.ctx.lineTo(len, -4);
      this.ctx.moveTo(10, 4); this.ctx.lineTo(len, 4);
      this.ctx.stroke();

      // Energy Core
      this.ctx.strokeStyle = color;
      this.ctx.shadowColor = color;
      this.ctx.shadowBlur = 10;
      this.ctx.beginPath();
      this.ctx.moveTo(0, 0); this.ctx.lineTo(len, 0);
      this.ctx.stroke();
      this.ctx.shadowBlur = 0;

      this.drawRotors(15, 20, color, 4, isHit);
  }

  // Hunter (Crit: Triangle, Big Lens)
  private drawHunter(isHit: boolean, tier: number) {
      const color = isHit ? '#fff' : (tier === 4 ? '#dc2626' : '#ef4444'); // Red
      
      // Triangle Body
      this.ctx.fillStyle = isHit ? '#fff' : '#1e293b';
      this.ctx.strokeStyle = color;
      this.ctx.lineWidth = 2;
      this.ctx.beginPath();
      this.ctx.moveTo(25, 0);
      this.ctx.lineTo(-15, 15);
      this.ctx.lineTo(-15, -15);
      this.ctx.closePath();
      this.ctx.fill();
      this.ctx.stroke();

      // Lens Eye
      this.ctx.fillStyle = isHit ? '#fff' : '#fbbf24'; // Amber Eye
      this.ctx.beginPath();
      this.ctx.arc(0, 0, 6, 0, Math.PI*2);
      this.ctx.fill();
      
      // Scope Hood
      this.ctx.strokeStyle = '#475569';
      this.ctx.beginPath();
      this.ctx.arc(0, 0, 8, 0, Math.PI*2);
      this.ctx.stroke();

      this.drawRotors(20, 25, color, 4, isHit);
  }

  // Reaper (Pierce: Spiky, Scythe wings)
  private drawReaper(isHit: boolean, tier: number) {
      const color = isHit ? '#fff' : (tier === 4 ? '#4c1d95' : '#7c3aed'); // Dark Violet
      
      // Spiky Body
      this.ctx.fillStyle = isHit ? '#fff' : '#0f172a';
      this.ctx.strokeStyle = color;
      this.ctx.lineWidth = 2;
      this.ctx.beginPath();
      this.ctx.moveTo(30, 0); // Pointy nose
      this.ctx.lineTo(-5, 5);
      this.ctx.lineTo(-10, 0);
      this.ctx.lineTo(-5, -5);
      this.ctx.closePath();
      this.ctx.fill();
      this.ctx.stroke();

      // Scythe Wings (Forward swept)
      this.ctx.strokeStyle = isHit ? '#fff' : '#a78bfa';
      this.ctx.beginPath();
      this.ctx.moveTo(-5, 5); this.ctx.lineTo(10, 25); this.ctx.lineTo(-5, 20);
      this.ctx.moveTo(-5, -5); this.ctx.lineTo(10, -25); this.ctx.lineTo(-5, -20);
      this.ctx.stroke();

      this.drawRotors(10, 25, color, 4, isHit);
  }

  // --- HELPERS ---

  private drawGenericBody(color: string, isHit: boolean) {
      this.ctx.fillStyle = isHit ? '#ffffff' : '#1e293b';
      this.ctx.strokeStyle = color;
      this.ctx.lineWidth = 2;
      this.ctx.beginPath();
      this.ctx.moveTo(15, 0); this.ctx.lineTo(-10, 10); this.ctx.lineTo(-10, -10);
      this.ctx.closePath();
      this.ctx.fill();
      this.ctx.stroke();
  }

  private drawRotors(distX: number, distY: number, color: string, count: 4 | 6 = 4, isHit: boolean) {
      const time = Date.now();
      const bladeSize = 14;
      
      let pos = [
          {x: distX, y: distY}, {x: distX, y: -distY}, 
          {x: -distX, y: distY}, {x: -distX, y: -distY}
      ];
      
      if (count === 6) {
           pos = [
              {x: distX, y: distY}, {x: distX, y: -distY}, 
              {x: -distX, y: distY}, {x: -distX, y: -distY},
              {x: 0, y: distY + 10}, {x: 0, y: -distY - 10}
           ];
      }

      pos.forEach((p, i) => {
          this.ctx.save();
          this.ctx.translate(p.x, p.y);
          
          // Rotor Blur
          this.ctx.fillStyle = isHit ? '#ffffff' : color;
          this.ctx.globalAlpha = 0.2; 
          this.ctx.beginPath();
          this.ctx.arc(0, 0, bladeSize, 0, Math.PI * 2);
          this.ctx.fill();
          
          // Center Hub
          this.ctx.globalAlpha = 1.0;
          this.ctx.fillStyle = isHit ? '#ffffff' : '#1e293b';
          this.ctx.beginPath();
          this.ctx.arc(0, 0, 3, 0, Math.PI*2);
          this.ctx.fill();
          
          // Spinning Blade
          this.ctx.rotate((time / 3) + (i * 1.5)); 
          this.ctx.fillStyle = isHit ? '#ffffff' : '#94a3b8';
          this.ctx.globalAlpha = 0.8;
          this.ctx.beginPath();
          this.ctx.rect(-2, -bladeSize, 4, bladeSize * 2); 
          this.ctx.fill();
          this.ctx.restore();
      });
  }

  private drawShield(hitFlash: number) {
      const shieldRadius = hitFlash > 0 ? 65 : 60;
      const opacity = hitFlash > 0 ? 0.6 : 0.2;
      this.ctx.save();
      this.ctx.strokeStyle = `rgba(34, 211, 238, ${opacity})`;
      this.ctx.lineWidth = 2;
      this.ctx.beginPath();
      this.ctx.arc(0, 0, shieldRadius, 0, Math.PI * 2);
      this.ctx.stroke();
      this.ctx.setLineDash([5, 15]);
      this.ctx.beginPath();
      this.ctx.arc(0, 0, shieldRadius - 5, 0, Math.PI * 2);
      this.ctx.stroke();
      this.ctx.restore();
  }

  // ENEMY RENDERING
  drawEnemy(enemy: Enemy, x: number, y: number) {
    this.ctx.save();
    this.ctx.translate(x, y);
    this.ctx.rotate(enemy.angle);
    const isHit = enemy.iframe > 0;
    const baseColor = isHit ? '#ffffff' : this.getEnemyColor(enemy.type);
    const glowColor = isHit ? '#ffffff' : this.getEnemyGlow(enemy.type);
    const metalColor = isHit ? '#ffffff' : '#334155';
    this.ctx.shadowBlur = 10;
    this.ctx.shadowColor = glowColor;

    let scale = 1;
    if (enemy.type === 'boss') scale = 2.5;
    if (enemy.type === 'finalboss') scale = 4.0;
    if (enemy.type === 'tank') scale = 1.3;
    if (enemy.type === 'splitter' && !enemy.isMini) scale = 1.2;
    if (enemy.isMini) scale = 0.6;
    this.ctx.scale(scale, scale);

    if (enemy.type === 'scout') {
        this.ctx.fillStyle = metalColor; this.ctx.beginPath(); this.ctx.moveTo(5,5); this.ctx.lineTo(-10,15); this.ctx.lineTo(-5,0); this.ctx.moveTo(5,-5); this.ctx.lineTo(-10,-15); this.ctx.lineTo(-5,0); this.ctx.fill();
        this.ctx.fillStyle = '#0f172a'; this.ctx.strokeStyle = baseColor; this.ctx.lineWidth=2; this.ctx.beginPath(); this.ctx.arc(0,0,8,0,Math.PI*2); this.ctx.fill(); this.ctx.stroke();
    } else if (enemy.type === 'shooter') {
        this.ctx.fillStyle = metalColor; this.ctx.fillRect(0,8,10,6); this.ctx.fillRect(0,-14,10,6); this.ctx.fillStyle=baseColor; this.ctx.fillRect(-5,-12,12,24);
    } else {
        this.ctx.fillStyle = baseColor; this.ctx.beginPath(); this.ctx.arc(0,0,10,0,Math.PI*2); this.ctx.fill();
    }
    
    this.ctx.shadowBlur = 0;
    this.ctx.scale(1/scale, 1/scale);
    this.ctx.rotate(-enemy.angle);
    
    // HP Bar
    const hpPercent = enemy.hp / enemy.maxHp;
    const barWidth = 40 * scale;
    this.ctx.fillStyle = 'rgba(0,0,0,0.5)'; this.ctx.fillRect(-barWidth/2, -30*scale, barWidth, 4);
    this.ctx.fillStyle = hpPercent > 0.5 ? '#22c55e' : '#ef4444'; this.ctx.fillRect(-barWidth/2, -30*scale, barWidth*hpPercent, 4);
    this.ctx.restore();
  }

  private getEnemyColor(type: Enemy['type']): string {
     return '#f472b6'; 
  }
  private getEnemyGlow(type: Enemy['type']): string {
     return '#ec4899';
  }

  drawProjectile(proj: Projectile, x: number, y: number) {
      this.ctx.save();
      this.ctx.translate(x, y);
      this.ctx.fillStyle = proj.color;
      const angle = Math.atan2(proj.velocity.y, proj.velocity.x);
      this.ctx.rotate(angle);
      if (proj.type === 'beam' || proj.type === 'shot') {
          this.ctx.beginPath(); this.ctx.roundRect(-10, -3, 20, 6, 3); this.ctx.fill();
      } else {
          this.ctx.beginPath(); this.ctx.arc(0, 0, proj.radius, 0, Math.PI * 2); this.ctx.fill();
      }
      this.ctx.restore();
  }

  drawParticles(particles: Particle[], camera: Vector2) {
      particles.forEach(p => {
          const x = p.pos.x - camera.x;
          const y = p.pos.y - camera.y;
          this.ctx.save();
          this.ctx.translate(x, y);
          const lifePercent = p.life / p.maxLife;
          this.ctx.fillStyle = p.color;
          this.ctx.globalAlpha = lifePercent;
          this.ctx.beginPath();
          this.ctx.arc(0, 0, p.size * lifePercent, 0, Math.PI*2);
          this.ctx.fill();
          this.ctx.restore();
      });
  }

  drawFloatingTexts(texts: any[], camera: Vector2) {
      this.ctx.save();
      this.ctx.font = 'bold 16px "Rajdhani", sans-serif'; 
      this.ctx.textAlign = 'center';
      texts.forEach(t => {
          const x = t.pos.x - camera.x;
          const y = t.pos.y - camera.y;
          this.ctx.globalAlpha = Math.min(1, t.life / 20);
          this.ctx.fillStyle = t.color;
          this.ctx.fillText(t.text, x, y);
      });
      this.ctx.restore();
  }
}
