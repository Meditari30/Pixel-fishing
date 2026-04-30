# Pixel Fishing

一款使用 HTML5 Canvas 制作的像素风钓鱼小游戏。玩家可以在不同水域中抛竿、等待鱼咬钩，并通过小游戏完成收杆，收集不同稀有度的鱼类。

## 项目特色

- 纯前端实现，无需后端服务
- 像素风 Canvas 渲染，适配桌面端和移动端
- 多个钓鱼地图，包含池塘、溪流、海洋和深海等区域
- 鱼类图鉴、稀有度、尺寸和出售价格系统
- 装备商店，可购买鱼竿、鱼线和鱼饵
- 天气、时间、任务和成就系统
- 本地存档，游戏进度保存在浏览器中

## 目录结构

```text
fishing-game/
├── index.html
├── css/
│   └── style.css
└── js/
    ├── main.js
    ├── render.js
    ├── input.js
    ├── audio.js
    ├── data/
    ├── states/
    └── systems/
```

## 运行方式

直接用浏览器打开 `index.html` 即可开始游戏。

也可以在项目目录中启动一个本地静态服务：

```bash
python -m http.server 8000
```

然后访问：

```text
http://localhost:8000
```

## 操作说明

- 点击或触摸屏幕进行菜单选择和抛竿
- 鱼咬钩后进入收杆小游戏
- 按住屏幕控制捕获条上升，松开后捕获条下降
- 让捕获条尽量覆盖目标鱼，填满进度后完成捕获

## 技术栈

- HTML5
- CSS3
- JavaScript
- Canvas 2D
- LocalStorage

## 后续可优化方向

- 修复部分中文文本编码问题
- 增加音效和背景音乐资源
- 增加更多鱼类、地图和特殊事件
- 支持键盘或手柄操作
- 发布到 GitHub Pages 方便在线游玩

https://fancy-truffle-e5380a.netlify.app/
