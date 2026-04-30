const FishingState = {
  phase: 'idle',
  castPower: 0,
  castDistance: 0,
  waitTimer: 0,
  biteTimer: 0,
  biting: false,
  bobberX: 0,
  bobberY: 0,
  swipeCast: false,

  enter() {
    this.phase = 'idle';
    this.castPower = 0;
    this.biting = false;
    // Request motion permission on first enter if mode needs it
    const mode = SaveSystem.data.settings.castMode;
    if ((mode === 'motion' || mode === 'both') && !Input.motionPermission) {
      Input.requestMotionPermission();
    }
  },

  update(dt) {
    if (this.phase === 'casting') {
      this.castPower += dt * CONFIG.CAST_SPEED;
      if (this.castPower >= 100) this.castPower = 100;
    }

    if (this.phase === 'waiting') {
      if (!this.biting) {
        this.waitTimer -= dt;
        if (this.waitTimer <= 0) {
          this.biting = true;
          this.biteTimer = CONFIG.BITE_WINDOW;
          Audio.sfxBite();
          Input.vibrate(200);
        }
      } else {
        this.biteTimer -= dt;
        if (this.biteTimer <= 0) {
          this.phase = 'idle';
          this.biting = false;
        }
      }
    }
  },

  draw(time) {
    const W = CONFIG.LOGIC_W;
    const H = CONFIG.LOGIC_H;
    const mapId = SaveSystem.data.currentMap;
    const mapData = MAPS[mapId];

    Render.drawSky(mapData, WeatherSystem);
    Render.drawGround(mapData);
    Render.drawWater(mapData, time);
    Render.drawClouds(time);

    // Rain
    if (WeatherSystem.weather === 'rainy') Render.drawRain(time, 20);
    if (WeatherSystem.weather === 'storm') Render.drawRain(time, 40);

    // Time overlay
    const alpha = WeatherSystem.getAmbientAlpha();
    if (alpha > 0) {
      Render.rect(0, 0, W, H, `rgba(10,10,40,${alpha})`);
    }

    // Character
    const ctx = Render.ctx;
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(25, mapData.waterY - 23, 6, 12);
    ctx.fillStyle = '#FFD700';
    ctx.fillRect(26, mapData.waterY - 29, 4, 6);
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(31, mapData.waterY - 21, 12, 1);
    ctx.fillRect(43, mapData.waterY - 21, 1, 20);

    // HUD
    Render.text(`${WeatherSystem.getTimeName()} ${WeatherSystem.getWeatherName()}`, W - 3, 3, 0.6, '#ccc', 'right');
    Render.text(`${SaveSystem.data.gold}G`, 3, 3, 0.7, '#ffd700');

    if (this.phase === 'idle') {
      const mode = SaveSystem.data.settings.castMode;
      if (mode === 'swipe') {
        Render.text('向上滑动抛竿', W/2, 40, 1, '#fff', 'center');
      } else if (mode === 'motion') {
        Render.text('挥动手机抛竿', W/2, 40, 1, '#fff', 'center');
      } else {
        Render.text('滑动或挥动抛竿', W/2, 40, 1, '#fff', 'center');
      }
      Render.text('长按=蓄力模式', W/2, 54, 0.6, '#888', 'center');

      // Back button
      Render.rect(3, H - 22, 30, 16, '#3a3a5a');
      Render.text('返回', 18, H - 19, 0.7, '#aaa', 'center');
    }

    if (this.phase === 'casting') {
      Render.rect(W/2 - 30, 20, 60, 12, '#333');
      const barColor = this.castPower > 80 ? '#ff4444' : '#44cc44';
      Render.rect(W/2 - 28, 22, 56 * (this.castPower / 100), 8, barColor);
      Render.text('蓄力中...', W/2, 6, 0.8, '#fff', 'center');
    }

    if (this.phase === 'waiting') {
      // Fishing line
      ctx.strokeStyle = '#aaa';
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(43, mapData.waterY - 1);
      ctx.lineTo(this.bobberX, this.bobberY);
      ctx.stroke();

      // Bobber
      const bobY = this.bobberY + Math.sin(time * 3) * (this.biting ? 4 : 1);
      ctx.fillStyle = '#ff3030';
      ctx.fillRect(this.bobberX - 2, bobY - 4, 4, 4);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(this.bobberX - 2, bobY, 4, 3);
      ctx.fillStyle = '#333';
      ctx.fillRect(this.bobberX, bobY + 3, 1, 4);

      if (this.biting) {
        Render.text('!', this.bobberX + 5, this.bobberY - 15, 2, '#ff0');
        Render.text('快点击!', W/2, 40, 1.2, '#ff4444', 'center');
      } else {
        Render.text('等待中...', W/2, 40, 0.8, '#aaa', 'center');
      }
    }
  },

  _doCast(power) {
    this.castDistance = power * 100;
    const mapData = MAPS[SaveSystem.data.currentMap];
    this.bobberX = CONFIG.LOGIC_W / 2 + (Math.random() - 0.5) * 40;
    this.bobberY = mapData.waterY + 10 + (1 - power) * 30;
    this.phase = 'waiting';
    const biteSpeed = EquipmentSystem.getBiteSpeed();
    this.waitTimer = (Math.random() * 4 + 2) / biteSpeed;
    this.biting = false;
    Audio.sfxCast();
    Audio.sfxSwipe();
  },

  onPress() {
    Audio.resume();
    if (this.phase === 'idle') {
      this.swipeCast = false;
      this.phase = 'casting';
      this.castPower = 0;
    } else if (this.phase === 'waiting' && this.biting) {
      Audio.sfxClick();
      Game.setState('minigame', { castDistance: this.castDistance });
    }
  },

  onRelease() {
    if (this.phase === 'casting') {
      const mode = SaveSystem.data.settings.castMode;
      let didSwipe = false;

      // Swipe mode: speed of swipe determines cast power
      if ((mode === 'swipe' || mode === 'both') && Input.swipe) {
        this._doCast(Input.swipe.power);
        didSwipe = true;
      }
      // Motion mode: shake intensity determines cast power
      if (!didSwipe && (mode === 'motion' || mode === 'both') && Input.motionPermission) {
        const power = Input.getMotionCastPower();
        if (power > 0.1) {
          this._doCast(power);
          didSwipe = true;
        }
      }
      // Fallback: hold duration power
      if (!didSwipe) {
        this._doCast(this.castPower / 100);
      }
    }
  },

  onClick(pos) {
    const H = CONFIG.LOGIC_H;
    if (this.phase === 'idle' && pos.x < 35 && pos.y > H - 24) {
      Audio.sfxClick();
      Game.setState('map');
    }
  },
};
