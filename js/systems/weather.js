const WeatherSystem = {
  time: 'day',
  weather: 'sunny',
  _timer: 0,
  _weatherTimer: 0,
  timeIndex: 1,
  TIMES: ['morning', 'day', 'evening', 'night'],
  WEATHERS: ['sunny', 'sunny', 'cloudy', 'rainy', 'storm'],

  init() {
    this.timeIndex = 1;
    this.time = this.TIMES[this.timeIndex];
    this.weather = this.WEATHERS[Math.floor(Math.random() * this.WEATHERS.length)];
    this._timer = 0;
    this._weatherTimer = Math.random() * 30 + 30;
  },

  update(dt) {
    this._timer += dt;
    if (this._timer >= CONFIG.TIME_PERIOD_DURATION) {
      this._timer = 0;
      this.timeIndex = (this.timeIndex + 1) % 4;
      this.time = this.TIMES[this.timeIndex];
    }
    this._weatherTimer -= dt;
    if (this._weatherTimer <= 0) {
      this._weatherTimer = Math.random() * 40 + 40;
      this.weather = this.WEATHERS[Math.floor(Math.random() * this.WEATHERS.length)];
    }
  },

  getTimeName() {
    const names = { morning: '早晨', day: '白天', evening: '傍晚', night: '夜晚' };
    return names[this.time];
  },

  getWeatherName() {
    const names = { sunny: '晴天', cloudy: '阴天', rainy: '雨天', storm: '雷暴' };
    return names[this.weather];
  },

  getAmbientAlpha() {
    if (this.time === 'night') return 0.3;
    if (this.time === 'evening') return 0.15;
    if (this.time === 'morning') return 0.05;
    return 0;
  },
};
