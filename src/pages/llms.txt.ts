import { allPosts, postUrl, seriesUrl, SERIES } from '../lib/posts';
export async function GET() {
  const posts = await allPosts();
  return new Response(['# Asaki', '', '## Series', ...SERIES.map(name => `- [${name}](https://blog.asaki.qzz.io${seriesUrl(name)})`), '', '## Posts', ...posts.map(p => `- [${p.data.title}](https://blog.asaki.qzz.io${postUrl(p)}): ${p.data.description}`), ''].join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
