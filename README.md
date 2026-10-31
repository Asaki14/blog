# Asaki

Astro 静态博客。使用 npm，`package-lock.json` 固定依赖。运行依赖：`astro@7.4.4`、`@astrojs/markdown-remark@7.3.5`、`@astrojs/rss@4.0.19`、`@astrojs/sitemap@3.7.4`、`satori@0.63.2`、`@resvg/resvg-js@2.6.2`；开发依赖 `wrangler@4.156.0`。

## 本地开发

```sh
npm ci
npm run dev
npm run build
npm run preview
```

## 写作

草稿正文与媒体保存在 gitignored 目录，未过 publish gate 不进入公开仓库：

```text
src/content/drafts/<slug>/zh.md
src/content/drafts/<slug>/en.md
drafts-media/<slug>/
```

1. 在相邻 studio 执行 `pipeline/new-post <slug> --track desktop --title '文章标题'`，填写草稿 frontmatter 与正文。
2. 如有英文译文，在同一目录创建 `en.md`。两篇的 slug 相同；只有译文存在时显示语言切换。
3. 图片、视频放在 `drafts-media/<slug>/`，正文以 `/media/<slug>/...` 引用。
4. 在相邻 studio 执行 `pipeline/edit <slug> [zh|en]`，浏览器直接编辑 Markdown，⌘S 保存并刷新右侧预览；双击预览段落定位源码。未保存时离开会提示，外部修改后拒绝覆盖；先复制修改，再重新加载。`--nvim` 保留终端编辑。也可运行 `npm run dev:drafts` 后访问 `http://localhost:4330/__edit/<slug>/`（英文加 `en/`）。编辑器只在草稿开发服务中提供，只监听本机；普通开发与生产构建不含编辑端点。`npm run preview:drafts` 仅构建预览，`npm run build:drafts` 产物在 `dist-drafts/`。
5. 用户审核后，在 studio 执行 `pipeline/gate <slug> publish`（前两关须已通过），正文与媒体移至 `src/content/posts/<slug>/`、`public/media/<slug>/`。
6. 执行 `npm run build && npx wrangler deploy`，再 commit、push。核验线上文章、OG 与媒体后才填平台稿。未过审的正文与媒体不得部署、提交或推送。

普通 `npm run build` 只构建正式文章，产物在 `dist/`。`SHOW_DRAFTS=1` 可启用草稿构建，但不得用于部署。

```yaml
---
title: 文章标题
date: 2026-10-30
description: 用于 RSS 和分享卡片的摘要。
tags: [macOS, dotfiles]
series: Dotfiles
cover: /media/my-post/cover.webp
---
```

`title`、`date`、`description` 必填；`tags` 默认空数组，`series`、`cover` 可省略。日期使用 ISO 格式。

中文路由 `/posts/<slug>/`，英文 `/en/posts/<slug>/`。`series` 只能是 `src/lib/series.ts` 中的 `Dotfiles` 或 `Agent`；顶栏直接链到 `/series/<name>/` 与 `/en/series/<name>/`，没有文章时显示空状态。首页按年份分组，空内容正常显示。

- 代码块：使用带语言的 Markdown fenced code，构建时由 Shiki 高亮。
- 图片：`![图片说明](/media/my-post/image.webp)`，点击或键盘激活可放大，Esc 关闭。
- 视频：`![视频说明](/media/my-post/demo.mp4)`，也支持 webm，自动循环、静音、行内播放并保留控制器。系统减少动态效果时停止自动播放。
- 提示块：使用 Markdown `> **提示**` 引用块。
- OG：每篇构建为 `/og/<slug>/zh.png` 或 `/og/<slug>/en.png`，satori + resvg 离线生成；字体为本地 Noto Sans CJK SC（仅构建时使用，不随站点发布），许可证见 `assets/fonts/OFL.txt`。

RSS：`/rss.xml`、`/en/rss.xml`。站点地图：`/sitemap-index.xml`。AI 索引：`/llms.txt`。

## 部署

Cloudflare Workers static assets，配置见 `wrangler.jsonc`。自定义域名 `blog.asaki.qzz.io`。

```sh
npx wrangler login
npm run deploy
```

本仓库不包含部署凭证。部署前确认 Cloudflare 账号及域名归属。

## 致谢与许可

视觉与部分样式依据 [Tw93 的 cosy-jekyll-theme](https://github.com/tw93/tw93.github.io)，保留其 MIT 许可及版权声明于 `LICENSE`。参考源码的 `_layouts`、`_sass` 和 `css/jinkai.css`。

字体沿用 Tw93 的国内友好方案：仓耳今楷 `TsangerJinKai02` 按 Unicode 子集从 `gw.alipayobjects.com` 加载，回退到 `STKaiti`、`KaiTi` 与系统字体，不依赖 Google Fonts。`jinkai.css` 来源于上游，未将仓耳字体文件重新分发。

本站保留米白背景、白色阅读面、900px 桌面列宽、8px 圆角、17px 正文和楷体；首页使用按年标题列表，没有复制 Tw93 的标语横幅、烟花、赞赏、订阅或个人内容。暗色模式跟随系统。
