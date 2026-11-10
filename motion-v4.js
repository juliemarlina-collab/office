
(()=>{'use strict';
const labels=[
 ['lms','Teaching & learning site','education-books'],['office','Work management site','home'],
 ['conference','Event','event-trophy'],['portfolio','Portfolio','typography']
];
const track=document.getElementById('v403-marquee-track');
if(track){
 const make=(key,label,icon,duplicate)=>{
  const btn=document.createElement('button');btn.type='button';btn.className='v403-type-card';btn.dataset.website=key;
  if(duplicate)btn.tabIndex=-1;
  const img=document.createElement('img');img.src='assets/icons/'+icon+'.webp';img.alt='';img.loading='lazy';
  img.onerror=()=>{img.src='assets/icons/templates.webp';img.onerror=null};
  const title=document.createElement('b');title.textContent=label;btn.append(img,title);
  btn.addEventListener('click',()=>{
   const gallery=document.querySelector('#model-gallery [data-gallery="'+key+'"]');
   if(gallery)gallery.click();
   else document.querySelector('[data-enter]')?.click();
  });
  return btn;
 };
 for(let repeat=0;repeat<4;repeat++)for(const [key,label,icon] of labels)track.append(make(key,label,icon,repeat>0));
}
const steps=[...document.querySelectorAll('.v403-steps article')],fill=document.querySelector('.v403-progress-fill');
if('IntersectionObserver'in window&&steps.length){
 const observer=new IntersectionObserver(entries=>{
  for(const entry of entries)if(entry.isIntersecting){
   const idx=steps.indexOf(entry.target);entry.target.classList.add('v403-inview');
   if(fill)fill.style.width=((idx+1)/steps.length*100)+'%';
   observer.unobserve(entry.target);
  }
 },{threshold:.3});
 steps.forEach(el=>observer.observe(el));
}else{steps.forEach(el=>el.classList.add('v403-inview'));if(fill)fill.style.width='100%'}
})();
