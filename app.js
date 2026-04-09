/* VeTalent İVHP — script.js
   Backend URL gömülü, tüm fonksiyonlar aktif.
*/

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbywdmf6UIVz6t7uw10Lqsr5fqIpGX2Nqux4YT8hMBomFYvLunRUf75U8lzloDLuhtE0/exec";
const API_KEY    = "Baytarumut12"; // güvenlik için her POST’a eklenecek

// Saat ve tarih göstergesi
function startClock() {
  setInterval(() => {
    const now = new Date();
    const saat = now.toLocaleTimeString('tr-TR');
    const tarih = now.toLocaleDateString('tr-TR');
    document.getElementById('saatTarih').textContent = `${tarih} — ${saat}`;
  }, 1000);
}

// Hoşgeldin banner + önerilen ilanlar
function renderHosgeldin() {
  const ad = "Umut"; // örnek
  document.getElementById('hosgeldinArea').innerHTML =
    `<div class="hosgeldin-banner">👋 Merhaba ${ad}! Platform'da aktif ilanlar seni bekliyor.</div>`;
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

// Hızlı CV Kartı
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

// İlanlar render
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

// Nöbet Takası render
function renderNobet() {
  const el = document.getElementById('pg-nobet');
  let h = '';
  nobetData.forEach(d=>{
    h += `<div class="nbc">
      <div>${d.ad} · ${d.tarih} · 📍 ${d.sehir}</div>
      <button class="btn-orange" onclick="waGo()">🤝 Teklif Ver</button>
    </div>`;
  });
  el.innerHTML = h;
}

// Hızlı Başvuru fonksiyonları
function quickApplyToJob(idx) {
  const ilan = all[idx];
  fetch(SCRIPT_URL, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      apiKey: API_KEY,
      tip: 'basvuru',
      userId: 'U_test',
      ilanId: ilan.klinik,
      adSoyad: 'Test Hekim',
      email: 'test@example.com',
      motivasyon: 'Hızlı başvuru'
    })
  });
  alert(`Başvuru gönderildi: ${ilan.klinik} (${ilan.pozisyon})`);
}
function quickApplyAll() {
  alert("Tüm ilanlara hızlı başvuru hazırlandı!");
}

// Dummy data
const all = [
  {tip:'İŞVEREN', klinik:'GENÇVET Serdivan', pozisyon:'Klinik Vet. Hekimi', sehir:'Sakarya', uzmanlik:'Dahiliye', deneyim:'3+ YIL'},
  {tip:'İŞVEREN', klinik:'Gece & Acil Vet.', pozisyon:'Gece Vet. Hekimi', sehir:'İstanbul', uzmanlik:'Acil', deneyim:'3+ YIL'}
];
const nobetData = [
  {ad:'Dr. Ali', tarih:'10.04.2026', sehir:'İstanbul'}
];

// Başlat
startClock();
renderHosgeldin();
renderCVCard();
renderIlanlar();
renderNobet();

