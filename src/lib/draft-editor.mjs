import { readFile, stat, realpath, writeFile, rename, unlink } from 'node:fs/promises';
import { join, sep } from 'node:path';
import { randomUUID } from 'node:crypto';

export function draftEditor(root) {
  return async (req, res, next) => {
    const raw = (req.url ?? '').split('?')[0];
    if (!raw.startsWith('/__edit')) return next();
    const send = (status, value) => { res.statusCode = status; res.setHeader('Content-Type', 'application/json; charset=utf-8'); res.setHeader('Cache-Control', 'no-store'); res.end(JSON.stringify(value)); };
    if (!['127.0.0.1', '::1', '::ffff:127.0.0.1'].includes(req.socket.remoteAddress)) return send(403, { error: '仅允许本机访问' });
    if (req.headers.origin && req.headers.origin !== `http://${req.headers.host}`) return send(403, { error: '拒绝跨站请求' });
    let path;
    try { path = decodeURIComponent(raw); } catch { return send(400, { error: '无效路径' }); }
    const api = /^\/__edit\/api\/([a-z0-9]+(?:-[a-z0-9]+)*)\/(zh|en)$/.exec(path);
    if (api) {
      const [, slug, lang] = api;
      let file;
      for (const collection of ['drafts', 'posts']) {
        const base = join(root, 'src/content', collection);
        try {
          const resolved = await realpath(join(base, slug, `${lang}.md`));
          if (!resolved.startsWith((await realpath(base)) + sep)) return send(403, { error: '拒绝路径穿越' });
          file = resolved; break;
        } catch (error) { if (error.code !== 'ENOENT') return send(500, { error: '无法读取母稿' }); }
      }
      if (!file) return send(404, { error: '母稿不存在' });
      const version = async () => { const info = await stat(file, { bigint: true }); return info.mtimeNs.toString(); };
      try {
        if (req.method === 'GET') {
          const mtime = await version();
          const source = await readFile(file, 'utf8');
          if (mtime !== await version()) return send(409, { error: '文件正在外部修改，请重新加载' });
          return send(200, { source, mtime });
        }
        if (req.method !== 'PUT') return send(405, { error: '不支持此方法' });
        let body = '';
        for await (const chunk of req) body += chunk;
        let input;
        try { input = JSON.parse(body); } catch { return send(400, { error: '无效 JSON' }); }
        if (typeof input.source !== 'string' || typeof input.mtime !== 'string') return send(400, { error: '缺少正文或版本' });
        const temporary = `${file}.${randomUUID()}.tmp`;
        try {
          await writeFile(temporary, input.source, { flag: 'wx' });
          if (input.mtime !== await version()) return send(409, { error: '母稿已被外部修改。请先复制当前修改，再重新加载，拒绝覆盖。' });
          await rename(temporary, file);
          return send(200, { mtime: await version() });
        } finally { await unlink(temporary).catch(() => {}); }
      } catch { return send(500, { error: '读写失败，修改未确认保存' }); }
    }
    const page = /^\/__edit\/([a-z0-9]+(?:-[a-z0-9]+)*)\/(en\/)?$/.exec(path);
    if (!page || req.method !== 'GET') return send(400, { error: '无效编辑路径' });
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'no-store');
    res.end(editor(page[1], page[2] ? 'en' : 'zh'));
  };
}

function editor(slug, lang) {
  const preview = `${lang === 'en' ? '/en' : ''}/posts/${slug}/`;
  return `<!doctype html><html lang="zh-CN"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>编辑 ${slug}</title>
<style>:root{color-scheme:light dark;--canvas:#f5f4ed;--paper:#fff;--ink:rgba(36,41,47,.9);--line:#e5e5df;--link:#167ab9;font-family:'STKaiti','KaiTi',system-ui;background:var(--canvas);color:var(--ink)}*{box-sizing:border-box}body{margin:0}header{height:60px;padding:12px 20px;display:flex;align-items:center;gap:20px;border-bottom:1px solid var(--line)}header strong{margin-right:auto}button,a{font:inherit;color:inherit}button{padding:6px 18px;border:1px solid var(--line);border-radius:8px;background:var(--paper);cursor:pointer}a{color:var(--link)}main{display:grid;grid-template-columns:1fr 1fr;height:calc(100dvh - 60px)}textarea{resize:none;border:0;border-right:1px solid var(--line);padding:24px;width:100%;height:100%;background:var(--paper);color:var(--ink);font:14px/1.75 ui-monospace,SFMono-Regular,Menlo,monospace;white-space:pre-wrap;overflow-wrap:anywhere;outline-offset:-3px}iframe{width:100%;height:100%;border:0}#status{font:13px system-ui} @media(prefers-color-scheme:dark){:root{--canvas:#1d2024;--paper:#25292e;--ink:#deded9;--line:#3c4146;--link:#70b6df}}@media(max-width:700px){main{grid-template-columns:1fr;grid-template-rows:1fr 1fr}header{gap:10px;padding:10px}textarea{border-bottom:1px solid var(--line)}} </style>
<header><strong>${slug} / ${lang}</strong><span id="status" role="status">加载中</span><a href="${preview}" target="_blank">文章 ↗</a><button id="save" disabled>保存 ⌘S</button></header><main><textarea id="source" aria-label="Markdown 源码" wrap="soft" spellcheck="false" disabled></textarea><iframe title="文章实时预览" src="${preview}"></iframe></main>
<script>
const source=document.querySelector('textarea'), frame=document.querySelector('iframe'), status=document.querySelector('#status'), save=document.querySelector('#save');
const api='/__edit/api/${slug}/${lang}'; let baseline='',mtime='',busy=false;
const dirty=()=>source.value!==baseline;
const update=()=>{status.textContent=dirty()?'未保存':'已保存';document.title=(dirty()?'● ':'')+'编辑 ${slug}';};
source.addEventListener('input',update);
window.addEventListener('beforeunload',event=>{if(dirty()){event.preventDefault();event.returnValue='';}});
async function persist(){if(busy||source.disabled)return;busy=true;save.disabled=true;status.textContent='保存中';const submitted=source.value;try{const response=await fetch(api,{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({source:submitted,mtime})});const result=await response.json();if(!response.ok)throw Error(result.error);baseline=submitted;mtime=result.mtime;update();frame.contentWindow.location.reload();}catch(error){status.textContent=error.message;}finally{busy=false;save.disabled=false;}}
save.addEventListener('click',persist);document.addEventListener('keydown',event=>{if((event.metaKey||event.ctrlKey)&&event.key==='s'){event.preventDefault();persist();}});
fetch(api).then(async response=>{const result=await response.json();if(!response.ok)throw Error(result.error);source.value=baseline=result.source;mtime=result.mtime;source.disabled=false;save.disabled=false;update();}).catch(error=>status.textContent=error.message);
frame.addEventListener('load',()=>{frame.contentDocument.querySelector('article')?.addEventListener('dblclick',event=>{const block=event.target.closest('p,li,h1,h2,h3,h4,blockquote,pre');if(!block)return;const text=block.textContent.trim();if(!text)return;let start=source.value.indexOf(text),end=start+text.length;if(start<0){const normalized=[];let plain='';for(let i=0;i<source.value.length;i++){const c=source.value[i];if(/[\\s*_]/.test(c))continue;normalized.push(i);plain+=c;}const needle=text.replace(/[\\s*_]/g,'');const match=plain.indexOf(needle);if(match<0)return;start=normalized[match];end=normalized[match+needle.length-1]+1;}source.focus();source.setSelectionRange(start,end);const line=source.value.slice(0,start).split('\\n').length;source.scrollTop=Math.max(0,(line-4)*24.5);});});
</script></html>`;
}
