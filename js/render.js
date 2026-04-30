const Render = {
  canvas: null,
  ctx: null,
  scale: 1,

  init() {
    this.canvas = document.getElementById('game');
    this.ctx = this.canvas.getContext('2d');
    this.resize();
    window.addEventListener('resize', () => this.resize());
  },

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.scale = Math.min(this.canvas.width / CONFIG.LOGIC_W, this.canvas.height / CONFIG.LOGIC_H);
  },

  begin() {
    const ctx = this.ctx;
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.restore();
    ctx.save();
    const offsetX = (this.canvas.width - CONFIG.LOGIC_W * this.scale) / 2;
    const offsetY = (this.canvas.height - CONFIG.LOGIC_H * this.scale) / 2;
    ctx.translate(offsetX, offsetY);
    ctx.scale(this.scale, this.scale);
    ctx.imageSmoothingEnabled = false;
  },

  end() {
    this.ctx.restore();
  },

  rect(x, y, w, h, color) {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(Math.floor(x), Math.floor(y), Math.ceil(w), Math.ceil(h));
  },

  text(text, x, y, size = 1, color = '#fff', align = 'left') {
    this.ctx.fillStyle = color;
    this.ctx.font = `${size * 8}px monospace`;
    this.ctx.textAlign = align;
    this.ctx.textBaseline = 'top';
    this.ctx.fillText(text, x, y);
  },

  fishIcon(x, y, color, size = 1) {
    const s = size;
    const ctx = this.ctx;
    ctx.fillStyle = color;
    ctx.fillRect(x - 4*s, y - 2*s, 8*s, 4*s);
    ctx.fillRect(x - 5*s, y - 1*s, 1*s, 2*s);
    ctx.fillRect(x + 4*s, y - 3*s, 2*s, 6*s);
    ctx.fillStyle = '#000';
    ctx.fillRect(x - 2*s, y - 1*s, 1*s, 1*s);
  },

  drawSky(mapData, weatherSys) {
    const colors = mapData.skyColors;
    const W = CONFIG.LOGIC_W;
    const waterY = mapData.waterY;
    for (let y = 0; y < waterY - 5; y += 2) {
      const t = y / (waterY - 5);
      const r = Math.floor(this.lerp(colors.top[0], colors.bottom[0], t));
      const g = Math.floor(this.lerp(colors.top[1], colors.bottom[1], t));
      const b = Math.floor(this.lerp(colors.top[2], colors.bottom[2], t));
      this.ctx.fillStyle = `rgb(${r},${g},${b})`;
      this.ctx.fillRect(0, y, W, 2);
    }
    // Weather overlay
    if (weatherSys) {
      if (weatherSys.weather === 'cloudy' || weatherSys.weather === 'rainy' || weatherSys.weather === 'storm') {
        this.ctx.fillStyle = `rgba(50,50,70,${weatherSys.weather === 'storm' ? 0.4 : 0.2})`;
        this.ctx.fillRect(0, 0, W, waterY);
      }
    }
  },

  drawWater(mapData, time) {
    const colors = mapData.waterColors;
    const W = CONFIG.LOGIC_W;
    const H = CONFIG.LOGIC_H;
    const waterY = mapData.waterY;
    for (let y = waterY; y < H; y += 2) {
      const depth = (y - waterY) / (H - waterY);
      const r = Math.floor(this.lerp(colors.top[0], colors.bottom[0], depth));
      const g = Math.floor(this.lerp(colors.top[1], colors.bottom[1], depth));
      const b = Math.floor(this.lerp(colors.top[2], colors.bottom[2], depth));
      this.ctx.fillStyle = `rgb(${r},${g},${b})`;
      this.ctx.fillRect(0, y, W, 2);
    }
    for (let x = 0; x < W; x += 12) {
      const waveY = waterY + Math.sin(time * 2 + x * 0.3) * 2;
      this.ctx.fillStyle = 'rgba(255,255,255,0.3)';
      this.ctx.fillRect(x, waveY, 8, 1);
    }
  },

  drawGround(mapData) {
    const waterY = mapData.waterY;
    this.rect(0, waterY - 10, CONFIG.LOGIC_W, 10, mapData.groundColor);
    this.rect(0, waterY - 5, CONFIG.LOGIC_W, 5, mapData.groundDarkColor);
  },

  drawRain(time, intensity) {
    this.ctx.fillStyle = 'rgba(180,200,255,0.4)';
    for (let i = 0; i < intensity; i++) {
      const x = (i * 17 + time * 200) % CONFIG.LOGIC_W;
      const y = (i * 31 + time * 400) % CONFIG.LOGIC_H;
      this.ctx.fillRect(x, y, 1, 4);
    }
  },

  drawClouds(time) {
    this.ctx.fillStyle = 'rgba(255,255,255,0.5)';
    this.ctx.fillRect(20 + Math.sin(time * 0.2) * 5, 15, 20, 6);
    this.ctx.fillRect(25 + Math.sin(time * 0.2) * 5, 12, 12, 4);
    this.ctx.fillRect(120 + Math.cos(time * 0.15) * 3, 25, 16, 5);
    this.ctx.fillRect(70 + Math.sin(time * 0.18) * 4, 20, 14, 5);
  },

  drawParticles(particles) {
    particles.forEach(p => {
      this.ctx.globalAlpha = p.life;
      this.rect(p.x, p.y, p.size, p.size, p.color);
    });
    this.ctx.globalAlpha = 1;
  },

  lerp(a, b, t) { return a + (b - a) * t; },

  screenToLogic(clientX, clientY) {
    const rect = this.canvas.getBoundingClientRect();
    const offsetX = (this.canvas.width - CONFIG.LOGIC_W * this.scale) / 2;
    const offsetY = (this.canvas.height - CONFIG.LOGIC_H * this.scale) / 2;
    return {
      x: (clientX - rect.left - offsetX) / this.scale,
      y: (clientY - rect.top - offsetY) / this.scale,
    };
  },
};
