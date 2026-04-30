const Particles = {
  list: [],

  add(x, y, color, count = 5) {
    for (let i = 0; i < count; i++) {
      this.list.push({
        x, y,
        vx: (Math.random() - 0.5) * 4,
        vy: -Math.random() * 3 - 0.5,
        life: 1,
        color,
        size: Math.random() * 2 + 2,
      });
    }
  },

  update(dt) {
    this.list = this.list.filter(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.1;
      p.life -= dt * 2;
      return p.life > 0;
    });
  },

  draw() {
    Render.drawParticles(this.list);
  },
};
