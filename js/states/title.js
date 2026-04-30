const TitleState = {
  update(dt) {},

  draw(time) {
    const W = CONFIG.LOGIC_W;
    const H = CONFIG.LOGIC_H;
    const mapData = MAPS.pond;
    Render.drawSky(mapData, null);
    Render.drawGround(mapData);
    Render.drawWater(mapData, time);
    Render.drawClouds(time);

    Render.text('像素钓鱼', W/2, 50, 2.5, '#fff', 'center');
    Render.text('Pixel Fishing', W/2, 75, 1, '#aaccff', 'center');

    const btnY = 150;
    Render.rect(W/2 - 45, btnY, 90, 30, '#3a7a4a');
    Render.rect(W/2 - 43, btnY + 2, 86, 26, '#4a9a5a');
    Render.text('开始钓鱼', W/2, btnY + 9, 1.3, '#fff', 'center');

    Render.fishIcon(35, 220, '#e07040', 1.5);
    Render.fishIcon(145, 230, '#60a060', 1.2);
    Render.fishIcon(85, 240, '#ffaa00', 1);
    Render.fishIcon(60, 260, '#a040ff', 1.3);

    Render.text('点击屏幕开始', W/2, H - 25, 0.8, '#888', 'center');
  },

  onPress() {
    Audio.resume();
    Audio.sfxClick();
    Game.setState('map');
  },

  onRelease() {},
  onClick(pos) {},
};
