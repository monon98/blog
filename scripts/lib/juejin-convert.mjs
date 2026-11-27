/**
 * 掘金文章 HTML → Markdown 转换器（无第三方依赖）
 *
 * 掘金文章页为 SSR，.markdown-body 正文区完整存在于首屏 HTML，
 * 因此纯 fetch 即可拿到全文，无需 agent-browser / Playwright。
 *
 * 关键处理：
 * 1. 代码块先抽成占位符，避免内部换行/反引号被后续规则破坏
 * 2. 标题按「出现顺序」动态映射层级（掘金作者常混用 h2~h5）
 * 3. 列表按嵌套深度配对闭合标签，正确保留层级
 */

const FENCE = String.fromCharCode(96).repeat(3);
const TICK = String.fromCharCode(96);

export function decodeEntities(s) {
  return String(s)
    .replace(/</g, '<').replace(/>/g, '>').replace(/"/g, '"')
    .replace(/&apos;/g, "'").replace(/&nbsp;/g, ' ')
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&#x([\da-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&/g, '&');
}

/** 代码块占位符 token（不含空白/尖括号，能安全穿过 stripTags 与换行压平） */
const CODE_TOKEN = (i) => '\uE000CODE' + i + '\uE001';

export function stripTags(s) {
  return decodeEntities(String(s).replace(/<[^>]+>/g, '')).trim();
}

/** 解析一个 <ol>/<ul> 容器，返回 { md, end, openLen } */
function parseList(src, start) {
  const open = /<(ol|ul)\b[^>]*>/i.exec(src.slice(start));
  if (!open) return null;
  const tagName = open[1].toLowerCase();
  const contentStart = start + open.index + open[0].length;

  // 找配对的列表闭合标签（li 不计入列表深度）
  const tagRe = /<(\/?)(ol|ul|li)\b[^>]*>/gi;
  tagRe.lastIndex = contentStart;
  let depth = 1, closeEnd = -1, closeStart = -1, m;
  while ((m = tagRe.exec(src))) {
    const name = m[2].toLowerCase();
    if (name === 'li') continue;
    if (m[1]) {
      depth--;
      if (depth === 0) { closeStart = m.index; closeEnd = m.index + m[0].length; break; }
    } else {
      depth++;
    }
  }
  if (closeEnd < 0) return null;

  // inner 必须正好是闭合标签之前的内容。
  // 不能用 src.lastIndexOf('</', closeEnd)——那会找到上一个标签的结束位置，
  // 区间可能错位（甚至早于 contentStart），把后续内容（如代码块）整段切掉。
  const inner = src.slice(contentStart, closeStart);

  // 逐项解析 <li>：用嵌套列表深度找配对的 </li>
  const items = [];
  let cursor = 0;
  const liRe = /<li\b[^>]*>/gi;
  for (;;) {
    liRe.lastIndex = cursor;
    const liOpen = liRe.exec(inner);
    if (!liOpen) break;

    const scan = /<(\/?)(ol|ul|li)\b[^>]*>/gi;
    scan.lastIndex = liOpen.index + liOpen[0].length;
    let ld = 0, liCloseIdx = null, x;
    while ((x = scan.exec(inner))) {
      const name = x[2].toLowerCase();
      if (name === 'li') {
        if (x[1] && ld === 0) { liCloseIdx = x.index; break; }
      } else if (x[1]) {
        if (ld === 0) break;
        ld--;
      } else {
        ld++;
      }
    }
    if (liCloseIdx === null) break;

    const itemHtml = inner.slice(liOpen.index + liOpen[0].length, liCloseIdx);

    // 抽掉 item 内的嵌套列表，单独渲染
    let textPart = itemHtml;
    let nestedMd = '';
    let guard = 0;
    for (;;) {
      const idx = textPart.search(/<(ol|ul)\b/i);
      if (idx < 0 || guard++ > 20) break;
      const nested = parseList(textPart, idx);
      if (!nested) break;
      nestedMd = nestedMd ? nestedMd + '\n' + nested.md : nested.md;
      textPart = textPart.slice(0, idx) + textPart.slice(nested.end);
    }

    // 列表项内的代码块也要保护：stripTags 会把围栏字符连同代码一起压平，
    // 导致闭合围栏丢失（最终 Markdown 围栏数为奇数，破坏整篇渲染）。
    // 全局第 1 步已把所有 <pre><code> 捕获为 \uE000CODE n \uE001 原子 token，
    // 这里只需保证它在列表项内独占一行——否则还原后闭合围栏会粘在列表文字后面，
    // 导致整篇围栏配对错乱（奇数个围栏 → 后续内容全被当成代码）。
    let inline = stripTags(textPart).replace(/\s*\n\s*/g, ' ').trim();
    inline = inline.replace(/\uE000CODE(\d+)\uE001/g, (_m2, i) => '\n\nCODEBLOCK:' + i + '\n\n');
    items.push({
      inline,
      nestedMd,
    });
    cursor = liCloseIdx + 5;
  }

  const lines = [];
  items.forEach((it, idx) => {
    lines.push((tagName === 'ol' ? (idx + 1) + '. ' : '- ') + it.inline);
    if (it.nestedMd) {
      for (const nl of it.nestedMd.split('\n')) {
        if (nl.trim()) lines.push('  ' + nl);
      }
    }
  });

  return { md: lines.join('\n'), end: closeEnd, openLen: open[0].length };
}

/** 把所有 <ol>/<ul> 转换成 Markdown，保留嵌套层级 */
function listsToMarkdown(html) {
  let s = html;
  let guard = 0;
  while (guard++ < 200) {
    const re = /<(ol|ul)\b[^>]*>/gi;
    const m = re.exec(s);
    if (!m) break;
    const parsed = parseList(s, m.index);
    if (!parsed) break;
    s = s.slice(0, m.index) + '\n' + parsed.md + '\n' + s.slice(parsed.end);
  }
  return s;
}

/** HTML → Markdown */
export function htmlToMarkdown(html, opts = {}) {
  const baseLevel = opts.baseLevel ?? 2;
  let s = html;

  // 1) 保护代码块
  const blocks = [];
  s = s.replace(/<pre[^>]*>\s*<code([^>]*)>([\s\S]*?)<\/code>\s*<\/pre>/gi, (_m, attrs, code) => {
    const lang = /class="[^"]*language-([\w+#.-]+)/.exec(attrs)?.[1] || '';
    const inner = decodeEntities(code.replace(/<[^>]+>/g, '')).replace(/\r\n/g, '\n').replace(/^\n+|\n+$/g, '');
    blocks.push(FENCE + lang + '\n' + inner + '\n' + FENCE + '\n');
    return CODE_TOKEN(blocks.length - 1);
  });

  // 2) 标题：占位，稍后按出现顺序动态映射层级
  const seq = [];
  const headings = [];
  s = s.replace(/<h([1-6])\b[^>]*>((?:(?!\uE000CODE)[\s\S])*?)<\/h\1>/gi, (_m, lv, c) => {
    // 正文里的 h1 会与页面 H1（文章标题）冲突——VitePress 每页只允许一个 H1。
    // 正文 h1 视为「顶级章节」，映射时与 h2 同级（映射算法里统一抬到 baseLevel）。
    seq.push(Number(lv));
    headings.push(stripTags(c));
    return '\u0000HEAD' + (seq.length - 1) + '\u0000';
  });

  // 3) 行内元素
  s = s.replace(/<img[^>]*?src="([^"]*)"[^>]*?>/gi, (_m, src) => '![](' + src + ')');
  s = s.replace(/<a[^>]*?href="([^"]*)"[^>]*?>((?:(?!\uE000CODE)[\s\S])*?)<\/a>/gi,
    (_m, href, txt) => '[' + stripTags(txt) + '](' + href + ')');
  s = s.replace(/<code[^>]*?>((?:(?!\uE000CODE)[\s\S])*?)<\/code>/gi, (_m, c) => TICK + stripTags(c) + TICK);

  // 4) 列表
  s = listsToMarkdown(s);

  // 5) 强调 / 引用 / 段落
  s = s.replace(/<(strong|b)[^>]*>((?:(?!\uE000CODE)[\s\S])*?)<\/\1>/gi, (_m, _t, c) => '**' + stripTags(c) + '**');
  s = s.replace(/<(em|i)[^>]*>((?:(?!\uE000CODE)[\s\S])*?)<\/\1>/gi, (_m, _t, c) => '*' + stripTags(c) + '*');
  s = s.replace(/<blockquote[^>]*>((?:(?!\uE000CODE)[\s\S])*?)<\/blockquote>/gi,
    (_m, c) => '\n> ' + stripTags(c).split('\n').join('\n> ') + '\n');
  s = s.replace(/<p[^>]*>((?:(?!\uE000CODE)[\s\S])*?)<\/p>/gi, (_m, c) => '\n' + c.trim() + '\n');
  s = s.replace(/<br\s*\/?>/gi, '\n');
  s = s.replace(/<hr\s*\/?>/gi, '\n---\n');

  // 6) 剥离剩余标签（保留文本）
  s = s.replace(/<[^>]+>/g, '');
  s = decodeEntities(s);

  // 7) 还原标题（动态层级）
  const stack = [];
  const levelMap = [];
  for (const lv of seq) {
    while (stack.length && stack[stack.length - 1] >= lv) stack.pop();
    stack.push(lv);
    // 相对深度 → 绝对层级；下限 baseLevel（正文 h1/h2 都映射为 baseLevel，
    // 保证 VitePress 每页只有文章标题这一个 H1）
    const rel = stack.length - 1;
    levelMap.push(Math.min(6, Math.max(baseLevel, baseLevel + rel)));
  }
  s = s.replace(/\u0000HEAD(\d+)\u0000/g, (_m, i) => {
    const idx = Number(i);
    return '\n' + '#'.repeat(levelMap[idx]) + ' ' + headings[idx] + '\n';
  });

  // 8) 还原代码块
  s = s.replace(/CODEBLOCK:(\d+)/g, (_m, i) => blocks[Number(i)]);
  s = s.replace(/\uE000CODE(\d+)\uE001/g, (_m, i) => blocks[Number(i)]);

  // 9) 清理
  s = s.replace(/\n{3,}/g, '\n\n').replace(/[ \t]+\n/g, '\n').trim();

  // 10) 围栏配对兜底：代码块若被列表/段落压平，闭合围栏可能丢失，
  //     奇数个 ``` 会让后续内容全部被当成代码，必须补齐。
  const fenceCount = (s.match(/^```/gm) || []).length;
  if (fenceCount % 2 === 1) s += '\n```\n';

  return s;
}
