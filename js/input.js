const Input = {
  pressing: false,
  swipe: null,
  lastSwipeSpeed: 0,
  motionPermission: false,
  castMode: 'swipe',

  // Swipe tracking
  _touchStartY: 0,
  _touchStartX: 0,
  _touchStartTime: 0,
  _touchTrail: [],
  _lastTapTime: 0,

  // Gyroscope
  _peakAccel: 0,
  _accelSamples: [],
  _motionListening: false,

  init() {
    const canvas = Render.canvas;

    canvas.addEventListener('touchstart', e => {
      e.preventDefault();
      this.pressing = true;
      const touch = e.touches[0];
      this._touchStartY = touch.clientY;
      this._touchStartX = touch.clientX;
      this._touchStartTime = performance.now();
      this._touchTrail = [{ y: touch.clientY, t: performance.now() }];
      this._onPress();
    }, { passive: false });

    canvas.addEventListener('touchmove', e => {
      e.preventDefault();
      const touch = e.touches[0];
      this._touchTrail.push({ y: touch.clientY, t: performance.now() });
      if (this._touchTrail.length > 10) this._touchTrail.shift();
    }, { passive: false });

    canvas.addEventListener('touchend', e => {
      e.preventDefault();
      this.pressing = false;
      this._calculateSwipe();
      this._onRelease();

      // Simulate click for touch devices (fire onClick with position)
      const now = performance.now();
      const dt = now - this._touchStartTime;
      const dy = this._touchTrail.length > 1
        ? Math.abs(this._touchTrail[this._touchTrail.length - 1].y - this._touchTrail[0].y)
        : 0;
      // If it was a short tap (< 300ms) with minimal movement (< 15px), treat as click
      if (dt < 300 && dy < 15) {
        const pos = Render.screenToLogic(this._touchStartX, this._touchStartY);
        if (this._onClick) this._onClick(pos);
      }
    }, { passive: false });

    canvas.addEventListener('mousedown', e => {
      this.pressing = true;
      this._touchStartY = e.clientY;
      this._touchStartX = e.clientX;
      this._touchStartTime = performance.now();
      this._touchTrail = [{ y: e.clientY, t: performance.now() }];
      this._onPress();
    });

    canvas.addEventListener('mousemove', e => {
      if (this.pressing) {
        this._touchTrail.push({ y: e.clientY, t: performance.now() });
        if (this._touchTrail.length > 10) this._touchTrail.shift();
      }
    });

    canvas.addEventListener('mouseup', e => {
      this.pressing = false;
      this._calculateSwipe();
      this._onRelease();
    });

    canvas.addEventListener('click', e => {
      const pos = Render.screenToLogic(e.clientX, e.clientY);
      if (this._onClick) this._onClick(pos);
    });
  },

  _calculateSwipe() {
    if (this._touchTrail.length < 2) {
      this.swipe = null;
      this.lastSwipeSpeed = 0;
      return;
    }
    // Use the last few points for velocity calculation (more responsive)
    const trail = this._touchTrail;
    const last = trail[trail.length - 1];
    const lookback = trail.length >= 4 ? trail[trail.length - 4] : trail[0];
    const dy = lookback.y - last.y;
    const dt = (last.t - lookback.t) / 1000;

    if (dy > 20 && dt < 0.4 && dt > 0) {
      const speed = dy / dt;
      // Normalize: slow swipe ~0.2, medium ~0.5, fast flick ~1.0
      const normalizedSpeed = Math.min(Math.pow(speed / 1200, 0.8), 1);
      this.swipe = { distance: dy, speed, power: normalizedSpeed };
      this.lastSwipeSpeed = normalizedSpeed;
    } else {
      this.swipe = null;
      this.lastSwipeSpeed = 0;
    }
  },

  async requestMotionPermission() {
    if (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') {
      try {
        const perm = await DeviceMotionEvent.requestPermission();
        this.motionPermission = (perm === 'granted');
      } catch (e) {
        this.motionPermission = false;
      }
    } else if (typeof DeviceMotionEvent !== 'undefined') {
      this.motionPermission = true;
    }
    if (this.motionPermission) this._startMotionListening();
    return this.motionPermission;
  },

  _startMotionListening() {
    if (this._motionListening) return;
    this._motionListening = true;
    window.addEventListener('devicemotion', e => {
      const acc = e.accelerationIncludingGravity;
      if (!acc) return;
      const magnitude = Math.sqrt(acc.x * acc.x + acc.y * acc.y + acc.z * acc.z);
      const netForce = Math.abs(magnitude - 9.8);
      this._accelSamples.push({ force: netForce, t: performance.now() });
      if (this._accelSamples.length > 20) this._accelSamples.shift();
      if (netForce > this._peakAccel) this._peakAccel = netForce;
    });
  },

  getMotionCastPower() {
    const peak = this._peakAccel;
    this._peakAccel = 0;
    this._accelSamples = [];
    return Math.min(peak / 25, 1);
  },

  _onPress() {},
  _onRelease() {},
  _onClick: null,

  vibrate(pattern) {
    if (navigator.vibrate) navigator.vibrate(pattern);
  },
};
