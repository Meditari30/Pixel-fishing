const Audio = {
  ctx: null,
  init() {
    this.ctx = new (window.AudioContext || window.webkitAudioContext)();
  },
  resume() {
    if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
  },
  playTone(freq, duration, type = 'square', vol = 0.15) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(vol, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  },
  sfxCast() { this.playTone(300, 0.1); setTimeout(() => this.playTone(200, 0.15), 100); },
  sfxBite() { this.playTone(800, 0.08); setTimeout(() => this.playTone(1000, 0.08), 80); setTimeout(() => this.playTone(1200, 0.06), 160); },
  sfxCatch() { this.playTone(523, 0.1); setTimeout(() => this.playTone(659, 0.1), 100); setTimeout(() => this.playTone(784, 0.15), 200); },
  sfxFail() { this.playTone(200, 0.2, 'sawtooth'); setTimeout(() => this.playTone(150, 0.3, 'sawtooth'), 200); },
  sfxClick() { this.playTone(600, 0.05); },
  sfxCoin() { this.playTone(880, 0.08); setTimeout(() => this.playTone(1100, 0.1), 80); },
  sfxAchievement() { this.playTone(523, 0.1); setTimeout(() => this.playTone(659, 0.1), 120); setTimeout(() => this.playTone(784, 0.1), 240); setTimeout(() => this.playTone(1047, 0.2), 360); },
  sfxSwipe() { this.playTone(250, 0.08, 'triangle'); setTimeout(() => this.playTone(400, 0.1, 'triangle'), 60); },
};
