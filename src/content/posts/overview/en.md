---
title: "Making My Mac Feel Right: My Desktop, Terminal, and AI Agent Setup"
date: 2026-10-30
description: "I started with someone else's dotfiles and gradually connected my desktop, terminal, AI agents, browser, and notes. This is how my Mac setup evolved. If you happen to like it, there's an installer that lets you pick the parts you want."
tags: [Desktop, Terminal, AI]
series: Dotfiles
---

In February 2026, I starred [xrce/dots](https://github.com/xrce/dots). I was blown away. It felt like someone had opened a door (that really was how it felt): wait, you can do this with a computer? So cool! It introduced me to [sketchybar](https://github.com/FelixKratz/SketchyBar), a fully customizable status bar that looked great and let me make it my own. The setup also brought over the author's kitty configuration (a nice terminal) and Neovim configuration (a nice terminal-based code editor). That was another door, into the terminal world. It's where I fell in love with TUIs, terminal user interfaces, as opposed to GUIs, graphical user interfaces. Then came the long journey of fixing icons, adjusting spacing, switching approaches and terminals, and trying agents. Bit by bit, the setup became what felt best to me.

Of course, at first a few things just looked slightly off. I only wanted to tweak a couple of details. Then it got out of hand. Like those first attempts at vibe coding, the instant feedback is almost too good: change something, restart, and it looks different right away. It's addictive! So I kept tinkering.

I've now collected it all in [Asaki14/dotfiles](https://github.com/Asaki14/dotfiles). If you'd also like your Mac to feel more natural to use, maybe my setup can give you a few ideas. I'd love to be your Xrce (the spirit of open source? Okay, maybe I'm getting carried away). This post covers the whole picture and how it evolved. Individual tools can wait for their own posts.

![Making my Mac feel right: a 193-second story with real tool demonstrations and English captions](/media/overview/story-en-16x9.mp4)

## Get it working, then make it mine

The configuration I borrowed didn't fit my environment everywhere. For example, sketchybar looked up icons using each app's display name. When Chinese and English names didn't match, it fell back to a default icon. The battery, volume, and Wi-Fi click actions in the status bar were mixed up too. I fixed those by hand, one at a time. Now that we have AI, it's so much easier. Put that wish-granting machine to work.

One thing I wrote down at the time: understand it first, then change it. AI can explain source files and suggest changes, but it doesn't read the official docs for me or decide which changes suit me. Fixing these small problems was also how I gradually learned how the setup worked. Just like AI coding, the hardest part has never been the execution. It's knowing what I actually want and explaining it clearly to AI. That sounds easy, but knowing and describing it clearly takes practice.

Then came my own preferences: align the spacing around windows and the status bar, choose a terminal font I like, and make all the other tools follow when the theme changes. When I moved to [omacosy](https://github.com/paulsp94/omacosy) in August, I didn't throw away all those earlier rounds of changes. I carried the important customizations over. Tools may change, but what you've built up stays with you.

For me, comfort isn't only about looks. Text needs to be readable, tasks should stay together, and shortcuts and tools should work naturally with each other. Some of that is visual preference. Some comes from the daily feeling of switching windows and finding tasks. So, as I said earlier, figuring out what I want is a long process.

## Four threads, gradually coming together


### Desktop and terminal: from arranging windows to keeping tasks together

For window management, I first moved from [LOOP](https://github.com/mrkai77/Loop) to [yabai](https://github.com/asmvik/yabai). I loved yabai when I first tried it. Shortcuts switched between three modes for different situations. There wasn't much wrong with yabai itself, but I mostly used one mode day to day. And on a small Mac screen, two apps each taking half the space looked cool but weren't kind to my eyes. Switching was a bit cumbersome too, and it required disabling SIP, System Integrity Protection. I later moved to [Paneru](https://github.com/karinushka/paneru), mainly for its Hyprland-like horizontal tiling and virtual workspaces. Windows lined up horizontally on the same desktop, and I could jump to a specific workspace with a shortcut instead of repeatedly switching desktops to find an app. I had four categories: miscellaneous, work, terminal, and browser. I used that for quite a while.

But Paneru occasionally needed restarting, and several times its processes got into a muddle, possibly because it didn't get along with another tool. I also gradually realized that I preferred apps taking up as much of the available screen as possible. Easier to read. I'm getting old, apparently, just like how I usually soak my feet before bed (a friend asked if I'm middle-aged already). After bringing in [omacosy](https://github.com/paulsp94/omacosy), I found that [AeroSpace](https://github.com/nikitabobko/AeroSpace)'s workspaces were enough for me. It was stable, and there were presets ready to use, so I moved over while I was at it.

I didn't settle on a terminal in one go either. Warp's completions and file sidebar were handy, but I ran into crashes and couldn't use its AI features because of regional restrictions. Luckily I hadn't enabled them; they weren't quite what I needed anyway. I switched to kitty and Neovim, then tried Ghostty and cmux. I remember having six Ghostty windows open at once, running coding agents and [yazi](https://github.com/sxyazi/yazi). With that many open, the computer got hot and sluggish. If Paneru crashed, I'd have to rearrange five or six windows. Then one day, browsing GitHub Trending, I found [Herdr](https://github.com/herdrdev/herdr), which only had a few thousand stars at the time. It could keep multiple terminal tasks in one workspace, with special support for agents too. I liked it immediately. Its star count is now dozens of times what it was when I found it.

Later, I brought file management with Yazi and task management with dooit into the terminal too. Music runs through rmpc and MPD. In October, I also started trying Tern so I could use a GUI alongside agent work. These tools changed more than appearances. They changed where I keep tasks and how I switch between them. It feels very comfortable now, which is why I keep iterating.

### AI and workflow: the tools change, and so does how I work

I started with OpenCode and GitHub Copilot, then tried Claude Code, Codex, and other tools. For workflows, I also tried Everything Claude Code, Superpowers, and GSD. What drew me to Pi was its lighter context and the ability to build extensions for what I needed.

In July, I gradually settled into a process of asking more questions first, then setting up the project, executing, and reviewing. I also started using [firstmate](https://github.com/kunchenguid/firstmate) to isolate tasks in separate Git worktrees, independent working directories, while only talking to one main agent. In September, I moved to omp for its model integrations, plentiful configuration presets, and account rotation. By October, I had fewer parallel tasks, and cache reuse across new sessions wasn't paying off. So I paused firstmate's task dispatching while keeping its memory and project management.

I'll give this thread its own post: which rules are worth keeping long-term, which skills make sense to load on demand, and how I handle memory and context handoffs.

### Browser: tab management and reading are everyday things

My browser path went Zen → Firefox → back to Zen. I first moved to Firefox for its extension ecosystem, then returned to Zen for tab management. I tried Tabbit too, but ran into lag and crashes, so I didn't stick with it.

In Zen, I use [Nebula](https://github.com/JustAdumbPrsn/Zen-Nebula) and [Zen Internet](https://github.com/sameerasw/my-internet) to adjust transparency, [Darkreader](https://github.com/darkreader/darkreader) to improve reading contrast, and Vimium for keyboard navigation. Browser agents have been another thread of experiments. I later moved from operating the user's Chrome session to ego lite. Transparent pages, vertical tabs, and automation each come with trade-offs. I'll get into those in the browser post.

### Notes: from writing an article to adding a thought whenever it comes

I moved from Obsidian to Logseq. I found that I really like journal-style notes: write something down as soon as it comes to mind, then use tags to bring related material together. I don't have to decide which note it belongs in before writing it. Logseq fits that perfectly.

After that, I set up self-hosted sync and wrote a couple of plugins I find useful, [logseq-db-banner](https://github.com/Asaki14/logseq-db-banner) and [logseq-journal-time-prefix](https://github.com/Asaki14/logseq-journal-time-prefix). Both are open source. I won't get into plugins and sync configuration here. The notes post will cover why this way of writing suits me and which missing pieces were worth building myself.

## Wallpaper is part of the theme, but readability comes first

Trying [Omarchy](https://github.com/omacom/omarchy) in August gave me a lot of inspiration. I wrote in my notes at the time: "My wallpaper is my theme." Transparent interfaces make it easier for the status bar, terminal, and background to blend together. A different wallpaper changes the feel of the whole desktop. A setup that looks this cohesive and makes changes this convenient is very much my thing.

But more transparency isn't always better. Increasing terminal opacity is necessary. Readability comes first; there's no point getting that backwards. Later, I separated the pieces more carefully: appearance comes from the font, theme, and background, while readability depends on opacity and text contrast. Even when the background is clearly visible, the text still needs to stand out from it.

Other changes are tiny but affect how everything feels all day. The status bar's rounded corners follow the Mac's physical corners. The first and last icons sit the same distance from the edges. The space around windows lines up with the status bar. The workspace highlight changed from a solid fill to an outline. Those details are closer to what I was working on than simply swapping in a pretty icon.

omacosy made theme changes work across tools: the status bar, wallpaper, Ghostty, and borders switch together. Later, more terminal tools joined in. Appearance stopped being a matter of choosing a separate color scheme in every app.

## The configuration is open source, and you can install just part of it

The repository is [Asaki14/dotfiles](https://github.com/Asaki14/dotfiles). These dotfiles, configuration files that store each tool's preferences, are organized into modules by tool. They include desktop themes, terminal tools, and agent-related configuration.


Run `./install.sh` without arguments for interactive selection. You can pick only the modules you need or use `--all` to install everything. Conflicting files are first moved into a corresponding backup directory under `~/.dotfiles-backup/`, then links are created. You need to keep the repository directory around.

Before installing, read the repository's [installation notes](https://github.com/Asaki14/dotfiles/blob/main/README.md#before-installing). omacosy changes system settings, loads background services, and sets your wallpaper. File backups cannot restore those system settings. The agent configuration includes permission-bypass settings, which you need to change to match your own approval requirements. Preview commands don't actually install anything.

Still, I'd suggest asking your agent to read the repository and help you install it. It lives on your computer, after all, so it knows your machine best. Besides, AI generally doesn't make mistakes with this sort of thing. Humans do. Don't ask me how I know.

Thanks to xrce/dots for the starting point. The omacosy setup I ended up with is based on paulsp94/omacosy, and the public configuration keeps the upstream licenses and credits.

## Next, one tool at a time

I'll write about my desktop and terminal setup, interspersed with AI agents and workflows, whenever I get around to it. The browser and notes may get a post each too, with the actual trade-offs, configuration, and demos.

If you spot a configuration you like, you can pick a module from my repository. If you're more interested in why I switched tools, this series will cover what stayed and what I gave up, hopefully saving you a few wrong turns.

If you've made it through all this rambling, I'll assume we're the same kind of beauty-chasing, compulsive tinkerers.

Here's to us, my friend.

2026/10/31
