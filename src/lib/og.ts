import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';

// Unmodified Noto Sans CJK SC Regular, release Sans2.004 (SIL OFL 1.1).
// Font: https://github.com/notofonts/noto-cjk/blob/Sans2.004/Sans/OTF/SimplifiedChinese/NotoSansCJKsc-Regular.otf
// License: https://github.com/notofonts/noto-cjk/blob/Sans2.004/LICENSE
// Bundled license: public/fonts/OFL.txt. Build-time rendering uses no network.
const font = readFile(resolve('public/fonts/NotoSansCJKsc-Regular.otf'));

interface PostMetadata {
  title: string;
  date: Date;
  description: string;
  tags: string[];
  series?: string;
}

/** Render a share image entirely from bundled assets; never fetch remote covers. */
export async function renderPostOg(post: PostMetadata, language: string): Promise<Uint8Array> {
  const english = language === 'en';
  const date = post.date.toISOString().slice(0, 10);
  const label = post.series || (english ? 'Notes & tools' : '记录与工具');
  const element = {
    type: 'div',
    props: {
      style: {
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        width: 1200, height: 630, boxSizing: 'border-box', padding: '64px 76px',
        backgroundColor: '#faf9f6', color: '#242424', fontFamily: 'Noto Sans CJK SC',
      },
      children: [
        {
          type: 'div',
          props: {
            style: { display: 'flex', width: 1048, justifyContent: 'space-between', fontSize: 24, color: '#74716b' },
            children: [
              { type: 'span', props: { children: 'Asaki' } },
              { type: 'span', props: { children: date } },
            ],
          },
        },
        {
          type: 'div',
          props: {
            style: { display: 'flex', width: 1048, flexDirection: 'column', gap: 22 },
            children: [
              { type: 'div', props: { style: { fontSize: 23, color: '#ae6749' }, children: label } },
              {
                type: 'div',
                props: {
                  style: {
                    fontSize: english ? (post.title.length > 42 ? 44 : 56) : (post.title.length > 18 ? 48 : 56),
                    width: 1048, maxWidth: 1048, lineHeight: 1.25,
                    letterSpacing: english ? '-1px' : '0px', lineClamp: 3, overflow: 'hidden',
                  },
                  children: post.title,
                },
              },
              {
                type: 'div',
                props: {
                  style: { fontSize: 25, lineHeight: 1.5, color: '#74716b', lineClamp: 2, overflow: 'hidden' },
                  children: post.description,
                },
              },
            ],
          },
        },
        {
          type: 'div',
          props: {
            style: {
              display: 'flex', width: 1048, justifyContent: 'space-between', alignItems: 'center',
              paddingTop: 22, borderTop: '1px solid #dedbd4', fontSize: 20, color: '#74716b',
            },
            children: [
              { type: 'span', props: { children: 'blog.asaki.qzz.io' } },
              { type: 'span', props: { children: post.tags.slice(0, 3).join(' / ') } },
            ],
          },
        },
      ],
    },
  };
  const svg = await satori(element as unknown as Parameters<typeof satori>[0], {
    width: 1200,
    height: 630,
    fonts: [{ name: 'Noto Sans CJK SC', data: await font, weight: 400, style: 'normal' }],
  });
  return new Resvg(svg, { font: { loadSystemFonts: false } }).render().asPng();
}
