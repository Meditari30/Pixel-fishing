const EquipmentSystem = {
  getCurrentRod() {
    return EQUIPMENT_DATA.rods.find(r => r.id === SaveSystem.data.equipment.rod);
  },
  getCurrentLine() {
    return EQUIPMENT_DATA.lines.find(l => l.id === SaveSystem.data.equipment.line);
  },
  getCurrentBait() {
    return EQUIPMENT_DATA.baits.find(b => b.id === SaveSystem.data.equipment.bait);
  },
  getBarBonus() {
    const rod = this.getCurrentRod();
    return rod ? rod.barBonus : 0;
  },
  getDrainReduction() {
    const line = this.getCurrentLine();
    return line ? line.drainReduction : 0;
  },
  getRarityBoost() {
    const bait = this.getCurrentBait();
    return bait ? bait.rarityBoost : 0;
  },
  getBiteSpeed() {
    const bait = this.getCurrentBait();
    return bait ? bait.biteSpeed : 1;
  },
  buy(category, id) {
    const list = EQUIPMENT_DATA[category];
    if (!list) return false;
    const item = list.find(i => i.id === id);
    if (!item) return false;
    const ownedKey = category === 'rods' ? 'rods' : category === 'lines' ? 'lines' : 'baits';
    if (SaveSystem.data.ownedEquipment[ownedKey].includes(id)) return false;
    if (!SaveSystem.spendGold(item.price)) return false;
    SaveSystem.data.ownedEquipment[ownedKey].push(id);
    SaveSystem.save();
    return true;
  },
  equip(category, id) {
    const key = category === 'rods' ? 'rod' : category === 'lines' ? 'line' : 'bait';
    const ownedKey = category === 'rods' ? 'rods' : category === 'lines' ? 'lines' : 'baits';
    if (!SaveSystem.data.ownedEquipment[ownedKey].includes(id)) return false;
    SaveSystem.data.equipment[key] = id;
    SaveSystem.save();
    return true;
  },
  isOwned(category, id) {
    const ownedKey = category === 'rods' ? 'rods' : category === 'lines' ? 'lines' : 'baits';
    return SaveSystem.data.ownedEquipment[ownedKey].includes(id);
  },
};
