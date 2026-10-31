import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { SERIES } from './lib/series';

const posts = defineCollection({
  loader: glob({
    pattern: process.env.SHOW_DRAFTS === '1' ? '{posts,drafts}/**/{zh,en}.md' : 'posts/**/{zh,en}.md',
    base: './src/content',
    generateId: ({ entry }) => entry.replace(/^(posts|drafts)\//, '').replace(/\.md$/, ''),
  }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    description: z.string(),
    tags: z.array(z.string()).default([]),
    series: z.enum(SERIES).optional(),
    cover: z.string().optional(),
  }),
});
export const collections = { posts };
