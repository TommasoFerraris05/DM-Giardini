/* DM Giardini — studio di paesaggio concettuale. Three.js locale, licenza MIT. */
import * as THREE from './three.module.js';

const host = document.getElementById('garden-scene');
if (host) initGarden();
function initGarden() {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const compact = matchMedia('(max-width: 760px)').matches || (navigator.hardwareConcurrency || 4) <= 4;
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({alpha:true, antialias:!compact, powerPreference:'low-power'});
  } catch {
    const status=document.querySelector('[data-garden-status]');if(status)status.textContent='Il verde, da vicino';
    const subtitle=document.querySelector('.model-subtitle');if(subtitle)subtitle.textContent='Fotografia originale DM Giardini';
    document.querySelectorAll('.scene-controls button, .garden-timeline input, [data-garden-replay], [data-garden-disable]').forEach(b=>b.disabled=true);
    return;
  }
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(33, 1, .1, 100);
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, compact ? 1.25 : 1.75));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  const canvas = renderer.domElement;
  canvas.tabIndex = 0;
  canvas.setAttribute('role','img');
  canvas.setAttribute('aria-label','Giardino 3D concettuale. Trascina orizzontalmente o usa le frecce per cambiare vista. Home ripristina la visuale.');
  host.append(canvas);
  scene.add(new THREE.HemisphereLight(0xeaf3ff, 0x777155, 2.2));
  const sun = new THREE.DirectionalLight(0xffefd9, 3.2);
  sun.position.set(-5, 11, 5); sun.castShadow = true;
  sun.shadow.mapSize.set(compact?1024:2048,compact?1024:2048);
  Object.assign(sun.shadow.camera,{left:-9,right:9,top:9,bottom:-9,near:.5,far:35});
  sun.shadow.bias=-.00025; sun.shadow.normalBias=.035; sun.shadow.radius=4;
  scene.add(sun);
  const garden = new THREE.Group(); scene.add(garden);
  let seed=1847;
  const rand=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
  const mat=(color,extra={})=>new THREE.MeshStandardMaterial({color,roughness:.93,...extra});
  const stone=mat('#d8d2c4'), edge=mat('#b3ad9e'), soil=mat('#615d43'), timber=mat('#94836a'), metal=mat('#323e35');
  const green=mat('#597d3d'), bark=mat('#7a7057');
  const animated=[];
  function stage(object,delay){animated.push({object,delay});return object;}
  function box(parent,x,y,z,w,h,d,material,cast=true){
    const mesh=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),material);
    mesh.position.set(x,y,z);mesh.castShadow=cast;mesh.receiveShadow=true;parent.add(mesh);return mesh;
  }
  // Tiny procedural lawn texture: no image request and no CDN dependency.
  const textureCanvas=document.createElement('canvas');textureCanvas.width=textureCanvas.height=128;
  const ctx=textureCanvas.getContext('2d');ctx.fillStyle='#6c854c';ctx.fillRect(0,0,128,128);
  for(let i=0;i<6000;i++){ctx.fillStyle=rand()>.5?'#799655':'#607844';ctx.globalAlpha=.22+rand()*.25;ctx.fillRect(rand()*128,rand()*128,1,2);}
  const tex=new THREE.CanvasTexture(textureCanvas);tex.wrapS=tex.wrapT=THREE.RepeatWrapping;tex.repeat.set(6,5);tex.colorSpace=THREE.SRGBColorSpace;
  const lawn=mat('#a7bb87',{map:tex});
  // A floating architectural model with a continuous mineral plinth.
  box(garden,0,-.32,0,10.4,.55,7.9,stone);
  box(garden,0,-.64,0,10.05,.10,7.55,edge);
  box(garden,0,-.015,0,10,.07,7.5,soil);
  const grassGroup=stage(new THREE.Group(),.02);garden.add(grassGroup);
  box(grassGroup,-.25,.025,.25,8.9,.06,6.65,lawn,false);
  // Fine blades catch grazing light. Instancing keeps draw calls low.
  const bladeGeometry=new THREE.BufferGeometry();
  bladeGeometry.setAttribute('position',new THREE.Float32BufferAttribute([-.017,0,0,.017,0,0,.018,.13,.018],3));bladeGeometry.computeVertexNormals();
  const grassMaterial=mat('#779753',{side:THREE.DoubleSide});
  const blades=new THREE.InstancedMesh(bladeGeometry,grassMaterial,compact?4200:11000);
  const dummy=new THREE.Object3D(), color=new THREE.Color();
  for(let i=0;i<blades.count;i++){
    let x=rand()*8.8-4.65,z=rand()*6.5-3;
    // Leave the central route and timber terrace clear.
    if((x>-.85&&x<.9)||(x>1.6&&z<-.8)){x=-3.8+rand()*2;z=-2.9+rand()*5.5;}
    dummy.position.set(x,.062,z);dummy.rotation.set(0,rand()*Math.PI*2,0);dummy.scale.setScalar(.5+rand()*.6);dummy.updateMatrix();blades.setMatrixAt(i,dummy.matrix);
    color.setHSL(.23+rand()*.035,.29+rand()*.12,.29+rand()*.13);blades.setColorAt(i,color);
  }
  blades.receiveShadow=true;grassGroup.add(blades);
  const pathGroup=stage(new THREE.Group(),.12);garden.add(pathGroup);
  for(let i=0;i<8;i++)box(pathGroup,-.1+Math.sin(i*.55)*.25,.1,3.1-i*.81,1.48,.13,.67,stone);
  // Limestone border, recessed beds and restrained contemporary planting.
  box(garden,-4.55,.1,-.25,.14,.24,6.9,edge);
  box(garden,0,.1,-3.47,9.25,.24,.14,edge);
  box(garden,4.54,.1,-.25,.14,.24,6.9,edge);
  box(garden,-3.35,.08,-2.72,2.2,.18,1.2,soil);
  box(garden,-3.4,.08,2.5,2.1,.18,1.0,soil);
  const leafGeo=new THREE.SphereGeometry(1,6,4);
  const leafMat=mat('#638746');
  function leaves(parent, points, size, palette){
    const mesh=new THREE.InstancedMesh(leafGeo,leafMat,points.length);
    points.forEach((p,i)=>{
      dummy.position.set(...p);dummy.rotation.set(rand()*3,rand()*6,rand()*3);
      const s=size*(.65+rand()*.6);dummy.scale.set(s,s*.5,s*.78);dummy.updateMatrix();mesh.setMatrixAt(i,dummy.matrix);
      color.set(palette[i%palette.length]);color.multiplyScalar(.82+rand()*.35);mesh.setColorAt(i,color);
    });mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);return mesh;
  }
  function branch(parent,a,b,r){
    const av=new THREE.Vector3(...a),bv=new THREE.Vector3(...b),dir=bv.clone().sub(av);
    const m=new THREE.Mesh(new THREE.CylinderGeometry(r*.48,r,dir.length(),7),bark);
    m.position.copy(av.add(bv).multiplyScalar(.5));m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),dir.normalize());m.castShadow=true;parent.add(m);
  }
  function tree(x,z,s,delay){
    const g=stage(new THREE.Group(),delay);g.position.set(x,.12,z);garden.add(g);
    branch(g,[0,0,0],[.06,2.1*s,0],.075*s);
    const points=[];
    for(let k=0;k<9;k++){
      const a=k*2.4, r=(.3+rand()*.75)*s;
      const cx=Math.cos(a)*r,cy=(2.1+rand()*.9)*s,cz=Math.sin(a)*r;
      branch(g,[.04,1.25*s,0],[cx,cy,cz],.032*s);
      const n=compact?65:125;
      for(let j=0;j<n;j++){
        const u=rand()*Math.PI*2,v=Math.acos(2*rand()-1),rr=Math.cbrt(rand());
        points.push([cx+Math.cos(u)*Math.sin(v)*rr*.75*s,cy+Math.cos(v)*rr*.66*s,cz+Math.sin(u)*Math.sin(v)*rr*.68*s]);
      }
    }
    leaves(g,points,.12*s,['#456439','#6f864b','#8f9c63','#536e41']);
    return g;
  }
  const trees=[tree(-3.2,-1.8,1.05,.25),tree(3.4,-2.7,.84,.33),tree(-3.7,1.95,.66,.38)];
  const planting=stage(new THREE.Group(),.20);garden.add(planting);
  // Clipped hedging is made of thousands of small leaves, not large low-poly spheres.
  const hedgePoints=[];
  for(let i=0;i<(compact?1700:3300);i++){
    const back=i%3===0;
    hedgePoints.push(back?[-4.3+rand()*8.6,.25+rand()*.85,-3.12+rand()*.38]:[i%2?-4.28:4.28,.22+rand()*.7,-2.9+rand()*5.8]);
  }
  leaves(planting,hedgePoints,.105,['#274d32','#41653b','#547544']);
  const shrubPoints=[];
  for(const [x,z,r] of [[-2.7,2.7,.55],[-4,2.7,.45],[-2.5,-2.7,.55],[3.8,.5,.48],[3.8,2.4,.55]]){
    for(let j=0;j<(compact?95:180);j++){
      const a=rand()*6.28,v=rand(),rr=Math.sqrt(rand())*r;
      shrubPoints.push([x+Math.cos(a)*rr,.16+Math.sqrt(1-rr*rr/(r*r))*.65*v,z+Math.sin(a)*rr]);
    }
  }
  leaves(planting,shrubPoints,.09,['#4b6e42','#76935a','#91a76f']);
  // Ornamental grasses and white flowering perennial borders.
  const flowerPoints=[],tufts=[];
  for(let i=0;i<26;i++){
    const x=i<13?-1.5-rand()*.6:2.5+rand()*1.3,z=i<13?-2.8+rand()*5.5:1.9+rand()*1.0;
    for(let j=0;j<11;j++){
      const a=rand()*6.28, h=.25+rand()*.35;
      tufts.push(x,.1,z,x+Math.cos(a)*.16,h,z+Math.sin(a)*.16);
      if(j%3===0)flowerPoints.push([x+Math.cos(a)*.16,h,z+Math.sin(a)*.16]);
    }
  }
  const tg=new THREE.BufferGeometry();tg.setAttribute('position',new THREE.Float32BufferAttribute(tufts,3));
  planting.add(new THREE.LineSegments(tg,new THREE.LineBasicMaterial({color:'#768058'})));
  leaves(planting,flowerPoints,.06,['#f0edda','#e0daca','#e3e8cd']);
  // Pergola, narrow timber decking, slatted bench and two mineral planters.
  const architecture=stage(new THREE.Group(),.15);garden.add(architecture);
  for(let j=0;j<19;j++)box(architecture,2.58,.12,-1.35+j*.12,2.55,.14,.106,timber);
  for(const x of [1.5,3.72])for(const z of [-1.4,.66])box(architecture,x,1.27,z,.075,2.5,.075,metal);
  box(architecture,2.6,2.56,-1.4,2.6,.12,.1,metal);box(architecture,2.6,2.56,.66,2.6,.12,.1,metal);
  for(let j=0;j<13;j++)box(architecture,1.43+j*.195,2.61,-.37,.058,.08,2.3,timber);
  for(let j=0;j<5;j++)box(architecture,2.65,.48,-.75+j*.09,1.55,.07,.07,timber);
  for(const x of [2.05,3.25])box(architecture,x,.29,-.57,.08,.38,.4,metal);
  for(const z of [1.5,2.7]){
    box(architecture,1.45,.29,z,.47,.55,.47,stone);
    const pts=[];for(let i=0;i<70;i++){const a=rand()*6.28,r=rand()*.25;pts.push([1.45+Math.cos(a)*r,.58+rand()*.42,z+Math.sin(a)*r]);}
    leaves(architecture,pts,.07,['#63784e','#91a26c']);
  }
  // Ground catches soft architectural shadows without hiding the fallback.
  const ground=new THREE.Mesh(new THREE.PlaneGeometry(200,200),new THREE.ShadowMaterial({opacity:.13}));
  ground.rotation.x=-Math.PI/2;ground.position.y=-.71;ground.receiveShadow=true;scene.add(ground);
  const range=document.querySelector('[data-garden-progress]');
  let progress=reduced.matches?1:0, targetProgress=1;
  let theta=.64,targetTheta=.64,phi=.78,targetPhi=.78,visible=true,raf=0,last=0,idleUntil=0;
  let dragging=false,startX=0,startY=0,oldTheta=0,oldPhi=0;
  const status=document.querySelector('[data-garden-status]');
  function applyProgress(){
    animated.forEach(({object,delay})=>{const t=THREE.MathUtils.clamp((progress-delay)/(1-delay),0,1);const e=t*t*(3-2*t);object.scale.y=Math.max(.001,e);object.visible=e>.002;});
    if(range&&document.activeElement!==range)range.value=String(Math.round(progress*100));
    if(status)status.textContent=progress<.08?'Il terreno':progress<.92?'Il giardino prende forma':'Il giardino, da vivere';
  }
  function resize(){if(host.classList.contains('garden-disabled'))return;const w=host.clientWidth,h=host.clientHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();wake();}
  function frame(time){
    raf=0;if(!visible||document.hidden)return;
    const dt=Math.min((time-last)/1000||.016,.05);last=time;
    const ease=reduced.matches?1:1-Math.exp(-dt*6);
    theta+=(targetTheta-theta)*ease;phi+=(targetPhi-phi)*ease;
    progress+=(targetProgress-progress)*(reduced.matches?1:1-Math.exp(-dt*2.3));
    if(Math.abs(progress-targetProgress)<.001)progress=targetProgress;
    applyProgress();
    const radius=camera.aspect<1.2?24:19.8;
    camera.position.set(Math.sin(theta)*Math.cos(phi)*radius,Math.sin(phi)*radius,Math.cos(theta)*Math.cos(phi)*radius);
    camera.lookAt(0,.62,0);
    if(!reduced.matches&&time<idleUntil)trees.forEach((t,i)=>t.rotation.z=Math.sin(time*.001+i)*.006);
    renderer.render(scene,camera);
    if(Math.abs(progress-targetProgress)>.001||Math.abs(theta-targetTheta)>.0001||Math.abs(phi-targetPhi)>.0001||time<idleUntil)raf=requestAnimationFrame(frame);
  }
  function wake(){if(visible&&!document.hidden&&!raf){last=performance.now();raf=requestAnimationFrame(frame);}}
  function reset(){targetTheta=.64;targetPhi=.78;wake();}
  canvas.addEventListener('pointerdown',e=>{if(e.button!==0)return;dragging=true;startX=e.clientX;startY=e.clientY;oldTheta=targetTheta;oldPhi=targetPhi;canvas.setPointerCapture(e.pointerId);});
  canvas.addEventListener('pointermove',e=>{
    if(dragging){targetTheta=THREE.MathUtils.clamp(oldTheta-(e.clientX-startX)*.006,-.65,1.6);if(e.pointerType!=='touch')targetPhi=THREE.MathUtils.clamp(oldPhi+(e.clientY-startY)*.004,.5,1.1);}
    else if(e.pointerType==='mouse'&&!reduced.matches){const r=canvas.getBoundingClientRect();targetTheta=.64+(e.clientX-r.left-r.width/2)/r.width*.13;}
    wake();
  });
  canvas.addEventListener('pointerup',()=>dragging=false);canvas.addEventListener('pointercancel',()=>dragging=false);
  canvas.addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home'].includes(e.key)){e.preventDefault();if(e.key==='Home')reset();else if(e.key==='ArrowLeft')targetTheta-=.12;else if(e.key==='ArrowRight')targetTheta+=.12;else targetPhi+=e.key==='ArrowUp'?.07:-.07;targetTheta=THREE.MathUtils.clamp(targetTheta,-.65,1.6);targetPhi=THREE.MathUtils.clamp(targetPhi,.5,1.1);wake();}});
  document.querySelectorAll('[data-garden-rotate]').forEach(b=>b.addEventListener('click',()=>{targetTheta=THREE.MathUtils.clamp(targetTheta+Number(b.dataset.gardenRotate)*.25,-.65,1.6);wake();}));
  document.querySelector('[data-garden-reset]')?.addEventListener('click',reset);
  range?.addEventListener('input',()=>{targetProgress=Number(range.value)/100;progress=targetProgress;wake();});
  document.querySelector('[data-garden-replay]')?.addEventListener('click',()=>{progress=reduced.matches?1:0;targetProgress=1;idleUntil=reduced.matches?0:performance.now()+6000;wake();});
  document.querySelector('[data-garden-disable]')?.addEventListener('click',()=>{
    visible=false;cancelAnimationFrame(raf);raf=0;host.classList.remove('webgl-active');host.classList.add('garden-disabled');renderer.dispose();
    document.querySelectorAll('.scene-controls button, .garden-timeline input, [data-garden-replay], [data-garden-disable]').forEach(b=>b.disabled=true);
    if(status)status.textContent='Il verde, da vicino';
    document.querySelector('.model-subtitle').textContent='Fotografia originale DM Giardini';
  });
  new ResizeObserver(resize).observe(host);
  new IntersectionObserver(entries=>{if(host.classList.contains('garden-disabled'))return;visible=entries[0].isIntersecting;if(!visible){cancelAnimationFrame(raf);raf=0;}else wake();},{rootMargin:'40px'}).observe(host);
  document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(raf);raf=0;}else wake();});
  reduced.addEventListener('change',()=>{if(reduced.matches){progress=targetProgress;idleUntil=0;}wake();});
  canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();visible=false;cancelAnimationFrame(raf);raf=0;host.classList.remove('webgl-active');if(status)status.textContent='Il verde, da vicino';document.querySelector('.model-subtitle').textContent='Fotografia originale DM Giardini';});
  canvas.addEventListener('webglcontextrestored',()=>{if(!host.classList.contains('garden-disabled')){host.classList.add('webgl-active');document.querySelector('.model-subtitle').textContent='Visualizzazione concettuale · non un lavoro reale';visible=true;wake();}});
  host.classList.add('webgl-active');idleUntil=reduced.matches?0:performance.now()+6500;resize();
}
