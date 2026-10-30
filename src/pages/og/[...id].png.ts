import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection, type CollectionEntry } from 'astro:content';
import { renderPostOg } from '../../lib/og';

export const prerender = true;

export const getStaticPaths = (async () => {
  const posts = await getCollection('posts');
  return posts.map((post) => ({
    params: { id: post.id },
    props: { post },
  }));
}) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ props }) => {
  const post = props.post as CollectionEntry<'posts'>;
  const language = post.id.split('/').at(-1) ?? 'zh';
  const png = await renderPostOg(post.data, language);
  // Copy into an ArrayBuffer-backed view accepted by the Web Response API.
  return new Response(new Uint8Array(png), {
    headers: { 'Content-Type': 'image/png' },
  });
};
