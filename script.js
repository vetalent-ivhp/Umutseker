// ═══════════════════════════════════════════════════════════
// VeTalent İVHP — script.js  (Temiz, çalışan versiyon)
// ═══════════════════════════════════════════════════════════

// ─── GÜVENLİ CONFIG ─────────────────────────────────────────
const _w = atob('OTA1MDY0NDA1MDEy'); // WA numara
const _p = atob('QmF5dGFydW11dDEy'); // Admin şifre
const SHEET_ID   = '1bgqT1T_ZHUGdyyIODQaxDKVUMtgeUiHcaA1OQYzWm8M';
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzkG8a4jpnt1IvdfSsbchOFQbgIjP9neaZ3OamWTWezDRtDz39VtgccQKxuz0HcblBZ/exec';
const WA_GRUP_LINK = 'https://chat.whatsapp.com/IbD4y6cxUTMCCGkKpTnIGD?mode=gi_t';

// ─── SABİT WA GRUPLARI (kullanıcı tarafından sağlanan) ──────
const WA_GROUPS_STATIC = [
  {name:'VeTalent Yeni mezun',     link:'https://chat.whatsapp.com/KhFbvSYVpj26kqhnrLjnV7?mode=gi_t', brans:'Genel',    sehir:'Türkiye'},
  {name:'VeTalent diğer şehirler',     link:'https://chat.whatsapp.com/DuAonuHByHOHvThb1lajaL?mode=gi_t', brans:'Klinik',   sehir:'İstanbul'},
  {name:'VeTalent Kocaeli-Sakarya',      link:'https://chat.whatsapp.com/Kfyh6LNjaJo1g8KBbjbPIb?mode=gi_t', brans:'Kanatlı', sehir:'Türkiye'},
  {name:' VeTalent Bursa',   link:'https://chat.whatsapp.com/BkMZvlHJvqZD64w16Nw4hV?mode=gi_t', brans:'Gıda',    sehir:'Türkiye'},
  {name:'VeTalent Belediye-Kamu ',      link:'https://chat.whatsapp.com/BtO9CHnCpFC3ayk9wVxoGi?mode=gi_t', brans:'Çiftlik', sehir:'Türkiye'},
  {name:'VeTalent Antalya',      link:'https://chat.whatsapp.com/DM6j9ZJVXVxCewi0QyfYmS?mode=gi_t', brans:'İlaç',    sehir:'Türkiye'},
  {name:'VeTalent izmir',  link:'https://chat.whatsapp.com/LYU8oUJg15eJAjNHecrTjR?mode=gi_t', brans:'Lab',     sehir:'Türkiye'},
  {name:'VeTalent Ankara',      link:'https://chat.whatsapp.com/D3qVdCczg958plxoUPaRF1?mode=gi_t', brans:'Gece',    sehir:'İstanbul'},
  {name:'VeTalent İstanbul',     link:'https://chat.whatsapp.com/L6aKbK8LFTqAHQoaMRS7AC?mode=gi_t', brans:'Staj',    sehir:'Türkiye'},
  {name:'VeTalent istihdam',         link:'https://chat.whatsapp.com/CqMVj0LJwLR36hhGHyynIY?mode=gi_t', brans:'Genel',   sehir:'İstanbul'},
];

// ─── MAAŞ SEÇENEKLERİ ───────────────────────────────────────
const MAAS_OPTS = [
  '50.000 TL - 60.000 TL',
  '60.000 TL - 75.000 TL',
  '75.000 TL - 90.000 TL',
  '90.000 TL - 110.000 TL',
  '110.000 TL ve Üzeri',
  'Oda Maaşı (Resmi Rakam)',
  'Yüz yüze görüşülecektir',
];

// ─── BRANŞ LİSTESİ (Zenginleştirilmiş) ──────────────────────
const BRANS_LIST = [
  {l:'🟢 Klinik/Pet',       c:''},
  {l:'🟢 Klinik-Cerrahi',   c:''},
  {l:'🌙 Gece/Acil',         c:'org'},
  {l:'🟠 Gıda/Denetim',     c:'ice'},
  {l:'🔵 İlaç/Saha',        c:''},
  {l:'🔵 Teknik-Satış',     c:''},
  {l:'🟡 Kanatlı-Tavuk',    c:''},
  {l:'🟡 Kanatlı-Hindi',    c:''},
  {l:'🟣 Lab/Tanı',         c:'pur'},
  {l:'🔴 Çiftlik/Büyükbaş', c:''},
  {l:'🩺 Pratisyen',        c:''},
  {l:'🔬 USG/Görüntüleme',  c:'pur'},
];
const DENEYIM  = ['Yeni Mezun','1-3 Yıl','3-5 Yıl','5+'];
const CALISMA  = ['Tam Zamanlı','Yarı Zamanlı','Nöbet Usulü','Gece Nöbet'];
const IMKAN    = ['🏠 Lojman','🍽️ Yemek','💰 Prim','📋 Tam Sigorta','🚗 Araç'];

const SEKTÖR_MAP = {
  'klinik':     {cls:'sek-klinik',  renk:'#2d5a27', ico:'🟢', label:'Klinik'},
  'pet':        {cls:'sek-klinik',  renk:'#2d5a27', ico:'🟢', label:'Klinik'},
  'gıda':       {cls:'sek-gida',    renk:'#e67e22', ico:'🟠', label:'Gıda'},
  'gida':       {cls:'sek-gida',    renk:'#e67e22', ico:'🟠', label:'Gıda'},
  'ilaç':       {cls:'sek-ilac',    renk:'#2980b9', ico:'🔵', label:'İlaç'},
  'ilac':       {cls:'sek-ilac',    renk:'#2980b9', ico:'🔵', label:'İlaç'},
  'kanatlı':    {cls:'sek-kanatli', renk:'#c8a000', ico:'🟡', label:'Kanatlı'},
  'kanatli':    {cls:'sek-kanatli', renk:'#c8a000', ico:'🟡', label:'Kanatlı'},
  'tavuk':      {cls:'sek-kanatli', renk:'#c8a000', ico:'🟡', label:'Kanatlı'},
  'lab':        {cls:'sek-lab',     renk:'#8e44ad', ico:'🟣', label:'Lab'},
  'laboratuvar':{cls:'sek-lab',     renk:'#8e44ad', ico:'🟣', label:'Lab'},
  'çiftlik':    {cls:'sek-ciftlik', renk:'#c0392b', ico:'🔴', label:'Çiftlik'},
  'ciftlik':    {cls:'sek-ciftlik', renk:'#c0392b', ico:'🔴', label:'Çiftlik'},
  'büyükbaş':   {cls:'sek-ciftlik', renk:'#c0392b', ico:'🔴', label:'Çiftlik'},
};

// ─── STATE ──────────────────────────────────────────────────
let all = [], nobetData = [], stajData = [], curPg = 'ilanlar';
let sortAsc = false, kvkk = false, adminOk = false;
let saved   = JSON.parse(localStorage.getItem('vt_s') || '[]');
let eslesmeMap = {};
let zkSt = {b:[], d:'', c:'', i:[]};
let zkSektor = '';
let ssQuery = '';

// ─── PWA ────────────────────────────────────────────────────
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('service-worker.js').catch(function(){});
  });
}

// ─── WA GUARD MODAL ─────────────────────────────────────────
function waGo(msg) {
  var url = msg
    ? 'https://wa.me/' + _w + '?text=' + msg
    : 'https://wa.me/' + _w;
  showWaModal(function() { window.open(url, '_blank'); });
}

function showWaModal(cb) {
  var ov = document.createElement('div');
  ov.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.78);z-index:9999;display:flex;align-items:flex-end;justify-content:center';
  var inner = document.createElement('div');
  inner.style.cssText = 'background:#0f2318;border-radius:24px 24px 0 0;border:1px solid rgba(52,201,122,.3);width:100%;max-width:430px;padding:22px 20px 42px';
  inner.innerHTML = '<div style="width:34px;height:4px;background:rgba(52,201,122,.25);border-radius:4px;margin:0 auto 16px"></div>'
    + '<div style="font-family:\'Syne\',sans-serif;font-size:15px;font-weight:800;margin-bottom:6px">💬 Yönlendirme Onayı</div>'
    + '<div style="font-size:12px;color:#6b9478;margin-bottom:20px;line-height:1.6"><b style="color:#b8d4c4">VeTalent / İVHP Platformu</b> yöneticisine yönlendiriliyorsunuz.<br>Devam etmek istiyor musunuz?</div>'
    + '<button id="wa-ok" style="width:100%;background:#25d366;color:#fff;border:none;border-radius:12px;padding:13px;font-size:14px;font-weight:800;cursor:pointer;font-family:inherit;margin-bottom:8px">✅ Evet, Devam Et</button>'
    + '<button id="wa-cl" style="width:100%;background:transparent;color:#6b9478;border:none;padding:9px;font-size:12px;font-weight:600;cursor:pointer;font-family:inherit">İptal</button>';
  ov.appendChild(inner);
  document.body.appendChild(ov);
  document.getElementById('wa-ok').onclick = function() { cb(); document.body.removeChild(ov); };
  document.getElementById('wa-cl').onclick = function() { document.body.removeChild(ov); };
  ov.onclick = function(e) { if (e.target === ov) document.body.removeChild(ov); };
}

// ─── CANLI SAAT ─────────────────────────────────────────────
function startClock() {
  var AY = ['Oca','Şub','Mar','Nis','May','Haz','Tem','Ağu','Eyl','Eki','Kas','Ara'];
  function tick() {
    var n = new Date();
    var h = String(n.getHours()).padStart(2,'0');
    var m = String(n.getMinutes()).padStart(2,'0');
    var s = String(n.getSeconds()).padStart(2,'0');
    var te = document.getElementById('ct-time');
    var de = document.getElementById('ct-date');
    if (te) te.textContent = h + ':' + m + ':' + s;
    if (de) de.textContent = n.getDate() + ' ' + AY[n.getMonth()];
  }
  tick();
  setInterval(tick, 1000);
}

// ─── FETCH — Google Sheets ───────────────────────────────────
async function fetchAll() {
  try {
    var url = 'https://docs.google.com/spreadsheets/d/' + SHEET_ID + '/gviz/tq?tqx=out:json&sheet=ivhp%20istihdam&t=' + Date.now();
    var r = await fetch(url);
    var t = await r.text();
    var m = t.match(/google\.visualization\.Query\.setResponse\(([\s\S]*?)\);/);
    if (!m) throw new Error('Parse hatası');
    var j = JSON.parse(m[1]);
    var raw = (j.table.rows || []).slice(1).map(function(row) {
      var c = row.c;
      var v = function(i) { return (c[i] && c[i].v) ? String(c[i].v).trim() : ''; };
      return {
        z:v(0), tip:v(1), klinik:v(2), yetkili:v(3), sehir:v(4),
        faaliyet:v(5), deneyim:v(6), pozisyon:v(7), konaklama:v(8),
        calisma:v(9), maas:v(10), uzmanlik:v(11), tel:v(12),
        isim:v(13), cinsiyet:v(14), meslek:v(15), hkSehir:v(16),
        hkPoz:v(17), hkDeneyim:v(18), hkCalisma:v(19), hkMaas:v(20),
        hkUzmanlik:v(21), hkTel:v(22), durum:v(24), sektor:v(25)
      };
    }).filter(function(r) { return r.tip; });
    all = raw.filter(function(r) { return r.durum.toLowerCase() === 'onaylandı'; });
    hesaplaEslesme();
    setConn(true);
    renderAll();
    upCounts();
  } catch(e) {
    console.warn('[VT] fetchAll hata:', e.message);
    setConn(false);
    fallback();
  }
}

async function fetchNobet() {
  try {
    var url = 'https://docs.google.com/spreadsheets/d/' + SHEET_ID + '/gviz/tq?tqx=out:json&sheet=n%C3%B6bet%20takas&t=' + Date.now();
    var r = await fetch(url), t = await r.text();
    var m = t.match(/google\.visualization\.Query\.setResponse\(([\s\S]*?)\);/);
    if (!m) return;
    var j = JSON.parse(m[1]);
    nobetData = (j.table.rows || []).slice(1).map(function(row) {
      var c = row.c, v = function(i) { return (c[i]&&c[i].v) ? String(c[i].v).trim() : ''; };
      return {z:v(0), ad:v(1), tel:v(2), klinik:v(3), tarih:v(4), sehir:v(5), aciklama:v(6)};
    }).filter(function(r) { return r.ad; });
    renderNobet();
    upCounts();
  } catch(e) {}
}

async function fetchStaj() {
  try {
    var url = 'https://docs.google.com/spreadsheets/d/' + SHEET_ID + '/gviz/tq?tqx=out:json&sheet=STAJ_ILANLARI&t=' + Date.now();
    var r = await fetch(url), t = await r.text();
    var m = t.match(/google\.visualization\.Query\.setResponse\(([\s\S]*?)\);/);
    if (!m) return;
    var j = JSON.parse(m[1]);
    stajData = (j.table.rows || []).slice(1).map(function(row) {
      var c = row.c, v = function(i) { return (c[i]&&c[i].v) ? String(c[i].v).trim() : ''; };
      return {id:v(0), baslik:v(1), sirket:v(2), brans:v(3), sehir:v(4), baslangic:v(5), bitis:v(6), stajTuru:v(7), link:v(8), aciklama:v(9)};
    }).filter(function(r) { return r.baslik; });
    if (curPg === 'araclar') renderAraclar();
  } catch(e) {}
}

function setConn(ok) {
  var row = document.getElementById('connRow');
  var dot = document.getElementById('cdot');
  var txt = document.getElementById('ctxt');
  if (!row) return;
  if (ok) {
    row.style.display = 'flex';
    if (dot) dot.style.background = 'var(--green)';
    if (txt) txt.textContent = 'Google Sheets bağlı ✓';
  } else {
    row.style.display = 'none';
  }
}

// ─── EŞLEŞTİRME MOTORU ──────────────────────────────────────
function hesaplaEslesme() {
  eslesmeMap = {};
  var isveren  = all.filter(function(r) { return r.tip.includes('İŞVEREN'); });
  var hekimler = all.filter(function(r) { return r.tip.includes('ARIY'); });
  isveren.forEach(function(isv) {
    var gi  = all.indexOf(isv);
    var iS  = norm(isv.sehir);
    var iB  = norm(isv.faaliyet + ' ' + isv.uzmanlik + ' ' + (isv.sektor || ''));
    var eslesme = false;
    hekimler.forEach(function(hk) {
      var hS = norm(hk.hkSehir);
      var hB = norm(hk.hkUzmanlik + ' ' + hk.hkPoz + ' ' + hk.meslek);
      var sUyum = iS && hS && (hS.includes(iS.split(',')[0].trim()) || iS.includes(hS.split(',')[0].trim()));
      var bUyum = iB && hB && iB.split(' ').some(function(w) { return w.length > 3 && hB.includes(w); });
      if (sUyum || bUyum) eslesme = true;
    });
    if (eslesme) eslesmeMap[gi] = true;
  });
}

// ─── calculateMatchScore ─────────────────────────────────────
function calculateMatchScore(ilan) {
  try {
    var prof = loadCVProfile();
    if (!prof) return 0;
    var score = 0, total = 0;
    if (ilan.sehir && prof.sehir) {
      total += 30;
      if (norm(ilan.sehir).includes(norm(prof.sehir)) || norm(prof.sehir).includes(norm(ilan.sehir))) score += 30;
    }
    if (ilan.uzmanlik && prof.brans) {
      total += 35;
      var ib = norm(ilan.uzmanlik + ' ' + ilan.faaliyet);
      var pb = norm(prof.brans);
      if (pb.split(',').some(function(b) { return ib.includes(b.trim()); })) score += 35;
    }
    if (ilan.deneyim && prof.deneyim) {
      total += 20;
      if (norm(ilan.deneyim).includes(norm(prof.deneyim).split('-')[0])) score += 20;
      else score += 8;
    }
    if (ilan.maas && prof.maas) {
      total += 15;
      score += 8; // partial
    }
    return total > 0 ? Math.round(score / total * 100) : 0;
  } catch(e) { return 0; }
}

// ─── CV YÖNETIMI ─────────────────────────────────────────────
function loadCVProfile()  { return JSON.parse(localStorage.getItem('vt_cv_profile') || 'null'); }
function saveCVProfile(p) { localStorage.setItem('vt_cv_profile', JSON.stringify(p)); }
function isCVLoaded()     { return !!localStorage.getItem('vt_cv_profile'); }
function getCVCompletion() {
  var p = loadCVProfile();
  if (!p) return 0;
  var fields = [p.ad, p.tel, p.sehir, p.brans, p.deneyim, p.maas, p.uzmanlik, p.calisma];
  return Math.round(fields.filter(Boolean).length / fields.length * 100);
}

// ─── HIZLI BAŞVUR ────────────────────────────────────────────
function quickApplyToJob(ilanIdx) {
  if (!isCVLoaded()) {
    toast('⚠️ Önce CV profilini doldur!');
    openCVModal();
    return;
  }
  var d = all[ilanIdx];
  if (!d) return;
  var apps = JSON.parse(localStorage.getItem('vt_apps') || '[]');
  if (apps.find(function(a) { return a.idx === ilanIdx; })) {
    toast('✅ Bu ilana zaten başvurdun!');
    return;
  }
  var skor = calculateMatchScore(d);
  var prof = loadCVProfile();
  apps.push({idx:ilanIdx, klinik:d.klinik||'—', sehir:d.sehir||'—', tarih:new Date().toLocaleDateString('tr-TR'), skor:skor});
  localStorage.setItem('vt_apps', JSON.stringify(apps));
  var uid = localStorage.getItem('vt_uid') || 'anonim';
  fetch(SCRIPT_URL, {method:'POST', mode:'no-cors', headers:{'Content-Type':'application/json'},
    body: JSON.stringify({tip:'basvuru', userId:uid, ilanId:'I_'+ilanIdx, motivasyon:'Hızlı Başvuru — Eşleşme %'+skor})
  }).catch(function(){});
  var msg = encodeURIComponent(
    '🚀 HIZLI BAŞVURU [VeTalent/İVHP]\n'
    + '🏥 ' + (d.klinik||'—') + '\n'
    + '📍 ' + (d.sehir||'—') + '\n'
    + '💼 ' + (d.pozisyon||d.faaliyet||'—') + '\n\n'
    + '👤 ' + (prof.ad||'—') + '\n'
    + '📱 ' + (prof.tel||'—') + '\n'
    + '🏙️ ' + (prof.sehir||'—') + '\n'
    + '🏥 Branş: ' + (prof.brans||'—') + '\n'
    + '⏱️ Tecrübe: ' + (prof.deneyim||'—') + '\n'
    + '💰 Maaş Bek.: ' + (prof.maas||'—') + '\n\n'
    + '✅ VeTalent/İVHP Platformu'
  );
  toast('🚀 Başvuru hazır! WhatsApp açılıyor...');
  setTimeout(function() { waGo(msg); }, 800);
}

function quickApplyAll() {
  if (!isCVLoaded()) { toast('⚠️ Önce CV profilini doldur!'); openCVModal(); return; }
  var isv = all.filter(function(r) { return r.tip.includes('İŞVEREN'); });
  if (!isv.length) { toast('Henüz ilan yok.'); return; }
  var best = isv.map(function(d) { return {d:d, skor:calculateMatchScore(d)}; })
    .sort(function(a,b) { return b.skor - a.skor; })[0];
  if (best) {
    toast('🚀 En uygun: ' + (best.d.klinik||'—') + ' (%' + best.skor + ')');
    setTimeout(function() { quickApplyToJob(all.indexOf(best.d)); }, 1200);
  }
}

// ─── CV MODAL ────────────────────────────────────────────────
function openCVModal() {
  var prof = loadCVProfile() || {};
  var pct  = getCVCompletion();
  var fields = [
    {k:'ad',       l:'👤 Ad Soyad',         ph:'Dr. Adınız'},
    {k:'tel',      l:'📱 Telefon',           ph:'05XX XXX XX XX'},
    {k:'sehir',    l:'📍 Şehir',             ph:'İstanbul'},
    {k:'brans',    l:'🏥 Branş',             ph:'Dahiliye, Klinik vb.'},
    {k:'deneyim',  l:'⏱️ Tecrübe',          ph:'3 Yıl'},
    {k:'maas',     l:'💰 Maaş Beklentisi',   ph:'75.000 TL - 90.000 TL'},
    {k:'uzmanlik', l:'🔬 Uzmanlık',          ph:'USG, Ortopedi vb.'},
    {k:'calisma',  l:'⚡ Çalışma Tercihi',  ph:'Tam Zamanlı'},
  ];
  var inputsHtml = fields.map(function(f) {
    return '<div style="margin-bottom:10px">'
      + '<div style="font-size:10px;font-weight:800;color:#6b9478;text-transform:uppercase;letter-spacing:.07em;margin-bottom:5px">' + f.l + '</div>'
      + '<input id="cv-' + f.k + '" type="text" value="' + (prof[f.k]||'') + '" placeholder="' + f.ph + '" '
      + 'style="width:100%;background:#152b1c;border:1.5px solid rgba(52,201,122,.2);border-radius:10px;padding:10px 12px;color:#e4f2ea;font-size:13px;font-family:inherit;outline:none">'
      + '</div>';
  }).join('');
  var barFill = '<div style="height:6px;background:rgba(52,201,122,.15);border-radius:6px;overflow:hidden;margin-bottom:4px">'
    + '<div style="height:100%;width:' + pct + '%;background:var(--green);border-radius:6px"></div></div>'
    + '<div style="font-size:10px;color:#6b9478;margin-bottom:14px">Tamamlanma: %' + pct + '</div>';
  var ov = document.createElement('div');
  ov.id = 'cv-modal-ov';
  ov.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.82);z-index:8888;display:flex;align-items:flex-end;justify-content:center';
  var inner = document.createElement('div');
  inner.style.cssText = 'background:#0f2318;border-radius:24px 24px 0 0;border:1px solid rgba(52,201,122,.3);width:100%;max-width:430px;max-height:88vh;overflow-y:auto;padding:20px 18px 44px';
  inner.innerHTML = '<div style="width:34px;height:4px;background:rgba(52,201,122,.2);border-radius:4px;margin:0 auto 14px"></div>'
    + '<div style="font-family:\'Syne\',sans-serif;font-size:16px;font-weight:800;margin-bottom:4px">📄 CV Profili</div>'
    + '<div style="font-size:11px;color:#6b9478;margin-bottom:12px">Profilini doldurun, tek tıkla başvurun.</div>'
    + barFill + inputsHtml
    + '<button onclick="saveCVFromModal()" style="width:100%;background:var(--green);color:#000;border:none;border-radius:12px;padding:13px;font-size:14px;font-weight:800;cursor:pointer;font-family:inherit;margin-bottom:8px">💾 Kaydet & Güncelle</button>'
    + '<button onclick="document.getElementById(\'cv-modal-ov\').remove()" style="width:100%;background:transparent;color:#6b9478;border:none;padding:9px;font-size:12px;cursor:pointer;font-family:inherit">İptal</button>';
  ov.appendChild(inner);
  document.body.appendChild(ov);
  ov.onclick = function(e) { if (e.target === ov) ov.remove(); };
}

function saveCVFromModal() {
  var keys = ['ad','tel','sehir','brans','deneyim','maas','uzmanlik','calisma'];
  var prof = {};
  keys.forEach(function(k) {
    var el = document.getElementById('cv-' + k);
    if (el) prof[k] = el.value.trim();
  });
  saveCVProfile(prof);
  var uid = localStorage.getItem('vt_uid') || ('U_' + Date.now());
  localStorage.setItem('vt_uid', uid);
  fetch(SCRIPT_URL, {method:'POST', mode:'no-cors', headers:{'Content-Type':'application/json'},
    body: JSON.stringify({tip:'user_save', userId:uid, adSoyad:prof.ad, sehir:prof.sehir, brans:prof.brans, deneyim:prof.deneyim, maas:prof.maas, profil:getCVCompletion()})
  }).catch(function(){});
  var ov = document.getElementById('cv-modal-ov');
  if (ov) ov.remove();
  toast('✅ CV profili kaydedildi!');
  if (curPg === 'araclar') renderAraclar();
  renderHosgeldin();
}

// ─── ACİL MODAL ──────────────────────────────────────────────
function openAcilModal() {
  var ov = document.createElement('div');
  ov.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.82);z-index:9999;display:flex;align-items:flex-end;justify-content:center';
  var inner = document.createElement('div');
  inner.style.cssText = 'background:#0f2318;border-radius:24px 24px 0 0;border:1px solid rgba(192,57,43,.4);width:100%;max-width:430px;padding:20px 18px 44px';
  inner.innerHTML = '<div style="width:34px;height:4px;background:rgba(192,57,43,.3);border-radius:4px;margin:0 auto 14px"></div>'
    + '<div style="font-family:\'Syne\',sans-serif;font-size:16px;font-weight:800;margin-bottom:4px;color:#e74c3c">🚨 Acil / Gece Nöbeti</div>'
    + '<div style="font-size:11px;color:#6b9478;margin-bottom:18px">Ne yapmak istiyorsunuz?</div>'
    + '<div style="display:flex;flex-direction:column;gap:9px">'
    + '<button onclick="this.closest(\'div[style]\').parentElement.remove();openForm(\'isveren\')" style="background:linear-gradient(135deg,#c0392b,#e74c3c);color:#fff;border:none;border-radius:13px;padding:14px;font-size:13px;font-weight:800;cursor:pointer;font-family:inherit;text-align:left;display:flex;align-items:center;gap:10px"><span style="font-size:22px">🏥</span><div><div style="font-weight:800">Acil Hekim Arıyorum</div><div style="font-size:10px;opacity:.8;margin-top:2px">İşveren — Yarın başlayacak</div></div></button>'
    + '<button onclick="this.closest(\'div[style]\').parentElement.remove();openForm(\'hekim\')" style="background:rgba(192,57,43,.18);color:#e74c3c;border:1.5px solid rgba(192,57,43,.4);border-radius:13px;padding:14px;font-size:13px;font-weight:800;cursor:pointer;font-family:inherit;text-align:left;display:flex;align-items:center;gap:10px"><span style="font-size:22px">👩‍⚕️</span><div><div style="font-weight:800">Acil Nöbet Tutabilirim</div><div style="font-size:10px;opacity:.8;margin-top:2px">Hekim — Bugün / Yarın müsaitim</div></div></button>'
    + '<button onclick="this.closest(\'div[style]\').parentElement.remove();goPage(\'ilanlar\')" style="background:rgba(52,201,122,.1);color:var(--green);border:1.5px solid rgba(52,201,122,.25);border-radius:13px;padding:14px;font-size:13px;font-weight:800;cursor:pointer;font-family:inherit;text-align:left;display:flex;align-items:center;gap:10px"><span style="font-size:22px">🔍</span><div><div style="font-weight:800">Acil İlanları Gör</div><div style="font-size:10px;opacity:.8;margin-top:2px">Gece nöbetli ilanları filtrele</div></div></button>'
    + '</div>'
    + '<button onclick="this.parentElement.parentElement.remove()" style="width:100%;background:transparent;color:#6b9478;border:none;padding:12px 0 0;font-size:12px;cursor:pointer;font-family:inherit">İptal</button>';
  ov.appendChild(inner);
  document.body.appendChild(ov);
  ov.onclick = function(e) { if (e.target === ov) ov.remove(); };
}

// ─── HELPERS ─────────────────────────────────────────────────
function norm(s) {
  return (s||'').toLowerCase()
    .replace(/[İI]/g,'i').replace(/ı/g,'i')
    .replace(/[Ğğ]/g,'g').replace(/[Üü]/g,'u')
    .replace(/[Şş]/g,'s').replace(/[Öö]/g,'o').replace(/[Çç]/g,'c');
}
function srStr() {
  return norm(Array.prototype.slice.call(arguments).join(' '));
}
function gv(id) { return (document.getElementById(id)||{}).value||''; }
function sT(id, v) { var e = document.getElementById(id); if (e) e.textContent = v; }
function toast(msg) {
  var t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('on');
  setTimeout(function() { t.classList.remove('on'); }, 2500);
}
function setRC(n, l) { sT('rc', n ? n + ' ' + l + ' bulundu' : ''); }

function ageStr(z) {
  if (!z) return '';
  try {
    var m = z.match(/(\d{2})\.(\d{2})\.(\d{4})/);
    if (!m) return '';
    var d    = new Date(+m[3], +m[2]-1, +m[1]);
    var diff = Math.floor((Date.now() - d) / 864e5);
    if (diff <= 0) return '🆕 Bugün';
    if (diff <= 3) return '🆕 ' + diff + ' gün önce';
    if (diff <= 7) return diff + ' gün önce';
    if (diff <= 30) return Math.floor(diff/7) + ' hafta önce';
    return Math.floor(diff/30) + ' ay önce';
  } catch(e) { return ''; }
}

function freshPct(z) {
  if (!z) return 100;
  try {
    var m = z.match(/(\d{2})\.(\d{2})\.(\d{4})/);
    if (!m) return 100;
    var d = new Date(+m[3], +m[2]-1, +m[1]);
    return Math.max(0, Math.round((1 - Math.floor((Date.now()-d)/864e5)/30)*100));
  } catch(e) { return 100; }
}

function freshBar(z) {
  var p   = freshPct(z);
  var col = p > 60 ? 'var(--green)' : p > 30 ? 'var(--yellow)' : 'var(--red)';
  var w   = p === 0 ? '<div class="fwarn">⚠️ A-Takımı Denetiminde — 30 gün doldu</div>' : '';
  return '<div class="fbar"><div class="ffill" style="width:' + p + '%;background:' + col + '"></div></div>'
    + '<div class="flbl" style="color:' + col + '">Tazelik %' + p + '</div>' + w;
}

function salPct(m) {
  if (!m) return 35;
  var M = m.replace(/\./g,'').toLowerCase();
  if (M.includes('110')) return 90;
  if (M.includes('90'))  return 75;
  if (M.includes('75'))  return 62;
  if (M.includes('60'))  return 50;
  if (M.includes('50'))  return 38;
  return 35;
}

function maskName(n) {
  if (!n) return '—';
  return n.trim().split(' ').map(function(p) {
    return p.length <= 1 ? p : p[0] + '***';
  }).join(' ');
}

function mktag(s, c) {
  if (!s) return '';
  return s.split(',').slice(0,2).map(function(u) {
    return '<span class="tag ' + c + '">' + u.trim() + '</span>';
  }).join('');
}

function getSek(faaliyet, uzmanlik, sektor) {
  var s = norm((faaliyet||'') + ' ' + (uzmanlik||'') + ' ' + (sektor||''));
  for (var key in SEKTÖR_MAP) {
    if (s.includes(key)) return SEKTÖR_MAP[key];
  }
  return {cls:'sek-klinik', renk:'#2d5a27', ico:'🟢', label:'Klinik'};
}

function aBnr(tp, ico, t1, t2) {
  return '<div class="abtn" onclick="openForm(\'' + tp + '\')">'
    + '<div class="aico">' + ico + '</div>'
    + '<div class="att"><div class="at1">' + t1 + '</div><div class="at2">' + t2 + '</div></div>'
    + '<div class="aarr">›</div></div>';
}

function empBlk(ico, t, s) {
  return '<div class="emp"><div class="empi">' + ico + '</div><h3>' + t + '</h3><p>' + s + '</p></div>';
}

function maasDD(id) {
  id = id || 'f-maas';
  var opts = MAAS_OPTS.map(function(o) { return '<option>' + o + '</option>'; }).join('');
  return '<select class="maas-sel" id="' + id + '"><option value="">Seçiniz...</option>' + opts + '</select>';
}

// ─── HOŞ GELDİN + ÖNERİLEN ──────────────────────────────────
function renderHosgeldin() {
  var el = document.getElementById('hosgeldinArea');
  if (!el) return;
  var prof   = loadCVProfile();
  var ad     = prof ? (prof.ad || '').split(' ')[0] : '';
  var isvLen = all.filter(function(r) { return r.tip.includes('İŞVEREN'); }).length;
  el.innerHTML = '<div class="hosgeldin-banner">'
    + '<div style="font-family:\'Syne\',sans-serif;font-size:14px;font-weight:800;margin-bottom:2px;color:#fff">👋 Merhaba' + (ad ? ' ' + ad : '') + '!</div>'
    + '<div style="font-size:11px;color:rgba(255,255,255,.75)">Platform\'da <b>' + isvLen + '</b> aktif işveren ilanı var.</div>'
    + '</div>';

  var onEl = document.getElementById('onerilenArea');
  if (!onEl) return;
  if (!prof || !all.length) { onEl.innerHTML = ''; return; }
  var isv = all.filter(function(r) { return r.tip.includes('İŞVEREN'); });
  var scored = isv.map(function(d) { return {d:d, skor:calculateMatchScore(d)}; })
    .filter(function(x) { return x.skor >= 20; })
    .sort(function(a,b) { return b.skor - a.skor; })
    .slice(0, 3);
  if (!scored.length) { onEl.innerHTML = ''; return; }
  var html = '<div style="font-size:11px;font-weight:800;color:var(--muted);text-transform:uppercase;letter-spacing:.07em;padding:8px 18px 4px">⭐ Sana Özel Önerilen İlanlar</div>';
  scored.forEach(function(x) {
    var d = x.d; var gi = all.indexOf(d);
    var sek = getSek(d.faaliyet, d.uzmanlik, d.sektor);
    html += '<div style="margin:0 14px 8px;background:var(--card);border:1px solid var(--border);border-radius:14px;padding:12px;cursor:pointer;border-left:3px solid ' + sek.renk + '" onclick="goPage(\'ilanlar\');setTimeout(function(){detIsv(' + gi + ')},300)">'
      + '<div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:6px">'
      + '<div><div style="font-size:12px;font-weight:700">' + (d.klinik||'Klinik') + '</div>'
      + '<div style="font-size:10px;color:var(--muted)">' + (d.pozisyon||d.faaliyet||'—') + ' · 📍 ' + (d.sehir||'—') + '</div></div>'
      + '<div style="background:linear-gradient(135deg,#1a7a4a,var(--green));color:#000;font-size:10px;font-weight:800;padding:3px 8px;border-radius:7px;white-space:nowrap">%' + x.skor + ' eşleşme</div>'
      + '</div><div style="font-size:11px;color:var(--muted)">' + (d.maas||'Maaş görüşülür') + '</div></div>';
  });
  onEl.innerHTML = html;
}

// ─── SPLASH ARAMA ────────────────────────────────────────────
function onSplashSearch(q) {
  ssQuery = norm(q);
  var af = document.getElementById('activeFilters');
  if (!af) return;
  if (!ssQuery) { af.innerHTML = ''; return; }
  var res = all.filter(function(d) {
    return srStr(d.klinik, d.sehir, d.uzmanlik, d.pozisyon, d.faaliyet, d.isim, d.meslek, d.hkSehir, d.hkUzmanlik).includes(ssQuery);
  });
  if (res.length > 0) {
    af.innerHTML = '<div style="display:flex;align-items:center;gap:8px;padding:0 18px">'
      + '<div style="font-size:11px;color:var(--green);font-weight:700">' + res.length + ' ilan eşleşti</div>'
      + '<div style="font-size:11px;background:var(--card);border:1px solid var(--border);border-radius:20px;padding:4px 12px;cursor:pointer;color:var(--muted)" onclick="goPage(\'ilanlar\')">Göster →</div>'
      + '</div>';
  } else {
    af.innerHTML = '<div style="font-size:11px;color:var(--red);padding:0 18px 4px">Eşleşen ilan yok</div>';
  }
}

// ─── RENDER İŞVEREN ──────────────────────────────────────────
function renderIlanlar() {
  var el = document.getElementById('pg-ilanlar');
  if (!el) return;
  var isv = all.filter(function(r) { return r.tip.includes('İŞVEREN'); });
  var arr = sortAsc ? isv.slice() : isv.slice().reverse();
  var h = aBnr('isveren', '➕', 'İlan Ver', 'Pozisyonunuzu ekleyin');
  if (!arr.length) {
    h += empBlk('🏥', 'Henüz ilan yok', 'İlk işveren ilanı yakında.');
  } else {
    arr.forEach(function(d) {
      var gi = all.indexOf(d);
      var id = 'i_' + gi;
      var sv = saved.includes(id);
      var a  = ageStr(d.z);
      var isNew = a.includes('🆕');
      var isGece = norm(d.faaliyet + d.calisma).includes('gece');
      var sek = getSek(d.faaliyet, d.uzmanlik, d.sektor);
      var eslesme = eslesmeMap[gi];
      var rozetHtml = '<div class="rozet-row">';
      if (isNew)    rozetHtml += '<span class="rozet-yeni">🟢 Yeni</span>';
      if (isGece)   rozetHtml += '<span class="rozet-acil">🔴 Acil/Gece</span>';
      rozetHtml += '<span class="rozet-dogrulandi">⭐ Doğrulanmış</span></div>';
      var card = '<div class="jc ' + sek.cls + (isGece?' glow-neon':'') + '" '
        + 'data-s="' + srStr(d.klinik, d.sehir, d.uzmanlik, d.pozisyon, d.faaliyet, d.calisma, d.deneyim, d.sektor||'') + '" '
        + 'onclick="detIsv(' + gi + ')" style="padding-top:' + (eslesme?'18':'13') + 'px">';
      if (eslesme) {
        card += '<div style="position:absolute;top:-8px;left:12px;background:linear-gradient(135deg,#ff6b00,#ff9f43);color:#fff;font-size:9px;font-weight:800;padding:3px 9px;border-radius:6px;box-shadow:0 2px 8px rgba(255,107,0,.4);white-space:nowrap;z-index:2">🔥 Eşleşme Var</div>';
      }
      card += rozetHtml;
      card += '<div class="ctop">'
        + '<div class="cav" style="background:' + sek.renk + '22">' + sek.ico + '</div>'
        + '<div class="cinfo">'
        + '<div class="cname">' + (d.klinik||'Klinik') + (isNew?'<span class="nb">YENİ</span>':'') + ' <span class="sek-badge" style="background:' + sek.renk + '22;color:' + sek.renk + '">' + sek.label + '</span></div>'
        + '<div class="cpos">' + (d.pozisyon||d.faaliyet||'—') + '</div>'
        + '</div>'
        + '<div class="svb' + (sv?' on':'') + '" onclick="event.stopPropagation();tSave(\'' + id + '\',this)">' + (sv?'⭐':'☆') + '</div>'
        + '</div>';
      card += '<div class="salr"><div class="salv">' + (d.maas||'Görüşülür') + '</div>'
        + '<div class="salb"><div class="salf" style="width:' + salPct(d.maas) + '%"></div></div></div>';
      card += '<div class="ctags">';
      if (d.calisma) card += '<span class="tag t-b">' + d.calisma + '</span>';
      if (d.faaliyet) card += '<span class="tag t-g">' + d.faaliyet + '</span>';
      if (d.deneyim) card += '<span class="tag t-y">' + d.deneyim + '</span>';
      card += mktag(d.uzmanlik, 't-p') + '</div>';
      card += '<div class="cfoot">'
        + '<div class="cmeta"><div class="ccity">📍 ' + (d.sehir||'—') + '</div>' + (a?'<div class="cage">'+a+'</div>':'') + '</div>'
        + '<div class="cbtns">'
        + '<div class="bdet" onclick="event.stopPropagation();detIsv(' + gi + ')">🔗 Detay</div>'
        + '<div class="bwa" onclick="event.stopPropagation();waGo()">💬 Yaz</div>'
        + '</div></div>';
      card += freshBar(d.z);
      card += '<div class="kart-meta"><span class="kart-meta-item">🕐 ' + (a||'Yeni') + '</span><span class="kart-meta-item aktif">✅ Aktif Alım</span></div>';
      card += '<button class="btn-hizli-basvur" onclick="event.stopPropagation();quickApplyToJob(' + gi + ')">🚀 Hızlı Başvur</button>';
      card += '</div>';
      h += card;
    });
  }
  el.innerHTML = h;
  setRC(arr.length, 'işveren ilanı');
}

// ─── RENDER HEKİM ────────────────────────────────────────────
function renderHekimler() {
  var el = document.getElementById('pg-hekimler');
  if (!el) return;
  var hk  = all.filter(function(r) { return r.tip.includes('ARIY'); });
  var arr = sortAsc ? hk.slice() : hk.slice().reverse();
  var h = aBnr('hekim', '➕', 'CV Kartı Ekle', 'Profilini ekle, klinikler seni bulsun');
  if (!arr.length) {
    h += empBlk('👩‍⚕️', 'Henüz hekim ilanı yok', 'İlk CV kartını ekle!');
  } else {
    arr.forEach(function(d) {
      var gi  = all.indexOf(d);
      var id  = 'h_' + gi;
      var sv  = saved.includes(id);
      var msk = maskName(d.isim);
      var a   = ageStr(d.z);
      var isNew = a.includes('🆕');
      var flds = [d.isim,d.cinsiyet,d.meslek,d.hkSehir,d.hkUzmanlik,d.hkMaas,d.hkCalisma,d.hkDeneyim];
      var pct  = Math.round(flds.filter(Boolean).length / flds.length * 100);
      var pc   = pct >= 80 ? 'var(--green)' : pct >= 50 ? 'var(--yellow)' : 'var(--red)';
      var sek  = getSek(d.hkPoz, d.hkUzmanlik, d.sektor);
      var uzList = (d.hkUzmanlik||'').split(',').filter(Boolean).slice(0,4);
      var pills = uzList.map(function(u) { return '<div class="spill">' + u.trim() + '</div>'; }).join('');
      var card = '<div class="jc ' + sek.cls + '" data-s="' + srStr(d.isim||'', d.hkSehir, d.hkUzmanlik, d.hkMaas, d.hkCalisma, d.cinsiyet, d.hkDeneyim, d.meslek||'') + '" onclick="detHk(' + gi + ')">';
      card += '<div class="ctop">'
        + '<div class="cav" style="background:' + sek.renk + '22">👩‍⚕️</div>'
        + '<div class="cinfo">'
        + '<div class="cname">' + msk + (isNew?'<span class="nb">YENİ</span>':'') + '</div>'
        + '<div class="cpos">' + (d.meslek||'Veteriner Hekim') + ' · ' + (d.hkDeneyim||'—') + '</div>'
        + '</div>'
        + '<div class="svb' + (sv?' on':'') + '" onclick="event.stopPropagation();tSave(\'' + id + '\',this)">' + (sv?'⭐':'☆') + '</div>'
        + '</div>';
      card += '<div class="pr"><div class="pb"><div class="pf" style="width:' + pct + '%;background:' + pc + '"></div></div><div class="pl" style="color:' + pc + '">%' + pct + '</div></div>';
      if (d.hkMaas) card += '<div class="salr"><div class="salv">' + d.hkMaas + '</div><div class="salb"><div class="salf" style="width:' + salPct(d.hkMaas) + '%"></div></div></div>';
      if (pills) card += '<div class="spills">' + pills + '</div>';
      card += '<div class="ctags">';
      if (d.hkCalisma) card += '<span class="tag t-b">' + d.hkCalisma + '</span>';
      if (d.hkSehir)   card += '<span class="tag t-g">' + d.hkSehir.split(',')[0] + '</span>';
      if (d.hkPoz)     card += '<span class="tag t-o">' + d.hkPoz + '</span>';
      card += '</div>';
      card += '<div class="cfoot">'
        + '<div class="cmeta"><div class="ccity">📍 ' + (d.hkSehir||'—') + '</div>' + (a?'<div class="cage">'+a+'</div>':'') + '</div>'
        + '<div class="cbtns">'
        + '<div class="bdet" onclick="event.stopPropagation();detHk(' + gi + ')">🔗 Detay</div>'
        + '<div class="bwa" onclick="event.stopPropagation();waGo()">💬 Yaz</div>'
        + '</div></div>';
      card += freshBar(d.z) + '</div>';
      h += card;
    });
  }
  el.innerHTML = h;
  setRC(arr.length, 'hekim CV kartı');
}

// ─── RENDER NÖBET ────────────────────────────────────────────
function renderNobet() {
  var el = document.getElementById('pg-nobet');
  if (!el) return;
  var h = '<div class="nhdr"><div class="nt">🔄 Nöbet Takası</div><div class="ns">Nöbetini değiştirmek mi istiyorsun? İlan ver, teklif al.</div></div>';
  h += aBnr('nobet', '🔄', 'Takas İlanı Ver', 'Nöbet tarihini paylaş');
  if (!nobetData.length) {
    h += empBlk('📋', 'Henüz takas ilanı yok', 'İlk ilanı sen ver!');
  } else {
    nobetData.forEach(function(d) {
      var nMsg = encodeURIComponent('🔄 NÖBET TAKİBİ TEKLİFİ\n📋 ' + maskName(d.ad) + ' adlı hekime teklif veriyorum.\n🏥 ' + (d.klinik||'—') + '\n📅 ' + (d.tarih||'—') + '\n📍 ' + (d.sehir||'—') + '\nDetayları görüşmek istiyorum.');
      h += '<div class="nbc">'
        + '<div class="nct"><div class="ncn">' + maskName(d.ad) + '</div><div class="ncb">' + (d.tarih||'Tarih yok') + '</div></div>'
        + '<div class="ncd">🏥 ' + (d.klinik||'—') + ' &nbsp;📍 ' + (d.sehir||'—') + '<br>' + (d.aciklama||'') + '</div>'
        + '<div class="nbc-btns">'
        + '<button class="ncw" onclick="waGo()">💬 İletişim</button>'
        + '<button class="ncw-teklif" onclick="waGo(\'' + nMsg + '\')">🤝 Teklif Ver</button>'
        + '</div></div>';
    });
  }
  el.innerHTML = h;
}

// ─── RENDER SAVED ────────────────────────────────────────────
function renderSaved() {
  var el = document.getElementById('pg-saved');
  if (!el) return;
  if (!saved.length) {
    el.innerHTML = '<div class="svempty"><div class="ei">📌</div><h3>Kayıtlı ilan yok</h3><p>İlanlardaki ⭐ ikonuna basarak kaydet.</p></div>';
    return;
  }
  var h = '';
  saved.forEach(function(id) {
    try {
      var parts = id.split('_');
      var tp = parts[0], ix = parseInt(parts[1]);
      var d = all[ix]; if (!d) return;
      var nm = tp==='i' ? (d.klinik||'Klinik') : maskName(d.isim);
      var sb = tp==='i' ? (d.pozisyon||d.faaliyet||'') : (d.meslek||'Veteriner Hekim');
      h += '<div class="jc" onclick="' + (tp==='i' ? 'detIsv('+ix+')' : 'detHk('+ix+')') + '">'
        + '<div class="ctop">'
        + '<div class="cav" style="background:rgba(52,201,122,.18)">' + (tp==='i'?'🏥':'👩‍⚕️') + '</div>'
        + '<div class="cinfo"><div class="cname">' + nm + '</div><div class="cpos">' + sb + '</div></div>'
        + '<div class="svb on" onclick="event.stopPropagation();tSave(\'' + id + '\',this)">⭐</div>'
        + '</div>'
        + '<div class="cfoot"><div class="ccity">📍 ' + (tp==='i'?(d.sehir||'—'):(d.hkSehir||'—')) + '</div>'
        + '<div class="bwa" onclick="event.stopPropagation();waGo()">💬 Yaz</div></div>'
        + '</div>';
    } catch(e) {}
  });
  el.innerHTML = h;
  setRC(saved.length, 'kayıtlı ilan');
}

// ─── RENDER SEKTÖR ───────────────────────────────────────────
function renderSector(s) {
  var el = document.getElementById('pg-sektor');
  if (!el) return;
  var L = {gida:'🟠 Gıda Firması', lab:'🟣 Laboratuvar', ilac:'🔵 İlaç Firması', gece:'🌙 Gece Vet.', kanatli:'🟡 Kanatlı', ciftlik:'🔴 Çiftlik', klinik:'🟢 Klinik/Pet'};
  var I = {gida:'🟠', lab:'🟣', ilac:'🔵', gece:'🌙', kanatli:'🟡', ciftlik:'🔴', klinik:'🟢'};
  el.innerHTML = aBnr('sektor_' + s, '➕', 'İlan Ver / Kaydol', 'Bu sektörde pozisyon ekle')
    + empBlk(I[s]||'🔬', L[s]||s, 'Bu sektörden henüz ilan yok.');
}

// ─── RENDER ARAÇLAR ──────────────────────────────────────────
function renderAraclar() {
  var el = document.getElementById('pg-araclar');
  if (!el) return;
  var pct = getCVCompletion();
  var cvLoaded = isCVLoaded();
  var stajHtml = '';
  var cats = [
    {key:'Klinik',   label:'🏥 Klinik Stajı',    ico:'🏥', bg:'rgba(45,90,39,.2)'},
    {key:'Gıda',    label:'🍖 Gıda Stajı',       ico:'🍖', bg:'rgba(230,126,34,.2)'},
    {key:'Çiftlik', label:'🌾 Çiftlik Stajı',     ico:'🌾', bg:'rgba(192,57,43,.2)'},
    {key:'Kanatli', label:'🐔 Kanatlı Stajı',     ico:'🐔', bg:'rgba(200,160,0,.2)'},
    {key:'Lab',     label:'🔬 Lab Stajı',         ico:'🔬', bg:'rgba(142,68,173,.2)'},
    {key:'Barınak', label:'🦴 Barınak Gönüllülüğü',ico:'🦴', bg:'rgba(167,139,250,.2)'},
  ];
  cats.forEach(function(cat) {
    var catData = stajData.filter(function(d) { return norm(d.brans||d.stajTuru||'').includes(norm(cat.key)); });
    stajHtml += '<div class="staj-cat">' + cat.label + '</div>';
    if (!catData.length) {
      stajHtml += '<div class="staj-empty">Bu kategoride henüz ilan yok.</div>';
    } else {
      catData.forEach(function(d) {
        var msg = encodeURIComponent('Merhaba [VeTalent/İVHP], ' + (d.baslik||'Staj') + ' ilanına başvurmak istiyorum. Şirket: ' + (d.sirket||'—') + ' Şehir: ' + (d.sehir||'—'));
        stajHtml += '<div class="iitem">'
          + '<div class="iiico" style="background:' + cat.bg + '">' + cat.ico + '</div>'
          + '<div class="iii"><div class="iin">' + (d.baslik||'Staj İlanı') + '</div>'
          + '<div class="iis">' + (d.sirket?d.sirket+' · ':'') + '📍 ' + (d.sehir||'—') + '</div></div>'
          + '<button class="iibtn" onclick="waGo(\'' + msg + '\')">Başvur</button>'
          + '</div>';
      });
    }
  });
  // CV PRO KART
  var cvCard = '<div class="cv-pro-card">'
    + '<div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">'
    + '<div style="width:44px;height:44px;background:rgba(52,201,122,.15);border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0">📄</div>'
    + '<div><div style="font-family:\'Syne\',sans-serif;font-size:14px;font-weight:800">Hızlı CV Yükle & 1 Tıkla Başvur</div>'
    + '<div style="font-size:11px;color:#6b9478;margin-top:2px">Profilini bir kez doldur, tüm ilanlara anında başvur</div></div></div>'
    + '<div style="margin-bottom:6px">'
    + '<div style="display:flex;justify-content:space-between;font-size:11px;color:#6b9478;margin-bottom:4px"><span>Profil Tamamlanma</span><span style="color:' + (pct>=80?'var(--green)':pct>=50?'var(--yellow)':'var(--orange)') + '">%' + pct + '</span></div>'
    + '<div style="height:8px;background:rgba(52,201,122,.12);border-radius:8px;overflow:hidden"><div style="height:100%;width:' + pct + '%;background:linear-gradient(90deg,#1a7a4a,var(--green));border-radius:8px"></div></div>'
    + '</div>'
    + (cvLoaded ? '<div style="font-size:10px;color:var(--green);margin-bottom:10px">✅ Profil yüklü — Hızlı başvuru aktif</div>' : '<div style="font-size:10px;color:var(--orange);margin-bottom:10px">⚠️ Profil eksik — Doldurun, başvurun</div>')
    + '<button onclick="openCVModal()" style="width:100%;background:linear-gradient(135deg,#1a7a4a,var(--green));color:#000;border:none;border-radius:12px;padding:12px;font-size:13px;font-weight:800;cursor:pointer;font-family:inherit;margin-bottom:8px;display:flex;align-items:center;justify-content:center;gap:7px">📤 CV Yükle / Güncelle</button>'
    + '<button onclick="quickApplyAll()" style="width:100%;background:rgba(52,201,122,.12);color:var(--green);border:1.5px solid rgba(52,201,122,.3);border-radius:12px;padding:12px;font-size:13px;font-weight:800;cursor:pointer;font-family:inherit;display:flex;align-items:center;justify-content:center;gap:7px">🚀 Tüm İlanlara Hızlı Başvur Hazırla</button>'
    + '</div>';
  el.innerHTML = cvCard
    + '<div class="skillbox"><div class="sbtit">💡 Sık Aranan Beceriler</div>'
    + '<div class="sbtags"><span class="tag t-p">Yumuşak Doku Cerrahisi</span><span class="tag t-b">USG Görüntüleme</span><span class="tag t-g">Ortopedi</span><span class="tag t-o">Onkoloji</span><span class="tag t-y">Gıda Hijyeni</span></div></div>'
    + '<div class="panel"><div class="panel-tit">🎓 Staj & Gelişim</div>'
    + '<div class="staj-btns">'
    + '<button class="staj-btn-isv" onclick="waGo(encodeURIComponent(\'Merhaba [VeTalent/İVHP], Stajyer arıyorum.\'))">🏥 Stajyer Arıyorum<span class="btn-sub">İşveren / Klinik</span></button>'
    + '<button class="staj-btn-staj" onclick="waGo(encodeURIComponent(\'Merhaba [VeTalent/İVHP], Staj yeri arıyorum.\'))">👩‍⚕️ Staj Yeri Arıyorum<span class="btn-sub">Öğrenci / Stajyer</span></button>'
    + '</div>' + stajHtml + '</div>';
}

// ─── RENDER WA GRUPLAR ───────────────────────────────────────
function renderGruplar() {
  var el = document.getElementById('pg-gruplar');
  if (!el) return;
  var grpHtml = WA_GROUPS_STATIC.map(function(g) {
    return '<div class="wa-gc" onclick="window.open(\'' + g.link + '\',\'_blank\')">'
      + '<div class="wa-gc-ico">💬</div>'
      + '<div class="wa-gc-inf">'
      + '<div class="wa-gc-n">' + g.name + '</div>'
      + '<div class="wa-gc-s">' + g.brans + ' · ' + g.sehir + '</div>'
      + '</div>'
      + '<button class="wa-gc-btn" onclick="event.stopPropagation();window.open(\'' + g.link + '\',\'_blank\')">Katıl</button>'
      + '</div>';
  }).join('');
  // Grup ekleme formu
  var addForm = '<div class="grup-form">'
    + '<div class="gf-tit">➕ Yeni Grup Ekle</div>'
    + '<div class="gf-sub">Grubunuz anında listeye eklenir.</div>'
    + '<div class="gf-sec">GRUP ADI *</div>'
    + '<input id="waf-ad" type="text" placeholder="Örn: İstanbul Veteriner Hekimler" class="name-f">'
    + '<div class="gf-sec">WHATSAPP LİNKİ *</div>'
    + '<input id="waf-link" type="url" placeholder="https://chat.whatsapp.com/..." class="name-f">'
    + '<div class="gf-sec">BRANŞ</div>'
    + '<div class="gf-chips" id="waf-brans-chips">'
    + ['Klinik','Kanatlı','Gıda','İlaç','Lab','Çiftlik','Genel'].map(function(b) {
      return '<div class="gf-chip" onclick="this.classList.toggle(\'on\')">' + b + '</div>';
    }).join('')
    + '</div>'
    + '<div class="gf-sec">ŞEHİR</div>'
    + '<div class="gf-chips" id="waf-sehir-chips">'
    + ['İstanbul','Ankara','İzmir','Sakarya','Bursa','Türkiye Geneli'].map(function(s) {
      return '<div class="gf-chip" onclick="wafSehirSec(this)">' + s + '</div>';
    }).join('')
    + '</div>'
    + '<button class="gf-send" onclick="submitWaGrup()">✅ Grubu Listeye Ekle</button>'
    + '</div>';
  el.innerHTML = '<div class="wa-info"><div class="wa-info-ico">📌</div>'
    + '<div class="wa-info-txt"><b>' + WA_GROUPS_STATIC.length + ' aktif grup</b> — Katılmak için tıklayın.</div></div>'
    + grpHtml + addForm;
}

var wafSehir = '';
function wafSehirSec(el) {
  document.querySelectorAll('#waf-sehir-chips .gf-chip').forEach(function(c) { c.classList.remove('on'); });
  el.classList.add('on');
  wafSehir = el.textContent.trim();
}

async function submitWaGrup() {
  var ad   = (document.getElementById('waf-ad')||{}).value||'';
  var link = (document.getElementById('waf-link')||{}).value||'';
  if (!ad.trim() || !link.trim()) { toast('⚠️ Ad ve link zorunlu!'); return; }
  if (!link.includes('chat.whatsapp.com')) { toast('⚠️ Geçerli WhatsApp linki gir!'); return; }
  var bransEl  = document.querySelectorAll('#waf-brans-chips .gf-chip.on');
  var brans    = Array.from(bransEl).map(function(e) { return e.textContent.trim(); }).join(', ') || 'Genel';
  try {
    toast('📤 Ekleniyor...');
    fetch(SCRIPT_URL, {method:'POST', mode:'no-cors', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({tip:'wa_grup', grupAdi:ad, link:link, brans:brans, sehir:wafSehir||'Türkiye Geneli'})
    }).catch(function(){});
    WA_GROUPS_STATIC.push({name:ad, link:link, brans:brans, sehir:wafSehir||'Türkiye Geneli'});
    toast('✅ Grup eklendi!');
    setTimeout(renderGruplar, 300);
  } catch(e) { toast('❌ Hata: ' + e.message); }
}

// ─── renderAll ───────────────────────────────────────────────
function renderAll() {
  try { renderIlanlar(); } catch(e) { console.warn('renderIlanlar:', e); }
  try { renderHekimler(); } catch(e) { console.warn('renderHekimler:', e); }
  try { renderNobet(); } catch(e) { console.warn('renderNobet:', e); }
  try { renderSaved(); } catch(e) { console.warn('renderSaved:', e); }
  try { renderAraclar(); } catch(e) { console.warn('renderAraclar:', e); }
  try { renderGruplar(); } catch(e) { console.warn('renderGruplar:', e); }
  try { renderHosgeldin(); } catch(e) { console.warn('renderHosgeldin:', e); }
}

function upCounts() {
  var iv = all.filter(function(r) { return r.tip.includes('İŞVEREN'); }).length;
  var hk = all.filter(function(r) { return r.tip.includes('ARIY'); }).length;
  sT('cnt-isv', iv);  sT('si-b', iv + ' aktif');
  sT('cnt-hk',  hk);  sT('sh-b', hk + ' hekim');
  sT('cnt-nb', nobetData.length); sT('sn-b', nobetData.length);
  var b = document.getElementById('savBadge');
  if (b) b.style.display = saved.length > 0 ? 'block' : 'none';
}

// ─── SAVE ────────────────────────────────────────────────────
function tSave(id, btn) {
  var ix = saved.indexOf(id);
  if (ix > -1) {
    saved.splice(ix, 1);
    btn.textContent = '☆';
    btn.classList.remove('on');
    toast('Kaydedilenlerden çıkarıldı');
  } else {
    saved.push(id);
    btn.textContent = '⭐';
    btn.classList.add('on');
    toast('⭐ İlan kaydedildi!');
  }
  localStorage.setItem('vt_s', JSON.stringify(saved));
  upCounts();
  renderSaved();
}

// ─── DETAY ───────────────────────────────────────────────────
function detIsv(idx) {
  var d = all[idx]; if (!d) return;
  var rows = [['Klinik',d.klinik],['Yetkili',d.yetkili],['Şehir',d.sehir],['Faaliyet',d.faaliyet],['Pozisyon',d.pozisyon],['Deneyim',d.deneyim],['Çalışma',d.calisma],['Maaş',d.maas],['Uzmanlık',d.uzmanlik],['Konaklama',d.konaklama]]
    .filter(function(r) { return r[1]; })
    .map(function(r) { return '<div class="dr"><span class="dl">' + r[0] + '</span><span class="dv">' + r[1] + '</span></div>'; })
    .join('');
  document.getElementById('dsh').innerHTML = '<div class="shand"></div>'
    + '<div class="dcl" onclick="document.getElementById(\'dov\').classList.remove(\'on\')">✕</div>'
    + '<div class="dn">' + (d.klinik||'Klinik') + '</div>'
    + '<div class="dp">' + (d.pozisyon||'') + '</div>' + rows
    + '<button class="dwa" onclick="waGo()">💬 VeTalent / İVHP\'ye Yaz</button>';
  document.getElementById('dov').classList.add('on');
}

function detHk(idx) {
  var d = all[idx]; if (!d) return;
  var rows = [['Ad (Maskeli)',maskName(d.isim)],['Cinsiyet',d.cinsiyet],['Meslek',d.meslek],['Aranan Poz.',d.hkPoz],['Şehir',d.hkSehir],['Deneyim',d.hkDeneyim],['Çalışma',d.hkCalisma],['Maaş Bek.',d.hkMaas],['Uzmanlık',d.hkUzmanlik]]
    .filter(function(r) { return r[1]; })
    .map(function(r) { return '<div class="dr"><span class="dl">' + r[0] + '</span><span class="dv">' + r[1] + '</span></div>'; })
    .join('');
  document.getElementById('dsh').innerHTML = '<div class="shand"></div>'
    + '<div class="dcl" onclick="document.getElementById(\'dov\').classList.remove(\'on\')">✕</div>'
    + '<div class="dn">' + maskName(d.isim) + '</div>'
    + '<div class="dp">' + (d.meslek||'Veteriner Hekim') + '</div>' + rows
    + '<button class="dwa" onclick="waGo()">💬 VeTalent / İVHP\'ye Yaz</button>';
  document.getElementById('dov').classList.add('on');
}

// ─── FORM ────────────────────────────────────────────────────
function openForm(tp) {
  kvkk = false;
  zkSt = {b:[], d:'', c:'', i:[]};
  zkSektor = '';
  if (tp === 'nobet') { openNobetForm(); return; }
  var iH = tp === 'hekim';
  var bransBtns = BRANS_LIST.map(function(b) {
    return '<div class="zk" onclick="zkTog(this,\'b\')">' + b.l + '</div>';
  }).join('');
  var deneyimBtns = DENEYIM.map(function(d) {
    return '<div class="zk" onclick="zkTog(this,\'d\',true)">' + d + '</div>';
  }).join('');
  var calismaBtns = CALISMA.map(function(c) {
    return '<div class="zk" onclick="zkTog(this,\'c\',true)">' + c + '</div>';
  }).join('');
  var imkanBtns = IMKAN.map(function(im) {
    return '<div class="zk" onclick="zkTog(this,\'i\')">' + im + '</div>';
  }).join('');
  var sektorBtns = [
    {l:'🟢 Klinik/Pet', v:'Klinik/Pet'}, {l:'🟠 Gıda/Denetim', v:'Gıda/Denetim'},
    {l:'🔵 İlaç/Saha', v:'İlaç/Saha'},   {l:'🟡 Kanatlı', v:'Kanatlı'},
    {l:'🟣 Lab/Tanı', v:'Lab/Tanı'},      {l:'🔴 Çiftlik', v:'Çiftlik'},
    {l:'🔧 Operasyon', v:'Operasyon'},
  ].map(function(s) {
    return '<div class="zk" onclick="zkSektorSec(this,\'' + s.v + '\')">' + s.l + '</div>';
  }).join('');
  var maasDd = maasDD();
  var h = '<div class="shand"></div>'
    + '<div class="stit">' + (iH ? '👩‍⚕️ CV Kartı Ekle' : tp.startsWith('sektor') ? '🔬 Sektör İlanı' : '🏥 İşveren İlanı') + '</div>'
    + '<div class="ssub">VeTalent / İVHP — Butonlara tıklayarak doldurun!</div>'
    + (!iH ? '<div class="fsec">İşletme Adı</div><input class="name-f" id="f-k" type="text" placeholder="Klinik / Firma adı">' : '')
    + '<div class="fsec">' + (iH ? 'Ad Soyad' : 'Yetkili') + '</div>'
    + '<input class="name-f" id="f-a" type="text" placeholder="' + (iH ? 'Dr. Adınız' : 'Yetkili kişi') + '">'
    + '<div class="fsec">📱 WhatsApp</div>'
    + '<input class="name-f" id="f-t" type="tel" placeholder="05XX XXX XX XX" inputmode="numeric">'
    + '<div class="fsec">📍 Şehir</div>'
    + '<select class="city-sel" id="f-s"><option value="">Şehir seçin</option><option>İstanbul</option><option>Ankara</option><option>İzmir</option><option>Sakarya</option><option>Bursa</option><option>Antalya</option><option>Adana</option><option>Konya</option><option>Diğer</option></select>'
    + '<div class="fsec">🌈 Sektör</div><div class="zkc">' + sektorBtns + '</div>'
    + '<div class="fsec">🏥 Branş</div><div class="zkc">' + bransBtns + '</div>'
    + '<div class="fsec">⏱️ Tecrübe</div><div class="zkc">' + deneyimBtns + '</div>'
    + '<div class="fsec">⚡ Çalışma Şekli</div><div class="zkc">' + calismaBtns + '</div>'
    + (!iH ? '<div class="fsec">🎁 İmkanlar</div><div class="zkc">' + imkanBtns + '</div>' : '')
    + '<div class="fsec">💰 Maaş ' + (iH ? 'Beklentisi' : 'Teklifi') + '</div>' + maasDd
    + '<div class="kvkk" id="kv" onclick="tKv()"><div class="kbox" id="kb"></div>'
    + '<div class="ktxt">Kişisel verilerimin VeTalent / İVHP tarafından işlenmesine izin veriyorum. <a href="#" onclick="event.stopPropagation()">KVKK</a></div></div>'
    + '<div class="subm" id="sbm" onclick="subForm(\'' + tp + '\')" disabled="true">📤 VeTalent / İVHP\'ye Gönder</div>'
    + '<div class="canc" onclick="closeForm()">İptal</div>'
    + '<div class="sok" id="fok"><div class="soki">🎉</div><h3>Gönderildi!</h3><p>WhatsApp açılıyor...</p></div>';
  document.getElementById('fsh').innerHTML = h;
  document.getElementById('fov').classList.add('on');
}

function openNobetForm() {
  kvkk = false;
  var h = '<div class="shand"></div>'
    + '<div class="stit">🔄 Nöbet Takas İlanı</div>'
    + '<div class="ssub">Nöbetini paylaş, teklif al.</div>'
    + '<div class="fsec">Ad Soyad</div><input class="name-f" id="f-a" type="text" placeholder="Dr. Adınız">'
    + '<div class="fsec">WhatsApp</div><input class="name-f" id="f-t" type="tel" placeholder="05XX XXX XX XX">'
    + '<div class="fsec">Klinik / Hastane</div><input class="name-f" id="f-k" type="text" placeholder="Çalıştığın yer">'
    + '<div class="fsec">Nöbet Tarihi</div><input class="name-f" id="f-tarih" type="date">'
    + '<div class="fsec">Şehir</div><select class="city-sel" id="f-s"><option>İstanbul</option><option>Ankara</option><option>İzmir</option><option>Sakarya</option><option>Bursa</option><option>Diğer</option></select>'
    + '<div class="fsec">Açıklama</div><input class="name-f" id="f-acik" type="text" placeholder="Nöbet saatleri, notlar...">'
    + '<div class="kvkk" id="kv" onclick="tKv()"><div class="kbox" id="kb"></div><div class="ktxt">Kişisel verilerimin işlenmesine izin veriyorum.</div></div>'
    + '<div class="subm" id="sbm" onclick="subNobetForm()" disabled="true">🔄 İlan Ver</div>'
    + '<div class="canc" onclick="closeForm()">İptal</div>'
    + '<div class="sok" id="fok"><div class="soki">✅</div><h3>İlanın Yayında!</h3><p>A-Takımına bildirildi.</p></div>';
  document.getElementById('fsh').innerHTML = h;
  document.getElementById('fov').classList.add('on');
}

function zkTog(el, grp, single) {
  if (single) {
    el.closest('.zkc').querySelectorAll('.zk').forEach(function(x) { x.classList.remove('on'); });
    zkSt[grp] = '';
  }
  el.classList.toggle('on');
  var sel = Array.from(el.closest('.zkc').querySelectorAll('.zk.on')).map(function(x) {
    return x.textContent.replace(/[💊🌙🍖🐄🩺🔬🏠🍽️💰📋🚗🟢🟠🔵🟡🟣🔴🔧]/g,'').trim();
  });
  if (grp==='b') zkSt.b = sel;
  else if (grp==='d') zkSt.d = el.classList.contains('on') ? el.textContent.trim() : '';
  else if (grp==='c') zkSt.c = el.classList.contains('on') ? el.textContent.trim() : '';
  else if (grp==='i') zkSt.i = sel;
}

function zkSektorSec(el, val) {
  el.closest('.zkc').querySelectorAll('.zk').forEach(function(x) { x.classList.remove('on'); });
  el.classList.toggle('on');
  zkSektor = el.classList.contains('on') ? val : '';
}

function tKv() {
  kvkk = !kvkk;
  var kv = document.getElementById('kv');
  var kb = document.getElementById('kb');
  var sb = document.getElementById('sbm');
  if (kv) kv.classList.toggle('on', kvkk);
  if (kb) kb.textContent = kvkk ? '✓' : '';
  if (sb) sb.disabled = !kvkk;
}

async function subForm(tp) {
  if (!kvkk) { alert('KVKK onayı gerekli.'); return; }
  var tel = (document.getElementById('f-t')||{}).value||'';
  if (!tel.trim()) { alert('WhatsApp numarası zorunlu!'); return; }
  var ad   = gv('f-a'), klinik = gv('f-k'), sehir = gv('f-s'), maas = gv('f-maas');
  var now  = new Date().toLocaleString('tr-TR');
  var tipL = {hekim:'👩‍⚕️ YENİ HEKİM CV', isveren:'🏥 YENİ İŞVEREN'};
  var waMsg = encodeURIComponent(
    (tipL[tp]||'🔔 YENİ KAYIT') + '\n'
    + (klinik ? '🏥 ' + klinik + '\n' : '')
    + '👤 ' + ad + '\n📱 ' + tel + '\n📍 ' + (sehir||'—') + '\n'
    + '🌈 Sektör: ' + (zkSektor||'—') + '\n'
    + '🏥 Branş: ' + (zkSt.b.join(', ')||'—') + '\n'
    + '⏱️ Tecrübe: ' + (zkSt.d||'—') + '\n'
    + '⚡ Çalışma: ' + (zkSt.c||'—') + '\n'
    + '💰 Maaş: ' + (maas||'—') + '\n'
    + (zkSt.i.length ? '🎁 İmkanlar: ' + zkSt.i.join(', ') + '\n' : '')
    + '📅 ' + now + '\n✅ VeTalent / İVHP'
  );
  fetch(SCRIPT_URL, {method:'POST', mode:'no-cors', headers:{'Content-Type':'application/json'},
    body: JSON.stringify({tip:tp, klinik:klinik, ad:ad, tel:tel, sehir:sehir, sektor:zkSektor, brans:zkSt.b.join(', '), deneyim:zkSt.d, calisma:zkSt.c, imkan:zkSt.i.join(', '), maas:maas})
  }).catch(function(){});
  document.getElementById('fok').style.display = 'block';
  document.getElementById('sbm').style.display = 'none';
  document.querySelectorAll('#fsh .canc').forEach(function(b) { b.style.display='none'; });
  toast('✅ Gönderildi! WhatsApp açılıyor...');
  setTimeout(function() { waGo(waMsg); }, 1000);
  setTimeout(function() { closeForm(); fetchAll(); fetchNobet(); }, 3200);
}

async function subNobetForm() {
  if (!kvkk) { alert('Onay gerekli.'); return; }
  var ad = gv('f-a'), tel = gv('f-t'), klinik = gv('f-k'), tarih = gv('f-tarih'), sehir = gv('f-s'), aciklama = gv('f-acik');
  if (!tel.trim()) { alert('Telefon zorunlu!'); return; }
  var now = new Date().toLocaleString('tr-TR');
  fetch(SCRIPT_URL, {method:'POST', mode:'no-cors', headers:{'Content-Type':'application/json'},
    body: JSON.stringify({tip:'nobet', ad:ad, tel:tel, klinik:klinik, tarih:tarih, sehir:sehir, aciklama:aciklama})
  }).catch(function(){});
  var waMsg = encodeURIComponent('🔄 YENİ NÖBET TAKASI\n👤 '+ad+'\n📱 '+tel+'\n🏥 '+klinik+'\n📅 '+tarih+'\n📍 '+sehir+'\n💬 '+aciklama+'\n✅ VeTalent / İVHP');
  document.getElementById('fok').style.display = 'block';
  document.getElementById('sbm').style.display = 'none';
  toast('✅ Gönderildi!');
  setTimeout(function() { waGo(waMsg); }, 1000);
  setTimeout(function() { closeForm(); fetchNobet(); }, 3200);
}

function closeForm() {
  document.getElementById('fov').classList.remove('on');
  zkSt = {b:[], d:'', c:'', i:[]};
  zkSektor = '';
}

// ─── NAVİGASYON ──────────────────────────────────────────────
var PGCFG = {
  ilanlar:  {t:'İşveren İlanları',  i:'🏥', c:['Tümü','Klinik','Gece','Gıda','İlaç','Kanatlı','Lab','Çiftlik','İstanbul','Ankara','Sakarya']},
  hekimler: {t:'Hekim CV Kartları', i:'👩‍⚕️',c:['Tümü','Klinik','Gıda','İlaç','Kanatlı','Lab','Çiftlik','Erkek','Kadın']},
  nobet:    {t:'Nöbet Takası',      i:'🔄', c:['Tümü','İstanbul','Ankara','Sakarya','İzmir']},
  saved:    {t:'Kayıtlı İlanlar',   i:'📌', c:[]},
  araclar:  {t:'Araçlar & Staj',    i:'✨', c:['CV Profili','Staj','Maaş']},
  gruplar:  {t:'WhatsApp Grupları', i:'💬', c:['Tümü','Klinik','Kanatlı','Gıda','İlaç','Lab','Çiftlik','Genel']},
};

function goPage(name) {
  document.getElementById('splash').classList.add('gone');
  document.getElementById('app').classList.add('on');
  showPg(name);
  document.querySelectorAll('.nbtn').forEach(function(b) { b.classList.remove('on'); });
  var nb = document.getElementById('nb-' + name);
  if (nb) nb.classList.add('on');
}

function goSect(s) {
  document.getElementById('splash').classList.add('gone');
  document.getElementById('app').classList.add('on');
  document.querySelectorAll('.pg').forEach(function(p) { p.classList.remove('on'); });
  document.getElementById('pg-sektor').classList.add('on');
  var L = {gida:'Gıda Firması',lab:'Laboratuvar',ilac:'İlaç Firması',gece:'Gece Vet.',kanatli:'Kanatlı',ciftlik:'Çiftlik',klinik:'Klinik/Pet'};
  sT('ptit', L[s]||s);
  sT('pico', s==='gida'?'🟠':s==='lab'?'🟣':s==='ilac'?'🔵':s==='gece'?'🌙':s==='kanatli'?'🟡':s==='ciftlik'?'🔴':'🟢');
  renderSector(s);
  curPg = 'sektor';
  document.getElementById('frow').innerHTML = '';
  sT('rc', '');
  document.querySelectorAll('.nbtn').forEach(function(b) { b.classList.remove('on'); });
}

function goBack() {
  document.getElementById('splash').classList.remove('gone');
  document.getElementById('app').classList.remove('on');
}

function showPg(name) {
  document.querySelectorAll('.pg').forEach(function(p) { p.classList.remove('on'); });
  var pg = document.getElementById('pg-' + name);
  if (pg) pg.classList.add('on');
  document.getElementById('cnt').scrollTop = 0;
  var sinEl = document.getElementById('sin');
  if (sinEl) sinEl.value = '';
  clrSrch();
  curPg = name;
  var c = PGCFG[name];
  if (!c) return;
  sT('ptit', c.t);
  sT('pico', c.i);
  var row = document.getElementById('frow');
  row.innerHTML = '';
  c.c.forEach(function(ch, i) {
    var b = document.createElement('button');
    b.className = 'chip' + (i===0 ? ' on' : '');
    b.textContent = ch;
    b.onclick = (function(ch) { return function() { setChip(b, ch==='Tümü'?'tumu':norm(ch)); }; })(ch);
    row.appendChild(b);
  });
  if (name === 'saved')   renderSaved();
  if (name === 'araclar') renderAraclar();
  if (name === 'gruplar') renderGruplar();
}

function swPg(name, btn) {
  showPg(name);
  document.querySelectorAll('.nbtn').forEach(function(b) { b.classList.remove('on'); });
  btn.classList.add('on');
}

function doSrch() {
  var q = norm(document.getElementById('sin').value);
  var scl = document.getElementById('scl');
  if (scl) scl.style.display = q ? 'block' : 'none';
  var shown = 0;
  document.querySelectorAll('#pg-' + curPg + ' .jc, #pg-' + curPg + ' .nbc').forEach(function(c) {
    var s = norm(c.dataset.s || c.innerText);
    var match = !q || s.includes(q) || (q==='gece' && s.includes('gece')) || (q==='acil' && (s.includes('acil')||s.includes('gece')));
    c.style.display = match ? '' : 'none';
    if (match) shown++;
  });
  if (q) setRC(shown, 'kayıt');
}

function clrSrch() {
  var sinEl = document.getElementById('sin');
  if (sinEl) sinEl.value = '';
  var scl = document.getElementById('scl');
  if (scl) scl.style.display = 'none';
  document.querySelectorAll('.jc, .nbc').forEach(function(c) { c.style.display = ''; });
}

function setChip(btn, f) {
  document.querySelectorAll('#frow .chip').forEach(function(c) { c.classList.remove('on'); });
  btn.classList.add('on');
  document.querySelectorAll('#pg-' + curPg + ' .jc, #pg-' + curPg + ' .nbc').forEach(function(c) {
    if (f === 'tumu') { c.style.display = ''; return; }
    c.style.display = norm(c.dataset.s||'').includes(f) ? '' : 'none';
  });
}

function toggleSort() {
  sortAsc = !sortAsc;
  sT('sl', sortAsc ? 'Eskiye' : 'Yeniye');
  if (curPg === 'ilanlar') renderIlanlar();
  else if (curPg === 'hekimler') renderHekimler();
}

// ─── ADMİN ───────────────────────────────────────────────────
function openAdmin() {
  document.getElementById('adminPanel').classList.add('on');
  document.getElementById('adminLock').style.display = 'flex';
  document.getElementById('adminContent').style.display = 'none';
  if (adminOk) showAdminContent();
}
function closeAdmin()  { document.getElementById('adminPanel').classList.remove('on'); }
function checkAdminPass() {
  if (document.getElementById('adminPass').value === _p) {
    adminOk = true;
    document.getElementById('adminErr').style.display = 'none';
    showAdminContent();
  } else {
    document.getElementById('adminErr').style.display = 'block';
    document.getElementById('adminPass').value = '';
  }
}
function showAdminContent() {
  document.getElementById('adminLock').style.display = 'none';
  document.getElementById('adminContent').style.display = 'block';
  adminRefresh();
}
function adminRefresh() {
  var iv = all.filter(function(r) { return r.tip.includes('İŞVEREN'); });
  var hk = all.filter(function(r) { return r.tip.includes('ARIY'); });
  document.getElementById('adminStats').innerHTML =
    '<div class="admin-stat"><div class="admin-stat-v">' + iv.length + '</div><div class="admin-stat-l">İşveren</div></div>'
    + '<div class="admin-stat"><div class="admin-stat-v">' + hk.length + '</div><div class="admin-stat-l">Hekim</div></div>'
    + '<div class="admin-stat"><div class="admin-stat-v">' + nobetData.length + '</div><div class="admin-stat-l">Nöbet</div></div>'
    + '<div class="admin-stat"><div class="admin-stat-v">' + Object.keys(eslesmeMap).length + '</div><div class="admin-stat-l">🔥 Eşleşme</div></div>';
  var rows = iv.map(function(d) { return {_tip:'isv',_nm:d.klinik||'—',_seh:d.sehir||'—',z:d.z,_dur:d.durum||'—'}; })
    .concat(hk.map(function(d) { return {_tip:'hk',_nm:maskName(d.isim),_seh:d.hkSehir||'—',z:d.z,_dur:d.durum||'—'}; }))
    .concat(nobetData.map(function(d) { return {_tip:'nb',_nm:maskName(d.ad),_seh:d.sehir||'—',z:d.z,_dur:'açık'}; }));
  document.getElementById('adminBody').innerHTML = rows.length === 0
    ? '<tr><td colspan="5" style="text-align:center;color:var(--muted);padding:20px">Kayıt yok</td></tr>'
    : rows.map(function(d) {
      return '<tr><td>' + (d.z||'—') + '</td>'
        + '<td><span class="admin-tag ' + d._tip + '">' + d._tip + '</span></td>'
        + '<td>' + d._nm + '</td><td>' + d._seh + '</td><td>' + d._dur + '</td></tr>';
    }).join('');
}

// ─── FALLBACK (Sheets bağlanmazsa demo data) ─────────────────
function fallback() {
  all = [
    {tip:'İŞVERENİM',klinik:'GENÇVET Serdivan',yetkili:'Ender Er',sehir:'Sakarya',faaliyet:'KLİNİK',deneyim:'1-2 YIL',pozisyon:'KLİNİK VETERİNER HEKİMİ',calisma:'TAM ZAMANLI',maas:'75.000 TL - 90.000 TL',uzmanlik:'DAHİLİYE',sektor:'Klinik/Pet',z:'26.03.2026',durum:'onaylandı'},
    {tip:'İŞVERENİM',klinik:'Gece & Acil Vet.',yetkili:'Selin Kara',sehir:'İSTANBUL',faaliyet:'GECE HEKİMİ',deneyim:'3+ YIL',pozisyon:'GECE VETERİNER HEKİMİ',calisma:'GECE NÖBET',maas:'110.000 TL ve Üzeri',uzmanlik:'ACİL',sektor:'Klinik/Pet',z:'01.04.2026',durum:'onaylandı'},
    {tip:'İŞ ARIYORUM',isim:'Umut Şeker',cinsiyet:'ERKEK',meslek:'VETERİNER HEKİM',hkSehir:'Sakarya',hkPoz:'KLİNİK',hkDeneyim:'3 YIL VE ÜZERİ',hkCalisma:'TAM ZAMANLI',hkMaas:'Oda Maaşı (Resmi Rakam)',hkUzmanlik:'DAHİLİYE',sektor:'Klinik/Pet',z:'26.01.2026',durum:'onaylandı'},
  ];
  hesaplaEslesme();
  renderAll();
  upCounts();
}

// ─── INIT ────────────────────────────────────────────────────
startClock();
fetchAll();
fetchNobet();
fetchStaj();
upCounts();
