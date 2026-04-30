const ShopState = {
  tab: 'rods',
  scrollY: 0,

  enter() {
    this.scrollY = 0;
  },

  update(dt) {},

  draw(time) {
    const W = CONFIG.LOGIC_W;
    const H = CONFIG.LOGIC_H;
    Render.rect(0, 0, W, H, '#0a0a1e');

    Render.text('商店', W/2, 8, 1.3, '#fff', 'center');
    Render.text(`${SaveSystem.data.gold}G`, W - 5, 8, 0.8, '#ffd700', 'right');

    // Tabs
    const tabs = ['rods', 'lines', 'baits'];
    const tabNames = ['鱼竿', '鱼线', '鱼饵'];
    const tabW = W / 3;
    tabs.forEach((t, i) => {
      const active = this.tab === t;
      Render.rect(i * tabW, 24, tabW - 1, 14, active ? '#3a5a3a' : '#1a2a1a');
      Render.text(tabNames[i], i * tabW + tabW/2, 27, 0.7, active ? '#fff' : '#666', 'center');
    });

    // Items
    const items = EQUIPMENT_DATA[this.tab] || [];
    let yy = 44;
    items.forEach((item, i) => {
      const rowY = yy + i * 48;
      if (rowY > H - 35) return;

      const owned = EquipmentSystem.isOwned(this.tab, item.id);
      const equipped = SaveSystem.data.equipment[this.tab === 'rods' ? 'rod' : this.tab === 'lines' ? 'line' : 'bait'] === item.id;

      Render.rect(8, rowY, W - 16, 42, equipped ? '#2a4a2a' : '#1a2a3a');
      Render.text(item.name, 14, rowY + 4, 0.9, '#fff');
      Render.text(item.description, 14, rowY + 16, 0.6, '#aaa');

      if (equipped) {
        Render.text('装备中', W - 14, rowY + 6, 0.7, '#4f4', 'right');
      } else if (owned) {
        Render.rect(W - 44, rowY + 24, 34, 14, '#3a6a3a');
        Render.text('装备', W - 27, rowY + 26, 0.7, '#fff', 'center');
      } else if (item.price > 0) {
        Render.rect(W - 50, rowY + 24, 40, 14, SaveSystem.data.gold >= item.price ? '#6a5a2a' : '#3a2a2a');
        Render.text(`${item.price}G`, W - 30, rowY + 26, 0.7, SaveSystem.data.gold >= item.price ? '#ffd700' : '#666', 'center');
      }
    });

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
      const tabs = ['rods', 'lines', 'baits'];
      const tabW = W / 3;
      const idx = Math.floor(pos.x / tabW);
      if (idx >= 0 && idx < 3) {
        this.tab = tabs[idx];
        Audio.sfxClick();
      }
    }

    // Item click
    const items = EQUIPMENT_DATA[this.tab] || [];
    let yy = 44;
    items.forEach((item, i) => {
      const rowY = yy + i * 48;
      const owned = EquipmentSystem.isOwned(this.tab, item.id);
      const equipped = SaveSystem.data.equipment[this.tab === 'rods' ? 'rod' : this.tab === 'lines' ? 'line' : 'bait'] === item.id;

      if (pos.y > rowY + 24 && pos.y < rowY + 38 && pos.x > W - 55) {
        if (!equipped && owned) {
          EquipmentSystem.equip(this.tab, item.id);
          Audio.sfxClick();
        } else if (!owned && item.price > 0) {
          if (EquipmentSystem.buy(this.tab, item.id)) {
            Audio.sfxCoin();
          }
        }
      }
    });

    // Back
    if (pos.y > H - 22 && pos.x > W/2 - 25 && pos.x < W/2 + 25) {
      Audio.sfxClick();
      Game.setState('map');
    }
  },
};
