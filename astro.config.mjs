import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { unified } from '@astrojs/markdown-remark';
import { articleMedia } from './src/lib/article-media.mjs';

export default defineConfig({
  site: 'https://blog.asaki.qzz.io',
  trailingSlash: 'always',
  integrations: [sitemap()],
  markdown: {
    shikiConfig: { themes: { light: 'github-dark', dark: 'github-dark' } },
    processor: unified({ rehypePlugins: [articleMedia] }),
  },
});
