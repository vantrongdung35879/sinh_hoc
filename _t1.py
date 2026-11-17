import sys, time, json
sys.path.insert(0, r"C:/Users/Asus/Downloads/tool/tool/học")
from _cdp import launch, Tab, report

launch(1366, 800)
t = Tab("http://127.0.0.1:8899/sinh.html")
report("title", t.ev("document.title"))
report("errs", t.ev("(window.__errs||[]).slice(0,5)"))
report("fsapi", t.ev("({api: BG4_FS.supported(), on: BG4_FS.isOn(), btn: !!document.getElementById('btnFs'), labBtn: !!document.getElementById('labFsBtn')})"))
report("topbar", t.ev("""(() => { const tb=document.querySelector('.topbar'); const r=tb.getBoundingClientRect();
  const kids=[...tb.querySelectorAll('button,.idchip,.nx-badge')].map(b=>{const q=b.getBoundingClientRect();return {id:b.id||b.className, x:Math.round(q.x), w:Math.round(q.width)}});
  return {w:Math.round(r.width), sh:tb.scrollWidth, cw:tb.clientWidth, kids}; })()"""))
report("overflow", t.ev("document.documentElement.scrollWidth - document.documentElement.clientWidth"))
t.shot(r"C:/Users/Asus/Downloads/tool/tool/học/_s1.png")
t.close()
