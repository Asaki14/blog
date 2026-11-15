---
title: "Yazi：好用的终端文件管理器"
date: 2026-11-15
description: "把文件查找与整理放进终端：Yazi 的文件管理、工具特色、快捷键与我的配置。"
tags:
  - 终端
  - Yazi
series: Dotfiles
---

分享一个很好用的终端文件管理器，我是一个很喜欢 TUI（文本用户交互界面）、对文件管理有强迫症的人。把文件列表、预览和操作都放在终端里，一眼看全文件分布，是我的刚需。

于是我主动去找终端文件管理器。当时看过一些 B 站视频、小红书推荐帖，还有 AI 的推荐，[Yazi](https://github.com/sxyazi/yazi) 的风评最好。自己试了之后，确实觉得很好用，就一直用到现在。

![真实桌面操作与中文配音：目录导航、多选、预览、编辑及退出切换目录](/media/yazi/yazi-zh.mp4)

## 翻目录时，知道自己在哪

Yazi 用的是 Vim 键位，也就是沿用 Vim 文本编辑器的一套键盘操作习惯：`h` 返回上一级目录，`j`、`k` 上下移动，`l` 进入目录。手放在字母区就能翻目录，不用来回点文件夹，如果不习惯也支持直接鼠标点击。

习惯之后，我觉得它比访达直观很多，电脑里的目录怎么分布、文件放在哪里，都能看得很清楚也能很快地进行操作。

![Yazi 中的目录与文件列表](/media/yazi/yazi-directory.png)

有次用 Agent 时，我发现它出现了不该有的 Skill，也就是给 Agent 按需调用的操作指南。我去 Yazi 里一翻，很快发现是 Claude Code 的 Skill 没删干净，其他 Agent 也受到了影响。找到残留文件，直接删掉就解决了。整个过程顺应直觉，丝滑快速。

另一个常用操作是把多个文件复制、剪切或建立软链接到另一个目录。在访达里，我需要来回点击文件并切换目录。在 Yazi 里，空格选中需要的文件，按 `y` 复制或 `x` 剪切，再用 `hjkl` 移到目标目录，按 `p` 就完成了。用惯这套键位后，我觉得直观、快捷很多。

![在真实 Yazi 中用空格选中 fish、nvim、tern 和 yazi 四个目录](/media/yazi/yazi-selection.png)

## 找到项目目录，退出就能开工

同时管理多个项目时，还有一个我觉得很方便的用法：在 Yazi 里找到目标目录，按 `q` 退出，终端就停在这个目录里。这时打开 AI Agent，就可以直接开始工作了。

我用 `y` 命令启动 Yazi。它是我在 fish 里配置的函数。这个函数会读取 Yazi 退出时所在的目录，再让 Shell 切过去。

所以，退出后切换目录需要这层 Shell 配置，不是直接运行 `yazi` 就自动有。对应函数在 [fish 配置](https://github.com/Asaki14/dotfiles/blob/main/modules/fish/home/.config/fish/config.fish)里，单独安装 Yazi 的话，也需要补上适合自己 Shell 的配置。

![按 q 退出 Yazi 后，终端已切到 dotfiles/modules/yazi 目录](/media/yazi/yazi-cwd.png)

## 文件列表旁边就是预览

我的界面分成三栏，比例是 2:2:4，右侧预览占一半。文件按名称排序，文件夹放在前面，隐藏文件也显示出来，图片预览最大 1024 × 1024。

![在右侧预览 yazi.toml，直接看到三栏比例与隐藏文件设置](/media/yazi/yazi-preview.png)

## 打开文件、复制路径和压缩

我加了几组按键：

| 按键 | 当前配置的动作 |
|---|---|
| `Enter` | 通过 smart-enter 插件进入目录或打开文件 |
| `e` | 按打开规则处理光标所在项，文本、JSON 和目录默认用 Neovim 打开 |
| `c p` | 复制所选项的绝对路径到 macOS 剪贴板 |
| `c a` | 通过 compress 插件压缩选中项 |

Neovim 是终端里的文本编辑器，启动命令是 `nvim`。在 Yazi 里找到目标文本文件，按 `e` 就能进入编辑。文件管理器和编辑器无缝接在一起，体验很丝滑。这套打开规则不是把所有格式都交给 Neovim，其他文件仍走对应的打开方式。

![从 Yazi 按 e 打开同一份 yazi.toml，进入真实 Neovim 编辑界面](/media/yazi/yazi-edit.png)

## 配置可以单独取用

配置放在 [Asaki14/dotfiles 的 Yazi 模块](https://github.com/Asaki14/dotfiles/tree/main/modules/yazi)。这套配置用于 macOS，安装器通过 Homebrew 装依赖，需要先装好 Homebrew。先克隆仓库并进入目录：

```sh
git clone https://github.com/Asaki14/dotfiles.git
cd dotfiles
```

在仓库根目录先预览安装动作：

```sh
./install.sh --modules yazi --dry-run
```

确认后再运行：

```sh
./install.sh --modules yazi
```

安装器会安装 Yazi 及预览、搜索用到的工具，并添加 smart-enter 与 compress 插件。已有冲突文件会移到备份目录，之后逐个建立软链，仓库目录需要保留。

这份配置的文本编辑依赖 Neovim，配色引用 omacosy 生成的主题，omacosy 是同一仓库里的主题模块。如果只想取用 Yazi，可以改掉对应的打开方式，并在 `theme.toml` 里换成其他配色，不必为了文件管理照搬整套桌面。

推荐让你的 AI Agent 来帮你配置，不到1分钟就可以搞定。
