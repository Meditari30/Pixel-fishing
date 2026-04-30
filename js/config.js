const CONFIG = {
  LOGIC_W: 180,
  LOGIC_H: 320,
  BAR_TOP: 40,
  BAR_BOTTOM: 280,
  get BAR_ZONE_H() { return this.BAR_BOTTOM - this.BAR_TOP; },

  // Minigame physics
  BAR_LIFT: 800,
  BAR_GRAVITY: 620,
  BAR_DAMPING: 0.91,
  BAR_BOUNCE: 0.35,

  // Progress rates
  PROGRESS_FILL: 0.045,
  PROGRESS_DRAIN_BASE: 0.025,
  PROGRESS_DRAIN_DIFF: 0.008,
  PROGRESS_START: 0.3,

  // Cast
  CAST_SPEED: 120,
  BITE_WINDOW: 2.0,

  // Fish speed multiplier — controls how fast fish move in minigame
  FISH_SPEED_MULT: 1.5,

  // Time system (seconds per game-period)
  TIME_PERIOD_DURATION: 60,

  // Rarity
  RARITY_COLORS: { common: '#aaaaaa', uncommon: '#55cc55', rare: '#5599ff', legendary: '#ffaa00' },
  RARITY_NAMES: { common: '普通', uncommon: '稀有', rare: '珍稀', legendary: '传说' },
  RARITY_SELL: { common: 10, uncommon: 25, rare: 60, legendary: 200 },
};
