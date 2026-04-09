const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbywdmf6UIVz6t7uw10Lqsr5fqIpGX2Nqux4YT8hMBomFYvLunRUf75U8lzloDLuhtE0/exec";
const API_KEY    = "Baytarumut12";

// Saat ve tarih
function startClock() {
  setInterval(() => {
    const now = new Date();
    document.getElementById('saatTarih').textContent =
      `${now.toLocaleDateString('tr-TR')} — ${now.toLocaleTimeString('tr-TR')}`;
  }, 1000);
}

// Hoşgeldin banner
function renderHosgeldin() {
  document.getElementById('hosgeldinArea').innerHTML =
    `<div class="hosgeldin-banner">👋 Merhaba! Platform'da aktif ilanlar seni bekliyor.</div>`;
  renderOnerilen();
}

// Eşleşme skoru
function calculateMatchScore(d) {
  let skor = 0;
  if (d.sehir && d.sehir.toLowerCase().includes("sakarya")) skor += 40;
  if (d.uzmanlik && d.uzmanlik.toLowerCase().includes("dahiliye")) skor += 40;
  if (d.deneyim && d.deneyim.includes("3")) skor += 20;
  return skor;
}

// Önerilen ilanlar
function renderOnerilen() {
  const isv = all.filter(r => r.tip.includes('İŞVEREN'));
  const scored = isv.map(d => ({ d, skor: calculateMatchScore(d) }))
                    .filter(x => x.skor >= 30)
                    .sort((a,b)=>b.skor-a.skor)
                    .slice(0,3);
  if (!scored.length) return;
  document.getElementById('onerilenArea').innerHTML =
    `<div class="onerilen-title">⭐ Sana Özel Önerilen İlanlar</div>` +
    scored.map(({d,skor}) => `
      <div class="onerilen-card">
        <div><b>${d.klinik}</b> · ${d.pozisyon} · 📍 ${d.sehir}</div>
        <div class="match-score">%${skor} eşleşme</div>
      </div>`).join('');
}

// CV Kartı
function renderCVCard() {
  const pct = 70;
  document.getElementById('cvCard').innerHTML = `
    <div style="font-weight:800;font-size:14px">📄 Hızlı CV Yükle & 1 Tıkla Başvur</div>
    <div style="font-size:11px;color:#6b9478">Profilini bir kez doldur, tüm ilanlara anında başvur</div>
    <div style="margin:8px 0">
      <div style="font-size:11px;color:#6b9478">Profil Tamamlanma: %${pct}</div>
      <div style="height:8px;background:rgba(52,201,122,.12);border-radius:8px">
        <div style="height:100%;width:${pct}%;background:#10b981;border-radius:8px"></div>
      </div>
    </div>
    <button class="btn-green" onclick="openCVModal()">📤 CV Yükle / Güncelle</button>
    <button class="btn-outline" onclick="quickApplyAll()">🚀 Tüm İlanlara Hızlı Başvur Hazırla</button>
  `;
}

// İlanlar
function renderIlanlar() {
  const el = document.getElementById('pg-ilanlar');
  let h = '';
  all.filter(r=>r.tip.includes('İŞVEREN')).forEach((d,gi)=>{
    h += `<div class="jc">
      <div class="cname">${d.klinik}</div>
      <div class="cpos">${d.pozisyon}</div>
      <button class="btn-hizli" onclick="quickApplyToJob(${gi})">🚀 Hızlı Başvur</button>
    </div>`;
  });
  el.innerHTML = h;
}

// Nöbet Takası
function renderNobet() {
  const el = document.getElementById('pg-nobet');
  let h = '';
  nobetData.forEach(d=>{
    h += `<div class="nbc">
      <div>${d.ad} · ${d.tarih} · 📍 ${d.sehir}</div>
      <button class="btn-orange" onclick="waGo()">🤝 Teklif Ver</button>
    </div>`;
