// Miaoyan accepts a standalone $$...$$ line without blank lines around it.
// Keep that display layout while leaving the article's Markdown unchanged.
export function articleMath() {
  return (tree, file) => {
    const source = String(file.value);
    function visit(node) {
      if (node.type === 'inlineMath' && node.position) {
        const { start, end } = node.position;
        const raw = source.slice(start.offset, end.offset);
        const before = source.slice(source.lastIndexOf('\n', start.offset - 1) + 1, start.offset);
        const nextLine = source.indexOf('\n', end.offset);
        const after = source.slice(end.offset, nextLine === -1 ? source.length : nextLine);
        if (raw.startsWith('$$') && raw.endsWith('$$') && !before.trim() && !after.trim()) {
          node.data.hProperties.className = ['language-math', 'math-display'];
        }
      }
      node.children?.forEach(visit);
    }
    visit(tree);
  };
}
