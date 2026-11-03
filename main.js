(()=>{
  const btn=document.querySelector('.menu-toggle');const nav=document.querySelector('.site-nav');
  if(btn&&nav){const close=()=>{nav.classList.remove('is-open');btn.setAttribute('aria-expanded','false');btn.setAttribute('aria-label','Apri menu');};btn.addEventListener('click',()=>{const open=!nav.classList.contains('is-open');nav.classList.toggle('is-open',open);btn.setAttribute('aria-expanded',String(open));btn.setAttribute('aria-label',open?'Chiudi menu':'Apri menu');});nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',close));document.addEventListener('keydown',e=>{if(e.key==='Escape')close();});}
  document.querySelectorAll('[data-year]').forEach(el=>el.textContent=new Date().getFullYear());
  document.documentElement.classList.add('js-ready');
  const reveals=[...document.querySelectorAll('.reveal')];
  if('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion:reduce)').matches){
    const ob=new IntersectionObserver(entries=>entries.forEach(en=>{if(en.isIntersecting){en.target.classList.add('is-visible');ob.unobserve(en.target);}}),{threshold:.08,rootMargin:'0px 0px -24px 0px'});reveals.forEach(el=>ob.observe(el));
  }else reveals.forEach(el=>el.classList.add('is-visible'));
  document.querySelectorAll('[data-comparison]').forEach(el=>{const input=el.querySelector('input[type=range]');if(input){const update=()=>el.style.setProperty('--position',input.value+'%');input.addEventListener('input',update);update();}});
  const filters=[...document.querySelectorAll('[data-filter]')];
  filters.forEach(button=>button.addEventListener('click',()=>{const val=button.dataset.filter;filters.forEach(el=>{const active=el===button;el.classList.toggle('active',active);el.setAttribute('aria-pressed',String(active));});document.querySelectorAll('[data-filter-item]').forEach(item=>{item.hidden=val!=='all'&&item.dataset.filterItem!==val;});}));
  const dialog=document.getElementById('gallery-lightbox');
  if(dialog){
    const all=[...document.querySelectorAll('[data-lightbox]')];let current=0,opener=null,sequence=all;
    const nav=document.createElement('div');nav.className='lightbox-nav';
    nav.innerHTML='<button type="button" aria-label="Fotografia precedente">← Precedente</button><span aria-live="polite"></span><button type="button" aria-label="Fotografia successiva">Successiva →</button>';
    dialog.append(nav);
    const picture=dialog.querySelector('img');
    const show=index=>{current=(index+sequence.length)%sequence.length;const button=sequence[current];picture.src=button.dataset.lightbox;picture.alt=button.dataset.alt||'Fotografia ingrandita';dialog.querySelector('p').textContent=picture.alt;nav.querySelector('span').textContent=`${current+1} / ${sequence.length}`;};
    nav.querySelectorAll('button')[0].addEventListener('click',()=>show(current-1));
    nav.querySelectorAll('button')[1].addEventListener('click',()=>show(current+1));
    dialog.querySelector('.lightbox-close')?.addEventListener('click',()=>dialog.close());
    dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close();});
    dialog.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();show(current+(e.key==='ArrowLeft'?-1:1));}});
    dialog.addEventListener('close',()=>{document.body.style.overflow='';opener?.focus();});
    all.forEach(button=>button.addEventListener('click',()=>{opener=button;sequence=all.filter(b=>!b.closest('[data-filter-item]')?.hidden);show(sequence.indexOf(button));if(typeof dialog.showModal==='function'){dialog.showModal();document.body.style.overflow='hidden';}}));
  }
  // Small photographic parallax; a single scheduled frame and visible elements only.
  const motion=matchMedia('(prefers-reduced-motion:reduce)');
  const photos=[...document.querySelectorAll('.intro-photo-main img,.approach-image img')];
  let scheduled=false;
  function parallax(){scheduled=false;photos.forEach(img=>{if(motion.matches||innerWidth<851){img.style.transform='';return;}const rect=img.parentElement.getBoundingClientRect();if(rect.bottom>0&&rect.top<innerHeight){const y=Math.max(-15,Math.min(15,(innerHeight/2-rect.top-rect.height/2)*.035));img.style.transform=`scale(1.07) translateY(${y}px)`;}});}
  addEventListener('scroll',()=>{if(!scheduled&&!motion.matches){scheduled=true;requestAnimationFrame(parallax);}},{passive:true});
  motion.addEventListener('change',parallax);
  document.querySelectorAll('video').forEach(video=>{new IntersectionObserver(entries=>{if(!entries[0].isIntersecting)video.pause();}).observe(video);});
})();
