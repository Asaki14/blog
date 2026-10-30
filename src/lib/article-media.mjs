// Turn Markdown image syntax pointing to a video into a silent looping player.
export function articleMedia() {
  return (tree) => {
    function visit(node) {
      if (node.type === 'element' && node.tagName === 'img') {
        const source = String(node.properties?.src ?? '');
        if (/\.(mp4|webm)(?:[?#].*)?$/i.test(source)) {
          node.tagName = 'video';
          node.properties = { src: source, autoplay: true, loop: true, muted: true, playsInline: true, controls: true, preload: 'metadata', 'aria-label': node.properties.alt || 'Video' };
        }
      }
      if (node.type === 'element' && node.tagName === 'video') {
        Object.assign(node.properties, { autoplay: true, loop: true, muted: true, playsInline: true });
      }
      node.children?.forEach(visit);
    }
    visit(tree);
  };
}
