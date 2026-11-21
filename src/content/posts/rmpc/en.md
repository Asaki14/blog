---
title: "rmpc: No Ads, No Subscriptions, Unlimited Music in the Terminal"
date: 2026-11-21
description: "Fed up with ads and stacked subscription tiers in music apps, I moved my listening into the terminal: rmpc's interface, how I use it, and my configuration."
tags:
  - Terminal
  - rmpc
series: Dotfiles
---

Here's a terminal music player that looks great: [rmpc](https://github.com/mierak/rmpc). I moved my listening from Spotify into the terminal. One tab is the whole player, and the first thing I noticed was simple: no more ads.

I tried other options before switching. Apple Music is paid and sounds great, but its catalog has gaps. QQ Music and NetEase Cloud Music are the mainstream apps in China, but above VIP there's SVIP, and above SVIP you still pay per song, which is just ridiculous. So, like when I found Yazi, I went looking for a terminal player. I checked Bilibili, Xiaohongshu, and AI recommendations, and rmpc was the one I liked best. Now it's the only thing I use for music.

![A real desktop walkthrough: switching pages, searching for a song, where the lyric sits in each of five menu bar layouts, and theme syncing](/media/rmpc/rmpc-zh.mp4)

## Gorgeous, with a layout you can change

My main page has the play queue on the left and a square album cover on the right, with a spectrum visualizer moving to the music below the cover. The layout is fully customizable: what goes where and how much space it takes are all set in the configuration.

When I switch desktop themes, the player's colors change along with it. Nothing to adjust separately.

## Learn it in a minute

rmpc has only four pages: queue, artists, playlists, and search. Press `1` to `4` to switch between them. You can pick it up in a minute.

It uses Vim keys, the keyboard habits of the Vim text editor: `j` and `k` move up and down, `/` searches, Space selects multiple items, `p` pauses, and `<` and `>` go to the previous and next track. The same keys work in Yazi and dooit, which I also use, so switching tools doesn't mean switching muscle memory.

Day to day, it sits in one terminal tab. When I want a break, I just switch to it.

## Want a song? One sentence to an Agent

rmpc plays a local library, so there's plenty to listen to: anything available online can go into a playlist. There's no song I can't find.

I hand both finding and importing music to an AI Agent. One sentence and it's done. It's fast and cheap; a task this simple only needs a small model.

## Lyrics in the menu bar

Lyrics for the current song scroll line by line in the menu bar I configured, so I can see them even when I switch to another window.

rmpc can also play radio: no specific tracks, just 24-hour streams, so skipping a song means switching stations. I used it for a while and don't anymore, but it's there if you want it.

## Take only what you need

rmpc is only the interface. The music is played by MPD (Music Player Daemon, a background music service) running behind it, so closing rmpc doesn't stop the song. The configuration lives in the `rmpc/`, `mpd/`, and `beets/` directories of [Asaki14/dotfiles](https://github.com/Asaki14/dotfiles). It targets macOS and needs Homebrew. Clone the repository first:

```sh
git clone https://github.com/Asaki14/dotfiles.git
cd dotfiles
```

Preview what the installer will do, then run it again without `--dry-run`:

```sh
./install.sh --modules rmpc,mpd,beets --dry-run
```

The library lives in `~/Music/lib` by default. The repository's fish module includes a `ytm` command an Agent can use to add songs: it downloads audio and cover art with yt-dlp, then hands the file to beets (a music tagging tool) to tag it and move it into the library. Menu bar lyrics and theme syncing depend on omacosy, the desktop module in the same repository. If you only want the player, you can skip it.

I'd recommend asking your AI Agent to help with the setup.
