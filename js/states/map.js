const MapState = {
  scrollY: 0,
  shareMsg: '',
  shareMsgTimer: 0,

  update(dt) {
    if (this.shareMsgTimer > 0) this.shareMsgTimer -= dt;
  },

  draw(time) {
    const W = CONFIG.LOGIC_W;
    const H = CONFIG.LOGIC_H;
    Render.rect(0, 0, W, H, '#1a2030');

    Render.text('选择钓鱼地点', W/2, 10, 1.3, '#fff', 'center');
    Render.text(`金币: ${SaveSystem.data.gold}`, W - 5, 10, 0.7, '#ffd700', 'right');

    const mapKeys = Object.keys(MAPS);
    mapKeys.forEach((id, i) => {
      const map = MAPS[id];
      const y = 35 + i * 65;
      const unlocked = SaveSystem.isMapUnlocked(id);

      Render.rect(10, y, W - 20, 55, unlocked ? '#2a3a4a' : '#1a1a2a');
      Render.rect(12, y + 2, W - 24, 51, unlocked ? '#3a4a5a' : '#2a2a3a');

      if (unlocked) {
        const colors = map.waterColors;
        Render.rect(16, y + 6, 30, 30, `rgb(${colors.top[0]},${colors.top[1]},${colors.top[2]})`);
        Render.fishIcon(31, y + 21, '#fff', 1.2);

        Render.text(map.name, 52, y + 8, 1.1, '#fff');
        Render.text(map.description, 52, y + 22, 0.7, '#aaa');

        const fishCount = FISH_DATA[id] ? FISH_DATA[id].length : 0;
        const caught = FISH_DATA[id] ? FISH_DATA[id].filter(f => SaveSystem.data.collection[f.name]).length : 0;
        Render.text(`${caught}/${fishCount}种`, W - 18, y + 38, 0.7, '#8af', 'right');

        if (SaveSystem.data.currentMap === id) {
          Render.text('当前', 16, y + 40, 0.7, '#4f4');
        }
      } else {
        Render.text(map.name, 52, y + 12, 1.1, '#555');
        Render.text(map.unlockText, 52, y + 28, 0.7, '#666');
        Render.text('🔒', 25, y + 14, 1.5, '#555', 'center');
      }
    });

    // Bottom buttons
    const btnW = 38;
    Render.rect(3, H - 30, btnW, 22, '#3a3a5a');
    Render.text('商店', 3 + btnW/2, H - 25, 0.8, '#ffd700', 'center');

    Render.rect(44, H - 30, btnW, 22, '#3a3a5a');
    Render.text('成就', 44 + btnW/2, H - 25, 0.8, '#aaf', 'center');

    Render.rect(85, H - 30, btnW, 22, '#3a3a5a');
    Render.text('图鉴', 85 + btnW/2, H - 25, 0.8, '#afa', 'center');

    Render.rect(126, H - 30, btnW + 12, 22, '#3a5a3a');
    Render.text('分享存档', 126 + (btnW + 12)/2, H - 25, 0.7, '#8f8', 'center');

    // Weather info
    Render.text(`${WeatherSystem.getTimeName()} ${WeatherSystem.getWeatherName()}`, W/2, H - 8, 0.6, '#888', 'center');

    // Share message popup
    if (this.shareMsgTimer > 0) {
      Render.rect(10, H/2 - 20, W - 20, 40, 'rgba(20,60,20,0.95)');
      Render.text(this.shareMsg, W/2, H/2 - 8, 0.8, '#8f8', 'center');
    }
  },

  onPress() {},
  onRelease() {},

  onClick(pos) {
    const W = CONFIG.LOGIC_W;
    const H = CONFIG.LOGIC_H;

    // Map selection
    const mapKeys = Object.keys(MAPS);
    mapKeys.forEach((id, i) => {
      const y = 35 + i * 65;
      if (pos.x > 10 && pos.x < W - 10 && pos.y > y && pos.y < y + 55) {
        if (SaveSystem.isMapUnlocked(id)) {
          SaveSystem.data.currentMap = id;
          SaveSystem.save();
          Audio.sfxClick();
          Game.setState('fishing');
        }
      }
    });

    // Bottom buttons
    if (pos.y > H - 30 && pos.y < H - 8) {
      if (pos.x > 3 && pos.x < 41) { Audio.sfxClick(); Game.setState('shop'); }
      else if (pos.x > 44 && pos.x < 82) { Audio.sfxClick(); Game.setState('achievements'); }
      else if (pos.x > 85 && pos.x < 123) { Audio.sfxClick(); Game.setState('collection'); }
      else if (pos.x > 126 && pos.x < 180) { this._shareSave(); }
    }
  },

  _shareSave() {
    const url = SaveSystem.exportToURL();
    if (!url) {
      this.shareMsg = '导出失败';
      this.shareMsgTimer = 2;
      return;
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(() => {
        this.shareMsg = '存档链接已复制!';
        this.shareMsgTimer = 2.5;
        Audio.sfxCoin();
      }).catch(() => {
        this._fallbackShare(url);
      });
    } else {
      this._fallbackShare(url);
    }
  },

  _fallbackShare(url) {
    if (navigator.share) {
      navigator.share({ title: '像素钓鱼存档', url: url }).catch(() => {});
      this.shareMsg = '已打开分享';
      this.shareMsgTimer = 2;
    } else {
      prompt('复制此链接到其他设备打开:', url);
      this.shareMsg = '请手动复制链接';
      this.shareMsgTimer = 2;
    }
  },
};
