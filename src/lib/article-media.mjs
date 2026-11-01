import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

// Media roots checked in order: published assets, then local draft assets.
const roots = ['../../public/', '../../drafts-media/'].map((path) => fileURLToPath(new URL(path, import.meta.url)));
// MP4 audio tracks carry an `hdlr` box with handler type `soun`; WebM audio tracks name an `A_*` codec.
const audioMarker = { mp4: /hdlr[\s\S]{8}soun/, webm: /A_(?:OPUS|VORBIS|AAC)/ };

function hasAudio(source) {
  const match = /^\/media\/(.+\.(mp4|webm))(?:[?#].*)?$/i.exec(source);
  if (!match) return false;
  for (const root of roots) {
    const path = root + (root.endsWith('drafts-media/') ? match[1] : `media/${match[1]}`);
    try {
      return audioMarker[match[2].toLowerCase()].test(readFileSync(path).toString('latin1'));
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
    }
  }
  return false;
}

// Turn Markdown image syntax pointing to a video into a player.
// Silent clips autoplay muted in a loop like a GIF; videos with sound wait for the reader to press play.
export function articleMedia() {
  return (tree) => {
    function visit(node) {
      if (node.type === 'element' && node.tagName === 'img') {
        const source = String(node.properties?.src ?? '');
        if (/\.(mp4|webm)(?:[?#].*)?$/i.test(source)) {
          node.tagName = 'video';
          node.properties = { src: source, controls: true, playsInline: true, preload: 'metadata', 'aria-label': node.properties.alt || 'Video' };
        }
      }
      if (node.type === 'element' && node.tagName === 'video' && !hasAudio(String(node.properties?.src ?? ''))) {
        Object.assign(node.properties, { autoplay: true, loop: true, muted: true, playsInline: true });
      }
      node.children?.forEach(visit);
    }
    visit(tree);
  };
}
