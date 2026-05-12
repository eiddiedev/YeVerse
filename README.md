# YeVerse

**[ye.eiddie.me](https://ye.eiddie.me)**

A fan tribute to Kanye West — an immersive digital experience tracing his music, fashion, and cultural impact through an interactive timeline, 3D album shelf, and cinematic transitions.

---

## Tech Stack

- React 19 + TypeScript
- Vite 7
- Three.js (WebGL 3D shelf)
- Spotify Embed API (inline playback)
- Pure CSS animations (no UI framework)

## Module Status

| # | Module | Status | Notes |
|---|--------|--------|-------|
| I | **Hero** | Done | Landing splash with signature and quote |
| II | **Timeline** | Done | 10 eras, bilingual, album cross-links |
| III | **Discography** | Done | 17 albums, 3D shelf, Spotify playback, ratings, per-album transitions |
| IV | **YeWorld** | **Stub** | 5 branch cards only (YEEZY, ART, PUBLIC, MV, COLLABS) — no detail pages, no images, no interactivity |
| V | **Archive** | **Empty** | Placeholder text only — needs unreleased music, lyric readings, interview excerpts, fan theories |
| VI | **About** | Done | ID card with acknowledgements and sources |

### What YeWorld needs

YeWorld is meant to be a sprawling map of Kanye's influence beyond music. Each branch should grow into its own section with rich content:

- **YEEZY** — Footwear timeline, silhouette breakdowns, runway imagery
- **ART** — Album cover deep-dives, stage designs, typography analysis, architectural projects
- **PUBLIC** — Neutral chronological record of public events (controversies, statements, media appearances)
- **MV** — Music video analysis, live staging breakdowns, listening-event visuals
- **COLLABS** — Production credits, collaborative albums, label history, cross-field partnerships

### What Archive needs

The Archive is designed to be a quiet, expandable room for deeper cuts:

- Unreleased / leaked tracks with context
- Lyric readings and annotations
- Interview excerpts organized by era
- Fan theories and lore

## Contributing

This is an open project and **all contributions are welcome**. The best way to help:

1. **Open an issue** — propose content, report errors, suggest features
2. **Submit a PR** — add content to YeWorld branches or Archive entries
3. **Provide data** — missing Spotify IDs, correction to album metadata, image assets

Priority areas are **YeWorld** (IV) and **Archive** (V) — these sections are stubs waiting for community knowledge.

All contributors will be credited in the About section of the website.

## Development

```bash
npm install
npm run dev        # local dev server
npm run build      # production build
npm run fetch-artwork  # fetch album covers from iTunes API
```

## License

Fan-made tribute. Not affiliated with Kanye West, his labels, or any associated brands. All album art and music rights belong to their respective owners.

---

# YeVerse

**[ye.eiddie.me](https://ye.eiddie.me)**

献给 Kanye West 的粉丝致敬网站 — 通过互动时间线、3D 唱片架和电影级转场，追溯他的音乐、时尚与文化影响。

## 技术栈

React 19 + TypeScript / Vite 7 / Three.js（WebGL 3D 陈列架）/ Spotify 嵌入式播放 / 纯 CSS 动画

## 模块完成度

| 编号 | 模块 | 状态 | 说明 |
|------|------|------|------|
| I | **Hero** | 已完成 | 签名与引言落地页 |
| II | **Timeline** | 已完成 | 10 个时代节点，双语，可跳转专辑 |
| III | **Discography** | 已完成 | 17 张专辑，3D 陈列架，Spotify 播放，评分系统，电影级转场 |
| IV | **YeWorld** | **骨架** | 仅 5 张分支卡片（YEEZY / ART / PUBLIC / MV / COLLABS），无详情页、无图片、无交互 |
| V | **Archive** | **空白** | 仅占位文字 — 需要未发行音乐、歌词解读、采访摘录、粉丝考据 |
| VI | **About** | 已完成 | ID 卡片式致谢与来源 |

### YeWorld 需要什么

YeWorld 是 Ye 在音乐之外影响力的全景地图。每个分支应发展为独立的内容板块：

- **YEEZY** — 鞋款时间线、剪裁拆解、秀场影像
- **ART** — 封面设计深度分析、舞台设计、字体研究、建筑项目
- **PUBLIC** — 中立的公共事件编年（争议、发言、媒体曝光）
- **MV** — MV 逐帧分析、现场舞台拆解、试听会视觉
- **COLLABS** — 制作人署名、合作专辑、厂牌历史、跨界联名

### Archive 需要什么

Archive 被设计为一个安静、可扩展的深潜空间：

- 未发行 / 泄露曲目及背景
- 歌词解读与注释
- 按年代整理的采访片段
- 粉丝理论与考据

## 参与贡献

这是一个开放项目，**欢迎所有贡献**。最好的参与方式：

1. **提交 Issue** — 提议内容、报告错误、建议功能
2. **提交 PR** — 为 YeWorld 分支或 Archive 词条添加内容
3. **提供数据** — 缺失的 Spotify ID、专辑元数据修正、图片素材

优先贡献区域是 **YeWorld**（IV）和 **Archive**（V）— 这两个板块是等待社区知识填充的骨架。

所有贡献者将在网站 About 页面中致谢。

## 开发

```bash
npm install
npm run dev            # 本地开发服务器
npm run build          # 生产构建
npm run fetch-artwork  # 从 iTunes API 抓取专辑封面
```

## 许可

粉丝致敬作品。与 Kanye West、其厂牌或任何关联品牌无关。所有专辑封面和音乐版权归其各自所有者。
