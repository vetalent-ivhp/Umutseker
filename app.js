/* ── CONFIG ── */
const WA_GRUP = 'https://chat.whatsapp.com/IbD4y6cxUTMCCGkKpTnIGD?mode=gi_t';
const SHEET_ID = '1bgqT1T_ZHUGdyyIODQaxDKVUMtgeUiHcaA1OQYzWm8M';
let SCRIPT_URL = ''; // Apps Script URL buraya

/* ── STATE ── */
let allData=[], nobetData=[], curPage='ilanlar', sortAsc=false;
let savedIds = JSON.parse(localStorage.getItem('vt_saved')||'[]');
let recentViewed = JSON.parse(localStorage.getItem('vt_recent')||'[]');
let kvkkChecked = false;
// Kullanıcı profili — bir kere doldur, kalıcı kalsın
let userProfile = JSON.parse(localStorage.getItem('vt_profile')||'null');

const notifs=[
  {cls:'ni-g',ico:'✅',tit:'Platforma hoş geldiniz!',sub:'VeTalent İVHP ile kariyer yolculuğunuz başlıyor.',time:'Şimdi'},
  {cls:'ni-b',ico:'🎯',tit:'Bana Uygun İlanlar hazır',sub:'Profilinize göre eşleşen ilanlar bulundu.',time:'Bugün'},
  {cls:'ni-y',ico:'⏰',tit:'30 Gün Hatırlatıcısı',sub:'İlanlarınızı güncellemeyi unutmayın.',time:'Bugün'},
];

/* ODA MAAŞ VERİLERİ — Gerçek bölge bazlı */
const ODA_MAAS = {
  istanbul: {min:82,max:140,ort:106},
  ankara: {min:72,max:125,ort:94},
  izmir: {min:68,max:118,ort:88},
  bursa: {min:62,max:108,ort:80},
  sakarya: {min:56,max:98,ort:72},
  antalya: {min:60,max:105,ort:78},
  diger: {min:52,max:95,ort:68}
};

/* ── FETCH ── */
async function fetchAll(){
  try{
    const url=`https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=ivhp%20istihdam&t=${Date.now()}`;
    const r=await fetch(url), t=await r.text();
    const j=JSON.parse(t.match(/google\.visualization\.Query\.setResponse\(([\s\S]*?)\);/)[1]);
    allData=(j.table.rows||[]).slice(1).map(row=>{
      const c=row.c, v=i=>(c[i]&&c[i].v)?String(c[i].v).trim():'';
      return{zaman:v(0),tip:v(1),klinik:v(2),yetkili:v(3),sehir:v(4),faaliyet:v(5),
        deneyim:v(6),pozisyon:v(7),konaklama:v(8),calisma:v(9),maas:v(10),
        uzmanlik:v(11),tel:v(12),isim:v(13),cinsiyet:v(14),meslek:v(15),
        hkSehir:v(16),hkPozisyon:v(17),hkDeneyim:v(18),hkCalisma:v(19),
        hkMaas:v(20),hkUzmanlik:v(21),hkTel:v(22),durum:v(24)};
    }).filter(r=>r.tip);
    setConn(true); renderAll(); updateCounts();
  }catch(e){ setConn(false); fallback(); }
}

async function fetchNobet(){
  try{
    const url=`https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=n%C3%B6bet%20takas&t=${Date.now()}`;
    const r=await fetch(url), t=await r.text();
    const j=JSON.parse(t.match(/google\.visualization\.Query\.setResponse\(([\s\S]*?)\);/)[1]);
    nobetData=(j.table.rows||[]).slice(1).map(row=>{
      const c=row.c, v=i=>(c[i]&&c[i].v)?String(c[i].v).trim():'';
      return{zaman:v(0),ad:v(1),tel:v(2),klinik:v(3),tarih:v(4),sehir:v(5),aciklama:v(6)};
    }).filter(r=>r.ad);
    renderNobet(); updateCounts();
  }catch(e){}
}

function setConn(ok){
  document.getElementById('cdot').className='cdot '+(ok?'ok':'err');
  document.getElementById('ctxt').textContent=ok?'Google Sheets bağlı ✓':'Bağlanamadı — demo mod';
}

/* ── RENDER ── */
const avs=['ag','ab','at','ao','ap'];
const emI=['🏥','🐾','🐕','🐈','🦴'], emH=['👨‍⚕️','👩‍⚕️','🩺','👨‍🔬','👩‍🔬'];

function ageStr(z){
  if(!z) return '';
  try{
    const m=z.match(/(\d{2})\.(\d{2})\.(\d{4})/);
    if(!m) return '';
    const d=new Date(m[3],m[2]-1,m[1]);
    const diff=Math.floor((Date.now()-d)/864e5);
    if(diff<=0) return '🆕 Bugün';
    if(diff<=3) return `🆕 ${diff} gün önce`;
    if(diff<=7) return `${diff} gün önce`;
    if(diff<=30) return `${Math.floor(diff/7)} hafta önce`;
    return `${Math.floor(diff/30)} ay önce`;
  }catch(e){return '';}
}

function salPct(m){
  if(!m) return 35;
  const M=m.toUpperCase();
  if(M.includes('100')) return 90;
  if(M.includes('85')) return 70;
  if(M.includes('80')) return 60;
  if(M.includes('70')||M.includes('60-80')) return 52;
  if(M.includes('60')) return 40;
  return 35;
}

function matchScore(d){
  if(!userProfile) return 0;
  let score=0;
  if(userProfile.sehir&&d.sehir&&d.sehir.toLowerCase().includes(userProfile.sehir.toLowerCase())) score+=40;
  if(userProfile.uzmanlik&&d.uzmanlik&&d.uzmanlik.toLowerCase().includes(userProfile.uzmanlik.toLowerCase().split(',')[0])) score+=35;
  if(userProfile.calisma&&d.calisma&&d.calisma.toLowerCase().includes(userProfile.calisma.toLowerCase())) score+=25;
  return score;
}

function renderIlanlar(){
  const el=document.getElementById('p-ilanlar'); if(!el) return;
  let isv=allData.filter(r=>r.tip.includes('İŞVEREN'));
  // Otomatik eşleşme skoru ile sırala
  if(userProfile) isv=[...isv].sort((a,b)=>matchScore(b)-matchScore(a));
  else if(!sortAsc) isv=[...isv].reverse();
  let h=abH('isveren','➕','İlan Ver','Pozisyonunuzu hemen ekleyin');
  if(!isv.length) h+=emH2('🏥','Henüz ilan yok','İlk işveren ilanı yakında.');
  else isv.forEach((d,i)=>{
    const id='isv_'+i, sv=savedIds.includes(id);
    const age=ageStr(d.zaman), isNew=age.includes('🆕'), sp=salPct(d.maas);
    const ms=userProfile?matchScore(d):0;
    const msHtml=ms>0?`<span class="mi-pct" style="font-size:9px;padding:2px 6px">${ms}% uyum</span>`:'';
    h+=`<div class="jc${sv?' saved':''} d${(i%4)+1}"
      data-id="${id}"
      data-search="${s4(d.klinik,d.sehir,d.uzmanlik,d.pozisyon,d.faaliyet,d.maas,d.calisma)}"
      data-sehir="${d.sehir.toLowerCase()}" data-uz="${d.uzmanlik.toLowerCase()}" data-cal="${d.calisma.toLowerCase()}"
      onclick="clickCard('isv',${i})">
      <div class="jc-head">
        <div class="jc-left">
          <div class="av ${avs[i%5]}">${emI[i%5]}</div>
          <div class="ji"><div class="jn">${d.klinik||'Klinik'}${isNew?'<span class="new-badge">YENİ</span>':''}${msHtml}</div><div class="jp">${d.pozisyon||d.faaliyet||'—'}</div></div>
        </div>
        <button class="save-btn${sv?' saved':''}" onclick="event.stopPropagation();toggleSave('${id}',this)">${sv?'⭐':'☆'}</button>
      </div>
      <div class="sal-row"><div class="sal-val">${d.maas||'Görüşülür'}</div><div class="sal-bar"><div class="sal-fill" style="width:${sp}%"></div></div></div>
      <div class="tags">
        ${d.calisma?`<span class="tag tb">${d.calisma}</span>`:''}
        ${d.faaliyet?`<span class="tag tg">${d.faaliyet}</span>`:''}
        ${d.deneyim?`<span class="tag ty">${d.deneyim}</span>`:''}
        ${mkT(d.uzmanlik,'tp')}
      </div>
      <div class="jc-foot">
        <div class="jc-meta"><div class="jcity">📍 ${d.sehir||'Belirtilmemiş'}</div>${age?`<div class="jage">${age}</div>`:''}</div>
        <div class="foot-btns">
          <button class="det-btn" onclick="event.stopPropagation();openDetIsv(${i})">Detay</button>
          <button class="wabtn" onclick="event.stopPropagation();waG()">💬 Yaz</button>
        </div>
      </div></div>`;
  });
  el.innerHTML=h; setRC(isv.length,'işveren ilanı');
}

function renderHekimler(){
  const el=document.getElementById('p-hekimler'); if(!el) return;
  let hk=allData.filter(r=>r.tip.includes('ARIY'));
  if(!sortAsc) hk=[...hk].reverse();
  let h=abH('hekim','➕','Sisteme Kaydol','Profilini ekle, klinikler seni bulsun');
  if(!hk.length) h+=emH2('👩‍⚕️','Henüz hekim ilanı yok','İlk hekim profilini ekle!');
  else hk.forEach((d,i)=>{
    const id='hk_'+i, sv=savedIds.includes(id);
    const isim=d.isim||'Hekim', msk=maskIsim(isim);
    const meslek=d.meslek||'Veteriner Hekim';
    const tip=meslek.toLowerCase().includes('staj')?'Stajyer':meslek.toLowerCase().includes('öğrenc')?'Öğrenci':'Hekim';
    const age=ageStr(d.zaman), isNew=age.includes('🆕');
    const flds=[d.isim,d.cinsiyet,d.meslek,d.hkSehir,d.hkUzmanlik,d.hkMaas,d.hkCalisma,d.hkDeneyim];
    const pct=Math.round(flds.filter(f=>f&&f.trim()).length/flds.length*100);
    const pc=pct>=80?'var(--green)':pct>=50?'var(--yellow)':'var(--red)';
    h+=`<div class="hc${sv?' saved':''} d${(i%4)+1}"
      data-id="${id}"
      data-search="${s4(isim,d.hkSehir,d.hkUzmanlik,d.hkMaas,d.hkCalisma,d.cinsiyet,d.hkDeneyim,meslek)}"
      data-sehir="${d.hkSehir.toLowerCase()}" data-uz="${d.hkUzmanlik.toLowerCase()}" data-cal="${d.hkCalisma.toLowerCase()}"
      onclick="clickCard('hk',${i})">
      <div class="hc-head">
        <div class="hc-left">
          <div class="av ${avs[i%5]}">${emH[i%5]}</div>
          <div class="hc-info">
            <div class="hc-name">${msk}${isNew?'<span class="new-badge">YENİ</span>':''} ${d.cinsiyet?`<span style="font-size:10px;color:var(--muted)">· ${d.cinsiyet}</span>`:''}</div>
            <div class="hc-role">${tip} · ${d.hkDeneyim||'Deneyim belirtilmemiş'}</div>
          </div>
        </div>
        <button class="save-btn${sv?' saved':''}" onclick="event.stopPropagation();toggleSave('${id}',this)">${sv?'⭐':'☆'}</button>
      </div>
      <div class="prog-row"><div class="prog-bar"><div class="prog-fill" style="width:${pct}%;background:${pc}"></div></div><div class="prog-lbl" style="color:${pc}">%${pct} profil</div></div>
      ${d.hkMaas?`<div class="sal-row"><div class="sal-val">${d.hkMaas}</div><div class="sal-bar"><div class="sal-fill" style="width:${salPct(d.hkMaas)}%"></div></div></div>`:''}
      <div class="tags">
        ${d.hkCalisma?`<span class="tag tb">${d.hkCalisma}</span>`:''}
        ${d.hkSehir?`<span class="tag tg">${d.hkSehir.split(',')[0]}</span>`:''}
        ${d.hkPozisyon?`<span class="tag to">${d.hkPozisyon}</span>`:''}
        ${mkT(d.hkUzmanlik,'tp')}
      </div>
      <div class="jc-foot">
        <div class="jc-meta"><div class="jcity">📍 ${d.hkSehir||'Belirtilmemiş'}</div>${age?`<div class="jage">${age}</div>`:''}</div>
        <div class="foot-btns">
          <button class="det-btn" onclick="event.stopPropagation();openDetHk(${i})">Detay</button>
          <button class="wabtn" onclick="event.stopPropagation();waG()">💬 Yaz</button>
        </div>
      </div></div>`;
  });
  el.innerHTML=h; setRC(hk.length,'hekim ilanı');
}

function renderNobet(){
  const el=document.getElementById('p-nobet'); if(!el) return;
  let h=`<div class="nbhdr"><div class="nht">🔄 Nöbet Takası</div><div class="nhs">Nöbetini değiştirmek mi istiyorsun? Anında ilan ver, teklif al.</div></div>`;
  h+=abH('nobet','🔄','Takas İlanı Ver','Nöbet tarihini paylaş, teklif al');
  if(!nobetData.length) h+=emH2('📋','Henüz takas ilanı yok','İlk ilanı sen ver!');
  else nobetData.forEach((d,i)=>{
    h+=`<div class="nbc d${(i%4)+1}">
      <div class="nct"><div class="ncn">${maskIsim(d.ad)}</div><div class="ncb">${d.tarih||'Tarih yok'}</div></div>
      <div class="ncd">🏥 ${d.klinik||'—'} &nbsp;📍 ${d.sehir||'—'}<br>${d.aciklama||''}</div>
      <div class="ncf"><button class="ncw" onclick="waG()">💬 WhatsApp</button></div>
    </div>`;
  });
  el.innerHTML=h;
}

function renderSaved(){
  const el=document.getElementById('p-saved'); if(!el) return;
  if(!savedIds.length){ el.innerHTML=`<div class="saved-empty"><div class="ei">📌</div><h3>Henüz kayıtlı ilan yok</h3><p>İlanlardaki ⭐ ikonuna basarak kaydet.</p></div>`; return; }
  let h='';
  savedIds.forEach(id=>{
    const [tip,idx]=id.split('_');
    const d=tip==='isv'?allData.filter(r=>r.tip.includes('İŞVEREN'))[+idx]:allData.filter(r=>r.tip.includes('ARIY'))[+idx];
    if(!d) return;
    const name=tip==='isv'?(d.klinik||'Klinik'):maskIsim(d.isim);
    const sub=tip==='isv'?(d.pozisyon||d.faaliyet||''):(d.meslek||'Veteriner Hekim');
    h+=`<div class="jc d1" onclick="${tip==='isv'?'openDetIsv('+idx+')':'openDetHk('+idx+')'}">
      <div class="jc-head">
        <div class="jc-left"><div class="av ${tip==='isv'?'ag':'ab'}">${tip==='isv'?'🏥':'👩‍⚕️'}</div><div class="ji"><div class="jn">${name}</div><div class="jp">${sub}</div></div></div>
        <button class="save-btn saved" onclick="event.stopPropagation();toggleSave('${id}',this)">⭐</button>
      </div>
      <div class="jc-foot"><div class="jcity">📍 ${tip==='isv'?(d.sehir||'—'):(d.hkSehir||'—')}</div><button class="wabtn" onclick="event.stopPropagation();waG()">💬 Yaz</button></div>
    </div>`;
  });
  el.innerHTML=h; setRC(savedIds.length,'kayıtlı ilan');
}

function renderSector(s){
  const el=document.getElementById('p-sektor'); if(!el) return;
  const L={gida:'🍖 Gıda Sektörü',lab:'🧪 Laboratuvar',ilac:'💊 İlaç Firması',gece:'🌙 Gece Vet. Hekimi'};
  el.innerHTML=abH('sektor_'+s,'➕','İlan Ver / Kaydol','Bu sektörde pozisyon ekle')+emH2(
    s==='gida'?'🍖':s==='lab'?'🧪':s==='ilac'?'💊':'🌙',
    L[s]||s,'Bu sektörden henüz ilan yok.<br>İlk ilanı sen ver!');
}

function renderOzellikler(){
  const el=document.getElementById('p-ozellikler'); if(!el) return;
  const isv=allData.filter(r=>r.tip.includes('İŞVEREN'));

  // Bana uygun ilanlar
  let matchHtml='';
  if(userProfile){
    const sorted=[...isv].sort((a,b)=>matchScore(b)-matchScore(a)).slice(0,4);
    matchHtml=sorted.map((d,i)=>{
      const ms=matchScore(d);
      if(ms===0) return '';
      return `<div class="match-item" onclick="openDetIsv(${isv.indexOf(d)})">
        <div class="mi-left"><div class="mi-name">${d.klinik||'Klinik'}</div><div class="mi-sub">${d.pozisyon||''} · ${d.sehir||''}</div></div>
        <div class="mi-pct">${ms}% uyum</div>
      </div>`;
    }).filter(Boolean).join('');
    if(!matchHtml) matchHtml=`<div style="font-size:11px;color:var(--muted);text-align:center;padding:10px;">Daha iyi eşleşmeler için profilini güncelle.</div>`;
  } else {
    matchHtml=`<div style="font-size:11px;color:var(--muted);padding:10px;">
      <div style="margin-bottom:8px;">Profil ekleyince size uygun ilanları görürsünüz.</div>
      <button onclick="openForm('hekim')" style="background:var(--green);color:#000;border:none;border-radius:9px;padding:8px 14px;font-size:12px;font-weight:700;cursor:pointer;font-family:inherit;width:100%">➕ Profil Ekle</button>
    </div>`;
  }

  el.innerHTML=`
  <!-- Bana uygun -->
  <div class="sec-panel">
    <div class="sp-title">🎯 Bana Uygun İlanlar</div>
    ${matchHtml}
  </div>

  <!-- Başvuru takibi -->
  <div class="sec-panel">
    <div class="sp-title">📋 Başvuru Takibi</div>
    <div class="at-steps">
      <div class="at-step"><div class="at-dot done">✓</div><div class="at-lbl">Gönderildi</div></div>
      <div class="at-step"><div class="at-dot active">👁</div><div class="at-lbl">İnceleniyor</div></div>
      <div class="at-step"><div class="at-dot">📞</div><div class="at-lbl">Görüşme</div></div>
      <div class="at-step"><div class="at-dot rejected" style="display:none" id="rej-dot">✕</div><div class="at-dot" id="ok-dot">🎉</div><div class="at-lbl">Sonuç</div></div>
    </div>
    <div style="margin-top:12px;display:flex;gap:7px;">
      <button onclick="showToast('✅ Teklif aldınız olarak işaretlendi!')" style="flex:1;background:var(--green);color:#000;border:none;border-radius:8px;padding:8px;font-size:11px;font-weight:700;cursor:pointer;font-family:inherit">✅ Teklif Aldım</button>
      <button onclick="document.getElementById('rej-dot').style.display='flex';document.getElementById('ok-dot').style.display='none';showToast('Reddedildi işaretlendi')" style="flex:1;background:rgba(255,107,107,.15);color:var(--red);border:1px solid rgba(255,107,107,.3);border-radius:8px;padding:8px;font-size:11px;font-weight:700;cursor:pointer;font-family:inherit">❌ Reddedildi</button>
    </div>
  </div>

  <!-- Maaş hesaplama -->
  <div class="sec-panel">
    <div class="sp-title">💰 Maaş Beklenti Hesaplama</div>
    <div style="font-size:10px;color:var(--muted);margin-bottom:8px;">ODA ortalama maaş skalasına göre hesaplanır.</div>
    <div class="sc-row">
      <select class="sc-sel" id="sc-sehir" onchange="calcSalary()">
        <option value="">Şehir seç</option>
        <option value="istanbul">İstanbul</option>
        <option value="ankara">Ankara</option>
        <option value="izmir">İzmir</option>
        <option value="bursa">Bursa</option>
        <option value="sakarya">Sakarya</option>
        <option value="antalya">Antalya</option>
        <option value="diger">Diğer şehirler</option>
      </select>
      <select class="sc-sel" id="sc-exp" onchange="calcSalary()">
        <option value="">Deneyim</option>
        <option value="0" data-mult="0.9">Yeni mezun</option>
        <option value="2" data-mult="1.0">1-2 yıl</option>
        <option value="5" data-mult="1.25">3-5 yıl</option>
        <option value="10" data-mult="1.6">5+ yıl</option>
      </select>
    </div>
    <div class="sc-result" id="sc-result"></div>
  </div>

  <!-- Eksik beceri önerisi -->
  <div class="skill-tip">
    <div class="st-title">💡 Eksik Beceri Önerisi</div>
    <div style="font-size:11px;color:var(--text2);margin-bottom:7px;">İlanlarda sık aranan ama çoğu profilde eksik olan beceriler:</div>
    <div class="st-list">
      <span class="tag tp">Yumuşak Doku Cerrahisi</span>
      <span class="tag tb">USG Görüntüleme</span>
      <span class="tag tg">Ortopedi</span>
      <span class="tag to">Onkoloji</span>
      <span class="tag ty">Gıda Hijyeni</span>
    </div>
  </div>

  <!-- CV Şablonları -->
  <div class="sub-title">📄 Hazır CV Şablonları</div>
  <div class="cv-grid" style="margin-bottom:12px;">
    <div class="cv-card" onclick="sendCV('Klinik Hekim')"><div class="cv-icon">🏥</div><div class="cv-name">Klinik Hekim</div><div class="cv-sub">WhatsApp'tan gönder</div></div>
    <div class="cv-card" onclick="sendCV('Uzman Hekim')"><div class="cv-icon">🔬</div><div class="cv-name">Uzman Hekim</div><div class="cv-sub">WhatsApp'tan gönder</div></div>
    <div class="cv-card" onclick="sendCV('Yeni Mezun')"><div class="cv-icon">🎓</div><div class="cv-name">Yeni Mezun</div><div class="cv-sub">WhatsApp'tan gönder</div></div>
    <div class="cv-card" onclick="sendCV('Gıda/Lab')"><div class="cv-icon">🍖</div><div class="cv-name">Gıda / Lab</div><div class="cv-sub">WhatsApp'tan gönder</div></div>
  </div>

  <!-- Staj & Barınak -->
  <div class="sub-title">🎓 Staj & Barınak Eklemek İçin</div>
  <div class="intern-item" onclick="waG()">
    <div class="ii-icon ag">🏥</div>
    <div class="ii-info"><div class="ii-name">Klinik Staj Programı</div><div class="ii-sub">Kliniğini veya başvuruyu A-Takımına bildir</div></div>
    <button class="ii-btn">Bildir</button>
  </div>
  <div class="intern-item" onclick="waG()">
    <div class="ii-icon cb">🦴</div>
    <div class="ii-info"><div class="ii-name">Barınak Gönüllülüğü</div><div class="ii-sub">Barınak bilgilerini ekletmek için yaz</div></div>
    <button class="ii-btn">Eklet</button>
  </div>
  <div class="intern-item" onclick="waG()">
    <div class="ii-icon ao">🌾</div>
    <div class="ii-info"><div class="ii-name">Çiftlik Hekimliği Stajı</div><div class="ii-sub">Çiftlik bilgilerini ekletmek için yaz</div></div>
    <button class="ii-btn">Eklet</button>
  </div>

  <!-- Bölgesel gruplar — direkt WA linki -->
  <div class="sub-title">🗺️ Bölgesel Veteriner Grupları</div>
  <div class="group-item" onclick="window.open('${WA_GRUP}','_blank')">
    <div class="gi-left"><div class="gi-icon">🌍</div><div><div class="gi-name">VeTalent İVHP A-Takımı</div><div class="gi-count">Ana grup — tüm şehirler</div></div></div>
    <button class="gi-join">Katıl</button>
  </div>
  <div class="group-item" onclick="window.open('${WA_GRUP}','_blank')">
    <div class="gi-left"><div class="gi-icon">🏙️</div><div><div class="gi-name">İstanbul Veteriner Ağı</div><div class="gi-count">Gruba katılmak için A-Takımına yaz</div></div></div>
    <button class="gi-join">Katıl</button>
  </div>
  <div class="group-item" onclick="window.open('${WA_GRUP}','_blank')">
    <div class="gi-left"><div class="gi-icon">🎓</div><div><div class="gi-name">Yeni Mezunlar Grubu</div><div class="gi-count">Gruba katılmak için A-Takımına yaz</div></div></div>
    <button class="gi-join">Katıl</button>
  </div>
  <div style="font-size:11px;color:var(--muted);text-align:center;padding:8px;background:var(--card2);border-radius:10px;margin-bottom:8px;">
    💬 Kendi bölgeni gruba ekletmek için A-Takımına WhatsApp'tan yaz.
  </div>`;
}

function calcSalary(){
  const sEl=document.getElementById('sc-sehir'), eEl=document.getElementById('sc-exp');
  if(!sEl||!eEl) return;
  const 
