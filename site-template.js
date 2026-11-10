/* Web Wizard Studio 4.1 — three design styles and the website generator.
   Loads after script.js, enhancement.js and interface-i18n.js, and before studio-v4.js.
   Styles follow the Web Wizard PoliPD studio: Minimal, Bold and Friendly. */
(function(){'use strict';
const GUIDE='https://elearning-polipd.github.io/WebWizard-PoliPD/#terbit';

/* ---------- colour helpers ---------- */
const rgb=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16));
const toHex=a=>'#'+a.map(v=>Math.max(0,Math.min(255,Math.round(v))).toString(16).padStart(2,'0')).join('');
const ok=(h,d)=>/^#[0-9a-f]{6}$/i.test(h||'')?h:d;
const mix=(a,b,t)=>{const x=rgb(a),y=rgb(b);return toHex(x.map((v,i)=>v+(y[i]-v)*t))};
const lum=h=>{const[r,g,b]=rgb(h).map(v=>{v/=255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4)});return .2126*r+.7152*g+.0722*b};
const textOn=h=>{const L=lum(h);return 1.05/(L+.05)>=(L+.05)/(lum('#111111')+.05)?'#ffffff':'#111111'};

/* ---------- the three styles ---------- */
const DEF={
 min:{n:'Minimal profesional|Professional minimalist',primary:'#1447e6',secondary:'#0f172a',accent:'#e8effe',canvas:'#ffffff',surface:'#ffffff',text:'#0f172a',font:'Plus Jakarta Sans',body:'Plus Jakarta Sans',layout:'split',g:'Plus+Jakarta+Sans:wght@400;600;800'},
 bold:{n:'Tajuk besar dan kontras|Bold headings and contrast',primary:'#ffc400',secondary:'#0b0b0b',accent:'#7cc4ee',canvas:'#fbf5e6',surface:'#fffdf5',text:'#0b0b0b',font:'Anton',body:'Inter',layout:'centre',g:'Anton&family=Inter:wght@400;600;800'},
 fun:{n:'Mesra dan berwarna|Friendly and colourful',primary:'#f97316',secondary:'#14286b',accent:'#ccfbf1',canvas:'#fff7ed',surface:'#ffffff',text:'#14286b',font:'Rubik',body:'Rubik',layout:'centre',g:'Rubik:wght@400;600;800;900'}
};
for(const k of Object.keys(styles))delete styles[k];
for(const [k,v] of Object.entries(DEF)){Object.defineProperty(v,'name',{get(){return tr(this.n)},enumerable:true});styles[k]=v}
if(!(state.style in styles))state.style='min';
if(typeof state.siteName!=='string')state.siteName='';
if(typeof state.heroImg!=='string')state.heroImg='';

/* ---------- content helpers ---------- */
const typeName=()=>{const c=CATALOG[state.type];return tr(c.bm+'|'+c.en)};
const siteName=()=>(state.siteName||'').trim()||typeName();
function sectionList(){
 const api=window.WebWizardV4;
 if(api&&typeof api.sections==='function')return api.sections();
 const c=CATALOG[state.type];
 return c.sections.map((x,i)=>({k:i,title:tr(x),desc:tr(SECTION_COPY[state.type][i])}));
}
function splitTitle(t){
 const w=String(t).trim().split(/\s+/);
 if(w.length<2)return '<span class="t2">'+escapeHtml(t)+'</span>';
 const k=Math.ceil(w.length/2);
 return '<span class="t1">'+escapeHtml(w.slice(0,k).join(' '))+'</span> <span class="t2">'+escapeHtml(w.slice(k).join(' '))+'</span>';
}

/* ---------- stylesheet ---------- */
function buildCss(kind,s){
 const D=DEF[kind],P=ok(s.primary,D.primary),SEC=ok(s.secondary,D.secondary),ACC=ok(s.accent,D.accent),BG=ok(s.canvas,D.canvas);
 const dark=textOn(BG)==='#ffffff',ink=dark?'#ffffff':D.text;
 const card=dark?mix(BG,'#ffffff',.08):D.surface,line=dark?mix(BG,'#ffffff',.25):mix(BG,'#111827',.14),muted=mix(ink,BG,.3);
 const soft=dark?mix(BG,'#ffffff',.05):mix(BG,P,.05),deep=mix(P,'#000000',.3);
 const fh="'"+D.font+"', system-ui, sans-serif",fb="'"+D.body+"', system-ui, sans-serif";
 const radius={min:'10px',bold:'10px',fun:'18px'}[kind];
 const base=[
 '/* ===== Colours and fonts: change these to restyle the whole site ===== */',
 ':root{--p:'+P+';--on-p:'+textOn(P)+';--sec:'+SEC+';--on-sec:'+textOn(SEC)+';--acc:'+ACC+';--on-acc:'+textOn(ACC)+';--bg:'+BG+';--ink:'+ink+';--muted:'+muted+';--card:'+card+';--line:'+line+';--soft:'+soft+';--r:'+radius+';--fh:'+fh+';--fb:'+fb+'}',
 '',
 '/* ===== Base ===== */',
 '*{box-sizing:border-box}',
 'html{scroll-behavior:smooth}',
 'body{margin:0;background:var(--bg);color:var(--ink);font:400 1rem/1.65 var(--fb)}',
 'h1,h2,h3,.logo{font-family:var(--fh);line-height:1.1;margin:0 0 .5em}',
 'p{margin:0 0 1em}',
 'img{max-width:100%;display:block}',
 'a{color:inherit}',
 'section{scroll-margin-top:76px}',
 ':focus-visible{outline:3px solid var(--p);outline-offset:3px}',
 '.wrap{width:min(1100px,92%);margin-inline:auto}',
 '.skip{position:absolute;left:-999px}',
 '.skip:focus{left:12px;top:12px;z-index:9;background:#fff;color:#111;padding:8px 12px}',
 '',
 '/* ===== Navigation ===== */',
 '.nav{position:sticky;top:0;z-index:5;background:var(--bg);border-bottom:1px solid var(--line)}',
 '.nav-in{display:flex;align-items:center;gap:8px 20px;padding:14px 0}',
 '.logo{font-weight:800;font-size:1.2rem;text-decoration:none;margin:0 auto 0 0}',
 '.links{display:flex;flex-wrap:wrap;justify-content:flex-end;gap:6px 20px;font-size:.92rem;font-weight:600}',
 '.links a{text-decoration:none;white-space:nowrap}',
 '.links a:hover{text-decoration:underline}',
 '',
 '/* ===== Buttons ===== */',
 '.btn{display:inline-block;background:var(--p);color:var(--on-p);font-weight:700;text-decoration:none;padding:.8em 1.3em;border-radius:var(--r);border:2px solid transparent}',
 '.btn.small{padding:.5em 1em;font-size:.9rem;white-space:nowrap}',
 '.btn.ghost{background:transparent;color:inherit;border-color:currentColor}',
 '',
 '/* ===== Hero ===== */',
 '.hero{padding:clamp(48px,8vw,96px) 0}',
 '.hero-in{display:grid;grid-template-columns:1.1fr 1fr;gap:clamp(24px,5vw,56px);align-items:center}',
 '.kicker{display:inline-block;margin:0 0 14px;font-size:.8rem;font-weight:800;letter-spacing:.12em;text-transform:uppercase}',
 '.hero h1{font-size:clamp(2.3rem,5.5vw,4rem);font-weight:800;letter-spacing:-.02em}',
 '.lead{font-size:1.1rem;color:var(--muted);max-width:60ch}',
 '.actions{display:flex;flex-wrap:wrap;gap:12px;margin-top:24px}',
 '.hero-art{position:relative;aspect-ratio:4/3;border-radius:calc(var(--r)*2);overflow:hidden;background:var(--acc)}',
 '.hero-art img{width:100%;height:100%;object-fit:cover}',
 '.hero-art.empty i{position:absolute;aspect-ratio:1}',
 '.hero-art.empty i:nth-child(1){width:46%;left:12%;top:16%;border-radius:50%;background:var(--p)}',
 '.hero-art.empty i:nth-child(2){width:34%;right:10%;bottom:12%;border-radius:var(--r);background:var(--sec)}',
 '.hero-art.empty i:nth-child(3){width:18%;right:26%;top:14%;border-radius:50%;background:var(--bg)}',
 '',
 '/* ===== Sections ===== */',
 '.section{padding:clamp(44px,7vw,84px) 0;border-top:1px solid var(--line)}',
 '.section.alt{background:var(--soft)}',
 '.num{margin:0 0 10px;font-size:.85rem;font-weight:800;letter-spacing:.1em;color:var(--muted)}',
 '.section h2{font-size:clamp(1.7rem,3.6vw,2.6rem);font-weight:800;letter-spacing:-.01em}',
 '.cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:18px;margin-top:28px}',
 '.card{background:var(--card);border:1px solid var(--line);border-radius:var(--r);padding:22px}',
 '.card .ic{display:inline-grid;place-items:center;width:42px;height:42px;margin-bottom:12px;border-radius:var(--r);background:var(--acc);color:var(--on-acc);font-weight:800}',
 '.card h3{font-size:1.15rem}',
 '.card p{margin:0;color:var(--muted);font-size:.95rem}',
 '',
 '/* ===== Demo block (works in the browser only; nothing is sent anywhere) ===== */',
 '.demo-panel{padding-inline:max(4%,calc((100% - 1100px)/2))}',
 '.demo-panel label{display:block;font-weight:600;margin-bottom:12px}',
 '.demo-panel input:not([type=checkbox]),.demo-panel select{display:block;width:min(440px,100%);margin-top:6px;padding:12px;border:1px solid var(--line);border-radius:var(--r);background:var(--card);color:inherit;font:inherit}',
 '.demo-panel button{font:inherit;font-weight:700;cursor:pointer;background:var(--p);color:var(--on-p);border:0;border-radius:var(--r);padding:.7em 1.2em;margin:6px 6px 6px 0}',
 '.demo-panel .features{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:16px;margin:16px 0}',
 '.demo-panel .feature{background:var(--card);border:1px solid var(--line);border-radius:var(--r);padding:18px}',
 '.demo-panel .feature h3{font-size:1.15rem}',
 '.demo-panel .feature p{margin:0 0 8px}',
 '.demo-panel ul{padding-left:1.2em}',
 '',
 '/* ===== Closing and footer ===== */',
 '.closing{background:var(--sec);color:var(--on-sec);padding:clamp(48px,8vw,90px) 0;text-align:center}',
 '.closing h2{font-size:clamp(1.9rem,4.5vw,3.2rem);font-weight:800}',
 '.closing .btn{margin-top:10px}',
 '.foot{display:flex;flex-wrap:wrap;justify-content:space-between;gap:12px;padding:22px 0;font-size:.9rem}',
 '',
 '/* ===== Phones and small tablets ===== */',
 '@media(max-width:760px){',
 '  .hero-in{grid-template-columns:1fr}',
 '  .nav-in{flex-wrap:wrap}',
 '  .links{order:3;width:100%;flex-wrap:nowrap;justify-content:flex-start;overflow-x:auto;padding-bottom:4px}',
 '}'];
 const skin={
 min:[
 '/* ===== Style: Minimal ===== */',
 '.s-min .kicker{color:var(--p)}',
 '.s-min .hero-art{box-shadow:0 20px 50px #0f172a1f}',
 '.s-min .card:first-child{background:var(--acc);color:var(--on-acc);border-color:var(--p)}',
 '.s-min .card:first-child p{color:inherit;opacity:.8}',
 '.s-min .card:first-child .ic{background:var(--p);color:var(--on-p)}',
 '.s-min footer{border-top:1px solid var(--line)}'],
 bold:[
 '/* ===== Style: Bold ===== */',
 '.s-bold h1,.s-bold h2,.s-bold h3,.s-bold .logo{text-transform:uppercase;font-weight:400;letter-spacing:.01em}',
 '.s-bold .nav{background:#0b0b0b;color:#fff;border-bottom:0}',
 '.s-bold .logo{font-size:1.4rem}',
 '.s-bold .hero{text-align:center;padding-bottom:clamp(40px,6vw,72px)}',
 '.s-bold .hero-in{grid-template-columns:1fr;justify-items:center}',
 '.s-bold .hero h1{font-size:clamp(3rem,10vw,6.5rem);font-weight:400;line-height:.95;letter-spacing:0}',
 '.s-bold .t1{display:block}',
 '.s-bold .t2{display:inline-block;margin-top:.1em;padding:.04em .22em;background:var(--p);color:var(--on-p);transform:rotate(-2deg);box-shadow:.1em .1em 0 #0b0b0b}',
 '.s-bold .hero .lead{font-weight:600;color:var(--ink);margin-inline:auto}',
 '.s-bold .actions{justify-content:center}',
 '.s-bold .btn{border:3px solid #0b0b0b;box-shadow:5px 5px 0 #0b0b0b}',
 '.s-bold .btn.ghost{background:#fffdf5;color:#111}',
 '.s-bold .btn.small{box-shadow:none;border-color:var(--p)}',
 '.s-bold .hero-art{width:min(820px,100%);aspect-ratio:16/9;border:3px solid #0b0b0b;border-radius:var(--r);box-shadow:8px 8px 0 var(--p)}',
 '.s-bold .ticker{overflow:hidden;white-space:nowrap;background:var(--p);color:var(--on-p);border-block:3px solid #0b0b0b;font-family:var(--fh);font-size:1.2rem;text-transform:uppercase}',
 '.s-bold .ticker div{display:inline-block;padding:8px 0;animation:tick 40s linear infinite}',
 '.s-bold .ticker span{margin-right:28px}',
 '@keyframes tick{to{transform:translateX(-50%)}}',
 '@media(prefers-reduced-motion:reduce){.s-bold .ticker div{animation:none}}',
 '.s-bold .section{border-top:0}',
 '.s-bold .section h2{font-size:clamp(2.2rem,6vw,4rem);font-weight:400}',
 '.s-bold .section h2::after{content:"";display:block;width:110px;height:12px;margin-top:10px;background:var(--p)}',
 '.s-bold .section.alt{background:#0b0b0b;color:#fff}',
 '.s-bold .section.alt .lead{color:#ffffffcc}',
 '.s-bold .num{display:inline-block;padding:2px 10px;background:#0b0b0b;color:var(--p);font-family:var(--fh);font-size:1.1rem;font-weight:400}',
 '.s-bold .section.alt .num{background:var(--p);color:var(--on-p)}',
 '.s-bold .card{background:#fffdf5;color:#111;border:3px solid #0b0b0b;box-shadow:5px 5px 0 #0b0b0b}',
 '.s-bold .section.alt .card{box-shadow:5px 5px 0 var(--p)}',
 '.s-bold .card p{color:#333}',
 '.s-bold .card .ic{background:var(--p);color:var(--on-p);border:3px solid #0b0b0b;border-radius:8px}',
 '.s-bold .demo-panel button{border:3px solid #0b0b0b;box-shadow:4px 4px 0 #0b0b0b}',
 '.s-bold .closing{background:var(--p);color:var(--on-p)}',
 '.s-bold .closing h2{font-size:clamp(2.4rem,7vw,4.6rem);font-weight:400}',
 '.s-bold .closing .btn{background:#0b0b0b;color:#fff;border-color:#0b0b0b;box-shadow:5px 5px 0 #fff}',
 '.s-bold footer{background:#0b0b0b;color:#fff}'],
 fun:[
 '/* ===== Style: Friendly ===== */',
 '.s-fun .nav{border-bottom:0}',
 '.s-fun .links a{padding:4px 12px;border-radius:999px}',
 '.s-fun .links a:hover{background:'+mix(P,'#ffffff',.8)+';color:#14286b;text-decoration:none}',
 '.s-fun .hero{background:radial-gradient(circle at 6% 22%,'+mix(P,'#ffffff',.72)+' 0 15%,transparent 15.5%),radial-gradient(circle at 95% 10%,var(--acc) 0 19%,transparent 19.5%),radial-gradient(circle at 90% 98%,#e9d5ff 0 15%,transparent 15.5%)}',
 '.s-fun .hero-in{grid-template-columns:1fr;justify-items:center;text-align:center}',
 '.s-fun .kicker{background:#ffd60a;color:#14286b;padding:5px 12px;border-radius:999px}',
 '.s-fun .hero h1{font-size:clamp(2.5rem,7vw,4.6rem);font-weight:900;line-height:1.02}',
 '.s-fun .t2{color:'+(dark?'var(--p)':deep)+'}',
 '.s-fun .hero .lead{margin-inline:auto}',
 '.s-fun .actions{justify-content:center}',
 '.s-fun .btn{border-radius:999px;box-shadow:0 5px 0 '+deep+'}',
 '.s-fun .btn.ghost,.s-fun .btn.small{box-shadow:none}',
 '.s-fun .hero-art{width:min(760px,100%);aspect-ratio:16/9}',
 '.s-fun .section{border-top:0}',
 '.s-fun .section.alt{background:'+(dark?'var(--soft)':'#ffffffb3')+'}',
 '.s-fun .num{display:inline-block;padding:2px 12px;border-radius:999px;background:var(--acc);color:var(--on-acc)}',
 '.s-fun .card{border:0;color:#14286b}',
 '.s-fun .card p{color:#14286bcc}',
 '.s-fun .card:nth-child(3n+1){background:'+mix(P,'#ffffff',.78)+'}',
 '.s-fun .card:nth-child(3n+2){background:#bbf7d0}',
 '.s-fun .card:nth-child(3n){background:#e9d5ff}',
 '.s-fun .card .ic{background:#fff;color:#14286b;border-radius:50%}',
 '.s-fun .demo-panel button{border-radius:999px}',
 '.s-fun .closing{width:min(1100px,92%);margin:0 auto 40px;border-radius:calc(var(--r)*2)}']};
 return base.concat([''],skin[kind]).join('\n')+'\n';
}

/* ---------- script that ships with the exported site ---------- */
function buildJs(L){
 const q=s=>JSON.stringify(s);
 return [
 '/* Demo interactions only. Nothing here sends data to a server. */',
 '(function(){',
 "  var $=function(s){return document.querySelector(s)},all=function(s){return Array.prototype.slice.call(document.querySelectorAll(s))};",
 '  var score=0,cart=[],prices=[39,25,12],result=$("#demo-result");',
 '',
 '  /* quiz */',
 '  all("[data-answer]").forEach(function(b){b.onclick=function(){var right=b.dataset.answer==="1";if(right)score++;result.textContent=right?'+q(L?'Betul!':'Correct!')+':'+q(L?'Cuba lagi.':'Try again.')+';$("#demo-score").textContent='+q((L?'Skor':'Score')+': ')+'+score}});',
 '',
 '  /* demo cart */',
 '  all("[data-add]").forEach(function(b){b.onclick=function(){cart.push(prices[Number(b.dataset.add)]);result.textContent='+q((L?'Troli':'Cart')+': ')+'+cart.length+'+q(' '+(L?'item':'items')+' · RM ')+'+cart.reduce(function(a,c){return a+c},0).toFixed(2)}});',
 '',
 '  /* demo form */',
 '  var form=$("#demo-form");',
 '  if(form)form.onsubmit=function(e){e.preventDefault();result.textContent='+q(L?'Demo berjaya. Tiada data dihantar.':'Demo completed. No data was sent.')+'};',
 '',
 '  /* search filter */',
 '  var search=$("#demo-search");',
 '  if(search)search.oninput=function(){all("#demo-list li").forEach(function(li){li.hidden=li.textContent.toLowerCase().indexOf(search.value.toLowerCase())<0})};',
 '',
 '  /* task checklist */',
 '  all(".demo-task").forEach(function(x){x.onchange=function(){result.textContent=all(".demo-task:checked").length+" / 2"}});',
 '',
 '  /* sample dashboard */',
 '  var period=$("#demo-period"),csv=$("#demo-csv");',
 '  if(period)period.onchange=function(){$("#demo-metric").textContent=period.value==="1"?"78%":"84%"};',
 '  if(csv)csv.onclick=function(){var v=period.value==="1"?"78":"84",blob=new Blob(["period,achievement_percent\\n"+period.value+","+v+"\\n"],{type:"text/csv"}),u=URL.createObjectURL(blob),a=document.createElement("a");a.href=u;a.download="sample-kpi.csv";a.click();setTimeout(function(){URL.revokeObjectURL(u)},1000)};',
 '})();',''].join('\n');
}

/* ---------- page ---------- */
function parts(){
 const c=CATALOG[state.type],d=data(),s=current(),L=state.lang==='bm',kind=state.style in DEF?state.style:'min';
 const name=siteName(),secs=sectionList(),E=escapeHtml,hasImg=!!state.heroImg;
 const nav=secs.map((x,i)=>'<a href="#s'+(i+1)+'">'+E(x.title||(L?'Bahagian':'Section'))+'</a>').join('');
 const cards='\n      <div class="cards">'+c.items.map((item,j)=>'\n        <article class="card"><span class="ic">0'+(j+1)+'</span><h3>'+E(tr(item))+'</h3><p>'+(L?'Tulis penerangan ringkas di sini.':'Write a short description here.')+'</p></article>').join('')+'\n      </div>';
 const sections=secs.map((x,i)=>'  <section class="section'+(i%2===0?' alt':'')+'" id="s'+(i+1)+'">\n    <div class="wrap">\n      <p class="num">'+String(i+1).padStart(2,'0')+'</p>\n      <h2>'+E(x.title||(L?'Bahagian':'Section'))+'</h2>'+(x.desc?'\n      <p class="lead">'+E(x.desc)+'</p>':'')+(x.k===0?cards:'')+'\n    </div>\n  </section>').join('\n');
 const art=hasImg?'<div class="hero-art"><img src="%HERO%" alt="'+E(name)+'"></div>':(kind==='bold'?'':'<div class="hero-art empty" aria-hidden="true"><i></i><i></i><i></i></div>');
 const ticker=kind==='bold'?'\n  <div class="ticker" aria-hidden="true"><div>'+('<span>★ '+E(name.toUpperCase())+'</span>').repeat(16)+'</div></div>':'';
 const first=secs.length?'#s1':'#interactive';
 const body=[
 '<a class="skip" href="#main">'+(L?'Langkau ke kandungan':'Skip to content')+'</a>',
 '<header class="nav">',
 '  <div class="wrap nav-in">',
 '    <a class="logo" href="#top">'+E(name)+'</a>',
 '    <nav class="links" aria-label="'+(L?'Navigasi utama':'Main navigation')+'">'+nav+'</nav>',
 '    <a class="btn small" href="#interactive">'+E(d.cta)+'</a>',
 '  </div>',
 '</header>',
 '<main id="main">',
 '  <section class="hero" id="top">',
 '    <div class="wrap hero-in">',
 '      <div class="hero-copy">',
 '        <p class="kicker">'+E(typeName())+'</p>',
 '        <h1>'+splitTitle(d.title)+'</h1>',
 '        <p class="lead">'+E(d.desc)+'</p>',
 '        <div class="actions"><a class="btn" href="#interactive">'+E(d.cta)+'</a><a class="btn ghost" href="'+first+'">'+E(tr(c.secondary))+'</a></div>',
 '      </div>',
 '      '+art,
 '    </div>',
 '  </section>'+ticker,
 sections,
 '  '+interaction(c),
 '  <section class="closing" id="contact">',
 '    <div class="wrap">',
 '      <h2>'+(L?'Bersedia untuk bermula?':'Ready to get started?')+'</h2>',
 '      <a class="btn" href="#interactive">'+E(d.cta)+'</a>',
 '    </div>',
 '  </section>',
 '</main>',
 '<footer>',
 '  <div class="wrap foot"><span>© '+new Date().getFullYear()+' '+E(name)+'</span><a href="#top">'+(L?'Kembali ke atas':'Back to top')+' ↑</a></div>',
 '</footer>'].filter(x=>x!=='').join('\n');
 return {kind,lang:L?'ms':'en',name,desc:d.desc,fonts:'https://fonts.googleapis.com/css2?family='+DEF[kind].g+'&display=swap',css:buildCss(kind,s),js:buildJs(L),body,hasImg};
}
function page(p,inline){
 const E=escapeHtml;
 const head=['<!doctype html>','<html lang="'+p.lang+'">','<head>','  <meta charset="utf-8">','  <meta name="viewport" content="width=device-width,initial-scale=1">','  <title>'+E(p.name)+'</title>','  <meta name="description" content="'+E(p.desc)+'">','  <link rel="preconnect" href="https://fonts.googleapis.com">','  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>','  <link rel="stylesheet" href="'+p.fonts+'">',
  inline?'  <style>\n'+p.css+'</style>':'  <link rel="stylesheet" href="style.css">','</head>','<body class="s-'+p.kind+'">'].join('\n');
 const body=p.body.replace('%HERO%',inline?state.heroImg:'assets/hero.jpg');
 const tail=inline?'<script>\n'+p.js.replace(/<\/script/gi,'<\\/script')+'</script>':'<script src="script.js"></script>';
 return head+'\n'+body+'\n'+tail+'\n</body>\n</html>\n';
}
templateHtml=function(){const p=parts();return {html:page(p,true),css:p.css}};

/* ---------- export files (index.html, style.css, script.js, assets/) ---------- */
function heroBytes(){
 const m=/^data:image\/[a-z+]+;base64,(.+)$/.exec(state.heroImg||'');if(!m)return null;
 const bin=atob(m[1]),out=new Uint8Array(bin.length);for(let i=0;i<bin.length;i++)out[i]=bin.charCodeAt(i);return out;
}
function readme(p){
 return ['LAMAN WEB ANDA / YOUR WEBSITE — '+p.name,'Dibina dengan Web Wizard Studio / Built with Web Wizard Studio','',
 'FAIL DALAM FOLDER INI / FILES IN THIS FOLDER','  index.html   kandungan laman / page content','  style.css    warna, fon dan susun atur / colours, fonts and layout','  script.js    interaksi demo / demo interactions',p.hasImg?'  assets/      imej anda / your image':'','',
 'SEMAK DAHULU / CHECK FIRST','  Buka index.html dalam pelayar. / Open index.html in your browser.','  Gantikan semua kandungan contoh sebelum terbit. / Replace all sample content before publishing.','',
 'TERBIT DI GITHUB PAGES','  1. Log masuk github.com, tekan New repository, beri nama, pilih Public, tekan Create repository.','  2. Tekan "uploading an existing file". Muat naik SEMUA fail dan folder di sini (bukan fail ZIP). Tekan Commit changes.','  3. Buka Settings > Pages. Pada Branch pilih main dan / (root). Tekan Save.','  4. Tunggu 1 hingga 2 minit. Pautan anda: https://NAMA-PENGGUNA.github.io/NAMA-REPOSITORI/','',
 'PUBLISH ON GITHUB PAGES','  1. Sign in at github.com, press New repository, name it, choose Public, press Create repository.','  2. Press "uploading an existing file". Upload ALL the files and folders here (not the ZIP itself). Press Commit changes.','  3. Open Settings > Pages. Under Branch choose main and / (root). Press Save.','  4. Wait 1 to 2 minutes. Your link: https://YOUR-USERNAME.github.io/YOUR-REPOSITORY/','',
 'Panduan bergambar / Illustrated guide: '+GUIDE,''].filter((x,i,a)=>!(x===''&&a[i-1]==='')).join('\n');
}
function files(){
 const p=parts(),out=[['index.html',page(p,false)],['style.css',p.css],['script.js',p.js]],img=heroBytes();
 if(p.hasImg&&img)out.push(['assets/hero.jpg',img]);
 out.push(['README.txt',readme(p)]);return out;
}
function slug(){return siteName().toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'').slice(0,40)||'laman-saya'}

/* ---------- AI image prompts that match the three styles ---------- */
const SUBJECT={agency:'a small creative team collaborating around a laptop in a bright studio',portfolio:'a confident young professional at a tidy desk with their work on screen',lms:'three polytechnic students learning together around a laptop on campus',office:'colleagues helping each other at a modern office service counter',dashboard:'a person reviewing clear charts on a large monitor',conference:'a speaker on stage facing an engaged audience',ecommerce:'handmade local products arranged neatly on a table',saas:'a small team planning tasks together on a shared screen',blog:'a writer with a notebook and laptop by a window',landing:'participants at a hands-on workshop with laptops',games:'students enjoying an educational quiz game on tablets',community:'volunteers working together at a community event'};
const ART={min:'Natural-light photograph, clean and uncluttered, soft neutral background, realistic colours',bold:'High-contrast black-and-white cut-out photograph on a solid {p} colour block, poster style',fun:'Friendly soft 3D clay-style illustration, rounded shapes, pastel palette with {p} accents'};
heroPrompt=function(){const s=current();return 'Hero image of '+(SUBJECT[state.type]||'people working together')+'. Malaysian setting, modest attire. '+ART[state.style in ART?state.style:'min'].replace('{p}',s.primary)+'. Landscape, main subject centred, no text, no logos, no watermarks.'};
const ICON_ART={min:'Simple thin-line icons in one colour ({p}), rounded line ends, flat, no shading',bold:'Solid black glyph icons, each on a {p} square with a thick black border, poster style',fun:'Soft 3D clay-style icons, rounded shapes, pastel colours with {p} accents'};
iconPrompt=function(){const s=current(),c=CATALOG[state.type];return 'Set of 3 matching icons for a '+c.en+' website, one each for: '+c.items.map(x=>x.split('|')[1]).join(', ')+'. '+ICON_ART[state.style in ICON_ART?state.style:'min'].replace('{p}',s.primary)+'. Consistent size and angle. Each icon centred on a plain background, no text, no logos.'};

/* ---------- blueprint follows the real page ---------- */
blueprint=function(){
 const c=CATALOG[state.type],d=data(),L=state.lang==='bm',T=(bm,en)=>L?bm:en;
 return '# '+siteName()+'\nWeb Wizard Studio 4.1\n'+T('Jenis','Type')+': '+tr(c.bm+'|'+c.en)+'\n'+T('Bahasa','Language')+': '+state.lang.toUpperCase()+'\n'+T('Gaya','Style')+': '+styles[state.style].name+'\n\n## '+T('Bahagian atas','Top of page')+'\n'+d.title+'\n'+d.desc+'\n'+T('Butang utama','Main button')+': '+d.cta+'\n'+T('Butang kedua','Second button')+': '+tr(c.secondary)+'\n'+T('Imej utama','Main image')+': '+(state.heroImg?T('sudah dimuat naik','uploaded'):T('belum ada','none yet'))+'\n\n## '+T('Bahagian','Sections')+'\n'+sectionList().map((x,i)=>(i+1)+'. '+x.title+(x.desc?'\n   '+x.desc:'')).join('\n')+'\n\n## '+T('Kad contoh','Sample cards')+'\n'+c.items.map(x=>'- '+tr(x)).join('\n')+'\n\n'+T('Nota: blok demo berfungsi dalam pelayar sahaja. Gantikan semua kandungan contoh sebelum terbit.','Note: the demo block works in the browser only. Replace all sample content before publishing.');
};

/* ---------- site name and hero image controls ---------- */
const nameInput=$('site-name'),upload=$('hero-upload'),removeBtn=$('hero-remove'),thumb=$('hero-thumb');
function syncFields(){if(nameInput&&document.activeElement!==nameInput)nameInput.value=state.siteName||'';if(thumb){thumb.hidden=!state.heroImg;if(state.heroImg)thumb.src=state.heroImg}if(removeBtn)removeBtn.hidden=!state.heroImg}
/* Sample website images (same set as the Web Wizard PoliPD gallery): 4 site families x 3 styles. */
const SAMPLE_FOR={agency:'kerja',portfolio:'portfolio',lms:'pdp',office:'kerja',dashboard:'kerja',conference:'acara',ecommerce:'portfolio',saas:'kerja',blog:'pdp',landing:'acara',games:'pdp',community:'acara'};
const sampleSrc=(style,type)=>'assets/samples/sample-'+(SAMPLE_FOR[type]||'pdp')+'-'+style+'-sm.webp';
/* A type can have its own samples: add assets/samples/sample-<type>-<min|bold|fun>-sm.webp and they are picked up automatically. */
const NO_OWN=new Set();
function styleSamples(){document.querySelectorAll('#style-options .style-option').forEach(b=>{const k=b.dataset.style;if(!(k in DEF)||b.querySelector('.style-sample'))return;const img=document.createElement('img');img.className='style-sample';const own='assets/samples/sample-'+state.type+'-'+k+'-sm.webp',fam=sampleSrc(k,state.type);if(own!==fam&&!NO_OWN.has(own)){img.onerror=()=>{NO_OWN.add(own);img.onerror=()=>img.remove();img.src=fam};img.src=own}else img.src=fam;img.alt=tr('Contoh laman web gaya |Sample website in the style: ')+styles[k].name;if(!img.onerror)img.onerror=()=>img.remove();b.prepend(img);const tag=document.createElement('small');tag.className='style-sample-tag';tag.textContent=tr('Contoh gaya|Style example');b.append(tag)})}
const baseControls=renderControls;renderControls=function(){baseControls();syncFields();styleSamples()};
const saveNow=()=>window.WebWizardV4&&window.WebWizardV4.save&&window.WebWizardV4.save();
if(nameInput)nameInput.addEventListener('input',()=>{state.siteName=nameInput.value;renderPreview()});
if(upload)upload.addEventListener('change',e=>{
 const file=e.target.files&&e.target.files[0];if(!file)return;
 if(!file.type.startsWith('image/')){notify(tr('Sila pilih fail imej|Please choose an image file'));return}
 const url=URL.createObjectURL(file),img=new Image();
 img.onload=()=>{try{const max=1400,k=Math.min(1,max/Math.max(img.width,img.height)),cv=document.createElement('canvas');cv.width=Math.round(img.width*k);cv.height=Math.round(img.height*k);const ctx=cv.getContext('2d');ctx.fillStyle='#ffffff';ctx.fillRect(0,0,cv.width,cv.height);ctx.drawImage(img,0,0,cv.width,cv.height);state.heroImg=cv.toDataURL('image/jpeg',.82);syncFields();renderPreview();saveNow();notify(tr('Imej telah ditambah|Image added'))}catch(err){notify(tr('Imej ini tidak dapat dibaca|Unable to read this image'))}finally{URL.revokeObjectURL(url);e.target.value=''}};
 img.onerror=()=>{URL.revokeObjectURL(url);notify(tr('Imej ini tidak dapat dibuka|Unable to open this image'))};img.src=url;
});
if(removeBtn)removeBtn.addEventListener('click',()=>{state.heroImg='';syncFields();renderPreview();saveNow()});

window.WWSite={files,slug,siteName,GUIDE,sampleSrc};
render();
})();
