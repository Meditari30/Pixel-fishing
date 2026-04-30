const CollectionState = {
  scrollY: 0,
  currentMap: 'pond',

  enter() {
    this.scrollY = 0;
    this.currentMap = SaveSystem.data.currentMap;
  },

  update(dt) {},

  draw(time) {
    const W = CONFIG.LOGIC_W;
    const H = CONFIG.LOGIC_H;
    Render.rect(0, 0, W, H, '#0a0a1e');

    Render.text('鱼类图鉴', W/2, 8, 1.3, '#fff', 'center');

    // Map tabs
    const mapKeys = Object.keys(MAPS);
    const tabW = W / mapKeys.length;
    mapKeys.forEach((id, i) => {
      const active = this.currentMap === id;
      Render.rect(i * tabW, 24, tabW - 1, 14, active ? '#3a5a7a' : '#1a2a3a');
      Render.text(MAPS[id].name.substring(0, 2), i * tabW + tabW/2, 27, 0.6, active ? '#fff' : '#666', 'center');
    });

    // Fish list
    const fishList = FISH_DATA[this.currentMap] || [];
    let yy = 42;
    fishList.forEach((f, i) => {
      const rowY = yy + i * 24 - this.scrollY;
      if (rowY < 38 || rowY > H - 30) return;

      const caught = SaveSystem.data.collection[f.name];
      if (caught) {
        Render.fishIcon(18, rowY + 6, f.color);
        Render.text(f.name, 32, rowY, 0.8, '#fff');
        Render.text(CONFIG.RARITY_NAMES[f.rarity], 32, rowY + 10, 0.55, CONFIG.RARITY_COLORS[f.rarity]);
        Render.text(`${caught.best}cm x${caught.count}`, W - 8, rowY + 4, 0.55, '#aaa', 'right');
      } else {
        Render.text('???', 32, rowY + 2, 0.8, '#444');
        Render.text(CONFIG.RARITY_NAMES[f.rarity], 32, rowY + 11, 0.55, '#333');
      }
    });

    // Stats
    const total = getAllFish().length;
    const collected = SaveSystem.getUniqueCount();
    Render.text(`${collected}/${total}种`, W - 5, 8, 0.7, '#8af', 'right');

    // Back
    Render.rect(W/2 - 25, H - 22, 50, 16, '#3a3a5a');
    Render.text('返回', W/2, H - 19, 0.8, '#aaa', 'center');
  },

  onPress() {},
  onRelease() {},

  onClick(pos) {
    const W = CONFIG.LOGIC_W;
    const H = CONFIG.LOGIC_H;

    // Tab click
    if (pos.y > 24 && pos.y < 38) {
      const mapKeys = Object.keys(MAPS);
      const tabW = W / mapKeys.length;
      const idx = Math.floor(pos.x / tabW);
      if (idx >= 0 && idx < mapKeys.length) {
        this.currentMap = mapKeys[idx];
        this.scrollY = 0;
        Audio.sfxClick();
      }
    }

    // Back button
    if (pos.y > H - 22 && pos.x > W/2 - 25 && pos.x < W/2 + 25) {
      Audio.sfxClick();
      Game.setState('map');
    }
  },
};
