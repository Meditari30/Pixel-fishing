const EQUIPMENT_DATA = {
  rods: [
    { id: 'bamboo', name: '竹竿', description: '朴素的竹制鱼竿', price: 0, barBonus: 0 },
    { id: 'carbon', name: '碳素竿', description: '轻便耐用，操控更灵活', price: 200, barBonus: 10 },
    { id: 'titanium', name: '钛合金竿', description: '顶级材料，大幅提升捕获区', price: 800, barBonus: 20 },
    { id: 'legend', name: '传说之竿', description: '传说中的鱼竿，蕴含神秘力量', price: 2500, barBonus: 35 },
  ],
  lines: [
    { id: 'basic', name: '普通线', description: '基础鱼线', price: 0, drainReduction: 0 },
    { id: 'nylon', name: '尼龙线', description: '韧性更强，进度流失更慢', price: 150, drainReduction: 0.3 },
    { id: 'carbon_line', name: '碳素线', description: '几乎不可见，大幅减少流失', price: 600, drainReduction: 0.5 },
  ],
  baits: [
    { id: 'none', name: '无饵', description: '空钩钓鱼', price: 0, rarityBoost: 0, biteSpeed: 1 },
    { id: 'worm', name: '蚯蚓', description: '基础鱼饵，加快咬钩', price: 5, rarityBoost: 0, biteSpeed: 1.3 },
    { id: 'bug', name: '面包虫', description: '稍微提升稀有鱼概率', price: 15, rarityBoost: 0.15, biteSpeed: 1.2 },
    { id: 'shrimp', name: '活虾', description: '显著提升稀有鱼概率', price: 40, rarityBoost: 0.3, biteSpeed: 1.5 },
    { id: 'golden', name: '金饵', description: '传说级鱼饵，大幅提升所有概率', price: 150, rarityBoost: 0.5, biteSpeed: 2.0 },
  ],
};
