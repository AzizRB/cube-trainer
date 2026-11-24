// ===== Pyraminx 3D view (SVG, painter's algorithm) =====
const PYRA_HEX={G:'#16a34a',R:'#dc2626',B:'#2563eb',Y:'#facc15',X:'#9ca3af'};
class Pyra3D{
  constructor(host,o){
    o=o||{}; this.st=o.state||PYRA.solved(); this.hist=o.hist||[]; this.size=o.size||260;
    this.rx=o.rx!=null?o.rx:14; this.ry=o.ry!=null?o.ry:-50; this.queue=[]; this.busy=false; this.gen=0;
    this.durFn=o.dur||(()=>260); this.onChange=o.onChange||(()=>{}); this.mask=o.mask||null;
    host.innerHTML=`<div class="p3d" style="height:${o.height||this.size}px"><svg viewBox="-1.15 -1.15 2.3 2.3" preserveAspectRatio="xMidYMid meet"></svg></div>`;
    this.box=host.querySelector('.p3d'); this.svg=host.querySelector('svg');
    let drag=null;
    this.box.addEventListener('pointerdown',e=>{drag={x:e.clientX,y:e.clientY,rx:this.rx,ry:this.ry}; try{this.box.setPointerCapture(e.pointerId);}catch(_){}});
    this.box.addEventListener('pointermove',e=>{if(!drag)return; this.ry=drag.ry+(e.clientX-drag.x)*0.6; this.rx=Math.max(-85,Math.min(85,drag.rx+(e.clientY-drag.y)*0.6)); this.draw();});
    const end=()=>{drag=null;}; this.box.addEventListener('pointerup',end); this.box.addEventListener('pointercancel',end);
    this.anim=null; this.draw(); this.onChange(this);
  }
  view(p){ // rotate by ry (around y) then rx (around x)
    const a=this.ry*Math.PI/180, b=this.rx*Math.PI/180;
    let x=p[0]*Math.cos(a)+p[2]*Math.sin(a), z=-p[0]*Math.sin(a)+p[2]*Math.cos(a), y=p[1];
    const y2=y*Math.cos(b)-z*Math.sin(b), z2=y*Math.sin(b)+z*Math.cos(b);
    return [x,y2,z2];
  }
  draw(){
    const polys=[];
    PYRA.ST.forEach((s,i)=>{
      let tri=s.tri;
      if(this.anim && this.anim.set[i]) tri=tri.map(p=>PYRA.rotate(p,this.anim.axis,this.anim.ang));
      const v=tri.map(p=>this.view(p));
      const e1=[v[1][0]-v[0][0],v[1][1]-v[0][1]], e2=[v[2][0]-v[0][0],v[2][1]-v[0][1]];
      const nz=e1[0]*e2[1]-e1[1]*e2[0]; if(nz<=0) return; // back-facing
      const cz=(v[0][2]+v[1][2]+v[2][2])/3, cx=(v[0][0]+v[1][0]+v[2][0])/3, cy=(v[0][1]+v[1][1]+v[2][1])/3;
      const k=0.82, inner=v.map(p=>[cx+(p[0]-cx)*k,cy+(p[1]-cy)*k]);
      const col=this.mask?this.mask(i,this.st[i]):PYRA_HEX[this.st[i]];
      polys.push({z:cz,outer:v,inner,col});
    });
    polys.sort((a,b)=>a.z-b.z);
    const pt=a=>a.map(p=>p[0].toFixed(3)+','+(-p[1]).toFixed(3)).join(' ');
    this.svg.innerHTML=polys.map(p=>`<polygon points="${pt(p.outer)}" fill="#111" stroke="#111" stroke-width="0.03" stroke-linejoin="round"/><polygon points="${pt(p.inner)}" fill="${p.col}" stroke-linejoin="round"/>`).join('');
  }
  solved(){return PYRA.isSolved(this.st);}
  halt(){this.queue=[]; this.gen++; this.busy=false; this.anim=null;}
  setState(st){this.halt(); this.st=st.slice(); this.draw(); this.onChange(this);}
  enqueue(toks,record){toks.forEach(t=>this.queue.push({t,record:record!==false})); this.pump();}
  pump(){
    if(this.busy||!this.queue.length) return;
    const {t,record}=this.queue.shift(); const vn=t[0].toUpperCase(), tip=t[0]!==vn, prime=t.endsWith("'");
    const set={}; PYRA.ST.forEach((s,i)=>{ if(PYRA.inLayer(s,vn,tip)) set[i]=1; });
    const total=(prime?1:-1)*2*Math.PI/3, d=this.durFn(); this.busy=true;
    const finish=()=>{this.anim=null; this.st=PYRA.applyMove(this.st,t); if(record)this.hist.push(t); this.busy=false; this.draw(); this.onChange(this); this.pump();};
    if(d<10){finish(); return;}
    const g=this.gen, t0=performance.now();
    const step=now=>{ if(g!==this.gen) return; let f=Math.min(1,(now-t0)/d); f=f<.5?2*f*f:1-Math.pow(-2*f+2,2)/2;
      this.anim={set,axis:PYRA.V[vn],ang:total*f}; this.draw(); if(f<1) requestAnimationFrame(step); else finish(); };
    requestAnimationFrame(step);
  }
}
// ===== 2D net (unfolded): F upright in the middle, L-face left, R-face right, D below =====
const PNET=(function(){
  const h=Math.sqrt(3);
  const U=[0,0], Lv=[-1,h], Rv=[1,h];
  const refl=(p,a,b)=>{const dx=b[0]-a[0],dy=b[1]-a[1],t=((p[0]-a[0])*dx+(p[1]-a[1])*dy)/(dx*dx+dy*dy);const f=[a[0]+t*dx,a[1]+t*dy];return [2*f[0]-p[0],2*f[1]-p[1]];};
  const BL=refl(Rv,U,Lv), BR=refl(Lv,U,Rv), BD=refl(U,Lv,Rv);
  const pos={F:{U,L:Lv,R:Rv},L:{U,L:Lv,B:BL},R:{U,R:Rv,B:BR},D:{L:Lv,R:Rv,B:BD}};
  return PYRA.FACES.map(f=>f[2].map(v=>pos[f[0]][v]));
})();
function pnetSVG(st,size,mask){
  size=size||160; const pts=[]; let minx=1e9,maxx=-1e9,miny=1e9,maxy=-1e9;
  const polys=PYRA.ST.map((s,i)=>{const P=PNET[s.f]; const v=s.bar.map(b=>[(P[0][0]*b[0]+P[1][0]*b[1]+P[2][0]*b[2])/3,(P[0][1]*b[0]+P[1][1]*b[1]+P[2][1]*b[2])/3]);
    v.forEach(p=>{minx=Math.min(minx,p[0]);maxx=Math.max(maxx,p[0]);miny=Math.min(miny,p[1]);maxy=Math.max(maxy,p[1]);}); return {v,i};});
  const pad=0.08, W=maxx-minx+2*pad, H=maxy-miny+2*pad;
  let out=`<svg viewBox="${minx-pad} ${miny-pad} ${W} ${H}" width="${size}" height="${size*H/W}" role="img">`;
  polys.forEach(({v,i})=>{const cx=(v[0][0]+v[1][0]+v[2][0])/3, cy=(v[0][1]+v[1][1]+v[2][1])/3, k=0.84;
    const inner=v.map(p=>[cx+(p[0]-cx)*k,cy+(p[1]-cy)*k]); const col=mask?mask(i,st[i]):PYRA_HEX[st[i]];
    out+=`<polygon points="${v.map(p=>p[0].toFixed(3)+','+p[1].toFixed(3)).join(' ')}" fill="#111"/><polygon points="${inner.map(p=>p[0].toFixed(3)+','+p[1].toFixed(3)).join(' ')}" fill="${col}"/>`;});
  return out+'</svg>';
}
// ===== static 3D picture (for lessons / exam) =====
function pyraISO(st,size,rx,ry){
  const V={rx:rx!=null?rx:-15,ry:ry!=null?ry:-50}, view=p=>Pyra3D.prototype.view.call(V,p), polys=[];
  PYRA.ST.forEach((s,i)=>{ const v=s.tri.map(view);
    const nz=(v[1][0]-v[0][0])*(v[2][1]-v[0][1])-(v[1][1]-v[0][1])*(v[2][0]-v[0][0]); if(nz<=0) return;
    const cx=(v[0][0]+v[1][0]+v[2][0])/3, cy=(v[0][1]+v[1][1]+v[2][1])/3, k=0.82;
    polys.push({z:(v[0][2]+v[1][2]+v[2][2])/3,v,inner:v.map(p=>[cx+(p[0]-cx)*k,cy+(p[1]-cy)*k]),col:PYRA_HEX[st[i]]}); });
  polys.sort((a,b)=>a.z-b.z);
  const pt=a=>a.map(p=>p[0].toFixed(3)+','+(-p[1]).toFixed(3)).join(' ');
  return `<svg viewBox="-1.12 -1.12 2.24 2.24" width="${size}" height="${size}" role="img">${polys.map(p=>`<polygon points="${pt(p.v)}" fill="#111" stroke="#111" stroke-width="0.04" stroke-linejoin="round"/><polygon points="${pt(p.inner)}" fill="${p.col}"/>`).join('')}</svg>`;
}
