// ===== Pyraminx app =====
const PKEY='pyraTrainer.v1';
let PDB={lvl:1,tasks:{},stats:{},times:[],sets:['LL'],insp:false,mode:'opt',bpm:80,simSpeed:220,inp:null};
try{const r=localStorage.getItem(PKEY); if(r) PDB=Object.assign(PDB,JSON.parse(r));}catch(e){}
function psave(){try{localStorage.setItem(PKEY,JSON.stringify(PDB));}catch(e){}}
const VIEWS=['lessons','drill','exam','solver','timer'];
const ICON={
 exam:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3h6l1 3H8z"/><rect x="5" y="5" width="14" height="16" rx="2"/><path d="m9 13 2 2 4-4"/></svg>',
 home:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M12 3 3 20h18z"/><path d="M12 3v17M7.5 11.5h9"/></svg>',
 lessons:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 21V5M8 7h7"/></svg>',
 drill:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.2" fill="currentColor"/></svg>',
 solver:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M12 3 2.5 20h19z"/><path d="M7.2 11.5h9.6M4.9 15.8h14.2M12 3l-4.8 8.5 4.8 8.5 4.8-8.5z"/></svg>',
 timer:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 2M10 2h4"/></svg>'};
const NAMES=()=>({exam:L('Imtihon','Exam'),lessons:L('Darslar','Lessons'),drill:L('Mashq','Practice'),solver:L('Yechuvchi','Solver'),timer:L('Taymer','Timer')});
function curView(){const h=(location.hash||'#lessons').slice(1); return VIEWS.includes(h)?h:'lessons';}
function route(){const v=curView(); if(v==='timer'&&!PT.scr&&PT.cube){ PT.scr=randomScramble(); showScr(); } if(v==='exam'&&!document.querySelector('#v-exam .xrun')) renderExamHomeP(); VIEWS.forEach(k=>$('v-'+k).classList.toggle('on',k===v));
  document.querySelectorAll('[data-nav]').forEach(a=>a.classList.toggle('on',a.dataset.nav===v));
  if(v!=='drill') metroStop(); window.scrollTo(0,0);}
window.addEventListener('hashchange',route);
function curTheme(){return DB.theme||(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');}
function applyTheme(){const t=curTheme(); document.documentElement.dataset.theme=t; $('thBtn').textContent=t==='dark'?'☀️':'🌙';
  const tm=document.querySelector('meta[name=theme-color]'); if(tm) tm.content=t==='dark'?'#0f0f12':'#f7f6f2';}
const LV=()=>PLEVELS.find(l=>l.id===PDB.lvl)||PLEVELS[0];
const pct=lv=>{const n=lv.tasks.length; let d=0; lv.tasks.forEach((_,i)=>{if(PDB.tasks[lv.id+'-'+i])d++;}); return Math.round(d/n*100);};

// ---------- shell ----------
function renderShell(){
  document.documentElement.lang=DB.lang; document.title='Pyraminx — '+L('Speedcubing trener','Speedcubing trainer');
  $('nm').textContent='Pyraminx';
  $('swCube').textContent='3x3'; $('langBtn').textContent=DB.lang==='en'?'UZ':'EN';
  const N=NAMES();
  $('rail').innerHTML=VIEWS.map(v=>`<a href="#${v}" data-nav="${v}">${ICON[v]}${N[v]}</a>`).join('');
  const SN=N;
  $('pill').innerHTML=VIEWS.map(v=>`<a href="#${v}" data-nav="${v}">${ICON[v]}<span>${SN[v]}</span></a>`).join('');
  $('foot').textContent=L("Natijalar faqat shu qurilmada saqlanadi.","Progress is stored on this device only.");
  applyTheme();
}

// ---------- home ----------
function fmt(ms){if(ms==null)return '—'; const s=ms/1000; return s<60?s.toFixed(2):Math.floor(s/60)+':'+(s%60).toFixed(2).padStart(5,'0');}
function avgN(n){const t=PDB.times; if(t.length<n) return null; const a=t.slice(-n).map(x=>x.ms).sort((x,y)=>x-y).slice(1,-1); return a.reduce((x,y)=>x+y,0)/a.length;}
let HOME3D=null;
function renderHome(){
  const best=PDB.times.length?Math.min(...PDB.times.map(t=>t.ms)):null;
  $('v-home').innerHTML=`<div class="hero">
   <div><h1>${L("Pyraminx'ni bosqichma-bosqich o'rganing","Learn the Pyraminx step by step")}</h1>
    <p class="lead">${L("Darajangizni tanlang. Har bir daraja — bitta metod: tushuntirish, formulalar, mashq va maqsad vaqti.","Pick your level. Each level is one method: explanation, algorithms, practice and a target time.")}</p>
    <div class="stats"><div><b>${fmt(best)}</b><span>${L('Eng yaxshi','Best')}</span></div><div><b>${fmt(avgN(5))}</b><span>ao5</span></div><div><b>${fmt(avgN(12))}</b><span>ao12</span></div></div></div>
   <div id="homeCube"></div></div>
   <h2>${L('Darajalar','Levels')}</h2>
   <div class="levels">${PLEVELS.map(lv=>`<button class="lvl" data-lvl="${lv.id}"><span class="dot" style="background:${lv.color}">${lv.id}</span>
     <span style="flex:1;min-width:0"><span class="t">${L(...lv.name)}</span> <span class="muted">· ${L(...lv.method)}</span><span class="s">${L(...lv.intro)}</span>
     <span class="bar"><i style="width:${pct(lv)}%;background:${lv.color}"></i></span></span>
     <span class="goal">${L('Maqsad','Goal')}<br><b style="color:var(--ink);font-size:14px">${L(...lv.goal)}</b></span></button>`).join('')}</div>`;
  HOME3D=new Pyra3D($('homeCube'),{height:matchMedia('(max-width:820px)').matches?230:280,state:PYRA.apply(PYRA.solved(),"U L' R B' l r'")});
  document.querySelectorAll('[data-lvl]').forEach(b=>b.onclick=()=>{PDB.lvl=+b.dataset.lvl; psave(); renderLessons(); location.hash='#lessons';});
}

// ---------- lessons ----------
let L4E_FILTER='short';
function caseCard(key,c){
  return `<div class="card case"><div class="pic">${pnetSVG(caseState(c),170)}</div><div class="nm">${c.name}</div>
   <div class="algrow"><span class="alg">${c.alg}</span>${copyBtn(c.alg,'sm ghost')}</div>
   <div class="row" style="gap:6px"><button class="sm" data-play="${c.alg}" data-title="${c.name}">▶ ${L("Ko'rish",'Watch')}</button><button class="sm" data-sim="${c.alg}">🔺 ${L('Simulyatorda','In simulator')}</button></div></div>`;
}
function renderLessons(){
  const lv=LV();
  let lib='';
  if(lv.lib==='LL'){ const cs=libCases('LL');
    lib=`<h2>${L("Oxirgi qatlam: 11 holat","Last layer: 11 cases")}</h2><p class="muted" style="margin-top:-6px">${L("Rasm — piramidaning yoyilmasi: o'rtada old (yashil) tomon, chapda chap, o'ngda o'ng tomon, pastda ostki tomon.","The picture is the unfolded puzzle: front (green) in the middle, left and right faces beside it, bottom face below.")}</p>
     <div class="grid g3">${cs.map(c=>caseCard('LL',c)).join('')}</div>`; }
  else if(lv.lib==='L4E'){ const cs=libCases('L4E'); const groups={short:c=>c.len<=6,mid:c=>c.len>=7&&c.len<=8,long:c=>c.len>=9};
    const shown=cs.filter(groups[L4E_FILTER]);
    lib=`<h2>${L("L4E holatlari","L4E cases")} <span class="muted" style="font-weight:500">· ${cs.length}</span></h2>
     <div class="chiprow" style="margin-bottom:14px">${[['short',L('4–6 harakat','4–6 moves')],['mid',L('7–8 harakat','7–8 moves')],['long',L('9–10 harakat','9–10 moves')]].map(([k,n])=>`<span class="chip ${L4E_FILTER===k?'on':''}" data-l4f="${k}">${n} <span class="muted">(${cs.filter(groups[k]).length})</span></span>`).join('')}</div>
     <div class="grid g3">${shown.map(c=>caseCard('L4E',c)).join('')}</div>`; }
  $('v-lessons').innerHTML=`<div class="seg">${PLEVELS.map(l=>`<button class="${l.id===lv.id?'on':''}" data-lv="${l.id}"><span class="d" style="background:${l.color}"></span>${l.id}. ${L(...l.name)}</button>`).join('')}</div>
   <h1>${L(...lv.method)}</h1><p class="lead">${L(...lv.intro)} <b>${L('Maqsad','Goal')}: ${L(...lv.goal)}</b></p>
   <div class="grid g2" style="align-items:start">
    <div class="card"><ol class="timeline">${lv.steps.map((s,i)=>`<li><span class="n">${i+1}</span><h3>${L(...s[0])}</h3><p>${L(...s[1])}</p></li>`).join('')}</ol></div>
    <div class="card"><h3>${L("Shu darajadagi vazifalar","Tasks for this level")}</h3>
     ${lv.tasks.map((t,i)=>{const k=lv.id+'-'+i; return `<label class="row" style="flex-wrap:nowrap;align-items:flex-start;padding:8px 0;border-top:1px solid var(--line);cursor:pointer"><input type="checkbox" data-task="${k}" ${PDB.tasks[k]?'checked':''} style="accent-color:var(--accent);margin-top:5px;width:17px;height:17px;flex:none"><span style="${PDB.tasks[k]?'text-decoration:line-through;color:var(--muted)':''}">${L(...t)}</span></label>`;}).join('')}
     <div class="bar" style="margin-top:12px"><i style="width:${pct(lv)}%;background:${lv.color}"></i></div>
     ${lv.id===1?fingerCard():''}</div>
   </div>${lib}`;
  document.querySelectorAll('[data-lv]').forEach(b=>b.onclick=()=>{PDB.lvl=+b.dataset.lv; psave(); renderLessons();});
  document.querySelectorAll('[data-task]').forEach(c=>c.onchange=()=>{PDB.tasks[c.dataset.task]=c.checked; psave(); renderLessons(); renderHome();});
  document.querySelectorAll('[data-l4f]').forEach(c=>c.onclick=()=>{L4E_FILTER=c.dataset.l4f; renderLessons();});
}
function fingerCard(){return `<h3 style="margin-top:20px">${L("Qo'l texnikasi","Finger technique")}</h3><table class="tbl">
  <tr><td>R / R'</td><td>${L("O'ng qo'l: bilakni kichik burish, bosh barmoq old tomonda","Right hand: a small wrist turn, thumb on the front")}</td></tr>
  <tr><td>L / L'</td><td>${L("Chap qo'l: xuddi shunday, ko'zgu nusxasi","Left hand: the same, mirrored")}</td></tr>
  <tr><td>U / U'</td><td>${L("Ko'rsatkich barmoq bilan tepani chertish (U — o'ng, U' — chap)","Flick the top with an index finger (U right, U' left)")}</td></tr>
  <tr><td>B / B'</td><td>${L("Kam ishlatiladi: halqa yoki o'rta barmoq bilan orqadan","Rare: ring or middle finger from the back")}</td></tr></table>
  <p class="muted" style="font-size:13px">${L("Piramidani bosh barmoqlar old tomonda, ko'rsatkichlar tepa uchda bo'lgan holda yengil ushlang.","Hold it lightly with thumbs on the front and index fingers near the top tip.")}</p>`;}

// ---------- player modal ----------
function openPlayer(alg,title){
  const toks=PYRA.tokens(alg); let i=0; const start=PYRA.apply(PYRA.solved(),PYRA.invert(alg));
  $('mbox').innerHTML=`<div class="row" style="justify-content:space-between"><h3 style="margin:0">${title||''}</h3><button class="sm ghost" id="mx">✕</button></div>
   <div id="mcube" style="height:250px;margin:8px 0"></div><div class="tokens" id="mtok"></div>
   <div class="row" style="justify-content:center;margin-top:12px"><button id="mf">⏮</button><button id="mp">◀</button><button class="pri" id="mn">${L('Keyingi','Next')} ▶</button><button id="ma">▶▶</button></div>`;
  const cube=new Pyra3D($('mcube'),{height:250,state:start,dur:()=>420});
  const draw=()=>{$('mtok').innerHTML=toks.map((t,k)=>`<span class="${k<i?'done':k===i?'cur':''}">${t}</span>`).join('');};
  $('mx').onclick=closeModal; $('mf').onclick=()=>{i=0; cube.setState(start); draw();};
  $('mn').onclick=()=>{ if(i>=toks.length||cube.busy) return; cube.enqueue([toks[i]],false); i++; draw(); };
  $('mp').onclick=()=>{ if(i<=0||cube.busy) return; i--; cube.enqueue([PYRA.invert(toks[i])],false); draw(); };
  $('ma').onclick=()=>{ cube.setState(start); i=0; cube.enqueue(toks,false); i=toks.length; draw(); };
  draw(); $('modal').classList.add('on');
}
function closeModal(){$('modal').classList.remove('on');}
$('modal').addEventListener('click',e=>{if(e.target.id==='modal')closeModal();});

// ---------- drill ----------
let DCUR=null, DMODE='rec';
const DSETS=()=>({LL:{name:L("Oxirgi qatlam (11)","Last layer (11)"),cases:libCases('LL'),choice:true},
  L4S:{name:L("L4E qisqa (≤6)","L4E short (≤6)"),cases:libCases('L4E').filter(c=>c.len<=6),choice:false},
  L4A:{name:L("L4E hammasi (95)","L4E all (95)"),cases:libCases('L4E'),choice:false}});
function renderDrill(){
  $('v-drill').innerHTML=`<div class="seg"><button class="${DMODE==='rec'?'on':''}" data-dm="rec">🎯 ${L('Tanib olish','Recognition')}</button><button class="${DMODE==='metro'?'on':''}" data-dm="metro">🎵 ${L('Metronom','Metronome')}</button></div><div id="dbody"></div>`;
  document.querySelectorAll('[data-dm]').forEach(b=>b.onclick=()=>{DMODE=b.dataset.dm; metroStop(); renderDrill();});
  if(DMODE==='rec') renderRec(); else renderMetro();
}
function renderRec(){
  const S=DSETS(); if(!PDB.sets.length||!S[PDB.sets[0]]) PDB.sets=['LL'];
  const key=PDB.sets[0];
  $('dbody').innerHTML=`<h1>${L('Tanib olish','Recognition')}</h1>
   <div class="chiprow" style="margin-bottom:16px">${Object.keys(S).map(k=>`<span class="chip ${k===key?'on':''}" data-ds="${k}">${S[k].name}</span>`).join('')}</div>
   <div class="grid g2" style="align-items:start"><div class="card stage" id="dstage"></div><div class="card" id="dside"></div></div>
   <div class="card" style="margin-top:14px"><div class="stats" id="dstat"></div></div>`;
  document.querySelectorAll('[data-ds]').forEach(c=>c.onclick=()=>{PDB.sets=[c.dataset.ds]; psave(); DCUR=null; renderRec();});
  nextDrill();
}
function nextDrill(){
  const set=DSETS()[PDB.sets[0]], cs=set.cases;
  const w=cs.map(c=>{const s=PDB.stats[PDB.sets[0]+':'+c.i]; return s?1+5*(s.w/(s.r+s.w)):3;}); let tot=w.reduce((a,b)=>a+b,0), r=Math.random()*tot, k=0;
  for(;k<cs.length;k++){r-=w[k]; if(r<=0)break;} k=Math.min(k,cs.length-1); if(DCUR&&cs.length>1&&cs[k].i===DCUR.c.i) k=(k+1)%cs.length;
  DCUR={c:cs[k],t0:performance.now(),done:false,set};
  $('dstage').innerHTML=`<div class="muted" style="font-size:13px">${set.name}</div>${pnetSVG(caseState(DCUR.c),260)}<div id="dverd" style="min-height:26px"></div>`;
  if(set.choice){
    $('dside').innerHTML=`<h3>${L('Bu qaysi holat?','Which case is this?')}</h3><div class="answers">${cs.map(c=>`<button data-ans="${c.i}">${c.name}</button>`).join('')}</div><div id="dafter"></div>`;
    document.querySelectorAll('[data-ans]').forEach(b=>b.onclick=()=>{ if(DCUR.done) return; DCUR.done=true; const ok=+b.dataset.ans===DCUR.c.i, ms=performance.now()-DCUR.t0;
      document.querySelectorAll('[data-ans]').forEach(x=>{if(+x.dataset.ans===DCUR.c.i)x.classList.add('right');}); if(!ok)b.classList.add('wrong'); drillRecord(ok,ms); drillAfter(ok,ms); });
  } else {
    $('dside').innerHTML=`<h3>${L('Formulani eslang','Recall the algorithm')}</h3><p class="muted">${L("Holatni tanib, formulani piramidada bajaring, keyin tekshiring.","Recognise the case, run it on your puzzle, then check.")}</p><button class="pri" id="drev">${L("Formulani ko'rsatish","Show algorithm")}</button><div id="dafter"></div>`;
    $('drev').onclick=()=>{ DCUR.done=true; const ms=performance.now()-DCUR.t0; $('drev').remove();
      $('dafter').innerHTML=afterCard(true)+`<div class="row" style="margin-top:12px"><button class="pri" id="dk">✓ ${L('Bildim','Knew it')}</button><button id="dn">✗ ${L('Bilmadim',"Didn't")}</button></div>`;
      $('dk').onclick=()=>{drillRecord(true,ms); nextDrill();}; $('dn').onclick=()=>{drillRecord(false,0); nextDrill();}; };
  }
  drillStats();
}
function afterCard(ok){const c=DCUR.c; return `<div class="card" style="margin-top:14px;padding:14px;background:${ok?'var(--ok-soft)':'var(--bad-soft)'};border:0"><b>${c.name}</b><div class="algrow" style="margin:6px 0"><span class="alg">${c.alg}</span>${copyBtn(c.alg,'sm ghost')}</div><button class="sm" data-play="${c.alg}" data-title="${c.name}">▶ ${L("Ko'rish",'Watch')}</button></div>`;}
function drillAfter(ok,ms){ $('dverd').innerHTML=`<span class="verdict ${ok?'ok':'no'}">${ok?L("To'g'ri!","Correct!")+' '+(ms/1000).toFixed(2)+' s':L('Xato — bu ',"Wrong — it's ")+DCUR.c.name}</span>`;
  $('dafter').innerHTML=afterCard(ok)+`<div class="row" style="margin-top:12px"><button class="pri" id="dnext">${L('Keyingi','Next')} ▶</button></div>`; $('dnext').onclick=nextDrill; }
function drillRecord(ok,ms){const k=PDB.sets[0]+':'+DCUR.c.i, s=PDB.stats[k]||(PDB.stats[k]={r:0,w:0,t:0}); if(ok){s.r++;s.t+=ms;} else s.w++; psave(); drillStats();}
function drillStats(){ const set=DSETS()[PDB.sets[0]]; let r=0,w=0,t=0; set.cases.forEach(c=>{const s=PDB.stats[PDB.sets[0]+':'+c.i]; if(s){r+=s.r;w+=s.w;t+=s.t;}});
  const el=$('dstat'); if(el) el.innerHTML=`<div><b>${r+w}</b><span>${L('Urinish','Attempts')}</span></div><div><b>${r+w?Math.round(r/(r+w)*100):0}%</b><span>${L('Aniqlik','Accuracy')}</span></div><div><b>${r&&set.choice?(t/r/1000).toFixed(2)+' s':'—'}</b><span>${L("O'rt. tanish",'Avg recognition')}</span></div>`; }

// ---------- metronome ----------
let PM={on:false,timer:null,i:0,reps:0,ctx:null,sel:0,cube:null};
function metroList(){ return [{name:'Sledge',alg:"R' L R L'",isCase:false},{name:'Hedge',alg:"L R' L' R",isCase:false}]
  .concat(libCases('LL').map(c=>({name:c.name,alg:c.alg,isCase:true}))).concat(libCases('L4E').filter(c=>c.len<=6).map(c=>({name:c.name,alg:c.alg,isCase:true}))); }
function metroStart0(){const it=metroList()[PM.sel]; return it.isCase?PYRA.apply(PYRA.solved(),PYRA.invert(it.alg)):PYRA.solved();}
function renderMetro(){
  const list=metroList(); if(PM.sel>=list.length) PM.sel=0;
  $('dbody').innerHTML=`<h1>${L('Metronom','Metronome')}</h1><p class="lead">${L("Har bir \"chiq\"da bitta harakat. Piramida ham shu ritmda harakatlanadi.","One move per click. The puzzle moves to the same beat.")}</p>
   <div class="card" style="max-width:560px"><div class="row" style="flex-wrap:nowrap"><select id="msel" style="flex:1;min-width:0">${list.map((it,i)=>`<option value="${i}" ${i===PM.sel?'selected':''}>${it.name} — ${it.alg}</option>`).join('')}</select><button class="sm" id="mcopy">⧉</button></div>
   <div class="row" style="margin:14px 0"><span>${L('Tezlik','Speed')}</span><input type="range" id="mbpm" min="40" max="300" step="10" value="${PDB.bpm}"><b id="mbv">${PDB.bpm}</b><span class="muted">${L('harakat/daq','moves/min')}</span></div>
   <div class="metro" id="mshow"></div><div class="row" style="justify-content:center;margin:14px 0"><button class="pri" id="mbtn">▶ ${L('Boshlash','Start')}</button><span class="muted" id="mreps"></span></div>
   <div id="mcube3" style="height:250px"></div></div>`;
  PM.cube=new Pyra3D($('mcube3'),{height:250,state:metroStart0(),dur:()=>Math.min(300,60000/PDB.bpm*0.7)});
  $('msel').onchange=e=>{PM.sel=+e.target.value; metroStop(); PM.reps=0; PM.cube.setState(metroStart0()); mdraw();};
  $('mcopy').onclick=e=>copyText(metroList()[PM.sel].alg,e.currentTarget);
  $('mbpm').oninput=e=>{PDB.bpm=+e.target.value; psave(); $('mbv').textContent=PDB.bpm; if(PM.on){metroStop(true); metroStart();}};
  $('mbtn').onclick=()=>PM.on?metroStop():metroStart(); mdraw();
}
function mdraw(){ if(!$('mshow')) return; const t=PYRA.tokens(metroList()[PM.sel].alg); $('mshow').innerHTML=t.map((x,k)=>`<span class="${PM.on&&k===PM.cur?'cur':''}">${x}</span>`).join(''); $('mreps').textContent=L('Takror','Reps')+': '+PM.reps; }
function mclick(acc){ if(!PM.ctx) return; try{const o=PM.ctx.createOscillator(),g=PM.ctx.createGain(); o.frequency.value=acc?1500:1000; g.gain.setValueAtTime(.25,PM.ctx.currentTime); g.gain.exponentialRampToValueAtTime(.001,PM.ctx.currentTime+.06); o.connect(g).connect(PM.ctx.destination); o.start(); o.stop(PM.ctx.currentTime+.07);}catch(e){} }
function metroStart(){ try{PM.ctx=PM.ctx||new (window.AudioContext||window.webkitAudioContext)(); PM.ctx.resume&&PM.ctx.resume();}catch(e){PM.ctx=null;}
  PM.on=true; PM.i=0; $('mbtn').innerHTML='■ '+L("To'xtatish",'Stop');
  const tick=()=>{ const it=metroList()[PM.sel], t=PYRA.tokens(it.alg), n=t.length+(it.isCase?1:0);
    if(PM.i===0&&it.isCase) PM.cube.setState(metroStart0());
    if(PM.i<t.length){PM.cur=PM.i; mclick(PM.i===0); PM.cube.enqueue([t[PM.i]],false);} else PM.cur=-1;
    mdraw(); PM.i++; if(PM.i>=n){PM.i=0;PM.reps++;} };
  tick(); PM.timer=setInterval(tick,60000/PDB.bpm); }
function metroStop(keep){ if(PM.timer)clearInterval(PM.timer); PM.timer=null; const was=PM.on; PM.on=false; const b=$('mbtn'); if(b) b.innerHTML='▶ '+L('Boshlash','Start'); if(was&&!keep&&PM.cube) PM.cube.setState(metroStart0()); mdraw(); }

// ---------- solver ----------
let SVP={color:'G',res:null,cube:null,toks:[],segs:[],i:0,play:null,start:null};
if(!PDB.inp) PDB.inp=new Array(36).fill(null);
const PCOL=['G','R','B','Y'], PCNM={G:['yashil','green'],R:['qizil','red'],B:["ko'k",'blue'],Y:['sariq','yellow']};
function renderSolver(){
  $('v-solver').innerHTML=`<h1>${L('Yechuvchi','Solver')}</h1><p class="lead">${L("Piramidangiz ranglarini kiriting — yechimni eng qisqa yo'l bilan yoki tanlagan metodingiz bo'yicha qadamma-qadam ko'rsataman.","Enter your puzzle's colours — get the shortest solution or a step-by-step one in the method you choose.")}</p>
   <div class="grid g2" style="align-items:start">
    <div class="card" style="display:flex;flex-direction:column;gap:14px">
     <div class="note" style="margin:0;font-size:13.5px">✋ ${L("Yashil tomon sizga qaragan, sariq tomon pastda, bitta uchi tepada bo'lsin. Yoyilmada o'rtadagi uchburchak — old tomon, chapdagisi — chap, o'ngdagisi — o'ng, pastdagisi — ostki tomon.","Hold green facing you, yellow on the bottom, one tip pointing up. In the net, the middle triangle is the front, left/right are the side faces, the bottom one is the base.")}</div>
     <div class="netin" id="pnet" style="display:flex;justify-content:center"></div>
     <div class="palette" id="ppal"></div><div class="row" style="justify-content:center;font-size:12.5px" id="pcnt"></div>
     <div class="row" style="justify-content:center;gap:6px"><button class="sm" id="pfs">🔺 ${L('Simulyatordan','From simulator')}</button><button class="sm" id="prnd">🎲 ${L('Tasodifiy','Random')}</button><button class="sm ghost" id="pclr">${L('Tozalash','Clear')}</button></div>
    </div>
    <div class="card" style="display:flex;flex-direction:column;gap:12px">
     <div class="chiprow">${[['opt',L('Eng qisqa','Shortest')],['lbl',L("Boshlang'ich (LBL)",'Beginner (LBL)')],['l4e','L4E']].map(([k,n])=>`<span class="chip ${PDB.mode===k?'on':''}" data-pm="${k}">${n}</span>`).join('')}</div>
     <button class="pri" id="psolve" style="padding:12px;font-size:16px">${L('Yechimni topish','Find solution')}</button><div id="pout"></div></div></div>`;
  document.querySelectorAll('[data-pm]').forEach(c=>c.onclick=()=>{PDB.mode=c.dataset.pm; psave(); renderSolver(); if(SVP.res) solveNow();});
  $('psolve').onclick=solveNow;
  $('pfs').onclick=()=>{PDB.inp=SIMP.cube.st.slice(); inpChanged();};
  $('prnd').onclick=()=>{PDB.inp=PYRA.apply(PYRA.solved(),randomScramble()); inpChanged();};
  $('pclr').onclick=()=>{PDB.inp=new Array(36).fill(null); inpChanged();};
  drawInput(); if(SVP.res) showPSolution();
}
function inpChanged(){psave(); SVP.res=null; drawInput(); const o=$('pout'); if(o) o.innerHTML='';}
function drawInput(){
  $('pnet').innerHTML=pnetSVG(PDB.inp.map(c=>c||'X'),320,(i,c)=>c==='X'?'var(--soft)':PYRA_HEX[c]);
  const polys=$('pnet').querySelectorAll('polygon'); // pairs: [outer, inner] per sticker in ST order
  polys.forEach((p,k)=>{const i=k>>1; p.classList.add('hit'); p.onclick=()=>{PDB.inp[i]=PDB.inp[i]===SVP.color?null:SVP.color; inpChanged();};});
  $('ppal').innerHTML=PCOL.map(c=>`<button class="${SVP.color===c?'on':''}" data-pc="${c}" style="background:${PYRA_HEX[c]}" title="${L(...PCNM[c])}"></button>`).join('');
  document.querySelectorAll('[data-pc]').forEach(b=>b.onclick=()=>{SVP.color=b.dataset.pc; drawInput();});
  const cnt={G:0,R:0,B:0,Y:0}; let miss=0; PDB.inp.forEach(c=>{if(c)cnt[c]++; else miss++;});
  $('pcnt').innerHTML=PCOL.map(c=>`<span class="chip" style="cursor:default;${cnt[c]>9?'color:var(--bad);border-color:var(--bad)':''}">${L(...PCNM[c])}: ${cnt[c]}/9</span>`).join('')+(miss?`<span class="chip" style="cursor:default">${L("Bo'sh",'Empty')}: ${miss}</span>`:'');
}
function perr(code,pos){const nm={U:L('tepa','top'),L:L('chap','left'),R:L("o'ng",'right'),B:L('orqa','back')}; const pn=pos?pos.split('').map(c=>nm[c]).join('–'):'';
  return ({edge:L(`<b>${pn}</b> qirrasida bunday ranglar birikmasi yo'q.`,`The <b>${pn}</b> edge has an impossible colour pair.`),center:L(`<b>${pn}</b> uchidagi markaz ranglari noto'g'ri.`,`The centre at the <b>${pn}</b> tip has wrong colours.`),
    tip:L(`<b>${pn}</b> uchining ranglari noto'g'ri.`,`The <b>${pn}</b> tip has wrong colours.`),dupEdge:L("Bir xil qirra ikki marta uchrayapti.","The same edge appears twice."),
    flip:L("Bitta qirra teskari aylangan — bunday holat yig'ilmaydi. Stikerlarni tekshiring.","One edge is flipped — impossible state. Check the stickers."),parity:L("Ikki qirra o'rni almashgan — bunday holat yig'ilmaydi.","Two edges are swapped — impossible state.")})[code]||code;}
function solveNow(){
  const cnt={G:0,R:0,B:0,Y:0}; let miss=0; PDB.inp.forEach(c=>{if(c)cnt[c]++; else miss++;});
  const out=$('pout');
  if(miss){out.innerHTML=`<div class="err">${L(`Hali ${miss} ta stiker bo'yalmagan.`,`${miss} stickers are still empty.`)}</div>`; return;}
  const bad=PCOL.filter(c=>cnt[c]!==9); if(bad.length){out.innerHTML=`<div class="err">${L("Har bir rangdan 9 tadan bo'lishi kerak.","Each colour must appear 9 times.")}</div>`; return;}
  const r=PSOLVER.readState(PDB.inp); if(r.error){out.innerHTML=`<div class="err">${perr(r.error,r.pos)}</div>`; return;}
  const v=PSOLVER.verify(r); if(v){out.innerHTML=`<div class="err">${perr(v)}</div>`; return;}
  const SN={tips:L('Uchlar','Tips'),layer1:L('Markazlar va birinchi qatlam','Centres & first layer'),align:L("Tepa markazni to'g'irlash",'Align top centre'),ll:L('Oxirgi qatlam','Last layer'),centers:L('Markazlar','Centres'),v:'V',l4e:'L4E'};
  let segs=[];
  if(PDB.mode==='opt'){ const tips=PSOLVER.tipMoves(r), body=PSOLVER.optimal(r); segs=[{title:SN.tips,moves:tips},{title:L('Eng qisqa yechim','Shortest solution'),moves:body}]; }
  else { const steps=PSOLVER.methodSolve(r,PDB.mode)||[]; const lib=PDB.mode==='lbl'?libCases('LL'):libCases('L4E');
    segs=steps.map(s=>({title:SN[s.key]+(s.caseIdx!=null?' · '+(lib.find(c=>c.i===s.caseIdx)||{}).name:''),moves:s.moves})); }
  SVP.res={start:PDB.inp.slice(),segs:segs.filter(s=>s.moves.length)}; showPSolution();
}
function showPSolution(){
  const segs=SVP.res.segs; SVP.toks=[]; SVP.segs=segs.map(s=>{const o={...s,from:SVP.toks.length}; SVP.toks.push(...s.moves); o.to=SVP.toks.length; return o;});
  const out=$('pout'); if(!out) return;
  if(!SVP.toks.length){out.innerHTML=`<div class="note">${L("Piramida allaqachon yig'ilgan ✓","Already solved ✓")}</div>`; return;}
  out.innerHTML=`<div class="row" style="justify-content:space-between"><b>${L('Jami','Total')}: ${SVP.toks.length} ${L('harakat','moves')}</b><div class="row" style="gap:6px">${copyBtn(SVP.toks.join(' '),'sm')}<button class="sm" id="ptosim">🔺 ${L('Simulyatorda','In simulator')}</button></div></div>
   <div id="pcube" style="height:250px"></div><div class="tokens" id="ptok"></div>
   <div class="row" style="justify-content:center"><button id="p0">⏮</button><button id="pb">◀</button><button class="pri" id="pp">▶ ${L("O'ynash",'Play')}</button><button id="pn">▶|</button></div>
   <div class="steps">${SVP.segs.map((s,k)=>`<div class="st" data-sg="${k}"><span class="num">${k+1}</span><div><b>${s.title}</b><div class="alg" style="margin-top:4px;font-size:13px">${s.moves.join(' ')}</div></div></div>`).join('')}</div>`;
  SVP.start=SVP.res.start; SVP.cube=new Pyra3D($('pcube'),{height:250,state:SVP.start,dur:()=>300});
  psSet(0);
  $('p0').onclick=()=>psSet(0); $('pn').onclick=psNext; $('pb').onclick=()=>{psStop(); if(SVP.i<=0||SVP.cube.busy)return; SVP.i--; SVP.cube.enqueue([PYRA.invert(SVP.toks[SVP.i])],false); psDraw();};
  $('pp').onclick=()=>SVP.play?psStop():psPlay(SVP.toks.length);
  $('ptosim').onclick=()=>{SIMP.cube.hist.length=0; SIMP.cube.setState(SVP.start); $('salg').value=SVP.toks.join(' '); openSim();};
  document.querySelectorAll('[data-sg]').forEach(el=>el.onclick=()=>{const s=SVP.segs[+el.dataset.sg]; psSet(s.from); psPlay(s.to);});
}
function psSet(i){psStop(); SVP.i=i; SVP.cube.setState(PYRA.apply(SVP.start,SVP.toks.slice(0,i).join(' '))); psDraw();}
function psNext(){ if(SVP.i>=SVP.toks.length||SVP.cube.busy) return; SVP.cube.enqueue([SVP.toks[SVP.i]],false); SVP.i++; psDraw(); }
function psPlay(end){ psStop(); SVP.end=end; $('pp').innerHTML='■'; SVP.play=setInterval(()=>{ if(SVP.cube.busy) return; if(SVP.i>=SVP.end){psStop();return;} psNext(); },40); }
function psStop(){ if(SVP.play){clearInterval(SVP.play); SVP.play=null;} const b=$('pp'); if(b) b.innerHTML='▶ '+L("O'ynash",'Play'); }
function psDraw(){ const el=$('ptok'); if(!el) return; el.innerHTML=SVP.toks.map((t,k)=>`<span class="${k<SVP.i?'done':k===SVP.i?'cur':''}">${t}</span>`).join('');
  document.querySelectorAll('[data-sg]').forEach(s=>{const g=SVP.segs[+s.dataset.sg]; s.classList.toggle('cur',SVP.i>=g.from&&SVP.i<g.to);}); }

// ---------- random-state scramble ----------
function randomScramble(){
  let ep; do{ ep=[0,1,2,3,4,5].sort(()=>Math.random()-.5); }while(PSOLVER.verify({ep,eo:[0,0,0,0,0,0],ao:[0,0,0,0]})==='parity');
  const eo=[0,0,0,0,0].map(()=>Math.random()<.5?1:0); eo.push(eo.reduce((a,b)=>a+b,0)%2);
  const ao=[0,0,0,0].map(()=>Math.floor(Math.random()*3));
  const s={ep,eo,ao,to:ao.slice()}; let sol=PSOLVER.optimal(s);
  if(sol.length<6) return randomScramble();
  const tips=['u','l','r','b'].map(t=>{const x=Math.floor(Math.random()*3); return x===1?t:x===2?t+"'":'';}).filter(Boolean);
  return PYRA.invert(sol.join(' '))+(tips.length?' '+tips.join(' '):'');
}

// ---------- timer ----------
let PT={state:'idle',start:0,raf:0,holdT:0,scr:'',cube:null};
function renderTimer(){
  $('v-timer').innerHTML=`<h1>${L('Taymer','Timer')}</h1><p class="lead">${L("Aralashtirish — tasodifiy holat (WCA usulida): avval katta burilishlar, oxirida uchlar. Yashil oldda, sariq pastda ushlang.","Random-state scramble (WCA style): big turns first, tips last. Hold green in front, yellow on the bottom.")}</p>
   <div class="grid g2" style="align-items:start"><div class="grid" style="gap:14px">
    <div class="card"><div class="row" style="justify-content:space-between;margin-bottom:8px"><b>${L('Aralashtirish','Scramble')}</b><div class="row" style="gap:6px"><button class="sm" id="tcopy">⧉</button><button class="sm" id="tnew">↻ ${L('Yangi','New')}</button></div></div>
     <div class="scr" id="tscr"></div><div class="row" style="justify-content:center;gap:12px;margin-top:10px"><div id="tcube" style="width:200px;height:190px"></div><div id="tnet"></div></div></div>
    <div class="timer" id="ptimer"><div class="t" id="ptd">0.00</div><div class="muted" id="pth" style="margin-top:12px"></div></div>
    <label class="chip ${PDB.insp?'on':''}" id="tinsp" style="align-self:flex-start">${L("15 s ko'zdan kechirish",'15 s inspection')}</label></div>
   <div class="card"><div class="stats" id="tstat" style="margin-bottom:12px"></div><div class="times"><table class="tbl" id="ttbl"></table></div>
    <div class="row" style="margin-top:10px"><button class="sm" id="tdel">${L("Oxirgisini o'chirish",'Delete last')}</button></div></div></div>`;
  PT.cube=new Pyra3D($('tcube'),{height:190,dur:()=>160});
  if(curView()==='timer'){ if(!PT.scr) PT.scr=randomScramble(); showScr(); } renderTimes(); PT.state='idle'; ptUI('','0.00',ptIdle());
  $('tnew').onclick=()=>{PT.scr=randomScramble(); showScr();}; $('tcopy').onclick=e=>copyText(PT.scr,e.currentTarget);
  $('tdel').onclick=()=>{PDB.times.pop(); psave(); renderTimes();};
  $('tinsp').onclick=()=>{PDB.insp=!PDB.insp; psave(); $('tinsp').classList.toggle('on',PDB.insp);};
  const el=$('ptimer'); el.addEventListener('pointerdown',e=>{e.preventDefault(); ptDown();}); el.addEventListener('pointerup',e=>{e.preventDefault(); ptUp();});
}
function showScr(){ $('tscr').textContent=PT.scr; const st=PYRA.apply(PYRA.solved(),PT.scr); PT.cube.setState(st); $('tnet').innerHTML=pnetSVG(st,170); }
function renderTimes(){ const t=PDB.times; const best=t.length?Math.min(...t.map(x=>x.ms)):null;
  $('tstat').innerHTML=`<div><b>${fmt(best)}</b><span>${L('Eng yaxshi','Best')}</span></div><div><b>${fmt(avgN(5))}</b><span>ao5</span></div><div><b>${fmt(avgN(12))}</b><span>ao12</span></div>`;
  $('ttbl').innerHTML=t.length?t.map((x,i)=>`<tr><td>${i+1}</td><td><b>${fmt(x.ms)}</b></td><td class="muted" style="font:12px var(--mono)">${x.scr}</td></tr>`).reverse().join(''):`<tr><td class="muted" style="font:inherit">${L("Hali yechim yo'q",'No solves yet')}</td></tr>`; }
const ptIdle=()=>matchMedia('(pointer:coarse)').matches?L("Bosib turing, qo'yib yuborganda boshlanadi","Press and hold, release to start"):L("Space'ni bosib turing","Hold Space, release to start");
function ptUI(c,t,h){const el=$('ptimer'); if(!el)return; el.className='timer '+(c||''); if(t!=null)$('ptd').textContent=t; if(h!=null)$('pth').textContent=h;}
function ptDown(){
  if(PT.state==='running'){const ms=performance.now()-PT.start; cancelAnimationFrame(PT.raf); PT.state='idle'; PDB.times.push({ms:Math.round(ms),scr:PT.scr}); psave(); ptUI('',fmt(ms),ptIdle()); renderTimes(); PT.scr=randomScramble(); showScr(); PT.just=true; return;}
  if(PT.state==='idle'&&PDB.insp&&!PT.insp){PT.insp=true; PT.state='insp'; PT.is=performance.now(); const lp=()=>{ if(!['insp','hold','ready'].includes(PT.state)) return; const left=15-Math.floor((performance.now()-PT.is)/1000); if(PT.state==='insp') ptUI('insp',left>0?String(left):'+2',L("Ko'zdan kechiring","Inspect")); PT.raf=requestAnimationFrame(lp);}; lp(); PT.just=true; return;}
  if(PT.state==='idle'||PT.state==='insp'){PT.prev=PT.state; PT.state='hold'; ptUI('hold',null,L('Ushlab turing…','Keep holding…')); PT.holdT=setTimeout(()=>{if(PT.state==='hold'){PT.state='ready'; ptUI('ready','0.00',L("Qo'yib yuboring!",'Release!'));}},300);}
}
function ptUp(){ if(PT.just){PT.just=false;return;}
  if(PT.state==='hold'){clearTimeout(PT.holdT); PT.state=PT.prev==='insp'?'insp':'idle'; if(PT.state==='idle') ptUI('',null,ptIdle());}
  else if(PT.state==='ready'){PT.state='running'; PT.insp=false; PT.start=performance.now(); ptUI('','0.00',L("Istalgan tugma — to'xtatish",'Any key to stop')); const lp=()=>{if(PT.state!=='running')return; $('ptd').textContent=fmt(performance.now()-PT.start); PT.raf=requestAnimationFrame(lp);}; lp();}
}

// ---------- simulator sheet ----------
const SIMP={cube:null};
function renderSim(){
  const st=SIMP.cube?SIMP.cube.st:PYRA.solved(), hist=SIMP.cube?SIMP.cube.hist:[];
  const mv=['U','L','R','B','u','l','r','b'];
  $('sheet').innerHTML=`<div class="grab"></div><div class="inner">
   <div class="row" style="justify-content:space-between"><b>🔺 ${L('Simulyator','Simulator')}</b><span id="ssolved"></span><button class="sm ghost" id="sclose">✕</button></div>
   <div id="scube" style="height:260px"></div>
   <div class="mg">${mv.map(m=>`<button data-mv="${m}">${m}</button>`).join('')}${mv.map(m=>`<button data-mv="${m}'">${m}'</button>`).join('')}</div>
   <div class="row" style="flex-wrap:nowrap;gap:6px"><input class="txt" id="salg" placeholder="${L('Formula',"Algorithm")}: R U R' U'" autocomplete="off" spellcheck="false"><button class="sm pri" id="srun">▶</button></div>
   <div class="row" style="gap:6px"><button class="sm" id="ssetup">${L("Holatni o'rnatish",'Set up case')}</button><button class="sm" id="sscr">${L('Aralashtirish','Scramble')}</button><button class="sm" id="sundo">↶</button><button class="sm" id="sreset">${L('Tiklash','Reset')}</button></div>
   <div id="smsg" class="muted" style="font-size:13px;min-height:18px"></div>
   <div class="muted" style="font:12.5px var(--mono)" id="shist">—</div></div>`;
  SIMP.cube=new Pyra3D($('scube'),{height:260,state:st,hist,dur:()=>PDB.simSpeed,onChange:c=>{const s=$('ssolved'); if(s) s.innerHTML=c.solved()?`<span class="ok" style="font-weight:700">✓ ${L("Yig'ilgan",'Solved')}</span>`:''; const h=$('shist'); if(h) h.textContent=c.hist.slice(-30).join(' ')||'—';}});
  $('sheet').querySelector('.mg').onclick=e=>{const b=e.target.closest('[data-mv]'); if(b) SIMP.cube.enqueue([b.dataset.mv]);};
  $('sclose').onclick=closeSim;
  const parse=()=>{const v=$('salg').value.trim(); if(!v){$('smsg').textContent=L('Formula yozing.','Type an algorithm.'); return null;} const t=PYRA.tokens(v); const bad=t.find(x=>!PYRA.PERM[x]); if(bad){$('smsg').textContent=L('Tushunarsiz harakat: ','Unknown move: ')+bad; return null;} $('smsg').textContent=''; return t;};
  $('srun').onclick=()=>{const t=parse(); if(t) SIMP.cube.enqueue(t);};
  $('salg').addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault(); $('srun').click();}});
  $('ssetup').onclick=()=>{const t=parse(); if(t){SIMP.cube.hist.length=0; SIMP.cube.setState(PYRA.apply(PYRA.solved(),PYRA.invert(t.join(' '))));}};
  $('sscr').onclick=()=>{const s=randomScramble(); SIMP.cube.hist.length=0; SIMP.cube.setState(PYRA.apply(PYRA.solved(),s)); $('salg').value=s;};
  $('sundo').onclick=()=>{ if(SIMP.cube.busy) return; const t=SIMP.cube.hist.pop(); if(t) SIMP.cube.enqueue([PYRA.invert(t)],false); };
  $('sreset').onclick=()=>{SIMP.cube.hist.length=0; SIMP.cube.setState(PYRA.solved());};
}
function openSim(){$('sheet').classList.add('on');}
function closeSim(){$('sheet').classList.remove('on');}
function simLoad(alg){SIMP.cube.hist.length=0; SIMP.cube.setState(PYRA.apply(PYRA.solved(),PYRA.invert(alg))); $('salg').value=alg; openSim();}

// ---------- global events ----------
document.addEventListener('click',e=>{
  const cp=e.target.closest('[data-copy]'); if(cp){copyText(cp.dataset.copy,cp); return;}
  const pl=e.target.closest('[data-play]'); if(pl){openPlayer(pl.dataset.play,pl.dataset.title); return;}
  const sm=e.target.closest('[data-sim]'); if(sm){simLoad(sm.dataset.sim); return;}
});
document.addEventListener('keydown',e=>{
  if(e.key==='Escape'){closeModal(); closeSim();}
  const inField=['INPUT','SELECT','TEXTAREA'].includes(e.target.tagName);
  if(curView()==='timer'&&!e.repeat&&!inField&&!$('sheet').classList.contains('on')){ if(e.key===' '||PT.state==='running'){e.preventDefault(); ptDown(); return;} }
  if($('sheet').classList.contains('on')&&!inField&&!e.ctrlKey&&!e.metaKey&&!e.altKey&&!e.repeat){ const k=e.key.toUpperCase(); if('ULRB'.includes(k)&&k.length===1){e.preventDefault(); SIMP.cube.enqueue([k+(e.shiftKey?"'":'')]);} }
});
document.addEventListener('keyup',e=>{ if(curView()!=='timer') return; if(e.key===' '||PT.just){e.preventDefault(); ptUp();} });
$('langBtn').onclick=()=>{ if(PT.state==='running') return; DB.lang=DB.lang==='en'?'uz':'en'; save(); renderAll(); };
$('thBtn').onclick=()=>{DB.theme=curTheme()==='dark'?'light':'dark'; save(); applyTheme();};
$('simBtn').onclick=()=>$('sheet').classList.contains('on')?closeSim():openSim();
function renderAll(){ psStop(); metroStop(); renderShell(); renderLessonsP(); renderExamHomeP(); renderDrill(); renderSolver(); renderTimer(); renderSim(); route(); }
renderAll();
