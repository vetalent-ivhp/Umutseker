// VeTalent IVHP - script.js - CLEAN v3
var _w=atob('OTA1MDY0NDA1MDEy');
var _p=atob('QmF5dGFydW11dDEy');
var SHEET_ID='1bgqT1T_ZHUGdyyIODQaxDKVUMtgeUiHcaA1OQYzWm8M';
var SCRIPT_URL='https://script.google.com/macros/s/AKfycbwbiC0eMI_TUgVdvp5kbHy_38-VW4ky-8DTMqBCE8gN_LfzMCIDfWmTYJ43I4-ognCr/exec';

var WA_GROUPS=[
  {name:"VeTalent Istihdam",link:"https://chat.whatsapp.com/KhFbvSYVpj26kqhnrLjnV7?mode=gi_t",brans:"Genel",sehir:"Turkiye"},
  {name:"IVHP Klinik Grubu",link:"https://chat.whatsapp.com/DuAonuHByHOHvThb1lajaL?mode=gi_t",brans:"Klinik",sehir:"Istanbul"},
  {name:"VeTalent Kanatli",link:"https://chat.whatsapp.com/Kfyh6LNjaJo1g8KBbjbPIb?mode=gi_t",brans:"Kanatli",sehir:"Turkiye"},
  {name:"IVHP Gida Denetim",link:"https://chat.whatsapp.com/BkMZvlHJvqZD64w16Nw4hV?mode=gi_t",brans:"Gida",sehir:"Turkiye"},
  {name:"VeTalent Ciftlik",link:"https://chat.whatsapp.com/BtO9CHnCpFC3ayk9wVxoGi?mode=gi_t",brans:"Ciftlik",sehir:"Turkiye"},
  {name:"IVHP Ilac Saha",link:"https://chat.whatsapp.com/DM6j9ZJVXVxCewi0QyfYmS?mode=gi_t",brans:"Ilac",sehir:"Turkiye"},
  {name:"VeTalent Lab",link:"https://chat.whatsapp.com/LYU8oUJg15eJAjNHecrTjR?mode=gi_t",brans:"Lab",sehir:"Turkiye"},
  {name:"IVHP Gece Acil",link:"https://chat.whatsapp.com/D3qVdCczg958plxoUPaRF1?mode=gi_t",brans:"Gece",sehir:"Istanbul"},
  {name:"VeTalent Staj",link:"https://chat.whatsapp.com/L6aKbK8LFTqAHQoaMRS7AC?mode=gi_t",brans:"Staj",sehir:"Turkiye"},
  {name:"IVHP Ana Grup",link:"https://chat.whatsapp.com/CqMVj0LJwLR36hhGHyynIY?mode=gi_t",brans:"Genel",sehir:"Istanbul"},
];

var MAAS_OPTS=[
  "50.000 TL - 60.000 TL",
  "60.000 TL - 75.000 TL",
  "75.000 TL - 90.000 TL",
  "90.000 TL - 110.000 TL",
  "110.000 TL ve Uzeri",
  "Oda Maasi",
  "Gorusulecektir",
];
var BRANS_LIST=["Klinik/Pet","Gece/Acil","Gida/Denetim","Ilac/Saha","Kanatli","Lab/Tani","Ciftlik","Pratisyen","USG"];
var DENEYIM=["Yeni Mezun","1-3 Yil","3-5 Yil","5+ Yil"];
var CALISMA=["Tam Zamanli","Yari Zamanli","Nobet Usulu","Gece Nobet"];
var IMKAN=["Lojman","Yemek","Prim","Tam Sigorta","Arac"];

var SEKTOR_MAP={
  "klinik":{cls:"sek-klinik",renk:"#2d5a27",label:"Klinik"},
  "pet":{cls:"sek-klinik",renk:"#2d5a27",label:"Klinik"},
  "gida":{cls:"sek-gida",renk:"#e67e22",label:"Gida"},
  "ilac":{cls:"sek-ilac",renk:"#2980b9",label:"Ilac"},
  "kanatli":{cls:"sek-kanatli",renk:"#c8a000",label:"Kanatli"},
  "lab":{cls:"sek-lab",renk:"#8e44ad",label:"Lab"},
  "ciftlik":{cls:"sek-ciftlik",renk:"#c0392b",label:"Ciftlik"},
  "gece":{cls:"sek-klinik",renk:"#e74c3c",label:"Gece/Acil"},
};

var all=[],nobetData=[],stajData=[];
var curPg='ilanlar';
var sortAsc=false,kvkk=false,adminOk=false;
var saved=JSON.parse(localStorage.getItem('vt_s')||'[]');
var eslesmeMap={},zkSt={b:[],d:'',c:'',i:[]},zkSektor='';


function norm(s){
  return (s||'').toLowerCase()
    .replace(/İ|I/g,'i').replace(/ı/g,'i')
    .replace(/ğ|Ğ/g,'g').replace(/ü|Ü/g,'u')
    .replace(/ş|Ş/g,'s').replace(/ö|Ö/g,'o')
    .replace(/ç|Ç/g,'c');
}
function gv(id){return (document.getElementById(id)||{}).value||'';}
function sT(id,v){var e=document.getElementById(id);if(e)e.textContent=v;}
function toast(msg){
  var t=document.getElementById('toast');
  if(!t)return;
  t.textContent=msg;
  t.classList.add('on');
  clearTimeout(t._ti);
  t._ti=setTimeout(function(){t.classList.remove('on');},2500);
}
function setRC(n,l){sT('rc',n?n+' '+l+' bulundu':'');}
function maskName(n){
  if(!n)return '---';
  return n.trim().split(' ').map(function(p){return p.length<=1?p:p[0]+'***';}).join(' ');
}
function getSek(faal,uzm,sektor){
  var s=norm((faal||'')+' '+(uzm||'')+' '+(sektor||''));
  var keys=Object.keys(SEKTOR_MAP);
  for(var i=0;i<keys.length;i++){if(s.indexOf(keys[i])>-1)return SEKTOR_MAP[keys[i]];}
  return {cls:'sek-klinik',renk:'#2d5a27',label:'Klinik'};
}
function ageStr(z){
  if(!z)return '';
  try{
    var m=z.match(/(\d{2})\.(\d{2})\.(\d{4})/);
    if(!m)return '';
    var d=new Date(+m[3],+m[2]-1,+m[1]);
    var diff=Math.floor((Date.now()-d)/86400000);
    if(diff<=0)return 'Bugun';
    if(diff<=3)return diff+' gun once';
    if(diff<=7)return diff+' gun once';
    if(diff<=30)return Math.floor(diff/7)+' hafta once';
    return Math.floor(diff/30)+' ay once';
  }catch(e){return '';}
}
function salPct(m){
  if(!m)return 35;
  var M=m.replace(/\./g,'').toLowerCase();
  if(M.indexOf('110')>-1)return 90;
  if(M.indexOf('90')>-1)return 75;
  if(M.indexOf('75')>-1)return 62;
  if(M.indexOf('60')>-1)return 50;
  return 38;
}
function freshBar(z){
  if(!z)return '';
  try{
    var m=z.match(/(\d{2})\.(\d{2})\.(\d{4})/);
    if(!m)return '';
    var d=new Date(+m[3],+m[2]-1,+m[1]);
    var p=Math.max(0,Math.round((1-Math.floor((Date.now()-d)/86400000)/30)*100));
    var col=p>60?'var(--green)':p>30?'var(--yellow)':'var(--red)';
    return '<div class="fbar"><div class="ffill" style="width:'+p+'%;background:'+col+'"></div></div>'
      +'<div class="flbl" style="color:'+col+'">Tazelik %'+p+'</div>';
  }catch(e){return '';}
}
function mktag(s,c){
  if(!s)return '';
  return s.split(',').slice(0,2).map(function(u){
    return '<span class="tag '+c+'">'+u.trim()+'</span>';
  }).join('');
}
function empBlk(ico,t,s){
  return '<div class="emp"><div class="empi">'+ico+'</div><h3>'+t+'</h3><p>'+s+'</p></div>';
}
function aBnr(tp,ico,t1,t2){
  return '<div class="abtn" data-openform="'+tp+'">'
    +'<div class="aico">'+ico+'</div>'
    +'<div class="att"><div class="at1">'+t1+'</div><div class="at2">'+t2+'</div></div>'
    +'<div class="aarr">></div></div>';
}
function maasDD(id){
  id=id||'f-maas';
  var opts=MAAS_OPTS.map(function(o){return '<option>'+o+'</option>';}).join('');
  return '<select class="maas-sel" id="'+id+'"><option value="">Seciniz...</option>'+opts+'</select>';
}


function waGo(msg){
  var url=msg?'https://wa.me/'+_w+'?text='+msg:'https://wa.me/'+_w;
  showWaModal(function(){window.open(url,'_blank');});
}
function showWaModal(cb){
  var ov=document.createElement('div');
  ov.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,.78);z-index:9999;display:flex;align-items:flex-end;justify-content:center';
  var d=document.createElement('div');
  d.style.cssText='background:#0f2318;border-radius:24px 24px 0 0;border:1px solid rgba(52,201,122,.3);width:100%;max-width:430px;padding:22px 20px 42px';
  d.innerHTML='<div style="width:34px;height:4px;background:rgba(52,201,122,.2);border-radius:4px;margin:0 auto 16px"></div>'
    +'<div style="font-family:Syne,sans-serif;font-size:15px;font-weight:800;margin-bottom:6px">Yonlendirme</div>'
    +'<div style="font-size:12px;color:#6b9478;margin-bottom:20px;line-height:1.6"><b style="color:#b8d4c4">VeTalent / IVHP</b> yoneticisine yonlendiriliyorsunuz.</div>'
    +'<button id="wa-ok-btn" style="width:100%;background:#25d366;color:#fff;border:none;border-radius:12px;padding:13px;font-size:14px;font-weight:800;cursor:pointer;font-family:inherit;margin-bottom:8px">Evet, Devam</button>'
    +'<button id="wa-cl-btn" style="width:100%;background:transparent;color:#6b9478;border:none;padding:9px;font-size:12px;cursor:pointer;font-family:inherit">Iptal</button>';
  ov.appendChild(d);
  document.body.appendChild(ov);
  d.addEventListener('click',function(e){
    if(e.target.id==='wa-ok-btn'){cb();document.body.removeChild(ov);}
    if(e.target.id==='wa-cl-btn'){document.body.removeChild(ov);}
  });
  ov.addEventListener('click',function(e){if(e.target===ov)document.body.removeChild(ov);});
}


function startClock(){
  var AY=['Oca','Sub','Mar','Nis','May','Haz','Tem','Agu','Eyl','Eki','Kas','Ara'];
  var GUN=['Paz','Pzt','Sal','Car','Per','Cum','Cmt'];
  function tick(){
    var n=new Date();
    var hh=String(n.getHours()).padStart(2,'0');
    var mm=String(n.getMinutes()).padStart(2,'0');
    var ss=String(n.getSeconds()).padStart(2,'0');
    sT('ct-time',hh+':'+mm+':'+ss);
    sT('ct-date',GUN[n.getDay()]+' '+n.getDate()+' '+AY[n.getMonth()]);
  }
  tick();
  setInterval(tick,1000);
  document.addEventListener('visibilitychange',function(){if(!document.hidden)tick();});
}


function setConn(ok){
  var row=document.getElementById('connRow');
  if(!row)return;
  row.style.display=ok?'flex':'none';
  if(ok){
    sT('ctxt','Sheets bagli');
    var dot=document.getElementById('cdot');
    if(dot)dot.style.background='var(--green)';
  }
}
function mapRow(row){
  function v(keys){
    for(var i=0;i<keys.length;i++){if(row[keys[i]]!==undefined&&row[keys[i]]!=='')return row[keys[i]];}
    return '';
  }
  return {
    z:v(['Zaman damgasi','zaman','z']),
    tip:v(['UYGUN SECENEGI','tip','Tip']),
    klinik:v(['KLINIK ISLETMENIN ADI','klinik','Klinik']),
    yetkili:v(['YETKILI KISI','yetkili']),
    sehir:v(['ISLETMENIN BULUNDUGU IL','sehir','Sehir']),
    faaliyet:v(['FAALIYET ALANI','faaliyet']),
    deneyim:v(['ARANAN DENEYIM','deneyim']),
    pozisyon:v(['ARANAN POZISYON','pozisyon']),
    calisma:v(['CALISMA SEKLI','calisma']),
    maas:v(['MAAS UCRET BILGISI','maas']),
    uzmanlik:v(['ARANAN UZMANLIK','uzmanlik']),
    tel:v(['WHATSAPP TELEFON','tel']),
    isim:v(['SOYISIM','isim']),
    cinsiyet:v(['CINSIYET','cinsiyet']),
    meslek:v(['MESLEK','meslek']),
    hkSehir:v(['CALISMAK ISTEDIGINIZ','hkSehir']),
    hkPoz:v(['ARADIGINIZ POZISYON','hkPoz']),
    hkDeneyim:v(['DENEYIM DURUMU','hkDeneyim']),
    hkCalisma:v(['HK CALISMA','hkCalisma']),
    hkMaas:v(['MAAS BEKLENTISI','hkMaas']),
    hkUzmanlik:v(['UZMANLIK ILGI','hkUzmanlik']),
    durum:v(['DURUM','durum']),
    sektor:v(['Sektor','sektor']),
  };
}
async function fetchAll(){
  if(SCRIPT_URL&&SCRIPT_URL.indexOf('script.google.com')>-1){
    try{
      var r=await fetch(SCRIPT_URL+'?action=getIlanlar&cb='+Date.now());
      var j=await r.json();
      if(j.ok&&j.data&&j.data.length>0){
        all=j.data.map(mapRow).filter(function(r){return r.tip||r.klinik;});
        setConn(true);hesaplaEslesme();renderAll();upCounts();
        console.log('[VT] Apps Script:'+all.length);return;
      }
    }catch(e){console.warn('[VT] Script err:',e.message);}
  }
  try{
    var url='https://docs.google.com/spreadsheets/d/'+SHEET_ID
      +'/gviz/tq?tqx=out:json&sheet=ivhp%20istihdam&cb='+Date.now();
    var r2=await fetch(url),t=await r2.text();
    var m=t.match(/google\.visualization\.Query\.setResponse\(([\s\S]*?)\);/);
    if(!m)throw new Error('gviz');
    var j2=JSON.parse(m[1]);
    var raw=(j2.table.rows||[]).map(function(row){
      var c=row.c,v=function(i){return (c[i]&&c[i].v)?String(c[i].v).trim():'';};
      return {z:v(0),tip:v(1),klinik:v(2),yetkili:v(3),sehir:v(4),faaliyet:v(5),
        deneyim:v(6),pozisyon:v(7),calisma:v(9),maas:v(10),uzmanlik:v(11),
        tel:v(12),isim:v(13),cinsiyet:v(14),meslek:v(15),hkSehir:v(16),
        hkPoz:v(17),hkDeneyim:v(18),hkCalisma:v(19),hkMaas:v(20),
        hkUzmanlik:v(21),durum:v(24),sektor:v(25)};
    }).filter(function(r){return r.tip;});
    all=raw.filter(function(r){return norm(r.durum).indexOf('onaylandi')>-1||norm(r.durum).indexOf('onaylandı')>-1;});
    setConn(true);hesaplaEslesme();renderAll();upCounts();
    console.log('[VT] gviz:'+all.length);
  }catch(e2){console.warn('[VT] gviz err:',e2.message);setConn(false);fallback();}
}
async function fetchNobet(){
  try{
    var url='https://docs.google.com/spreadsheets/d/'+SHEET_ID
      +'/gviz/tq?tqx=out:json&sheet=n%C3%B6bet%20takas&cb='+Date.now();
    var r=await fetch(url),t=await r.text();
    var m=t.match(/google\.visualization\.Query\.setResponse\(([\s\S]*?)\);/);
    if(!m)return;
    var j=JSON.parse(m[1]);
    nobetData=(j.table.rows||[]).map(function(row){
      var c=row.c,v=function(i){return (c[i]&&c[i].v)?String(c[i].v).trim():'';};
      return {id:v(0),ad:v(1),teklifVeren:v(2),sahipNobet:v(3),takasGunu:v(4),tel:v(5),durum:v(6)};
    }).filter(function(r){return r.ad;});
    if(curPg==='nobet')renderNobet();
    upCounts();
  }catch(e){}
}
async function fetchStaj(){
  try{
    var url='https://docs.google.com/spreadsheets/d/'+SHEET_ID
      +'/gviz/tq?tqx=out:json&sheet=STAJ_ILANLARI&cb='+Date.now();
    var r=await fetch(url),t=await r.text();
    var m=t.match(/google\.visualization\.Query\.setResponse\(([\s\S]*?)\);/);
    if(!m)return;
    var j=JSON.parse(m[1]);
    stajData=(j.table.rows||[]).map(function(row){
      var c=row.c,v=function(i){return (c[i]&&c[i].v)?String(c[i].v).trim():'';};
      return {id:v(0),baslik:v(1),sirket:v(2),brans:v(3),sehir:v(4),stajTuru:v(7),aciklama:v(9)};
    }).filter(function(r){return r.baslik;});
    if(curPg==='araclar')renderAraclar();
  }catch(e){}
}
async function fetchWaGroups(){
  try{
    var url='https://docs.google.com/spreadsheets/d/'+SHEET_ID
      +'/gviz/tq?tqx=out:json&sheet=WA_GRUPLARI&cb='+Date.now();
    var r=await fetch(url),t=await r.text();
    var m=t.match(/google\.visualization\.Query\.setResponse\(([\s\S]*?)\);/);
    if(!m)return;
    var j=JSON.parse(m[1]);
    (j.table.rows||[]).forEach(function(row){
      var c=row.c,v=function(i){return (c[i]&&c[i].v)?String(c[i].v).trim():'';};
      var g={name:v(0),link:v(1),brans:v(2),sehir:v(3),aktif:v(5)};
      if(!g.name||!g.link||g.link.indexOf('chat.whatsapp.com')<0)return;
      if(g.aktif.toUpperCase()==='YANLIS'||g.aktif.toUpperCase()==='FALSE')return;
      if(!WA_GROUPS.some(function(s){return s.link===g.link;}))WA_GROUPS.push(g);
    });
    if(curPg==='gruplar')renderGruplar();
  }catch(e){}
}


function hesaplaEslesme(){
  eslesmeMap={};
  var iv=all.filter(function(r){return r.tip&&r.tip.indexOf('SVEREN')>-1;});
  var hk=all.filter(function(r){return r.tip&&r.tip.indexOf('ARIY')>-1;});
  iv.forEach(function(isv){
    var gi=all.indexOf(isv);
    var iS=norm(isv.sehir),iB=norm(isv.faaliyet+' '+isv.uzmanlik+' '+(isv.sektor||''));
    var ok=false;
    hk.forEach(function(h){
      var hS=norm(h.hkSehir),hB=norm(h.hkUzmanlik+' '+h.hkPoz);
      if((iS&&hS&&(hS.indexOf(iS.split(',')[0])>-1||iS.indexOf(hS.split(',')[0])>-1))||
         (iB&&hB&&iB.split(' ').some(function(w){return w.length>3&&hB.indexOf(w)>-1;})))ok=true;
    });
    if(ok)eslesmeMap[gi]=true;
  });
}
function loadCVProfile(){return JSON.parse(localStorage.getItem('vt_cv_profile')||'null');}
function saveCVProfile(p){localStorage.setItem('vt_cv_profile',JSON.stringify(p));}
function isCVLoaded(){return !!localStorage.getItem('vt_cv_profile');}
function getCVPct(){
  var p=loadCVProfile();if(!p)return 0;
  var f=[p.ad,p.tel,p.sehir,p.brans,p.deneyim,p.maas];
  return Math.round(f.filter(Boolean).length/f.length*100);
}
function calcScore(d){
  var p=loadCVProfile();if(!p)return 0;
  var s=0;
  if(p.sehir&&d.sehir&&norm(d.sehir).indexOf(norm(p.sehir))>-1)s+=50;
  if(p.brans&&d.uzmanlik&&norm(d.uzmanlik).indexOf(norm(p.brans))>-1)s+=50;
  return s;
}


function renderIlanlar(){
  var el=document.getElementById('pg-ilanlar');if(!el)return;
  var isv=all.filter(function(r){return r.tip&&r.tip.indexOf('SVEREN')>-1;});
  var arr=sortAsc?isv.slice():isv.slice().reverse();
  var h=aBnr('isveren','+','Ilan Ver','Pozisyonunuzu ekleyin');
  if(!arr.length){h+=empBlk('-','Ilan yukleniyor...','Sheets baglantisi kontrol ediliyor.');}
  else arr.forEach(function(d){
    var gi=all.indexOf(d),id='i_'+gi,sv=saved.indexOf(id)>-1;
    var a=ageStr(d.z),sek=getSek(d.faaliyet,d.uzmanlik,d.sektor),esm=eslesmeMap[gi];
    h+='<div class="jc '+sek.cls+'" data-gi="'+gi+'" data-s="'+norm((d.klinik||'')+' '+(d.sehir||'')+' '+(d.faaliyet||'')+' '+(d.uzmanlik||''))+'" style="padding-top:'+(esm?'18':'13')+'px">';
    if(esm)h+='<div style="position:absolute;top:-8px;left:12px;background:linear-gradient(135deg,#ff6b00,#ff9f43);color:#fff;font-size:9px;font-weight:800;padding:3px 9px;border-radius:6px;z-index:2">Eslesme Var</div>';
    h+='<div class="ctop">'
      +'<div class="cav" style="background:'+sek.renk+'22;font-size:11px;font-weight:800;color:'+sek.renk+'">'+sek.label+'</div>'
      +'<div class="cinfo"><div class="cname">'+(d.klinik||'Klinik')+'</div>'
      +'<div class="cpos">'+(d.pozisyon||d.faaliyet||'---')+'</div></div>'
      +'<div class="svb'+(sv?' on':'')+'" data-svid="'+id+'"><span>'+(sv?'*':'o')+'</span></div>'
      +'</div>'
      +'<div class="salr"><div class="salv">'+(d.maas||'Gorusulur')+'</div>'
      +'<div class="salb"><div class="salf" style="width:'+salPct(d.maas)+'%"></div></div></div>'
      +'<div class="ctags">';
    if(d.calisma)h+='<span class="tag t-b">'+d.calisma+'</span>';
    if(d.faaliyet)h+='<span class="tag t-g">'+d.faaliyet+'</span>';
    if(d.deneyim)h+='<span class="tag t-y">'+d.deneyim+'</span>';
    h+=mktag(d.uzmanlik,'t-p')+'</div>'
      +'<div class="cfoot"><div class="cmeta"><div class="ccity">~ '+(d.sehir||'---')+'</div>'+(a?'<div class="cage">'+a+'</div>':'')+'</div>'
      +'<div class="cbtns">'
      +'<button class="bdet" data-det="'+gi+'" data-tp="isv">Detay</button>'
      +'<button class="bwa" data-wa="1">WA</button>'
      +'</div></div>'
      +freshBar(d.z)+'</div>';
  });
  el.innerHTML=h;setRC(arr.length,'isveren');
}


function renderHekimler(){
  var el=document.getElementById('pg-hekimler');if(!el)return;
  var hk=all.filter(function(r){return r.tip&&r.tip.indexOf('ARIY')>-1;});
  var arr=sortAsc?hk.slice():hk.slice().reverse();
  var h=aBnr('hekim','+','CV Karti Ekle','Profilini ekle');
  if(!arr.length){h+=empBlk('-','CV Karti yok','Ilk kaydi sen ekle!');}
  else arr.forEach(function(d){
    var gi=all.indexOf(d),id='h_'+gi,sv=saved.indexOf(id)>-1;
    var msk=maskName(d.isim),a=ageStr(d.z);
    var flds=[d.isim,d.cinsiyet,d.meslek,d.hkSehir,d.hkUzmanlik,d.hkMaas];
    var pct=Math.round(flds.filter(Boolean).length/flds.length*100);
    var pc=pct>=80?'var(--green)':pct>=50?'var(--yellow)':'var(--red)';
    var sek=getSek(d.hkPoz,d.hkUzmanlik,d.sektor);
    h+='<div class="jc '+sek.cls+'" data-gi="'+gi+'" data-s="'+norm((d.isim||'')+' '+(d.hkSehir||'')+' '+(d.hkUzmanlik||''))+'">';
    h+='<div class="ctop">'
      +'<div class="cav" style="font-size:11px;font-weight:800">Dr</div>'
      +'<div class="cinfo"><div class="cname">'+msk+'</div>'
      +'<div class="cpos">'+(d.meslek||'Veteriner Hekim')+' - '+(d.hkDeneyim||'---')+'</div></div>'
      +'<div class="svb'+(sv?' on':'')+'" data-svid="'+id+'"><span>'+(sv?'*':'o')+'</span></div>'
      +'</div>'
      +'<div class="pr"><div class="pb"><div class="pf" style="width:'+pct+'%;background:'+pc+'"></div></div>'
      +'<div class="pl" style="color:'+pc+'">%'+pct+'</div></div>'
      +'<div class="ctags">';
    if(d.hkCalisma)h+='<span class="tag t-b">'+d.hkCalisma+'</span>';
    if(d.hkSehir)h+='<span class="tag t-g">'+d.hkSehir.split(',')[0]+'</span>';
    h+=mktag(d.hkUzmanlik,'t-p')+'</div>'
      +'<div class="cfoot"><div class="cmeta"><div class="ccity">~ '+(d.hkSehir||'---')+'</div>'+(a?'<div class="cage">'+a+'</div>':'')+'</div>'
      +'<div class="cbtns">'
      +'<button class="bdet" data-det="'+gi+'" data-tp="hk">Detay</button>'
      +'<button class="bwa" data-wa="1">WA</button>'
      +'</div></div>'
      +freshBar(d.z)+'</div>';
  });
  el.innerHTML=h;setRC(arr.length,'hekim');
}


function renderNobet(){
  var el=document.getElementById('pg-nobet');if(!el)return;
  var h='<div class="nhdr"><div class="nt">Nobet Takasi</div><div class="ns">Nobetini degistirmek mi istiyorsun? Ilan ver, teklif al.</div></div>';
  h+=aBnr('nobet','+','Takas Ilani Ver','Nobet tarihini paylas');
  if(!nobetData.length){h+=empBlk('-','Takas ilani yok','Ilk ilani sen ver!');}
  else nobetData.forEach(function(d){
    var dur=d.durum||'ACIK';
    var dCol=dur==='ACIK'?'var(--green)':dur==='TEKLIF VAR'?'var(--yellow)':'var(--muted)';
    h+='<div class="nbc" data-s="'+norm((d.ad||'')+' '+(d.sahipNobet||'')+' '+(d.takasGunu||''))+'">'
      +'<div class="nct"><div class="ncn">'+maskName(d.ad)+'</div>'
      +'<div class="ncb" style="color:'+dCol+'">'+dur+'</div></div>'
      +'<div class="ncd">Sahip: '+(d.sahipNobet||'---')+'<br>Takas: '+(d.takasGunu||'---')+'</div>'
      +'<div class="nbc-btns">'
      +'<button class="ncw" data-wa="1">Iletisim</button>'
      +'<button class="ncw-teklif" data-wa-nobet="'+maskName(d.ad)+'|'+(d.sahipNobet||'---')+'">Teklif Ver</button>'
      +'</div></div>';
  });
  el.innerHTML=h;
}


function renderSaved(){
  var el=document.getElementById('pg-saved');if(!el)return;
  if(!saved.length){
    el.innerHTML='<div class="svempty"><div class="ei">*</div><h3>Kayitli ilan yok</h3><p>Ilanlardaki * ile kaydet.</p></div>';return;
  }
  var h='';
  saved.forEach(function(id){
    try{
      var parts=id.split('_'),tp=parts[0],ix=parseInt(parts[1]);
      var d=all[ix];if(!d)return;
      var nm=tp==='i'?(d.klinik||'Klinik'):maskName(d.isim);
      h+='<div class="jc" data-gi="'+ix+'">'
        +'<div class="ctop"><div class="cav">-</div>'
        +'<div class="cinfo"><div class="cname">'+nm+'</div></div>'
        +'<div class="svb on" data-svid="'+id+'"><span>*</span></div></div>'
        +'<div class="cfoot"><div class="ccity">~ '+(tp==='i'?(d.sehir||'---'):(d.hkSehir||'---'))+'</div>'
        +'<button class="bwa" data-wa="1">WA</button></div></div>';
    }catch(e){}
  });
  el.innerHTML=h;setRC(saved.length,'kayitli');
}


function renderSector(s){
  var el=document.getElementById('pg-sektor');if(!el)return;
  var all_in_sec=all.filter(function(r){return r.tip&&r.tip.indexOf('SVEREN')>-1&&norm(r.faaliyet+' '+r.uzmanlik+' '+(r.sektor||'')).indexOf(s)>-1;});
  var h=aBnr('sektor_'+s,'+','Bu Sektorde Ilan Ver','Ilan ekle');
  if(!all_in_sec.length)h+=empBlk('-',s+' sektoru','Henuz ilan yok.');
  else all_in_sec.forEach(function(d){
    var gi=all.indexOf(d),sek=getSek(d.faaliyet,d.uzmanlik,d.sektor);
    h+='<div class="jc '+sek.cls+'" data-gi="'+gi+'" data-s="'+norm((d.klinik||'')+' '+(d.sehir||''))+'">'
      +'<div class="ctop"><div class="cav" style="font-size:10px">'+sek.label+'</div>'
      +'<div class="cinfo"><div class="cname">'+(d.klinik||'Klinik')+'</div>'
      +'<div class="cpos">'+(d.pozisyon||d.faaliyet||'---')+'</div></div></div>'
      +'<div class="cfoot"><div class="ccity">~ '+(d.sehir||'---')+'</div>'
      +'<button class="bdet" data-det="'+gi+'" data-tp="isv">Detay</button></div></div>';
  });
  el.innerHTML=h;
}
function renderAraclar(){
  var el=document.getElementById('pg-araclar');if(!el)return;
  var pct=getCVPct(),cvL=isCVLoaded();
  var h='<div class="cv-pro-card">'
    +'<div style="font-family:Syne,sans-serif;font-size:14px;font-weight:800;margin-bottom:4px">Hizli CV & Basvuru</div>'
    +'<div style="font-size:11px;color:#6b9478;margin-bottom:12px">Profilini bir kez doldur, tum ilanlara aninda basvur.</div>'
    +'<div style="margin-bottom:10px"><div style="display:flex;justify-content:space-between;font-size:11px;margin-bottom:4px"><span>Profil</span><span style="color:var(--green)">%'+pct+'</span></div>'
    +'<div style="height:8px;background:rgba(52,201,122,.12);border-radius:8px;overflow:hidden">'
    +'<div style="height:100%;width:'+pct+'%;background:var(--green);border-radius:8px"></div></div></div>'
    +(cvL?'<div style="font-size:10px;color:var(--green);margin-bottom:10px">Profil yuklu!</div>'
         :'<div style="font-size:10px;color:var(--orange);margin-bottom:10px">Profil eksik - doldurun.</div>')
    +'<button onclick="openCVModal()" style="width:100%;background:var(--green);color:#000;border:none;border-radius:12px;padding:12px;font-size:13px;font-weight:800;cursor:pointer;font-family:inherit;margin-bottom:8px">CV Yukle / Guncelle</button>'
    +'<button onclick="quickApplyAll()" style="width:100%;background:rgba(52,201,122,.12);color:var(--green);border:1.5px solid rgba(52,201,122,.3);border-radius:12px;padding:12px;font-size:13px;font-weight:800;cursor:pointer;font-family:inherit">Tum Ilanlara Hizli Basvur</button>'
    +'</div>';
  h+='<div class="panel"><div class="panel-tit">Staj & Gelisim</div>'
    +'<div class="staj-btns">'
    +'<button class="staj-btn-isv" onclick="waGo()">Stajyer Ariyorum</button>'
    +'<button class="staj-btn-staj" onclick="waGo()">Staj Yeri Ariyorum</button>'
    +'</div>';
  ['Klinik','Gida','Ciftlik','Kanatli','Lab'].forEach(function(cat){
    h+='<div class="staj-cat">'+cat+' Staji</div>';
    var c=stajData.filter(function(d){return norm(d.brans||'').indexOf(norm(cat))>-1;});
    if(!c.length){h+='<div class="staj-empty">Ilan yok.</div>';}
    else c.forEach(function(d){
      h+='<div class="iitem"><div class="iiico">-</div>'
        +'<div class="iii"><div class="iin">'+(d.baslik||'Staj')+'</div>'
        +'<div class="iis">'+(d.sirket||'')+' ~ '+(d.sehir||'---')+'</div></div>'
        +'<button class="iibtn" onclick="waGo()">Basvur</button></div>';
    });
  });
  h+='</div>';
  el.innerHTML=h;
}
function renderGruplar(){
  var el=document.getElementById('pg-gruplar');if(!el)return;
  var grpHtml=WA_GROUPS.map(function(g){
    return '<div class="wa-gc" data-link="'+g.link+'">'
      +'<div class="wa-gc-ico">WA</div>'
      +'<div class="wa-gc-inf"><div class="wa-gc-n">'+g.name+'</div>'
      +'<div class="wa-gc-s">'+(g.brans||'')+' - '+(g.sehir||'')+'</div></div>'
      +'<button class="wa-gc-btn" data-grp-link="'+g.link+'">Katilim Iste</button>'
      +'</div>';
  }).join('');
  var addForm='<div class="grup-form">'
    +'<div class="gf-tit">Grup Ekle</div>'
    +'<div class="gf-sec">GRUP ADI</div>'
    +'<input id="waf-ad" type="text" placeholder="Grup adi" class="name-f">'
    +'<div class="gf-sec">WHATSAPP LINKI</div>'
    +'<input id="waf-link" type="url" placeholder="https://chat.whatsapp.com/..." class="name-f">'
    +'<button onclick="submitWaGrup()" class="gf-send">Grubu Ekle</button>'
    +'</div>';
  el.innerHTML='<div class="wa-info"><div class="wa-info-ico">!</div>'
    +'<div class="wa-info-txt"><b>'+WA_GROUPS.length+' aktif grup</b> - Katilmak icin tiklayin.</div></div>'
    +grpHtml+addForm;
}
function renderGunlukIlanlar(){
  var el=document.getElementById('pg-gunluk');if(!el)return;
  var now=Date.now();
  var filters={bugun:86400000,son3gun:3*86400000,hafta:7*86400000};
  var gunlukFilter=el.dataset.filter||'bugun';
  var isv=all.filter(function(r){return r.tip&&r.tip.indexOf('SVEREN')>-1;});
  function diffMs(d){
    if(!d.z)return Infinity;
    var m=d.z.match(/(\d{2})\.(\d{2})\.(\d{4})/);
    if(!m)return Infinity;
    return now-new Date(+m[3],+m[2]-1,+m[1]).getTime();
  }
  var son24=isv.filter(function(d){return diffMs(d)<=86400000;}).length;
  var filtered=isv.filter(function(d){
    var diff=diffMs(d);
    var isAcil=norm(d.faaliyet+' '+d.calisma).indexOf('acil')>-1||norm(d.faaliyet+' '+d.calisma).indexOf('gece')>-1;
    if(gunlukFilter==='acil')return isAcil;
    return diff<=(filters[gunlukFilter]||filters.bugun);
  }).sort(function(a,b){return diffMs(a)-diffMs(b);});
  var chips=['bugun','son3gun','hafta','acil'].map(function(k){
    var lbl=k==='bugun'?'Bugun':k==='son3gun'?'Son 3 Gun':k==='hafta'?'Bu Hafta':'Sadece Acil';
    var on=gunlukFilter===k;
    return '<button data-gunluk-f="'+k+'" style="flex-shrink:0;padding:7px 13px;border-radius:20px;background:'+(on?'var(--green)':'var(--card)')+';border:1.5px solid '+(on?'var(--green)':'var(--border)')+';color:'+(on?'#000':'var(--muted)')+';font-size:11px;font-weight:700;cursor:pointer;font-family:inherit">'+lbl+'</button>';
  }).join('');
  var h='<div style="margin-bottom:10px">'
    +'<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">'
    +'<div style="font-family:Syne,sans-serif;font-size:13px;font-weight:800">Gunluk Ilanlar</div>'
    +'<div style="font-size:10px;font-weight:700;background:rgba(52,201,122,.15);color:var(--green);padding:3px 9px;border-radius:7px">Son 24s: '+son24+'</div>'
    +'</div>'
    +'<div style="display:flex;gap:6px;overflow-x:auto;scrollbar-width:none;padding-bottom:4px">'+chips+'</div>'
    +'</div>';
  var cnt24El=document.getElementById('cnt-24');
  if(cnt24El)cnt24El.textContent=son24;
  if(!filtered.length){
    h+='<div style="text-align:center;padding:32px 16px;color:var(--muted)"><div style="font-size:32px;margin-bottom:8px">-</div><div>Bu aralikta ilan yok.</div></div>';
  } else {
    filtered.forEach(function(d){
      var gi=all.indexOf(d),diff=diffMs(d);
      var isAcil=norm(d.faaliyet+' '+d.calisma).indexOf('acil')>-1||norm(d.faaliyet+' '+d.calisma).indexOf('gece')>-1;
      var age=diff<3600000?'Az once':diff<86400000?Math.floor(diff/3600000)+' saat once':Math.floor(diff/86400000)+' gun once';
      var sek=getSek(d.faaliyet,d.uzmanlik,d.sektor);
      var bCol=isAcil?'#c0392b':'var(--green)';
      h+='<div class="jc" data-gi="'+gi+'" style="border-left:3px solid '+bCol+'">'
        +'<div style="display:flex;gap:5px;margin-bottom:7px">'
        +(isAcil?'<span style="background:rgba(192,57,43,.18);color:#e74c3c;font-size:9px;font-weight:800;padding:2px 7px;border-radius:5px">ACIL</span>':'')
        +'<span style="background:'+sek.renk+'22;color:'+sek.renk+';font-size:9px;font-weight:800;padding:2px 7px;border-radius:5px">'+sek.label+'</span>'
        +'</div>'
        +'<div style="font-size:13px;font-weight:800;margin-bottom:3px">'+(d.klinik||'Klinik')+'</div>'
        +'<div style="font-size:11px;color:var(--muted);margin-bottom:8px">'+(d.pozisyon||d.faaliyet||'---')+'</div>'
        +'<div style="display:flex;justify-content:space-between;align-items:center">'
        +'<div style="display:flex;gap:10px"><span style="font-size:10px;color:var(--muted)">~ '+(d.sehir||'---')+'</span>'
        +'<span style="font-size:10px;color:var(--muted)">'+age+'</span></div>'
        +'<button class="bdet" data-det="'+gi+'" data-tp="isv">Detay</button>'
        +'</div></div>';
    });
  }
  el.innerHTML=h;
}
function renderHosgeldin(){
  var onEl=document.getElementById('onerilenArea');if(!onEl)return;
  var prof=loadCVProfile();
  if(!prof||!all.length){onEl.innerHTML='';return;}
  var isv=all.filter(function(r){return r.tip&&r.tip.indexOf('SVEREN')>-1;});
  var scored=isv.map(function(d){return {d:d,s:calcScore(d)};})
    .filter(function(x){return x.s>0;})
    .sort(function(a,b){return b.s-a.s;}).slice(0,3);
  if(!scored.length){onEl.innerHTML='';return;}
  var html='<div style="font-size:11px;font-weight:800;color:var(--muted);text-transform:uppercase;padding:8px 18px 4px">Sana Ozel Oneriler</div>';
  scored.forEach(function(x){
    var d=x.d,gi=all.indexOf(d),sek=getSek(d.faaliyet,d.uzmanlik,d.sektor);
    html+='<div style="margin:0 14px 8px;background:var(--card);border:1px solid var(--border);border-radius:14px;padding:12px;cursor:pointer;border-left:3px solid '+sek.renk+'" data-goto-isv="'+gi+'">'
      +'<div style="display:flex;justify-content:space-between;margin-bottom:6px">'
      +'<div><div style="font-size:12px;font-weight:700">'+(d.klinik||'Klinik')+'</div>'
      +'<div style="font-size:10px;color:var(--muted)">'+(d.pozisyon||d.faaliyet||'---')+' - '+(d.sehir||'---')+'</div></div>'
      +'<div style="background:var(--green);color:#000;font-size:10px;font-weight:800;padding:3px 8px;border-radius:7px">%'+x.s+'</div>'
      +'</div><div style="font-size:11px;color:var(--muted)">'+(d.maas||'Maas gorusulur')+'</div></div>';
  });
  onEl.innerHTML=html;
}
function renderAll(){
  try{renderIlanlar();}catch(e){console.warn('renderIlanlar:',e.message);}
  try{renderHekimler();}catch(e){console.warn('renderHekimler:',e.message);}
  try{renderNobet();}catch(e){console.warn('renderNobet:',e.message);}
  try{renderSaved();}catch(e){console.warn('renderSaved:',e.message);}
  try{renderAraclar();}catch(e){console.warn('renderAraclar:',e.message);}
  try{renderGruplar();}catch(e){console.warn('renderGruplar:',e.message);}
  try{renderGunlukIlanlar();}catch(e){console.warn('renderGunluk:',e.message);}
  try{renderHosgeldin();}catch(e){console.warn('renderHosgeldin:',e.message);}
}
function upCounts(){
  var iv=all.filter(function(r){return r.tip&&r.tip.indexOf('SVEREN')>-1;}).length;
  var hk=all.filter(function(r){return r.tip&&r.tip.indexOf('ARIY')>-1;}).length;
  sT('cnt-isv',iv);sT('si-b',iv+' aktif');
  sT('cnt-hk',hk);sT('sh-b',hk+' hekim');
  sT('cnt-nb',nobetData.length);
  var b=document.getElementById('savBadge');
  if(b)b.style.display=saved.length>0?'block':'none';
}


function tSave(id){
  var ix=saved.indexOf(id);
  if(ix>-1){saved.splice(ix,1);toast('Kayittan cikarildi.');}
  else{saved.push(id);toast('Kaydedildi!');}
  localStorage.setItem('vt_s',JSON.stringify(saved));
  upCounts();renderSaved();renderIlanlar();renderHekimler();
}
function detIsv(idx){
  var d=all[idx];if(!d)return;
  var rows=[['Klinik',d.klinik],['Yetkili',d.yetkili],['Sehir',d.sehir],
    ['Faaliyet',d.faaliyet],['Pozisyon',d.pozisyon],['Deneyim',d.deneyim],
    ['Calisma',d.calisma],['Maas',d.maas],['Uzmanlik',d.uzmanlik]]
    .filter(function(r){return r[1];})
    .map(function(r){return '<div class="dr"><span class="dl">'+r[0]+'</span><span class="dv">'+r[1]+'</span></div>';})
    .join('');
  document.getElementById('dsh').innerHTML='<div class="shand"></div>'
    +'<div class="dcl" id="dov-kapat">X</div>'
    +'<div class="dn">'+(d.klinik||'Klinik')+'</div>'
    +'<div class="dp">'+(d.pozisyon||d.faaliyet||'')+'</div>'+rows
    +'<div style="display:flex;gap:8px;margin-top:12px">'
    +'<button class="dwa" style="flex:1" data-wa="1">Yoneticiye Yaz</button>'
    +'</div>';
  document.getElementById('dov').classList.add('on');
  document.getElementById('dov-kapat').onclick=function(){document.getElementById('dov').classList.remove('on');};
}
function detHk(idx){
  var d=all[idx];if(!d)return;
  var rows=[['Ad',maskName(d.isim)],['Cinsiyet',d.cinsiyet],['Meslek',d.meslek],
    ['Sehir',d.hkSehir],['Deneyim',d.hkDeneyim],['Maas Bek.',d.hkMaas],['Uzmanlik',d.hkUzmanlik]]
    .filter(function(r){return r[1];})
    .map(function(r){return '<div class="dr"><span class="dl">'+r[0]+'</span><span class="dv">'+r[1]+'</span></div>';})
    .join('');
  document.getElementById('dsh').innerHTML='<div class="shand"></div>'
    +'<div class="dcl" id="dov-kapat">X</div>'
    +'<div class="dn">'+maskName(d.isim)+'</div>'
    +'<div class="dp">'+(d.meslek||'Veteriner Hekim')+'</div>'+rows
    +'<div style="display:flex;gap:8px;margin-top:12px">'
    +'<button class="dwa" style="flex:1" data-wa="1">Yoneticiye Yaz</button>'
    +'</div>';
  document.getElementById('dov').classList.add('on');
  document.getElementById('dov-kapat').onclick=function(){document.getElementById('dov').classList.remove('on');};
}


function openForm(tp){
  kvkk=false;zkSt={b:[],d:'',c:'',i:[]};zkSektor='';
  if(tp==='nobet'){openNobetForm();return;}
  var iH=tp==='hekim';
  var sehirOpts=['Istanbul','Ankara','Izmir','Sakarya','Bursa','Antalya','Adana','Konya','Diger']
    .map(function(s){return '<option>'+s+'</option>';}).join('');
  var bransBtns=BRANS_LIST.map(function(b){return '<div class="zk" data-zk="b">'+b+'</div>';}).join('');
  var deneyimBtns=DENEYIM.map(function(d){return '<div class="zk" data-zk-single="d">'+d+'</div>';}).join('');
  var calismaBtns=CALISMA.map(function(c){return '<div class="zk" data-zk-single="c">'+c+'</div>';}).join('');
  var imkanBtns=IMKAN.map(function(im){return '<div class="zk" data-zk="i">'+im+'</div>';}).join('');
  var h='<div class="shand"></div>'
    +'<div class="stit">'+(iH?'CV Karti Ekle':'Isveren Ilani')+'</div>'
    +'<div class="ssub">VeTalent / IVHP — Butonlara tiklayin!</div>'
    +(!iH?'<div class="fsec">Isletme Adi</div><input class="name-f" id="f-k" type="text" placeholder="Klinik / Firma">':'')
    +'<div class="fsec">'+(iH?'Ad Soyad':'Yetkili')+'</div><input class="name-f" id="f-a" type="text" placeholder="'+(iH?'Dr. Adiniz':'Yetkili kisi')+'">'
    +'<div class="fsec">WhatsApp</div><input class="name-f" id="f-t" type="tel" placeholder="05XX XXX XX XX" inputmode="numeric">'
    +'<div class="fsec">Sehir</div><select class="city-sel" id="f-s"><option value="">Sehir secin</option>'+sehirOpts+'</select>'
    +'<div class="fsec">Brans</div><div class="zkc">'+bransBtns+'</div>'
    +'<div class="fsec">Tecrube</div><div class="zkc">'+deneyimBtns+'</div>'
    +'<div class="fsec">Calisma</div><div class="zkc">'+calismaBtns+'</div>'
    +(!iH?'<div class="fsec">Imkanlar</div><div class="zkc">'+imkanBtns+'</div>':'')
    +'<div class="fsec">Maas '+(iH?'Beklentisi':'Teklifi')+'</div>'+maasDD()
    +'<div class="kvkk" id="kv"><div class="kbox" id="kb"></div>'
    +'<div class="ktxt">Kisisel verilerimin VeTalent / IVHP tarafindan islenmesine izin veriyorum.</div></div>'
    +'<button class="subm" id="sbm" disabled>Gonder</button>'
    +'<button class="canc" id="form-iptal-btn">Iptal</button>'
    +'<div class="sok" id="fok"><div class="soki">OK</div><h3>Gonderildi!</h3><p>Tesekkurler.</p></div>';
  document.getElementById('fsh').innerHTML=h;
  document.getElementById('fov').classList.add('on');
  document.getElementById('form-iptal-btn').onclick=closeForm;
}
function openNobetForm(){
  kvkk=false;
  var sehirOpts=['Istanbul','Ankara','Izmir','Sakarya','Bursa','Diger']
    .map(function(s){return '<option>'+s+'</option>';}).join('');
  var h='<div class="shand"></div>'
    +'<div class="stit">Nobet Takasi</div>'
    +'<div class="ssub">Admin onayindan sonra yayinlanir.</div>'
    +'<div class="fsec">Ad Soyad</div><input class="name-f" id="nb-ad" type="text" placeholder="Dr. Adiniz">'
    +'<div class="fsec">Telefon</div><input class="name-f" id="nb-tel" type="tel" placeholder="05XX XXX XX XX">'
    +'<div class="fsec">Sahip Oldugunuz Nobet</div><input class="name-f" id="nb-sahip" type="text" placeholder="Klinik / Tarih">'
    +'<div class="fsec">Takas Istediginiz Gun</div><input class="name-f" id="nb-takas" type="text" placeholder="Tarih veya esnek">'
    +'<div class="fsec">Sehir</div><select class="city-sel" id="nb-sehir"><option value="">Sehir secin</option>'+sehirOpts+'</select>'
    +'<div class="kvkk" id="kv"><div class="kbox" id="kb"></div><div class="ktxt">Izin veriyorum.</div></div>'
    +'<button class="subm" id="sbm" disabled>Ilan Ver</button>'
    +'<button class="canc" id="form-iptal-btn">Iptal</button>'
    +'<div class="sok" id="fok"><div class="soki">OK</div><h3>Alindi!</h3><p>Admin onaylayacak.</p></div>';
  document.getElementById('fsh').innerHTML=h;
  document.getElementById('fov').classList.add('on');
  document.getElementById('form-iptal-btn').onclick=closeForm;
}
function closeForm(){document.getElementById('fov').classList.remove('on');}
function tKv(){
  kvkk=!kvkk;
  var kv=document.getElementById('kv'),kb=document.getElementById('kb'),sb=document.getElementById('sbm');
  if(kv)kv.classList.toggle('on',kvkk);
  if(kb)kb.textContent=kvkk?'V':'';
  if(sb)sb.disabled=!kvkk;
}
async function subForm(tp){
  if(!kvkk){alert('KVKK onayi gerekli.');return;}
  var tel=gv('f-t').trim();if(!tel){alert('WhatsApp numarasi zorunlu!');return;}
  var ad=gv('f-a'),klinik=gv('f-k'),sehir=gv('f-s'),maas=gv('f-maas');
  fetch(SCRIPT_URL,{method:'POST',mode:'no-cors',headers:{'Content-Type':'application/json'},
    body:JSON.stringify({tip:tp,ad:ad,klinik:klinik,tel:tel,sehir:sehir,
      brans:zkSt.b.join(', '),deneyim:zkSt.d,calisma:zkSt.c,imkan:zkSt.i.join(', '),maas:maas})
  }).catch(function(){});
  var fok=document.getElementById('fok'),sbm=document.getElementById('sbm');
  if(fok)fok.style.display='block';if(sbm)sbm.style.display='none';
  toast('Gonderildi!');
  var msg=encodeURIComponent('[VeTalent] Yeni '+tp+' - '+ad+' - '+sehir+' Tel: '+tel);
  setTimeout(function(){waGo(msg);},1000);
  setTimeout(function(){closeForm();fetchAll();fetchNobet();},3200);
}
async function subNobetForm(){
  if(!kvkk){alert('Onay gerekli.');return;}
  var ad=gv('nb-ad'),tel=gv('nb-tel'),sahip=gv('nb-sahip'),takas=gv('nb-takas'),sehir=gv('nb-sehir');
  if(!ad||!tel){alert('Ad ve telefon zorunlu!');return;}
  fetch(SCRIPT_URL,{method:'POST',mode:'no-cors',headers:{'Content-Type':'application/json'},
    body:JSON.stringify({tip:'nobet',ad:ad,tel:tel,sahipNobet:sahip,takasGunu:takas,sehir:sehir})
  }).catch(function(){});
  var fok=document.getElementById('fok'),sbm=document.getElementById('sbm');
  if(fok)fok.style.display='block';if(sbm)sbm.style.display='none';
  toast('Nobet ilani alindi!');
  setTimeout(function(){closeForm();fetchNobet();},3000);
}
function submitWaGrup(){
  var ad=gv('waf-ad').trim(),link=gv('waf-link').trim();
  if(!ad||!link){toast('Ad ve link zorunlu!');return;}
  if(link.indexOf('chat.whatsapp.com')<0){toast('Gecerli WA linki gir!');return;}
  fetch(SCRIPT_URL,{method:'POST',mode:'no-cors',headers:{'Content-Type':'application/json'},
    body:JSON.stringify({tip:'wa_grup',grupAdi:ad,link:link})
  }).catch(function(){});
  WA_GROUPS.push({name:ad,link:link,brans:'Genel',sehir:'Turkiye'});
  toast('Grup eklendi!');setTimeout(renderGruplar,200);
}


function openCVModal(){
  var prof=loadCVProfile()||{};var pct=getCVPct();
  var sehirOpts=['Istanbul','Ankara','Izmir','Sakarya','Bursa','Antalya','Diger']
    .map(function(s){return '<option'+(prof.sehir===s?' selected':'')+'>'+s+'</option>';}).join('');
  var maasOpts=MAAS_OPTS.map(function(m){return '<option'+(prof.maas===m?' selected':'')+'>'+m+'</option>';}).join('');
  var ov=document.createElement('div');
  ov.id='cv-modal-ov';
  ov.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,.82);z-index:8888;display:flex;align-items:flex-end;justify-content:center';
  var d=document.createElement('div');
  d.style.cssText='background:#0f2318;border-radius:24px 24px 0 0;border:1px solid rgba(52,201,122,.3);width:100%;max-width:430px;max-height:88vh;overflow-y:auto;padding:20px 18px 44px';
  d.innerHTML='<div style="width:34px;height:4px;background:rgba(52,201,122,.2);border-radius:4px;margin:0 auto 14px"></div>'
    +'<div style="font-family:Syne,sans-serif;font-size:16px;font-weight:800;margin-bottom:4px">CV Profili</div>'
    +'<div style="height:6px;background:rgba(52,201,122,.15);border-radius:6px;overflow:hidden;margin-bottom:4px"><div style="height:100%;width:'+pct+'%;background:var(--green);border-radius:6px"></div></div>'
    +'<div style="font-size:10px;color:#6b9478;margin-bottom:14px">Tamamlanma: %'+pct+'</div>'
    +'<div style="margin-bottom:10px"><div style="font-size:10px;font-weight:800;color:#6b9478;text-transform:uppercase;margin-bottom:5px">Ad Soyad</div>'
    +'<input id="cv-ad" type="text" value="'+(prof.ad||'')+'" placeholder="Dr. Adiniz" style="width:100%;background:#152b1c;border:1.5px solid rgba(52,201,122,.2);border-radius:10px;padding:10px 12px;color:#e4f2ea;font-size:13px;font-family:inherit;outline:none"></div>'
    +'<div style="margin-bottom:10px"><div style="font-size:10px;font-weight:800;color:#6b9478;text-transform:uppercase;margin-bottom:5px">Telefon</div>'
    +'<input id="cv-tel" type="tel" value="'+(prof.tel||'')+'" placeholder="05XX XXX XX XX" style="width:100%;background:#152b1c;border:1.5px solid rgba(52,201,122,.2);border-radius:10px;padding:10px 12px;color:#e4f2ea;font-size:13px;font-family:inherit;outline:none"></div>'
    +'<div style="margin-bottom:10px"><div style="font-size:10px;font-weight:800;color:#6b9478;text-transform:uppercase;margin-bottom:5px">Sehir</div>'
    +'<select id="cv-sehir" style="width:100%;background:#152b1c;border:1.5px solid rgba(52,201,122,.2);border-radius:10px;padding:10px 12px;color:#e4f2ea;font-size:13px;font-family:inherit;outline:none"><option value="">Secin</option>'+sehirOpts+'</select></div>'
    +'<div style="margin-bottom:10px"><div style="font-size:10px;font-weight:800;color:#6b9478;text-transform:uppercase;margin-bottom:5px">Maas Beklentisi</div>'
    +'<select id="cv-maas" style="width:100%;background:#152b1c;border:1.5px solid rgba(52,201,122,.2);border-radius:10px;padding:10px 12px;color:#e4f2ea;font-size:13px;font-family:inherit;outline:none"><option value="">Secin</option>'+maasOpts+'</select></div>'
    +'<div style="margin-bottom:14px"><div style="font-size:10px;font-weight:800;color:#6b9478;text-transform:uppercase;margin-bottom:5px">Brans</div>'
    +'<input id="cv-brans" type="text" value="'+(prof.brans||'')+'" placeholder="Klinik, Gida, USG..." style="width:100%;background:#152b1c;border:1.5px solid rgba(52,201,122,.2);border-radius:10px;padding:10px 12px;color:#e4f2ea;font-size:13px;font-family:inherit;outline:none"></div>'
    +'<button id="cv-save-btn" style="width:100%;background:var(--green);color:#000;border:none;border-radius:12px;padding:13px;font-size:14px;font-weight:800;cursor:pointer;font-family:inherit;margin-bottom:8px">Kaydet</button>'
    +'<button id="cv-cancel-btn" style="width:100%;background:transparent;color:#6b9478;border:none;padding:9px;font-size:12px;cursor:pointer;font-family:inherit">Iptal</button>';
  ov.appendChild(d);document.body.appendChild(ov);
  document.getElementById('cv-save-btn').onclick=saveCVFromModal;
  document.getElementById('cv-cancel-btn').onclick=function(){ov.remove();};
  ov.addEventListener('click',function(e){if(e.target===ov)ov.remove();});
}
function saveCVFromModal(){
  var prof={
    ad:(document.getElementById('cv-ad')||{}).value||'',
    tel:(document.getElementById('cv-tel')||{}).value||'',
    sehir:(document.getElementById('cv-sehir')||{}).value||'',
    maas:(document.getElementById('cv-maas')||{}).value||'',
    brans:(document.getElementById('cv-brans')||{}).value||'',
  };
  if(!prof.ad){toast('Ad Soyad zorunlu!');return;}
  saveCVProfile(prof);
  var uid=localStorage.getItem('vt_uid')||('U_'+Date.now());
  localStorage.setItem('vt_uid',uid);
  fetch(SCRIPT_URL,{method:'POST',mode:'no-cors',headers:{'Content-Type':'application/json'},
    body:JSON.stringify({tip:'user_save',userId:uid,adSoyad:prof.ad,sehir:prof.sehir,maas:prof.maas})
  }).catch(function(){});
  var ov=document.getElementById('cv-modal-ov');if(ov)ov.remove();
  toast('CV profili kaydedildi!');
  if(curPg==='araclar')renderAraclar();
  renderHosgeldin();
}
function quickApplyToJob(gi){
  if(!isCVLoaded()){toast('Once CV profilini doldur!');openCVModal();return;}
  var d=all[gi];if(!d)return;
  var apps=JSON.parse(localStorage.getItem('vt_apps')||'[]');
  if(apps.some(function(a){return a.gi===gi;})){toast('Bu ilana zaten basvurdun!');return;}
  apps.push({gi:gi,klinik:d.klinik||'---',tarih:new Date().toLocaleDateString('tr-TR')});
  localStorage.setItem('vt_apps',JSON.stringify(apps));
  var prof=loadCVProfile();
  var msg=encodeURIComponent('[VeTalent Hizli Basvuru] '+(d.klinik||'---')+' | '+(prof.ad||'---')+' | '+(prof.tel||'---'));
  toast('Basvuru hazir! WA aciliyor...');
  setTimeout(function(){waGo(msg);},600);
}
function quickApplyAll(){
  if(!isCVLoaded()){toast('Once CV profilini doldur!');openCVModal();return;}
  var isv=all.filter(function(r){return r.tip&&r.tip.indexOf('SVEREN')>-1;});
  if(!isv.length){toast('Henuz ilan yok.');return;}
  quickApplyToJob(all.indexOf(isv[0]));
}


var PGCFG={
  ilanlar: {t:'Isveren Ilanlari',  c:['Tumu','Klinik','Gece','Gida','Ilac','Kanatli','Lab','Ciftlik']},
  hekimler:{t:'Hekim CV Kartlari', c:['Tumu','Klinik','Gida','Ilac','Kanatli','Lab','Ciftlik']},
  nobet:   {t:'Nobet Takasi',      c:['Tumu','Istanbul','Ankara','Sakarya']},
  saved:   {t:'Kayitli Ilanlar',   c:[]},
  araclar: {t:'Araclar & Staj',    c:[]},
  gruplar: {t:'WhatsApp Gruplari', c:[]},
  gunluk:  {t:'Gunluk Ilanlar',    c:[]},
  sektor:  {t:'Sektor',            c:[]},
};
function goPage(name){
  document.getElementById('splash').classList.add('gone');
  document.getElementById('app').classList.add('on');
  showPg(name);
  document.querySelectorAll('.nbtn').forEach(function(b){b.classList.remove('on');});
  var nb=document.getElementById('nb-'+name);if(nb)nb.classList.add('on');
}
function goSect(s){
  document.getElementById('splash').classList.add('gone');
  document.getElementById('app').classList.add('on');
  document.querySelectorAll('.pg').forEach(function(p){p.classList.remove('on');});
  document.getElementById('pg-sektor').classList.add('on');
  var labels={gida:'Gida',lab:'Lab',ilac:'Ilac',gece:'Gece',kanatli:'Kanatli',ciftlik:'Ciftlik',klinik:'Klinik'};
  sT('ptit',labels[s]||s);sT('pico','-');
  renderSector(s);curPg='sektor';
  document.getElementById('frow').innerHTML='';sT('rc','');
  document.querySelectorAll('.nbtn').forEach(function(b){b.classList.remove('on');});
}
function goBack(){
  document.getElementById('splash').classList.remove('gone');
  document.getElementById('app').classList.remove('on');
}
function showPg(name){
  document.querySelectorAll('.pg').forEach(function(p){p.classList.remove('on');});
  var pg=document.getElementById('pg-'+name);if(pg)pg.classList.add('on');
  var cnt=document.getElementById('cnt');if(cnt)cnt.scrollTop=0;
  var sin=document.getElementById('sin');if(sin)sin.value='';
  curPg=name;
  var cfg=PGCFG[name];if(!cfg)return;
  sT('ptit',cfg.t);sT('pico','-');
  var row=document.getElementById('frow');
  if(row){
    row.innerHTML='';
    cfg.c.forEach(function(ch,i){
      var b=document.createElement('button');
      b.className='chip'+(i===0?' on':'');
      b.textContent=ch;
      b.setAttribute('data-fval',i===0?'':norm(ch));
      row.appendChild(b);
    });
  }
  if(name==='saved')renderSaved();
  if(name==='araclar')renderAraclar();
  if(name==='gruplar')renderGruplar();
  if(name==='gunluk')renderGunlukIlanlar();
}
function swPg(name,btn){
  showPg(name);
  document.querySelectorAll('.nbtn').forEach(function(b){b.classList.remove('on');});
  btn.classList.add('on');
}
function doSrch(){
  var q=norm(document.getElementById('sin').value||'');
  var scl=document.getElementById('scl');if(scl)scl.style.display=q?'block':'none';
  document.querySelectorAll('#pg-'+curPg+' .jc,#pg-'+curPg+' .nbc').forEach(function(c){
    c.style.display=(!q||norm(c.dataset.s||c.innerText).indexOf(q)>-1)?'':'none';
  });
}
function clrSrch(){
  var sin=document.getElementById('sin');if(sin)sin.value='';
  var scl=document.getElementById('scl');if(scl)scl.style.display='none';
  document.querySelectorAll('.jc,.nbc').forEach(function(c){c.style.display='';});
}
function toggleSort(){
  sortAsc=!sortAsc;sT('sl',sortAsc?'Eskiye':'Yeniye');
  if(curPg==='ilanlar')renderIlanlar();
  else if(curPg==='hekimler')renderHekimler();
}
function onSplashSearch(q){
  var nq=norm(q),af=document.getElementById('activeFilters');if(!af)return;
  if(!nq){af.innerHTML='';return;}
  var res=all.filter(function(d){
    return norm((d.klinik||'')+' '+(d.sehir||'')+' '+(d.faaliyet||'')).indexOf(nq)>-1;
  });
  if(res.length>0){
    af.innerHTML='<div style="display:flex;align-items:center;gap:8px;padding:0 18px">'
      +'<div style="font-size:11px;color:var(--green);font-weight:700">'+res.length+' ilan eslesti</div>'
      +'<div id="splash-goster" style="font-size:11px;background:var(--card);border:1px solid var(--border);border-radius:20px;padding:4px 12px;cursor:pointer;color:var(--muted)">Goster</div>'
      +'</div>';
    document.getElementById('splash-goster').onclick=function(){goPage('ilanlar');};
  } else {
    af.innerHTML='<div style="font-size:11px;color:var(--red);padding:0 18px 4px">Eslesen ilan yok</div>';
  }
}


function openAdmin(){
  document.getElementById('adminPanel').classList.add('on');
  if(adminOk)showAdminContent();
  else{
    document.getElementById('adminLock').style.display='flex';
    document.getElementById('adminContent').style.display='none';
  }
}
function closeAdmin(){document.getElementById('adminPanel').classList.remove('on');}
function checkAdminPass(){
  if(document.getElementById('adminPass').value===_p){
    adminOk=true;
    document.getElementById('adminErr').style.display='none';
    showAdminContent();
  }else{
    document.getElementById('adminErr').style.display='block';
    document.getElementById('adminPass').value='';
  }
}
function adminRefresh(){showAdminContent();}
function showAdminContent(){
  document.getElementById('adminLock').style.display='none';
  document.getElementById('adminContent').style.display='block';
  var iv=all.filter(function(r){return r.tip&&r.tip.indexOf('SVEREN')>-1;});
  var hk=all.filter(function(r){return r.tip&&r.tip.indexOf('ARIY')>-1;});
  document.getElementById('adminStats').innerHTML=
    '<div class="admin-stat"><div class="admin-stat-v">'+iv.length+'</div><div class="admin-stat-l">Isveren</div></div>'
    +'<div class="admin-stat"><div class="admin-stat-v">'+hk.length+'</div><div class="admin-stat-l">Hekim</div></div>'
    +'<div class="admin-stat"><div class="admin-stat-v">'+nobetData.length+'</div><div class="admin-stat-l">Nobet</div></div>';
  var rows=iv.map(function(d){return {tp:'isv',nm:d.klinik||'---',seh:d.sehir||'---',z:d.z||'---'};})
    .concat(hk.map(function(d){return {tp:'hk',nm:maskName(d.isim),seh:d.hkSehir||'---',z:d.z||'---'};}));
  document.getElementById('adminBody').innerHTML=!rows.length
    ?'<tr><td colspan="4" style="text-align:center;color:var(--muted);padding:20px">Kayit yok</td></tr>'
    :rows.map(function(d){return '<tr><td>'+d.z+'</td><td><span class="admin-tag '+d.tp+'">'+d.tp+'</span></td><td>'+d.nm+'</td><td>'+d.seh+'</td></tr>';}).join('');
}


function fallback(){
  all=[
    {tip:'ISVERENM',klinik:'GENCVET Serdivan',sehir:'Sakarya',faaliyet:'KLINIK',deneyim:'1-2 YIL',pozisyon:'KLINIK VET HEK',calisma:'TAM ZAMANLI',maas:'75.000 TL - 90.000 TL',uzmanlik:'DAHILIYE',sektor:'Klinik',z:'26.03.2026',durum:'onaylandi'},
    {tip:'ISVERENM',klinik:'Gece Acil Vet',sehir:'ISTANBUL',faaliyet:'GECE',deneyim:'3+ YIL',pozisyon:'GECE VET HEK',calisma:'GECE NOBET',maas:'110.000 TL ve Uzeri',uzmanlik:'ACIL',sektor:'Klinik',z:'01.04.2026',durum:'onaylandi'},
    {tip:'IS ARIYORUM',isim:'Demo Hekim',hkSehir:'Sakarya',hkDeneyim:'3 YIL',hkCalisma:'TAM ZAMANLI',hkMaas:'Oda Maasi',hkUzmanlik:'DAHILIYE',sektor:'Klinik',z:'01.04.2026',durum:'onaylandi'},
  ];
  hesaplaEslesme();renderAll();upCounts();
}
function openAcilModal(){
  var ov=document.createElement('div');
  ov.id='acil-ov';
  ov.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,.82);z-index:9999;display:flex;align-items:flex-end;justify-content:center';
  var d=document.createElement('div');
  d.style.cssText='background:#0f2318;border-radius:24px 24px 0 0;border:1px solid rgba(192,57,43,.4);width:100%;max-width:430px;padding:20px 18px 44px';
  d.innerHTML='<div style="width:34px;height:4px;background:rgba(192,57,43,.3);border-radius:4px;margin:0 auto 14px"></div>'
    +'<div style="font-family:Syne,sans-serif;font-size:16px;font-weight:800;margin-bottom:4px;color:#e74c3c">Acil / Gece Nobeti</div>'
    +'<div style="display:flex;flex-direction:column;gap:9px;margin-top:14px">'
    +'<button id="acil-isv" style="background:linear-gradient(135deg,#c0392b,#e74c3c);color:#fff;border:none;border-radius:13px;padding:14px;font-size:13px;font-weight:800;cursor:pointer;font-family:inherit">Acil Hekim Ariyorum</button>'
    +'<button id="acil-hk" style="background:rgba(192,57,43,.18);color:#e74c3c;border:1.5px solid rgba(192,57,43,.4);border-radius:13px;padding:14px;font-size:13px;font-weight:800;cursor:pointer;font-family:inherit">Acil Nobet Tutabilirim</button>'
    +'<button id="acil-gor" style="background:rgba(52,201,122,.1);color:var(--green);border:1.5px solid rgba(52,201,122,.25);border-radius:13px;padding:14px;font-size:13px;font-weight:800;cursor:pointer;font-family:inherit">Acil Ilanlari Gor</button>'
    +'<button id="acil-kapat" style="width:100%;background:transparent;color:#6b9478;border:none;padding:12px 0 0;font-size:12px;cursor:pointer;font-family:inherit">Iptal</button>'
    +'</div>';
  ov.appendChild(d);document.body.appendChild(ov);
  d.addEventListener('click',function(e){
    var b=e.target.closest('button');if(!b)return;
    if(b.id==='acil-isv'){ov.remove();openForm('isveren');}
    if(b.id==='acil-hk'){ov.remove();openForm('hekim');}
    if(b.id==='acil-gor'){ov.remove();goPage('ilanlar');}
    if(b.id==='acil-kapat'){ov.remove();}
  });
  ov.addEventListener('click',function(e){if(e.target===ov)ov.remove();});
}
var SEHIR_COORDS={
  istanbul:{lat:41.0082,lng:28.9784},ankara:{lat:39.9334,lng:32.8597},
  izmir:{lat:38.4237,lng:27.1428},sakarya:{lat:40.6940,lng:30.4358},
  bursa:{lat:40.1885,lng:29.0610},antalya:{lat:36.8969,lng:30.7133},
  adana:{lat:37.0000,lng:35.3213},konya:{lat:37.8714,lng:32.4846},
};
function istekKonum(){
  if(navigator.geolocation){
    toast('Konum aliniyor...');
    navigator.geolocation.getCurrentPosition(
      function(pos){gosterYakinIlanlar(pos.coords.latitude,pos.coords.longitude);},
      function(){openSehirSecModal();},{timeout:5000}
    );
  }else{openSehirSecModal();}
}
function openSehirSecModal(){
  var ov=document.createElement('div');
  ov.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,.82);z-index:9200;display:flex;align-items:flex-end;justify-content:center';
  var btns=Object.keys(SEHIR_COORDS).map(function(k){
    var nm=k.charAt(0).toUpperCase()+k.slice(1);
    return '<button data-sk="'+k+'" style="background:var(--card);color:var(--txt);border:1.5px solid var(--border);border-radius:10px;padding:10px 14px;font-size:12px;font-weight:700;cursor:pointer;font-family:inherit">'+nm+'</button>';
  }).join('');
  var d=document.createElement('div');
  d.style.cssText='background:#0f2318;border-radius:24px 24px 0 0;border:1px solid rgba(52,201,122,.3);width:100%;max-width:430px;padding:22px 18px 44px';
  d.innerHTML='<div style="width:34px;height:4px;background:rgba(52,201,122,.2);border-radius:4px;margin:0 auto 14px"></div>'
    +'<div style="font-family:Syne,sans-serif;font-size:15px;font-weight:800;margin-bottom:6px">Sehir Sec</div>'
    +'<div style="font-size:11px;color:#6b9478;margin-bottom:16px">Hangi sehirdeki ilanlari gormek istiyorsunuz?</div>'
    +'<div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:16px">'+btns+'</div>'
    +'<button id="sehir-kapat" style="width:100%;background:transparent;color:#6b9478;border:none;padding:9px;font-size:12px;cursor:pointer;font-family:inherit">Iptal</button>';
  ov.appendChild(d);document.body.appendChild(ov);
  d.addEventListener('click',function(e){
    var b=e.target.closest('button[data-sk]');
    if(b){var c=SEHIR_COORDS[b.dataset.sk];ov.remove();if(c)gosterYakinIlanlar(c.lat,c.lng);}
    if(e.target.id==='sehir-kapat')ov.remove();
  });
  ov.addEventListener('click',function(e){if(e.target===ov)ov.remove();});
}
function gosterYakinIlanlar(lat,lng){
  function km(la2,ln2){
    var R=6371,dL=(la2-lat)*Math.PI/180,dN=(ln2-lng)*Math.PI/180;
    var a=Math.sin(dL/2)*Math.sin(dL/2)+Math.cos(lat*Math.PI/180)*Math.cos(la2*Math.PI/180)*Math.sin(dN/2)*Math.sin(dN/2);
    return R*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));
  }
  var isv=all.filter(function(r){return r.tip&&r.tip.indexOf('SVEREN')>-1;});
  var yakin=[];
  isv.forEach(function(d){
    var sKey=Object.keys(SEHIR_COORDS).find(function(k){return norm(d.sehir||'').indexOf(k)>-1;});
    if(sKey){var c=SEHIR_COORDS[sKey],mesafe=Math.round(km(c.lat,c.lng));if(mesafe<=150)yakin.push({d:d,km:mesafe,gi:all.indexOf(d)});}
  });
  yakin.sort(function(a,b){return a.km-b.km;});
  if(!yakin.length){toast('Bu bolgede ilan bulunamadi.');return;}
  var ov=document.createElement('div');
  ov.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,.82);z-index:8800;display:flex;align-items:flex-end;justify-content:center';
  var ilanHtml=yakin.slice(0,6).map(function(x){
    return '<div class="yakin-item" data-ygi="'+x.gi+'" style="background:#152b1c;border:1px solid rgba(52,201,122,.2);border-radius:12px;padding:12px;margin-bottom:8px;cursor:pointer">'
      +'<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">'
      +'<div style="font-size:12px;font-weight:700">'+(x.d.klinik||'Klinik')+'</div>'
      +'<div style="font-size:10px;font-weight:700;background:rgba(52,201,122,.15);color:var(--green);padding:2px 7px;border-radius:6px">~'+x.km+' km</div>'
      +'</div>'
      +'<div style="font-size:11px;color:#6b9478">'+(x.d.pozisyon||x.d.faaliyet||'---')+' - '+(x.d.sehir||'---')+'</div>'
      +'</div>';
  }).join('');
  var d=document.createElement('div');
  d.style.cssText='background:#0f2318;border-radius:24px 24px 0 0;border:1px solid rgba(52,201,122,.35);width:100%;max-width:430px;max-height:80vh;overflow-y:auto;padding:20px 18px 44px';
  d.innerHTML='<div style="width:34px;height:4px;background:rgba(52,201,122,.25);border-radius:4px;margin:0 auto 14px"></div>'
    +'<div style="font-family:Syne,sans-serif;font-size:16px;font-weight:800;margin-bottom:4px">Yakinda '+yakin.length+' Ilan!</div>'
    +'<div style="font-size:11px;color:#6b9478;margin-bottom:16px">150 km icindeki ilanlar - tiklayin detay gorun.</div>'
    +ilanHtml
    +'<button id="yakin-tum" style="width:100%;background:var(--green);color:#000;border:none;border-radius:12px;padding:12px;font-size:13px;font-weight:800;cursor:pointer;font-family:inherit;margin-bottom:8px">Tum Ilanlari Gor</button>'
    +'<button id="yakin-kapat" style="width:100%;background:transparent;color:#6b9478;border:none;padding:9px;font-size:12px;cursor:pointer;font-family:inherit">Kapat</button>';
  ov.appendChild(d);document.body.appendChild(ov);
  d.addEventListener('click',function(e){
    var item=e.target.closest('.yakin-item');
    if(item){var gi=parseInt(item.dataset.ygi);ov.remove();goPage('ilanlar');setTimeout(function(){detIsv(gi);},300);return;}
    if(e.target.id==='yakin-tum'){ov.remove();goPage('ilanlar');return;}
    if(e.target.id==='yakin-kapat'){ov.remove();return;}
  });
  ov.addEventListener('click',function(e){if(e.target===ov)ov.remove();});
}


var kayitTimer=null,kayitSeconds=30,kayitIsOpen=false;
function openKayitModal(){
  document.getElementById('kayitOv').classList.add('on');
  kayitIsOpen=true;kayitSeconds=30;
  updateKayitTimer();updateKayitPct(0);
  clearInterval(kayitTimer);
  kayitTimer=setInterval(function(){
    kayitSeconds--;updateKayitTimer();
    var filled=getKayitFilled();
    updateKayitPct(Math.min(95,((30-kayitSeconds)/30)*40+(filled/5)*60));
    if(kayitSeconds<=0)clearInterval(kayitTimer);
  },1000);
}
function closeKayitModal(){
  document.getElementById('kayitOv').classList.remove('on');
  kayitIsOpen=false;clearInterval(kayitTimer);
  setTimeout(resetKayitForm,400);
}
function resetKayitForm(){
  ['ki-isim','ki-soyisim','ki-email','ki-tel'].forEach(function(id){
    var e=document.getElementById(id);if(e){e.value='';e.classList.remove('error');}
  });
  var s1=document.getElementById('ki-tecrube'),s2=document.getElementById('ki-sehir');
  if(s1)s1.selectedIndex=0;if(s2)s2.selectedIndex=0;
  var f=document.getElementById('kayitForm'),s=document.getElementById('kayitSuccess');
  if(f)f.style.display='';if(s)s.style.display='none';
  updateKayitPct(0);kayitSeconds=30;updateKayitTimer();
}
function updateKayitTimer(){
  var e=document.getElementById('kayitTimerNum');if(!e)return;
  var s=Math.max(0,kayitSeconds);e.textContent=s;
  e.style.color=s>15?'#34c97a':s>5?'#f5c842':'#ff4757';
}
function updateKayitPct(pct){
  var e=document.getElementById('kayitProgress');if(e)e.style.width=pct+'%';
}
function getKayitFilled(){
  return ['ki-isim','ki-soyisim','ki-email','ki-tecrube','ki-sehir'].filter(function(id){
    var e=document.getElementById(id);return e&&e.value.trim();
  }).length;
}
function onCVSelect(input){
  var n=document.getElementById('ki-cv-name');
  if(input.files&&input.files[0]&&n)n.textContent='Secildi: '+input.files[0].name;
}
function submitKayit(){
  var errors=[];
  [['ki-isim','Isim'],['ki-soyisim','Soyisim'],['ki-email','E-posta'],['ki-tecrube','Tecrube'],['ki-sehir','Sehir']].forEach(function(f){
    var e=document.getElementById(f[0]);
    if(!e||!e.value.trim()){errors.push(f[1]);if(e)e.classList.add('error');}
  });
  var em=document.getElementById('ki-email');
  if(em&&em.value&&em.value.indexOf('@')<0){errors.push('Gecerli e-posta');em.classList.add('error');}
  if(errors.length){toast('Lutfen doldurun: '+errors.join(', '));return;}
  var btn=document.getElementById('kayitSubmitBtn');
  if(btn){btn.disabled=true;btn.textContent='Kaydediliyor...';}
  var data={
    isim:(document.getElementById('ki-isim').value||'').trim(),
    soyisim:(document.getElementById('ki-soyisim').value||'').trim(),
    email:(document.getElementById('ki-email').value||'').trim(),
    tel:((document.getElementById('ki-tel')||{}).value||'').trim(),
    tecrube:(document.getElementById('ki-tecrube').value||''),
    sehir:(document.getElementById('ki-sehir').value||''),
  };
  console.log('[VeTalent] Yeni kayit:', data);
  saveCVProfile({ad:data.isim+' '+data.soyisim,email:data.email,tel:data.tel,deneyim:data.tecrube,sehir:data.sehir});
  clearInterval(kayitTimer);updateKayitPct(100);
  setTimeout(function(){
    if(btn){btn.disabled=false;btn.textContent='Kaydi Tamamla';}
    var f=document.getElementById('kayitForm'),s=document.getElementById('kayitSuccess');
    if(f)f.style.display='none';if(s)s.style.display='block';
    var ne=document.getElementById('kayit-success-name');
    if(ne)ne.textContent='Dr. '+data.isim+' '+data.soyisim+' - Hos geldiniz!';
    toast('Kayit basarili! Hos geldiniz Dr. '+data.isim+'!');
    setTimeout(function(){closeKayitModal();renderHosgeldin();},3500);
  },800);
}


document.addEventListener('DOMContentLoaded', function(){
  // ── SAAT ──
  startClock();
  upCounts();

  // ── CNT: Kart tiklama (mobil + desktop) ──
  var cnt=document.getElementById('cnt');
  if(cnt){
    cnt.addEventListener('click',function(e){
      // 1. Filtre chip
      var chip=e.target.closest('.chip');
      if(chip){
        var fval=chip.getAttribute('data-fval')||'';
        cnt.querySelectorAll('.chip').forEach(function(c){c.classList.remove('on');});
        chip.classList.add('on');
        document.querySelectorAll('#pg-'+curPg+' .jc,#pg-'+curPg+' .nbc').forEach(function(c){
          c.style.display=(!fval||norm(c.dataset.s||'').indexOf(fval)>-1)?'':'none';
        });
        return;
      }
      // 2. Gunluk filtre
      var gf=e.target.closest('[data-gunluk-f]');
      if(gf){
        var el=document.getElementById('pg-gunluk');
        if(el)el.dataset.filter=gf.dataset.gunlukF;
        renderGunlukIlanlar();return;
      }
      // 3. Detay butonu
      var det=e.target.closest('[data-det]');
      if(det){
        var gi=parseInt(det.dataset.det),tp=det.dataset.tp;
        if(tp==='hk')detHk(gi);else detIsv(gi);
        return;
      }
      // 4. WA butonu
      var wa=e.target.closest('[data-wa]');
      if(wa){waGo();return;}
      // 5. WA Nobet teklif
      var waNb=e.target.closest('[data-wa-nobet]');
      if(waNb){
        var msg=encodeURIComponent('[VeTalent] Nobet Teklifi: '+waNb.dataset.waNb);
        waGo(msg);return;
      }
      // 6. Save butonu
      var sv=e.target.closest('[data-svid]');
      if(sv){tSave(sv.dataset.svid);return;}
      // 7. Form acan banner
      var of=e.target.closest('[data-openform]');
      if(of){openForm(of.dataset.openform);return;}
      // 8. Staj basvur
      var stj=e.target.closest('.iibtn');
      if(stj){waGo();return;}
      // 9. WA grup katil
      var grp=e.target.closest('[data-grp-link]');
      if(grp){
        var link=grp.dataset.grpLink;
        showWaModal(function(){
          var msg=encodeURIComponent('Merhaba [VeTalent/IVHP], bu gruba katilmak istiyorum: '+link);
          window.open('https://wa.me/'+_w+'?text='+msg,'_blank');
        });
        return;
      }
      // 10. Onerilen ilan
      var got=e.target.closest('[data-goto-isv]');
      if(got){goPage('ilanlar');setTimeout(function(){detIsv(parseInt(got.dataset.gotoIsv));},300);return;}
      // 11. Kart genel tiklama (buton degilse)
      var card=e.target.closest('.jc');
      if(card&&!e.target.closest('button')&&!e.target.closest('[data-svid]')){
        var gi2=parseInt(card.dataset.gi);
        if(!isNaN(gi2)){
          if(curPg==='hekimler')detHk(gi2);else detIsv(gi2);
        }
      }
    });
    // Mobil dokunma geri bildirimi
    cnt.addEventListener('touchstart',function(e){
      var card=e.target.closest('.jc');
      if(card&&!e.target.closest('button')){card.style.opacity='0.85';setTimeout(function(){if(card)card.style.opacity='';},120);}
    },{passive:true});
  }

  // ── FROW: Chip tiklama ──
  var frow=document.getElementById('frow');
  if(frow){
    frow.addEventListener('click',function(e){
      var chip=e.target.closest('.chip');
      if(!chip)return;
      frow.querySelectorAll('.chip').forEach(function(c){c.classList.remove('on');});
      chip.classList.add('on');
      var fval=chip.getAttribute('data-fval')||'';
      document.querySelectorAll('#pg-'+curPg+' .jc,#pg-'+curPg+' .nbc').forEach(function(c){
        c.style.display=(!fval||norm(c.dataset.s||'').indexOf(fval)>-1)?'':'none';
      });
    });
  }

  // ── KVKK tiklama ──
  document.addEventListener('click',function(e){
    var kv=e.target.closest('.kvkk');
    if(kv)tKv();
  });

  // ── DOV kapat ──
  var dov=document.getElementById('dov');
  if(dov){dov.addEventListener('click',function(e){if(e.target===dov)dov.classList.remove('on');});}

  // ── KAYIT overlay ──
  var kayitOv=document.getElementById('kayitOv');
  if(kayitOv){kayitOv.addEventListener('click',function(e){if(e.target===kayitOv)closeKayitModal();});}

  // ── SPLASH: Mcard, sbtn tiklama (div onclick mobilde sorunlu olabilir) ──
  var splash = document.getElementById('splash');
  if(splash){
    splash.addEventListener('click', function(e){
      // mcard
      var mc = e.target.closest('.mcard');
      if(mc){
        var oc = mc.getAttribute('onclick');
        if(oc) eval(oc);
        return;
      }
      // sbtn
      var sb = e.target.closest('.sbtn');
      if(sb){
        var oc2 = sb.getAttribute('onclick');
        if(oc2) eval(oc2);
        return;
      }
      // foot-link
      var fl = e.target.closest('.foot-link');
      if(fl){
        var oc3 = fl.getAttribute('onclick');
        if(oc3) eval(oc3);
        return;
      }
      // buttons (kayit, konum, gunluk)
      var btn = e.target.closest('button[onclick]');
      if(btn){
        var oc4 = btn.getAttribute('onclick');
        if(oc4) eval(oc4);
        return;
      }
    });
  }

  // ── APP: nbtn tiklama ──
  var app = document.getElementById('app');
  if(app){
    app.addEventListener('click', function(e){
      // nbtn
      var nb = e.target.closest('.nbtn[onclick]');
      if(nb){
        var oc = nb.getAttribute('onclick');
        if(oc) eval(oc);
        return;
      }
      // sortb
      var so = e.target.closest('.sortb');
      if(so){ toggleSort(); return; }
      // bk (back)
      var bk = e.target.closest('.bk');
      if(bk){ goBack(); return; }
      // scl (clear search)
      var scl = e.target.closest('.scl');
      if(scl){ clrSrch(); return; }
      // admin buttons
      var admBtn = e.target.closest('button[onclick]');
      if(admBtn){
        var oc2 = admBtn.getAttribute('onclick');
        if(oc2) eval(oc2);
        return;
      }
    });
  }

  // ── ADMIN PANEL tiklama ──
  var adminP = document.getElementById('adminPanel');
  if(adminP){
    adminP.addEventListener('click', function(e){
      var btn = e.target.closest('button[onclick], [onclick]');
      if(btn){
        var oc = btn.getAttribute('onclick');
        if(oc) eval(oc);
      }
    });
  }

  // ── DATA FETCH ──
  fetchAll();
  fetchNobet();
  fetchStaj();
  fetchWaGroups();
});
