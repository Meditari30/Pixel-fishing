const QUEST_DATA = {
  daily: [
    { id: 'catch_5', name: '日常垂钓', description: '今天钓到5条鱼', type: 'catch_count', target: 5, reward: 50 },
    { id: 'catch_rare', name: '珍稀猎手', description: '钓到1条珍稀或以上的鱼', type: 'catch_rarity', target: 'rare', reward: 100 },
    { id: 'catch_pond', name: '池塘大师', description: '在池塘钓到3条鱼', type: 'catch_map', map: 'pond', target: 3, reward: 40 },
    { id: 'catch_stream', name: '溪流探索', description: '在溪流钓到3条鱼', type: 'catch_map', map: 'stream', target: 3, reward: 60 },
    { id: 'catch_ocean', name: '海洋征服', description: '在大海钓到3条鱼', type: 'catch_map', map: 'ocean', target: 3, reward: 80 },
    { id: 'catch_10', name: '钓鱼达人', description: '今天钓到10条鱼', type: 'catch_count', target: 10, reward: 120 },
    { id: 'catch_big', name: '大物猎手', description: '钓到一条50cm以上的鱼', type: 'catch_size', target: 50, reward: 80 },
  ],
};
