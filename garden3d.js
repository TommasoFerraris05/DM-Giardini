/**
 * DM Giardini — piccolo giardino 3D realmente renderizzato con WebGL.
 * Nessuna libreria remota o dipendenza runtime: una scena 3D low-poly creata
 * geometricamente (prato, alberi, siepi, aiuole, percorso, fioriture).
 * Mouse/touch: orbit; bottoni: rotazione/reset. Fallback fotografico senza WebGL.
 */
(()=>{
 const holder=document.getElementById('garden-scene');if(!holder)return;
 const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 const canvas=document.createElement('canvas');canvas.tabIndex=0;canvas.setAttribute('role','img');canvas.setAttribute('aria-label','Modello tridimensionale di giardino. Trascina per ruotare; usa i pulsanti accanto per cambiare vista.');
 let gl;try{gl=canvas.getContext('webgl',{alpha:true,antialias:true,powerPreference:'low-power'});}catch(_e){return;}
 if(!gl)return;
 const vs=`attribute vec3 aPos;attribute vec3 aNormal;attribute vec3 aColor;uniform mat4 uVP;varying vec3 vColor;varying float vShade;varying float vDepth;void main(){vec3 lightDir=normalize(vec3(-0.42,0.85,0.65));float dif=max(dot(normalize(aNormal),lightDir),0.0);vShade=0.63+dif*0.43;vColor=aColor;gl_Position=uVP*vec4(aPos,1.0);vDepth=gl_Position.z/gl_Position.w;}`;
 const fs=`precision mediump float;varying vec3 vColor;varying float vShade;varying float vDepth;void main(){vec3 col=vColor*vShade;vec3 fog=vec3(0.89,0.94,0.87);float f=clamp((vDepth-0.92)*0.65,0.,0.11);gl_FragColor=vec4(mix(col,fog,f),1.0);}`;
 function shader(type,src){const sh=gl.createShader(type);gl.shaderSource(sh,src);gl.compileShader(sh);if(!gl.getShaderParameter(sh,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(sh));return sh;}
 let program;try{program=gl.createProgram();gl.attachShader(program,shader(gl.VERTEX_SHADER,vs));gl.attachShader(program,shader(gl.FRAGMENT_SHADER,fs));gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(program));}catch(_e){return;}
 const pos=[],normal=[],colors=[];const hex=h=>[parseInt(h.slice(1,3),16)/255,parseInt(h.slice(3,5),16)/255,parseInt(h.slice(5,7),16)/255];
 const C={grass:hex('#78A76A'),grass2:hex('#6D9B61'),grass3:hex('#82B373'),soil:hex('#6E8466'),stone:hex('#D8DDD0'),stone2:hex('#CCD4C5'),stoneSide:hex('#B8C4B5'),dark:hex('#244F39'),hedge:hex('#356A48'),leaf:hex('#3E7E4C'),leaf2:hex('#5B9B5C'),leaf3:hex('#76B56A'),leaf4:hex('#9BC88A'),trunk:hex('#698069'),flowers:hex('#F9F9F1'),shadow:hex('#6C9863')};
 function tri(a,b,c,color){const ux=b[0]-a[0],uy=b[1]-a[1],uz=b[2]-a[2],vx=c[0]-a[0],vy=c[1]-a[1],vz=c[2]-a[2];let nx=uy*vz-uz*vy,ny=uz*vx-ux*vz,nz=ux*vy-uy*vx;let l=Math.hypot(nx,ny,nz)||1;nx/=l;ny/=l;nz/=l;for(const p of [a,b,c]){pos.push(...p);normal.push(nx,ny,nz);colors.push(...color);}}
 function quad(a,b,c,d,col){tri(a,b,c,col);tri(a,c,d,col);}
 function box(x,y,z,w,h,d,col,rot=0){let cx=Math.cos(rot),sx=Math.sin(rot);const p=(xx,yy,zz)=>[x+xx*cx+zz*sx,y+yy,z-xx*sx+zz*cx];const X=w/2,Y=h/2,Z=d/2;let v=[p(-X,-Y,-Z),p(X,-Y,-Z),p(X,Y,-Z),p(-X,Y,-Z),p(-X,-Y,Z),p(X,-Y,Z),p(X,Y,Z),p(-X,Y,Z)];quad(v[3],v[2],v[6],v[7],col);quad(v[4],v[5],v[1],v[0],col);quad(v[0],v[1],v[2],v[3],col);quad(v[5],v[4],v[7],v[6],col);quad(v[4],v[0],v[3],v[7],col);quad(v[1],v[5],v[6],v[2],col);}
 function cylinder(x,y,z,r,h,col,sides=9){let yy=y+h/2;for(let i=0;i<sides;i++){let a=i/sides*Math.PI*2,b=(i+1)/sides*Math.PI*2;const p=(rad,an,hy)=>[x+Math.cos(an)*rad,hy,z+Math.sin(an)*rad];quad(p(r,a,yy-h/2),p(r,b,yy-h/2),p(r,b,yy+h/2),p(r,a,yy+h/2),col);tri([x,yy+h/2,z],p(r,a,yy+h/2),p(r,b,yy+h/2),col);}}
 function sphere(x,y,z,r,col,seg=9,rings=6,sy=1){for(let j=0;j<rings;j++){const a=Math.PI*j/rings,b=Math.PI*(j+1)/rings;for(let i=0;i<seg;i++){const c=Math.PI*2*i/seg,d=Math.PI*2*(i+1)/seg;const v=(theta,phi)=>[x+r*Math.sin(theta)*Math.cos(phi),y+r*sy*Math.cos(theta),z+r*Math.sin(theta)*Math.sin(phi)];quad(v(a,c),v(b,c),v(b,d),v(a,d),col);}}}
 function cone(x,y,z,r,h,col,sides=8){const tip=[x,y+h,z];for(let i=0;i<sides;i++){let a=i*2*Math.PI/sides,b=(i+1)*2*Math.PI/sides;tri([x+r*Math.cos(a),y,z+r*Math.sin(a)],[x+r*Math.cos(b),y,z+r*Math.sin(b)],tip,col);}}
 function shrub(x,z,s=.45,color=C.leaf){sphere(x,.35*s,z,s,color,8,5,.74);}
 function tree(x,z,scale=1,variation=0){cylinder(x,0,z,.13*scale,1.75*scale,C.trunk,9);sphere(x,2.2*scale,z,.9*scale,C.leaf2,10,7,.78);sphere(x-.35*scale,2.1*scale,z+.26*scale,.62*scale,variation?C.leaf3:C.leaf,9,6,.83);sphere(x+.31*scale,2.37*scale,z-.19*scale,.65*scale,C.leaf3,9,6,.92);sphere(x,2.75*scale,z,.53*scale,C.leaf4,9,6,.75);}
 // Elevated garden display base, with framed lawn and planting borders.
 box(0,-.35,0,10.9,.7,7.1,C.stoneSide);box(0,.025,0,10.76,.09,6.96,C.grass);
 box(0,-.68,0,11.15,.09,7.35,C.stone);box(-5.3,.03,0,.11,.15,7,C.stone);box(5.3,.03,0,.11,.15,7,C.stone);
 // Mowing stripes and softer lawn strips.
 for(let i=0;i<7;i++)box(-4.65+i*1.5,.077,1.47,1.38,.006,1.67,i%2?C.grass2:C.grass3);
 // Garden path, diagonal pavers.
 for(let i=0;i<10;i++){const t=i/9;const z=3.1-t*6.1;const x=-.4+.65*Math.sin(t*2.5);box(x,.12,z,1.25,.15,.43,i%2?C.stone:C.stone2,.16*Math.sin(t*3));}
 // Raised planting areas and natural borders.
 box(-3.75,.17,-2.33,2.5,.22,1.55,C.soil);box(3.78,.15,-2.5,2.22,.22,1.15,C.soil);box(-3.7,.15,2.45,2.4,.23,1.15,C.soil);
 for(let i=0;i<12;i++){const z=-3.05+i*.55;shrub(-4.95,z,.27+i%3*.05,i%2?C.hedge:C.leaf);shrub(4.92,z,.3+(i%3)*.06,i%2?C.hedge:C.leaf);}
 for(let i=0;i<16;i++){let x=-4.6+i*.6;shrub(x,-3.06,.26+(i%3)*.06,i%2?C.leaf:C.hedge);}
 // Canopy trees balance the scene; all are actual geometry.
 tree(-3.95,-1.35,.85,0);tree(3.68,-1.65,.78,1);tree(3.7,2.15,.72,0);tree(-3.55,2.05,.58,1);
 // Bulbs, low shrubs and ornamental grasses around path edges.
 for(let i=0;i<24;i++){const a=i*2.39996;const rr=.35+(.17*i%1)*1.3;const x=-3.7+rr*Math.cos(a),z=-2.3+rr*Math.sin(a)*.62;shrub(x,z,.16+(i%5)*.035,[C.leaf4,C.leaf3,C.leaf2,C.leaf][i%4]);}
 for(let i=0;i<15;i++){const a=i*2.3;const x=3.72+Math.cos(a)*.86,z=-2.45+Math.sin(a)*.36;shrub(x,z,.17+(i%4)*.045,i%3?C.leaf4:C.leaf2);}
 for(let i=0;i<10;i++){const x=-4.5+i*.21;cone(x,.11,2.45+Math.sin(i*2)*.3,.19,.66+(i%3)*.19,i%2?C.leaf3:C.leaf4);}
 for(let i=0;i<10;i++){const x=1.6+i*.28;const z=2.45+Math.cos(i*2)*.31;shrub(x,z,.22+(i%3)*.04,i%2?C.leaf2:C.leaf3);}
 for(let i=0;i<22;i++){const x=2.15+Math.sin(i*7.7)*1.3,z=-.7+Math.cos(i*4.9)*.85; if(Math.abs(x)<.45)continue; cylinder(x,.11,z,.016,.19,C.leaf,5);sphere(x,.33,z,.065,i%3?C.flowers:C.leaf4,6,4);}
 // Small landscape bench on lawn, wood-toned stone.
 box(2.12,.32,.98,1.25,.12,.42,C.stone);box(1.63,.17,.98,.1,.30,.13,C.stoneSide);box(2.62,.17,.98,.1,.30,.13,C.stoneSide);
 function buffer(data,attr){const b=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(data),gl.STATIC_DRAW);const loc=gl.getAttribLocation(program,attr);gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,3,gl.FLOAT,false,0,0);}
 gl.useProgram(program);buffer(pos,'aPos');buffer(normal,'aNormal');buffer(colors,'aColor');gl.enable(gl.DEPTH_TEST);gl.disable(gl.CULL_FACE);gl.clearColor(0,0,0,0);
 const uVP=gl.getUniformLocation(program,'uVP');const rad=Math.PI/180;
 const perspective=(fov,asp,n,f)=>{let t=1/Math.tan(fov/2);return [t/asp,0,0,0,0,t,0,0,0,0,(f+n)/(n-f),-1,0,0,2*f*n/(n-f),0];};
 const lookAt=(e,c)=>{let z=[e[0]-c[0],e[1]-c[1],e[2]-c[2]];let l=Math.hypot(...z);z=z.map(v=>v/l);let x=[z[2],0,-z[0]];l=Math.hypot(...x);x=x.map(v=>v/l);const y=[z[1]*x[2]-z[2]*x[1],z[2]*x[0]-z[0]*x[2],z[0]*x[1]-z[1]*x[0]];return [x[0],y[0],z[0],0,x[1],y[1],z[1],0,x[2],y[2],z[2],0,-x.reduce((s,v,i)=>s+v*e[i],0),-y.reduce((s,v,i)=>s+v*e[i],0),-z.reduce((s,v,i)=>s+v*e[i],0),1];};
 const mul=(a,b)=>{let out=Array(16).fill(0);for(let r=0;r<4;r++)for(let c=0;c<4;c++)for(let k=0;k<4;k++)out[c*4+r]+=a[k*4+r]*b[c*4+k];return out;};
 let theta=43*rad,phi=40*rad,active=false,visible=true,raf=0,drag=false,lastX=0,lastY=0;const reset=()=>{theta=43*rad;phi=40*rad;render();};
 function resize(){const bounds=holder.getBoundingClientRect();const dpr=Math.min(window.devicePixelRatio||1,1.5);let w=Math.max(280,Math.round(bounds.width*dpr)),h=Math.max(250,Math.round(bounds.height*dpr));if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;gl.viewport(0,0,w,h);}return w/h;}
 function render(){if(!visible)return;const asp=resize();gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);const radius=16.8;let eye=[Math.sin(theta)*Math.cos(phi)*radius,Math.sin(phi)*radius,Math.cos(theta)*Math.cos(phi)*radius];const vp=mul(perspective(42*rad,asp,.1,100),lookAt(eye,[0,.35,0]));gl.uniformMatrix4fv(uVP,false,new Float32Array(vp));gl.drawArrays(gl.TRIANGLES,0,pos.length/3);}
 const ob=new IntersectionObserver(e=>{visible=e[0]?.isIntersecting||false;if(visible)render();},{threshold:.05});ob.observe(holder);
 holder.appendChild(canvas);holder.classList.add('webgl-active');
 const down=e=>{drag=true;lastX=e.clientX;lastY=e.clientY;canvas.setPointerCapture(e.pointerId);};
 const move=e=>{if(!drag)return;theta-=(e.clientX-lastX)*.008;phi=Math.max(.25,Math.min(1.13,phi+(e.clientY-lastY)*.006));lastX=e.clientX;lastY=e.clientY;render();};
 canvas.addEventListener('pointerdown',down);canvas.addEventListener('pointermove',move);canvas.addEventListener('pointerup',()=>drag=false);canvas.addEventListener('pointercancel',()=>drag=false);
 canvas.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){theta+=(e.key==='ArrowLeft'?.1:-.1);render();e.preventDefault();}if(e.key==='Home'){reset();e.preventDefault();}});
 document.querySelectorAll('[data-garden-rotate]').forEach(btn=>btn.addEventListener('click',()=>{theta+=Number(btn.dataset.gardenRotate)*.35;render();}));document.querySelector('[data-garden-reset]')?.addEventListener('click',reset);
 window.addEventListener('resize',render,{passive:true});canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();holder.classList.remove('webgl-active');});
 // No background RAF / auto animation: visible model is interactive, not power hungry.
 render();
})();
