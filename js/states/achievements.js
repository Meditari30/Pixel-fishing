const AchievementsState = {
  scrollY: 0,

  enter() {
    this.scrollY = 0;
  },

  update(dt) {},

  draw(time) {
    const W = CONFIG.LOGIC_W;
    const H = CONFIG.LOGIC_H;
    Render.rect(0, 0, W, H, '#0a0a1e');

    const prog = AchievementSystem.getProgress();
    Render.text('成就', W/2, 8, 1.3, '#fff', 'center');
    Render.text(`${prog.completed}/${prog.total}`, W - 5, 8, 0.7, '#ffd700', 'right');

    // Quest section
    Render.text('每日任务', 8, 28, 0.9, '#aaf');
    QuestSystem.activeQuests.forEach((q, i) => {
      const rowY = 42 + i * 28;
      const done = QuestSystem.isCompleted(q.id);
      const claimed = QuestSystem.progress[q.id + '_claimed'];

      Render.rect(6, rowY, W - 12, 24, done ? '#1a3a1a' : '#1a1a2a');
      Render.text(q.name, 12, rowY + 2, 0.7, done ? '#4f4' : '#fff');
      Render.text(q.description, 12, rowY + 12, 0.55, '#888');

      if (done && !claimed) {
        Render.rect(W - 40, rowY + 4, 32, 14, '#5a5a2a');
        Render.text(`${q.reward}G`, W - 24, rowY + 6, 0.6, '#ffd700', 'center');
      } else if (claimed) {
        Render.text('已领', W - 14, rowY + 6, 0.6, '#555', 'right');
      } else {
        const p = QuestSystem.progress[q.id] || 0;
        const t = q.target || 1;
        Render.text(`${p}/${t}`, W - 14, rowY + 6, 0.6, '#888', 'right');
      }
    });

    // Achievement list
    const achY = 42 + QuestSystem.activeQuests.length * 28 + 10;
    Render.text('成就列表', 8, achY, 0.9, '#ffa');

    ACHIEVEMENT_DATA.forEach((a, i) => {
      const rowY = achY + 16 + i * 20 - this.scrollY;
      if (rowY < achY + 10 || rowY > H - 30) return;

      const done = SaveSystem.data.achievements.includes(a.id);
      Render.text(done ? a.icon : '?', 12, rowY, 0.8, done ? '#fff' : '#333');
      Render.text(a.name, 26, rowY, 0.7, done ? '#fff' : '#555');
      if (done) {
        Render.text(`+${a.reward}G`, W - 8, rowY, 0.55, '#ffd700', 'right');
      } else {
        Render.text(a.description, 26, rowY + 9, 0.5, '#444');
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

    // Claim quest rewards
    const questStartY = 42;
    QuestSystem.activeQuests.forEach((q, i) => {
      const rowY = questStartY + i * 28;
      if (pos.y > rowY && pos.y < rowY + 24 && pos.x > W - 42) {
        const reward = QuestSystem.claimReward(q.id);
        if (reward > 0) {
          Audio.sfxCoin();
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
