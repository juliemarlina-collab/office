/* Web Wizard Studio 4.1 — workspace: numbered tools, section editor, autosave, project files, ZIP export.
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
 {id:'tool2',icon:'content',bm:'Kandungan',en:'Content',hbm:'Nama laman, tajuk, butang dan imej',hen:'Site name, headline, button and image',indices:[2]},
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
const STATUS={ready:['Sedia','Ready'],saving:['Menyimpan…','Saving…'],saved:['✓ Disimpan automatik','✓ Autosaved'],restored:['✓ Projek dipulihkan','✓ Project restored'],opened:['✓ Projek dibuka','✓ Project opened'],zip:['✓ ZIP dimuat turun','✓ ZIP downloaded'],nostore:['Storan penuh. Tekan Simpan projek.','Storage is full. Press Save project.'],norestore:['Projek tidak dapat dipulihkan','Unable to restore project']};
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
 const head=node('div','v4-section-head');head.append(node('b','',B('Bahagian laman','Page sections')),node('span','',B('Sunting, sembunyi, susun semula atau buang bahagian. Menu laman ikut senarai ini.','Edit, hide, reorder or remove sections. The site menu follows this list.')));wrap.append(head);
 list.forEach((sec,i)=>{
  const r=resolve(state.type,sec),item=node('div','v4-section-item'+(sec.visible?'':' is-hidden')),row=node('div','v4-section-row');
  const name=node('strong','',(i+1)+'. '+(r.title||B('Tanpa tajuk','Untitled'))),actions=node('div','v4-section-actions');
  [['↑',B('Naik','Move up'),()=>move(i,-1)],['↓',B('Turun','Move down'),()=>move(i,1)],[sec.visible?'◉':'◌',sec.visible?B('Sembunyi','Hide'):B('Papar','Show'),()=>{sec.visible=!sec.visible;drawEditor();refresh()}],['✕',B('Buang','Remove'),()=>{list.splice(i,1);drawEditor();refresh()}]].forEach(([glyph,title,fn])=>{const b=node('button','',glyph);b.type='button';b.title=title;b.setAttribute('aria-label',title+': '+(r.title||''));b.onclick=fn;actions.append(b)});
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
 const foot=document.querySelector('.hero-footnote');if(foot)foot.innerHTML=B('12 JENIS LAMAN WEB','12 WEBSITE TYPES')+' <span>✳</span> '+B('3 GAYA REKA BENTUK','3 DESIGN STYLES')+' <span>✳</span> BM / EN';
 setStatus(statusKey);
 if(active){const t=tools.find(x=>x.id===active);paintPanelTitle(t);if(active==='tool4')hint.textContent=B('Salin prompt, tampal dalam ChatGPT atau Claude untuk menjana imej, kemudian muat naik imej itu di langkah 3 Kandungan.','Copy a prompt, paste it into ChatGPT or Claude to generate an image, then upload that image in step 3 Content.')}
 if(!next.hidden)paintNext();
 paintShowcase();
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

/* Welcome page: the three styles, shown with the PoliPD sample websites. Tap one to start in that style. */
const SHOW=[['fun','kerja','Pengurusan kerja','Work hub'],['min','acara','Acara','Event'],['bold','portfolio','Portfolio','Portfolio']];
const showcase=node('section','section v41-styles');showcase.id='styles';
document.querySelector('#welcome .work-section')?.after(showcase);
function paintShowcase(){
 showcase.replaceChildren();
 showcase.append(node('span','eyebrow',B('TIGA GAYA REKA BENTUK','THREE DESIGN STYLES')));
 const h=node('h2','',B('Pilih gaya yang sesuai dengan anda','Pick the style that suits you'));showcase.append(h);
 showcase.append(node('p','v41-styles-lead',B('Contoh laman web daripada galeri Web Wizard PoliPD. Tekan satu contoh untuk mula membina dalam gaya itu.','Sample websites from the Web Wizard PoliPD gallery. Tap one to start building in that style.')));
 const grid=node('div','v41-styles-grid');
 for(const [style,fam,bm,en] of SHOW){
  const b=node('button','v41-style-card');b.type='button';
  const img=node('img');img.src='assets/samples/sample-'+fam+'-'+style+'-sm.webp';img.alt=B('Contoh laman web: ','Sample website: ')+B(bm,en)+', '+styles[style].name;img.loading='lazy';img.width=800;img.height=450;
  b.append(node('span','v41-style-tag',B(bm,en)+' · '+styles[style].name),img,node('span','v41-style-go',B('Guna gaya ini ↗','Use this style ↗')));
  b.onclick=()=>{state.style=style;state.colors={};showStudio();later()};
  grid.append(b);
 }
 showcase.append(grid);
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
 if(!state.heroImg)tips.push(B('Tambah imej hero supaya laman lebih menarik (langkah 3)','Add a hero image to make the site more inviting (step 3)'));
 tips.push(B('Gantikan semua kandungan contoh sebelum terbit','Replace all sample content before publishing'));
 tips.push(B('Uji pada telefon menggunakan butang Telefon di atas','Test on a phone using the Mobile button above'));
 alert((todo.length?B('Perlu dibaiki:','To fix:')+'\n• '+todo.join('\n• ')+'\n\n':B('Semakan asas lulus.','Basic checks passed.')+'\n\n')+B('Cadangan:','Suggestions:')+'\n• '+tips.join('\n• '));
};

/* Standards-compliant ZIP writer (stored entries, no external dependency). Accepts text or bytes. */
const encoder=new TextEncoder();const crcTable=Array.from({length:256},(_,n)=>{let c=n;for(let k=0;k<8;k++)c=c&1?0xedb88320^(c>>>1):c>>>1;return c>>>0});function crc(bytes){let c=0xffffffff;for(const b of bytes)c=crcTable[(c^b)&255]^(c>>>8);return(c^0xffffffff)>>>0}
function zip(files){const chunks=[],directory=[];let offset=0;function u16(a,n){a.push(n&255,(n>>>8)&255)}function u32(a,n){u16(a,n);u16(a,n>>>16)}for(const [name,content] of files){const fn=encoder.encode(name),bytes=content instanceof Uint8Array?content:encoder.encode(content),sum=crc(bytes),local=[];u32(local,0x04034b50);u16(local,20);u16(local,0x0800);u16(local,0);u16(local,0);u16(local,0x21);u32(local,sum);u32(local,bytes.length);u32(local,bytes.length);u16(local,fn.length);u16(local,0);chunks.push(new Uint8Array(local),fn,bytes);const central=[];u32(central,0x02014b50);u16(central,20);u16(central,20);u16(central,0x0800);u16(central,0);u16(central,0);u16(central,0x21);u32(central,sum);u32(central,bytes.length);u32(central,bytes.length);u16(central,fn.length);u16(central,0);u16(central,0);u16(central,0);u16(central,0);u32(central,0);u32(central,offset);directory.push(new Uint8Array(central),fn);offset+=local.length+fn.length+bytes.length}const start=offset;for(const d of directory){chunks.push(d);offset+=d.length}const end=[];u32(end,0x06054b50);u16(end,0);u16(end,0);u16(end,files.length);u16(end,files.length);u32(end,offset-start);u32(end,start);u16(end,0);chunks.push(new Uint8Array(end));return new Blob(chunks,{type:'application/zip'})}
$('v4-zip').onclick=()=>{const site=window.WWSite;download(site.slug()+'.zip',zip(site.files()));setStatus('zip');next.hidden=false;paintNext()};

$('reset-all').onclick=()=>{if(!confirm(B('Tetapkan semula semua? Teks, warna, imej dan bahagian anda akan dipadam.','Reset everything? Your text, colours, image and sections will be cleared.')))return;state.type='agency';state.style='min';state.overrides={};state.colors={};state.device='desktop';state.siteName='';state.heroImg='';sections={};render();notify(B('Reka bentuk ditetapkan semula','Design reset'));later()};

window.WebWizardV4={activate,save,zip,refresh,sections:visibleSections};
gallery();restore();
body.addEventListener('input',later,true);body.addEventListener('change',later,true);body.addEventListener('click',later,true);document.querySelectorAll('[data-device]').forEach(b=>b.addEventListener('click',later));window.addEventListener('beforeunload',save);
})();
