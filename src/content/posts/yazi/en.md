---
title: "Yazi: A Handy Terminal File Manager"
date: 2026-11-15
description: "Finding and organizing files in the terminal: how I use Yazi, its shortcuts, and my configuration."
tags:
  - Terminal
  - Yazi
series: Dotfiles
---

Here's a terminal file manager I've found useful. I'm a big fan of TUIs (text-based user interfaces), and I'm particular about organizing files. Having the file list, previews, and operations together, with the directory structure visible at a glance, is something I need.

So I went looking for a terminal file manager. Among the Bilibili videos, Xiaohongshu posts, and AI recommendations I came across, [Yazi](https://github.com/sxyazi/yazi) had the best reputation. I tried it, liked it, and have been using it ever since.

![A real desktop walkthrough with Chinese narration: navigation, selection, previews, editing, and returning to the shell](/media/yazi/yazi-zh.mp4)

## Know where you are while browsing directories

Yazi uses Vim-style keys, a set of keyboard controls borrowed from the Vim text editor: `h` goes to the parent directory, `j` and `k` move down and up, and `l` enters a directory. I can browse without moving my hands away from the letter keys or clicking through folders. Mouse clicks work too.

Once I got used to it, I found it much more intuitive than Finder. I can see how my directories are organized, find files, and act on them quickly.

![Directories and file lists in my real Yazi setup](/media/yazi/yazi-directory.png)

Once, an Agent picked up a Skill that shouldn't have been there. Skills are instructions an Agent can load when needed. I browsed through Yazi and quickly found some Claude Code Skills that hadn't been fully removed and were affecting other Agents. Deleting the leftover files fixed it. The whole process felt intuitive, smooth, and quick.

Another common task is copying, moving, or creating symlinks for several files in another directory. In Finder, I'd click through files and switch between directories. In Yazi, I select files with Space, press `y` to copy or `x` to cut, use `hjkl` to reach the destination, then press `p`. Once I got used to these keys, it felt much more direct and convenient.

![Selecting the fish, nvim, tern, and yazi directories with Space](/media/yazi/yazi-selection.png)

## Find the project directory, quit, and get to work

When I'm working on several projects, there's another convenient use: find the target directory in Yazi, press `q` to quit, and the terminal is already in that directory. I can then start an AI Agent and get straight to work.

I launch Yazi with `y`, a function I've configured in fish. It reads the directory Yazi was in when it exited, then changes the shell to that directory.

This needs shell integration; running `yazi` directly doesn't automatically change the parent shell's directory. The function is in my [fish configuration](https://github.com/Asaki14/dotfiles/blob/main/modules/fish/home/.config/fish/config.fish). If you install Yazi on its own, you'll also need the corresponding setup for your shell.

![After quitting Yazi with q, the shell is in dotfiles/modules/yazi](/media/yazi/yazi-cwd.png)

## Preview files beside the file list

My layout has three columns in a 2:2:4 ratio, with the right-hand preview taking up half the space. Files are sorted alphabetically, directories come first, and hidden files are shown. Image previews are limited to 1024 by 1024.

![Previewing yazi.toml on the right, including the column ratio and hidden-file setting](/media/yazi/yazi-preview.png)

## Open files, copy paths, and compress selections

I've added a few key bindings:

| Key | Action in my configuration |
|---|---|
| `Enter` | Enter a directory or open a file through the smart-enter plugin |
| `e` | Apply the opening rules to the hovered item; text files, JSON, and directories open in Neovim by default |
| `c p` | Copy the selected paths to the macOS clipboard |
| `c a` | Compress selected items through the compress plugin |

Neovim is a text editor that runs in the terminal; its launch command is `nvim`. Once I find a text file in Yazi, pressing `e` takes me straight into editing. The file manager and editor fit together smoothly. These rules don't send every file format to Neovim; other files use their corresponding openers.

![Pressing e in Yazi opens the same yazi.toml file in Neovim](/media/yazi/yazi-edit.png)

## Take just the configuration you need

The configuration is in the [Yazi module of Asaki14/dotfiles](https://github.com/Asaki14/dotfiles/tree/main/modules/yazi). This setup is for macOS, and the installer uses Homebrew for dependencies, so Homebrew needs to be installed first. Clone the repository and enter it:

```sh
git clone https://github.com/Asaki14/dotfiles.git
cd dotfiles
```

Preview the installation from the repository root:

```sh
./install.sh --modules yazi --dry-run
```

Then run it when you're ready:

```sh
./install.sh --modules yazi
```

The installer installs Yazi and the tools used for previews and searching, then adds the smart-enter and compress plugins. Existing conflicting files are moved to a backup directory before symlinks are created. Keep the repository directory in place.

Text editing in this configuration depends on Neovim. The colors reference a theme generated by omacosy, the theme module in the same repository. If you only want Yazi, you can change the opener and choose another color scheme in `theme.toml`; there's no need to adopt the entire desktop setup.

I'd recommend asking your AI Agent to help with the setup. It can be done in under a minute.
