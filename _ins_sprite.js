/* ============================================================================
 * _ins_sprite.js — v5.0 (idempotent, zero-CDN icon pipeline)
 *
 *  Chạy:  node _ins_sprite.js [sinh.html] [admin.html]
 *
 *  1. Chèn SVG sprite ngay sau thẻ <body> bằng /<body[^>]*>/i
 *     (không còn phụ thuộc chuỗi tĩnh '<body>\n'; chạy lại không nhân đôi).
 *  2. Dọn CSS rác: link Font Awesome / @import CDN, rule rỗng, khoảng trắng thừa.
 *  3. Nạp font Google async (media=print + onload) kèm <noscript> fallback.
 *  4. Bảo đảm có hydrator icon SVG nội tuyến (không tải library từ CDN),
 *     dùng MutationObserver + requestAnimationFrame để xử cả HTML sinh động.
 * ========================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');

const targets = process.argv.slice(2);
const FILES = targets.length ? targets : ['sinh.html', 'admin.html'];

/* ---------- nguồn sprite ---------- */
function spriteMarkup(html) {
  if (fs.existsSync('_sprite.html')) return fs.readFileSync('_sprite.html', 'utf8').trim();
  const m = html.match(/<svg\b[^>]*\bid=["']icoSprite["'][^>]*>[\s\S]*?<\/svg>/i)
    || html.match(/<svg\b[^>]*>\s*<defs>[\s\S]*?<symbol\b[\s\S]*?<\/defs>\s*<\/svg>/i);
  return m ? m[0] : '';
}
function hasSprite(html) {
  return /<svg\b[^>]*\bid=["']icoSprite["']/i.test(html) || /<symbol\s+id=["']i-/i.test(html);
}

/* ---------- 2. dọn CSS rác ---------- */
function cleanJunkCss(h) {
  let n = 0;
  // Font Awesome CDN (mọi host / version)
  h = h.replace(/<link\b[^>]*href=["'][^"']*font-?awesome[^"']*["'][^>]*>\s*/gi, () => { n++; return ''; });
  // Mọi dọn dẹp CSS khác CHỈ chạy bên trong <style>...</style>,
  // tránh đụng vào object literal / template string trong JS.
  h = h.replace(/(<style\b[^>]*>)([\s\S]*?)(<\/style>)/gi, (m0, open, css, close) => {
    if (!css.trim()) { n++; return ''; }
    let c = css.replace(/@import\s+(?:url\()?["']?https?:\/\/[^;]+;?\s*/gi, () => { n++; return ''; });
    c = c.replace(/([^{}]+)\{\s*\}/g, (r0, sel) => {
      if (/^\s*(@|\/\*|:root|html|body)/.test(sel)) return r0;
      n++; return '';
    });
    c = c.replace(/\n{4,}/g, '\n\n\n');
    return open + c + close;
  });
  h = h.replace(/<style[^>]*>\s*<\/style>/gi, () => { n++; return ''; });
  return { html: h, removed: n };
}

/* ---------- 3. font async ---------- */
function asyncFonts(h) {
  let n = 0;
  // Bỏ qua các link nằm trong <noscript> khi xét "đã async chưa".
  if (!/<link\b[^>]*fonts\.googleapis\.com[^>]*media=["']print["'][^>]*>/i.test(h)) {
    h = h.replace(/<link\b[^>]*fonts\.googleapis\.com[^>]*>/gi, (m0) => {
      if (/media=["']print["']/.test(m0) && /onload=/.test(m0)) return m0;
      let clean = m0.replace(/\s+(rel|media|onload)=["'][^"']*["']/gi, '');
      clean = clean.replace(/>$/, ' rel="stylesheet" media="print" onload="this.media=\'all\'">');
      n++; return clean;
    });
  }
  // Fallback khi JS tắt: onload không chạy -> font sẽ không nạp.
  if (!/<noscript>\s*<link[^>]*fonts\.googleapis\.com/.test(h)) {
    const link = (h.match(/<link\b[^>]*fonts\.googleapis\.com[^>]*>/i) || [''])[0]
      .replace(/\s+(media|onload)=["'][^"']*["']/gi, '');
    if (link) { h = h.replace(/<\/head>/i, '  <noscript>' + link + '</noscript>\n</head>'); n++; }
  }
  return { html: h, changed: n };
}

/* ---------- 4. runtime hydrator (chèn 1 lần, thuần SVG nội tuyến) ---------- */
const HYDRATOR = [
  '<script>',
  '/* v5.0 · hydrate icon SVG nội tuyến — KHÔNG phụ thuộc CDN.',
  '   Đổi <i class="fa-solid fa-x"> thành <svg><use href="#i-x"></use></svg>.',
  '   Gom node theo khung hình nên không gây giật lag khi render đề dài. */',
  '(function () {',
  '  if (window.__bg4IcoV5) return; window.__bg4IcoV5 = true;',
  '  function nameOf(el) {',
  '    const m = String(el.className || "").match(/fa-[a-z0-9-]+/g); if (!m) return "";',
  '    const skip = /^fa-(solid|regular|brands|fw|spin|2x|3x|lg|xs|sm|pulse|beat|fade|bounce|shake|rotate-90|flip-horizontal|fixed-width|stack|inverse)$/;',
  '    for (let i = m.length - 1; i >= 0; i--) if (!skip.test(m[i])) return m[i].slice(3);',
  '    return "";',
  '  }',
  '  function hydrate(root) {',
  '    const scope = (root && root.querySelectorAll) ? root : document;',
  '    const list = [];',
  '    if (scope.matches && scope.matches(\'i[class*="fa-"]\')) list.push(scope);',
  '    const found = scope.querySelectorAll ? scope.querySelectorAll(\'i[class*="fa-"]\') : [];',
  '    for (let i = 0; i < found.length; i++) list.push(found[i]);',
  '    for (let i = 0; i < list.length; i++) {',
  '      const el = list[i];',
  '      if (!el.dataset || el.dataset.ico === "1") continue;',
  '      const nm = nameOf(el); if (!nm) continue;',
  '      el.dataset.ico = "1";',
  '      if (!document.getElementById("i-" + nm)) { el.textContent = ""; continue; }',
  '      el.innerHTML = \'<svg class="ico" aria-hidden="true" focusable="false"><use href="#i-\' + nm + \'"></use></svg>\';',
  '    }',
  '  }',
  '  const pending = new Set(); let scheduled = false;',
  '  function schedule(node) {',
  '    if (!node || node.nodeType !== 1) return;',
  '    pending.add(node); if (scheduled) return; scheduled = true;',
  '    requestAnimationFrame(function () {',
  '      scheduled = false; const batch = Array.from(pending); pending.clear();',
  '      for (let i = 0; i < batch.length; i++) if (batch[i].isConnected) hydrate(batch[i]);',
  '    });',
  '  }',
  '  hydrate(document);',
  '  if (typeof MutationObserver !== "undefined") {',
  '    new MutationObserver(function (recs) {',
  '      for (let i = 0; i < recs.length; i++) {',
  '        const add = recs[i].addedNodes;',
  '        for (let j = 0; j < add.length; j++) schedule(add[j]);',
  '      }',
  '    }).observe(document.documentElement, { childList: true, subtree: true });',
  '  }',
  '})();',
  '</' + 'script>'
].join('\n');

function ensureHydrator(h) {
  // App đã có hydrateIcons + IcoQueue, hoặc không còn thẻ fa-* nào -> không chèn.
  if (/__bg4IcoV5/.test(h) || /function\s+hydrateIcons\s*\(/.test(h) ||
      !/<i\b[^>]*class=["'][^"']*fa-/i.test(h)) return { html: h, added: false };
  const i = h.lastIndexOf('</body>');
  if (i < 0) return { html: h, added: false };
  return { html: h.slice(0, i) + HYDRATOR + '\n' + h.slice(i), added: true };
}

/* ---------- chạy ---------- */
let grand = 0;
for (const f of FILES) {
  if (!fs.existsSync(f)) { console.log('SKIP (missing):', f); continue; }
  let h = fs.readFileSync(f, 'utf8');
  const orig = h;
  const steps = [];

  const junk = cleanJunkCss(h); h = junk.html;
  if (junk.removed) steps.push('junk CSS -' + junk.removed);

  const fonts = asyncFonts(h); h = fonts.html;
  if (fonts.changed) steps.push('async font x' + fonts.changed);

  const sprite = spriteMarkup(h);
  if (sprite) {
    if (!hasSprite(h)) {
      // /<body[^>]*>/i — chấp nhận <body class="...">, <BODY>, thuộc tính bất kỳ
      h = h.replace(/<body[^>]*>/i, m => m + '\n' + sprite + '\n');
      steps.push('sprite injected (regex)');
    } else steps.push('sprite present (idempotent)');
  } else steps.push('no sprite source (skipped)');

  const hyd = ensureHydrator(h); h = hyd.html;
  steps.push(hyd.added ? 'icon hydrator installed' : 'hydrator present');

  const cdn = (h.match(/https?:\/\/[^"'\s]*(font-awesome|cdnjs\.cloudflare\.com\/ajax\/libs\/font-awesome)/gi) || []).length;
  if (cdn) steps.push('WARN external icon CSS x' + cdn);

  const changed = h !== orig;
  if (changed) { fs.writeFileSync(f, h, 'utf8'); grand++; }
  console.log(path.basename(f) + ':', changed ? 'updated' : 'no change', '|', steps.join(' · '));
}
console.log('done: ' + grand + '/' + FILES.length + ' file(s) changed');
