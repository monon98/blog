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
 * 4. 表格转换为 GitHub 风格 Markdown 表格（thead/th 缺失时用首行兜底）
 * 5. 正文中的 `{{ }}` 转义为 `&#123;&#123;` 之类，避免被 VitePress 当 Vue 插值执行
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

/**
 * 把 <table> 转换成 GitHub 风格 Markdown 表格。
 *
 * 掘金表格结构规整：<table><thead><tr><th>..</th></tr></thead><tbody><tr><td>..</td></tr></tbody></table>
 * 但也可能有作者省略 thead（直接用 <td> 当表头），这里用首行兜底。
 *
 * 注意：单元格内可能是 <p>、<code>、<strong> 等混合内容，
 * 需要先做行内清理（转义竖线、压平换行）再拼表格。
 */
function tableToMarkdown(tableHtml) {
  // 1) 取出所有行（thead/tbody 内的 <tr>）
  const rows = [];
  const trRe = /<tr\b[^>]*>([\s\S]*?)<\/tr>/gi;
  let m;
  while ((m = trRe.exec(tableHtml))) {
    const cells = [];
    const cellRe = /<(th|td)\b[^>]*>([\s\S]*?)<\/\1>/gi;
    let c;
    while ((c = cellRe.exec(m[1]))) {
      cells.push({ tag: c[1].toLowerCase(), html: c[2] });
    }
    if (cells.length) rows.push(cells);
  }
  if (!rows.length) return '';

  // 2) 单元格 → 纯文本（保留行内 code/strong 的可读形态）
  const cellText = (cellHtml) => {
    let t = cellHtml;
    // 代码 → 行内 code
    t = t.replace(/<code[^>]*?>([\s\S]*?)<\/code>/gi, (_m, c) => '`' + stripTags(c) + '`');
    // 强调
    t = t.replace(/<(strong|b)\b[^>]*>([\s\S]*?)<\/\1>/gi, (_m, _t, c) => '**' + stripTags(c) + '**');
    t = t.replace(/<(em|i)\b[^>]*>([\s\S]*?)<\/\1>/gi, (_m, _t, c) => '*' + stripTags(c) + '*');
    // 链接
    t = t.replace(/<a[^>]*?href="([^"]*)"[^>]*?>([\s\S]*?)<\/a>/gi,
      (_m, href, txt) => '[' + stripTags(txt) + '](' + href + ')');
    // 其余标签剥离
    t = stripTags(t);
    // 竖线转义（表格分隔符）
    t = t.replace(/\|/g, '\\|');
    // 换行压平成空格
    t = t.replace(/\s*\n\s*/g, ' ').trim();
    return t;
  };

  const parsed = rows.map(r => r.map(c => cellText(c.html)));

  // 3) 表头：优先用 th 行；没有 th 则用首行
  let headerIdx = rows.findIndex(r => r.some(c => c.tag === 'th'));
  if (headerIdx < 0) headerIdx = 0;
  const header = parsed[headerIdx];
  const bodyRows = parsed.filter((_, i) => i !== headerIdx);

  // 4) 列数：以表头为准；列数不一致的行按表头补齐/截断
  const cols = header.length;
  const normalize = (row) => {
    const r = row.slice(0, cols);
    while (r.length < cols) r.push('');
    return r;
  };

  const lines = [];
  lines.push('| ' + header.map(c => c || ' ').join(' | ') + ' |');
  lines.push('| ' + new Array(cols).fill('---').join(' | ') + ' |');
  for (const row of bodyRows) {
    lines.push('| ' + normalize(row).map(c => c || ' ').join(' | ') + ' |');
  }

  return '\n' + lines.join('\n') + '\n';
}

/** 把所有 <table> 转换成 Markdown 表格 */
function tablesToMarkdown(html) {
  let s = html;
  let guard = 0;
  while (guard++ < 100) {
    const re = /<table\b[^>]*>[\s\S]*?<\/table>/gi;
    const m = re.exec(s);
    if (!m) break;
    const md = tableToMarkdown(m[0]);
    s = s.slice(0, m.index) + (md || '\n') + s.slice(m.index + m[0].length);
  }
  return s;
}

/**
 * 合并「作者把一段代码拆成 <pre> + <p>」的情况。
 *
 * 掘金里有些作者贴代码时，编辑器只把第一行放进 <pre><code>，
 * 剩下的代码以普通 <p> 文本继续（有时结尾还带一个 ```）。
 * 结果是：代码块被截断 + 后面残留一个孤立的 ``` → 围栏奇偶错乱，
 * 整篇 Markdown 的渲染从那里开始全乱。
 *
 * 识别方式：<pre><code>…</code></pre> 紧跟 </li></ol> 或 </p>，
 * 且后续 <p> 的纯文本以代码字符为主（分号/花括号/等号/逗号），不是自然语言。
 */
function mergeSplitCodeBlocks(html) {
  let s = html;
  let guard = 0;
  while (guard++ < 100) {
    // 找 <pre>…</pre>，其后紧跟（可有 </li></ol> 等闭合）一个 <p>
    // 用全局匹配扫描所有候选：前面的不匹配不代表后面的也不匹配，
    // 所以不能在第一个不匹配处 break，要继续找下一个候选。
    const re = /<pre[^>]*>[\s\S]*?<\/pre>([\s\S]{0,60}?)<p>([\s\S]*?)<\/p>/gi;
    let merged = false;

    for (const m of s.matchAll(re)) {
      const preBlock = m[0].slice(0, m[0].indexOf('</pre>') + 6);
      const between = m[1];
      const para = m[2];

      // 中间只允许闭合标签（</li></ol></ul></p> 等），不能有实质内容
      if (/[^<]/.test(between.replace(/<\/?[a-z0-9]+[^>]*>/gi, '').trim())) continue;

      // <p> 内容必须像代码：实体解码后不能是自然语言句子
      const text = decodeEntities(para.replace(/<[^>]+>/g, '')).trim();
      if (!text) continue;
      // 代码特征：含分号/花括号/赋值，或以代码关键字开头
      const codeish = /[;{}]\s*$|[);,]\s*$/m.test(text) ||
        /^\s*(const|let|var|function|return|if|for|while|import|export|async|await|class|new)\b/m.test(text);
      if (!codeish) continue;
      // 明显是自然语言的段落（有中文长句）不合并
      if (/[。！？；，]/.test(text) && !/[;{}]/.test(text)) continue;

      // <pre> 里的代码是否以未闭合的括号/花括号结尾？只有这样才可能是被截断
      const inner = /<code[^>]*>([\s\S]*?)<\/code>/i.exec(preBlock)?.[1] || '';
      const codeText = decodeEntities(inner.replace(/<[^>]+>/g, '')).trim();
      const opens = (codeText.match(/[{[(]/g) || []).length;
      const closes = (codeText.match(/[}\])]/g) || []).length;
      if (opens <= closes) continue; // 括号已配平 → 不是被截断的代码块

      // 合并：把 <p> 的内容追加进 <pre><code>，并移除中间的闭合标签与该 <p>
      // <p> 结尾常带一个孤立的 ```（作者手动补的围栏）。
      // 它必须去掉：留在代码内容里会被当成「闭合围栏」，把后面的代码甩出围栏。
      const textClean = text.replace(/\n?`{3,}\s*$/, '');
      const newPre = preBlock.replace(/<\/code><\/pre>$/i,
        codeText.replace(/\n$/, '') + '\n' + textClean + '\n</code></pre>');
      s = s.slice(0, m.index) + newPre + s.slice(m.index + m[0].length);
      merged = true;
      break;
    }

    if (!merged) break;
  }
  return s;
}

/** HTML → Markdown */
export function htmlToMarkdown(html, opts = {}) {
  const baseLevel = opts.baseLevel ?? 2;
  let s = html;

  // 0) 先合并被作者拆开的代码块（<pre> 只含首行，余下在 <p> 里）
  s = mergeSplitCodeBlocks(s);

  // 1) 保护代码块
  const blocks = [];
  s = s.replace(/<pre[^>]*>\s*<code([^>]*)>([\s\S]*?)<\/code>\s*<\/pre>/gi, (_m, attrs, code) => {
    const lang = /class="[^"]*language-([\w+#.-]+)/.exec(attrs)?.[1] || '';
    const inner = decodeEntities(code.replace(/<[^>]+>/g, '')).replace(/\r\n/g, '\n').replace(/^\n+|\n+$/g, '');
    // 围栏长度必须大于代码内容里出现过的最长连续反引号串，
    // 否则「代码块里再套一层 ```」会让内层反引号提前闭合围栏
    // （实测：TRAE 规则的 antd Changelog 示例就是 language-diff 里嵌 ``` + Markdown 标题）。
    let longest = 2;
    for (const m of inner.matchAll(/`+/g)) longest = Math.max(longest, m[0].length);
    const fence = FENCE.repeat(Math.max(1, Math.ceil((longest + 1) / 3)));
    blocks.push(fence + lang + '\n' + inner + '\n' + fence + '\n');
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

  // 3.5) 表格 → Markdown 表格
  //     必须在列表处理之前：单元格里的 <ul>/<ol> 会被列表解析器吃掉，
  //     导致表格结构错乱。表格先整体转成纯文本 + 竖线，后续规则不会再拆它。
  s = tablesToMarkdown(s);

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
  const fenceCount = (s.match(/^`{3,}/gm) || []).length;
  if (fenceCount % 2 === 1) s += '\n```\n';

  // 11) Vue 插值防护：md 页面会被编译成 Vue 模板，
  //     正文出现 `{{ ... }}` 会被当插值执行 → SSR TypeError / 内容渲染成 0。
  //     围栏代码块天然安全（不编译），只处理围栏外部分。
  s = escapeVueInterpolation(s);

  return s;
}

/**
 * 把围栏外的 `{{ ... }}` 包裹进 `<span v-pre>`，阻断 Vue 模板插值。
 *
 * 为什么用 v-pre 而不是 HTML 实体转义：
 *   Vue 的模板编译器不解析 HTML 实体，`&#123;` 会原样显示给用户。
 *   `<span v-pre>` 是本仓库既有的约定（见 AGENTS.md「md 页面是整页编译成 Vue 模板」），
 *   渲染结果与原文完全一致，且对行内反引号代码同样有效。
 *
 * 处理两类位置：
 *   1. 行内代码里的 `{{ }}` → `<span v-pre>` 反引号内容 `</span>`（v-pre 必须在 code 外层）
 *   2. 普通正文里的 `{{ }}` → `<span v-pre>{{ ... }}</span>`
 */
function escapeVueInterpolation(md) {
  // 用带捕获组的 split 保留围栏标记本身（否则会丢掉 ```js 这类语言标注）。
  // 奇数下标 = 围栏标记行（``` / ```` 等），偶数下标 = 文本段。
  // 围栏标记行出现一次 = 进入围栏，再出现一次 = 离开围栏。
  const parts = md.split(/(^`{3,}[^\n]*$)/gm);
  let inFence = false;

  return parts
    .map((part, i) => {
      if (i % 2 === 1) {
        // 围栏标记行：切换状态
        inFence = !inFence;
        return part;
      }
      if (inFence) return part; // 围栏内：安全，不动

      // 1) 行内代码里的 {{ }}：先整体保护，避免行内 code 被二次处理
      const codeSpans = [];
      let out = part.replace(/(`+)([^`\n]*?)\1/g, (m, ticks, inner) => {
        if (!inner.includes('{{')) return m;
        const idx = codeSpans.length;
        codeSpans.push(ticks + inner + ticks);
        return '\uE000ICODE' + idx + '\uE001';
      });

      // 2) 剩余裸 {{ }}
      out = out.replace(/\{\{([\s\S]*?)\}\}/g, (_m, inner) => '<span v-pre>{{ ' + inner + ' }}</span>');

      // 3) 还原行内代码：v-pre 必须在 code 外层（code 内层也加 v-pre 会嵌套出坏标签）
      out = out.replace(/\uE000ICODE(\d+)\uE001/g, (_m, i2) => {
        const idx = Number(i2);
        const code = codeSpans[idx];
        return '<span v-pre>' + code + '</span>';
      });

      return out;
    })
    .join('');
}
