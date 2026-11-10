/* Web Wizard Studio 3.3.1 — icon integration and visible canvas */
(function(){
const iconMap={agency:'browser',portfolio:'typography',education:'templates',portal:'home',dashboard:'analytics',event:'launch',ecommerce:'download',saas:'cloud-upload',blog:'html',campaign:'palette',game:'javascript',community:'responsive'};
const iconFallback=['browser','typography','templates','home','analytics','launch','download','cloud-upload','html','palette','javascript','responsive'];
const originalGallery=renderGallery;
renderGallery=function(){originalGallery();document.querySelectorAll('.model-card').forEach((card,i)=>{const key=card.dataset.gallery;const art=card.querySelector('.thumb-shape');if(!art)return;const name=iconMap[key]||iconFallback[i%iconFallback.length];art.textContent='';const img=document.createElement('img');img.src='assets/icons/'+name+'.webp';img.alt='';img.loading='lazy';img.className='gallery-3d-icon';art.append(img);});};
const studio=document.getElementById('studio'),controls=document.querySelector('.studio-body .controls');
if(!studio||!controls)return;
const toolbar=document.createElement('div');toolbar.className='workspace-tools';toolbar.innerHTML='<strong>Studio tools</strong><span>Choose your type and style, then preview your website below.</span><button type="button" id="toggle-advanced" aria-expanded="false">Show all settings ▾</button>';
controls.parentNode.insertBefore(toolbar,controls);
const btn=toolbar.querySelector('button');
function expanded(on){studio.classList.toggle('settings-expanded',on);btn.setAttribute('aria-expanded',String(on));btn.textContent=on?'Hide advanced settings ▴':'Show all settings ▾';}
btn.addEventListener('click',()=>expanded(!studio.classList.contains('settings-expanded')));
expanded(false);
const preview=document.querySelector('.preview-stage');if(preview){preview.setAttribute('aria-label','Live website preview canvas');}
renderGallery();
})();
