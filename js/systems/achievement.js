const AchievementSystem = {
  pending: [],

  check() {
    const newly = [];
    ACHIEVEMENT_DATA.forEach(a => {
      if (SaveSystem.data.achievements.includes(a.id)) return;
      let met = false;
      const c = a.condition;
      if (c.type === 'totalCaught') met = SaveSystem.data.totalCaught >= c.value;
      else if (c.type === 'uniqueFish') met = SaveSystem.getUniqueCount() >= c.value;
      else if (c.type === 'streak') met = SaveSystem.data.maxStreak >= c.value;
      else if (c.type === 'maxSize') met = SaveSystem.data.maxSize >= c.value;
      else if (c.type === 'totalGold') met = SaveSystem.data.totalGold >= c.value;
      else if (c.type === 'rarityFirst') {
        met = Object.keys(SaveSystem.data.collection).some(name => {
          const allFish = getAllFish();
          const f = allFish.find(x => x.name === name);
          return f && f.rarity === c.value;
        });
      }
      else if (c.type === 'mapUnlock') met = SaveSystem.data.unlockedMaps.includes(c.value);
      if (met) {
        SaveSystem.data.achievements.push(a.id);
        SaveSystem.addGold(a.reward);
        newly.push(a);
      }
    });
    if (newly.length) SaveSystem.save();
    this.pending = this.pending.concat(newly);
    return newly;
  },

  popPending() {
    if (this.pending.length > 0) return this.pending.shift();
    return null;
  },

  getProgress() {
    return {
      total: ACHIEVEMENT_DATA.length,
      completed: SaveSystem.data.achievements.length,
    };
  },
};
