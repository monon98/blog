/**
 * 把抓取到的掘金文章写入 src/docs/collection/reposts/<分类>/
 *
 * 用法：
 *   node scripts/import-juejin.mjs <掘金链接> <分类> [序号]
 *   node scripts/import-juejin.mjs <掘金链接> <分类> [序号] --desc "一句话说明"
 *   node scripts/import-juejin.mjs <掘金链接> <分类> [序号] --from-file <本地HTML路径>
 *
 * 例：
 *   node scripts/import-juejin.mjs "https://juejin.cn/post/7564681385294921737" 前端
 *   # 从本地缓存 HTML 转换（不联网，转换器改动后重转用）：
 *   node scripts/import-juejin.mjs "https://juejin.cn/post/7564681385294921737" 前端 012 --from-file .tmp-juejin-raw/7564681385294921737.html
 *
 * 行为：
 *   1. 抓取文章（复用 fetch-juejin.mjs）
 *   2. 按 source 链接去重，已存在则跳过
 *   3. 分配序号（<分类> 目录内现有最大编号 + 1，固定 3 位）
 *   4. 写入 <序号>. <标题>.md（含 frontmatter）
 *   5. 同步更新 src/docs/collection/index.md 落地页
 *
 * 注意：落库后仍建议人工复核正文与版权标注。
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fetchArticle, parseLocalFile } from './fetch-juejin.mjs';

const ROOT = process.cwd();
const REPOSTS = path.join(ROOT, 'src', 'docs', 'collection', 'reposts');
const INDEX = path.join(ROOT, 'src', 'docs', 'collection', 'index.md');

/** 文件名安全化：去掉 Windows 非法字符 */
function safeName(s) {
  return String(s)
    .replace(/[\\/:*?"<>|]/g, '_')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 80)
    // 文件名里的裸 '%' 会让 VitePress 构建失败：
    //   - sidebar link → normalize() → decodeURI() → URIError: URI malformed
    //   - 页面加载 → pathToFile() → decodeURIComponent() → URIError: URI malformed
    // 统一换成视觉等价的全角 '％'（中文排版里也更规范）。
    .replace(/%/g, '％');
}

/** 取 <分类> 目录内现有最大序号 */
async function nextOrder(dir) {
  let max = 0;
  try {
    for (const f of await fs.readdir(dir)) {
      const m = /^(\d+)/.exec(f);
      if (m) max = Math.max(max, Number(m[1]));
    }
  } catch { /* 目录不存在 */ }
  return String(max + 1).padStart(3, '0');
}

/** 按 source 链接查重 */
async function findDuplicate(dir, url) {
  let files = [];
  try {
    files = await fs.readdir(dir);
  } catch {
    return null;
  }
  for (const f of files) {
    if (!f.endsWith('.md')) continue;
    const text = await fs.readFile(path.join(dir, f), 'utf8');
    if (text.includes('source: ' + url)) return f;
  }
  return null;
}

/** URL 编码，用于站内相对链接 */
function encodeLink(name) {
  return name
    .split('/')
    .map(seg => encodeURIComponent(seg).replace(/%2F/gi, '/'))
    .join('/');
}

/** 更新 collection/index.md 落地页 */
async function updateIndex(category, fileName, title) {
  let text = '';
  try {
    text = await fs.readFile(INDEX, 'utf8');
  } catch {
    return false;
  }

  const link = './reposts/' + encodeLink(category) + '/' + encodeLink(fileName.replace(/\.md$/, ''));
  const entry = '- [' + title + '](' + link + ')';
  if (text.includes(link)) return false;

  // 找到该分类的小节，追加到其末尾
  const heading = '### ' + category;
  const hIdx = text.indexOf(heading);
  if (hIdx < 0) {
    // 分类小节不存在，追加到「转载收藏」段末尾
    const secIdx = text.indexOf('## 转载收藏');
    if (secIdx < 0) return false;
    const nextSec = text.indexOf('\n## ', secIdx + 5);
    const at = nextSec < 0 ? text.length : nextSec;
    text = text.slice(0, at) + '\n### ' + category + '\n' + entry + '\n' + text.slice(at);
  } else {
    // 小节内最后一个非空行之后
    const bodyStart = hIdx + heading.length;
    const nextHeading = text.indexOf('\n### ', bodyStart);
    const secEnd = nextHeading < 0 ? text.length : nextHeading;
    const section = text.slice(bodyStart, secEnd);
    const lines = section.split('\n');
    let insertAt = lines.length;
    for (let i = lines.length - 1; i >= 0; i--) {
      if (lines[i].trim()) { insertAt = i + 1; break; }
    }
    lines.splice(insertAt, 0, entry);
    text = text.slice(0, bodyStart) + lines.join('\n') + text.slice(secEnd);
  }

  await fs.writeFile(INDEX, text, 'utf8');
  return true;
}

async function main() {
  const argv = process.argv.slice(2);
  const url = argv.find(a => a.startsWith('http'));
  const category = argv.find(a => !a.startsWith('http') && !a.startsWith('--'));
  const descIdx = argv.indexOf('--desc');
  const desc = descIdx >= 0 ? argv[descIdx + 1] : '';
  const orderArg = argv.find(a => /^\d+$/.test(a));

  if (!url || !category) {
    console.error('用法：node scripts/import-juejin.mjs <掘金链接> <分类> [序号] [--desc "说明"]');
    process.exit(1);
  }

  const dir = path.join(REPOSTS, category);
  await fs.mkdir(dir, { recursive: true });

  const dup = await findDuplicate(dir, url);
  if (dup) {
    console.log('已存在，跳过：' + path.join(category, dup));
    return;
  }

  // --from-file <本地HTML路径>：从缓存的 HTML 转换，不联网（避免反爬冷却）
  const fromFileIdx = argv.indexOf('--from-file');
  const art = fromFileIdx >= 0
    ? await parseLocalFile(path.resolve(argv[fromFileIdx + 1]), url)
    : await fetchArticle(url);
  if (art.blocked) {
    console.error('正文疑似被登录墙/付费墙截断，请改用浏览器手动获取后再入库：' + url);
    process.exit(2);
  }
  if (!art.title || art.bodyLength < 200) {
    console.error('抓取内容异常（标题为空或正文过短），已中止：' + url);
    process.exit(3);
  }

  const order = orderArg ? String(orderArg).padStart(3, '0') : await nextOrder(dir);
  const fileName = order + '. ' + safeName(art.title) + '.md';
  const filePath = path.join(dir, fileName);

  const tagList = art.tags.length ? art.tags : ['转载'];
  const content = [
    '---',
    'created: ' + art.created + ' (UTC +08:00)',
    'tags: [' + tagList.join(',') + ']',
    'source: ' + url,
    'author: ' + art.author,
    '---',
    '',
    '# ' + art.title,
    '',
    '::: tip',
    '转载自掘金 · 作者：' + art.author + ' · [原文链接](' + url + ')',
    ':::',
    '',
    art.body,
    '',
  ].join('\n');

  await fs.writeFile(filePath, content, 'utf8');
  console.log('已写入：' + path.join(category, fileName));

  const indexUpdated = await updateIndex(category, fileName, art.title);
  console.log(indexUpdated ? '已更新落地页：src/docs/collection/index.md' : '落地页未更新（可能已存在条目或无对应小节）');

  console.log('');
  console.log('后续：pnpm dev 预览；发布前请人工复核正文与版权标注。');
  if (desc) console.log('（--desc 说明目前仅提示，未写入；如需落地页描述请手动补充）');
}

main().catch(e => {
  console.error('导入失败：' + e.message);
  process.exit(1);
});
