// ===================== CUBE MODEL =====================
const SCHEME_LL  = {U:'Y',D:'W',F:'G',B:'B',R:'O',L:'R'};
const SCHEME_WCA = {U:'W',D:'Y',F:'G',B:'B',R:'R',L:'O'};
const HEX = {Y:'#FFD500',W:'#FFFFFF',G:'#009E60',B:'#0051BA',R:'#C41E3A',O:'#FF5800'};
function faceOf(n){return n[1]===1?'U':n[1]===-1?'D':n[2]===1?'F':n[2]===-1?'B':n[0]===1?'R':'L';}
function solvedCube(scheme){
  scheme=scheme||SCHEME_LL; const st=[]; const N=[[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]];
  for(let x=-1;x<=1;x++)for(let y=-1;y<=1;y++)for(let z=-1;z<=1;z++)for(const n of N){
    const p=[x,y,z],a=n.findIndex(v=>v!==0); if(p[a]===n[a]) st.push({p:[x,y,z],n:n.slice(),c:scheme[faceOf(n)],h:[x,y,z]});
  } return st;
}
function rot(v,a,s){const[x,y,z]=v; if(a===0)return s>0?[x,-z,y]:[x,z,-y]; if(a===1)return s>0?[z,y,-x]:[-z,y,x]; return s>0?[-y,x,z]:[y,-x,z];}
const MOVES={R:[0,v=>v===1,-1],L:[0,v=>v===-1,1],M:[0,v=>v===0,1],U:[1,v=>v===1,-1],D:[1,v=>v===-1,1],E:[1,v=>v===0,1],
 F:[2,v=>v===1,-1],B:[2,v=>v===-1,1],S:[2,v=>v===0,-1],r:[0,v=>v>=0,-1],l:[0,v=>v<=0,1],u:[1,v=>v>=0,-1],d:[1,v=>v<=0,1],
 f:[2,v=>v>=0,-1],b:[2,v=>v<=0,1],x:[0,()=>true,-1],y:[1,()=>true,-1],z:[2,()=>true,-1]};
function tokens(alg){return alg.replace(/[()\[\]]/g,' ').trim().split(/\s+/).filter(Boolean);}
function parseTok(t){const m=t.match(/^([RLUDFBMESrludfbxyz])(w?)(2|')?(')?$/); if(!m) throw new Error(t); let f=m[1]; if(m[2])f=f.toLowerCase(); return {f,a:m[3]==='2'?2:m[3]==="'"?3:1};}
function move(st,f,a){const[ax,pr,s]=MOVES[f]; for(let k=0;k<a;k++)for(const t of st){if(pr(t.p[ax])){t.p=rot(t.p,ax,s);t.n=rot(t.n,ax,s);}} return st;}
function apply(st,alg){for(const t of tokens(alg)){const m=parseTok(t);move(st,m.f,m.a);} return st;}
function invert(alg){return tokens(alg).reverse().map(t=>{const m=parseTok(t);return m.f+(m.a===1?"'":m.a===2?'2':'');}).join(' ');}
function stk(st,p,n){return st.find(t=>t.p[0]===p[0]&&t.p[1]===p[1]&&t.p[2]===p[2]&&t.n[0]===n[0]&&t.n[1]===n[1]&&t.n[2]===n[2]);}
function caseState(alg,pre,post){const st=solvedCube(); if(pre)move(st,'U',pre); apply(st,invert(alg)); if(post)move(st,'U',post); return st;}
function cloneSt(st){return st.map(t=>({p:t.p.slice(),n:t.n.slice(),c:t.c,h:t.h}));}

// ===================== 3D CUBE COMPONENT =====================
const FACE_DIRS=[[[1,0,0],'rotateY(90deg)'],[[-1,0,0],'rotateY(-90deg)'],[[0,1,0],'rotateX(90deg)'],[[0,-1,0],'rotateX(-90deg)'],[[0,0,1],''],[[0,0,-1],'rotateY(180deg)']];
class Cube3D{
  constructor(host,o){
    o=o||{}; this.vw=o.view||null; this.two=!!o.two; this.cs=o.size||46; this.st=o.state||solvedCube(o.scheme); this.hist=o.hist||[];
    this.rx=-28; this.ry=-36; this.queue=[]; this.busy=false; this.gen=0;
    this.durFn=o.dur||(()=>200); this.onChange=o.onChange||(()=>{});
    host.innerHTML=`<div class="scene" style="height:${o.height||240}px;--cs:${this.cs}px"><div class="cube3d"></div><button class="ghost vbtn" title="${L('Ko\'rinishni tiklash','Reset view')}">↺</button></div>`;
    this.scene=host.querySelector('.scene'); this.root=host.querySelector('.cube3d');
    this.scene.querySelector('.vbtn').onclick=e=>{e.stopPropagation(); this.rx=-28; this.ry=-36; this.view();};
    let drag=null;
    this.scene.addEventListener('pointerdown',e=>{ if(e.target.closest('.vbtn')) return; drag={x:e.clientX,y:e.clientY,rx:this.rx,ry:this.ry}; try{this.scene.setPointerCapture(e.pointerId);}catch(_){} });
    this.scene.addEventListener('pointermove',e=>{ if(!drag) return; this.ry=drag.ry+(e.clientX-drag.x)*0.5; this.rx=Math.max(-89,Math.min(89,drag.rx-(e.clientY-drag.y)*0.5)); this.view(); });
    const end=()=>{drag=null;}; this.scene.addEventListener('pointerup',end); this.scene.addEventListener('pointercancel',end);
    this.render();
  }
  base(p){const k=this.two?0.5:1; return `translate3d(${p[0]*this.cs*k}px,${-p[1]*this.cs*k}px,${p[2]*this.cs*k}px)`;}
  render(){
    const by={}; for(const t of this.st){const k=t.p.join(','); (by[k]||(by[k]=[])).push(t);}
    let h='';
    for(let x=-1;x<=1;x++)for(let y=-1;y<=1;y++)for(let z=-1;z<=1;z++){
      if(!x&&!y&&!z) continue; if(this.two&&(!x||!y||!z)) continue; const list=by[x+','+y+','+z]||[];
      h+=`<div class="cubie" data-p="${x},${y},${z}" style="transform:${this.base([x,y,z])}">`;
      for(const[n,r] of FACE_DIRS){const t=list.find(q=>q.n[0]===n[0]&&q.n[1]===n[1]&&q.n[2]===n[2]);
        h+=`<div class="face${t?' st':''}" style="transform:${r} translateZ(${this.cs/2}px);${t?'--c:'+(this.vw?stickerColor(t,this.vw):HEX[t.c]):''}"></div>`;}
      h+='</div>';
    }
    this.root.innerHTML=h; this.view(); this.onChange(this);
  }
  view(){this.root.style.transform=`rotateX(${this.rx}deg) rotateY(${this.ry}deg)`;}
  solved(){const g={}; for(const t of this.st){const k=t.n.join(','); if(g[k]===undefined)g[k]=t.c; else if(g[k]!==t.c) return false;} return true;}
  halt(){this.queue=[]; this.gen++; this.busy=false;}
  setState(st){this.halt(); this.st=st; this.render();}
  enqueue(toks,record){toks.forEach(t=>this.queue.push({t,record:record!==false})); this.pump();}
  pump(){
    if(this.busy||!this.queue.length) return;
    const {t,record}=this.queue.shift(); const m=parseTok(t); const[ax,pr,s]=MOVES[m.f];
    const th=s*90*(m.a===3?-1:m.a), d=this.durFn()*(m.a===2?1.4:1);
    const finish=()=>{move(this.st,m.f,m.a); if(record)this.hist.push(t); this.busy=false; this.render(); this.pump();};
    this.busy=true;
    if(d<10){finish(); return;}
    const rotF=a=>ax===0?`rotateX(${-a}deg)`:ax===1?`rotateY(${a}deg)`:`rotateZ(${-a}deg)`;
    const els=[...this.root.querySelectorAll('.cubie')].filter(el=>pr(+el.dataset.p.split(',')[ax]));
    els.forEach(el=>{el.style.transition='none'; el.style.transform=rotF(0)+' '+this.base(el.dataset.p.split(',').map(Number));});
    void this.root.offsetWidth;
    els.forEach(el=>{el.style.transition=`transform ${d}ms ease-in-out`; el.style.transform=rotF(th)+' '+this.base(el.dataset.p.split(',').map(Number));});
    const g=this.gen; setTimeout(()=>{ if(g!==this.gen) return; finish(); },d+15);
  }
}

// ===================== 2D RENDER =====================
function stickerColor(t,view){
  const gray='var(--gray)';
  if(view==='oll') return t.c==='Y'?HEX.Y:gray;
  if(view==='oll-edge'){const isCorner=t.p.every(v=>v!==0); if(isCorner&&t.p[1]===1) return gray; return t.c==='Y'?HEX.Y:gray;}
  if(view==='f2l') return t.h[1]===1?gray:HEX[t.c];
  if(view==='cross'){ const h=t.h, z=h.filter(v=>v===0).length; return (z===2||(h[1]===-1&&z===1))?HEX[t.c]:gray; }
  return HEX[t.c];
}
function topSVG(st,view,size){
  size=size||170; const ctr=view==='pll'||view==='full', u=size/(ctr?5.9:5.2), side=u*0.32, gap=u*0.12, dot=ctr?u*0.36:0, o=side+gap*1.5+(ctr?dot+gap*1.5:0), W=3*u+2*o;
  let s=`<svg viewBox="0 0 ${W} ${W}" width="${size}" height="${size}" role="img">`;
  const rect=(x,y,w,h,c)=>`<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${w.toFixed(1)}" height="${h.toFixed(1)}" rx="${(Math.min(w,h)*0.18).toFixed(1)}" fill="${c}" stroke="rgba(0,0,0,.35)" stroke-width="0.8"/>`;
  s+=`<rect x="${o-gap/2}" y="${o-gap/2}" width="${3*u+gap}" height="${3*u+gap}" rx="${u*.2}" fill="#111"/>`;
  for(let x=-1;x<=1;x++)for(let z=-1;z<=1;z++) s+=rect(o+(x+1)*u+gap/2,o+(z+1)*u+gap/2,u-gap,u-gap,stickerColor(stk(st,[x,1,z],[0,1,0]),view));
  for(let x=-1;x<=1;x++){ s+=rect(o+(x+1)*u+gap/2,o-gap-side,u-gap,side,stickerColor(stk(st,[x,1,-1],[0,0,-1]),view));
    s+=rect(o+(x+1)*u+gap/2,o+3*u+gap,u-gap,side,stickerColor(stk(st,[x,1,1],[0,0,1]),view)); }
  for(let z=-1;z<=1;z++){ s+=rect(o-gap-side,o+(z+1)*u+gap/2,side,u-gap,stickerColor(stk(st,[-1,1,z],[-1,0,0]),view));
    s+=rect(o+3*u+gap,o+(z+1)*u+gap/2,side,u-gap,stickerColor(stk(st,[1,1,z],[1,0,0]),view)); }
  if(ctr){ const c=o+1.5*u, d=o-gap-side-gap*1.6-dot/2, D=o+3*u+gap+side+gap*1.6+dot/2, ring=(x,y,col)=>`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(dot/2).toFixed(1)}" fill="${col}" stroke="var(--ink)" stroke-opacity=".55" stroke-width="1.2"/>`;
    s+=ring(c,d,HEX[stk(st,[0,0,-1],[0,0,-1]).c])+ring(c,D,HEX[stk(st,[0,0,1],[0,0,1]).c])+ring(d,c,HEX[stk(st,[-1,0,0],[-1,0,0]).c])+ring(D,c,HEX[stk(st,[1,0,0],[1,0,0]).c]); }
  return s+'</svg>';
}
function isoSVG(st,view,size,overlay){
  size=size||170; const c=Math.cos(Math.PI/6), sc=size/6.3;
  const P=(X,Y,Z)=>[((X-Z)*c)*sc+size/2, (-Y+(X+Z)*0.5)*sc+size/2];
  let s=`<svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" role="img">`;
  const body=[P(-1.5,1.5,1.5),P(-1.5,1.5,-1.5),P(1.5,1.5,-1.5),P(1.5,-1.5,-1.5),P(1.5,-1.5,1.5),P(-1.5,-1.5,1.5)];
  s+=`<polygon points="${body.map(q=>q.map(v=>v.toFixed(1)).join(',')).join(' ')}" fill="#111" stroke="#111" stroke-width="3" stroke-linejoin="round"/>`;
  for(const t of st){
    const n=t.n; if(!((n[1]===1&&t.p[1]===1)||(n[2]===1&&t.p[2]===1)||(n[0]===1&&t.p[0]===1))) continue;
    const ax=n.findIndex(v=>v!==0), tan=[0,1,2].filter(i=>i!==ax), k=0.43, ctr=t.p.map((v,i)=>v+n[i]*0.5);
    const pts=[[-k,-k],[k,-k],[k,k],[-k,k]].map(([a,b])=>{const q=ctr.slice(); q[tan[0]]+=a; q[tan[1]]+=b; return P(q[0],q[1],q[2]);});
    s+=`<polygon points="${pts.map(q=>q.map(v=>v.toFixed(1)).join(',')).join(' ')}" fill="${stickerColor(t,view)}" stroke="rgba(0,0,0,.3)" stroke-width="0.6" stroke-linejoin="round"/>`;
  }
  if(overlay) s+=overlay(P,size);
  return s+'</svg>';
}
function netSVG(st,size){
  size=size||260; const u=size/12.4, g=u*0.08, fw=3*u+u*0.2;
  const pos={U:[1,0],L:[0,1],F:[1,1],R:[2,1],B:[3,1],D:[1,2]};
  let s=`<svg viewBox="0 0 ${4*fw} ${3*fw}" width="${size}" height="${size*0.75}" role="img">`;
  for(const t of st){
    const f=faceOf(t.n), ax=[0,1,2].find(i=>t.n[i]!==0); if(t.p[ax]!==t.n[ax]) continue;
    const[x,y,z]=t.p; let r,c;
    if(f==='U'){r=z+1;c=x+1;} else if(f==='F'){r=1-y;c=x+1;} else if(f==='R'){r=1-y;c=1-z;}
    else if(f==='B'){r=1-y;c=1-x;} else if(f==='L'){r=1-y;c=z+1;} else {r=1-z;c=x+1;}
    const[fx,fy]=pos[f];
    s+=`<rect x="${(fx*fw+c*u+g).toFixed(1)}" y="${(fy*fw+r*u+g).toFixed(1)}" width="${(u-2*g).toFixed(1)}" height="${(u-2*g).toFixed(1)}" rx="${(u*.15).toFixed(1)}" fill="${HEX[t.c]}" stroke="rgba(0,0,0,.4)" stroke-width="0.7"/>`;
  }
  return s+'</svg>';
}
function pllFeatures(st){
  const sides=[[L("Orqa","Back"),[-1,0,1].map(x=>stk(st,[x,1,-1],[0,0,-1]).c)],[L("Chap","Left"),[-1,0,1].map(z=>stk(st,[-1,1,z],[-1,0,0]).c)],
    [L("O'ng","Right"),[-1,0,1].map(z=>stk(st,[1,1,z],[1,0,0]).c)],[L("Old","Front"),[-1,0,1].map(x=>stk(st,[x,1,1],[0,0,1]).c)]];
  return sides.map(([n,[a,b,c]])=>{let f; if(a===b&&b===c)f=L("to'liq qator","full bar"); else if(a===c)f=L("faralar","headlights"); else if(a===b||b===c)f=L("2x1 blok","2x1 block"); else f=L("3 xil rang","3 colors"); return `<b>${n}:</b> ${f}`;}).join(' · ');
}

