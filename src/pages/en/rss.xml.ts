import rss from '@astrojs/rss';
import { postsFor, postUrl } from '../../lib/posts';
export async function GET(context: { site: URL }) {
  return rss({ title: 'Asaki in English', description: 'Asaki’s blog', site: context.site, items: (await postsFor('en')).map(p => ({ title: p.data.title, pubDate: p.data.date, description: p.data.description, link: postUrl(p), categories: p.data.tags })), customData: '<language>en</language>' });
}
