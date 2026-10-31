import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { unified } from '@astrojs/markdown-remark';
import { articleMedia } from './src/lib/article-media.mjs';
import { cp, mkdir, readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import { draftEditor } from './src/lib/draft-editor.mjs';

const showDrafts = process.env.SHOW_DRAFTS === '1';

export default defineConfig({
  site: 'https://blog.asaki.qzz.io',
  trailingSlash: 'always',
  outDir: showDrafts ? './dist-drafts' : './dist',
  server: { host: '127.0.0.1' },
  integrations: [
    sitemap(),
    ...(showDrafts ? [{
      name: 'draft-media',
      hooks: {
        // Dev server: serve /media/<slug>/... from drafts-media when public/ has no such file.
        'astro:server:setup': ({ server }) => {
          server.middlewares.use(draftEditor(fileURLToPath(new URL('.', import.meta.url))));
          const root = fileURLToPath(new URL('./drafts-media/', import.meta.url));
          const types = { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.gif': 'image/gif', '.svg': 'image/svg+xml', '.mp4': 'video/mp4', '.webm': 'video/webm' };
          server.middlewares.use('/media/', async (req, res, next) => {
            const relative = normalize(decodeURIComponent((req.url ?? '').split('?')[0])).replace(/^([/\\])+/, '');
            if (relative.startsWith('..')) return next();
            try {
              const body = await readFile(join(root, relative));
              res.setHeader('Content-Type', types[extname(relative).toLowerCase()] ?? 'application/octet-stream');
              res.end(body);
            } catch {
              next();
            }
          });
        },
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
