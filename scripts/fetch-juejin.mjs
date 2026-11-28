/**
 * 掘金文章抓取器（纯 fetch，无需浏览器）
 *
 * 用法：
 *   node scripts/fetch-juejin.mjs <掘金链接> [--out <输出json路径>]
 *
 * 输出：JSON（含 title / author / created / tags / body / source / blocked）
 * 不写文件时把 JSON 打到 stdout，由调用方（Agent）决定如何落库。
 *
 * 实测：掘金文章页为 SSR，.markdown-body 正文区完整存在于首屏 HTML，
 * 因此无需 agent-browser / Playwright，纯 fetch 即可拿到全文。
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { htmlToMarkdown, decodeEntities, stripTags } from './lib/juejin-convert.mjs';

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

const POST_ID_RE = /juejin\.cn\/post\/(\d+)/;

/** 从本地 HTML 文件解析文章（不联网，供转换器改动后重转用） */
export async function parseLocalFile(file, url) {
  const raw = await fs.readFile(file, 'utf8');
  if (!raw.includes('article-root') && !raw.includes('markdown-body')) {
    throw new Error('本地 HTML 不含正文（不是有效的文章页）：' + file);
  }
  const art = parseArticle(raw, url);
  const ctime = /ctime:"(\d+)"/.exec(raw)?.[1];
  const created = ctime
    ? ctimeToLocal(ctime)
    : (art.timeAttr ? art.timeAttr.replace('T', ' ').replace(/\.\d+Z$/, '').replace(/Z$/, '') : '');
  const blocked = /登录后查看|阅读全文需付费|开通会员|付费专栏|阅读全文/.test(art.body.slice(0, 800));
  return { ...art, created, blocked, bodyLength: art.body.length };
}

/** 从 SSR HTML 中抽取元数据与正文 */
export function parseArticle(raw, url) {
  const title =
    /class="[^"]*article-title[^"]*"[^>]*>([\s\S]*?)<\/h1>/.exec(raw)?.[1]?.replace(/<[^>]+>/g, '').trim() ||
    /<meta[^>]+property="og:title"[^>]+content="([^"]*)"/.exec(raw)?.[1] ||
    /<title>([^<]*)<\/title>/.exec(raw)?.[1]?.replace(/\s*-\s*掘金\s*$/, '').trim() ||
    '';

  const author =
    /class="[^"]*author-name[^"]*"[^>]*>[\s\S]*?<span[^>]*class="name[^"]*"[^>]*>([\s\S]*?)<\/span>/.exec(raw)?.[1]?.trim() ||
    /class="[^"]*author-name[^"]*"[^>]*>([\s\S]*?)<\/div>/.exec(raw)?.[1]?.replace(/<[^>]+>/g, '').trim() ||
    '';

  const timeAttr =
    /<time[^>]+datetime="([^"]+)"/.exec(raw)?.[1] ||
    /class="[^"]*time[^"]*"[^>]*>([\s\S]*?)<\/time>/.exec(raw)?.[1]?.trim() ||
    '';

  // 标签在 __NUXT__ 数据里：tags:[{...tag_name:"前端"...}]
  const tags = [];
  const tagsBlock = /tags:\[[\s\S]{0,8000}?\](?=[,}\]])/.exec(raw)?.[0] || '';
  for (const m of tagsBlock.matchAll(/tag_name:"([^"]+)"/g)) {
    const t = m[1];
    if (t && !tags.includes(t)) tags.push(t);
  }
  if (!tags.length) {
    const tagBlock = /class="[^"]*tag-list-box[^"]*"[\s\S]{0,6000}?<\/div>\s*<\/div>/.exec(raw)?.[0] || '';
    for (const m of tagBlock.matchAll(/<a[^>]*>([\s\S]*?)<\/a>/gi)) {
      const t = stripTags(m[1]);
      if (t && !tags.includes(t)) tags.push(t);
    }
  }

  // 正文：markdown-body 容器起，到 </article> 止
  const rootIdx = raw.indexOf('id="article-root"'); const start = rootIdx >= 0 ? raw.indexOf('article-viewer', rootIdx) : raw.indexOf('markdown-body');
  const end = raw.indexOf('</article>', start);
  let bodyHtml = '';
  if (start >= 0 && end > start) {
    bodyHtml = raw.slice(start, end);
    bodyHtml = bodyHtml.replace(/<style[\s\S]*?<\/style>/gi, '');
    bodyHtml = bodyHtml.replace(/^[^>]*>/, '');
    bodyHtml = bodyHtml.replace(/<p[^>]*>\s*(?:plaintext|javascript|typescript|css|html|json|bash|shell|python|java|vue|jsx|tsx|text)\s*<\/p>/gi, '');
  }

  const body = htmlToMarkdown(bodyHtml, { baseLevel: 2 });

  return { title, author, timeAttr, tags, body, source: url };
}

/** ctime(秒) → 本地时间字符串 */
function ctimeToLocal(sec) {
  const d = new Date(Number(sec) * 1000);
  const p = n => String(n).padStart(2, '0');
  return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate()) +
    ' ' + p(d.getHours()) + ':' + p(d.getMinutes()) + ':' + p(d.getSeconds());
}

export async function fetchArticle(url) {
  if (!POST_ID_RE.test(url)) throw new Error('不是有效的掘金文章链接：' + url);

  // 掘金会对「无 Referer」的请求返回 SPA 骨架（约 2.5KB，无正文）。
  // 带 Referer: https://juejin.cn/ 才会返回 SSR 完整正文（实测 173KB）。
  // 因此这里必须带 Referer，并在正文缺失时重试。
  const headers = {
    'User-Agent': UA,
    'Accept-Language': 'zh-CN,zh;q=0.9',
    Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    Referer: 'https://juejin.cn/',
    'Cache-Control': 'no-cache',
  };

  // 掘金反爬：同一 IP 连续请求会触发临时冷却，期间所有请求都返回 SPA 骨架
  // （约 2.5KB，无正文）。实测 Referer 是必要条件，退避时长需覆盖冷却窗口。
  let raw = '';
  let lastErr = null;
  const BACKOFF_MS = [1500, 5000, 12000, 25000, 30000];
  for (let attempt = 0; attempt < BACKOFF_MS.length; attempt++) {
    if (attempt > 0) {
      await new Promise(r => setTimeout(r, BACKOFF_MS[attempt - 1]));
    }
    const res = await fetch(url, { headers, signal: AbortSignal.timeout(30000) });
    if (!res.ok) {
      lastErr = new Error('HTTP ' + res.status + ' ' + url);
      continue;
    }
    raw = await res.text();
    // 判定是否拿到 SSR 正文（而不是 SPA 骨架）
    if (raw.includes('article-root') || raw.includes('markdown-body')) {
      lastErr = null;
      break;
    }
    lastErr = new Error(
      '掘金返回了 SPA 骨架（无正文），可能被反爬冷却拦截。' +
      '请稍候重试（冷却期通常几分钟），或改用浏览器手动获取：' + url
    );
  }
  if (!raw) throw lastErr ?? new Error('抓取失败：' + url);
  if (lastErr) throw lastErr;

  const art = parseArticle(raw, url);

  const ctime = /ctime:"(\d+)"/.exec(raw)?.[1];
  const created = ctime
    ? ctimeToLocal(ctime)
    : (art.timeAttr ? art.timeAttr.replace('T', ' ').replace(/\.\d+Z$/, '').replace(/Z$/, '') : '');

  // 正文可能被登录墙/付费墙截断
  const blocked = /登录后查看|阅读全文需付费|开通会员|付费专栏|阅读全文/.test(art.body.slice(0, 800));

  return { ...art, created, blocked, bodyLength: art.body.length };
}

async function main() {
  const argv = process.argv.slice(2);
  const url = argv.find(a => a.startsWith('http'));
  const outIdx = argv.indexOf('--out');
  const outFile = outIdx >= 0 ? argv[outIdx + 1] : null;
  if (!url) {
    console.error('用法：node scripts/fetch-juejin.mjs <掘金链接> [--out <路径>]');
    process.exit(1);
  }
  const art = await fetchArticle(url);
  if (outFile) {
    await fs.mkdir(path.dirname(outFile), { recursive: true });
    await fs.writeFile(outFile, JSON.stringify(art, null, 2), 'utf8');
    console.error('已写入 ' + outFile);
  }
  process.stdout.write(JSON.stringify(art, null, 2));
}

const invokedDirectly = process.argv[1] && import.meta.url.endsWith(process.argv[1].replace(/\\/g, '/'));
if (invokedDirectly) {
  main().catch(e => { console.error('抓取失败：' + e.message); process.exit(1); });
}
