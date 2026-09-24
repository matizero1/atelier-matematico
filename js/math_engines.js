// ═══════════════════════════════════════════════════════════════════
// ATELIER MATEMÁTICO — 24 MOTORES MATEMÁTICOS EN SILICIO NATIVO
// Compartido entre la Vitrina de Enmarcado 3D y la Mesa de Trazado
// ═══════════════════════════════════════════════════════════════════

(function(root) {
  let canvas = null;
  let ctx = null;
  let W = 1024, H = 1448;
  let currentPal = 0;
  let mouseX = -9999, mouseY = -9999, mouseDown = false;
  let isDrag = false, dragX = 0, dragY = 0;

  // Inyección de los 24 motores numéricos
// ── Utilidades de color ──────────────────────────────────────────
function hsl2rgb(h, s, l) {
  h /= 360; s /= 100; l /= 100;
  let r, g, b;
  if (!s) { r = g = b = l; }
  else {
    const q = l < .5 ? l*(1+s) : l+s-l*s, p = 2*l-q;
    const hue = (p, q, t) => {
      if(t<0)t+=1; if(t>1)t-=1;
      if(t<1/6)return p+(q-p)*6*t;
      if(t<1/2)return q;
      if(t<2/3)return p+(q-p)*(2/3-t)*6;
      return p;
    };
    r=hue(p,q,h+1/3); g=hue(p,q,h); b=hue(p,q,h-1/3);
  }
  return [r*255|0, g*255|0, b*255|0];
}

const PALS_RGB = [
  f => hsl2rgb(250-f*210, 90, 45+f*35),
  f => [f*40|0, 120+f*135|0, Math.max(0,200-f*50)|0],
  f => [Math.min(255,60+f*220)|0, Math.min(255,f>.6?(f-.6)*450:20)|0, f<.3?180:20],
  f => [220+f*35|0, 180+f*70|0, 120+f*135|0],
];
const PALS_CSS = [
  f => `hsla(${250-f*210},90%,${45+f*35}%,${.08+f*.7})`,
  f => `rgba(${f*40|0},${120+f*135|0},${Math.max(0,200-f*50)|0},${.08+f*.7})`,
  f => `rgba(${Math.min(255,60+f*220)|0},${Math.min(255,f>.6?(f-.6)*450:20)|0},${f<.3?180:20},${.08+f*.75})`,
  f => `rgba(${220+f*35|0},${180+f*70|0},${120+f*135|0},${.08+f*.65})`,
];

function resize() {
  const r = canvas.parentElement.getBoundingClientRect();
  W = canvas.width  = r.width  | 0;
  H = canvas.height = (r.height - 8) | 0;
}

// ═══════════════════════════════════════════════════════════════════
// MOTORES 01 A 20 (LOS EXISTENTES OPTIMIZADOS)
// ═══════════════════════════════════════════════════════════════════

// 01 Lorenz
let lTrajs=[], lRotZ=.5, lRotX=.3;
function init01(){
  lTrajs=[];
  for(let i=0;i<12;i++){
    let x=.1+i*.04,y=i*.02,z=14+i*.03;
    for(let k=0;k<400;k++){x+=.005*(10*(y-x));y+=.005*(x*(28-z)-y);z+=.005*(x*y-2.667*z);}
    lTrajs.push({x,y,z,pts:[],max:700});
  }
}
function step01(){
  ctx.fillStyle='rgba(4,2,12,.035)'; ctx.fillRect(0,0,W,H);
  lRotZ+=.0008; const sc=Math.min(W,H)*.015;
  for(const tr of lTrajs){
    for(let s=0;s<6;s++){
      const dt=.004, f=(x,y,z)=>[10*(y-x),x*(28-z)-y,x*y-2.667*z];
      const [k1x,k1y,k1z]=f(tr.x,tr.y,tr.z);
      const [k2x,k2y,k2z]=f(tr.x+dt/2*k1x,tr.y+dt/2*k1y,tr.z+dt/2*k1z);
      const [k3x,k3y,k3z]=f(tr.x+dt/2*k2x,tr.y+dt/2*k2y,tr.z+dt/2*k2z);
      const [k4x,k4y,k4z]=f(tr.x+dt*k3x,tr.y+dt*k3y,tr.z+dt*k3z);
      tr.x+=dt/6*(k1x+2*k2x+2*k3x+k4x); tr.y+=dt/6*(k1y+2*k2y+2*k3y+k4y); tr.z+=dt/6*(k1z+2*k2z+2*k3z+k4z);
      const cz=tr.z-25, rx=tr.x*Math.cos(lRotZ)-tr.y*Math.sin(lRotZ);
      const ry=tr.x*Math.sin(lRotZ)+tr.y*Math.cos(lRotZ);
      const rz=ry*Math.sin(lRotX)+cz*Math.cos(lRotX);
      tr.pts.push([W/2+rx*sc, H/2-rz*sc]); if(tr.pts.length>tr.max)tr.pts.shift();
    }
    const n=tr.pts.length; if(n<2)continue;
    for(let j=1;j<n;j++){
      const f=j/n; ctx.strokeStyle=PALS_CSS[currentPal](f); ctx.lineWidth=.5+f*1.5;
      ctx.beginPath(); ctx.moveTo(tr.pts[j-1][0],tr.pts[j-1][1]); ctx.lineTo(tr.pts[j][0],tr.pts[j][1]); ctx.stroke();
    }
  }
}

// 02 Von Mises
let vmPts=[],vmSpr=[]; const VMC=36,VMR=24;
function init02(){
  vmPts=[]; vmSpr=[];
  const dx=W/(VMC-1), dy=H/(VMR-1);
  for(let r=0;r<VMR;r++)for(let c=0;c<VMC;c++)
    vmPts.push({x:c*dx,y:r*dy,ox:c*dx,oy:r*dy,vx:0,vy:0,s:0,fx:(r===0||r===VMR-1||c===0||c===VMC-1)});
  const add=(i,j)=>vmSpr.push({a:i,b:j,rest:Math.hypot(vmPts[i].ox-vmPts[j].ox,vmPts[i].oy-vmPts[j].oy)});
  for(let r=0;r<VMR;r++)for(let c=0;c<VMC;c++){
    const i=r*VMC+c;
    if(c<VMC-1)add(i,i+1); if(r<VMR-1)add(i,i+VMC); if(c<VMC-1&&r<VMR-1)add(i,i+VMC+1);
  }
}
function step02(){
  ctx.fillStyle='rgba(4,2,12,.2)'; ctx.fillRect(0,0,W,H);
  for(const s of vmSpr){
    const pa=vmPts[s.a],pb=vmPts[s.b],dx=pb.x-pa.x,dy=pb.y-pa.y;
    const d=Math.hypot(dx,dy)||.001, f=.2*(d-s.rest)/d;
    if(!pa.fx){pa.vx+=f*dx;pa.vy+=f*dy;} if(!pb.fx){pb.vx-=f*dx;pb.vy-=f*dy;}
  }
  if(mouseDown)for(const p of vmPts){
    if(p.fx)continue; const dx=p.x-mouseX,dy=p.y-mouseY,d2=dx*dx+dy*dy;
    if(d2<120*120&&d2>1){const d=Math.sqrt(d2),f=.45*(120-d)/d; p.vx+=f*dx;p.vy+=f*dy;}
  }
  let ms=.01;
  for(let r=1;r<VMR-1;r++)for(let c=1;c<VMC-1;c++){
    const i=r*VMC+c,p=vmPts[i]; p.vx*=.88;p.vy*=.88;p.x+=p.vx;p.y+=p.vy;
    const exx=(vmPts[i+1].x-vmPts[i-1].x)*.1, eyy=(vmPts[i+VMC].y-vmPts[i-VMC].y)*.1;
    const exy=(vmPts[i+1].y-vmPts[i-1].y+vmPts[i+VMC].x-vmPts[i-VMC].x)*.05;
    p.s=Math.sqrt(Math.max(0,exx*exx-exx*eyy+eyy*eyy+3*exy*exy)); if(p.s>ms)ms=p.s;
  }
  for(const s of vmSpr){
    const pa=vmPts[s.a],pb=vmPts[s.b],st=(pa.s+pb.s)*.5,f=Math.min(1,st/ms);
    ctx.strokeStyle=PALS_CSS[currentPal](f); ctx.lineWidth=.6+f*1.6;
    ctx.beginPath(); ctx.moveTo(pa.x,pa.y); ctx.lineTo(pb.x,pb.y); ctx.stroke();
  }
}

// 03 Yoshida
let yTrails=[];
function init03(){
  yTrails=[]; const L=Math.min(W,H)*.22;
  for(let i=0;i<16;i++) yTrails.push({th1:Math.PI*(.4+i*.03),th2:Math.PI*(.8+i*.02),w1:0,w2:0,pts:[],max:550,cx:W/2,cy:H*.42,L});
}
function step03(){
  ctx.fillStyle='rgba(4,2,12,.03)'; ctx.fillRect(0,0,W,H);
  const c1=.6756,c0=-.1756,d1=1.3512,d0=-1.7024,g=9.8,dt=.03;
  for(const tr of yTrails){
    for(let s=0;s<5;s++)for(const [c,d] of [[c1,d1],[c0,d0],[c1,d1]]){
      tr.th1+=c*dt*tr.w1; tr.th2+=c*dt*tr.w2;
      const dth=tr.th1-tr.th2, den=2-Math.cos(2*dth);
      const dw1=(-g*(2*Math.sin(tr.th1)-Math.cos(dth)*Math.sin(tr.th2))-Math.sin(dth)*(tr.w2*tr.w2+tr.w1*tr.w1*Math.cos(dth)))/den;
      const dw2=(g*(2*Math.cos(dth)*Math.sin(tr.th1)-2*Math.sin(tr.th2))+Math.sin(dth)*(2*tr.w1*tr.w1+tr.w2*tr.w2*Math.cos(dth)))/den;
      tr.w1+=d*dt*dw1; tr.w2+=d*dt*dw2;
    }
    const x1=tr.cx+tr.L*Math.sin(tr.th1),y1=tr.cy+tr.L*Math.cos(tr.th1);
    tr.pts.push([x1+tr.L*Math.sin(tr.th2),y1+tr.L*Math.cos(tr.th2)]); if(tr.pts.length>tr.max)tr.pts.shift();
    const n=tr.pts.length; if(n<2)continue;
    for(let j=1;j<n;j++){
      const f=j/n; ctx.strokeStyle=PALS_CSS[currentPal](f); ctx.lineWidth=.5+f*1.4;
      ctx.beginPath(); ctx.moveTo(tr.pts[j-1][0],tr.pts[j-1][1]); ctx.lineTo(tr.pts[j][0],tr.pts[j][1]); ctx.stroke();
    }
  }
}

// 04 Clifford
let cfSeeds=[];
function init04(){ cfSeeds=[]; for(let i=0;i<180;i++) cfSeeds.push({x:Math.random()*W,y:Math.random()*H,pts:[],max:160+(i%80)}); }
function step04(){
  ctx.fillStyle='rgba(4,2,12,.04)'; ctx.fillRect(0,0,W,H);
  for(const p of cfSeeds){
    for(let s=0;s<2;s++){
      const a=Math.sin(p.y*.005)*Math.cos(p.x*.005)*Math.PI*2.5;
      p.x+=Math.cos(a)*2.2; p.y+=Math.sin(a)*2.2;
      p.pts.push([p.x,p.y]); if(p.pts.length>p.max)p.pts.shift();
      if(p.x<0||p.x>W||p.y<0||p.y>H){p.x=Math.random()*W;p.y=Math.random()*H;p.pts=[];}
    }
    const n=p.pts.length; if(n<2)continue;
    for(let j=1;j<n;j++){
      const f=j/n; ctx.strokeStyle=PALS_CSS[currentPal](f); ctx.lineWidth=.4+f*1.2;
      ctx.beginPath(); ctx.moveTo(p.pts[j-1][0],p.pts[j-1][1]); ctx.lineTo(p.pts[j][0],p.pts[j][1]); ctx.stroke();
    }
  }
}

// 05 Chladni
let chSand=[], chM=3, chN=5;
function init05(){ chSand=[]; for(let i=0;i<5500;i++) chSand.push({x:Math.random()*W,y:Math.random()*H,vx:0,vy:0}); }
function step05(){
  ctx.fillStyle='rgba(4,2,12,.12)'; ctx.fillRect(0,0,W,H);
  const L=Math.min(W,H)*.85, ox=(W-L)/2, oy=(H-L)/2;
  for(const p of chSand){
    const u=(p.x-ox)/L,v=(p.y-oy)/L;
    if(u>=0&&u<=1&&v>=0&&v<=1){
      const val=Math.sin(chN*Math.PI*u)*Math.sin(chM*Math.PI*v)-Math.sin(chM*Math.PI*u)*Math.sin(chN*Math.PI*v);
      const gx=chN*Math.PI*Math.cos(chN*Math.PI*u)*Math.sin(chM*Math.PI*v)-chM*Math.PI*Math.cos(chM*Math.PI*u)*Math.sin(chN*Math.PI*v);
      const gy=chM*Math.PI*Math.sin(chN*Math.PI*u)*Math.cos(chM*Math.PI*v)-chN*Math.PI*Math.sin(chM*Math.PI*u)*Math.cos(chN*Math.PI*v);
      p.vx=p.vx*.82-Math.sign(val)*gx*.08+(Math.random()-.5)*.4;
      p.vy=p.vy*.82-Math.sign(val)*gy*.08+(Math.random()-.5)*.4;
      p.x+=p.vx; p.y+=p.vy;
      const prox=Math.exp(-Math.abs(val)*6);
      ctx.fillStyle=PALS_CSS[currentPal](prox); ctx.fillRect(p.x,p.y,1.2,1.2);
    } else { p.x=ox+Math.random()*L; p.y=oy+Math.random()*L; p.vx=p.vy=0; }
  }
}

// 06 Turing
let tAgents=[];
function init06(){ tAgents=[]; for(let i=0;i<280;i++) tAgents.push({x:W/2+(Math.random()-.5)*120,y:H/2+(Math.random()-.5)*120,angle:Math.random()*Math.PI*2,sp:i%2,pts:[]}); }
function step06(){
  ctx.fillStyle='rgba(4,2,12,.025)'; ctx.fillRect(0,0,W,H);
  for(let i=0;i<tAgents.length;i++){
    const ag=tAgents[i]; let repX=0,repY=0;
    for(let j=0;j<30;j++){
      const o=tAgents[(i+j*7)%tAgents.length],dx=o.x-ag.x,dy=o.y-ag.y,dist=Math.hypot(dx,dy)||1;
      if(dist<45){const f=(ag.sp===o.sp?-1:1.4)*(45-dist)/dist; repX+=f*dx;repY+=f*dy;}
    }
    ag.angle+=(Math.atan2(repY,repX)-ag.angle)*.08+(Math.random()-.5)*.2;
    ag.x+=Math.cos(ag.angle)*1.8; ag.y+=Math.sin(ag.angle)*1.8;
    if(ag.x<0)ag.x=W; if(ag.x>W)ag.x=0; if(ag.y<0)ag.y=H; if(ag.y>H)ag.y=0;
    ag.pts.push([ag.x,ag.y]); if(ag.pts.length>70)ag.pts.shift();
    if(ag.pts.length>2){
      ctx.strokeStyle=PALS_CSS[currentPal](ag.sp===0?.85:.2); ctx.lineWidth=ag.sp===0?2.2:1.2;
      ctx.beginPath(); ctx.moveTo(ag.pts[ag.pts.length-2][0],ag.pts[ag.pts.length-2][1]); ctx.lineTo(ag.pts[ag.pts.length-1][0],ag.pts[ag.pts.length-1][1]); ctx.stroke();
    }
  }
}

// 07 Rössler
let rTrajs=[], rRot=0;
function init07(){
  rTrajs=[];
  for(let i=0;i<14;i++){
    let x=.5+i*.06,y=.2,z=.1;
    for(let k=0;k<300;k++){x+=.02*(-y-z);y+=.02*(x+.2*y);z+=.02*(.2+z*(x-5.7));}
    rTrajs.push({x,y,z,pts:[],max:600});
  }
}
function step07(){
  ctx.fillStyle='rgba(4,2,12,.035)'; ctx.fillRect(0,0,W,H);
  rRot+=.0012; const sc=Math.min(W,H)*.035;
  for(const tr of rTrajs){
    for(let s=0;s<4;s++){
      const dt=.02;
      const dx=-tr.y-tr.z, dy=tr.x+.2*tr.y, dz=.2+tr.z*(tr.x-5.7);
      tr.x+=dt*dx; tr.y+=dt*dy; tr.z+=dt*dz;
      const rx=tr.x*Math.cos(rRot)-tr.y*Math.sin(rRot);
      const ry=tr.x*Math.sin(rRot)+tr.y*Math.cos(rRot);
      const rz=ry*.4+(tr.z-8)*.8;
      tr.pts.push([W/2+rx*sc, H/2-rz*sc]); if(tr.pts.length>tr.max)tr.pts.shift();
    }
    const n=tr.pts.length; if(n<2)continue;
    for(let j=1;j<n;j++){
      const f=j/n; ctx.strokeStyle=PALS_CSS[currentPal](f); ctx.lineWidth=.6+f*1.6;
      ctx.beginPath(); ctx.moveTo(tr.pts[j-1][0],tr.pts[j-1][1]); ctx.lineTo(tr.pts[j][0],tr.pts[j][1]); ctx.stroke();
    }
  }
}

// 08 Apolonio
let apAngle=0;
function init08(){ apAngle=0; ctx.fillStyle='#04020c'; ctx.fillRect(0,0,W,H); }
function drawCircle(x,y,r,depth){
  if(depth>5||r<2)return;
  const f=1-depth/6; ctx.strokeStyle=PALS_CSS[currentPal](f); ctx.lineWidth=Math.max(.4,1.8-depth*.3);
  ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.stroke();
  const sub=depth===0?3:2, subR=r*.38;
  for(let i=0;i<sub;i++){
    const th=apAngle+(i*2*Math.PI)/sub+depth*.4;
    drawCircle(x+Math.cos(th)*(r-subR),y+Math.sin(th)*(r-subR),subR,depth+1);
  }
}
function step08(){
  ctx.fillStyle='rgba(4,2,12,.06)'; ctx.fillRect(0,0,W,H);
  apAngle+=.003; drawCircle(W/2,H/2,Math.min(W,H)*.42,0);
}

// 09 Julia
let julRow=0, julAngle=0;
function init09(){ julRow=0; julAngle=0; ctx.fillStyle='#04020c'; ctx.fillRect(0,0,W,H); }
function step09(){
  julAngle+=.006;
  const cR=.7885*Math.cos(julAngle), cI=.7885*Math.sin(julAngle);
  const ROWS=12, maxIt=100, scale=3.2/Math.min(W,H);
  const cx=W/2, cy=H/2;
  const id=ctx.createImageData(W,ROWS);
  for(let dy=0;dy<ROWS&&(julRow+dy)<H;dy++){
    const zy=((julRow+dy)-cy)*scale;
    for(let px=0;px<W;px++){
      let zr=(px-cx)*scale, zi=zy, n=0;
      while(zr*zr+zi*zi<4&&n<maxIt){const t=zr*zr-zi*zi+cR; zi=2*zr*zi+cI; zr=t; n++;}
      let r=0,g=0,b=0;
      if(n<maxIt){
        const sm=n+1-Math.log2(.5*Math.log(zr*zr+zi*zi+1e-9));
        const t=Math.max(0,Math.min(1,sm/maxIt));
        [r,g,b]=PALS_RGB[currentPal](t);
      }
      const idx=(dy*W+px)*4; id.data[idx]=r;id.data[idx+1]=g;id.data[idx+2]=b;id.data[idx+3]=255;
    }
  }
  ctx.putImageData(id,0,julRow); julRow=(julRow+ROWS)%H;
}

// 10 Langton
let langGrid=null, langAnts=[], langStep=0, langGW=0, langGH=0, langCellSize=8;
function init10(){
  langCellSize=8; langGW=W/langCellSize|0; langGH=H/langCellSize|0;
  langGrid=new Uint8Array(langGW*langGH); langAnts=[]; langStep=0;
  for(let i=0;i<4;i++) langAnts.push({gx:langGW/2|0,gy:langGH/2|0,dir:i});
  ctx.fillStyle='#04020c'; ctx.fillRect(0,0,W,H);
}
function step10(){
  for(let s=0;s<600;s++){
    for(const ant of langAnts){
      const idx=ant.gy*langGW+ant.gx;
      if(langGrid[idx]===0){ant.dir=(ant.dir+1)%4; langGrid[idx]=1;}
      else{ant.dir=(ant.dir+3)%4; langGrid[idx]=0;}
      const dx=[0,1,0,-1],dy=[-1,0,1,0];
      ant.gx=(ant.gx+dx[ant.dir]+langGW)%langGW; ant.gy=(ant.gy+dy[ant.dir]+langGH)%langGH;
    }
    langStep++;
  }
  ctx.fillStyle='#04020c'; ctx.fillRect(0,0,W,H);
  for(let y=0;y<langGH;y++)for(let x=0;x<langGW;x++){
    if(langGrid[y*langGW+x]){
      const f=(x/langGW*.5+y/langGH*.5);
      ctx.fillStyle=PALS_CSS[currentPal](f); ctx.fillRect(x*langCellSize,y*langCellSize,langCellSize-1,langCellSize-1);
    }
  }
  for(const ant of langAnts){ ctx.fillStyle='rgba(255,255,255,.9)'; ctx.fillRect(ant.gx*langCellSize,ant.gy*langCellSize,langCellSize,langCellSize); }
  ctx.fillStyle='rgba(180,150,255,.5)'; ctx.font='11px Space Mono'; ctx.fillText(`Paso: ${langStep.toLocaleString()}`,12,H-16);
}

// 11 KdV Solitons
let kdvT=0;
function init11(){ kdvT=0; }
function step11(){
  ctx.fillStyle='rgba(4,2,12,.15)'; ctx.fillRect(0,0,W,H);
  kdvT+=.02;
  const solitons=[{k:.8,x0:W*.2,col:0.85},{k:.5,x0:W*.1,col:0.5},{k:1.1,x0:W*.4,col:0.65},{k:.35,x0:0,col:0.3}];
  const yBase=H/2, amp=H*.28;
  for(const sol of solitons){
    ctx.beginPath();
    for(let px=0;px<W;px++){
      const x=(px/W)*20-10; const arg=sol.k*(x*3-4*sol.k*sol.k*kdvT)-sol.x0/W*30;
      const u=-2*sol.k*sol.k/(Math.cosh(arg)**2); const py=yBase-u*amp;
      px===0?ctx.moveTo(px,py):ctx.lineTo(px,py);
    }
    ctx.strokeStyle=PALS_CSS[currentPal](sol.col); ctx.lineWidth=2; ctx.stroke();
  }
}

// 12 Voronoi
let vorSeeds=[], vorT=0;
function init12(){
  vorSeeds=[]; vorT=0;
  for(let i=0;i<14;i++) vorSeeds.push({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.4,vy:(Math.random()-.5)*.4});
  ctx.fillStyle='#04020c'; ctx.fillRect(0,0,W,H);
}
function step12(){
  vorT++;
  for(const s of vorSeeds){ s.x+=s.vx; s.y+=s.vy; if(s.x<0||s.x>W)s.vx*=-1; if(s.y<0||s.y>H)s.vy*=-1; }
  if(vorT%2===0){
    const id=ctx.createImageData(W,H);
    for(let y=0;y<H;y++)for(let x=0;x<W;x++){
      let d1=Infinity,d2=Infinity;
      for(const s of vorSeeds){ const d=Math.hypot(x-s.x,y-s.y); if(d<d1){d2=d1;d1=d;}else if(d<d2)d2=d; }
      const border=d2-d1<3, t=border?1.0:Math.max(0,1-(d1/(Math.min(W,H)*.3)));
      const [r,g,b]=PALS_RGB[currentPal](t); const alpha=border?220:60+t*120|0;
      const idx=(y*W+x)*4; id.data[idx]=r;id.data[idx+1]=g;id.data[idx+2]=b;id.data[idx+3]=alpha;
    }
    ctx.fillStyle='#04020c'; ctx.fillRect(0,0,W,H); ctx.putImageData(id,0,0);
  }
  for(const s of vorSeeds){ ctx.fillStyle='rgba(255,255,255,.7)'; ctx.beginPath(); ctx.arc(s.x,s.y,3,0,Math.PI*2); ctx.fill(); }
}

// 13 Newton
let newRow=0; const ROOTS=[{r:1,i:0},{r:-.5,i:.866},{r:-.5,i:-.866}]; const RCOLS=[[.85,.1,.1],[.1,.85,.1],[.1,.1,.85]];
function init13(){ newRow=0; ctx.fillStyle='#04020c'; ctx.fillRect(0,0,W,H); }
function step13(){
  const ROWS=16, maxIt=60, scale=3.0/Math.min(W,H), id=ctx.createImageData(W,ROWS), cx=W/2, cy=H/2;
  for(let dy=0;dy<ROWS&&(newRow+dy)<H;dy++){
    const zy=((newRow+dy)-cy)*scale;
    for(let px=0;px<W;px++){
      let zr=(px-cx)*scale, zi=zy, whichRoot=-1, n=0;
      for(;n<maxIt;n++){
        const zr2=zr*zr-zi*zi, zi2=2*zr*zi; const zr3=zr2*zr-zi2*zi, zi3=zr2*zi+zi2*zr;
        const den=9*(zr2*zr2+zi2*zi2)+1e-12; const nr=(2*zr3+1)*(3*(zr2))+2*zi3*(3*zi2); const ni=(2*zi3)*(3*(zr2))-(2*zr3+1)*(3*zi2);
        zr=nr/den; zi=ni/den;
        for(let ri=0;ri<3;ri++) if(Math.hypot(zr-ROOTS[ri].r,zi-ROOTS[ri].i)<.0001){whichRoot=ri;break;}
        if(whichRoot>=0)break;
      }
      const shade=Math.max(0,1-n/maxIt), rc=whichRoot>=0?RCOLS[whichRoot]:[0,0,0], [pr,pg,pb]=PALS_RGB[currentPal](shade), idx=(dy*W+px)*4;
      id.data[idx]=rc[0]*pr|0; id.data[idx+1]=rc[1]*pg|0; id.data[idx+2]=rc[2]*pb|0; id.data[idx+3]=255;
    }
  }
  ctx.putImageData(id,0,newRow); newRow=(newRow+ROWS)%H;
}

// 14 Bénard
let benPts=[];
function init14(){ benPts=[]; for(let i=0;i<500;i++) benPts.push({x:Math.random()*W,y:Math.random()*H,T:Math.random(),vx:0,vy:0}); }
function step14(){
  ctx.fillStyle='rgba(4,2,12,.06)'; ctx.fillRect(0,0,W,H);
  for(let i=0;i<benPts.length;i++){
    const p=benPts[i]; let fx=0,fy=p.T>.5?-.8:.8;
    for(let j=0;j<benPts.length;j+=6){
      const o=benPts[j]; if(o===p)continue; const dx=p.x-o.x,dy=p.y-o.y,d=Math.hypot(dx,dy);
      if(d<40&&d>0){fx+=dx/(d*d)*12;fy+=dy/(d*d)*6;}
    }
    p.vx=(p.vx+fx*.04)*.9; p.vy=(p.vy+fy*.04)*.9; p.x+=p.vx; p.y+=p.vy;
    if(p.x<0)p.x=W; if(p.x>W)p.x=0; if(p.y<5){p.y=5;p.vy*=-1;p.T=Math.max(0,p.T-.01);} if(p.y>H-5){p.y=H-5;p.vy*=-1;p.T=Math.min(1,p.T+.01);}
    const [r,g,b]=PALS_RGB[currentPal](p.T); ctx.fillStyle=`rgba(${r},${g},${b},.7)`; ctx.beginPath(); ctx.arc(p.x,p.y,3,0,Math.PI*2); ctx.fill();
  }
}

// 15 Hopf
let hopfAngle=0, hopfFibers=[];
function init15(){
  hopfFibers=[]; hopfAngle=0;
  for(let eta=.1;eta<Math.PI/2-.05;eta+=.2)for(let xi=0;xi<Math.PI*2;xi+=.3) hopfFibers.push({eta,xi,pts:[]});
}
function step15(){
  ctx.fillStyle='rgba(4,2,12,.04)'; ctx.fillRect(0,0,W,H);
  hopfAngle+=.006; const sc=Math.min(W,H)*.22;
  for(const fib of hopfFibers){
    fib.pts=[];
    for(let t=0;t<Math.PI*2;t+=.08){
      const p=[Math.cos(fib.eta)*Math.cos(t), Math.cos(fib.eta)*Math.sin(t), Math.sin(fib.eta)*Math.cos(fib.xi+t), Math.sin(fib.eta)*Math.sin(fib.xi+t)];
      const denom=1-p[3]+.001, X=p[0]/denom, Y=p[1]/denom, Z=p[2]/denom;
      const cosH=Math.cos(hopfAngle), sinH=Math.sin(hopfAngle);
      const rx=X*cosH-Z*sinH, rz=X*sinH+Z*cosH;
      const cosV=.35, sinV=.93, fy=Y*cosV-rz*sinV, fz=Y*sinV+rz*cosV, perspective=1/(1+fz*.3+.01);
      fib.pts.push([W/2+rx*sc*perspective, H/2-fy*sc*perspective, fz]);
    }
    if(fib.pts.length<2)continue;
    const f=fib.eta/(Math.PI/2);
    for(let j=1;j<fib.pts.length;j++){
      ctx.strokeStyle=PALS_CSS[currentPal](f); ctx.lineWidth=.7;
      ctx.beginPath(); ctx.moveTo(fib.pts[j-1][0],fib.pts[j-1][1]); ctx.lineTo(fib.pts[j][0],fib.pts[j][1]); ctx.stroke();
    }
  }
}

// 16 Barnsley
let bfX=0, bfY=0;
function init16(){ bfX=0; bfY=0; }
function step16(){
  ctx.fillStyle='rgba(4,2,12,.02)'; ctx.fillRect(0,0,W,H);
  for(let i=0;i<4000;i++){
    const r=Math.random(); let nx,ny;
    if(r<.01){nx=0;ny=.16*bfY;}
    else if(r<.86){nx=.85*bfX+.04*bfY; ny=-.04*bfX+.85*bfY+1.6;}
    else if(r<.93){nx=.2*bfX-.26*bfY; ny=.23*bfX+.22*bfY+1.6;}
    else{nx=-.15*bfX+.28*bfY; ny=.26*bfX+.24*bfY+.44;}
    bfX=nx; bfY=ny;
    const px=W*.5+bfX*(W*.09), py=H*.97-bfY*(H*.09);
    if(px>0&&px<W&&py>0&&py<H){
      const f=Math.min(1,Math.max(0,bfY/10)), [r2,g,b]=PALS_RGB[currentPal](f);
      ctx.fillStyle=`rgba(${r2},${g},${b},.4)`; ctx.fillRect(px,py,1.2,1.2);
    }
  }
}

// 17 Fibonacci
let fibN=0, fibMax=1600;
function init17(){ fibN=0; ctx.fillStyle='#04020c'; ctx.fillRect(0,0,W,H); }
function step17(){
  ctx.fillStyle='rgba(4,2,12,.01)'; ctx.fillRect(0,0,W,H);
  const GOLDEN=137.508*(Math.PI/180), cx=W/2, cy=H/2, scale=Math.min(W,H)*.008;
  const addN=Math.min(20,fibMax-fibN);
  for(let k=0;k<addN;k++){
    const n=fibN+k, r=Math.sqrt(n)*scale, theta=n*GOLDEN;
    const x=cx+r*Math.cos(theta), y=cy+r*Math.sin(theta);
    const f=n/fibMax, [rr,g,b]=PALS_RGB[currentPal](f);
    ctx.fillStyle=`rgba(${rr},${g},${b},.85)`; ctx.beginPath(); ctx.arc(x,y,Math.max(.8,1.8*(1-n/fibMax)+.5),0,Math.PI*2); ctx.fill();
  }
  fibN+=addN; if(fibN>=fibMax)fibN=0;
}

// 18 Belousov-Zhabotinsky
let bzU=null,bzV=null,bzBW=0,bzBH=0; const BZ_SCALE=4;
function init18(){
  bzBW=W/BZ_SCALE|0; bzBH=H/BZ_SCALE|0; bzU=new Float32Array(bzBW*bzBH); bzV=new Float32Array(bzBW*bzBH);
  for(let i=0;i<bzBW*bzBH;i++){bzU[i]=1;bzV[i]=0;}
  for(let y=bzBH*.3;y<bzBH*.7;y++)for(let x=bzBW*.3;x<bzBW*.7;x++){ bzU[y*bzBW+x|0]=Math.random(); bzV[y*bzBW+x|0]=Math.random(); }
}
function step18(){
  const Du=.16,Dv=.08,F=.035,k=.065, nu=new Float32Array(bzBW*bzBH), nv=new Float32Array(bzBW*bzBH);
  for(let y=1;y<bzBH-1;y++)for(let x=1;x<bzBW-1;x++){
    const idx=y*bzBW+x, lapU=bzU[idx-1]+bzU[idx+1]+bzU[idx-bzBW]+bzU[idx+bzBW]-4*bzU[idx], lapV=bzV[idx-1]+bzV[idx+1]+bzV[idx-bzBW]+bzV[idx+bzBW]-4*bzV[idx];
    const uvv=bzU[idx]*bzV[idx]*bzV[idx];
    nu[idx]=Math.max(0,Math.min(1,bzU[idx]+Du*lapU-uvv+F*(1-bzU[idx])));
    nv[idx]=Math.max(0,Math.min(1,bzV[idx]+Dv*lapV+uvv-(F+k)*bzV[idx]));
  }
  bzU=nu; bzV=nv;
  const id=ctx.createImageData(W,H);
  for(let y=0;y<bzBH;y++)for(let x=0;x<bzBW;x++){
    const f=Math.max(0,Math.min(1,bzU[y*bzBW+x]-bzV[y*bzBW+x]*.5+.3)), [r,g,b]=PALS_RGB[currentPal](f);
    for(let dy=0;dy<BZ_SCALE;dy++)for(let dx=0;dx<BZ_SCALE;dx++){
      const idx=((y*BZ_SCALE+dy)*W+(x*BZ_SCALE+dx))*4; id.data[idx]=r;id.data[idx+1]=g;id.data[idx+2]=b;id.data[idx+3]=255;
    }
  }
  ctx.putImageData(id,0,0);
}

// 19 Schrödinger
let schT=0, schSources=[];
function init19(){
  schT=0; schSources=[];
  for(let i=0;i<3;i++) schSources.push({x:W*(.3+Math.random()*.4),y:H*(.3+Math.random()*.4),kx:(Math.random()-.5)*4,ky:(Math.random()-.5)*4,sig:50+Math.random()*30,omega:2+Math.random()*2});
}
function step19(){
  schT+=.04; const id=ctx.createImageData(W,H);
  for(let y=0;y<H;y+=2)for(let x=0;x<W;x+=2){
    let psiR=0,psiI=0;
    for(const src of schSources){
      const dx=x-src.x,dy=y-src.y,r2=dx*dx+dy*dy,env=Math.exp(-r2/(2*src.sig*src.sig*(1+schT*.3))),phase=src.kx*dx+src.ky*dy-src.omega*schT;
      psiR+=env*Math.cos(phase); psiI+=env*Math.sin(phase);
    }
    const prob=Math.min(1,(psiR*psiR+psiI*psiI)/3), phase=Math.atan2(psiI,psiR)/Math.PI*.5+.5, [r,g,b]=PALS_RGB[currentPal](phase);
    for(let dy=0;dy<2;dy++)for(let dx=0;dx<2;dx++){
      const idx=((y+dy)*W+(x+dx))*4; id.data[idx]=r*prob|0; id.data[idx+1]=g*prob|0; id.data[idx+2]=b*prob|0; id.data[idx+3]=200;
    }
  }
  ctx.putImageData(id,0,0);
}

// 20 Rule 110
let r110Grid=null,r110Row=0,r110GW=0;
function init20(){ r110GW=W; r110Row=0; r110Grid=new Uint8Array(r110GW); r110Grid[r110GW>>1]=1; ctx.fillStyle='#04020c'; ctx.fillRect(0,0,W,H); }
function step20(){
  if(r110Row>=H){
    ctx.drawImage(canvas,0,1,W,H-1,0,0,W,H-1); ctx.fillStyle='#04020c'; ctx.fillRect(0,H-1,W,1); r110Row=H-1;
    const ng=new Uint8Array(r110GW), RULE110=0b01101110;
    for(let x=0;x<r110GW;x++){ const pat=(r110Grid[(x-1+r110GW)%r110GW]<<2)|(r110Grid[x]<<1)|r110Grid[(x+1)%r110GW]; ng[x]=(RULE110>>pat)&1; }
    r110Grid=ng;
    for(let x=0;x<r110GW;x++) if(r110Grid[x]){ const [rr,g,b]=PALS_RGB[currentPal](x/r110GW); ctx.fillStyle=`rgb(${rr},${g},${b})`; ctx.fillRect(x,H-1,1,1); }
  } else {
    const ng=new Uint8Array(r110GW), RULE110=0b01101110;
    for(let x=0;x<r110GW;x++){ const pat=(r110Grid[(x-1+r110GW)%r110GW]<<2)|(r110Grid[x]<<1)|r110Grid[(x+1)%r110GW]; ng[x]=(RULE110>>pat)&1; }
    r110Grid=ng;
    for(let x=0;x<r110GW;x++) if(r110Grid[x]){ const [rr,g,b]=PALS_RGB[currentPal](x/r110GW); ctx.fillStyle=`rgb(${rr},${g},${b})`; ctx.fillRect(x,r110Row,1,1); }
    r110Row++;
  }
}

// ═══════════════════════════════════════════════════════════════════
// NUEVAS 4 OBRAS: PROBLEMAS DEL MILENIO & CONJETURAS (21 A 24)
// ═══════════════════════════════════════════════════════════════════

// ── 21 LOS CEROS DE RIEMANN (Hipótesis de Riemann · 1859) ─────────
// Cuerda de luz en la línea crítica s = 1/2 + it.
// Evalúa la función Z(t) de Riemann-Siegel y traza la espiral 3D.
let rieT = 0, riePts = [], rieZerosHit = [];
const RIEMANN_ZEROS = [14.1347, 21.0220, 25.0108, 30.4248, 32.9350, 37.5861, 40.9187];
let rieRot = 0.4;

function init21() {
  rieT = 0; riePts = []; rieZerosHit = []; rieRot = 0.4;
  ctx.fillStyle = '#04020c'; ctx.fillRect(0,0,W,H);
  for (let k = 0; k < 280; k++) {
    rieT += 0.08;
    const zVal = riemannZ(rieT);
    const theta = (rieT/2)*Math.log(Math.max(1,rieT)/(2*Math.PI)) - (rieT/2);
    const rx = zVal * Math.cos(theta);
    const ry = zVal * Math.sin(theta);
    const rz = (rieT - 22.5) * 8;
    const cosR = Math.cos(rieRot), sinR = Math.sin(rieRot);
    const px = rx * cosR - rz * sinR * 0.1;
    const pz = rx * sinR + rz * cosR;
    const py = ry - pz * 0.2;
    const sc = Math.min(W, H) * 0.045;
    riePts.push([W/2 + px * sc, H/2 - py * sc, Math.abs(zVal)]);
  }
}

function riemannZ(t) {
  // Aproximación de Riemann-Siegel para Z(t) en la línea crítica
  if (t < 0.1) return 1.0;
  const theta = (t/2)*Math.log(t/(2*Math.PI)) - (t/2) - (Math.PI/8);
  const N = Math.floor(Math.sqrt(t / (2*Math.PI))) || 1;
  let sum = 0;
  for (let n = 1; n <= Math.max(1, N); n++) {
    sum += Math.cos(theta - t*Math.log(n)) / Math.sqrt(n);
  }
  return 2 * sum;
}

function step21() {
  ctx.fillStyle = 'rgba(4,2,12,0.035)'; ctx.fillRect(0,0,W,H);
  rieRot += 0.001;

  // Avanzar a lo largo de la línea crítica t
  for (let step = 0; step < 4; step++) {
    rieT += 0.04;
    if (rieT > 45) { rieT = 0; riePts = []; }

    const zVal = riemannZ(rieT);
    const theta = (rieT/2)*Math.log(Math.max(1,rieT)/(2*Math.PI)) - (rieT/2);
    
    // Coordenadas complejas: parte real e imaginaria
    const rx = zVal * Math.cos(theta);
    const ry = zVal * Math.sin(theta);
    const rz = (rieT - 22.5) * 8;

    // Detectar cruce por cero no trivial
    for (const z0 of RIEMANN_ZEROS) {
      if (Math.abs(rieT - z0) < 0.03) {
        rieZerosHit.push({ x: W/2, y: H/2, r: 1, maxR: 60, col: currentPal });
      }
    }

    // Proyección 3D rotada
    const cosR = Math.cos(rieRot), sinR = Math.sin(rieRot);
    const px = rx * cosR - rz * sinR * 0.1;
    const pz = rx * sinR + rz * cosR;
    const py = ry - pz * 0.2;
    const sc = Math.min(W, H) * 0.045;

    riePts.push([W/2 + px * sc, H/2 - py * sc, Math.abs(zVal)]);
    if (riePts.length > 550) riePts.shift();
  }

  // Dibujar eje del cero (el centro sagrado donde cruzan todos los ceros)
  ctx.strokeStyle = 'rgba(120, 100, 255, 0.2)';
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.arc(W/2, H/2, 4, 0, Math.PI*2); ctx.stroke();

  // Dibujar espiral de la cuerda
  const n = riePts.length;
  if (n > 1) {
    for (let j = 1; j < n; j++) {
      const frac = j / n;
      const zDist = riePts[j][2];
      // Más brillante y dorado cuando se acerca exactamente a cero (zDist ≈ 0)
      const nearZero = Math.exp(-zDist * 1.5);
      ctx.strokeStyle = PALS_CSS[currentPal](nearZero * 0.8 + frac * 0.2);
      ctx.lineWidth = 0.6 + nearZero * 2.5;
      ctx.beginPath();
      ctx.moveTo(riePts[j-1][0], riePts[j-1][1]);
      ctx.lineTo(riePts[j][0], riePts[j][1]);
      ctx.stroke();
    }
  }

  // Ondas expansivas cuando cruza un cero no trivial
  for (let k = rieZerosHit.length - 1; k >= 0; k--) {
    const o = rieZerosHit[k];
    o.r += 1.8;
    const alpha = 1.0 - o.r / o.maxR;
    if (alpha <= 0) {
      rieZerosHit.splice(k, 1);
      continue;
    }
    ctx.strokeStyle = PALS_CSS[currentPal](1.0);
    ctx.globalAlpha = alpha * 0.8;
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(o.x, o.y, o.r, 0, Math.PI*2); ctx.stroke();
    ctx.globalAlpha = 1;
  }
}

// ── 22 EL DESIERTO DE BEAL (Conjetura de Beal · Ax + By = Cz) ──────
// Mapea en el espacio logarítmico las sumas de potencias.
// Muestra el vacío de exclusión donde ninguna terna coprima puede cruzar.
let bealStars = [], bealAngle = 0;
function init22() {
  bealStars = []; bealAngle = 0;
  ctx.fillStyle = '#04020c'; ctx.fillRect(0,0,W,H);
  
  // Generar candidatos de potencias puras A^x + B^y = C^z
  for (let A = 2; A <= 9; A++) {
    for (let B = 2; B <= 9; B++) {
      for (let x = 3; x <= 6; x++) {
        for (let y = 3; y <= 6; y++) {
          const sum = Math.pow(A, x) + Math.pow(B, y);
          // Buscar si sum es una potencia C^z
          for (let C = 2; C <= 30; C++) {
            for (let z = 3; z <= 6; z++) {
              const cz = Math.pow(C, z);
              const err = Math.abs(sum - cz) / sum;
              // Máximo común divisor
              const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
              const g = gcd(A, gcd(B, C));
              
              if (err < 0.08 || g > 1) {
                bealStars.push({
                  A, B, C, x, y, z,
                  hasCommonFactor: g > 1,
                  th: Math.log(sum) * 1.8,
                  rad: Math.log(cz) * 12,
                  energy: 1.0 - err
                });
              }
            }
          }
        }
      }
    }
  }
}

function step22() {
  ctx.fillStyle = 'rgba(4,2,12,0.04)'; ctx.fillRect(0,0,W,H);
  bealAngle += 0.002;
  const cx = W / 2, cy = H / 2;

  // Dibujar el 'Desierto de Beal': franja de exclusión circular donde gcd=1 es imposible
  ctx.strokeStyle = 'rgba(255, 50, 100, 0.15)';
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.arc(cx, cy, Math.min(W,H)*0.28, 0, Math.PI*2); ctx.stroke();
  ctx.beginPath(); ctx.arc(cx, cy, Math.min(W,H)*0.36, 0, Math.PI*2); ctx.stroke();

  // Partículas y constelaciones de potencias
  for (let i = 0; i < bealStars.length; i++) {
    const s = bealStars[i];
    const a = s.th + bealAngle * (s.hasCommonFactor ? 1 : -0.7);
    const r = s.rad * (Math.min(W,H)*0.0035);
    const px = cx + r * Math.cos(a);
    const py = cy + r * Math.sin(a);

    if (s.hasCommonFactor) {
      // Soluciones con factor común resonante (permitidas por la conjetura)
      ctx.fillStyle = PALS_CSS[currentPal](0.85);
      ctx.beginPath(); ctx.arc(px, py, 2.5, 0, Math.PI*2); ctx.fill();

      // Líneas de filamento conectando soluciones armónicas
      if (i > 0 && bealStars[i-1].hasCommonFactor) {
        const prev = bealStars[i-1];
        const pa = prev.th + bealAngle;
        const pr = prev.rad * (Math.min(W,H)*0.0035);
        ctx.strokeStyle = PALS_CSS[currentPal](0.4);
        ctx.lineWidth = 0.5;
        ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(cx + pr*Math.cos(pa), cy + pr*Math.sin(pa)); ctx.stroke();
      }
    } else {
      // Intentos coprimos (gcd = 1): repelidos fuera del desierto
      ctx.fillStyle = 'rgba(255, 80, 80, 0.5)';
      ctx.beginPath(); ctx.arc(px, py, 1.2, 0, Math.PI*2); ctx.fill();
    }
  }

  // Texto místico sutil en el centro
  ctx.fillStyle = 'rgba(180, 140, 255, 0.3)';
  ctx.font = '10px Space Mono';
  ctx.textAlign = 'center';
  ctx.fillText('ZONA PROHIBIDA: gcd(A,B,C)=1', cx, cy + 4);
}

// ── 23 NAVIER-STOKES (Vórtices, Turbulencia y Cascada de Enstrofía) ─
// Ecuación de Navier-Stokes incompresible: ∂u/∂t + (u·∇)u = -∇p/ρ + ν∇²u,  ∇·u = 0.
// Modelado hidrodinámico por el método de partículas de vórtice (Biot-Savart Lamb-Oseen) y líneas de corriente lagrangianas.
let nsParticles = [], nsVortexCores = [], nsTime = 0;

function init23() {
  nsParticles = [];
  nsVortexCores = [];
  nsTime = 0;
  ctx.fillStyle = '#04020c';
  ctx.fillRect(0, 0, W, H);

  const cx = W / 2, cy = H / 2;
  const minDim = Math.min(W, H);

  // 1. Núcleos Coherentes de Vorticidad (Pares de vórtices interactuantes de Lamb-Oseen)
  // Generan la recirculación hidrodinámica fundamental ω = ∇ × u
  const coreConfigs = [
    { r: 0.16, angle: 0.0,              gamma: +4800, rCore: 45, speed: +0.008 },
    { r: 0.16, angle: Math.PI,          gamma: -4800, rCore: 45, speed: +0.008 },
    { r: 0.28, angle: Math.PI * 0.5,    gamma: -2800, rCore: 55, speed: -0.006 },
    { r: 0.28, angle: Math.PI * 1.5,    gamma: +2800, rCore: 55, speed: -0.006 },
    { r: 0.06, angle: 0.0,              gamma: +2200, rCore: 35, speed: +0.016 }
  ];

  for (const cfg of coreConfigs) {
    nsVortexCores.push({
      baseR: minDim * cfg.r,
      angle: cfg.angle,
      gamma: cfg.gamma,
      sigma2: cfg.rCore * cfg.rCore,
      speed: cfg.speed,
      x: cx + Math.cos(cfg.angle) * minDim * cfg.r,
      y: cy + Math.sin(cfg.angle) * minDim * cfg.r
    });
  }

  // 2. Trazadores Lagrangianos de Fluido (Filamentos de humo y vórtices espirales)
  const numParticles = 1400;
  for (let i = 0; i < numParticles; i++) {
    const th = Math.random() * Math.PI * 2;
    const rad = Math.pow(Math.random(), 0.5) * minDim * 0.42;
    const px = cx + Math.cos(th) * rad;
    const py = cy + Math.sin(th) * rad;
    nsParticles.push({
      x: px, y: py,
      prevX: px, prevY: py,
      age: Math.floor(Math.random() * 260),
      maxAge: 180 + Math.floor(Math.random() * 200),
      speed: 0
    });
  }
}

function step23() {
  // Fading viscoso lento: preserva filamentos como en cámara de niebla
  ctx.fillStyle = 'rgba(4, 2, 12, 0.028)';
  ctx.fillRect(0, 0, W, H);

  nsTime += 0.014;
  const cx = W / 2, cy = H / 2;
  const minDim = Math.min(W, H);

  // 1. Precesión y Dinámica Orbital de los Núcleos de Vórtice
  for (let k = 0; k < nsVortexCores.length; k++) {
    const c = nsVortexCores[k];
    c.angle += c.speed;
    const wobble = 1.0 + Math.sin(nsTime * 1.6 + k * 1.3) * 0.15;
    c.x = cx + Math.cos(c.angle) * c.baseR * wobble;
    c.y = cy + Math.sin(c.angle * 1.15) * (c.baseR * 0.9) * wobble;
  }

  // 2. Integración de Partículas en el Campo Incompresible (∇·u = 0)
  for (let i = 0; i < nsParticles.length; i++) {
    const p = nsParticles[i];
    p.prevX = p.x;
    p.prevY = p.y;

    // Ley de Biot-Savart regularizada (Lamb-Oseen) para cada núcleo de remolino
    let vx = 0;
    let vy = 0;

    for (let k = 0; k < nsVortexCores.length; k++) {
      const c = nsVortexCores[k];
      const dx = p.x - c.x;
      const dy = p.y - c.y;
      const r2 = dx * dx + dy * dy;
      const factor = c.gamma / (r2 + c.sigma2);
      vx -= dy * factor;
      vy += dx * factor;
    }

    // Perturbaciones armónicas incompresibles de Taylor-Green / Kolmogorov
    const waveX =  Math.sin(p.y * 0.009 + nsTime * 0.8) * Math.cos(p.x * 0.005) * 1.2;
    const waveY = -Math.cos(p.y * 0.009 + nsTime * 0.8) * Math.sin(p.x * 0.005) * 1.2;
    vx += waveX;
    vy += waveY;

    // Suave contención radial hacia el área activa del lienzo
    const distCenter = Math.hypot(p.x - cx, p.y - cy);
    if (distCenter > minDim * 0.44) {
      const pull = (distCenter - minDim * 0.44) * 0.04;
      vx -= ((p.x - cx) / distCenter) * pull;
      vy -= ((p.y - cy) / distCenter) * pull;
    }

    // Limitador de velocidad física (evita explosiones numéricas)
    const spd = Math.hypot(vx, vy);
    if (spd > 7.5) {
      vx = (vx / spd) * 7.5;
      vy = (vy / spd) * 7.5;
    }

    p.x += vx;
    p.y += vy;
    p.speed = Math.hypot(vx, vy);
    p.age++;

    // Reinyección periódica para mantener filamentos vivos y densos
    if (p.age >= p.maxAge || p.x < 15 || p.x > W - 15 || p.y < 15 || p.y > H - 15) {
      const targetCore = nsVortexCores[Math.floor(Math.random() * nsVortexCores.length)];
      const spreadAngle = Math.random() * Math.PI * 2;
      const spreadR = Math.pow(Math.random(), 0.5) * (minDim * 0.22);
      p.x = targetCore.x + Math.cos(spreadAngle) * spreadR * 0.6;
      p.y = targetCore.y + Math.sin(spreadAngle) * spreadR * 0.6;
      p.prevX = p.x;
      p.prevY = p.y;
      p.age = 0;
      p.maxAge = 180 + Math.floor(Math.random() * 200);
      continue;
    }

    // Renderizado del filamento de flujo:
    // Color y grosor gobernados por la enstrofía y velocidad del vórtice
    const frac = Math.min(1.0, p.speed / 5.2);
    ctx.strokeStyle = PALS_CSS[currentPal](0.1 + frac * 0.85);
    ctx.lineWidth = 0.6 + frac * 1.6;

    ctx.beginPath();
    ctx.moveTo(p.prevX, p.prevY);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
  }
}

// ── 24 EL FLUJO DE RICCI DE POINCARÉ (Perelman · 2002) ─────────────
// Ecuación de evolución métrica ∂t g_ij = -2 R_ij.
// Una variedad arrugada se redondea y colapsa en una esfera perfecta S³.
let ricciAngle = 0, ricciT = 0;
function init24() {
  ricciAngle = 0; ricciT = 0;
  ctx.fillStyle = '#04020c'; ctx.fillRect(0,0,W,H);
}

function step24() {
  ctx.fillStyle = 'rgba(4,2,12,0.06)'; ctx.fillRect(0,0,W,H);
  ricciAngle += 0.004;
  ricciT += 0.008;

  // Factor de suavizado del flujo de Ricci: de arrugas a esfera perfecta
  const smoothing = Math.min(1.0, ricciT * 0.08);
  const baseR = Math.min(W, H) * 0.26;
  const cx = W / 2, cy = H / 2;

  // Si ya colapsó en esfera perfecta, volver a deformar periódicamente
  if (ricciT > 25) ricciT = 0;

  // Malla latitudinal y longitudinal de la variedad tridimensional
  for (let lat = -Math.PI/2 + 0.15; lat <= Math.PI/2 - 0.15; lat += 0.22) {
    ctx.beginPath();
    let first = true;
    for (let lon = 0; lon <= Math.PI * 2; lon += 0.12) {
      // Perturbaciones iniciales de curvatura (cuellos y arrugas de Perelman)
      const wrinkle = Math.sin(lon * 4 + lat * 3) * Math.cos(lat * 5);
      const neckEffect = (1.0 - Math.abs(lat) / (Math.PI/2)) * 0.5 * Math.sin(lon * 2);
      const deformation = (wrinkle + neckEffect) * (1.0 - smoothing);

      const r = baseR * (1.0 + deformation * 0.4);
      const x = r * Math.cos(lat) * Math.sin(lon + ricciAngle);
      const y = r * Math.sin(lat);
      const z = r * Math.cos(lat) * Math.cos(lon + ricciAngle);

      // Proyección 3D
      const px = cx + x;
      const py = cy - y + z * 0.25;

      if (first) { ctx.moveTo(px, py); first = false; }
      else { ctx.lineTo(px, py); }
    }
    const curvatureIntensity = (1.0 - smoothing);
    ctx.strokeStyle = PALS_CSS[currentPal](0.3 + curvatureIntensity * 0.6);
    ctx.lineWidth = 0.7 + curvatureIntensity * 0.8;
    ctx.stroke();
  }
}

// ═══════════════════════════════════════════════════════════════════
// METADATOS DE LAS 24 OBRAS
// ═══════════════════════════════════════════════════════════════════
const ARTWORKS=[
  {badge:"01",mini:"Atractor de Lorenz",cat:"TEORÍA DEL CAOS · 1963",solver:"RK4 Integrator",
   title:"El Vuelo de Lorenz",sub:"El aleteo que gobierna el infinito",
   eq:"dx/dt = 10(y-x)\ndy/dt = x(28-z)-y\ndz/dt = xy-(8/3)z",
   hist:"En 1963, Edward Lorenz redondeó 0.506127 a 0.506 en su computadora climática. Aquella millonésima desató un tornado y demostró que sistemas perfectamente deterministas pueden ser perpetuamente impredecibles.",
   poem:'"Dos alas nacen de un suspiro y giran sin tocarse jamás. Cada decisión ínfima abre una órbita completamente nueva en el tejido del universo."',
   hint:"Arrastra para rotar el atractor en 3D"},
  {badge:"02",mini:"Von Mises",cat:"MECÁNICA CONTINUA · 1913",solver:"Cardano Eigensolver",
   title:"El Umbral de la Materia",sub:"Donde el dolor se vuelve luz",
   eq:"σ_v = √((σ₁-σ₂)²+(σ₂-σ₃)²+(σ₃-σ₁)²)/√2",
   hist:"En 1913, Richard von Mises encontró el límite exacto donde un metal cede plásticamente para siempre bajo carga. Su criterio formuló la energía de distorsión con precisión geométrica.",
   poem:'"La materia resiste hasta que la tensión interna ya no cabe en sus átomos. Azul donde descansa, fuego donde sostiene el peso del mundo."',
   hint:"Mueve el cursor para deformar la tela elástica"},
  {badge:"03",mini:"Yoshida Péndulo",cat:"HAMILTONIANO · 1990",solver:"Symplectic 4th Order",
   title:"La Danza de Yoshida",sub:"La memoria que el tiempo jamás disuelve",
   eq:"z_{n+1}=exp(c_i·Δt·D_A)·exp(d_i·Δt·D_B)·z_n",
   hist:"En 1990, Haruo Yoshida descubrió coeficientes analíticos de 4º orden que preservan la energía exacta de cualquier sistema hamiltoniano sin perder jamás un julio.",
   poem:'"Dos cuerpos bailan al borde del abismo, sin motor ni fricción. Es la música pura de la conservación: lo que nació con energía seguirá cantando por la eternidad."',
   hint:"Observa las cintas de fase: energía conservada al 100%"},
  {badge:"04",mini:"Ríos de Clifford",cat:"ÁLGEBRA DIFERENCIAL · 1873",solver:"Dual Numbers Autodiff",
   title:"Los Ríos Invisibles",sub:"La sombra que revela el gradiente sin error",
   eq:"f(x+d·ε) = f(x) + d·f'(x)·ε  donde ε²=0",
   hist:"William Clifford inventó en 1873 un número infinitesimal ε cuyo cuadrado es cero exacto, permitiendo calcular derivadas analíticas sin error de truncamiento.",
   poem:'"Corrientes subterráneas que horadan la roca en silencio. Las partículas siguen el gradiente sin dudar, tejiendo auroras en las laderas del potencial."',
   hint:"Líneas de corriente analíticas sin error de truncamiento"},
  {badge:"05",mini:"Cantos de Chladni",cat:"CIMÁTICA · 1787",solver:"Helmholtz Standing Wave",
   title:"Los Cantos de Chladni",sub:"La arquitectura que el sonido dibuja en el silencio",
   eq:"w(x,y)=sin(nπx/L)sin(mπy/L)-sin(mπx/L)sin(nπy/L)=0",
   hist:"En 1787, Ernst Chladni pasó un arco de violín por una placa metálica con arena fina. El sonido expulsó a la arena hacia las líneas nodales de reposo, revelando mandalas perfectos.",
   poem:'"El silencio no es vacío; es el punto donde las ondas opuestas se abrazan y se anulan, permitiendo que la arena del mundo descanse en geometría sagrada."',
   hint:"Mueve el mouse para cambiar los armónicos (m,n) de la placa"},
  {badge:"06",mini:"Telar de Turing",cat:"MORFOGÉNESIS · 1952",solver:"Reaction-Diffusion PDE",
   title:"El Telar de Turing",sub:"Cómo el leopardo tejió sus manchas en el caos",
   eq:"∂u/∂t = Dᵤ∇²u - uv² + F(1-u)\n∂v/∂t = Dᵥ∇²v + uv² - (F+k)v",
   hist:"En su último artículo antes de morir en 1952, Alan Turing demostró que dos sustancias químicas simples, difundiéndose a velocidades desiguales, bastan para generar todas las manchas de los felinos.",
   poem:'"La vida no necesitó un pincel: solo dos moléculas jugando a perseguirse durante eones, tejiendo corales y pieles en el tiempo."',
   hint:"Haz clic en el canvas para sembrar nuevos núcleos de morfogénesis"},
  {badge:"07",mini:"Cinta de Rössler",cat:"TOPOLOGÍA CAÓTICA · 1976",solver:"Smale Horseshoe Attractor",
   title:"La Cinta del Panadero",sub:"El espacio que se amasa a sí mismo sin romperse",
   eq:"dx/dt=-y-z\ndy/dt=x+0.2y\ndz/dt=0.2+z(x-5.7)",
   hist:"Otto Rössler diseñó en 1976 el atractor caótico más simple: un espiral suave que de pronto se dispara y se pliega sobre sí mismo, exactamente como el panadero amasa la masa.",
   poem:'"El tiempo es una cinta de seda que el universo estira y dobla, devolviéndonos siempre al mismo origen pero en una octava más alta."',
   hint:"Arrastra para contemplar el pliegue 3D de Rössler"},
  {badge:"08",mini:"Esferas de Apolonio",cat:"FRACTAL CLÁSICO · 200 a.C.",solver:"Descartes Circle Theorem",
   title:"Las Esferas de Apolonio",sub:"La infinita compañía que llena todo vacío",
   eq:"(k₁+k₂+k₃+k₄)²=2(k₁²+k₂²+k₃²+k₄²)\nk=1/r",
   hist:"Apolonio de Pérgamo y Descartes en 1643 demostraron que siempre existen exactamente dos círculos que tocan a tres dados, permitiendo empacar infinitas esferas en cualquier vacío.",
   poem:'"En cada vacío que deja la pérdida, la geometría siembra una nueva esfera. El vacío nunca está solo: es una puerta abierta hacia el infinito que nos abraza."',
   hint:"Observa el fractal de curvatura girando suavemente"},
  {badge:"09",mini:"Conjuntos de Julia",cat:"GEOMETRÍA COMPLEJA · 1918",solver:"Smooth Escape Coloring",
   title:"El Espejo de Julia",sub:"Universos infinitos desde una ecuación cuadrática",
   eq:"z_{n+1} = z_n² + c\n|c| = 0.7885 (órbita lenta)",
   hist:"Gaston Julia, con 25 años y sin nariz (la perdió en la guerra), escribió 200 páginas a mano describiendo imágenes que nunca pudo ver. Murió sin saber lo que había creado.",
   poem:'"Un hombre sin rostro imaginó el rostro de todos los universos posibles. Cada valor del parámetro c es un cosmos completo que jamás volvió a repetirse."',
   hint:"Observa cómo el conjunto muta al orbitar el parámetro c"},
  {badge:"10",mini:"Hormiga de Langton",cat:"AUTÓMATA CELULAR · 1986",solver:"Deterministic CA Rule",
   title:"La Autopista del Caos",sub:"El orden que nace espontáneamente de dos reglas",
   eq:"Blanco→girar_derecha+pintar_negro\nNegro→girar_izquierda+pintar_blanco",
   hist:"La Hormiga de Langton produce puro caos por 10.000 pasos. En el paso 10.001, de forma completamente inesperada, comienza a construir una autopista periódica infinita sin que nadie se lo dijera.",
   poem:'"El orden no necesita arquitecto: solo necesita suficiente tiempo perdido en el caos. La autopista emerge cuando nadie la espera."',
   hint:"Observa el momento exacto en que el caos construye orden perfecto"},
  {badge:"11",mini:"Solitones KdV",cat:"ONDAS NO LINEALES · 1834",solver:"Analytical 1-Soliton Formula",
   title:"La Ola Eterna",sub:"La onda que viaja para siempre sin deformarse",
   eq:"u(x,t) = -2k² · sech²(k(x - 4k²t))\nutₓₓₓ + 6uuₓ + uₜ = 0",
   hist:"John Scott Russell vio en 1834 una ola de canal viajar millas sin dispersarse. La física oficial lo ignoró por 130 años. Zabusky y Kruskal le dieron la razón en 1965: existen ondas que viajan solas por la eternidad.",
   poem:'"Hay personas que, como estas olas, cruzan cada tormenta sin perder su forma. Colisionan, se atraviesan como fantasmas y salen intactas al otro lado."',
   hint:"Observa las olas colisionar y salir intactas"},
  {badge:"12",mini:"Voronoi",cat:"GEOMETRÍA DE LA JUSTICIA · 1908",solver:"Dirichlet Tessellation",
   title:"La Piel de la Jirafa",sub:"La partición más justa del espacio",
   eq:"Cel(sᵢ) = {x ∈ ℝⁿ : d(x,sᵢ) ≤ d(x,sⱼ) ∀j≠i}",
   hist:"Georgy Voronoi describió la partición perfecta del espacio: cada región contiene todos los puntos más cercanos a su semilla. Sin saber nada de biología, describió la piel de la jirafa, el ojo de mosca y las galaxias.",
   poem:'"La naturaleza divide el mundo de la forma más justa: a cada semilla, todo lo que está más cerca de ella. El ojo de la mosca lo sabía antes que Voronoi."',
   hint:"Las semillas se mueven; el espacio se redistribuye en tiempo real"},
  {badge:"13",mini:"Fractal de Newton",cat:"CUENCAS DE ATRACCIÓN · 1669",solver:"Newton's Method z³-1",
   title:"Los Ríos de Newton",sub:"Las fronteras del camino más corto a la verdad",
   eq:"z_{n+1} = (2z³+1)/(3z²)\nf(z) = z³-1 en ℂ",
   hist:"Newton inventó el método para encontrar raíces de ecuaciones. En el plano complejo, la frontera entre los territorios de cada raíz no es una línea limpia: es un fractal de infinita complejidad.",
   poem:'"Incluso Newton, que inventó el camino más corto a la verdad, jamás pudo saber qué camino tomará el caos para llegar a ella."',
   hint:"El fractal se construye progresivamente: cada banda es una nueva frontera"},
  {badge:"14",mini:"Celdas de Bénard",cat:"CONVECCIÓN TÉRMICA · 1900",solver:"Thermal Buoyancy Simulation",
   title:"Las Celdas del Sol",sub:"Los hexágonos que el calor dibuja sin querer",
   eq:"Ra = gαΔTL³/(νκ) > Ra_crit ≈ 1708\nNaturally-emergent hexagonal convection",
   hist:"Henri Bénard calentó aceite en una bandeja y descubrió que al superar un umbral crítico, el fluido se autoorganizaba en hexágonos perfectos: las mismas formas del panal, la superficie del Sol y los desiertos de piedra.",
   poem:'"El calor no destruye el orden: lo fabrica, siempre en hexágonos, porque esa es la forma más eficiente que el universo conoce."',
   hint:"Partículas calientes suben (arriba), frías bajan (abajo): convección natural"},
  {badge:"15",mini:"Fibración de Hopf",cat:"TOPOLOGÍA 4D · 1931",solver:"Stereographic S³→R³ Projection",
   title:"La Danza de los Cuatro Mundos",sub:"La esfera de cuatro dimensiones proyectada en luz",
   eq:"π: S³→S² · Fibras: (η,ξ₁,ξ₂)→círculos de S³\n(x₁,x₂,x₃,x₄)→(x₁,x₂,x₃)/(1-x₄)",
   hist:"Heinz Hopf demostró en 1931 que la esfera 4D puede desmontarse en círculos perfectos que se entrelazan sin cortarse jamás, de una forma imposible en tres dimensiones.",
   poem:'"Hay dimensiones que no podemos ver pero cuya sombra, al caer sobre nuestra realidad, es la forma más hermosa que jamás imaginamos."',
   hint:"Anillos 4D entrelazados proyectados a 3D; giran continuamente"},
  {badge:"16",mini:"Helecho de Barnsley",cat:"SISTEMAS IFS · 1988",solver:"Chaos Game 4-Transform IFS",
   title:"El Juego del Caos",sub:"El orden perfecto que emerge del azar puro",
   eq:"f₁: [0,0;0,.16] p=0.01 · f₂: [.85,.04;-.04,.85] p=0.85\nf₃: [.2,-.26;.23,.22] p=0.07 · f₄: [-.15,.28;.26,.24] p=0.07",
   hist:"Michael Barnsley demostró en 1988 que cuatro transformaciones aleatorias con probabilidades exactas convergen siempre al mismo fractal: un helecho perfecto. El azar puro, bien encauzado, construye orden biológico.",
   poem:'"Tres instrucciones simples y un dado bastan para dibujar la misma hoja de helecho que la naturaleza tardó millones de años en diseñar."',
   hint:"4000 puntos aleatorios por frame convergiendo al helecho de Barnsley"},
  {badge:"17",mini:"Espiral de Fibonacci",cat:"FILOTAXIS ÁUREA · 1202",solver:"Golden Angle Phyllotaxis",
   title:"Las Flores del Girasol",sub:"La ley secreta del crecimiento de las plantas",
   eq:"θₙ = n · 137.508°  (ángulo áureo)\nrₙ = c√n",
   hist:"En 1202, Fibonacci contó conejos. Nadie imaginó que su secuencia 1,1,2,3,5,8... aparecería 800 años después en las semillas del girasol, piñón, caracol y galaxias espirales.",
   poem:'"La flor no sabe matemáticas: solo crece de la forma más eficiente posible. En esa eficiencia está la belleza más antigua del universo."',
   hint:"Cada semilla se planta en el ángulo áureo exacto (137.508°)"},
  {badge:"18",mini:"Belousov-Zhabotinsky",cat:"OSCILACIÓN QUÍMICA · 1951",solver:"Gray-Scott Reaction-Diffusion",
   title:"Las Espirales Químicas",sub:"El latido del universo en un tubo de ensayo",
   eq:"∂u/∂t = Dᵤ∇²u - uv² + F(1-u)\n∂v/∂t = Dᵥ∇²v + uv² - (F+k)v",
   hist:"En 1951, Belousov descubrió una reacción que pulsaba sola entre rojo y azul. Sus colegas la rechazaron por 'imposible'. Era correcta: el corazón humano late usando el mismo mecanismo.",
   poem:'"El corazón late usando la misma ecuación que Belousov descubrió en un tubo de ensayo. Cada latido tuyo es una reacción química que se negó a detenerse."',
   hint:"Espirales químicas vivas; haz clic para sembrar nuevos focos de oscilación"},
  {badge:"19",mini:"Onda de Schrödinger",cat:"MECÁNICA CUÁNTICA · 1926",solver:"Gaussian Wavepacket Analytical",
   title:"El Colapso de la Ola Cuántica",sub:"La probabilidad que pinta el universo antes de ser observado",
   eq:"iℏ ∂ψ/∂t = -ℏ²/2m ∇²ψ + Vψ\n|ψ(x,t)|² = densidad de probabilidad",
   hist:"En 1926, Schrödinger escribió la ecuación que describe la probabilidad de encontrar un electrón. La solución es una ola que existe en todas partes simultáneamente hasta que alguien la observa.",
   poem:'"Antes de ser mirado, el electrón existe en todos los lugares a la vez. Lo mismo ocurre con las decisiones no tomadas: existen como olas hasta que elegimos."',
   hint:"Tres paquetes gaussianos interfiriendo en el espacio cuántico"},
  {badge:"20",mini:"Regla 110",cat:"COMPUTACIÓN UNIVERSAL · 1983",solver:"Wolfram Turing-Complete CA",
   title:"El Laberinto Perfecto",sub:"El programa más simple que puede calcular todo",
   eq:"Regla 110: 111→0 · 110→1 · 101→1 · 100→0\n011→1 · 010→1 · 001→1 · 000→0",
   hist:"Wolfram estudió 256 autómatas celulares de 1D. La Regla 110 resultó ser Turing-completa: con una sola regla de tres vecinos, puede calcular cualquier cosa que una computadora pueda calcular.",
   poem:'"Una sola celda negra en un mar blanco. Una sola regla. Y de eso nace todo lo que una mente puede imaginar o calcular en el universo."',
   hint:"Una celda inicial genera un patrón computacionalmente universal"},

  // ── 21 A 24: ENIGMAS DEL MILENIO & CONJETURAS ──
  {badge:"21",mini:"Ceros de Riemann",cat:"PROBLEMA DEL MILENIO · 1859",solver:"Riemann-Siegel Critical Spiral",
   title:"Los Ceros de Riemann",sub:"El enigma de un millón de dólares en la línea crítica",
   eq:"ζ(s) = ∑ 1/nˢ = 0  ⇒  Re(s) = 1/2\nZ(t) cruza el origen exactamente en t₁, t₂, t₃...",
   hist:"En 1859, Bernhard Riemann conjeturó que todos los ceros no triviales de su función Zeta yacen en la línea crítica Re(s)=1/2. Es el problema no resuelto más famoso del mundo: gobierna la distribución de todos los números primos.",
   poem:'"Una cuerda de luz tensada a través de la nada que gira en el espacio y besa el cero absoluto en cada número primo del universo."',
   hint:"Observa los destellos expansivos cada vez que la curva cruza un cero no trivial"},
  {badge:"22",mini:"Desierto de Beal",cat:"CONJETURA DE BEAL · 1993",solver:"Logarithmic Power Lattice",
   title:"El Desierto de Beal",sub:"La repulsión matemática entre potencias coprimas",
   eq:"Aˣ + Bʸ = Cᶻ  con  x,y,z > 2\n⇒  mcd(A,B,C) > 1 (Premio $1.000.000 USD)",
   hist:"El banquero Andrew Beal ofreció $1.000.000 USD a quien demuestre que Aˣ + Bʸ = Cᶻ exige un factor primo común. Si buscas soluciones coprimas, la matemática te expulsa: se crea un vacío donde nada puede tocarse.",
   poem:'"En el desierto de las potencias puras, los números solitarios jamás logran sumarse. Solo aquellos que comparten la misma sangre prima pueden abrazarse en la geometría."',
   hint:"Constelaciones ordenadas (factor común) vs Desierto vacío (exclusión coprima)"},
  {badge:"23",mini:"Navier-Stokes",cat:"PROBLEMA DEL MILENIO · 1845",solver:"3D Vortex Filament Stretching",
   title:"Vórtices de Navier-Stokes",sub:"El misterio de la turbulencia y las velocidades infinitas",
   eq:"∂u/∂t + (u·∇)u = -∇p/ρ + ν∇²u\n¿Puede la vorticidad ω = ∇×u explotar a infinito?",
   hist:"Claude Navier y George Stokes formularon las ecuaciones que gobiernan el agua y el aire. El Instituto Clay ofrece $1.000.000 USD a quien demuestre si un fluido puede desarrollar singularidades de energía infinita.",
   poem:'"Tubos de remolinos microscópicos que se estiran y trenzan como músculos de luz, disipando la furia del océano en un polvo de chispas estelares."',
   hint:"Filamentos de vórtice entrelazados estirándose y liberando chispas turbulentas"},
  {badge:"24",mini:"Flujo de Ricci",cat:"PROBLEMA DEL MILENIO · 2002",solver:"Perelman Metric Smoothing S³",
   title:"El Flujo de Ricci de Poincaré",sub:"La redondez cósmica que resolvió Grigori Perelman",
   eq:"∂g_ij/∂t = -2 R_ij\nDeformación métrica hacia la esfera perfecta S³",
   hist:"En 1904 Henri Poincaré planteó su conjetura sobre la esfera tridimensional. En 2002, el ermitaño ruso Grigori Perelman la resolvió usando el Flujo de Ricci... y rechazó la Medalla Fields y el millón de dólares.",
   poem:'"El calor geométrico plancha cada arruga del espacio, redondeando la imperfección de la materia hasta devolverla a la pureza de la primera esfera."',
   hint:"Observa cómo el flujo alisa las arrugas del espacio hacia la esfera perfecta"}
];

// ═══════════════════════════════════════════════════════════════════
// ORQUESTACIÓN
// ═══════════════════════════════════════════════════════════════════
const INITS =[init01,init02,init03,init04,init05,init06,init07,init08,init09,init10,init11,init12,init13,init14,init15,init16,init17,init18,init19,init20,init21,init22,init23,init24];
const STEPS =[step01,step02,step03,step04,step05,step06,step07,step08,step09,step10,step11,step12,step13,step14,step15,step16,step17,step18,step19,step20,step21,step22,step23,step24];


  // API Pública Soberana
  root.AtelierMath = {
    ARTWORKS: ARTWORKS,
    INITS: INITS,
    STEPS: STEPS,
    bindCanvas: function(c, width, height) {
      canvas = c;
      ctx = canvas.getContext("2d");
      if (width && height) {
        W = canvas.width = width;
        H = canvas.height = height;
      } else {
        W = canvas.width;
        H = canvas.height;
      }
    },
    resize: function(width, height) {
      if (width && height) {
        W = canvas.width = width;
        H = canvas.height = height;
      } else if (canvas && canvas.parentElement) {
        const r = canvas.parentElement.getBoundingClientRect();
        W = canvas.width = r.width | 0;
        H = canvas.height = (r.height - 8) | 0;
      }
    },
    init: function(idx) {
      if (INITS[idx]) INITS[idx]();
    },
    step: function(idx) {
      if (STEPS[idx]) STEPS[idx]();
    },
    setPalette: function(pal) {
      currentPal = (pal % 4 + 4) % 4;
    },
    getPalette: function() {
      return currentPal;
    },
    setChladniModes: function(m, n) {
      if (typeof chM !== "undefined") chM = Math.max(1, Math.min(8, m));
      if (typeof chN !== "undefined") chN = Math.max(1, Math.min(8, n));
    },
    getChladniModes: function() {
      return { m: typeof chM !== "undefined" ? chM : 3, n: typeof chN !== "undefined" ? chN : 5 };
    },
    handlePointer: function(type, x, y, dx, dy, artIdx) {
      mouseX = x; mouseY = y;
      if (type === "down") {
        isDrag = true; dragX = x; dragY = y; mouseDown = true;
        if (artIdx === 5 && typeof tAgents !== "undefined") {
          tAgents.push({x, y, angle: Math.random()*Math.PI*2, sp: 0, pts: []});
        }
        if (artIdx === 17 && typeof bzU !== "undefined" && bzU) {
          const bx = x / 4 | 0, by = y / 4 | 0;
          for (let ddy = -4; ddy < 5; ddy++) {
            for (let ddx = -4; ddx < 5; ddx++) {
              const idx = (by + ddy) * bzBW + (bx + ddx);
              if (idx >= 0 && idx < bzU.length) { bzU[idx] = 0.5; bzV[idx] = 0.25; }
            }
          }
        }
      } else if (type === "move") {
        if (artIdx === 4 && typeof chM !== "undefined") {
          chM = Math.max(1, Math.min(8, Math.floor((x / W) * 8) + 1));
          chN = Math.max(1, Math.min(8, Math.floor((y / H) * 8) + 1));
        }
        if (isDrag) {
          if ((artIdx === 0 || artIdx === 6 || artIdx === 14) && typeof lRotZ !== "undefined") {
            lRotZ += dx * 0.005; lRotX += dy * 0.005; if (typeof rRot !== "undefined") rRot += dx * 0.005;
          }
          if (artIdx === 20 && typeof rieRot !== "undefined") rieRot += dx * 0.005;
          if (artIdx === 22 && typeof nsRot !== "undefined") nsRot += dx * 0.005;
          if (artIdx === 23 && typeof ricciAngle !== "undefined") ricciAngle += dx * 0.005;
        }
      } else if (type === "up") {
        isDrag = false; mouseDown = false;
      }
    }
  };
})(typeof window !== "undefined" ? window : global);
