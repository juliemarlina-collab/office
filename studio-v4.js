/* Web Wizard Studio 4.2 — workspace: numbered tools, section editor, autosave, project files, ZIP export.
   Loads last, after script.js, enhancement.js, interface-i18n.js and site-template.js. */
(function(){'use strict';
const $=id=>document.getElementById(id),studio=$('studio'),body=studio?.querySelector('.studio-body'),controls=body?.querySelector('.controls'),preview=body?.querySelector('.preview-stage');
if(!studio||!body||!controls||!preview)return;
const B=(bm,en)=>state.lang==='en'?en:bm;
const groups=[...controls.querySelectorAll(':scope > .control-group')],KEY='wws-v4-project';
const GUIDE=(window.WWSite&&window.WWSite.GUIDE)||'https://elearning-polipd.github.io/WebWizard-PoliPD/#terbit';

/* Gallery artwork is mapped by the actual website category ID, never by position. */
const galleryIcons={agency:'browser',portfolio:'typography',lms:'education-books',office:'home',dashboard:'education-growth',conference:'event-trophy',ecommerce:'download',saas:'cloud-upload',blog:'html',landing:'campaign-target',games:'javascript',community:'responsive'};
const toolPaths={
 type:'<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
 style:'<path d="M12 3a9 9 0 1 0 9 9c0-1.7-1.2-2.5-2.6-2.5H16a2 2 0 0 1-2-2V5.6A2.6 2.6 0 0 0 12 3Z"/><circle cx="7.5" cy="11" r="1"/><circle cx="11" cy="7.5" r="1"/><circle cx="16.5" cy="13.5" r="1"/><circle cx="10.5" cy="16.5" r="1"/>',
 content:'<path d="M4 6h16M4 12h16M4 18h10"/><path d="M7 3v6"/>',
 sections:'<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 9v12M13 14h5M13 18h5"/>',
 colours:'<circle cx="12" cy="12" r="9"/><path d="M12 3v18M3 12h18"/><path d="m5.6 5.6 12.8 12.8"/>',
 image:'<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="m4 18 5-5 4 4 3-3 4 4"/>'
};
/* 3D toolbar artwork; the line icons above are the fallback if a file is missing. */
const ART={type:'type',style:'style',content:'content',sections:'sections',colours:'colours',image:'ai-image'};
function toolSvg(id){return '<svg aria-hidden="true" viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">'+toolPaths[id]+'</svg>'}
function node(tag,cls,text){const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n}

/* Tools in the order a beginner works: 1 to 6. */
const tools=[
 {id:'tool0',icon:'type',bm:'Jenis',en:'Type',hbm:'Pilih jenis laman web',hen:'Choose a website type',indices:[0]},
 {id:'tool1',icon:'style',bm:'Gaya',en:'Style',hbm:'Pilih gaya reka bentuk',hen:'Choose a design style',indices:[1]},
 {id:'tool2',icon:'content',bm:'Kandungan',en:'Content',hbm:'Nama laman, tajuk, butang dan imej utama',hen:'Site name, headline, button and image',indices:[2]},
 {id:'sections',icon:'sections',bm:'Bahagian',en:'Sections',hbm:'Sunting bahagian laman',hen:'Edit the page sections',indices:[]},
 {id:'tool3',icon:'colours',bm:'Warna',en:'Colours',hbm:'Tukar warna laman',hen:'Change the site colours',indices:[3]},
 {id:'tool4',icon:'image',bm:'Imej AI',en:'AI image',hbm:'Prompt untuk menjana imej',hen:'Prompts for generating images',indices:groups.map((_,j)=>j).filter(j=>j>=4)}
];

const root=node('section','v4-workspace');
root.innerHTML='<div class="v4-intro"><div><strong id="v4-title"></strong><p id="v4-sub"></p></div><div class="v4-status" id="v4-status" aria-live="polite"></div></div>';
const bar=node('div','v4-toolbar'),panel=node('div','v4-panel');panel.hidden=true;
const panelHeader=node('div','v4-panel-header'),panelTitle=node('strong','',''),close=node('button','v4-close','');close.type='button';
panelHeader.append(panelTitle,close);
const hint=node('p','v4-hint','');hint.hidden=true;
const fields=node('div','v4-fields');panel.append(panelHeader,hint,fields);root.append(bar,panel);body.insertBefore(root,preview);
controls.style.display='none';body.querySelector('.workspace-tools')?.remove();
let active=null,sections={},pending=null,statusKey='ready';const status=$('v4-status');
const STATUS={ready:['Sedia','Ready'],saving:['Menyimpan…','Saving…'],saved:['✓ Disimpan secara automatik','✓ Autosaved'],restored:['✓ Projek dipulihkan','✓ Project restored'],opened:['✓ Projek dibuka','✓ Project opened'],zip:['✓ ZIP dimuat turun','✓ ZIP downloaded'],nostore:['Storan penuh. Tekan Simpan projek.','Storage is full. Press Save project.'],norestore:['Projek tidak dapat dipulihkan','Unable to restore project']};
function setStatus(k){statusKey=k;status.textContent=B(STATUS[k][0],STATUS[k][1])}

/* ---------- sections: one list drives the preview, the menu and the export ---------- */
function defaults(type){return CATALOG[type].sections.map((_,i)=>({k:i,title:null,desc:null,visible:true}))}
function ensureSections(){const t=state.type,list=sections[t];if(!Array.isArray(list)||list.some(x=>!x||typeof x.k!=='number'))sections[t]=defaults(t)}
function resolve(type,sec){const c=CATALOG[type],own=sec.k>=0&&sec.k<c.sections.length;return {k:sec.k,title:sec.title!=null?sec.title:(own?tr(c.sections[sec.k]):''),desc:sec.desc!=null?sec.desc:(own?tr(SECTION_COPY[type][sec.k]):'')}}
function visibleSections(){ensureSections();return sections[state.type].filter(x=>x.visible).map(x=>resolve(state.type,x))}

function payload(){return {version:5,type:state.type,style:state.style,lang:state.lang,overrides:state.overrides,colors:state.colors,device:state.device,siteName:state.siteName||'',heroImg:state.heroImg||'',sections}}
function save(){try{localStorage.setItem(KEY,JSON.stringify(payload()));setStatus('saved')}catch(e){setStatus('nostore')}}
function later(){clearTimeout(pending);setStatus('saving');pending=setTimeout(save,250)}
function refresh(){if(typeof renderPreview==='function')renderPreview();later()}

function editor(){
 ensureSections();const list=sections[state.type];
 const wrap=node('div','v4-section-editor');
 const head=node('div','v4-section-head');head.append(node('b','',B('Bahagian laman','Page sections')),node('span','',B('Sunting, sembunyikan, susun semula atau buang bahagian. Menu laman mengikut senarai ini.','Edit, hide, reorder or remove sections. The site menu follows this list.')));wrap.append(head);
 list.forEach((sec,i)=>{
  const r=resolve(state.type,sec),item=node('div','v4-section-item'+(sec.visible?'':' is-hidden')),row=node('div','v4-section-row');
  const name=node('strong','',(i+1)+'. '+(r.title||B('Tanpa tajuk','Untitled'))),actions=node('div','v4-section-actions');
  [['↑',B('Alih ke atas','Move up'),()=>move(i,-1)],['↓',B('Alih ke bawah','Move down'),()=>move(i,1)],[sec.visible?'◉':'◌',sec.visible?B('Sembunyikan','Hide'):B('Paparkan','Show'),()=>{sec.visible=!sec.visible;drawEditor();refresh()}],['✕',B('Buang','Remove'),()=>{list.splice(i,1);drawEditor();refresh()}]].forEach(([glyph,title,fn])=>{const b=node('button','',glyph);b.type='button';b.title=title;b.setAttribute('aria-label',title+': '+(r.title||''));b.onclick=fn;actions.append(b)});
  row.append(name,actions);
  const l1=node('label','v4-field-label',B('Tajuk bahagian','Section title')),inp=node('input');inp.value=r.title;inp.maxLength=100;inp.id='v4-sec-t'+i;l1.htmlFor=inp.id;
  inp.oninput=()=>{sec.title=inp.value;name.textContent=(i+1)+'. '+(inp.value||B('Tanpa tajuk','Untitled'));refresh()};
  const l2=node('label','v4-field-label',B('Penerangan','Description')),desc=node('textarea');desc.rows=2;desc.maxLength=400;desc.value=r.desc;desc.id='v4-sec-d'+i;l2.htmlFor=desc.id;
  desc.oninput=()=>{sec.desc=desc.value;refresh()};
  item.append(row,l1,inp,l2,desc);wrap.append(item);
 });
 const foot=node('div','v4-section-foot'),add=node('button','v4-add',B('＋ Tambah bahagian','＋ Add section')),reset=node('button','v4-add',B('↺ Pulihkan bahagian asal','↺ Restore original sections'));
 add.type='button';reset.type='button';
 add.onclick=()=>{list.push({k:-1,title:B('Bahagian baharu','New section'),desc:B('Terangkan bahagian ini.','Describe this section.'),visible:true});drawEditor();refresh()};
 reset.onclick=()=>{sections[state.type]=defaults(state.type);drawEditor();refresh()};
 foot.append(add,reset);wrap.append(foot);return wrap;
 function move(i,d){const j=i+d;if(j<0||j>=list.length)return;[list[i],list[j]]=[list[j],list[i]];drawEditor();refresh()}
}
function drawEditor(){const old=fields.querySelector('.v4-section-editor');if(old)old.replaceWith(editor())}

/* ---------- toolbar ---------- */
function activate(id){
 active=active===id?null:id;panel.hidden=!active;
 bar.querySelectorAll('button').forEach(b=>{const on=b.dataset.tool===active;b.classList.toggle('selected',on);b.setAttribute('aria-pressed',String(on))});
 groups.forEach(g=>controls.append(g));fields.replaceChildren();hint.hidden=true;
 if(!active)return;
 const t=tools.find(x=>x.id===active);paintPanelTitle(t);
 t.indices.forEach(i=>{if(groups[i])fields.append(groups[i])});
 if(active==='sections')fields.append(editor());
 if(active==='tool4'){hint.hidden=false;hint.textContent=B('Salin prompt, tampal dalam ChatGPT atau Claude untuk menjana imej, kemudian muat naik imej itu di langkah 3 Kandungan.','Copy a prompt, paste it into ChatGPT or Claude to generate an image, then upload that image in step 3 Content.')}
}
function paintPanelTitle(t){panelTitle.textContent=B(t.bm,t.en)+' · '+B(t.hbm,t.hen)}
tools.forEach((t,i)=>{const b=node('button','v4-tool');b.type='button';b.dataset.tool=t.id;b.setAttribute('aria-pressed','false');const glyph=node('span','v4-tool-symbol has-art');const art=node('img');art.src='assets/icons/tool-'+ART[t.icon]+'.webp';art.alt='';art.width=56;art.height=56;art.onerror=()=>{glyph.classList.remove('has-art');glyph.innerHTML=toolSvg(t.icon)};glyph.append(art);b.append(node('span','v4-step',String(i+1)),glyph,node('span','v4-tool-label',''));b.onclick=()=>activate(t.id);bar.append(b)});
close.onclick=()=>activate(active);

function gallery(){document.querySelectorAll('#model-gallery .model-card').forEach(card=>{const art=card.querySelector('.thumb-shape');if(!art)return;const icon=galleryIcons[card.dataset.gallery];if(!icon)return;const img=node('img','gallery-3d-icon');img.src='assets/icons/'+icon+'.webp';img.alt='';img.loading='lazy';img.onerror=()=>{img.remove();art.textContent='✳'};art.replaceChildren(img)})}

/* ---------- actions ---------- */
const actions=node('div','v4-actions');
actions.innerHTML='<button type="button" id="v4-save"><span></span></button><button type="button" id="v4-open"><span></span></button><button type="button" id="v4-check"><span></span></button><button type="button" id="v4-zip" class="v4-primary"><span></span></button><input id="v4-file" type="file" accept=".json,application/json" hidden>';
root.append(actions);
for(const [id,assetName] of [['v4-check','quality-check'],['v4-zip','export-download']]){const art=node('img','v4-action-art');art.src='assets/icons/'+assetName+'.webp';art.alt='';art.loading='lazy';$(id).prepend(art)}
const next=node('div','v4-next');next.hidden=true;root.append(next);

function relabel(){
 $('v4-title').textContent=B('Bina laman web anda','Build your website');
 $('v4-sub').textContent=B('Ikut langkah 1 hingga 6. Pratonton di bawah berubah serta-merta.','Follow steps 1 to 6. The preview below updates as you go.');
 bar.setAttribute('aria-label',B('Alat sunting laman web','Website editing tools'));
 bar.querySelectorAll('.v4-tool').forEach((b,i)=>{const t=tools[i];b.querySelector('.v4-tool-label').textContent=B(t.bm,t.en);b.title=B(t.hbm,t.hen)});
 close.textContent=B('✕ Tutup','✕ Close');
 $('v4-save').lastElementChild.textContent=B('Simpan projek','Save project');
 $('v4-open').lastElementChild.textContent=B('Buka projek','Open project');
 $('v4-check').lastElementChild.textContent=B('Semak laman','Check website');
 $('v4-zip').lastElementChild.textContent=B('Muat turun ZIP ↓','Download ZIP ↓');
 const foot=document.querySelector('.hero-footnote');if(foot)foot.innerHTML=B('4 JENIS LAMAN WEB','4 WEBSITE TYPES')+' <span>✳</span> '+B('3 GAYA REKA BENTUK','3 DESIGN STYLES')+' <span>✳</span> BM / EN';
 setStatus(statusKey);
 if(active){const t=tools.find(x=>x.id===active);paintPanelTitle(t);if(active==='tool4')hint.textContent=B('Salin prompt, tampal dalam ChatGPT atau Claude untuk menjana imej, kemudian muat naik imej itu di langkah 3 Kandungan.','Copy a prompt, paste it into ChatGPT or Claude to generate an image, then upload that image in step 3 Content.')}
 if(!next.hidden)paintNext();
 paintShowcase();paintFlow();extraLabels();if(typeof paintFill==='function')paintFill();
}
function paintNext(){
 next.innerHTML='<strong></strong><ol><li></li><li></li><li></li></ol><a target="_blank" rel="noopener"></a><button type="button" class="v4-close"></button>';
 next.querySelector('strong').textContent=B('ZIP anda sudah dimuat turun. Langkah seterusnya:','Your ZIP is downloaded. What to do next:');
 const li=next.querySelectorAll('li');
 li[0].textContent=B('Ekstrak ZIP, kemudian buka index.html untuk menyemak laman.','Extract the ZIP, then open index.html to check the site.');
 li[1].textContent=B('Gantikan kandungan contoh dengan kandungan anda sendiri.','Replace the sample content with your own.');
 li[2].textContent=B('Muat naik semua fail ke GitHub Pages untuk mendapat pautan awam.','Upload all the files to GitHub Pages to get a public link.');
 const a=next.querySelector('a');a.href=GUIDE;a.textContent=B('Buka panduan terbit bergambar ↗','Open the illustrated publishing guide ↗');
 const x=next.querySelector('button');x.textContent=B('✕ Tutup','✕ Close');x.onclick=()=>{next.hidden=true};
}

/* ===== Welcome page: moving ring of the 12 sample websites (4 types x 3 styles) (same images and motion idea as Web Wizard PoliPD) ===== */
const FAM={pdp:['Pembelajaran','Learning','lms'],kerja:['Pengurusan kerja','Work hub','office'],portfolio:['Portfolio','Portfolio','portfolio'],acara:['Acara','Event','conference']};
const RING=[['pdp','fun'],['kerja','bold'],['portfolio','min'],['acara','fun'],['kerja','fun'],['acara','bold'],['portfolio','bold'],['pdp','min'],['acara','min'],['portfolio','fun'],['pdp','bold'],['kerja','min']];
const DOT={min:'#1447e6',bold:'#ffc400',fun:'#f97316'};
const reduced=()=>window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
const MO={off:0,last:0,raf:0,paused:false,visible:false,drag:null,moved:false,ring:null,cards:[]};
const showcase=node('section','v41-styles');showcase.id='styles';
document.querySelector('#welcome .welcome-hero')?.after(showcase);
function paintShowcase(){
 showcase.replaceChildren();
 const head=node('div','v41-styles-head');
 head.append(node('span','eyebrow',B('APA YANG ANDA BOLEH BINA','WHAT YOU CAN BUILD')),node('h2','',B('Empat jenis laman, tiga gaya','Four kinds of site, three styles')),node('p','v41-styles-lead',B('Leret atau tekan mana-mana contoh untuk mula membina dalam gaya itu.','Swipe, or tap any sample to start building in that style.')));
 const ring=node('div','v41-ring'),track=node('div','v41-track');ring.setAttribute('role','region');ring.setAttribute('aria-label',B('Contoh laman web bergerak','Moving website samples'));
 for(let rep=0;rep<2;rep++)for(const [fam,style] of RING){
  const label=B(FAM[fam][0],FAM[fam][1])+' · '+styles[style].name,c=node('button','v41-card');c.type='button';c.setAttribute('aria-label',label);if(rep)c.tabIndex=-1;
  const chip=node('span','v41-chip'),dot=node('i');dot.style.background=DOT[style];chip.append(dot,document.createTextNode(label));
  const screen=node('span','v41-screen'),img=node('img');img.src='assets/samples/sample-'+fam+'-'+style+'-sm.webp';img.alt='';img.width=800;img.height=450;img.draggable=false;screen.append(img);
  c.append(chip,screen);
  c.onclick=()=>{if(MO.moved)return;state.type=FAM[fam][2];state.style=style;state.colors={};state.overrides={};showStudio();later()};
  track.append(c);
 }
 ring.append(track);
 const toolsRow=node('div','v41-ring-tools'),pause=node('button','v41-pause');pause.type='button';
 const label=()=>{pause.textContent=MO.paused?B('▶ Main','▶ Play'):B('⏸ Jeda','⏸ Pause');pause.setAttribute('aria-pressed',String(MO.paused))};label();
 pause.onclick=()=>{MO.paused=!MO.paused;label()};
 toolsRow.append(pause,node('small','',B('12 contoh daripada galeri Web Wizard PoliPD.','12 samples from the Web Wizard PoliPD gallery.')));
 if(reduced())pause.hidden=true;
 showcase.append(head,ring,toolsRow);
 MO.ring=ring;MO.cards=[...track.children];
 ring.addEventListener('pointerdown',e=>{MO.drag={x:e.clientX,o:MO.off};MO.moved=false});
 if('IntersectionObserver' in window)new IntersectionObserver(es=>{MO.visible=es[0].isIntersecting;if(MO.visible)moStart()}).observe(ring);else{MO.visible=true}
 moLayout();moStart();
}
function moLayout(){
 const ring=MO.ring,cards=MO.cards;if(!ring||!cards.length)return;
 if(reduced()){ring.classList.add('static');return}
 const w=ring.clientWidth,cw=cards[0].offsetWidth;if(!w||!cw)return;
 const step=cw+Math.max(14,cw*.08),total=step*cards.length;
 MO.off=((MO.off%total)+total)%total;
 cards.forEach((c,i)=>{
  let x=((i*step-MO.off)%total+total)%total-step;if(x>total-step*1.5)x-=total;
  const n=Math.max(-1.4,Math.min(1.4,(x+cw/2-w/2)/(w/2)));
  c.style.transform='translate3d('+x+'px,0,'+(n*n*70)+'px) rotateY('+(n*-24)+'deg) scale('+(1+Math.abs(n)*.06)+')';
  c.style.zIndex=String(100-Math.round(Math.abs(n)*50));
 });
}
function moTick(t){if(!MO.last)MO.last=t;const dt=Math.min(64,t-MO.last);MO.last=t;if(!MO.paused&&!MO.drag&&MO.visible)MO.off+=dt*.045;moLayout();MO.raf=MO.visible?requestAnimationFrame(moTick):0}
function moStart(){if(!MO.raf&&!reduced()){MO.last=0;MO.raf=requestAnimationFrame(moTick)}}
window.addEventListener('pointermove',e=>{if(!MO.drag)return;const dx=e.clientX-MO.drag.x;if(Math.abs(dx)>6)MO.moved=true;MO.off=MO.drag.o-dx;if(!MO.raf)moLayout()});
window.addEventListener('pointerup',()=>{if(MO.drag){MO.drag=null;setTimeout(()=>{MO.moved=false},50)}});
window.addEventListener('resize',moLayout);

/* ===== Welcome page: interactive process flow. The rocket travels to the step you choose. ===== */
const FLOW=[
 {icon:'tool-type',s:['Jenis','Type'],t:['Pilih jenis laman web','Pick a website type'],d:['Pilih satu daripada 4 jenis: Laman PdP, Laman pengurusan kerja, Acara atau Portfolio. Setiap jenis datang dengan menu dan bahagian yang sesuai.','Pick one of 4 types: a teaching & learning site, a work management site, an event or a portfolio. Each type comes with a menu and sections that fit.']},
 {icon:'tool-style',s:['Gaya','Style'],t:['Pilih gaya reka bentuk','Pick a design style'],d:['Pilih Minimal profesional, Tajuk besar dan kontras atau Mesra dan berwarna. Warna dan fon berubah serta-merta.','Pick Professional minimalist, Bold headings and contrast, or Friendly and colourful. Colours and fonts change straight away.']},
 {icon:'tool-content',s:['Kandungan','Content'],t:['Masukkan kandungan anda','Add your content'],d:['Taip nama laman, tajuk utama dan teks butang. Tambah imej, kemudian sunting atau susun semula bahagian.','Type your site name, headline and button text. Add an image, then edit or reorder the sections.']},
 {icon:'export-download',s:['Muat turun','Download'],t:['Semak dan muat turun','Check and download'],d:['Lihat pratonton pada desktop, tablet dan telefon. Tekan Semak laman, kemudian Muat turun ZIP untuk mendapat fail laman web anda.','Preview on desktop, tablet and phone. Press Check website, then Download ZIP to get your website files.']},
 {icon:'github',s:['Terbit','Publish'],t:['Terbitkan di GitHub Pages','Publish on GitHub Pages'],d:['Muat naik fail ke GitHub Pages untuk mendapat pautan awam yang boleh dikongsi dengan sesiapa sahaja.','Upload the files to GitHub Pages to get a public link you can share with anyone.']}
];
const flow=$('v41-flow');let flowStep=0,flowTimer=0,flowPlayed=false;
function stopFlow(){clearInterval(flowTimer);flowTimer=0}
function setFlow(i,user){
 if(user)stopFlow();
 flowStep=Math.max(0,Math.min(FLOW.length-1,i));if(!flow)return;
 const n=FLOW.length,pct=flowStep/(n-1)*100,f=FLOW[flowStep],last=flowStep===n-1;
 flow.querySelector('.v41-flow-fill').style.width=pct+'%';
 const rocket=flow.querySelector('.v41-rocket');rocket.style.left=pct+'%';rocket.classList.toggle('liftoff',last);
 flow.querySelectorAll('.v41-dot').forEach((d,j)=>{d.classList.toggle('done',j<flowStep);d.classList.toggle('now',j===flowStep);if(j===flowStep)d.setAttribute('aria-current','step');else d.removeAttribute('aria-current')});
 const panel=flow.querySelector('.v41-flow-panel');
 panel.querySelector('img').src='assets/icons/'+f.icon+'.webp';
 panel.querySelector('.v41-flow-count').textContent=B('Langkah '+(flowStep+1)+' daripada '+n,'Step '+(flowStep+1)+' of '+n);
 panel.querySelector('h3').textContent=B(f.t[0],f.t[1]);
 panel.querySelector('p').textContent=B(f.d[0],f.d[1]);
 const prev=panel.querySelector('.v41-prev'),nextB=panel.querySelector('.v41-next'),go=panel.querySelector('.v41-go'),guide=panel.querySelector('.v41-guide');
 prev.disabled=flowStep===0;nextB.hidden=last;go.hidden=!last;guide.hidden=!last;
 panel.classList.remove('swap');void panel.offsetWidth;panel.classList.add('swap');
}
function paintFlow(){
 if(!flow)return;
 flow.replaceChildren();
 const intro=node('p','v41-flow-intro',B('Tekan mana-mana langkah, atau gunakan butang Seterusnya, untuk melihat roket bergerak daripada idea hingga laman web anda terbit.','Tap any step, or use Next, to watch the rocket travel from idea to a live website.'));
 const rail=node('div','v41-flow-rail'),line=node('div','v41-flow-line'),fill=node('span','v41-flow-fill');line.append(fill);
 const rocket=node('img','v41-rocket');rocket.src='assets/icons/launch.webp';rocket.alt='';
 const dots=node('ol','v41-dots');
 FLOW.forEach((f,i)=>{const li=node('li'),b=node('button','v41-dot');b.type='button';b.style.left=(i/(FLOW.length-1)*100)+'%';b.append(node('span','v41-dot-num',String(i+1)),node('span','v41-dot-label',B(f.s[0],f.s[1])));b.setAttribute('aria-label',B('Langkah ','Step ')+(i+1)+': '+B(f.t[0],f.t[1]));b.onclick=()=>setFlow(i,true);li.append(b);dots.append(li)});
 rail.append(line,rocket,dots);
 const panel=node('div','v41-flow-panel');panel.setAttribute('aria-live','polite');
 const art=node('img','v41-flow-art');art.alt='';
 const text=node('div','v41-flow-text');text.append(node('span','v41-flow-count',''),node('h3','',''),node('p','',''));
 const nav=node('div','v41-flow-nav'),prev=node('button','v41-prev',B('← Sebelumnya','← Back')),nextB=node('button','v41-next',B('Seterusnya →','Next →')),go=node('button','v41-go',B('Lancarkan Studio ↗','Launch Studio ↗')),guide=node('a','v41-guide',B('Panduan terbit ↗','Publishing guide ↗'));
 prev.type=nextB.type=go.type='button';guide.href=GUIDE;guide.target='_blank';guide.rel='noopener';
 prev.onclick=()=>setFlow(flowStep-1,true);nextB.onclick=()=>setFlow(flowStep+1,true);go.onclick=()=>{stopFlow();showStudio()};
 nav.append(prev,nextB,go,guide);text.append(nav);panel.append(art,text);
 flow.append(intro,rail,panel);
 setFlow(flowStep,false);
}
if(flow&&'IntersectionObserver' in window)new IntersectionObserver((es,ob)=>{if(!es[0].isIntersecting||flowPlayed)return;flowPlayed=true;ob.disconnect();if(reduced())return;flowTimer=setInterval(()=>{if(flowStep>=FLOW.length-1)return stopFlow();setFlow(flowStep+1,false)},2600)},{threshold:.5}).observe(flow);

/* Text that the older scripts left in English: switched here with the language. */
const EXTRA=[
 ['.v403-hero-caption','Bayangkan. Reka. Terbitkan. ✦ Tanpa pengekodan.','Imagine it. Design it. Bring it live. ✦ No coding required.'],
 ['.v403-showcase-head .eyebrow','4 JENIS LAMAN WEB','4 WEBSITE TYPES'],
 ['.v403-showcase-head p','Terokai apa yang anda boleh bina, daripada portfolio hingga hab pembelajaran dan acara.','Explore what you can build, from portfolios to learning hubs and events.'],
 ['.v403-marquee-hint','← Tekan satu jenis untuk mula →','← Tap a type to start →']
];
const EXTRA_HTML=[['.v403-showcase-head h2','Satu idea. <em>Pelbagai kemungkinan.</em>','One idea. <em>Many possibilities.</em>']];
const EXTRA_ATTR=[
 ['.topbar .brand','aria-label','Laman utama Web Wizard Studio','Web Wizard Studio home'],
 ['.hero-art-wizard','aria-label','Web Wizard bersama alat pembangunan web','Web Wizard with web development tools'],
 ['.hero-art-wizard img','alt','Ilustrasi Web Wizard dikelilingi alat pembangunan web','Illustration of the Web Wizard surrounded by web development tools'],
 ['.studio-icon-ribbon','aria-label','Alat Studio','Studio tools'],
 ['.v403-showcase','aria-label','Jenis laman web bergerak','Website types in motion'],
 ['#back-home','aria-label','Kembali ke halaman utama','Back to welcome'],['#back-home','title','Kembali ke halaman utama','Back to welcome'],
 ['.device-controls','aria-label','Peranti pratonton','Preview device'],
 ['#preview-frame','title','Pratonton laman web yang dijana','Generated website preview'],
 ['#close-dialog','aria-label','Tutup','Close dialog']
];
const RIBBON={Templates:['Templat','Templates'],Responsive:['Responsif','Responsive'],Publish:['Terbit','Publish']};
function extraLabels(){
 for(const [sel,bm,en] of EXTRA){const el=document.querySelector(sel);if(el)el.textContent=B(bm,en)}
 for(const [sel,bm,en] of EXTRA_HTML){const el=document.querySelector(sel);if(el)el.innerHTML=B(bm,en)}
 for(const [sel,attr,bm,en] of EXTRA_ATTR){const el=document.querySelector(sel);if(el)el.setAttribute(attr,B(bm,en))}
 document.querySelectorAll('.studio-icon-ribbon span').forEach(el=>{const key=el.dataset.k||el.textContent.trim();if(RIBBON[key]){el.dataset.k=key;el.textContent=B(RIBBON[key][0],RIBBON[key][1])}});
 document.querySelectorAll('.v403-type-card').forEach(b=>{const c=CATALOG[b.dataset.website],t=b.querySelector('b');if(c&&t)t.textContent=B(c.bm,c.en)});
}

/* Language switch keeps the user's edited text, then relabels the workspace. */
const baseLang=changeLang;
changeLang=function(lang){const keep=state.overrides;baseLang(lang);state.overrides=keep;render();relabel();gallery();later()};
/* Any full render (type change, reset) refreshes an open section editor. */
const baseRender=render;
render=function(){baseRender();if(active==='sections')drawEditor()};

function applyProject(p){
 if(p.type in types)state.type=p.type;
 state.style=p.style in styles?p.style:'min';
 state.overrides=p.overrides&&typeof p.overrides==='object'?p.overrides:{};
 state.colors=p.colors&&typeof p.colors==='object'?p.colors:{};
 state.device=['desktop','tablet','mobile'].includes(p.device)?p.device:'desktop';
 state.siteName=typeof p.siteName==='string'?p.siteName:'';
 state.heroImg=typeof p.heroImg==='string'&&p.heroImg.startsWith('data:image/')?p.heroImg:'';
 sections=p.sections&&typeof p.sections==='object'?p.sections:{};
 if(p.version===4){state.colors={};sections={}}
 const lang=p.lang==='en'||p.lang==='bm'?p.lang:state.lang;
 changeLang(lang);
}
function restore(){try{const raw=localStorage.getItem(KEY);if(!raw){relabel();return}const p=JSON.parse(raw);if(!p||typeof p!=='object'){relabel();return}applyProject(p);setStatus('restored')}catch(e){relabel();setStatus('norestore')}}

function download(filename,blob){const a=document.createElement('a'),url=URL.createObjectURL(blob);a.href=url;a.download=filename;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),2000)}
$('v4-save').onclick=()=>{save();download('web-wizard-project.json',new Blob([JSON.stringify(payload())],{type:'application/json'}))};
$('v4-open').onclick=()=>$('v4-file').click();
$('v4-file').onchange=async e=>{const f=e.target.files?.[0];if(!f)return;try{const p=JSON.parse(await f.text());if(!p||(p.version!==4&&p.version!==5)||!(p.type in types))throw Error('invalid');applyProject(p);if(active)activate(active),activate(active);save();setStatus('opened')}catch(err){alert(B('Fail ini bukan projek Web Wizard Studio yang sah.','This file is not a valid Web Wizard Studio project.'))}e.target.value=''};
$('v4-check').onclick=()=>{
 const d=data(),todo=[],tips=[];
 if(!(state.siteName||'').trim())todo.push(B('Taip nama laman web anda (langkah 3)','Type your website name (step 3)'));
 if(!d.title?.trim())todo.push(B('Tambah tajuk utama (langkah 3)','Add a headline (step 3)'));
 if(!d.desc?.trim())todo.push(B('Tambah pengenalan ringkas (langkah 3)','Add a short introduction (step 3)'));
 if(!d.cta?.trim())todo.push(B('Tambah teks butang utama (langkah 3)','Add the main button text (step 3)'));
 if(!visibleSections().length)todo.push(B('Paparkan sekurang-kurangnya satu bahagian (langkah 4)','Show at least one section (step 4)'));
 if(visibleSections().some(x=>!x.title.trim()))todo.push(B('Beri tajuk kepada setiap bahagian (langkah 4)','Give every section a title (step 4)'));
 if(!state.heroImg)tips.push(B('Tambah imej utama supaya laman lebih menarik (langkah 3)','Add a main image to make the site more inviting (step 3)'));
 tips.push(B('Gantikan semua kandungan contoh sebelum terbit','Replace all sample content before publishing'));
 tips.push(B('Uji paparan telefon menggunakan butang Telefon di atas','Test on a phone using the Mobile button above'));
 alert((todo.length?B('Perlu dibaiki:','To fix:')+'\n• '+todo.join('\n• ')+'\n\n':B('Semakan asas lulus.','Basic checks passed.')+'\n\n')+B('Cadangan:','Suggestions:')+'\n• '+tips.join('\n• '));
};

/* Standards-compliant ZIP writer (stored entries, no external dependency). Accepts text or bytes. */
const encoder=new TextEncoder();const crcTable=Array.from({length:256},(_,n)=>{let c=n;for(let k=0;k<8;k++)c=c&1?0xedb88320^(c>>>1):c>>>1;return c>>>0});function crc(bytes){let c=0xffffffff;for(const b of bytes)c=crcTable[(c^b)&255]^(c>>>8);return(c^0xffffffff)>>>0}
function zip(files){const chunks=[],directory=[];let offset=0;function u16(a,n){a.push(n&255,(n>>>8)&255)}function u32(a,n){u16(a,n);u16(a,n>>>16)}for(const [name,content] of files){const fn=encoder.encode(name),bytes=content instanceof Uint8Array?content:encoder.encode(content),sum=crc(bytes),local=[];u32(local,0x04034b50);u16(local,20);u16(local,0x0800);u16(local,0);u16(local,0);u16(local,0x21);u32(local,sum);u32(local,bytes.length);u32(local,bytes.length);u16(local,fn.length);u16(local,0);chunks.push(new Uint8Array(local),fn,bytes);const central=[];u32(central,0x02014b50);u16(central,20);u16(central,20);u16(central,0x0800);u16(central,0);u16(central,0);u16(central,0x21);u32(central,sum);u32(central,bytes.length);u32(central,bytes.length);u16(central,fn.length);u16(central,0);u16(central,0);u16(central,0);u16(central,0);u32(central,0);u32(central,offset);directory.push(new Uint8Array(central),fn);offset+=local.length+fn.length+bytes.length}const start=offset;for(const d of directory){chunks.push(d);offset+=d.length}const end=[];u32(end,0x06054b50);u16(end,0);u16(end,0);u16(end,files.length);u16(end,files.length);u32(end,offset-start);u32(end,start);u16(end,0);chunks.push(new Uint8Array(end));return new Blob(chunks,{type:'application/zip'})}
$('v4-zip').onclick=()=>{const site=window.WWSite;download(site.slug()+'.zip',zip(site.files()));setStatus('zip');next.hidden=false;paintNext()};

$('reset-all').onclick=()=>{if(!confirm(B('Set semula semuanya? Teks, warna, imej dan bahagian anda akan dipadamkan.','Reset everything? Your text, colours, image and sections will be cleared.')))return;state.type='lms';state.style='min';state.overrides={};state.colors={};state.device='desktop';state.siteName='';state.heroImg='';sections={};render();notify(B('Reka bentuk telah diset semula','Design reset'));later()};


/* ---------- AI fill: one prompt + CV in, one JSON out, every text field filled ---------- */
const FILL={n:5,lang:'',open:false};
const fillCard=node('section','v4-fill');
root.insertBefore(fillCard,bar);
function fillLang(){return FILL.lang||state.lang}
function fillPrompt(){
 const bm=fillLang()==='bm',c=CATALOG[state.type]||{},tn=tr((c.bm||'')+'|'+(c.en||'')),
  sug=(c.nav||[]).slice(1).map(x=>String(x).split('|')[bm?0:1]).filter(Boolean).join(', ');
 if(bm)return `Anda pembantu menulis kandungan laman web untuk pemula.

TUGAS
Baca maklumat saya (CV, resume, profil atau nota) yang saya lampirkan atau tampal selepas prompt ini. Tulis kandungan untuk laman web jenis "${tn}", kemudian keluarkan SATU blok JSON sahaja.

PERATURAN
1. Guna hanya maklumat daripada CV/maklumat saya. JANGAN reka nama, tarikh, statistik, anugerah, testimoni atau pautan.
2. Jika sesuatu tiada dalam maklumat saya, tulis "(isi di sini)".
3. Jangan masukkan no. IC, alamat rumah, no. telefon peribadi atau data sulit.
4. Tulis dalam Bahasa Melayu yang mudah dan mesra (gaya Malaysia). Ayat pendek.
5. Letakkan TEPAT ${FILL.n} bahagian dalam "sections", disusun mengikut apa yang paling berguna kepada pelawat.
6. Panjang maksimum (aksara): siteName 40, title 70, desc 160, cta 24, tajuk bahagian 40, penerangan bahagian 200.
7. Berikan JSON sahaja dalam satu blok kod. Tiada penjelasan lain.

FORMAT (gantikan contoh dengan nilai sebenar)
{
  "ww_site": 1,
  "siteName": "Nama laman atau nama saya",
  "title": "Tajuk utama yang menarik",
  "desc": "Satu atau dua ayat pengenalan",
  "cta": "Teks butang utama",
  "sections": [
    {"title": "Tajuk bahagian 1", "desc": "Penerangan ringkas bahagian 1"}
  ]
}

Cadangan bahagian untuk jenis laman ini: ${sug||'Tentang, Projek, Hubungi'}.

MAKLUMAT SAYA (tampal CV atau nota di bawah, atau lampirkan fail CV):
`;
 return `You are a website content assistant for beginners.

TASK
Read my information (CV, resume, profile or notes) that I attach or paste after this prompt. Write the content for a "${tn}" website, then output ONE JSON block only.

RULES
1. Use only information from my CV/notes. Do NOT invent names, dates, statistics, awards, testimonials or links.
2. If something is missing from my information, write "(fill in)".
3. Do not include IC numbers, home addresses, personal phone numbers or confidential data.
4. Write in simple, friendly English with short sentences.
5. Put EXACTLY ${FILL.n} sections in "sections", ordered by what is most useful to visitors.
6. Maximum length (characters): siteName 40, title 70, desc 160, cta 24, section title 40, section description 200.
7. Give the JSON only, in one code block. No other explanation.

FORMAT (replace the examples with real values)
{
  "ww_site": 1,
  "siteName": "Site name or my name",
  "title": "An engaging main headline",
  "desc": "One or two introduction sentences",
  "cta": "Main button text",
  "sections": [
    {"title": "Section 1 title", "desc": "Short description of section 1"}
  ]
}

Suggested sections for this website type: ${sug||'About, Projects, Contact'}.

MY INFORMATION (paste your CV or notes below, or attach your CV file):
`}
function fillParse(t){
 t=String(t||'').replace(/[“”]/g,'"');const i=t.indexOf('"ww_site"');if(i<0)return null;
 const st=t.lastIndexOf('{',i);if(st<0)return null;let d=0,inStr=false,esc=false;
 for(let j=st;j<t.length;j++){const ch=t[j];
  if(inStr){if(esc)esc=false;else if(ch==='\\')esc=true;else if(ch==='"')inStr=false;continue}
  if(ch==='"'){inStr=true;continue}
  if(ch==='{')d++;else if(ch==='}'){d--;if(!d){const raw=t.slice(st,j+1);try{return JSON.parse(raw)}catch(e){try{return JSON.parse(raw.replace(/,\s*([}\]])/g,'$1'))}catch(e2){return null}}}}}
 return null}
const clamp=(v,n)=>String(v==null?'':v).replace(/\s+/g,' ').trim().slice(0,n);
function fillApply(o){
 const did=[],name=clamp(o.siteName,60),title=clamp(o.title,100),desc=clamp(o.desc,240),cta=clamp(o.cta,40);
 if(name){state.siteName=name;did.push(B('nama laman','site name'))}
 const ov={...state.overrides};
 if(title){ov.title=title;did.push(B('tajuk utama','headline'))}
 if(desc){ov.desc=desc;did.push(B('pengenalan','introduction'))}
 if(cta){ov.cta=cta;did.push(B('butang','button'))}
 state.overrides=ov;
 const list=Array.isArray(o.sections)?o.sections.map(s=>({k:-1,title:clamp(s&&s.title,80),desc:clamp(s&&s.desc,320),visible:true})).filter(s=>s.title||s.desc).slice(0,10):[];
 if(list.length){sections[state.type]=list;did.push(list.length+' '+B('bahagian','sections'))}
 render();if(active==='sections')drawEditor();later();
 return did}
function paintFill(){
 const bm=state.lang==='bm',fl=fillLang();
 const sizes=[[3,B('Ringkas','Short'),B('3 bahagian','3 sections')],[5,B('Sederhana','Medium'),B('5 bahagian','5 sections')],[7,B('Lengkap','Full'),B('7 bahagian','7 sections')]];
 fillCard.innerHTML='';
 const head=node('button','v4-fill-head');head.type='button';head.setAttribute('aria-expanded',String(FILL.open));
 head.append(node('span','v4-fill-ic','⚡'),(()=>{const d=node('span','v4-fill-txt');d.append(node('strong','',B('Ada CV atau maklumat? Isi semua sekali dengan AI','Have a CV or notes? Fill everything in one go with AI')),node('small','',B('Tampal 1 prompt dalam ChatGPT, Claude atau Gemini bersama CV anda. Tak perlu taip satu-satu.','Paste 1 prompt into ChatGPT, Claude or Gemini with your CV. No typing field by field.')));return d})(),node('span','v4-fill-go',FILL.open?B('Tutup ▴','Close ▴'):B('Mula ▾','Start ▾')));
 head.onclick=()=>{FILL.open=!FILL.open;paintFill()};fillCard.append(head);
 if(!FILL.open)return;
 const bodyEl=node('div','v4-fill-body');
 const s1=node('div','v4-fill-step');s1.append(node('b','',B('1. Pilih saiz laman dan bahasa','1. Choose the site size and language')));
 const row=node('div','v4-fill-chips');
 sizes.forEach(([n,l,d])=>{const b=node('button','v4-chip'+(FILL.n===n?' on':''),l+' · '+d);b.type='button';b.setAttribute('aria-pressed',String(FILL.n===n));b.onclick=()=>{FILL.n=n;paintFill()};row.append(b)});
 [['bm','BM'],['en','EN']].forEach(([k,l])=>{const b=node('button','v4-chip lang'+(fl===k?' on':''),B('Bahasa: ','Language: ')+l);b.type='button';b.setAttribute('aria-pressed',String(fl===k));b.onclick=()=>{FILL.lang=k;paintFill()};row.append(b)});
 s1.append(row);
 const s2=node('div','v4-fill-step');s2.append(node('b','',B('2. Salin prompt, tampal dalam AI, lampirkan CV anda','2. Copy the prompt, paste it into your AI, attach your CV')));
 const ta=node('textarea','v4-fill-prompt');ta.readOnly=true;ta.rows=7;ta.value=fillPrompt();ta.setAttribute('aria-label',B('Prompt untuk AI','Prompt for AI'));
 const cp=node('button','v4-fill-btn',B('📋 Salin prompt','📋 Copy prompt'));cp.type='button';
 cp.onclick=async()=>{try{await navigator.clipboard.writeText(ta.value)}catch(e){ta.select();document.execCommand&&document.execCommand('copy')}cp.textContent=B('✓ Disalin. Tampal dalam AI anda','✓ Copied. Paste it into your AI');setTimeout(()=>{cp.textContent=B('📋 Salin prompt','📋 Copy prompt')},2200)};
 const tip=node('p','v4-fill-tip',B('Dalam ChatGPT/Claude/Gemini: tampal prompt ini, kemudian lampirkan fail CV (PDF/Word) atau tampal teks CV di hujung. Anda boleh sunting maklumat sebelum menghantar.','In ChatGPT/Claude/Gemini: paste this prompt, then attach your CV file (PDF/Word) or paste the CV text at the end. You can edit the details before sending.'));
 s2.append(ta,cp,tip);
 const s3=node('div','v4-fill-step');s3.append(node('b','',B('3. Tampal jawapan AI di sini','3. Paste the AI answer here')));
 const ans=node('textarea','v4-fill-answer');ans.rows=5;ans.placeholder='{ "ww_site": 1, ... }';ans.setAttribute('aria-label',B('Jawapan AI','AI answer'));
 const go=node('button','v4-fill-btn primary',B('✨ Isi semua laman saya','✨ Fill in my whole site'));go.type='button';
 const msg=node('p','v4-fill-msg');msg.setAttribute('aria-live','polite');
 go.onclick=()=>{const o=fillParse(ans.value);
  if(!o){msg.className='v4-fill-msg bad';msg.textContent=B('Blok JSON tidak ditemui. Salin jawapan AI bermula dengan { "ww_site": 1 hingga } yang terakhir.','No JSON block found. Copy the AI answer starting at { "ww_site": 1 up to the last }.');return}
  const did=fillApply(o);
  if(!did.length){msg.className='v4-fill-msg bad';msg.textContent=B('Tiada nilai yang sah ditemui dalam jawapan itu.','No valid values were found in that answer.');return}
  msg.className='v4-fill-msg ok';msg.textContent=B('Siap! Diisi: ','Done! Filled in: ')+did.join(', ')+'. '+B('Semak dan ubah di langkah 3 dan 4.','Check and edit in steps 3 and 4.');
  notify(B('Laman anda sudah diisi','Your site is filled in'))};
 s3.append(ans,go,msg);
 bodyEl.append(s1,s2,s3);fillCard.append(bodyEl)}

window.WebWizardV4={activate,save,zip,refresh,sections:visibleSections};
window.addEventListener('load',extraLabels);document.addEventListener('DOMContentLoaded',extraLabels);
gallery();restore();
body.addEventListener('input',later,true);body.addEventListener('change',later,true);body.addEventListener('click',later,true);document.querySelectorAll('[data-device]').forEach(b=>b.addEventListener('click',later));window.addEventListener('beforeunload',save);
})();
