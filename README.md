# Asaki

Astro 静态博客。使用 npm，`package-lock.json` 固定依赖。运行依赖：`astro@7.4.4`、`@astrojs/markdown-remark@7.3.5`、`@astrojs/rss@4.0.19`、`@astrojs/sitemap@3.7.4`、`satori@0.63.2`、`@resvg/resvg-js@2.6.2`、`twikoo@2.0.17`；开发依赖 `wrangler@4.156.0`。

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
2. 如有英文译文，在同一目录创建 `en.md`。两篇的 slug 相同；只有译文存在时显示语言切换。只需进入英文列表时，`en.md` 可只改 frontmatter 的标题、简介和标签，正文沿用中文。
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

中文路由 `/posts/<slug>/`，英文 `/en/posts/<slug>/`。`series` 由 `src/lib/series.ts` 定义，目前为 `Dotfiles`、`Agent`、`观后`；顶栏直接链到 `/series/<name>/` 与 `/en/series/<name>/`，没有文章时显示空状态。首页按年份分组，空内容正常显示。
系列的中英文显示名由同文件的 `seriesTitle` 提供；中文依次为「配置」「AI」「观后」，英文依次为 `Dotfiles`、`Agent`、`Reviews`。导航、系列页标题和文章元信息随页面语言切换，系列标识及 URL 不随显示名变化。观后系列文章的 `title` 只写 `《作品名字》`，正文保留作者成品排版。

顶栏右侧提供小红书、GitHub、X、Threads 的主页图标，链接与内联品牌图标集中在 `src/components/SocialLinks.astro`，不加载外部图标脚本。窄屏导航分两行；图标保留平台名称提示和键盘焦点，颜色跟随明暗主题。

- 代码块：使用带语言的 Markdown fenced code，构建时由 Shiki 高亮。
- 公式：支持 `$...$` 与 `$$...$$`，使用 KaTeX 渲染；独占一行的 `$$...$$` 保持居中显示，即使前后没有空行。
- 流程图：`mermaid` 围栏代码在文章页渲染为图；只有页面含图时才加载 Mermaid。
- 图片：`![图片说明](/media/my-post/image.webp)`，点击或键盘激活可放大，Esc 关闭。
- 视频：`![视频说明](/media/my-post/demo.mp4)`，也支持 webm，行内播放并保留控制器。无音轨的视频自动循环、静音播放，系统减少动态效果时停止自动播放；有音轨的视频等读者点击播放。
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

## 评论

正式文章使用 Twikoo `2.0.17`，客户端随站点发布，不依赖外部脚本 CDN。中英文共用 `/posts/<slug>/` 评论串；`SHOW_DRAFTS=1` 不渲染评论。普通开发默认关闭评论，可用 `PUBLIC_TWIKOO_ENV_ID` 显式指定测试后端。

| 配置 | 值 |
|---|---|
| 后端 | Worker `asaki-blog-comments`，`https://comments.asaki.qzz.io` |
| 数据库 | D1 `asaki-blog-comments`，绑定 `DB` |
| 访客 | 免登录；单行输入框随内容增高，无预览，表情关闭（`SHOW_EMOTION=false`）；点击发送后填写昵称，邮箱选填且不公开；取消或发送失败保留正文 |
| 审核 | `AKISMET_KEY` 留空，评论直接公开 |
| 限流 | Twikoo 单 IP 阈值 5、全站阈值 30，窗口 10 分钟 |
| 管理密码 | macOS 钥匙串，服务名 `asaki-blog-twikoo`，账号 `Asaki14` |

在评论区点击齿轮进入管理面板，审核、回复和修改配置。读取本机管理密码：`security find-generic-password -s asaki-blog-twikoo -a Asaki14 -w`。密码不得写入仓库；后端在首次公开前已设置管理密码。

客户端和后端由 `comments/build.mjs` 从固定提交 `da949ad0952cf5d2b05e2777803aae3aa615ffbb` 构建，使用上游锁文件。需要 Node.js 26、pnpm、Git 和 curl；已使用 pnpm `10.33.0` 构建。客户端应用 `comments/client.patch`，实现单行起始的输入框和发送时原位填写身份；公开与草稿的开发、构建命令自动生成客户端，补丁和构建脚本未变化时复用本地产物。客户端产物在忽略的 `comments/client/dist/`，后端产物在 `comments/dist/`。升级时更新构建脚本中的版本与源码提交，重新核对补丁，再执行：

```sh
npm run deploy:comments
npm run deploy
```

`comments/deploy.mjs` 先由 Wrangler 打包，再用 curl 上传并绑定域名，避免慢速上行触发 Wrangler 的响应头超时。后台配置保存在 D1，重新部署不清空评论或配置。备份数据库：`npx wrangler d1 export asaki-blog-comments --remote --config comments/wrangler.jsonc --output /tmp/asaki-blog-comments.sql`。导出含邮箱、IP 和密码校验值，应移至私密备份位置，不提交仓库。

邮件通知尚未配置；如需启用，在管理面板配置 Resend 等 HTTP 邮件通道。该 Workers 适配器不支持直连 SMTP、Akismet 或腾讯云内容审核。访客 IP 由后端记录。

## 致谢与许可

视觉与部分样式依据 [Tw93 的 cosy-jekyll-theme](https://github.com/tw93/tw93.github.io)，保留其 MIT 许可及版权声明于 `LICENSE`。参考源码的 `_layouts`、`_sass` 和 `css/jinkai.css`。

评论使用 [Twikoo](https://github.com/twikoojs/twikoo)，客户端保留上游版权与 MIT 许可声明；站点的身份输入交互补丁位于 `comments/client.patch`。

小红书顶栏图标基于[官方 App Store 应用](https://apps.apple.com/cn/app/id741292507)图标生成透明遮罩 `public/icons/xiaohongshu-mask.png`；通过 `currentColor` 与其他图标共用默认、悬停及明暗主题颜色。

字体沿用 Tw93 的国内友好方案：仓耳今楷 `TsangerJinKai02` 按 Unicode 子集从 `gw.alipayobjects.com` 加载，回退到 `STKaiti`、`KaiTi` 与系统字体，不依赖 Google Fonts。`jinkai.css` 来源于上游，未将仓耳字体文件重新分发。

本站保留米白背景、白色阅读面、900px 桌面列宽、8px 圆角、17px 正文和楷体；首页使用按年标题列表，没有复制 Tw93 的标语横幅、烟花、赞赏、订阅或个人内容。明暗主题默认跟随系统；顶栏按钮切换后存入 `localStorage` 的 `theme`，此后不再跟随系统。
