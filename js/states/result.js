const ResultState = {
  fish: null,
  size: 0,
  gold: 0,
  caught: false,
  achievementPopup: null,
  popupTimer: 0,

  enter(params) {
    this.fish = params.fish;
    this.size = params.size;
    this.gold = params.gold;
    this.caught = params.caught;
    this.achievementPopup = AchievementSystem.popPending();
    this.popupTimer = this.achievementPopup ? 3 : 0;
  },

  update(dt) {
    if (this.popupTimer > 0) this.popupTimer -= dt;
  },

  draw(time) {
    const W = CONFIG.LOGIC_W;
    const H = CONFIG.LOGIC_H;
    Render.rect(0, 0, W, H, 'rgba(10,10,30,0.95)');

    if (this.caught) {
      Render.text('钓到了!', W/2, 35, 2, '#ffdd00', 'center');
      Render.fishIcon(W/2, 85, this.fish.color, 3);
      Render.text(this.fish.name, W/2, 115, 1.8, '#fff', 'center');
      Render.text(CONFIG.RARITY_NAMES[this.fish.rarity], W/2, 140, 1, CONFIG.RARITY_COLORS[this.fish.rarity], 'center');
      Render.text(`${this.size} cm`, W/2, 160, 1.2, '#aaa', 'center');
      Render.text(`+${this.gold} G`, W/2, 185, 1.2, '#ffd700', 'center');

      if (SaveSystem.data.collection[this.fish.name] && SaveSystem.data.collection[this.fish.name].count === 1) {
        Render.text('新发现!', W/2, 210, 1, '#ff8800', 'center');
      }
    } else {
      Render.text('鱼跑了...', W/2, 70, 1.8, '#ff4444', 'center');
      Render.fishIcon(W/2, 110, this.fish.color, 2);
      Render.text(this.fish.name, W/2, 135, 1, '#888', 'center');
      Render.text('下次加油!', W/2, 165, 1, '#888', 'center');
    }

    // Achievement popup
    if (this.achievementPopup && this.popupTimer > 0) {
      const a = this.achievementPopup;
      Render.rect(10, H - 70, W - 20, 35, '#2a2a5a');
      Render.text('成就解锁!', W/2, H - 67, 0.7, '#ffd700', 'center');
      Render.text(a.name, W/2, H - 55, 0.9, '#fff', 'center');
      Render.text(`+${a.reward}G`, W/2, H - 43, 0.7, '#ffd700', 'center');
    }

    Render.text('点击继续', W/2, H - 25, 1, '#888', 'center');
  },

  onPress() {
    Audio.sfxClick();
    FishingState.enter();
    Game.setState('fishing');
  },

  onRelease() {},
  onClick(pos) {},
};
