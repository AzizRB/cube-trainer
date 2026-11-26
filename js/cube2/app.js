// ===== 2x2 app (minimal shell, shared with Pyraminx styles) =====
const CKEY='cube2Trainer.v1';
let CDB={lvl:1,tasks:{},stats:{},times:[],set:'OLL',insp:false,mode:'opt',bpm:80,inp:null};
try{const r=localStorage.getItem(CKEY); if(r) CDB=Object.assign(CDB,JSON.parse(r));}catch(e){}
function csave(){try{localStorage.setItem(CKEY,JSON.stringify(CDB));}catch(e){}}
const VIEWS=['lessons','drill','exam','solver','timer'];
const ICON={
 exam:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3h6l1 3H8z"/><rect x="5" y="5" width="14" height="16" rx="2"/><path d="m9 13 2 2 4-4"/></svg>',
 home:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="3"/><path d="M12 4v16M4 12h16"/></svg>',
 lessons:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 21V5M8 7h7"/></svg>',
 drill:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.2" fill="currentColor"/></svg>',
 solver:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M12 2 3 7v10l9 5 9-5V7z"/><path d="M3 7l9 5 9-5M12 12v10"/></svg>',
 timer:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 2M10 2h4"/></svg>'};
const NAMES=()=>({exam:L('Imtihon','Exam'),lessons:L('Darslar','Lessons'),drill:L('Mashq','Practice'),solver:L('Yechuvchi','Solver'),timer:L('Taymer','Timer')});
function curView(){const h=(location.hash||'#lessons').slice(1); return VIEWS.includes(h)?h:'lessons';}
function route(){const v=curView(); if(v==='timer'&&!CT.scr&&CT.cube){ CT.scr=scramble2(); showScr(); } if(v==='exam'&&!document.querySelector('#v-exam .xrun')) renderExamHome2(); VIEWS.forEach(k=>$('v-'+k).classList.toggle('on',k===v)); document.querySelectorAll('[data-nav]').forEach(a=>a.classList.toggle('on',a.dataset.nav===v)); if(v!=='drill') metroStop(); window.scrollTo(0,0);}
window.addEventListener('hashchange',route);
function curTheme(){return DB.theme||(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');}
function applyTheme(){const t=curTheme(); document.documentElement.dataset.theme=t; $('thBtn').textContent=t==='dark'?'☀️':'🌙'; const tm=document.querySelector('meta[name=theme-color]'); if(tm) tm.content=t==='dark'?'#0f0f12':'#f7f6f2';}
const LV=()=>C2LEVELS.find(l=>l.id===CDB.lvl)||C2LEVELS[0];
const pct=lv=>{let d=0; lv.tasks.forEach((_,i)=>{if(CDB.tasks[lv.id+'-'+i])d++;}); return Math.round(d/lv.tasks.length*100);};
const c2solved=()=>C2.solved();
const cstate=alg=>apply(c2solved(),invert(alg));
function isSolved2(st){const g={};for(const t of st){const k=t.n.join();if(g[k]===undefined)g[k]=t.c;else if(g[k]!==t.c)return false;}return true;}

// ---------- 2D face views ----------
function c2face(st,view,size,face){
  size=size||140; const u=size/3.3, sd=u*0.3, g=u*0.1, o=sd+g*1.5, W=2*u+2*o;
  const col=t=>{ if(!t) return 'var(--soft)'; if(view==='oll') return t.c==='Y'?HEX.Y:'#9ca3af'; return HEX[t.c]; };
  const up=face!=='D', y=up?1:-1, n=[0,y,0];
  // grid mapping: U seen from top (back at top); D seen from below (front at top)
  const cell=(x,z)=>up?[x,z]:[x,-z];
  const R=(a,b,w,h,c)=>`<rect x="${a.toFixed(1)}" y="${b.toFixed(1)}" width="${w.toFixed(1)}" height="${h.toFixed(1)}" rx="${(Math.min(w,h)*.2).toFixed(1)}" fill="${c}" stroke="rgba(0,0,0,.3)" stroke-width=".8"/>`;
  let s=`<svg viewBox="0 0 ${W} ${W}" width="${size}" height="${size}"><rect x="${o-g/2}" y="${o-g/2}" width="${2*u+g}" height="${2*u+g}" rx="${u*.18}" fill="#111"/>`;
  [-1,1].forEach(x=>[-1,1].forEach(z=>{const [cx,cz]=cell(x,z); s+=R(o+(cx>0?u:0)+g/2,o+(cz>0?u:0)+g/2,u-g,u-g,col(stk(st,[x,y,z],n)));}));
  [-1,1].forEach(x=>{ const top=up?-1:1, bot=-top;
    s+=R(o+(x>0?u:0)+g/2,o-g-sd,u-g,sd,col(stk(st,[x,y,top],[0,0,top])));
    s+=R(o+(x>0?u:0)+g/2,o+2*u+g,u-g,sd,col(stk(st,[x,y,bot],[0,0,bot])));
    const z=x, [_,cz]=cell(0,z);
    s+=R(o-g-sd,o+(cz>0?u:0)+g/2,sd,u-g,col(stk(st,[-1,y,z],[-1,0,0])));
    s+=R(o+2*u+g,o+(cz>0?u:0)+g/2,sd,u-g,col(stk(st,[1,y,z],[1,0,0])));
  });
  return s+'</svg>';
}
function casePic(c,size){const st=cstate(c.alg); return c.view==='pbl'?`<div class="row" style="gap:6px;justify-content:center">${c2face(st,'pll',size*0.72,'U')}${c2face(st,'pll',size*0.72,'D')}</div>`:c2face(st,c.view,size,'U');}

// ---------- shell ----------
function renderShell(){
  document.documentElement.lang=DB.lang; document.title='2x2 — '+L('Speedcubing trener','Speedcubing trainer');
  $('langBtn').textContent=DB.lang==='en'?'UZ':'EN';
  const N=NAMES(), SN=N;
  $('rail').innerHTML=VIEWS.map(v=>`<a href="#${v}" data-nav="${v}">${ICON[v]}${N[v]}</a>`).join('');
  $('pill').innerHTML=VIEWS.map(v=>`<a href="#${v}" data-nav="${v}">${ICON[v]}<span>${SN[v]}</span></a>`).join('');
  $('foot').textContent=L("Natijalar faqat shu qurilmada saqlanadi.","Progress is stored on this device only.");
  applyTheme();
}
function fmt(ms){if(ms==null)return '—'; const s=ms/1000; return s<60?s.toFixed(2):Math.floor(s/60)+':'+(s%60).toFixed(2).padStart(5,'0');}
function avgN(n){const t=CDB.times; if(t.length<n) return null; const a=t.slice(-n).map(x=>x.ms).sort((x,y)=>x-y).slice(1,-1); return a.reduce((x,y)=>x+y,0)/a.length;}
const mob=()=>matchMedia('(max-width:820px)').matches;

// ---------- home ----------
function renderHome(){
  const best=CDB.times.length?Math.min(...CDB.times.map(t=>t.ms)):null;
  $('v-home').innerHTML=`<div class="hero"><div><h1>${L("2x2 kubni bosqichma-bosqich o'rganing","Learn the 2x2 step by step")}</h1>
    <p class="lead">${L("Darajangizni tanlang. Har bir daraja — bitta metod: tushuntirish, formulalar, mashq va maqsad vaqti.","Pick your level. Each level is one method: explanation, algorithms, practice and a target time.")}</p>
    <div class="stats"><div><b>${fmt(best)}</b><span>${L('Eng yaxshi','Best')}</span></div><div><b>${fmt(avgN(5))}</b><span>ao5</span></div><div><b>${fmt(avgN(12))}</b><span>ao12</span></div></div></div>
   <div id="homeCube"></div></div>
   <h2>${L('Darajalar','Levels')}</h2>
   <div class="levels">${C2LEVELS.map(lv=>`<button class="lvl" data-lvl="${lv.id}"><span class="dot" style="background:${lv.color}">${lv.id}</span>
     <span style="flex:1;min-width:0"><span class="t">${L(...lv.name)}</span> <span class="muted">· ${L(...lv.method)}</span><span class="s">${L(...lv.intro)}</span><span class="bar"><i style="width:${pct(lv)}%;background:${lv.color}"></i></span></span>
     <span class="goal">${L('Maqsad','Goal')}<br><b style="color:var(--ink);font-size:14px">${L(...lv.goal)}</b></span></button>`).join('')}</div>`;
  new Cube3D($('homeCube'),{two:true,size:mob()?62:72,height:mob()?220:270,state:apply(c2solved(),"R U F' R' U2 F")});
  document.querySelectorAll('[data-lvl]').forEach(b=>b.onclick=()=>{CDB.lvl=+b.dataset.lvl; csave(); renderLessons(); location.hash='#lessons';});
}

// ---------- lessons ----------
function caseCard(c){ return `<div class="card case"><div class="pic">${casePic(c,150)}</div><div class="nm">${c.name}</div>${c.hint?`<div class="muted" style="font-size:13px">${c.hint}</div>`:''}
  <div class="algrow"><span class="alg">${c.alg}</span>${copyBtn(c.alg,'sm ghost')}</div>
  <div class="row" style="gap:6px"><button class="sm" data-play="${c.alg}" data-title="${c.name}">▶ ${L("Ko'rish",'Watch')}</button><button class="sm" data-sim="${c.alg}">🧊 ${L('Simulyatorda','In simulator')}</button></div></div>`; }
const LIBTITLE={OLL:["OLL — 7 holat","OLL — 7 cases"],PLL:["PLL — 2 holat","PLL — 2 cases"],PBL:["PBL — 8 holat (chapda tepa, o'ngda past tomon)","PBL — 8 cases (top on the left, bottom on the right)"],CLL:["CLL — 42 holat","CLL — 42 cases"]};
let CLL_GRP='sune';
function renderLessons(){
  const lv=LV();
  const libs=lv.libs.map(k=>{ let cs=c2cases(k), extra='';
    if(k==='CLL'){ const grps=['sune','antisune','H','pi','headlights','T','bowtie','pll'];
      extra=`<div class="chiprow" style="margin-bottom:14px">${grps.map(g=>`<span class="chip ${CLL_GRP===g?'on':''}" data-cg="${g}">${L(...C2OLLNM[g])} <span class="muted">(${cs.filter(c=>c.grp===g).length})</span></span>`).join('')}</div>`; cs=cs.filter(c=>c.grp===CLL_GRP); }
    return `<h2>${L(...LIBTITLE[k])}</h2>${extra}<div class="grid g3">${cs.map(caseCard).join('')}</div>`; }).join('');
  $('v-lessons').innerHTML=`<div class="seg">${C2LEVELS.map(l=>`<button class="${l.id===lv.id?'on':''}" data-lv="${l.id}"><span class="d" style="background:${l.color}"></span>${l.id}. ${L(...l.name)}</button>`).join('')}</div>
   <h1>${L(...lv.method)}</h1><p class="lead">${L(...lv.intro)} <b>${L('Maqsad','Goal')}: ${L(...lv.goal)}</b></p>
   <div class="grid g2" style="align-items:start"><div class="card"><ol class="timeline">${lv.steps.map((s,i)=>`<li><span class="n">${i+1}</span><h3>${L(...s[0])}</h3><p>${L(...s[1])}</p></li>`).join('')}</ol></div>
    <div class="card"><h3>${L("Shu darajadagi vazifalar","Tasks for this level")}</h3>
     ${lv.tasks.map((t,i)=>{const k=lv.id+'-'+i; return `<label class="row" style="flex-wrap:nowrap;align-items:flex-start;padding:8px 0;border-top:1px solid var(--line);cursor:pointer"><input type="checkbox" data-task="${k}" ${CDB.tasks[k]?'checked':''} style="accent-color:var(--accent);margin-top:5px;width:17px;height:17px;flex:none"><span style="${CDB.tasks[k]?'text-decoration:line-through;color:var(--muted)':''}">${L(...t)}</span></label>`;}).join('')}
     <div class="bar" style="margin-top:12px"><i style="width:${pct(lv)}%;background:${lv.color}"></i></div></div></div>${libs}`;
  document.querySelectorAll('[data-lv]').forEach(b=>b.onclick=()=>{CDB.lvl=+b.dataset.lv; csave(); renderLessons();});
  document.querySelectorAll('[data-task]').forEach(c=>c.onchange=()=>{CDB.tasks[c.dataset.task]=c.checked; csave(); renderLessons(); renderHome();});
  document.querySelectorAll('[data-cg]').forEach(c=>c.onclick=()=>{CLL_GRP=c.dataset.cg; renderLessons();});
}

// ---------- player ----------
function openPlayer(alg,title){
  const toks=tokens(alg); let i=0; const start=cstate(alg);
  $('mbox').innerHTML=`<div class="row" style="justify-content:space-between"><h3 style="margin:0">${title||''}</h3><button class="sm ghost" id="mx">✕</button></div>
   <div id="mcube" style="margin:8px 0"></div><div class="tokens" id="mtok"></div>
   <div class="row" style="justify-content:center;margin-top:12px"><button id="mf">⏮</button><button id="mp">◀</button><button class="pri" id="mn">${L('Keyingi','Next')} ▶</button><button id="ma">▶▶</button></div>`;
  const cube=new Cube3D($('mcube'),{two:true,size:66,height:240,state:cloneSt(start),dur:()=>380});
  const draw=()=>{$('mtok').innerHTML=toks.map((t,k)=>`<span class="${k<i?'done':k===i?'cur':''}">${t}</span>`).join('');};
  $('mx').onclick=closeModal; $('mf').onclick=()=>{i=0; cube.setState(cloneSt(start)); draw();};
  $('mn').onclick=()=>{ if(i>=toks.length||cube.busy) return; cube.enqueue([toks[i]],false); i++; draw(); };
  $('mp').onclick=()=>{ if(i<=0||cube.busy) return; i--; cube.enqueue([invert(toks[i])],false); draw(); };
  $('ma').onclick=()=>{ cube.setState(cloneSt(start)); i=toks.length; cube.enqueue(toks,false); draw(); };
  draw(); $('modal').classList.add('on');
}
function closeModal(){$('modal').classList.remove('on');}
$('modal').addEventListener('click',e=>{if(e.target.id==='modal')closeModal();});

// ---------- drill ----------
let DCUR=null, DMODE='rec';
const DSETS=()=>({OLL:{name:'OLL (7)',choice:true},PLL:{name:'PLL (2)',choice:true},PBL:{name:'PBL (8)',choice:true},CLL:{name:'CLL (42)',choice:false}});
function renderDrill(){
  $('v-drill').innerHTML=`<div class="seg"><button class="${DMODE==='rec'?'on':''}" data-dm="rec">🎯 ${L('Tanib olish','Recognition')}</button><button class="${DMODE==='metro'?'on':''}" data-dm="metro">🎵 ${L('Metronom','Metronome')}</button></div><div id="dbody"></div>`;
  document.querySelectorAll('[data-dm]').forEach(b=>b.onclick=()=>{DMODE=b.dataset.dm; metroStop(); renderDrill();});
  DMODE==='rec'?renderRec():renderMetro();
}
function renderRec(){
  const S=DSETS(); if(!S[CDB.set]) CDB.set='OLL';
  $('dbody').innerHTML=`<h1>${L('Tanib olish','Recognition')}</h1><div class="chiprow" style="margin-bottom:16px">${Object.keys(S).map(k=>`<span class="chip ${k===CDB.set?'on':''}" data-ds="${k}">${S[k].name}</span>`).join('')}</div>
   <div class="grid g2" style="align-items:start"><div class="card stage" id="dstage"></div><div class="card" id="dside"></div></div><div class="card" style="margin-top:14px"><div class="stats" id="dstat"></div></div>`;
  document.querySelectorAll('[data-ds]').forEach(c=>c.onclick=()=>{CDB.set=c.dataset.ds; csave(); DCUR=null; renderRec();});
  nextDrill();
}
function nextDrill(){
  const meta=DSETS()[CDB.set], cs=c2cases(CDB.set);
  const w=cs.map(c=>{const s=CDB.stats[CDB.set+':'+c.i]; return s?1+5*(s.w/(s.r+s.w)):3;}); let r=Math.random()*w.reduce((a,b)=>a+b,0),k=0;
  for(;k<cs.length;k++){r-=w[k]; if(r<=0)break;} k=Math.min(k,cs.length-1); if(DCUR&&cs.length>1&&cs[k].i===DCUR.c.i) k=(k+1)%cs.length;
  const auf=Math.floor(Math.random()*4); DCUR={c:cs[k],t0:performance.now(),done:false};
  let st=cstate(cs[k].alg); if(auf) st=apply(st,['','U','U2',"U'"][auf]);
  $('dstage').innerHTML=`<div class="muted" style="font-size:13px">${meta.name}</div>${cs[k].view==='pbl'?`<div class="row" style="gap:8px;justify-content:center">${c2face(st,'pll',150,'U')}${c2face(st,'pll',150,'D')}</div>`:c2face(st,cs[k].view,230,'U')}<div id="dverd" style="min-height:26px"></div>`;
  if(meta.choice){ $('dside').innerHTML=`<h3>${L('Bu qaysi holat?','Which case is this?')}</h3><div class="answers">${cs.map(c=>`<button data-ans="${c.i}">${c.name}</button>`).join('')}</div><div id="dafter"></div>`;
    document.querySelectorAll('[data-ans]').forEach(b=>b.onclick=()=>{ if(DCUR.done) return; DCUR.done=true; const ok=+b.dataset.ans===DCUR.c.i, ms=performance.now()-DCUR.t0;
      document.querySelectorAll('[data-ans]').forEach(x=>{if(+x.dataset.ans===DCUR.c.i)x.classList.add('right');}); if(!ok)b.classList.add('wrong'); drec(ok,ms);
      $('dverd').innerHTML=`<span class="verdict ${ok?'ok':'no'}">${ok?L("To'g'ri!","Correct!")+' '+(ms/1000).toFixed(2)+' s':L('Xato — bu ',"Wrong — it's ")+DCUR.c.name}</span>`;
      $('dafter').innerHTML=dafter(ok)+`<div class="row" style="margin-top:12px"><button class="pri" id="dnext">${L('Keyingi','Next')} ▶</button></div>`; $('dnext').onclick=nextDrill; }); }
  else { $('dside').innerHTML=`<h3>${L('Formulani eslang','Recall the algorithm')}</h3><p class="muted">${L("Holatni tanib, formulani kubda bajaring, keyin tekshiring.","Recognise the case, run it on your cube, then check.")}</p><button class="pri" id="drev">${L("Formulani ko'rsatish","Show algorithm")}</button><div id="dafter"></div>`;
    $('drev').onclick=()=>{ DCUR.done=true; const ms=performance.now()-DCUR.t0; $('drev').remove(); $('dafter').innerHTML=dafter(true)+`<div class="row" style="margin-top:12px"><button class="pri" id="dk">✓ ${L('Bildim','Knew it')}</button><button id="dn">✗ ${L('Bilmadim',"Didn't")}</button></div>`;
      $('dk').onclick=()=>{drec(true,ms); nextDrill();}; $('dn').onclick=()=>{drec(false,0); nextDrill();}; }; }
  dstats();
}
function dafter(ok){const c=DCUR.c; return `<div class="card" style="margin-top:14px;padding:14px;border:0;background:${ok?'var(--ok-soft)':'var(--bad-soft)'}"><b>${c.name}</b><div class="algrow" style="margin:6px 0"><span class="alg">${c.alg}</span>${copyBtn(c.alg,'sm ghost')}</div><div class="muted" style="font-size:12.5px">${L("Kerak bo'lsa avval U bilan tepani to'g'irlang.","Turn U first if needed.")}</div><button class="sm" style="margin-top:6px" data-play="${c.alg}" data-title="${c.name}">▶ ${L("Ko'rish",'Watch')}</button></div>`;}
function drec(ok,ms){const k=CDB.set+':'+DCUR.c.i, s=CDB.stats[k]||(CDB.stats[k]={r:0,w:0,t:0}); if(ok){s.r++;s.t+=ms;} else s.w++; csave(); dstats();}
function dstats(){let r=0,w=0,t=0; c2cases(CDB.set).forEach(c=>{const s=CDB.stats[CDB.set+':'+c.i]; if(s){r+=s.r;w+=s.w;t+=s.t;}}); const el=$('dstat'); if(el) el.innerHTML=`<div><b>${r+w}</b><span>${L('Urinish','Attempts')}</span></div><div><b>${r+w?Math.round(r/(r+w)*100):0}%</b><span>${L('Aniqlik','Accuracy')}</span></div><div><b>${r&&DSETS()[CDB.set].choice?(t/r/1000).toFixed(2)+' s':'—'}</b><span>${L("O'rt. tanish",'Avg recognition')}</span></div>`;}

// ---------- metronome ----------
let CM={on:false,timer:null,i:0,reps:0,ctx:null,sel:0,cube:null};
function metroList(){ return [{name:'Gold trigger',alg:"R U R' U'",isCase:false},{name:'Sledgehammer',alg:"R' F R F'",isCase:false}].concat(['OLL','PLL','PBL','CLL'].flatMap(k=>c2cases(k).map(c=>({name:k+' · '+c.name,alg:c.alg,isCase:true})))); }
function mstart0(){const it=metroList()[CM.sel]; return it.isCase?cstate(it.alg):c2solved();}
function renderMetro(){ const list=metroList(); if(CM.sel>=list.length) CM.sel=0;
  $('dbody').innerHTML=`<h1>${L('Metronom','Metronome')}</h1><p class="lead">${L("Har bir \"chiq\"da bitta harakat. Kub ham shu ritmda harakatlanadi.","One move per click. The cube moves to the same beat.")}</p>
   <div class="card" style="max-width:560px"><div class="row" style="flex-wrap:nowrap"><select id="msel" style="flex:1;min-width:0">${list.map((it,i)=>`<option value="${i}" ${i===CM.sel?'selected':''}>${it.name} — ${it.alg}</option>`).join('')}</select><button class="sm" id="mcopy">⧉</button></div>
   <div class="row" style="margin:14px 0"><span>${L('Tezlik','Speed')}</span><input type="range" id="mbpm" min="40" max="300" step="10" value="${CDB.bpm}"><b id="mbv">${CDB.bpm}</b><span class="muted">${L('harakat/daq','moves/min')}</span></div>
   <div class="metro" id="mshow"></div><div class="row" style="justify-content:center;margin:14px 0"><button class="pri" id="mbtn">▶ ${L('Boshlash','Start')}</button><span class="muted" id="mreps"></span></div><div id="mcube3"></div></div>`;
  CM.cube=new Cube3D($('mcube3'),{two:true,size:64,height:230,state:mstart0(),dur:()=>Math.min(300,60000/CDB.bpm*0.7)});
  $('msel').onchange=e=>{CM.sel=+e.target.value; metroStop(); CM.reps=0; CM.cube.setState(mstart0()); mdraw();};
  $('mcopy').onclick=e=>copyText(metroList()[CM.sel].alg,e.currentTarget);
  $('mbpm').oninput=e=>{CDB.bpm=+e.target.value; csave(); $('mbv').textContent=CDB.bpm; if(CM.on){metroStop(true); metroStart();}};
  $('mbtn').onclick=()=>CM.on?metroStop():metroStart(); mdraw(); }
function mdraw(){ if(!$('mshow')) return; const t=tokens(metroList()[CM.sel].alg); $('mshow').innerHTML=t.map((x,k)=>`<span class="${CM.on&&k===CM.cur?'cur':''}">${x}</span>`).join(''); $('mreps').textContent=L('Takror','Reps')+': '+CM.reps; }
function mclick(a){ if(!CM.ctx) return; try{const o=CM.ctx.createOscillator(),g=CM.ctx.createGain(); o.frequency.value=a?1500:1000; g.gain.setValueAtTime(.25,CM.ctx.currentTime); g.gain.exponentialRampToValueAtTime(.001,CM.ctx.currentTime+.06); o.connect(g).connect(CM.ctx.destination); o.start(); o.stop(CM.ctx.currentTime+.07);}catch(e){} }
function metroStart(){ try{CM.ctx=CM.ctx||new (window.AudioContext||window.webkitAudioContext)(); CM.ctx.resume&&CM.ctx.resume();}catch(e){CM.ctx=null;}
  CM.on=true; CM.i=0; $('mbtn').innerHTML='■ '+L("To'xtatish",'Stop');
  const tick=()=>{const it=metroList()[CM.sel], t=tokens(it.alg), n=t.length+(it.isCase?1:0); if(CM.i===0&&it.isCase) CM.cube.setState(mstart0());
    if(CM.i<t.length){CM.cur=CM.i; mclick(CM.i===0); CM.cube.enqueue([t[CM.i]],false);} else CM.cur=-1; mdraw(); CM.i++; if(CM.i>=n){CM.i=0;CM.reps++;}};
  tick(); CM.timer=setInterval(tick,60000/CDB.bpm); }
function metroStop(keep){ if(CM.timer)clearInterval(CM.timer); CM.timer=null; const was=CM.on; CM.on=false; const b=$('mbtn'); if(b) b.innerHTML='▶ '+L('Boshlash','Start'); if(was&&!keep&&CM.cube) CM.cube.setState(mstart0()); mdraw(); }

// ---------- solver ----------
const SF=['U','F','R','B','L','D'], FN2={U:[0,1,0],D:[0,-1,0],R:[1,0,0],L:[-1,0,0],F:[0,0,1],B:[0,0,-1]};
const FNM2={U:['Tepa','Up'],F:['Old','Front'],R:["O'ng",'Right'],B:['Orqa','Back'],L:['Chap','Left'],D:['Past','Down']};
const CNM2={Y:['sariq','yellow'],W:['oq','white'],G:['yashil','green'],B:["ko'k",'blue'],R:['qizil','red'],O:["to'q sariq",'orange']};
function fpos(f,r,c){const a=c?1:-1,b=r?1:-1; switch(f){case 'U':return[a,1,b];case 'F':return[a,-b,1];case 'R':return[1,-b,-a];case 'B':return[-a,-b,-1];case 'L':return[-1,-b,a];default:return[a,-1,-b];}}
function blank2(){const o={}; SF.forEach(f=>o[f]=[null,null,null,null]); return o;}
if(!CDB.inp||!CDB.inp.U) CDB.inp=blank2();
let CS={face:'U',color:'Y',res:null,cube:null,toks:[],segs:[],i:0,play:null,start:null};
function inpSt(){const st=[]; SF.forEach(f=>{for(let r=0;r<2;r++)for(let c=0;c<2;c++){const p=fpos(f,r,c); st.push({p,n:FN2[f].slice(),c:CDB.inp[f][r*2+c],h:p.slice()});}}); return st;}
function stInp(st){const o=blank2(); SF.forEach(f=>{for(let r=0;r<2;r++)for(let c=0;c<2;c++){const t=stk(st,fpos(f,r,c),FN2[f]); o[f][r*2+c]=t?t.c:null;}}); return o;}
function renderSolver(){
  $('v-solver').innerHTML=`<h1>${L('Yechuvchi','Solver')}</h1><p class="lead">${L("Kubingiz ranglarini kiriting — eng qisqa yechim yoki Boshlang'ich metod bo'yicha qadamma-qadam.","Enter your cube's colours — get the shortest solution or a step-by-step beginner one.")}</p>
   <div class="grid g2" style="align-items:start"><div class="card" style="display:flex;flex-direction:column;gap:12px">
    <div class="seg" style="margin:0;display:grid;grid-template-columns:repeat(6,1fr)">${SF.map(f=>`<button class="${CS.face===f?'on':''}" data-cf="${f}" style="justify-content:center;padding:7px 4px;font-size:12.5px">${L(...FNM2[f])}${CDB.inp[f].every(v=>v)?' ✓':''}</button>`).join('')}</div>
    <div class="note" style="margin:0;font-size:13.5px">✋ ${L("Kubni bir xil ushlab turing: oq-yashil-to'q sariq burchak orqa-chap-pastda bo'lsa qulay, lekin istalgan ushlash ishlaydi. Tepa/Past tomonlarni ko'rishda old tomon sizga qaragan bo'lsin.","Keep the cube in one orientation the whole time (any orientation works). When looking at Up/Down, keep the front facing you.")}</div>
    <div id="cgrid" style="display:grid;grid-template-columns:1fr 1fr;gap:8px;width:min(100%,220px);margin:0 auto;background:#111;padding:8px;border-radius:16px"></div>
    <div class="palette" id="cpal" style="flex-wrap:wrap"></div><div class="row" style="justify-content:center;font-size:12.5px" id="ccnt"></div>
    <div class="row" style="justify-content:center;gap:6px"><button class="sm" id="cfs">🧊 ${L('Simulyatordan','From simulator')}</button><button class="sm" id="crnd">🎲 ${L('Tasodifiy','Random')}</button><button class="sm ghost" id="cclr">${L('Tozalash','Clear')}</button></div></div>
   <div class="card" style="display:flex;flex-direction:column;gap:12px"><div class="chiprow">${[['opt',L('Eng qisqa','Shortest')],['lbl',L("Boshlang'ich (LBL)",'Beginner (LBL)')]].map(([k,n])=>`<span class="chip ${CDB.mode===k?'on':''}" data-cm="${k}">${n}</span>`).join('')}</div>
    <button class="pri" id="csolve" style="padding:12px;font-size:16px">${L('Yechimni topish','Find solution')}</button><div id="cout"></div></div></div>`;
  document.querySelectorAll('[data-cf]').forEach(b=>b.onclick=()=>{CS.face=b.dataset.cf; renderSolver();});
  document.querySelectorAll('[data-cm]').forEach(c=>c.onclick=()=>{CDB.mode=c.dataset.cm; csave(); renderSolver(); if(CS.res) solveNow();});
  $('csolve').onclick=solveNow;
  $('cfs').onclick=()=>{CDB.inp=stInp(SIM2.cube.st); changed();};
  $('crnd').onclick=()=>{CDB.inp=stInp(apply(c2solved(),scramble2())); changed();};
  $('cclr').onclick=()=>{CDB.inp=blank2(); changed();};
  drawEd(); if(CS.res) showSol();
}
function changed(){csave(); CS.res=null; renderSolver();}
function drawEd(){
  $('cgrid').innerHTML=CDB.inp[CS.face].map((v,i)=>`<button data-ci="${i}" style="aspect-ratio:1;border:0;border-radius:10px;padding:0;background:${v?HEX[v]:'var(--soft)'};font-size:20px;color:rgba(0,0,0,.4)">${v?'':'?'}</button>`).join('');
  document.querySelectorAll('[data-ci]').forEach(b=>b.onclick=()=>{const i=+b.dataset.ci; CDB.inp[CS.face][i]=CDB.inp[CS.face][i]===CS.color?null:CS.color; csave(); CS.res=null; const o=$('cout'); if(o)o.innerHTML=''; drawEd(); document.querySelectorAll('[data-cf]').forEach(x=>x.textContent=L(...FNM2[x.dataset.cf])+(CDB.inp[x.dataset.cf].every(v=>v)?' ✓':''));});
  $('cpal').innerHTML=['Y','W','G','B','R','O'].map(c=>`<button class="${CS.color===c?'on':''}" data-cc="${c}" style="background:${HEX[c]}" title="${L(...CNM2[c])}"></button>`).join('');
  document.querySelectorAll('[data-cc]').forEach(b=>b.onclick=()=>{CS.color=b.dataset.cc; drawEd();});
  const cnt={Y:0,W:0,G:0,B:0,R:0,O:0}; let miss=0; SF.forEach(f=>CDB.inp[f].forEach(v=>{if(v)cnt[v]++; else miss++;}));
  $('ccnt').innerHTML=Object.keys(cnt).map(c=>`<span class="chip" style="cursor:default;${cnt[c]>4?'color:var(--bad);border-color:var(--bad)':''}">${L(...CNM2[c])}: ${cnt[c]}/4</span>`).join('')+(miss?`<span class="chip" style="cursor:default">${L("Bo'sh",'Empty')}: ${miss}</span>`:'');
}
const AUF4=['',"U","U2","U'"];
function lblSolve(st){ // st normalized (DBL home). returns steps
  const steps=[]; let cur=cloneSt(st);
  const layerOK=s=>{const c=C2.readCubie(s); return [4,5,6,7].every(i=>c.cp[i]===i&&c.co[i]===0);};
  // BFS for first layer
  if(!layerOK(cur)){ const key=s=>{const c=C2.readCubie(s); return [4,5,7].map(p=>{const j=c.cp.indexOf(p); return j+'.'+c.co[j];}).join(',');};
    let fr=[{s:cur,p:[]}], seen={[key(cur)]:1}, found=null;
    for(let d=0;d<9&&!found;d++){const nx=[]; for(const it of fr){ for(const m of C2.MV){ const s2=apply(cloneSt(it.s),m), k=key(s2); if(seen[k]) continue; seen[k]=1; const p=it.p.concat([m]); if(layerOK(s2)){found={s:s2,p};break;} nx.push({s:s2,p}); } if(found)break; } fr=nx;}
    if(!found) return null; steps.push({t:L('Birinchi qatlam','First layer'),moves:found.p}); cur=found.s; }
  const topY=s=>[[1,1,1],[-1,1,1],[-1,1,-1],[1,1,-1]].every(p=>stk(s,p,[0,1,0]).c==='Y');
  const pick=(cases,pred)=>{let b=null; cases.forEach(c=>AUF4.forEach(a=>{const s=apply(cloneSt(cur),(a+' '+c.alg).trim()); if(pred(s)){const mv=tokens((a+' '+c.alg).trim()); if(!b||mv.length<b.mv.length)b={c,mv,s};}})); return b;};
  if(!topY(cur)){const b=pick(c2cases('OLL'),topY); if(!b) return null; steps.push({t:'OLL · '+b.c.name,moves:b.mv}); cur=b.s;}
  const solvedAuf=s=>AUF4.findIndex(a=>isSolved2(a?apply(cloneSt(s),a):s));
  if(solvedAuf(cur)<0){const b=pick(c2cases('PLL'),s=>solvedAuf(s)>=0); if(!b) return null; steps.push({t:'PLL · '+b.c.name,moves:b.mv}); cur=b.s;}
  const k=solvedAuf(cur); if(k>0) steps.push({t:'AUF',moves:[AUF4[k]]});
  return steps;
}
function solveNow(){
  const out=$('cout'); const cnt={Y:0,W:0,G:0,B:0,R:0,O:0}; let miss=0; SF.forEach(f=>CDB.inp[f].forEach(v=>{if(v)cnt[v]++; else miss++;}));
  if(miss){out.innerHTML=`<div class="err">${L(`Hali ${miss} ta stiker bo'yalmagan.`,`${miss} stickers are still empty.`)}</div>`; return;}
  if(Object.values(cnt).some(v=>v!==4)){out.innerHTML=`<div class="err">${L("Har bir rangdan 4 tadan bo'lishi kerak.","Each colour must appear 4 times.")}</div>`; return;}
  const st=inpSt(); const nz=C2.normalize(st);
  if(!nz){out.innerHTML=`<div class="err">${L("Oq-yashil-to'q sariq burchak topilmadi — ranglarni tekshiring.","The white-green-orange corner wasn't found — check the colours.")}</div>`; return;}
  const c=C2.readCubie(nz.st);
  if(c.error){out.innerHTML=`<div class="err">${c.error==='twist'?L("Bitta burchak buralgan — bunday holat yig'ilmaydi. Stikerlarni tekshiring.","One corner is twisted — impossible state. Check the stickers."):L("Bunday ranglar birikmasidagi burchak yo'q — stikerlarni tekshiring.","A corner has an impossible colour combination — check the stickers.")}</div>`; return;}
  const segs=[]; if(nz.rot) segs.push({t:L("Kubni burish (ushlash)","Rotate the cube"),moves:tokens(nz.rot)});
  if(CDB.mode==='opt') segs.push({t:L('Eng qisqa yechim','Shortest solution'),moves:C2.optimalIdx(C2.enc(c))});
  else (lblSolve(nz.st)||[]).forEach(s=>segs.push(s));
  CS.res={start:st,segs:segs.filter(s=>s.moves.length)}; showSol();
}
function showSol(){ CS.toks=[]; CS.segs=CS.res.segs.map(s=>{const o={...s,from:CS.toks.length}; CS.toks.push(...s.moves); o.to=CS.toks.length; return o;});
  const out=$('cout'); if(!out) return;
  if(!CS.toks.length){out.innerHTML=`<div class="note">${L("Kub allaqachon yig'ilgan ✓","Already solved ✓")}</div>`; return;}
  out.innerHTML=`<div class="row" style="justify-content:space-between"><b>${L('Jami','Total')}: ${CS.toks.filter(t=>!/^[xyz]/.test(t)).length} ${L('harakat','moves')}</b><div class="row" style="gap:6px">${copyBtn(CS.toks.join(' '),'sm')}<button class="sm" id="ctosim">🧊 ${L('Simulyatorda','In simulator')}</button></div></div>
   <div id="ccube"></div><div class="tokens" id="ctok"></div>
   <div class="row" style="justify-content:center"><button id="c0">⏮</button><button id="cb">◀</button><button class="pri" id="cp">▶ ${L("O'ynash",'Play')}</button><button id="cn">▶|</button></div>
   <div class="steps">${CS.segs.map((s,k)=>`<div class="st" data-sg="${k}"><span class="num">${k+1}</span><div><b>${s.t}</b><div class="alg" style="margin-top:4px;font-size:13px">${s.moves.join(' ')}</div></div></div>`).join('')}</div>`;
  CS.start=CS.res.start; CS.cube=new Cube3D($('ccube'),{two:true,size:62,height:230,state:cloneSt(CS.start),dur:()=>300}); csSet(0);
  $('c0').onclick=()=>csSet(0); $('cn').onclick=csNext; $('cb').onclick=()=>{csStop(); if(CS.i<=0||CS.cube.busy)return; CS.i--; CS.cube.enqueue([invert(CS.toks[CS.i])],false); csDraw();};
  $('cp').onclick=()=>CS.play?csStop():csPlay(CS.toks.length);
  $('ctosim').onclick=()=>{SIM2.cube.hist.length=0; SIM2.cube.setState(cloneSt(CS.start)); $('salg').value=CS.toks.join(' '); openSim();};
  document.querySelectorAll('[data-sg]').forEach(el=>el.onclick=()=>{const s=CS.segs[+el.dataset.sg]; csSet(s.from); csPlay(s.to);}); }
function csSet(i){csStop(); CS.i=i; const st=cloneSt(CS.start); if(i) apply(st,CS.toks.slice(0,i).join(' ')); CS.cube.setState(st); csDraw();}
function csNext(){ if(CS.i>=CS.toks.length||CS.cube.busy) return; CS.cube.enqueue([CS.toks[CS.i]],false); CS.i++; csDraw(); }
function csPlay(end){ csStop(); CS.end=end; $('cp').innerHTML='■'; CS.play=setInterval(()=>{ if(CS.cube.busy) return; if(CS.i>=CS.end){csStop();return;} csNext(); },40); }
function csStop(){ if(CS.play){clearInterval(CS.play); CS.play=null;} const b=$('cp'); if(b) b.innerHTML='▶ '+L("O'ynash",'Play'); }
function csDraw(){ const el=$('ctok'); if(!el) return; el.innerHTML=CS.toks.map((t,k)=>`<span class="${k<CS.i?'done':k===CS.i?'cur':''}">${t}</span>`).join(''); document.querySelectorAll('[data-sg]').forEach(s=>{const g=CS.segs[+s.dataset.sg]; s.classList.toggle('cur',CS.i>=g.from&&CS.i<g.to);}); }

// ---------- random-state scramble (WCA style, R U F) ----------
function scramble2(){ let x,sol; do{ x=Math.floor(Math.random()*5040*729); }while(C2.optimalIdx(x).length<4);
  sol=C2.optimalIdx(x); return invert(sol.join(' ')); }

// ---------- timer ----------
let CT={state:'idle',start:0,raf:0,holdT:0,scr:'',cube:null};
function renderTimer(){
  $('v-timer').innerHTML=`<h1>${L('Taymer','Timer')}</h1><p class="lead">${L("Aralashtirish — tasodifiy holat (WCA usulida, R U F harakatlari). Oq tepada, yashil oldda ushlab aralashtiring.","Random-state scramble (WCA style, R U F moves). Scramble with white on top, green in front.")}</p>
   <div class="grid g2" style="align-items:start"><div class="grid" style="gap:14px"><div class="card"><div class="row" style="justify-content:space-between;margin-bottom:8px"><b>${L('Aralashtirish','Scramble')}</b><div class="row" style="gap:6px"><button class="sm" id="tcopy">⧉</button><button class="sm" id="tnew">↻ ${L('Yangi','New')}</button></div></div>
     <div class="scr" id="tscr"></div><div id="tcube" style="margin-top:10px"></div></div>
    <div class="timer" id="ctimer"><div class="t" id="ctd">0.00</div><div class="muted" id="cth" style="margin-top:12px"></div></div>
    <label class="chip ${CDB.insp?'on':''}" id="tinsp" style="align-self:flex-start">${L("15 s ko'zdan kechirish",'15 s inspection')}</label></div>
   <div class="card"><div class="stats" id="tstat" style="margin-bottom:12px"></div><div class="times"><table class="tbl" id="ttbl"></table></div><div class="row" style="margin-top:10px"><button class="sm" id="tdel">${L("Oxirgisini o'chirish",'Delete last')}</button></div></div></div>`;
  CT.cube=new Cube3D($('tcube'),{two:true,size:56,height:200,scheme:SCHEME_WCA,state:C2wca(),dur:()=>160});
  if(curView()==='timer'){ if(!CT.scr) CT.scr=scramble2(); showScr(); } renderTimes(); CT.state='idle'; ctUI('','0.00',ctIdle());
  $('tnew').onclick=()=>{CT.scr=scramble2(); showScr();}; $('tcopy').onclick=e=>copyText(CT.scr,e.currentTarget);
  $('tdel').onclick=()=>{CDB.times.pop(); csave(); renderTimes();};
  $('tinsp').onclick=()=>{CDB.insp=!CDB.insp; csave(); $('tinsp').classList.toggle('on',CDB.insp);};
  const el=$('ctimer'); el.addEventListener('pointerdown',e=>{e.preventDefault(); ctDown();}); el.addEventListener('pointerup',e=>{e.preventDefault(); ctUp();});
}
function C2wca(){return solvedCube(SCHEME_WCA).filter(t=>t.p.every(v=>v!==0));}
function showScr(){ $('tscr').textContent=CT.scr; CT.cube.setState(apply(C2wca(),CT.scr)); }
function renderTimes(){ const t=CDB.times, best=t.length?Math.min(...t.map(x=>x.ms)):null;
  $('tstat').innerHTML=`<div><b>${fmt(best)}</b><span>${L('Eng yaxshi','Best')}</span></div><div><b>${fmt(avgN(5))}</b><span>ao5</span></div><div><b>${fmt(avgN(12))}</b><span>ao12</span></div>`;
  $('ttbl').innerHTML=t.length?t.map((x,i)=>`<tr><td>${i+1}</td><td><b>${fmt(x.ms)}</b></td><td class="muted" style="font:12px var(--mono)">${x.scr}</td></tr>`).reverse().join(''):`<tr><td class="muted" style="font:inherit">${L("Hali yechim yo'q",'No solves yet')}</td></tr>`; }
const ctIdle=()=>matchMedia('(pointer:coarse)').matches?L("Bosib turing, qo'yib yuborganda boshlanadi","Press and hold, release to start"):L("Space'ni bosib turing","Hold Space, release to start");
function ctUI(c,t,h){const el=$('ctimer'); if(!el)return; el.className='timer '+(c||''); if(t!=null)$('ctd').textContent=t; if(h!=null)$('cth').textContent=h;}
function ctDown(){
  if(CT.state==='running'){const ms=performance.now()-CT.start; cancelAnimationFrame(CT.raf); CT.state='idle'; CDB.times.push({ms:Math.round(ms),scr:CT.scr}); csave(); ctUI('',fmt(ms),ctIdle()); renderTimes(); CT.scr=scramble2(); showScr(); CT.just=true; return;}
  if(CT.state==='idle'&&CDB.insp&&!CT.insp){CT.insp=true; CT.state='insp'; CT.is=performance.now(); const lp=()=>{ if(!['insp','hold','ready'].includes(CT.state)) return; const left=15-Math.floor((performance.now()-CT.is)/1000); if(CT.state==='insp') ctUI('insp',left>0?String(left):'+2',L("Ko'zdan kechiring","Inspect")); CT.raf=requestAnimationFrame(lp);}; lp(); CT.just=true; return;}
  if(CT.state==='idle'||CT.state==='insp'){CT.prev=CT.state; CT.state='hold'; ctUI('hold',null,L('Ushlab turing…','Keep holding…')); CT.holdT=setTimeout(()=>{if(CT.state==='hold'){CT.state='ready'; ctUI('ready','0.00',L("Qo'yib yuboring!",'Release!'));}},300);}
}
function ctUp(){ if(CT.just){CT.just=false;return;}
  if(CT.state==='hold'){clearTimeout(CT.holdT); CT.state=CT.prev==='insp'?'insp':'idle'; if(CT.state==='idle') ctUI('',null,ctIdle());}
  else if(CT.state==='ready'){CT.state='running'; CT.insp=false; CT.start=performance.now(); ctUI('','0.00',L("Istalgan tugma — to'xtatish",'Any key to stop')); const lp=()=>{if(CT.state!=='running')return; $('ctd').textContent=fmt(performance.now()-CT.start); CT.raf=requestAnimationFrame(lp);}; lp();}
}

// ---------- simulator ----------
const SIM2={cube:null};
function renderSim(){
  const st=SIM2.cube?SIM2.cube.st:c2solved(), hist=SIM2.cube?SIM2.cube.hist:[];
  const mv=['R','L','U','D','F','B','x','y'];
  $('sheet').innerHTML=`<div class="grab"></div><div class="inner"><div class="row" style="justify-content:space-between"><b>🧊 ${L('Simulyator','Simulator')} 2x2</b><span id="ssolved"></span><button class="sm ghost" id="sclose">✕</button></div>
   <div id="scube"></div><div class="mg">${mv.map(m=>`<button data-mv="${m}">${m}</button>`).join('')}${mv.map(m=>`<button data-mv="${m}'">${m}'</button>`).join('')}</div>
   <div class="row" style="flex-wrap:nowrap;gap:6px"><input class="txt" id="salg" placeholder="${L('Formula','Algorithm')}: R U R' U'" autocomplete="off" spellcheck="false"><button class="sm pri" id="srun">▶</button></div>
   <div class="row" style="gap:6px"><button class="sm" id="ssetup">${L("Holatni o'rnatish",'Set up case')}</button><button class="sm" id="sscr">${L('Aralashtirish','Scramble')}</button><button class="sm" id="sundo">↶</button><button class="sm" id="sreset">${L('Tiklash','Reset')}</button></div>
   <div id="smsg" class="muted" style="font-size:13px;min-height:18px"></div><div class="muted" style="font:12.5px var(--mono)" id="shist">—</div></div>`;
  SIM2.cube=new Cube3D($('scube'),{two:true,size:68,height:250,state:st,hist,dur:()=>220,onChange:c=>{const s=$('ssolved'); if(s) s.innerHTML=isSolved2(c.st)?`<span class="ok" style="font-weight:700">✓ ${L("Yig'ilgan",'Solved')}</span>`:''; const h=$('shist'); if(h) h.textContent=c.hist.slice(-30).join(' ')||'—';}});
  $('sheet').querySelector('.mg').onclick=e=>{const b=e.target.closest('[data-mv]'); if(b) SIM2.cube.enqueue([b.dataset.mv]);};
  $('sclose').onclick=closeSim;
  const parse=()=>{const v=$('salg').value.trim(); if(!v){$('smsg').textContent=L('Formula yozing.','Type an algorithm.'); return null;} const t=tokens(v); const bad=t.find(x=>{try{parseTok(x);return false;}catch(_){return true;}}); if(bad){$('smsg').textContent=L('Tushunarsiz harakat: ','Unknown move: ')+bad; return null;} $('smsg').textContent=''; return t;};
  $('srun').onclick=()=>{const t=parse(); if(t) SIM2.cube.enqueue(t);};
  $('salg').addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault(); $('srun').click();}});
  $('ssetup').onclick=()=>{const t=parse(); if(t){SIM2.cube.hist.length=0; SIM2.cube.setState(cstate(t.join(' ')));}};
  $('sscr').onclick=()=>{const s=scramble2(); SIM2.cube.hist.length=0; SIM2.cube.setState(apply(c2solved(),s)); $('salg').value=s;};
  $('sundo').onclick=()=>{ if(SIM2.cube.busy) return; const t=SIM2.cube.hist.pop(); if(t) SIM2.cube.enqueue([invert(t)],false); };
  $('sreset').onclick=()=>{SIM2.cube.hist.length=0; SIM2.cube.setState(c2solved());};
}
function openSim(){$('sheet').classList.add('on');} function closeSim(){$('sheet').classList.remove('on');}
function simLoad(alg){SIM2.cube.hist.length=0; SIM2.cube.setState(cstate(alg)); $('salg').value=alg; openSim();}

// ---------- events ----------
document.addEventListener('click',e=>{
  const cp=e.target.closest('[data-copy]'); if(cp){copyText(cp.dataset.copy,cp); return;}
  const pl=e.target.closest('[data-play]'); if(pl){openPlayer(pl.dataset.play,pl.dataset.title); return;}
  const sm=e.target.closest('[data-sim]'); if(sm){simLoad(sm.dataset.sim); return;}
});
document.addEventListener('keydown',e=>{
  if(e.key==='Escape'){closeModal(); closeSim();}
  const inField=['INPUT','SELECT','TEXTAREA'].includes(e.target.tagName), sheetOn=$('sheet').classList.contains('on');
  if(curView()==='timer'&&!e.repeat&&!inField&&!sheetOn){ if(e.key===' '||CT.state==='running'){e.preventDefault(); ctDown(); return;} }
  if(sheetOn&&!inField&&!e.ctrlKey&&!e.metaKey&&!e.altKey&&!e.repeat){ const k=e.key.length===1?e.key.toLowerCase():''; let f=null; if(k&&'rludfb'.includes(k)) f=k.toUpperCase(); else if(k&&'xyz'.includes(k)) f=k; if(f){e.preventDefault(); SIM2.cube.enqueue([f+(e.shiftKey?"'":'')]);} }
});
document.addEventListener('keyup',e=>{ if(curView()!=='timer') return; if(e.key===' '||CT.just){e.preventDefault(); ctUp();} });
$('langBtn').onclick=()=>{ if(CT.state==='running') return; DB.lang=DB.lang==='en'?'uz':'en'; save(); renderAll(); };
$('thBtn').onclick=()=>{DB.theme=curTheme()==='dark'?'light':'dark'; save(); applyTheme();};
$('simBtn').onclick=()=>$('sheet').classList.contains('on')?closeSim():openSim();
function renderAll(){ csStop(); metroStop(); renderShell(); renderLessons2(); renderExamHome2(); renderDrill(); renderSolver(); renderTimer(); renderSim(); route(); }
renderAll();
