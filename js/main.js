const Game = {
  state: null,
  stateName: '',
  time: 0,
  states: {},

  init() {
    Audio.init();
    Render.init();
    SaveSystem.load();
    Input.init();
    WeatherSystem.init();
    QuestSystem.init();

    // Set cast mode to 'both' by default for new users
    if (!SaveSystem.data.settings.castMode) {
      SaveSystem.data.settings.castMode = 'both';
      SaveSystem.save();
    }
    Input.castMode = SaveSystem.data.settings.castMode;

    // Request motion permission if mode includes motion
    if (Input.castMode === 'motion' || Input.castMode === 'both') {
      Input.requestMotionPermission();
    }

    this.states = {
      title: TitleState,
      map: MapState,
      fishing: FishingState,
      minigame: MinigameState,
      result: ResultState,
      collection: CollectionState,
      shop: ShopState,
      achievements: AchievementsState,
    };

    // Wire input callbacks
    Input._onPress = () => {
      if (this.state && this.state.onPress) this.state.onPress();
    };
    Input._onRelease = () => {
      if (this.state && this.state.onRelease) this.state.onRelease();
    };
    Input._onClick = (pos) => {
      if (this.state && this.state.onClick) this.state.onClick(pos);
    };

    this.setState('title');
    this._loop();
  },

  setState(name, params) {
    this.state = this.states[name];
    this.stateName = name;
    if (this.state && this.state.enter) this.state.enter(params);
  },

  _lastTime: performance.now(),

  _loop() {
    const now = performance.now();
    const dt = Math.min((now - this._lastTime) / 1000, 0.05);
    this._lastTime = now;

    this.time += dt;
    WeatherSystem.update(dt);
    Particles.update(dt);

    if (this.state && this.state.update) this.state.update(dt);

    Render.begin();
    if (this.state && this.state.draw) this.state.draw(this.time);
    Particles.draw();
    Render.end();

    requestAnimationFrame(() => this._loop());
  },
};

// Start
Game.init();
