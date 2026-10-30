import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { unified } from '@astrojs/markdown-remark';
import { articleMedia } from './src/lib/article-media.mjs';
import { cp, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const showDrafts = process.env.SHOW_DRAFTS === '1';

export default defineConfig({
  site: 'https://blog.asaki.qzz.io',
  trailingSlash: 'always',
  outDir: showDrafts ? './dist-drafts' : './dist',
  integrations: [
    sitemap(),
    ...(showDrafts ? [{
      name: 'draft-media',
      hooks: {
        'astro:build:done': async ({ dir }) => {
          const source = fileURLToPath(new URL('./drafts-media/', import.meta.url));
          await mkdir(source, { recursive: true });
          await cp(source, new URL('./media/', dir), { recursive: true });
        },
      },
    }] : []),
  ],
  markdown: {
    shikiConfig: { themes: { light: 'github-dark', dark: 'github-dark' } },
    processor: unified({ rehypePlugins: [articleMedia] }),
  },
});
