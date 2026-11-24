// ===== 2x2 lessons (step cards) + exam =====
const AUF2=['',"U","U2","U'"], AUF2I=['',"U'","U2","U"];
function faces2(st){ const g={}; st.forEach(t=>{const k=t.n.join(); (g[k]=g[k]||[]).push(t);}); return g; }
function uniform(list){ return list.every(t=>t.c===list[0].c); }
function g2(type,st){
  const D=st.filter(t=>t.n[1]===-1), U=st.filter(t=>t.n[1]===1);
  if(type==='face') return uniform(D);
  if(type==='layer'){ if(!uniform(D)) return false; return ['1,0,0','-1,0,0','0,0,1','0,0,-1'].every(n=>uniform(st.filter(t=>t.n.join()===n&&t.p[1]===-1))); }
  if(type==='oll') return uniform(D)&&uniform(U);
  const solved=s=>Object.values(faces2(s)).every(uniform);
  return ['','D','D2',"D'"].some(d=>AUF2.some(a=>{const m=(d+' '+a).trim(); return solved(m?apply(cloneSt(st),m):st);}));
}
const G2TEXT={face:["Maqsad: pastda 4 ta oq stiker (yon ranglar muhim emas).","Goal: 4 white stickers on the bottom (side colours don't matter)."],layer:["Maqsad: birinchi qatlam to'liq — oq pastda, yon ranglar mos.","Goal: full first layer — white on the bottom, side colours matching."],oll:["Maqsad: tepa sariq, past oq.","Goal: yellow on top, white on the bottom."],solved:["Maqsad: kub to'liq yig'ilgan.","Goal: the cube fully solved."]};
function simp2(alg){ const out=[]; tokens(alg).forEach(t=>{ const m=parseTok(t), l=out.length?parseTok(out[out.length-1]):null; if(l&&l.f===m.f){ out.pop(); const a=(l.a+m.a)%4; if(a) out.push(m.f+(a===1?'':a===2?'2':"'")); } else out.push(t); }); return out.join(' '); }
// BFS helpers for intuitive steps (moves U R F, DBL fixed)
function bfs2(st,goalFn,maxD,keyFn){ if(goalFn(st)) return []; const key=keyFn||(s=>s.map(t=>t.c).join('')); let fr=[{s:st,p:[]}]; const seen={[key(st)]:1};
  for(let d=0;d<(maxD||8);d++){ const nx=[]; for(const it of fr) for(const m of C2.MV){ if(it.p.length&&it.p[it.p.length-1][0]===m[0]) continue; const s2=apply(cloneSt(it.s),m), k=key(s2); if(seen[k]) continue; seen[k]=1; const p=it.p.concat([m]); if(goalFn(s2)) return p; nx.push({s:s2,p}); } fr=nx; } return null; }
// keys: only what matters for the goal (keeps the search tiny)
const KEY2={face:s=>s.filter(t=>t.c==='W').map(t=>t.p.join('')+t.n.join('')).sort().join('|'),
  layer:s=>s.filter(t=>t.h[1]===-1).map(t=>t.c+t.p.join('')+t.n.join('')).sort().join('|')};
const C2A={orient:['Ushlash: <i style="background:#FFD500"></i> sariq tepada, <i style="background:#009E60"></i> yashil oldingizda (<i style="background:#FF5800"></i> to\'q sariq o\'ngda, <i style="background:#FFFFFF"></i> oq pastda)','Hold: <i style="background:#FFD500"></i> yellow on top, <i style="background:#009E60"></i> green facing you (<i style="background:#FF5800"></i> orange on the right, <i style="background:#FFFFFF"></i> white on the bottom)'],
  id:'c2', simIcon:'🧊',
  solved:()=>C2.solved(), apply:(st,alg)=>alg&&alg.trim()?apply(cloneSt(st),alg):cloneSt(st),
  invert:a=>a&&a.trim()?invert(a):'', tokens:a=>a&&a.trim()?tokens(a):[],
  pic:(st,view,size)=>{ if(view==='pbl'||view==='both') return `<span style="display:inline-flex;gap:4px">${c2face(st,'pll',size*0.78,'U')}${c2face(st,'pll',size*0.78,'D')}</span>`;
    if(view==='D') return c2face(st,'pll',size,'D'); if(view==='full') return c2iso(st,size); return c2face(st,view,size,'U'); },
  make3D:(host,st,o)=>new Cube3D(host,{two:true,state:cloneSt(st),height:o.height,size:Math.round(o.height/3.6),dur:o.dur,onChange:o.onChange}),
  moves:['R',"R'",'R2','U',"U'",'U2','F',"F'",'F2','L',"L'",'D',"D'",'B',"B'",'x','y'],
  valid:t=>{try{parseTok(t);return true;}catch(e){return false;}},
  goal:g2, goalText:t=>G2TEXT[t]||G2TEXT.solved,
  simLoad:(setup,sol)=>{SIM2.cube.hist.length=0; SIM2.cube.setState(apply(c2solved(),setup||'')); $('salg').value=sol||''; openSim();},
  startExam:(l,s)=>{location.hash='#exam'; setTimeout(()=>runExam2(l,s),30);}
};
// tiny iso picture of a 2x2 (U, F, R faces)
function c2iso(st,size){
  size=size||110; const c=Math.cos(Math.PI/6), sc=size/4.4; const P=(X,Y,Z)=>[((X-Z)*c)*sc+size/2,(-Y+(X+Z)*0.5)*sc+size/2];
  let s=`<svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">`;
  const body=[P(-1,1,1),P(-1,1,-1),P(1,1,-1),P(1,-1,-1),P(1,-1,1),P(-1,-1,1)];
  s+=`<polygon points="${body.map(q=>q.map(v=>v.toFixed(1)).join(',')).join(' ')}" fill="#111" stroke="#111" stroke-width="3" stroke-linejoin="round"/>`;
  st.forEach(t=>{ const n=t.n; if(!(n[1]===1||n[2]===1||n[0]===1)) return; const ax=n.findIndex(v=>v!==0), tan=[0,1,2].filter(i=>i!==ax), k=0.44;
    const ctr=t.p.map((v,i)=>i===ax?v:v*0.5); const pts=[[-k,-k],[k,-k],[k,k],[-k,k]].map(([a,b])=>{const q=ctr.slice(); q[tan[0]]+=a; q[tan[1]]+=b; return P(q[0],q[1],q[2]);});
    s+=`<polygon points="${pts.map(q=>q.map(v=>v.toFixed(1)).join(',')).join(' ')}" fill="${HEX[t.c]}" stroke="rgba(0,0,0,.3)" stroke-width=".6" stroke-linejoin="round"/>`; });
  return s+'</svg>';
}
LEARN.use(C2A);
const cc2=(k,c)=>({name:c.name,hint:c.hint||null,sol:c.alg,view:c.view});
const ex2=(nu,ne,setup,sol,view,hu,he)=>({name:[nu,ne],setup,sol,view:view||'D',hint:hu?[hu,he]:null});
function lessons2(){
  const cll=c2cases('CLL'), grp=g=>cll.filter(c=>c.grp===g).map(c=>cc2('CLL',c));
  const G=['sune','antisune','H','pi','headlights','T','bowtie','pll'];
  return [
 {id:'lbl',num:1,name:["Boshlang'ich (LBL)","Beginner (LBL)"],color:'var(--lv1)',goalTime:'20–40 s',intro:["2x2 — markazsiz kub: faqat 8 ta burchak. 3 qadam: <b>birinchi qatlam</b> → <b>OLL</b> → <b>PLL</b>. 3x3 bilsangiz, OLL va PLL sizga tanish. Rasmlarda chap — holat, o'ng — natija. \"Hosil qilish\" bilan holatni kubingizda yarating.","The 2x2 is a cube without centres — just 8 corners. 3 steps: <b>first layer</b> → <b>OLL</b> → <b>PLL</b>. If you know the 3x3, OLL and PLL will feel familiar. Left picture — case, right — result. Use \"Set up\" to create the case on your cube."],
  steps:[
   {id:'layer',short:['Birinchi qatlam','First layer'],title:['Birinchi qatlam — oq pastda','First layer — white on the bottom'],text:["Bitta oq burchakni pastga qo'ying, qolgan 3 tasini unga moslab qo'shing. Burchakni slot ustiga olib keling (U bilan) va <code>R U R' U'</code> (gold trigger) ni oq tomoni pastga tushguncha takrorlang. Rasmlar — kubning ostki tomoni (pastdan qaraganda, old tomon tepada).","Put one white corner down and add the other 3 to match it. Bring a corner above its slot (with U) and repeat <code>R U R' U'</code> (gold trigger) until white faces down. Pictures show the bottom face (seen from below, front at the top)."],
    goal:{setup:'',view:'D'},examples:[ex2("Oq tomoni o'ngga qaragan","White facing right","R U' R'","R U R'",'D',"Bitta gold trigger yetarli.","One trigger is enough."),
      ex2("Oq tomoni oldga qaragan","White facing front","F' U F","F' U' F",'D',"Ko'zgu nusxasi: F' U' F.","The mirror: F' U' F."),
      ex2("Oq tomoni tepaga qaragan","White facing up","R U R' U' R U R' U' R U R' U'","U R U' R' U R U' R' U R U' R'",'D',"Gold triggerni 3 marta takrorlang (yoki teskari tartibda).","Repeat the trigger 3 times (or its reverse)."),
      ex2("Burchak pastda, noto'g'ri buralgan","Corner in the slot, twisted","R U R' U' R U R'","R U' R' U R U' R'",'D',"Oq tomoni oldga qaragan. Gold trigger bilan chiqarib, to'g'ri burab kiriting.","White faces front. Take it out with the trigger and insert it the right way.")]},
   {id:'oll',short:['OLL','OLL'],title:['OLL — tepani sariq qilish','OLL — make the top yellow'],text:["Tepadagi sariq stikerlarga qarang va 7 holatdan birini toping. Formulalar birinchi qatlamni buzmaydi.","Look at the yellow stickers on top and find one of 7 cases. The algorithms don't break the first layer."],goal:{setup:'',view:'oll'},cases:c2cases('OLL').map(c=>cc2('OLL',c))},
   {id:'pll',short:['PLL','PLL'],title:["PLL — burchaklarni joyiga qo'yish","PLL — permute the corners"],text:["Yon tomonlarga qarang: bir tomonda <b>faralar</b> (ikki burchak bir rang) bo'lsa — T-perm (faralar chapda), hech qayerda bo'lmasa — Y-perm. Oxirida U bilan to'g'irlang.","Look at the sides: <b>headlights</b> on one side — T-perm (headlights on the left); none — Y-perm. Finish with a U turn."],goal:{setup:'',view:'pll'},cases:c2cases('PLL').map(c=>cc2('PLL',c))}]},
 {id:'ortega',num:2,name:['Ortega','Ortega'],color:'var(--lv2)',goalTime:'8–12 s',intro:["Birinchi qatlam o'rniga faqat <b>birinchi tomon</b> (4 ta oq stiker) → <b>OLL</b> → <b>PBL</b> (ikki qatlam birga).","Instead of a full layer, only the <b>first face</b> (4 white stickers) → <b>OLL</b> → <b>PBL</b> (both layers at once)."],
  steps:[
   {id:'face',short:['Birinchi tomon','First face'],title:['Birinchi tomon — 4 ta oq stiker pastda','First face — 4 white stickers on the bottom'],text:["Yon ranglar mos bo'lishi shart emas — shuning uchun bu qadam juda qisqa (odatda 3–5 harakat).","The side colours don't need to match — so this step is very short (usually 3–5 moves)."],
    goal:{setup:'',view:'D'},examples:[ex2("Bitta burchak yetishmaydi","One corner missing","R'","R",'D'),ex2("Ikki burchak yetishmaydi","Two corners missing","F R'","R F'",'D'),ex2("Haqiqiy holat","Real case","R U F' R2 U'","U R2 F U' R'",'D',"Ko'zdan kechirishda rejalashtiring.","Plan it during inspection.")]},
   {id:'oll2',short:['OLL','OLL'],title:['OLL — o\'sha 7 holat','OLL — the same 7 cases'],text:["Pastdagi oq tomonni buzmasdan tepani sariq qiling.","Make the top yellow without breaking the white bottom."],goal:{setup:'',view:'oll'},cases:c2cases('OLL').map(c=>cc2('OLL',c))},
   {id:'pbl',short:['PBL','PBL'],title:['PBL — ikki qatlamni birga joyiga qo\'yish','PBL — permute both layers'],text:["Har bir qatlamga qarang: yig'ilgan, <b>qo'shni</b> almashuv (bir tomonda faralar) yoki <b>diagonal</b>. Rasmda chapda — tepa, o'ngda — past tomon.","Check each layer: solved, <b>adjacent</b> swap (headlights on one side) or <b>diagonal</b>. Left — top, right — bottom."],goal:{setup:'',view:'pbl'},cases:c2cases('PBL').map(c=>cc2('PBL',c))}]},
 {id:'cll',num:3,name:['CLL','CLL'],color:'var(--lv3)',goalTime:'4–6 s',intro:["Birinchi qatlam (1-darajadagidek) → oxirgi qatlam <b>bitta formula</b> bilan. 42 holat OLL shakli bo'yicha 8 guruhga bo'lingan — guruhma-guruh o'rganing.","First layer (as in level 1) → the last layer with <b>one algorithm</b>. 42 cases in 8 groups by OLL shape — learn group by group."],
  steps:G.map(g=>({id:'cll_'+g,short:[C2OLLNM[g][0],C2OLLNM[g][1]],title:['CLL · '+C2OLLNM[g][0],'CLL · '+C2OLLNM[g][1]],text:g==='pll'?["Tepa allaqachon sariq — faqat burchaklarni joyiga qo'yish.","The top is already yellow — only permute the corners."]:["Avval OLL shaklini tanib oling, keyin yon tomonlardagi ranglarga qarab holatni toping.","Recognise the OLL shape first, then pick the case by the side colours."],goal:null,cases:grp(g)}))},
 {id:'pro',num:4,name:['Pro (EG)','Pro (EG)'],color:'var(--lv4)',goalTime:'< 3 s',intro:["Eng kuchli kubchilar butun birinchi qatlamni ko'zdan kechirishda ko'rib, oxirgi qatlam holatini ham oldindan biladi.","Top solvers see the whole first layer during inspection and already know the last-layer case."],
  steps:[{id:'eg',short:['EG','EG'],title:['EG-1 / EG-2','EG-1 / EG-2'],text:["Birinchi tomonni yig'asiz (qatlam emas), keyin pastki qatlam holatiga qarab maxsus formula bilan hammasini birdan yechasiz. CLL — EG'ning birinchi qismi. Yechuvchining \"Eng qisqa\" rejimida optimal yechimlarni o'rganing.","Build only the first face, then solve everything at once with an algorithm chosen by the bottom layer's state. CLL is the first part of EG. Study optimal solutions in the solver's \"Shortest\" mode."],goal:null,exam:false}]}
];}
// ---------- exam ----------
const r2=n=>Math.floor(Math.random()*n);
function randMoves2(n){ const M=C2.MV; let a=[],last=''; while(a.length<n){const m=M[r2(9)]; if(m[0]===last) continue; last=m[0]; a.push(m);} return a.join(' '); }
function setFor2(step){ if(step==='oll'||step==='oll2') return 'OLL'; if(step==='pll') return 'PLL'; if(step==='pbl') return 'PBL'; if(step.startsWith('cll_')) return 'CLL'; return null; }
function q2(step,kind){
  if(step==='layer'||step==='face'){ const goal=step; let setup,sol; do{ setup=randMoves2(5+r2(3)); sol=bfs2(apply(c2solved(),setup),s=>g2(goal,s),9,KEY2[goal]); }while(!sol||sol.length<3);
    return {kind:kind==='real'?'real':'sim',setup,sol:sol.join(' '),goal,view:'D',name:step==='layer'?['Birinchi qatlam','First layer']:['Birinchi tomon','First face'],prompt:kind==='real'?["Haqiqiy kubda yeching","Solve it on your real cube"]:[`Simulyatorda: ${G2TEXT[goal][0].replace('Maqsad: ','')}`,`In the simulator: ${G2TEXT[goal][1].replace('Goal: ','')}`]}; }
  const k=setFor2(step); let cs=c2cases(k); if(k==='CLL') cs=cs.filter(c=>c.grp===step.slice(4)); const pool=k==='CLL'?c2cases('CLL'):cs; const c=cs[r2(cs.length)];
  const goal=k==='OLL'?'oll':'solved', a=r2(4);
  const base={setup:invert(c.alg),sol:c.alg,view:c.view,name:c.name,hint:c.hint?c.hint:c.name,goal};
  if(kind==='name') return {...base,kind,prompt:['Bu qaysi holat?','Which case is this?'],answer:c.name,options:LEARN.optionsFrom(c.name,pool.map(x=>x.name))};
  if(kind==='alg') return {...base,kind,prompt:['Qaysi formula bu holatni yechadi?','Which algorithm solves this case?'],answer:c.alg,options:LEARN.optionsFrom(c.alg,pool.map(x=>x.alg))};
  const setup=invert(c.alg)+(a?' '+AUF2[a]:''), sol=simp2((a?AUF2I[a]+' ':'')+c.alg);
  return {...base,kind:kind==='real'?'real':'sim',setup,sol,prompt:kind==='real'?['Haqiqiy kubda yeching','Solve it on your real cube']:[`Simulyatorda yeching — ${G2TEXT[goal][0].replace('Maqsad: ','')}`,`Solve in the simulator — ${G2TEXT[goal][1].replace('Goal: ','')}`]};
}
function buildExam2(level,step){
  if(step){ const ks=(step==='layer'||step==='face')?['sim','sim','real','sim','sim']:['name','alg','sim','name','alg']; return ks.map(k=>q2(step,k)); }
  const P={lbl:[['layer','sim'],['layer','real'],['oll','name'],['oll','name'],['oll','alg'],['oll','sim'],['pll','name'],['pll','alg'],['pll','sim'],['layer','sim']],
    ortega:[['face','sim'],['face','sim'],['oll2','name'],['oll2','alg'],['oll2','sim'],['pbl','name'],['pbl','name'],['pbl','alg'],['pbl','sim'],['pbl','real']],
    cll:['sune','antisune','H','pi','headlights','T','bowtie','pll','sune','antisune'].map((g,i)=>['cll_'+g,i%3===2?'sim':'name'])}[level];
  return P.map(([s,k])=>q2(s,k));
}
function examLevels2(){ return lessons2().filter(l=>l.steps.some(s=>s.exam!==false)).map(l=>({id:l.id,num:l.num,name:l.name,color:l.color,steps:l.steps.filter(s=>s.exam!==false)})); }
function renderExamHome2(){ LEARN.examHome($('v-exam'),examLevels2()); }
function runExam2(level,step){ const lv=lessons2().find(l=>l.id===level), st=step?lv.steps.find(s=>s.id===step):null;
  LEARN.startExam($('v-exam'),{key:level+'|'+(step||'all'),title:st?st.title:lv.name,questions:buildExam2(level,step),onExit:renderExamHome2,onRetake:()=>runExam2(level,step)}); }
// ---------- lessons view (levels picker + step cards) ----------
function levelPicker(levels,cur,attr){
  return `<div class="lvpick">${levels.map(l=>{const b=LEARN.best(l.id+'|all'); return `<button class="${l.id===cur?'on':''}" ${attr}="${l.id}"><span class="dot" style="background:${l.color}">${l.num}</span><span class="tx"><b>${LEARN.T(l.name)}</b><small>${L('Maqsad','Goal')}: ${l.goalTime}${b!=null&&b>=80?' · ✓':''}</small></span></button>`;}).join('')}</div>`;
}
function renderLessons2(){
  const lv=lessons2().find(l=>l.id===(CDB.lv2||'lbl'))||lessons2()[0];
  $('v-lessons').innerHTML=`<h1>${L("2x2 darslari","2x2 lessons")}</h1>${levelPicker(lessons2(),lv.id,'data-lv2')}<h2 style="margin-top:6px">${lv.num}. ${LEARN.T(lv.name)}</h2>${LEARN.lessonHTML(lv)}`;
  document.querySelectorAll('[data-lv2]').forEach(b=>b.onclick=()=>{CDB.lv2=b.dataset.lv2; csave(); renderLessons2();});
}
