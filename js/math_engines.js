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
// LOS 10 ARQUETIPOS MATEMÁTICOS PARA LAS 100 OBRAS DEL CANON
// FÍSICA COMPUTACIONAL EN SILICIO NATIVO · TIMONEL F2
// ═══════════════════════════════════════════════════════════════════

// Variables compartidas de arquetipos
let archT = 0;
let archState = {};

// Helper: Trazo con desvanecimiento alfa
function trailFade(alpha = 0.055) {
  ctx.fillStyle = `rgba(4,2,12,${alpha})`;
  ctx.fillRect(0, 0, W, H);
}

// ───────────────────────────────────────────────────────────────────
// 1. ARQUETIPO: DINÁMICA CELESTE, GEODÉSICAS & COSMOLOGÍA (celestial)
// ───────────────────────────────────────────────────────────────────
let celBodies = [], celCenter = {x: 0, y: 0}, celRot = 0;
function init_archetype_celestial(idx) {
  celCenter = { x: W * 0.5, y: H * 0.5 };
  celRot = 0;
  celBodies = [];
  const seed = (idx * 37) % 100;
  const count = (idx === 64) ? 24 : 6; // Para agujero negro más fotones
  for (let i = 0; i < count; i++) {
    const a = (W * 0.08) + i * (W * 0.06);
    const e = 0.15 + ((seed + i * 19) % 55) * 0.01;
    const b = a * Math.sqrt(Math.max(0.01, 1 - e * e));
    const omega = 0.012 / Math.pow(a / (W * 0.08), 1.5);
    celBodies.push({
      a, b, e, omega, theta: (i * Math.PI * 2) / count,
      pts: [], maxPts: 300,
      mass: 1.0 + i * 0.5,
      rSize: 2.5 + (i % 3) * 1.5
    });
  }
  archState[idx] = { center: celCenter, t: 0 };
}

function step_archetype_celestial(idx) {
  trailFade(0.05);
  celRot += 0.001;
  const cx = celCenter.x, cy = celCenter.y;
  const palFunc = PALS_CSS[currentPal];

  // Núcleo o Singularidad central
  if (idx === 64) {
    // Agujero Negro de Schwarzschild
    const rs = W * 0.045;
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, rs * 1.5, 0, Math.PI * 2);
    ctx.strokeStyle = palFunc(0.9);
    ctx.lineWidth = 1.5;
    ctx.stroke();
    // Esfera de fotones y sombra del horizonte
    ctx.beginPath();
    ctx.arc(cx, cy, rs, 0, Math.PI * 2);
    ctx.fillStyle = '#020204';
    ctx.fill();
    ctx.strokeStyle = palFunc(0.3);
    ctx.lineWidth = 2.0;
    ctx.stroke();
    ctx.restore();
  } else {
    // Foco gravitacional / Sol
    const grad = ctx.createRadialGradient(cx, cy, 2, cx, cy, W * 0.05);
    grad.addColorStop(0, palFunc(0.95));
    grad.addColorStop(0.4, palFunc(0.5));
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy, W * 0.05, 0, Math.PI * 2);
    ctx.fill();
  }

  // Órbitas y cuerpos
  for (let i = 0; i < celBodies.length; i++) {
    const b = celBodies[i];
    b.theta += b.omega;
    const r = (b.a * (1 - b.e * b.e)) / (1 + b.e * Math.cos(b.theta));
    const px = cx + r * Math.cos(b.theta + celRot);
    const py = cy + r * Math.sin(b.theta + celRot);

    b.pts.push([px, py]);
    if (b.pts.length > b.maxPts) b.pts.shift();

    // Área barrida (Kepler II) para idx === 6
    if (idx === 6 && i === 1 && b.pts.length > 10) {
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      const startP = b.pts[Math.max(0, b.pts.length - 25)];
      ctx.lineTo(startP[0], startP[1]);
      for (let k = b.pts.length - 24; k < b.pts.length; k++) {
        ctx.lineTo(b.pts[k][0], b.pts[k][1]);
      }
      ctx.closePath();
      ctx.fillStyle = palFunc(0.25);
      ctx.fill();
    }

    // Traza orbital
    if (b.pts.length > 2) {
      ctx.beginPath();
      ctx.moveTo(b.pts[0][0], b.pts[0][1]);
      for (let j = 1; j < b.pts.length; j++) {
        ctx.lineTo(b.pts[j][0], b.pts[j][1]);
      }
      ctx.strokeStyle = palFunc((i / celBodies.length) * 0.7 + 0.2);
      ctx.lineWidth = 1.0;
      ctx.stroke();
    }

    // Cuerpo celeste
    ctx.beginPath();
    ctx.arc(px, py, b.rSize, 0, Math.PI * 2);
    ctx.fillStyle = palFunc(0.85);
    ctx.fill();
  }
}

// ───────────────────────────────────────────────────────────────────
// 2. ARQUETIPO: ONDAS, INTERFERENCIA & CUÁNTICA ONDULATORIA (wave)
// ───────────────────────────────────────────────────────────────────
let waveRays = [], waveT = 0;
function init_archetype_wave(idx) {
  waveT = 0;
  waveRays = [];
  const count = (idx === 35) ? 12 : 28; // Solitones KdV o Armónicos D'Alembert
  for (let i = 0; i < count; i++) {
    waveRays.push({
      amp: (H * 0.04) + (i % 5) * (H * 0.015),
      freq: 0.008 + (i * 0.0025),
      speed: 0.02 + (i % 3) * 0.015,
      phase: (i * Math.PI) / count,
      yBase: H * 0.15 + (i / count) * (H * 0.7)
    });
  }
}

function step_archetype_wave(idx) {
  trailFade(0.06);
  waveT += 0.025;
  const palFunc = PALS_CSS[currentPal];

  if (idx === 35) {
    // Solitones KdV: Dos crestas solitarias que colisionan y pasan limpias
    const c1 = 4.0, c2 = 1.5;
    const xMid = W * 0.5;
    const tCycle = (waveT * 40) % (W * 1.4) - (W * 0.7);

    ctx.lineWidth = 2.0;
    for (let layer = 0; layer < 5; layer++) {
      ctx.beginPath();
      const y0 = H * 0.5 + (layer - 2) * (H * 0.08);
      for (let x = 0; x < W; x += 4) {
        const xi1 = (x - xMid - tCycle * 1.5) * 0.025;
        const xi2 = (x - xMid + tCycle * 0.8) * 0.035;
        const s1 = 1 / Math.cosh(xi1);
        const s2 = 1 / Math.cosh(xi2);
        const eta = (H * 0.14) * (s1 * s1) + (H * 0.09) * (s2 * s2);
        const y = y0 - eta * Math.cos(layer * 0.4);
        if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = palFunc(0.3 + layer * 0.15);
      ctx.stroke();
    }
  } else if (idx === 38) {
    // Efecto Doppler: Fuente móvil emitiendo ondas circulares que se comprimen
    const srcX = W * 0.3 + Math.sin(waveT * 0.5) * (W * 0.25);
    const srcY = H * 0.5;
    ctx.lineWidth = 1.5;
    for (let r = 10; r < W * 0.65; r += 28) {
      const age = (r + waveT * 35) % (W * 0.65);
      const emitX = srcX - (age * 0.3); // Desplazamiento Doppler
      ctx.beginPath();
      ctx.arc(emitX, srcY, age, 0, Math.PI * 2);
      ctx.strokeStyle = palFunc(Math.max(0.1, 1 - age / (W * 0.65)));
      ctx.stroke();
    }
    // Fuente
    ctx.beginPath();
    ctx.arc(srcX, srcY, 5, 0, Math.PI * 2);
    ctx.fillStyle = palFunc(0.95);
    ctx.fill();
  } else {
    // Ondas viajeras armónicas D'Alembert & De Broglie / Schrödinger
    for (let i = 0; i < waveRays.length; i++) {
      const w = waveRays[i];
      ctx.beginPath();
      const nPts = 120;
      for (let j = 0; j <= nPts; j++) {
        const x = (j / nPts) * W;
        // Paquete de onda gaussiano si es cuántico (idx 65, 66)
        let env = 1.0;
        if (idx === 65 || idx === 66) {
          const dx = (x - W * 0.5) / (W * 0.22);
          env = Math.exp(-dx * dx);
        }
        const y = w.yBase + Math.sin(x * w.freq + waveT * w.speed + w.phase) * w.amp * env;
        if (j === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = palFunc((i / waveRays.length) * 0.8 + 0.15);
      ctx.lineWidth = 1.2;
      ctx.stroke();
    }
  }
}

// ───────────────────────────────────────────────────────────────────
// 3. ARQUETIPO: LÍNEAS DE CAMPO & ELECTROMAGNETISMO (field)
// ───────────────────────────────────────────────────────────────────
let fieldParticles = [], fieldT = 0;
function init_archetype_field(idx) {
  fieldT = 0;
  fieldParticles = [];
  const N = 320;
  for (let i = 0; i < N; i++) {
    fieldParticles.push({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: 0, vy: 0,
      life: Math.random() * 200,
      maxLife: 150 + Math.random() * 150
    });
  }
}

function step_archetype_field(idx) {
  trailFade(0.05);
  fieldT += 0.02;
  const palFunc = PALS_CSS[currentPal];

  // Polos de carga / imán
  const q1 = { x: W * 0.35 + Math.cos(fieldT * 0.6) * (W * 0.08), y: H * 0.5, q: +1.0 };
  const q2 = { x: W * 0.65 - Math.cos(fieldT * 0.6) * (W * 0.08), y: H * 0.5, q: -1.0 };

  // Dibujar electrodos / cargas
  ctx.beginPath();
  ctx.arc(q1.x, q1.y, 7, 0, Math.PI * 2);
  ctx.fillStyle = palFunc(0.95);
  ctx.fill();

  ctx.beginPath();
  ctx.arc(q2.x, q2.y, 7, 0, Math.PI * 2);
  ctx.fillStyle = palFunc(0.4);
  ctx.fill();

  // Partículas siguiendo líneas de fuerza E o espirales de Lorentz
  ctx.lineWidth = 1.2;
  for (let i = 0; i < fieldParticles.length; i++) {
    const p = fieldParticles[i];
    const dx1 = p.x - q1.x, dy1 = p.y - q1.y;
    const d1 = Math.max(20, Math.hypot(dx1, dy1));
    const dx2 = p.x - q2.x, dy2 = p.y - q2.y;
    const d2 = Math.max(20, Math.hypot(dx2, dy2));

    // Campo dipolar E
    let ex = (q1.q * dx1) / (d1 * d1 * d1) + (q2.q * dx2) / (d2 * d2 * d2);
    let ey = (q1.q * dy1) / (d1 * d1 * d1) + (q2.q * dy2) / (d2 * d2 * d2);

    if (idx === 45) {
      // Fuerza de Lorentz v x B (rotación perpendicular helicoidal)
      const bx = -ey * 12000, by = ex * 12000;
      ex = bx; ey = by;
    } else {
      ex *= 18000; ey *= 18000;
    }

    const norm = Math.hypot(ex, ey) || 1;
    const sp = Math.min(6, Math.max(1.2, 400 / norm));
    const nx = p.x + (ex / norm) * sp;
    const ny = p.y + (ey / norm) * sp;

    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
    ctx.lineTo(nx, ny);
    ctx.strokeStyle = palFunc((p.life / p.maxLife) * 0.7 + 0.2);
    ctx.stroke();

    p.x = nx; p.y = ny;
    p.life++;
    if (p.life > p.maxLife || p.x < 0 || p.x > W || p.y < 0 || p.y > H || d1 < 8 || d2 < 8) {
      p.x = q1.x + (Math.random() - 0.5) * 30;
      p.y = q1.y + (Math.random() - 0.5) * 30;
      p.life = 0;
    }
  }
}

// ───────────────────────────────────────────────────────────────────
// 4. ARQUETIPO: DINÁMICA DE FLUIDOS & CONVECCIÓN (fluid)
// ───────────────────────────────────────────────────────────────────
let flParticles = [], flT = 0;
function init_archetype_fluid(idx) {
  flT = 0;
  flParticles = [];
  const N = 400;
  for (let i = 0; i < N; i++) {
    flParticles.push({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: 2 + Math.random() * 2,
      vy: 0,
      size: 1.5 + Math.random() * 2.0
    });
  }
}

function step_archetype_fluid(idx) {
  trailFade(0.06);
  flT += 0.02;
  const palFunc = PALS_CSS[currentPal];

  if (idx === 21) {
    // Venturi: Flujo acelerando en el cuello estrecho (Bernoulli)
    ctx.strokeStyle = 'rgba(255,255,255,0.12)';
    ctx.lineWidth = 1.5;
    // Dibujar paredes del tubo de Venturi
    ctx.beginPath();
    ctx.moveTo(0, H * 0.2);
    ctx.bezierCurveTo(W * 0.35, H * 0.2, W * 0.45, H * 0.38, W * 0.5, H * 0.38);
    ctx.bezierCurveTo(W * 0.55, H * 0.38, W * 0.65, H * 0.2, W, H * 0.2);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, H * 0.8);
    ctx.bezierCurveTo(W * 0.35, H * 0.8, W * 0.45, H * 0.62, W * 0.5, H * 0.62);
    ctx.bezierCurveTo(W * 0.55, H * 0.62, W * 0.65, H * 0.8, W, H * 0.8);
    ctx.stroke();

    for (let i = 0; i < flParticles.length; i++) {
      const p = flParticles[i];
      const normX = p.x / W;
      // Perfil del tubo
      const neckFactor = Math.exp(-Math.pow((normX - 0.5) / 0.15, 2));
      const speed = 2.0 + neckFactor * 7.5; // Acelera en el cuello
      const yHalfWidth = (H * 0.3) - neckFactor * (H * 0.18);
      const yTarget = H * 0.5 + ((p.y - H * 0.5) * 0.98);

      p.x += speed;
      p.y += (yTarget - p.y) * 0.05;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = palFunc(0.2 + (speed / 9.5) * 0.75);
      ctx.fill();

      if (p.x > W) { p.x = 0; p.y = H * 0.25 + Math.random() * (H * 0.5); }
    }
  } else {
    // Convección o Langevin Brownian Motion
    for (let i = 0; i < flParticles.length; i++) {
      const p = flParticles[i];
      // Celdas de Rayleigh-Bénard: vórtices contrarrotantes
      const u = Math.sin((p.x / W) * Math.PI * 4) * Math.cos((p.y / H) * Math.PI * 2);
      const v = -Math.cos((p.x / W) * Math.PI * 4) * Math.sin((p.y / H) * Math.PI * 2);

      p.x += u * 3.5;
      p.y += v * 3.5;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = palFunc(0.3 + (Math.abs(u) + Math.abs(v)) * 0.45);
      ctx.fill();

      if (p.x < 0 || p.x > W || p.y < 0 || p.y > H) {
        p.x = Math.random() * W; p.y = Math.random() * H;
      }
    }
  }
}

// ───────────────────────────────────────────────────────────────────
// 5. ARQUETIPO: TERMODINÁMICA & ESTADÍSTICA (thermo)
// ───────────────────────────────────────────────────────────────────
let thParticles = [], thT = 0;
function init_archetype_thermo(idx) {
  thT = 0;
  thParticles = [];
  const N = 120;
  for (let i = 0; i < N; i++) {
    thParticles.push({
      x: W * 0.2 + Math.random() * (W * 0.6),
      y: H * 0.2 + Math.random() * (H * 0.5),
      vx: (Math.random() - 0.5) * 5,
      vy: (Math.random() - 0.5) * 5,
      r: 2.5
    });
  }
}

function step_archetype_thermo(idx) {
  trailFade(0.06);
  thT += 0.02;
  const palFunc = PALS_CSS[currentPal];

  if (idx === 32) {
    // Ciclo de Carnot: Diagrama P-V animado con 4 etapas isotérmicas/adiabáticas
    const cx = W * 0.2, cy = H * 0.8;
    const axW = W * 0.6, axH = H * 0.55;

    // Ejes P y V
    ctx.strokeStyle = 'rgba(255,255,255,0.25)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(cx, cy - axH); ctx.lineTo(cx, cy); ctx.lineTo(cx + axW, cy);
    ctx.stroke();

    // 4 vértices del ciclo
    const pA = [cx + axW * 0.2, cy - axH * 0.85];
    const pB = [cx + axW * 0.55, cy - axH * 0.65];
    const pC = [cx + axW * 0.85, cy - axH * 0.25];
    const pD = [cx + axW * 0.45, cy - axH * 0.35];

    ctx.beginPath();
    ctx.moveTo(pA[0], pA[1]);
    ctx.quadraticCurveTo(cx + axW * 0.35, cy - axH * 0.78, pB[0], pB[1]); // Isoterma caliente
    ctx.quadraticCurveTo(cx + axW * 0.72, cy - axH * 0.42, pC[0], pC[1]); // Adiabática expansión
    ctx.quadraticCurveTo(cx + axW * 0.62, cy - axH * 0.28, pD[0], pD[1]); // Isoterma fría
    ctx.quadraticCurveTo(cx + axW * 0.3, cy - axH * 0.55, pA[0], pA[1]); // Adiabática compresión
    ctx.strokeStyle = palFunc(0.7);
    ctx.lineWidth = 2.0;
    ctx.stroke();
    ctx.fillStyle = palFunc(0.12);
    ctx.fill();

    // Punto de estado circulando por el ciclo
    const loopT = (thT * 0.8) % 4.0;
    let stX = pA[0], stY = pA[1];
    if (loopT < 1.0) {
      const f = loopT;
      stX = pA[0] + (pB[0] - pA[0]) * f;
      stY = pA[1] + (pB[1] - pA[1]) * f;
    } else if (loopT < 2.0) {
      const f = loopT - 1.0;
      stX = pB[0] + (pC[0] - pB[0]) * f;
      stY = pB[1] + (pC[1] - pB[1]) * f;
    } else if (loopT < 3.0) {
      const f = loopT - 2.0;
      stX = pC[0] + (pD[0] - pC[0]) * f;
      stY = pC[1] + (pD[1] - pC[1]) * f;
    } else {
      const f = loopT - 3.0;
      stX = pD[0] + (pA[0] - pD[0]) * f;
      stY = pD[1] + (pA[1] - pD[1]) * f;
    }

    ctx.beginPath();
    ctx.arc(stX, stY, 6, 0, Math.PI * 2);
    ctx.fillStyle = palFunc(0.95);
    ctx.fill();
  } else {
    // Gas cinético de Boltzmann / Maxwell
    const bx = W * 0.2, by = H * 0.25, bw = W * 0.6, bh = H * 0.5;
    ctx.strokeStyle = 'rgba(255,255,255,0.2)';
    ctx.strokeRect(bx, by, bw, bh);

    for (let i = 0; i < thParticles.length; i++) {
      const p = thParticles[i];
      p.x += p.vx; p.y += p.vy;

      if (p.x < bx + p.r || p.x > bx + bw - p.r) p.vx *= -1;
      if (p.y < by + p.r || p.y > by + bh - p.r) p.vy *= -1;

      const sp = Math.hypot(p.vx, p.vy);
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = palFunc(Math.min(1.0, sp / 5));
      ctx.fill();
    }
  }
}

// ───────────────────────────────────────────────────────────────────
// 6. ARQUETIPO: ESPACIOTIEMPO, RELATIVIDAD & GEOMETRÍA RIEMANNIANA (spacetime)
// ───────────────────────────────────────────────────────────────────
let stRot = 0;
function init_archetype_spacetime(idx) {
  stRot = 0;
}

function step_archetype_spacetime(idx) {
  trailFade(0.06);
  stRot += 0.008;
  const palFunc = PALS_CSS[currentPal];
  const cx = W * 0.5, cy = H * 0.5;

  if (idx === 55 || idx === 63) {
    // Cono de luz de Minkowski y transformación hiperbólica
    const beta = Math.sin(stRot * 0.5) * 0.65; // Velocidad v/c
    const gamma = 1 / Math.sqrt(1 - beta * beta);

    // Cono de luz (líneas a 45 grados)
    ctx.strokeStyle = 'rgba(255,255,255,0.25)';
    ctx.lineWidth = 1.0;
    ctx.beginPath();
    ctx.moveTo(cx - W * 0.4, cy - W * 0.4); ctx.lineTo(cx + W * 0.4, cy + W * 0.4);
    ctx.moveTo(cx - W * 0.4, cy + W * 0.4); ctx.lineTo(cx + W * 0.4, cy - W * 0.4);
    ctx.stroke();

    // Malla espaciotemporal inclinada por Lorentz
    const steps = 14;
    ctx.lineWidth = 0.8;
    for (let k = -steps; k <= steps; k++) {
      const val = k * (W * 0.025);
      // Líneas de simultaneidad ct'
      ctx.beginPath();
      const x1 = -W * 0.35, t1 = val + beta * x1;
      const x2 = W * 0.35, t2 = val + beta * x2;
      ctx.moveTo(cx + x1, cy - t1); ctx.lineTo(cx + x2, cy - t2);
      ctx.strokeStyle = palFunc(0.35);
      ctx.stroke();

      // Líneas de posición x'
      ctx.beginPath();
      const tA = -H * 0.3, xA = val + beta * tA;
      const tB = H * 0.3, xB = val + beta * tB;
      ctx.moveTo(cx + xA, cy - tA); ctx.lineTo(cx + xB, cy - tB);
      ctx.strokeStyle = palFunc(0.55);
      ctx.stroke();
    }
  } else {
    // Malla métrica riemanniana deformada por masa central (Einstein Field)
    const gridSize = 18;
    const spacing = Math.min(W, H) * 0.045;
    ctx.lineWidth = 1.0;

    for (let r = -gridSize; r <= gridSize; r++) {
      ctx.beginPath();
      for (let c = -gridSize; c <= gridSize; c++) {
        const ox = c * spacing, oy = r * spacing;
        const d = Math.hypot(ox, oy) + 20;
        // Curvatura gravitacional g_00
        const warp = 1.0 - (W * 0.12) / d;
        const px = cx + ox * warp;
        const py = cy + oy * warp;
        if (c === -gridSize) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.strokeStyle = palFunc(0.4);
      ctx.stroke();
    }
  }
}

// ───────────────────────────────────────────────────────────────────
// 7. ARQUETIPO: FÍSICA CUÁNTICA & MODELO ESTÁNDAR (quantum)
// ───────────────────────────────────────────────────────────────────
let qAngle = 0;
function init_archetype_quantum(idx) {
  qAngle = 0;
}

function step_archetype_quantum(idx) {
  trailFade(0.06);
  qAngle += 0.02;
  const palFunc = PALS_CSS[currentPal];
  const cx = W * 0.5, cy = H * 0.5;

  if (idx === 79) {
    // Mecanismo de Higgs: Sombrero Mexicano con ruptura espontánea de simetría
    ctx.lineWidth = 1.2;
    for (let ring = 1; ring <= 10; ring++) {
      const phi = (ring / 10) * 1.8;
      // Potencial V = -mu^2 phi^2 + lambda phi^4
      const V = -1.2 * phi * phi + 0.45 * Math.pow(phi, 4);
      const r = ring * (W * 0.038);
      const yOffset = V * (H * 0.18);

      ctx.beginPath();
      ctx.ellipse(cx, cy + yOffset, r, r * 0.45, 0, 0, Math.PI * 2);
      ctx.strokeStyle = palFunc(0.2 + (ring / 10) * 0.65);
      ctx.stroke();
    }

    // Partícula del bosón rodando en el valle mínimo (VEV)
    const vevR = 6.8 * (W * 0.038);
    const vevY = (-1.2 * Math.pow(6.8/10*1.8, 2) + 0.45 * Math.pow(6.8/10*1.8, 4)) * (H * 0.18);
    const bx = cx + Math.cos(qAngle) * vevR;
    const by = cy + vevY + Math.sin(qAngle) * (vevR * 0.45);

    ctx.beginPath();
    ctx.arc(bx, by, 7, 0, Math.PI * 2);
    ctx.fillStyle = palFunc(0.95);
    ctx.fill();
  } else {
    // Modelo Estándar & Cuantos de Planck: Mandala de calibre SU(3)xSU(2)xU(1)
    const sectors = 12;
    for (let s = 0; s < sectors; s++) {
      const a = (s * Math.PI * 2) / sectors + qAngle * 0.3;
      const r = W * 0.28;
      const px = cx + Math.cos(a) * r;
      const py = cy + Math.sin(a) * r;

      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(px, py);
      ctx.strokeStyle = palFunc(0.3);
      ctx.lineWidth = 1.0;
      ctx.stroke();

      // Nódulo de partícula
      ctx.beginPath();
      ctx.arc(px, py, 6, 0, Math.PI * 2);
      ctx.fillStyle = palFunc(0.5 + (s % 3) * 0.22);
      ctx.fill();
    }

    // Anillos concéntricos de gauge
    [0.12, 0.2, 0.28, 0.36].forEach((f, k) => {
      ctx.beginPath();
      ctx.arc(cx, cy, W * f, 0, Math.PI * 2);
      ctx.strokeStyle = palFunc(0.3 + k * 0.2);
      ctx.lineWidth = 1.5;
      ctx.stroke();
    });
  }
}

// ───────────────────────────────────────────────────────────────────
// 8. ARQUETIPO: AUTÓMATAS, COMPUTACIÓN & LÓGICA (automata)
// ───────────────────────────────────────────────────────────────────
let autoHistory = [], autoCols = 80, autoRows = 90;
function init_archetype_automata(idx) {
  autoHistory = [];
  autoCols = 80;
  // Inicializar fila inicial con una sola semilla viva en el centro
  const firstRow = new Uint8Array(autoCols);
  firstRow[autoCols >> 1] = 1;
  autoHistory.push(firstRow);
  for (let r = 1; r < autoRows; r++) {
    const prev = autoHistory[r - 1];
    const next = new Uint8Array(autoCols);
    for (let c = 0; c < autoCols; c++) {
      const left = c > 0 ? prev[c - 1] : 0;
      const self = prev[c];
      const right = c < autoCols - 1 ? prev[c + 1] : 0;
      const pattern = (left << 2) | (self << 1) | right;
      // Regla 110: 01101110 en binario = 110
      next[c] = (110 & (1 << pattern)) ? 1 : 0;
    }
    autoHistory.push(next);
  }
}

function step_archetype_automata(idx) {
  trailFade(0.08);
  const palFunc = PALS_CSS[currentPal];
  const cellW = W / autoCols;
  const cellH = H / autoRows;

  // Actualizar una nueva fila al final y descartar la primera
  const lastRow = autoHistory[autoHistory.length - 1];
  const newRow = new Uint8Array(autoCols);
  for (let c = 0; c < autoCols; c++) {
    const left = c > 0 ? lastRow[c - 1] : 0;
    const self = lastRow[c];
    const right = c < autoCols - 1 ? lastRow[c + 1] : 0;
    const pattern = (left << 2) | (self << 1) | right;
    newRow[c] = (110 & (1 << pattern)) ? 1 : 0;
  }
  autoHistory.shift();
  autoHistory.push(newRow);

  // Renderizar la cascada de autómatas
  for (let r = 0; r < autoHistory.length; r++) {
    const row = autoHistory[r];
    for (let c = 0; c < autoCols; c++) {
      if (row[c]) {
        ctx.fillStyle = palFunc(0.25 + (r / autoHistory.length) * 0.7);
        ctx.fillRect(c * cellW, r * cellH, cellW - 0.5, cellH - 0.5);
      }
    }
  }
}

// ───────────────────────────────────────────────────────────────────
// 9. ARQUETIPO: GEOMETRÍA CLÁSICA, ÓPTICA & ARMONÍA (geometry)
// ───────────────────────────────────────────────────────────────────
let geoAngle = 0;
function init_archetype_geometry(idx) {
  geoAngle = 0;
}

function step_archetype_geometry(idx) {
  trailFade(0.06);
  geoAngle += 0.015;
  const palFunc = PALS_CSS[currentPal];
  const cx = W * 0.5, cy = H * 0.5;

  if (idx === 0) {
    // Teorema de Pitágoras: Triángulo rectángulo y cuadrados animados
    const a = W * 0.15;
    const b = W * 0.20;
    const x0 = cx - a * 0.5, y0 = cy + b * 0.5;

    ctx.lineWidth = 2.0;
    // Cuadrado cateto a
    ctx.strokeStyle = palFunc(0.4);
    ctx.strokeRect(x0, y0, a, a);
    ctx.fillStyle = palFunc(0.15);
    ctx.fillRect(x0, y0, a, a);

    // Cuadrado cateto b
    ctx.strokeStyle = palFunc(0.6);
    ctx.strokeRect(x0 - b, y0 - b, b, b);
    ctx.fillStyle = palFunc(0.2);
    ctx.fillRect(x0 - b, y0 - b, b, b);

    // Cuadrado hipotenusa c
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x0 + a, y0);
    ctx.lineTo(x0, y0 - b);
    ctx.closePath();
    ctx.strokeStyle = palFunc(0.95);
    ctx.stroke();
  } else if (idx === 3) {
    // Espiral Áurea de Fibonacci
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    const turns = 6;
    for (let a = 0; a < Math.PI * 2 * turns; a += 0.05) {
      const r = 4.0 * Math.exp(0.306 * a) * 0.12;
      const px = cx + Math.cos(a + geoAngle) * r;
      const py = cy + Math.sin(a + geoAngle) * r;
      if (a === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.strokeStyle = palFunc(0.85);
    ctx.stroke();
  } else if (idx === 20) {
    // Identidad de Euler e^{i pi} + 1 = 0: Fasor complejo rotando hacia -1
    const rUnit = W * 0.28;
    // Círculo unidad
    ctx.beginPath();
    ctx.arc(cx, cy, rUnit, 0, Math.PI * 2);
    ctx.strokeStyle = palFunc(0.4);
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Ejes real e imaginario
    ctx.strokeStyle = 'rgba(255,255,255,0.2)';
    ctx.beginPath();
    ctx.moveTo(cx - rUnit * 1.3, cy); ctx.lineTo(cx + rUnit * 1.3, cy);
    ctx.moveTo(cx, cy - rUnit * 1.3); ctx.lineTo(cx, cy + rUnit * 1.3);
    ctx.stroke();

    // Fasor rotando
    const theta = Math.PI - Math.abs(Math.sin(geoAngle * 0.8) * Math.PI);
    const fx = cx + Math.cos(theta) * rUnit;
    const fy = cy - Math.sin(theta) * rUnit;

    ctx.beginPath();
    ctx.moveTo(cx, cy); ctx.lineTo(fx, fy);
    ctx.strokeStyle = palFunc(0.95);
    ctx.lineWidth = 2.5;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(fx, fy, 6, 0, Math.PI * 2);
    ctx.fillStyle = palFunc(0.95);
    ctx.fill();
  } else {
    // Armónicos esféricos / Geometría Sagrada Multiaxial
    const count = 8;
    ctx.lineWidth = 1.2;
    for (let i = 0; i < count; i++) {
      const a = (i * Math.PI) / count + geoAngle * 0.5;
      ctx.beginPath();
      ctx.ellipse(cx, cy, W * 0.32, H * 0.12, a, 0, Math.PI * 2);
      ctx.strokeStyle = palFunc(0.2 + (i / count) * 0.7);
      ctx.stroke();
    }
  }
}

// ───────────────────────────────────────────────────────────────────
// 10. ARQUETIPO: TEORÍA DE NÚMEROS & FRONTERAS DIOFÁNTICAS (number)
// ───────────────────────────────────────────────────────────────────
let numT = 0;
function init_archetype_number(idx) {
  numT = 0;
}

function step_archetype_number(idx) {
  trailFade(0.06);
  numT += 0.02;
  const palFunc = PALS_CSS[currentPal];
  const cx = W * 0.5, cy = H * 0.5;

  // Curva elíptica de Fermat / Beal: y^2 = x^3 + a x + b
  const aParam = -2.5 + Math.sin(numT * 0.6) * 1.2;
  const bParam = 2.0;
  const sc = W * 0.055;

  ctx.lineWidth = 2.0;
  ctx.strokeStyle = palFunc(0.85);

  // Ejes
  ctx.strokeStyle = 'rgba(255,255,255,0.2)';
  ctx.lineWidth = 1.0;
  ctx.beginPath();
  ctx.moveTo(cx - W * 0.4, cy); ctx.lineTo(cx + W * 0.4, cy);
  ctx.moveTo(cx, cy - H * 0.4); ctx.lineTo(cx, cy + H * 0.4);
  ctx.stroke();

  // Curva y = +sqrt(x^3 + ax + b) e y = -sqrt(...)
  ctx.strokeStyle = palFunc(0.85);
  ctx.lineWidth = 2.0;
  for (let sign of [1, -1]) {
    ctx.beginPath();
    let started = false;
    for (let px = -5.0; px <= 6.0; px += 0.05) {
      const rhs = px * px * px + aParam * px + bParam;
      if (rhs >= 0) {
        const py = sign * Math.sqrt(rhs);
        const scrX = cx + px * sc;
        const scrY = cy - py * sc;
        if (!started) { ctx.moveTo(scrX, scrY); started = true; }
        else ctx.lineTo(scrX, scrY);
      } else {
        started = false;
      }
    }
    ctx.stroke();
  }
}

// ═══════════════════════════════════════════════════════════════════
// MAPEO CANÓNICO DE LAS 100 OBRAS DEL COSMOS (0..99)
// ═══════════════════════════════════════════════════════════════════

// Mapeo a los 25 motores clásicos altamente refinados
const CLASSIC_MAP = {
  86: { init: init01, step: step01 }, // 087: Lorenz
  59: { init: init02, step: step02 }, // 060: Von Mises
  95: { init: init03, step: step03 }, // 096: Yoshida
  54: { init: init04, step: step04 }, // 055: Clifford
  26: { init: init05, step: step05 }, // 027: Chladni
  84: { init: init06, step: step06 }, // 085: Turing Morphogenesis
  87: { init: init07, step: step07 }, // 088: Rössler
  57: { init: init08, step: step08 }, // 058: Apolonio
  89: { init: init09, step: step09 }, // 090: Mandelbrot / Julia
  94: { init: init10, step: step10 }, // 095: Langton Ant
  24: { init: init11, step: step11 }, // 025: Euler Beam
  90: { init: init12, step: step12 }, // 091: Kuramoto
  68: { init: init13, step: step13 }, // 069: Heisenberg
  92: { init: init14, step: step14 }, // 093: Black-Scholes
  69: { init: init15, step: step15 }, // 070: Dirac
  70: { init: init16, step: step16 }, // 071: Hopf Fibration
  85: { init: init17, step: step17 }, // 086: Belousov-Zhabotinsky
  88: { init: init18, step: step18 }, // 089: Feigenbaum
  82: { init: init19, step: step19 }, // 083: Shannon Entropy
  83: { init: init19, step: step19 }, // 084: Shannon Capacity
  30: { init: init20, step: step20 }, // 031: Fourier
  50: { init: init21, step: step21 }, // 051: Riemann Zeta
  52: { init: init22, step: step22 }, // 053: Stefan-Boltzmann
  39: { init: init23, step: step23 }, // 040: Navier-Stokes
  97: { init: init24, step: step24 }  // 098: Ricci Flow (Perelman)
};

// Asignación de los 75 restantes a sus respectivos arquetipos
const ARCHETYPE_GROUPS = {
  celestial: [4, 5, 6, 7, 13, 14, 15, 16, 64, 71, 72],
  wave: [22, 23, 35, 38, 65, 66, 75],
  field: [25, 33, 34, 40, 41, 42, 43, 44, 45],
  fluid: [2, 21, 56, 91],
  thermo: [17, 27, 31, 32, 46, 47, 48, 49, 53, 76, 77],
  spacetime: [51, 55, 62, 63, 73],
  quantum: [60, 61, 67, 74, 78, 79, 99],
  automata: [80, 81, 93, 98],
  geometry: [0, 1, 3, 8, 9, 11, 12, 18, 19, 20, 28, 29, 36, 37, 58],
  number: [10, 96]
};

const INITS = new Array(100);
const STEPS = new Array(100);

for (let i = 0; i < 100; i++) {
  if (CLASSIC_MAP[i]) {
    INITS[i] = CLASSIC_MAP[i].init;
    STEPS[i] = CLASSIC_MAP[i].step;
  } else {
    // Buscar en qué arquetipo reside
    let group = 'geometry';
    for (const [grpName, indices] of Object.entries(ARCHETYPE_GROUPS)) {
      if (indices.includes(i)) {
        group = grpName;
        break;
      }
    }

    switch(group) {
      case 'celestial':
        INITS[i] = () => init_archetype_celestial(i);
        STEPS[i] = () => step_archetype_celestial(i);
        break;
      case 'wave':
        INITS[i] = () => init_archetype_wave(i);
        STEPS[i] = () => step_archetype_wave(i);
        break;
      case 'field':
        INITS[i] = () => init_archetype_field(i);
        STEPS[i] = () => step_archetype_field(i);
        break;
      case 'fluid':
        INITS[i] = () => init_archetype_fluid(i);
        STEPS[i] = () => step_archetype_fluid(i);
        break;
      case 'thermo':
        INITS[i] = () => init_archetype_thermo(i);
        STEPS[i] = () => step_archetype_thermo(i);
        break;
      case 'spacetime':
        INITS[i] = () => init_archetype_spacetime(i);
        STEPS[i] = () => step_archetype_spacetime(i);
        break;
      case 'quantum':
        INITS[i] = () => init_archetype_quantum(i);
        STEPS[i] = () => step_archetype_quantum(i);
        break;
      case 'automata':
        INITS[i] = () => init_archetype_automata(i);
        STEPS[i] = () => step_archetype_automata(i);
        break;
      case 'number':
        INITS[i] = () => init_archetype_number(i);
        STEPS[i] = () => step_archetype_number(i);
        break;
      case 'geometry':
      default:
        INITS[i] = () => init_archetype_geometry(i);
        STEPS[i] = () => step_archetype_geometry(i);
        break;
    }
  }
}

// Fallback de catálogo maestro
const MASTER_ARTWORKS = (typeof window !== "undefined" && window.ARTWORKS_100) 
  ? window.ARTWORKS_100 
  : (root.ARTWORKS_100 || []);

// ═══════════════════════════════════════════════════════════════════
// API PÚBLICA SOBERANA ATELIER MATH (100 OBRAS)
// ═══════════════════════════════════════════════════════════════════
root.AtelierMath = {
  ARTWORKS: MASTER_ARTWORKS,
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
      if (artIdx === 84 && typeof tAgents !== "undefined") {
        tAgents.push({x, y, angle: Math.random()*Math.PI*2, sp: 0, pts: []});
      }
      if (artIdx === 85 && typeof bzU !== "undefined" && bzU) {
        const bx = x / 4 | 0, by = y / 4 | 0;
        for (let ddy = -4; ddy < 5; ddy++) {
          for (let ddx = -4; ddx < 5; ddx++) {
            const idx = (by + ddy) * bzBW + (bx + ddx);
            if (idx >= 0 && idx < bzU.length) { bzU[idx] = 0.5; bzV[idx] = 0.25; }
          }
        }
      }
    } else if (type === "move") {
      if (artIdx === 26 && typeof chM !== "undefined") {
        chM = Math.max(1, Math.min(8, Math.floor((x / W) * 8) + 1));
        chN = Math.max(1, Math.min(8, Math.floor((y / H) * 8) + 1));
      }
      if (isDrag) {
        if ((artIdx === 86 || artIdx === 87 || artIdx === 68) && typeof lRotZ !== "undefined") {
          lRotZ += dx * 0.005; lRotX += dy * 0.005; if (typeof rRot !== "undefined") rRot += dx * 0.005;
        }
        if (artIdx === 50 && typeof rieRot !== "undefined") rieRot += dx * 0.005;
        if (artIdx === 39 && typeof nsRot !== "undefined") nsRot += dx * 0.005;
        if (artIdx === 97 && typeof ricciAngle !== "undefined") ricciAngle += dx * 0.005;
      }
    } else if (type === "up") {
      isDrag = false; mouseDown = false;
    }
  }
};
})(typeof window !== "undefined" ? window : global);
