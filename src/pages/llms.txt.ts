import { allPosts, postUrl } from '../lib/posts';
export async function GET() {
  const posts = await allPosts();
  return new Response(['# Asaki', '', '## Pages', '- [About](https://blog.asaki.qzz.io/about/)', '- [Series](https://blog.asaki.qzz.io/series/)', '', '## Posts', ...posts.map(p => `- [${p.data.title}](https://blog.asaki.qzz.io${postUrl(p)}): ${p.data.description}`), ''].join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
