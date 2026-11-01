const fs = require('fs');
let h = fs.readFileSync('sinh.html', 'utf8');
const sprite = fs.readFileSync('_sprite.html', 'utf8');
let n = 0;

if (h.includes('<body>\n')) { h = h.replace('<body>\n', '<body>\n' + sprite + '\n'); n++; }
else console.log('MISS body');

const fa = '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">';
if (h.includes(fa)) { h = h.split(fa + '\n').join('').split(fa).join(''); n++; }
else console.log('MISS fa link');

const gf = /<link href="(https:\/\/fonts\.googleapis\.com\/css2\?[^"]+)" rel="stylesheet">/;
if (gf.test(h)) {
  h = h.replace(gf, function (m, u) {
    return '<link href="' + u + '" rel="stylesheet" media="print" onload="this.media=\'all\'">';
  });
  n++;
} else console.log('MISS gf');

fs.writeFileSync('sinh.html', h);
console.log('done', n);
