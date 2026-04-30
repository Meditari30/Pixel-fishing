const MinigameState = {
  barY: 0,
  barVel: 0,
  barHeight: 60,
  fishY: 0,
  fishTarget: 0,
  fishTimer: 0,
  progress: 0.3,
  minigameTime: 0,
  currentFish: null,
  currentFishSize: 0,
  castDistance: 0,

  enter(params) {
    this.castDistance = params ? params.castDistance : 50;
    this._pickFish();
    this.barHeight = Math.max(50, 100 - this.currentFish.difficulty * 10) + EquipmentSystem.getBarBonus();
    this.barY = (CONFIG.BAR_ZONE_H - this.barHeight) / 2;
    this.barVel = 0;
    this.fishY = CONFIG.BAR_ZONE_H / 2;
    this.fishTarget = Math.random() * (CONFIG.BAR_ZONE_H - 10);
    this.fishTimer = 0;
    this.minigameTime = 0;
    this.progress = CONFIG.PROGRESS_START;
  },

  _pickFish() {
    const mapId = SaveSystem.data.currentMap;
    const pool = FISH_DATA[mapId];
    if (!pool || pool.length === 0) { this.currentFish = FISH_DATA.pond[0]; return; }

    const normalized = this.castDistance / 100;
    const rarityBoost = EquipmentSystem.getRarityBoost();
    const time = WeatherSystem.time;
    const weather = WeatherSystem.weather;

    const available = pool.filter(f => {
      if (f.time !== 'any' && f.time !== time) return false;
      if (f.weather !== 'any' && f.weather !== weather) return false;
      return true;
    });

    const finalPool = available.length > 0 ? available : pool;
    let weighted = [];
    finalPool.forEach(f => {
      let weight = 1;
      if (f.rarity === 'common') weight = 40;
      else if (f.rarity === 'uncommon') weight = 20 + (normalized + rarityBoost) * 15;
      else if (f.rarity === 'rare') weight = 5 + (normalized + rarityBoost) * 20;
      else if (f.rarity === 'legendary') weight = (normalized + rarityBoost) * 8;
      weight = Math.max(1, Math.floor(weight));
      for (let i = 0; i < weight; i++) weighted.push(f);
    });

    this.currentFish = weighted[Math.floor(Math.random() * weighted.length)];
    this.currentFishSize = this.currentFish.minSize + Math.random() * (this.currentFish.maxSize - this.currentFish.minSize);
  },

  update(dt) {
    this.minigameTime += dt;
    const ZONE_H = CONFIG.BAR_ZONE_H;

    // Bar physics — responsive, with swipe-speed influence on sensitivity
    const liftForce = CONFIG.BAR_LIFT;
    const gravity = CONFIG.BAR_GRAVITY;

    if (Input.pressing) {
      this.barVel -= dt * liftForce;
    } else {
      this.barVel += dt * gravity;
    }
    this.barVel *= CONFIG.BAR_DAMPING;
    this.barY += this.barVel * dt;

    // Bounce
    if (this.barY < 0) { this.barY = 0; this.barVel = Math.abs(this.barVel) * CONFIG.BAR_BOUNCE; }
    if (this.barY > ZONE_H - this.barHeight) { this.barY = ZONE_H - this.barHeight; this.barVel = -Math.abs(this.barVel) * CONFIG.BAR_BOUNCE; }

    // Fish AI
    this.fishTimer -= dt;
    if (this.fishTimer <= 0) {
      const pattern = this.currentFish.pattern;
      if (pattern === 'smooth') {
        this.fishTarget = 10 + Math.random() * (ZONE_H - 30);
        this.fishTimer = 1.5 + Math.random() * 2.5;
      } else if (pattern === 'dart') {
        this.fishTarget = 5 + Math.random() * (ZONE_H - 20);
        this.fishTimer = 0.5 + Math.random() * 1.2;
      } else {
        this.fishTarget = 5 + Math.random() * (ZONE_H - 20);
        this.fishTimer = 0.6 + Math.random() * 1.8;
        if (Math.random() < 0.25) this.fishTimer = 0.2 + Math.random() * 0.5;
      }
    }

    // Fish movement
    const fishSpeed = this.currentFish.speed * CONFIG.FISH_SPEED_MULT * 55;
    const fishDist = this.fishTarget - this.fishY;
    const step = Math.sign(fishDist) * Math.min(Math.abs(fishDist), fishSpeed * dt);
    this.fishY += step;
    this.fishY = Math.max(0, Math.min(ZONE_H - 10, this.fishY));

    // Progress
    const fishCenter = this.fishY + 5;
    const inZone = fishCenter >= this.barY && fishCenter <= this.barY + this.barHeight;
    const drainReduction = EquipmentSystem.getDrainReduction();

    if (inZone) {
      this.progress += dt * CONFIG.PROGRESS_FILL;
    } else {
      const drain = (CONFIG.PROGRESS_DRAIN_BASE + this.currentFish.difficulty * CONFIG.PROGRESS_DRAIN_DIFF) * (1 - drainReduction);
      this.progress -= dt * drain;
    }
    this.progress = Math.max(0, Math.min(1, this.progress));

    if (this.progress >= 1) {
      const size = Math.round(this.currentFishSize);
      const mapId = SaveSystem.data.currentMap;
      const gold = SaveSystem.recordCatch(this.currentFish, size, mapId);
      QuestSystem.onCatch(this.currentFish, size, mapId);
      AchievementSystem.check();
      SaveSystem.tryUnlockMaps();
      Audio.sfxCatch();
      Input.vibrate(100);
      Particles.add(CONFIG.LOGIC_W / 2, CONFIG.LOGIC_H / 2, '#ffdd00', 15);
      Game.setState('result', { fish: this.currentFish, size, gold, caught: true });
    } else if (this.progress <= 0) {
      SaveSystem.recordFail();
      Audio.sfxFail();
      Input.vibrate([50, 50, 50]);
      Game.setState('result', { fish: this.currentFish, size: 0, gold: 0, caught: false });
    }
  },

  draw(time) {
    const W = CONFIG.LOGIC_W;
    const H = CONFIG.LOGIC_H;
    const ZONE_H = CONFIG.BAR_ZONE_H;
    const BAR_TOP = CONFIG.BAR_TOP;

    Render.rect(0, 0, W, H, '#1a2a3a');

    // Fishing bar background
    const barX = W / 2 - 15;
    Render.rect(barX, BAR_TOP - 2, 30, ZONE_H + 4, '#222');
    Render.rect(barX + 2, BAR_TOP, 26, ZONE_H, '#334');

    // Catch zone (green bar)
    const zoneColor = Input.pressing ? '#4ae04a' : '#3ab03a';
    Render.rect(barX + 2, BAR_TOP + this.barY, 26, this.barHeight, zoneColor);
    Render.rect(barX + 2, BAR_TOP + this.barY, 26, 2, '#6f6');
    Render.rect(barX + 2, BAR_TOP + this.barY + this.barHeight - 2, 26, 2, '#282');

    // Fish icon in bar
    Render.fishIcon(W/2, BAR_TOP + this.fishY + 5, this.currentFish.color, 1.2);

    // Progress bar (left side)
    Render.rect(barX - 20, BAR_TOP, 8, ZONE_H, '#222');
    const progH = ZONE_H * this.progress;
    const progColor = this.progress > 0.6 ? '#4a4' : this.progress > 0.3 ? '#aa4' : '#a44';
    Render.rect(barX - 18, BAR_TOP + ZONE_H - progH, 4, progH, progColor);

    // Fish info
    Render.text(this.currentFish.name, W/2, 8, 1.2, CONFIG.RARITY_COLORS[this.currentFish.rarity], 'center');
    Render.text(CONFIG.RARITY_NAMES[this.currentFish.rarity], W/2, 22, 0.7, '#888', 'center');

    // Timer
    Render.text(Math.floor(this.minigameTime) + 's', W - 10, 10, 0.7, '#666', 'right');

    // Instructions
    Render.text('按住=上升 松开=下落', W/2, H - 25, 0.7, '#666', 'center');
    Render.text('让鱼保持在绿色区域内', W/2, H - 14, 0.7, '#666', 'center');
  },

  onPress() {},
  onRelease() {},
  onClick(pos) {},
};
