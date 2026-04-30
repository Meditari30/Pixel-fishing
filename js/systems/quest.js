const QuestSystem = {
  activeQuests: [],
  progress: {},

  init() {
    const today = new Date().toDateString();
    if (SaveSystem.data.dailyQuestDate !== today) {
      this._generateDaily();
      SaveSystem.data.dailyQuestDate = today;
      SaveSystem.save();
    } else {
      this.activeQuests = SaveSystem.data.dailyQuests || [];
      this.progress = SaveSystem.data.questProgress || {};
    }
  },

  _generateDaily() {
    const pool = [...QUEST_DATA.daily];
    const picked = [];
    for (let i = 0; i < 3 && pool.length > 0; i++) {
      const idx = Math.floor(Math.random() * pool.length);
      picked.push(pool.splice(idx, 1)[0]);
    }
    this.activeQuests = picked;
    this.progress = {};
    picked.forEach(q => { this.progress[q.id] = 0; });
    SaveSystem.data.dailyQuests = picked;
    SaveSystem.data.questProgress = this.progress;
    SaveSystem.save();
  },

  onCatch(fish, size, mapId) {
    this.activeQuests.forEach(q => {
      if (this.isCompleted(q.id)) return;
      if (q.type === 'catch_count') this.progress[q.id] = (this.progress[q.id] || 0) + 1;
      else if (q.type === 'catch_rarity') {
        const rarityOrder = ['common', 'uncommon', 'rare', 'legendary'];
        if (rarityOrder.indexOf(fish.rarity) >= rarityOrder.indexOf(q.target)) {
          this.progress[q.id] = (this.progress[q.id] || 0) + 1;
        }
      }
      else if (q.type === 'catch_map' && q.map === mapId) this.progress[q.id] = (this.progress[q.id] || 0) + 1;
      else if (q.type === 'catch_size' && size >= q.target) this.progress[q.id] = (this.progress[q.id] || 0) + 1;
    });
    SaveSystem.data.questProgress = this.progress;
    SaveSystem.save();
  },

  isCompleted(questId) {
    const q = this.activeQuests.find(x => x.id === questId);
    if (!q) return false;
    return (this.progress[q.id] || 0) >= (q.target || 1);
  },

  claimReward(questId) {
    if (!this.isCompleted(questId)) return 0;
    const q = this.activeQuests.find(x => x.id === questId);
    if (!q || this.progress[q.id + '_claimed']) return 0;
    this.progress[q.id + '_claimed'] = true;
    SaveSystem.data.questProgress = this.progress;
    SaveSystem.addGold(q.reward);
    return q.reward;
  },

  getCompletedCount() {
    return this.activeQuests.filter(q => this.isCompleted(q.id)).length;
  },
};
