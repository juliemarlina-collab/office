/* Web Wizard Studio 4.0 — integrated workspace extension */
(function(){'use strict';
const $=id=>document.getElementById(id),studio=$('studio'),body=studio?.querySelector('.studio-body'),controls=body?.querySelector('.controls'),preview=body?.querySelector('.preview-stage');
if(!studio||!body||!controls||!preview)return;
const groups=[...controls.querySelectorAll(':scope > .control-group')],KEY='wws-v4-project',labels=[['layout-template','Type','Jenis','Choose a website category'],['paintbrush','Style','Gaya','Select a visual direction'],['type','Content','Kandungan','Edit headline and buttons'],['palette','Colours','Warna','Set your brand palette'],['settings','More','Lanjutan','Additional settings']];
// Gallery artwork is mapped by the actual website category ID, never by position.
const galleryIcons={
 agency:'browser', portfolio:'typography', lms:'education-books',
 office:'home', dashboard:'analytics', conference:'event-trophy',
 ecommerce:'templates', saas:'cloud-upload', blog:'education-books',
 landing:'campaign-target', games:'achievement-badge', community:'home'
};
// Purpose-specific vector icons for editing actions: consistent, readable and not decorative.
const toolPaths={
  type:'<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
  style:'<path d="M12 3a9 9 0 1 0 9 9c0-1.7-1.2-2.5-2.6-2.5H16a2 2 0 0 1-2-2V5.6A2.6 2.6 0 0 0 12 3Z"/><circle cx="7.5" cy="11" r="1"/><circle cx="11" cy="7.5" r="1"/><circle cx="16.5" cy="13.5" r="1"/><circle cx="10.5" cy="16.5" r="1"/>',
  content:'<path d="M4 6h16M4 12h16M4 18h10"/><path d="M7 3v6"/>',
  colours:'<circle cx="12" cy="12" r="9"/><path d="M12 3v18M3 12h18"/><path d="m5.6 5.6 12.8 12.8"/>',
  more:'<path d="M4 7h16M4 17h16"/><circle cx="9" cy="7" r="2"/><circle cx="16" cy="17" r="2"/>',
  sections:'<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 9v12M13 14h5M13 18h5"/>'
};
function toolSvg(id){return '<svg aria-hidden="true" viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">'+toolPaths[id]+'</svg>'}

function node(tag,cls,text){const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n}
const root=node('section','v4-workspace');root.innerHTML='<div class="v4-intro"><div><strong>Build your website</strong><p>Choose one tool, edit one part at a time. Your canvas stays in view.</p></div><div class="v4-status" id="v4-status" aria-live="polite">Ready</div></div>';
const bar=node('div','v4-toolbar');bar.setAttribute('aria-label','Website editing tools');const panel=node('div','v4-panel');panel.hidden=true;const panelHeader=node('div','v4-panel-header');const panelTitle=node('strong','', '');const close=node('button','v4-close','✕ Close');close.type='button';panelHeader.append(panelTitle,close);const fields=node('div','v4-fields');panel.append(panelHeader,fields);root.append(bar,panel);body.insertBefore(root,preview);
controls.style.display='none';body.querySelector('.workspace-tools')?.remove();
let active=null,sections={},pending=null;const status=$('v4-status');
function getState(){return typeof state==='object'?state:null}
function save(){const s=getState();if(!s)return;try{localStorage.setItem(KEY,JSON.stringify({version:4,type:s.type,style:s.style,overrides:s.overrides,colors:s.colors,device:s.device,lang:s.lang,sections}));status.textContent='✓ Autosaved'}catch(e){status.textContent='Storage unavailable — export project'}}
function later(){clearTimeout(pending);status.textContent='Saving…';pending=setTimeout(save,250)}
function sectionList(){const s=getState();return s&&types[s.type]?types[s.type].sections:[]}
function refresh(){if(typeof renderPreview==='function')renderPreview();later()}
function ensureSections(){const s=getState();if(!s)return;if(!Array.isArray(sections[s.type]))sections[s.type]=sectionList().map((name,i)=>({id:i,title:name,desc:['A purposeful space for your audience.','Explore the details that matter most.','Take the next step with confidence.'][i%3],visible:true}));}
function editor(){ensureSections();const s=getState();if(!s)return;const list=sections[s.type];const wrap=node('div','v4-section-editor');wrap.innerHTML='<div class="v4-section-head"><b>Page sections</b><span>Edit, hide or reorder individual sections</span></div>';
list.forEach((sec,i)=>{const item=node('div','v4-section-item');const head=node('div','v4-section-row');const name=node('strong','',sec.title||'Untitled section');const actions=node('div','v4-section-actions');[['↑','Move up',()=>move(i,-1)],['↓','Move down',()=>move(i,1)],[sec.visible?'◉':'◌',sec.visible?'Hide':'Show',()=>{sec.visible=!sec.visible;drawEditor();refresh()}],['✕','Remove',()=>{list.splice(i,1);drawEditor();refresh()}]].forEach(([glyph,title,fn])=>{const b=node('button','',glyph);b.type='button';b.title=title;b.setAttribute('aria-label',title+' '+sec.title);b.onclick=fn;actions.append(b)});head.append(name,actions);const label=node('label','v4-field-label','Section title');const inp=node('input');inp.value=sec.title;inp.maxLength=100;inp.oninput=()=>{sec.title=inp.value;name.textContent=inp.value||'Untitled section';refresh()};const descLabel=node('label','v4-field-label','Description');const desc=node('textarea');desc.rows=2;desc.maxLength=240;desc.value=sec.desc;desc.oninput=()=>{sec.desc=desc.value;refresh()};item.append(head,label,inp,descLabel,desc);wrap.append(item)});
const add=node('button','v4-add','＋ Add section');add.type='button';add.onclick=()=>{list.push({id:Date.now(),title:'New section',desc:'Describe this section.',visible:true});drawEditor();refresh()};wrap.append(add);return wrap;
function move(i,d){const j=i+d;if(j<0||j>=list.length)return;[list[i],list[j]]=[list[j],list[i]];drawEditor();refresh()}}
function drawEditor(){const old=fields.querySelector('.v4-section-editor');if(old)old.replaceWith(editor())}
const originalTemplate=templateHtml;templateHtml=function(){const result=originalTemplate();const s=getState();if(!s)return result;ensureSections();const list=sections[s.type];const css='\n<style id="v4-generated-style">.v4-custom-sections{padding:55px max(5%,24px);background:var(--surface,#fff);color:var(--text,#111)}.v4-custom-section{max-width:1100px;margin:0 auto 32px;padding:28px;border:1px solid currentColor;border-radius:16px}.v4-custom-section h2{font-size:clamp(24px,3vw,40px);margin:0 0 12px}.v4-custom-section p{line-height:1.7;max-width:70ch}</style>';
const html='<div class="v4-custom-sections" id="v4-sections">'+list.filter(x=>x.visible).map(x=>'<section class="v4-custom-section"><h2>'+escapeHtml(x.title)+'</h2><p>'+escapeHtml(x.desc)+'</p></section>').join('')+'</div>';
result.html=result.html.replace('</head>',css+'</head>');
// Keep footer as the final page element; section editor is part of main content.
if(result.html.includes('</main>'))result.html=result.html.replace('</main>',html+'</main>');
else if(result.html.includes('<footer'))result.html=result.html.replace('<footer',html+'<footer');
else result.html=result.html.replace('</body>',html+'</body>');return result};
const tools=[...labels.map((x,i)=>({id:'tool'+i,label:x[1],hint:x[3],icon:['type','style','content','colours','more'][i],indices:i===4?groups.map((_,j)=>j).filter(j=>j>=4):[i]})),{id:'sections',label:'Sections',hint:'Edit page sections',icon:'sections',indices:[]}];
function activate(id,force=false){active=(!force&&active===id)?null:id;panel.hidden=!active;bar.querySelectorAll('button').forEach(b=>{const selected=b.dataset.tool===active;b.classList.toggle('selected',selected);b.setAttribute('aria-pressed',String(selected))});groups.forEach(g=>controls.append(g));fields.replaceChildren();if(!active)return;const t=tools.find(x=>x.id===active);panelTitle.textContent=t.label+' · '+t.hint;t.indices.forEach(i=>{if(groups[i])fields.append(groups[i])});if(active==='sections')fields.append(editor());}
for(const t of tools){const b=node('button','v4-tool');b.type='button';b.dataset.tool=t.id;b.title=t.hint;b.setAttribute('aria-pressed','false');const glyph=node('span','v4-tool-symbol');glyph.innerHTML=toolSvg(t.icon);b.append(glyph,node('span','',t.label));b.onclick=()=>activate(t.id);bar.append(b)}close.onclick=()=>activate(active);
function gallery(){document.querySelectorAll('#model-gallery .model-card').forEach(card=>{
  const art=card.querySelector('.thumb-shape');if(!art)return;
  const key=card.dataset.gallery,icon=galleryIcons[key];
  if(!icon)return;
  const img=node('img','gallery-3d-icon');img.src='assets/icons/'+icon+'.webp';
  img.alt='';img.loading='lazy';
  img.onerror=()=>{img.remove();art.textContent='✳'};
  art.replaceChildren(img);
})}gallery();const oldGallery=renderGallery;renderGallery=function(){oldGallery();gallery()};
function restore(){try{const raw=localStorage.getItem(KEY);if(!raw)return;const p=JSON.parse(raw),s=getState();if(!s||!p)return;if(p.type in types)s.type=p.type;if(p.style in styles)s.style=p.style;if(p.overrides&&typeof p.overrides==='object')s.overrides=p.overrides;if(p.colors&&typeof p.colors==='object')s.colors=p.colors;if(['desktop','tablet','mobile'].includes(p.device))s.device=p.device;if(p.sections&&typeof p.sections==='object')sections=p.sections;if(['bm','en'].includes(p.lang)){s.lang=p.lang;document.documentElement.lang=p.lang==='bm'?'ms':'en';for(const [key,c] of Object.entries(CATALOG)){types[key].title=tr(c.hero);types[key].desc=tr(c.desc);types[key].cta=tr(c.cta);types[key].sections=c.sections.map(tr);types[key].name=tr(c.bm+'|'+c.en)}document.querySelectorAll('.language-switch button').forEach(b=>b.classList.toggle('active',b.textContent.toLowerCase()===p.lang));}render();status.textContent='✓ Project restored'}catch(e){status.textContent='Unable to restore project'}}restore();
body.addEventListener('input',later,true);body.addEventListener('change',later,true);document.querySelectorAll('[data-device]').forEach(b=>b.addEventListener('click',later));window.addEventListener('beforeunload',save);
const actions=node('div','v4-actions');actions.innerHTML='<button type="button" id="v4-save">Save project</button><button type="button" id="v4-open">Open project</button><button type="button" id="v4-check">Check website</button><button type="button" id="v4-zip" class="v4-primary">Export ZIP ↓</button><input id="v4-file" type="file" accept=".json,application/json" hidden>';root.append(actions);
// Use supplied 3D artwork only where the icon accurately describes the action.
for(const [id,assetName] of [['v4-check','quality-check'],['v4-zip','export-download']]){
 const button=$(id);if(!button)continue;
 const art=node('img','v4-action-art');art.src='assets/icons/'+assetName+'.webp';art.alt='';art.loading='lazy';
 button.prepend(art);
}
function download(filename,blob){const a=document.createElement('a'),url=URL.createObjectURL(blob);a.href=url;a.download=filename;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),2000)}
$('v4-save').onclick=()=>{save();download('web-wizard-project.json',new Blob([localStorage.getItem(KEY)||'{}'],{type:'application/json'}))};$('v4-open').onclick=()=>$('v4-file').click();$('v4-file').onchange=async e=>{const f=e.target.files?.[0];if(!f)return;try{const p=JSON.parse(await f.text());if(!p||p.version!==4||!(p.type in types)||!(p.style in styles))throw Error('Invalid project');const s=getState();s.type=p.type;s.style=p.style;s.overrides=p.overrides||{};s.colors=p.colors||{};s.device=['desktop','tablet','mobile'].includes(p.device)?p.device:'desktop';sections=p.sections||{};if(['bm','en'].includes(p.lang)){s.lang=p.lang;document.documentElement.lang=p.lang==='bm'?'ms':'en';for(const [key,c] of Object.entries(CATALOG)){types[key].title=tr(c.hero);types[key].desc=tr(c.desc);types[key].cta=tr(c.cta);types[key].sections=c.sections.map(tr);types[key].name=tr(c.bm+'|'+c.en)}document.querySelectorAll('.language-switch button').forEach(b=>b.classList.toggle('active',b.textContent.toLowerCase()===p.lang));}render();activate(active,true);save();status.textContent='✓ Project opened'}catch(err){alert('Unable to open this Web Wizard project: '+err.message)}e.target.value=''};
$('reset-all').addEventListener('click',()=>{sections={};setTimeout(()=>{save();if(active==='sections')activate('sections',true)},0)});
$('v4-check').onclick=()=>{const s=getState(),d=data(),issues=[];if(!d.title?.trim())issues.push('Add a website headline');if(!d.desc?.trim())issues.push('Add a short introduction');if(!d.cta?.trim())issues.push('Add primary button text');if(!sections[s.type]?.some(x=>x.visible))issues.push('Show at least one section');alert(issues.length?'Before publishing:\n• '+issues.join('\n• '):'Basic content checks passed. Please also test navigation, images, accessibility and mobile layout manually.')};
// Standards-compliant ZIP writer (stored entries, no external CDN dependency).
const encoder=new TextEncoder();const crcTable=Array.from({length:256},(_,n)=>{let c=n;for(let k=0;k<8;k++)c=c&1?0xedb88320^(c>>>1):c>>>1;return c>>>0});function crc(bytes){let c=0xffffffff;for(const b of bytes)c=crcTable[(c^b)&255]^(c>>>8);return(c^0xffffffff)>>>0}
function zip(files){const chunks=[],directory=[];let offset=0;function u16(a,n){a.push(n&255,(n>>>8)&255)}function u32(a,n){u16(a,n);u16(a,n>>>16)}for(const [name,content] of files){const fn=encoder.encode(name),bytes=encoder.encode(content),sum=crc(bytes),local=[];u32(local,0x04034b50);u16(local,20);u16(local,0x0800);u16(local,0);u16(local,0);u16(local,0);u32(local,sum);u32(local,bytes.length);u32(local,bytes.length);u16(local,fn.length);u16(local,0);chunks.push(new Uint8Array(local),fn,bytes);const central=[];u32(central,0x02014b50);u16(central,20);u16(central,20);u16(central,0x0800);u16(central,0);u16(central,0);u16(central,0);u32(central,sum);u32(central,bytes.length);u32(central,bytes.length);u16(central,fn.length);u16(central,0);u16(central,0);u16(central,0);u16(central,0);u32(central,0);u32(central,offset);directory.push(new Uint8Array(central),fn);offset+=local.length+fn.length+bytes.length}const start=offset;for(const d of directory){chunks.push(d);offset+=d.length}const end=[];u32(end,0x06054b50);u16(end,0);u16(end,0);u16(end,files.length);u16(end,files.length);u32(end,offset-start);u32(end,start);u16(end,0);chunks.push(new Uint8Array(end));return new Blob(chunks,{type:'application/zip'})}
$('v4-zip').onclick=()=>{const result=templateHtml(),html=result.html;const readme='Web Wizard Studio v4 export\n\nOpen index.html in your browser, or upload to GitHub Pages / Netlify.\nThe exported website is self-contained; style and scripts are embedded in index.html.\n';download('web-wizard-website.zip',zip([['index.html',html],['README.txt',readme]]));status.textContent='✓ ZIP prepared'};
// Keep the toolbar visible on small devices, and canvas close to the active panel.
window.WebWizardV4={activate,save,zip,refresh};
})();
