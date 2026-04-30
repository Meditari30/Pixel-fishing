const FISH_DATA = {
  pond: [
    { name: '鲫鱼', rarity: 'common', difficulty: 1, minSize: 15, maxSize: 35, color: '#c8a860', speed: 1.0, pattern: 'smooth', time: 'any', weather: 'any' },
    { name: '鲤鱼', rarity: 'common', difficulty: 1.2, minSize: 25, maxSize: 55, color: '#e07040', speed: 1.2, pattern: 'smooth', time: 'any', weather: 'any' },
    { name: '草鱼', rarity: 'common', difficulty: 1.5, minSize: 30, maxSize: 70, color: '#60a060', speed: 1.4, pattern: 'smooth', time: 'day', weather: 'any' },
    { name: '鲢鱼', rarity: 'common', difficulty: 1.3, minSize: 20, maxSize: 45, color: '#b0b0c0', speed: 1.1, pattern: 'smooth', time: 'any', weather: 'sunny' },
    { name: '泥鳅', rarity: 'common', difficulty: 1.8, minSize: 10, maxSize: 25, color: '#8a6a40', speed: 1.5, pattern: 'dart', time: 'any', weather: 'rainy' },
    { name: '鳑鲏', rarity: 'common', difficulty: 1.1, minSize: 5, maxSize: 12, color: '#90c0d0', speed: 1.3, pattern: 'dart', time: 'any', weather: 'any' },
    { name: '黄颡鱼', rarity: 'common', difficulty: 1.6, minSize: 12, maxSize: 30, color: '#c0a030', speed: 1.4, pattern: 'mixed', time: 'night', weather: 'any' },
    { name: '金鱼', rarity: 'uncommon', difficulty: 2, minSize: 8, maxSize: 15, color: '#ffaa00', speed: 1.8, pattern: 'dart', time: 'day', weather: 'sunny' },
    { name: '鲈鱼', rarity: 'uncommon', difficulty: 2.2, minSize: 20, maxSize: 50, color: '#70b070', speed: 1.6, pattern: 'mixed', time: 'evening', weather: 'any' },
    { name: '翘嘴鲌', rarity: 'uncommon', difficulty: 2.3, minSize: 25, maxSize: 60, color: '#d0d0e0', speed: 1.9, pattern: 'dart', time: 'morning', weather: 'any' },
    { name: '锦鲤', rarity: 'rare', difficulty: 2.8, minSize: 30, maxSize: 60, color: '#ff6060', speed: 2.0, pattern: 'mixed', time: 'morning', weather: 'sunny' },
    { name: '月光鱼', rarity: 'rare', difficulty: 3, minSize: 12, maxSize: 20, color: '#c0c0ff', speed: 2.2, pattern: 'smooth', time: 'night', weather: 'any' },
    { name: '白化鲶', rarity: 'rare', difficulty: 3.2, minSize: 40, maxSize: 75, color: '#f0e0d0', speed: 1.8, pattern: 'smooth', time: 'night', weather: 'rainy' },
    { name: '池塘守护者', rarity: 'legendary', difficulty: 3.8, minSize: 60, maxSize: 100, color: '#40ff90', speed: 2.8, pattern: 'mixed', time: 'night', weather: 'rainy' },
  ],
  stream: [
    { name: '溪哥', rarity: 'common', difficulty: 1.5, minSize: 8, maxSize: 18, color: '#90b0a0', speed: 1.4, pattern: 'dart', time: 'any', weather: 'any' },
    { name: '石斑鱼', rarity: 'common', difficulty: 1.8, minSize: 15, maxSize: 35, color: '#7a6a50', speed: 1.3, pattern: 'smooth', time: 'day', weather: 'any' },
    { name: '鳟鱼', rarity: 'common', difficulty: 2, minSize: 20, maxSize: 50, color: '#e08070', speed: 1.6, pattern: 'mixed', time: 'morning', weather: 'any' },
    { name: '香鱼', rarity: 'common', difficulty: 1.6, minSize: 12, maxSize: 28, color: '#a0c080', speed: 1.5, pattern: 'smooth', time: 'any', weather: 'sunny' },
    { name: '宽鳍鱲', rarity: 'common', difficulty: 1.4, minSize: 6, maxSize: 15, color: '#70a0c0', speed: 1.6, pattern: 'dart', time: 'day', weather: 'any' },
    { name: '光唇鱼', rarity: 'common', difficulty: 1.7, minSize: 10, maxSize: 25, color: '#b0a070', speed: 1.3, pattern: 'smooth', time: 'any', weather: 'cloudy' },
    { name: '马口鱼', rarity: 'uncommon', difficulty: 2.3, minSize: 10, maxSize: 22, color: '#6090b0', speed: 1.9, pattern: 'dart', time: 'any', weather: 'any' },
    { name: '大眼鳜', rarity: 'uncommon', difficulty: 2.5, minSize: 25, maxSize: 55, color: '#c0a040', speed: 1.7, pattern: 'mixed', time: 'evening', weather: 'any' },
    { name: '军鱼', rarity: 'uncommon', difficulty: 2.4, minSize: 30, maxSize: 65, color: '#506050', speed: 2.0, pattern: 'mixed', time: 'morning', weather: 'rainy' },
    { name: '娃娃鱼', rarity: 'rare', difficulty: 3.2, minSize: 30, maxSize: 70, color: '#805030', speed: 2.0, pattern: 'smooth', time: 'night', weather: 'rainy' },
    { name: '雪鳟', rarity: 'rare', difficulty: 3, minSize: 25, maxSize: 45, color: '#e0e0ff', speed: 2.3, pattern: 'dart', time: 'morning', weather: 'cloudy' },
    { name: '岩原鲤', rarity: 'rare', difficulty: 2.8, minSize: 20, maxSize: 40, color: '#a08060', speed: 1.9, pattern: 'mixed', time: 'any', weather: 'storm' },
    { name: '溪流龙王', rarity: 'legendary', difficulty: 4, minSize: 50, maxSize: 90, color: '#30d0ff', speed: 3.0, pattern: 'dart', time: 'any', weather: 'storm' },
  ],
  ocean: [
    { name: '沙丁鱼', rarity: 'common', difficulty: 1.3, minSize: 10, maxSize: 20, color: '#8090b0', speed: 1.3, pattern: 'smooth', time: 'any', weather: 'any' },
    { name: '鲭鱼', rarity: 'common', difficulty: 1.6, minSize: 20, maxSize: 40, color: '#4080a0', speed: 1.5, pattern: 'smooth', time: 'day', weather: 'any' },
    { name: '海鲈', rarity: 'common', difficulty: 2, minSize: 30, maxSize: 60, color: '#607080', speed: 1.6, pattern: 'mixed', time: 'any', weather: 'any' },
    { name: '比目鱼', rarity: 'common', difficulty: 1.8, minSize: 20, maxSize: 50, color: '#a09070', speed: 1.2, pattern: 'smooth', time: 'day', weather: 'sunny' },
    { name: '秋刀鱼', rarity: 'common', difficulty: 1.5, minSize: 15, maxSize: 30, color: '#5070a0', speed: 1.7, pattern: 'dart', time: 'evening', weather: 'any' },
    { name: '鲷鱼', rarity: 'common', difficulty: 1.9, minSize: 20, maxSize: 45, color: '#e06080', speed: 1.4, pattern: 'smooth', time: 'any', weather: 'sunny' },
    { name: '金枪鱼', rarity: 'uncommon', difficulty: 2.8, minSize: 50, maxSize: 120, color: '#3060a0', speed: 2.2, pattern: 'dart', time: 'day', weather: 'any' },
    { name: '旗鱼', rarity: 'uncommon', difficulty: 3, minSize: 80, maxSize: 180, color: '#4050b0', speed: 2.5, pattern: 'dart', time: 'any', weather: 'sunny' },
    { name: '水母', rarity: 'uncommon', difficulty: 2, minSize: 15, maxSize: 40, color: '#d0a0ff', speed: 1.0, pattern: 'smooth', time: 'night', weather: 'any' },
    { name: '海马', rarity: 'uncommon', difficulty: 2.2, minSize: 5, maxSize: 15, color: '#f0a030', speed: 1.5, pattern: 'mixed', time: 'day', weather: 'sunny' },
    { name: '章鱼', rarity: 'rare', difficulty: 3.2, minSize: 30, maxSize: 80, color: '#c04060', speed: 2.3, pattern: 'mixed', time: 'evening', weather: 'cloudy' },
    { name: '蓝鳍金枪', rarity: 'rare', difficulty: 3.5, minSize: 100, maxSize: 250, color: '#2040c0', speed: 2.8, pattern: 'dart', time: 'morning', weather: 'any' },
    { name: '翻车鱼', rarity: 'rare', difficulty: 2.8, minSize: 80, maxSize: 200, color: '#90a0b0', speed: 1.5, pattern: 'smooth', time: 'day', weather: 'cloudy' },
    { name: '大白鲨', rarity: 'legendary', difficulty: 4.2, minSize: 200, maxSize: 500, color: '#6080a0', speed: 3.2, pattern: 'dart', time: 'any', weather: 'storm' },
  ],
  abyss: [
    { name: '灯笼鱼', rarity: 'common', difficulty: 2, minSize: 8, maxSize: 15, color: '#40a0a0', speed: 1.5, pattern: 'smooth', time: 'any', weather: 'any' },
    { name: '深海鳗', rarity: 'common', difficulty: 2.5, minSize: 40, maxSize: 100, color: '#304050', speed: 1.8, pattern: 'smooth', time: 'any', weather: 'any' },
    { name: '尖牙鱼', rarity: 'common', difficulty: 2.3, minSize: 10, maxSize: 20, color: '#2a2a40', speed: 2.0, pattern: 'dart', time: 'any', weather: 'any' },
    { name: '管眼鱼', rarity: 'common', difficulty: 2.2, minSize: 12, maxSize: 25, color: '#40606a', speed: 1.6, pattern: 'smooth', time: 'any', weather: 'any' },
    { name: '吞噬者', rarity: 'uncommon', difficulty: 3, minSize: 20, maxSize: 50, color: '#200020', speed: 2.2, pattern: 'dart', time: 'any', weather: 'any' },
    { name: '幽灵鱼', rarity: 'uncommon', difficulty: 3.2, minSize: 15, maxSize: 35, color: '#a0a0d0', speed: 2.0, pattern: 'mixed', time: 'night', weather: 'any' },
    { name: '深渊水母', rarity: 'uncommon', difficulty: 2.8, minSize: 30, maxSize: 80, color: '#ff40a0', speed: 1.5, pattern: 'smooth', time: 'any', weather: 'any' },
    { name: '皱鳃鲨', rarity: 'uncommon', difficulty: 3.3, minSize: 100, maxSize: 180, color: '#3a3a50', speed: 2.3, pattern: 'mixed', time: 'any', weather: 'storm' },
    { name: '巨口鱼', rarity: 'rare', difficulty: 3.5, minSize: 50, maxSize: 120, color: '#602020', speed: 2.5, pattern: 'dart', time: 'any', weather: 'any' },
    { name: '冰晶鱼', rarity: 'rare', difficulty: 3.8, minSize: 20, maxSize: 40, color: '#80ffff', speed: 2.8, pattern: 'mixed', time: 'any', weather: 'storm' },
    { name: '远古腔棘鱼', rarity: 'rare', difficulty: 4, minSize: 80, maxSize: 150, color: '#406030', speed: 2.3, pattern: 'smooth', time: 'any', weather: 'any' },
    { name: '龙鱼', rarity: 'legendary', difficulty: 4.5, minSize: 100, maxSize: 200, color: '#ffd700', speed: 3.5, pattern: 'dart', time: 'night', weather: 'storm' },
    { name: '虚空之主', rarity: 'legendary', difficulty: 5, minSize: 150, maxSize: 300, color: '#a040ff', speed: 4.0, pattern: 'mixed', time: 'night', weather: 'any' },
  ],
};

function getAllFish() {
  const all = [];
  Object.keys(FISH_DATA).forEach(map => {
    FISH_DATA[map].forEach(f => all.push({ ...f, map }));
  });
  return all;
}

function getFishCount() {
  let count = 0;
  Object.keys(FISH_DATA).forEach(map => { count += FISH_DATA[map].length; });
  return count;
}
