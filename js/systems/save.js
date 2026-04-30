const SaveSystem = {
  KEY: 'pixel_fishing_save',

  defaultData() {
    return {
      gold: 0,
      totalGold: 0,
      totalCaught: 0,
      streak: 0,
      maxStreak: 0,
      maxSize: 0,
      collection: {},
      unlockedMaps: ['pond'],
      currentMap: 'pond',
      equipment: { rod: 'bamboo', line: 'basic', bait: 'none' },
      ownedEquipment: { rods: ['bamboo'], lines: ['basic'], baits: ['none'] },
      achievements: [],
      questProgress: {},
      dailyQuestDate: null,
      dailyQuests: [],
      settings: { castMode: 'both' },
    };
  },

  data: null,

  load() {
    // Check URL for save data first
    const urlSave = this._loadFromURL();
    if (urlSave) {
      this.data = { ...this.defaultData(), ...urlSave };
      this.save();
      // Clean URL without reloading
      if (window.history.replaceState) {
        window.history.replaceState(null, '', window.location.pathname);
      }
      return this.data;
    }

    try {
      const raw = localStorage.getItem(this.KEY);
      if (raw) {
        this.data = { ...this.defaultData(), ...JSON.parse(raw) };
      } else {
        this.data = this.defaultData();
      }
    } catch (e) {
      this.data = this.defaultData();
    }
    return this.data;
  },

  save() {
    try {
      localStorage.setItem(this.KEY, JSON.stringify(this.data));
    } catch (e) {}
  },

  // URL save/load
  exportToURL() {
    try {
      const json = JSON.stringify(this.data);
      const encoded = btoa(unescape(encodeURIComponent(json)));
      const base = window.location.origin + window.location.pathname;
      return base + '?save=' + encoded;
    } catch (e) {
      return null;
    }
  },

  _loadFromURL() {
    try {
      const params = new URLSearchParams(window.location.search);
      const encoded = params.get('save');
      if (!encoded) return null;
      const json = decodeURIComponent(escape(atob(encoded)));
      return JSON.parse(json);
    } catch (e) {
      return null;
    }
  },

  addGold(amount) {
    this.data.gold += amount;
    this.data.totalGold += amount;
    this.save();
  },

  spendGold(amount) {
    if (this.data.gold >= amount) {
      this.data.gold -= amount;
      this.save();
      return true;
    }
    return false;
  },

  recordCatch(fish, size, mapId) {
    this.data.totalCaught++;
    this.data.streak++;
    if (this.data.streak > this.data.maxStreak) this.data.maxStreak = this.data.streak;
    if (size > this.data.maxSize) this.data.maxSize = size;

    if (!this.data.collection[fish.name]) {
      this.data.collection[fish.name] = { best: 0, count: 0, map: mapId };
    }
    this.data.collection[fish.name].count++;
    if (size > this.data.collection[fish.name].best) {
      this.data.collection[fish.name].best = size;
    }

    const sellPrice = CONFIG.RARITY_SELL[fish.rarity] + Math.floor(size / 10);
    this.addGold(sellPrice);
    this.save();
    return sellPrice;
  },

  recordFail() {
    this.data.streak = 0;
    this.save();
  },

  getUniqueCount() {
    return Object.keys(this.data.collection).length;
  },

  isMapUnlocked(mapId) {
    return this.data.unlockedMaps.includes(mapId);
  },

  tryUnlockMaps() {
    const newly = [];
    Object.keys(MAPS).forEach(id => {
      if (this.isMapUnlocked(id)) return;
      const cond = MAPS[id].unlockCondition;
      if (!cond) return;
      let met = false;
      if (cond.type === 'totalCaught') met = this.data.totalCaught >= cond.value;
      else if (cond.type === 'uniqueFish') met = this.getUniqueCount() >= cond.value;
      if (met) {
        this.data.unlockedMaps.push(id);
        newly.push(id);
      }
    });
    if (newly.length) this.save();
    return newly;
  },
};
