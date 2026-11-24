// ===== Pyraminx lessons (step cards) + exam =====
function gp(type,st){
  const r=PSOLVER.readState(st); if(r.error) return false;
  const K=PSOLVER.EDGE_KEYS, eok=k=>{const j=K.indexOf(k); return r.ep[j]===j&&r.eo[j]===0;}, ax=v=>r.ao[PSOLVER.VN.indexOf(v)]===0;
  const tips=[0,1,2,3].every(v=>((r.to[v]-r.ao[v])%3+3)%3===0);
  if(type==='tips') return tips;
  if(type==='centers3') return ['L','R','B'].every(ax);
  if(type==='layer1') return ['L','R','B'].every(ax)&&['BL','BR','LR'].every(eok);
  if(type==='centers') return ['U','L','R','B'].every(ax);
  if(type==='v') return ['U','L','R','B'].every(ax)&&['BL','BR'].every(eok);
  return PYRA.isSolved(st);
}
const GPTEXT={tips:["Maqsad: har bir uch o'z markaziga mos.","Goal: every tip matches its centre."],centers3:["Maqsad: pastki uchta markazning sariq tomoni pastda.","Goal: the three bottom centres show yellow on the bottom."],layer1:["Maqsad: sariq birinchi qatlam (markazlar va 3 ta qirra).","Goal: the yellow first layer (centres and 3 edges)."],centers:["Maqsad: barcha 4 markaz to'g'ri.","Goal: all 4 centres aligned."],v:["Maqsad: markazlar va V (pastda 2 ta qirra).","Goal: centres plus the V (2 bottom edges)."],solved:["Maqsad: piramida to'liq yig'ilgan.","Goal: the puzzle fully solved."]};
const PA={orient:['Ushlash: <i style="background:#009E60"></i> yashil tomon oldingizda, <i style="background:#FFD500"></i> sariq pastda (<i style="background:#C41E3A"></i> qizil chapda, <i style="background:#0051BA"></i> ko\'k o\'ngda)','Hold: <i style="background:#009E60"></i> green face toward you, <i style="background:#FFD500"></i> yellow on the bottom (<i style="background:#C41E3A"></i> red left, <i style="background:#0051BA"></i> blue right)'],
  id:'py', simIcon:'🔺',
  solved:()=>PYRA.solved(), apply:(st,alg)=>alg&&alg.trim()?PYRA.apply(st.slice(),alg):st.slice(),
  invert:a=>a&&a.trim()?PYRA.invert(a):'', tokens:a=>a&&a.trim()?PYRA.tokens(a):[],
  pic:(st,view,size)=>`<span class="pp3">${pyraISO(st,Math.round((size||110)*1.1))}<button type="button" class="pnetbtn" data-pnet="${st.join('')}" title="${L("To'liq xarita",'Full map')}" aria-label="map"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M12 3 2.5 20h19z"/><path d="M7.2 11.5h9.6M12 3l-4.8 8.5L12 20l4.8-8.5z"/></svg></button></span>`,
  make3D:(host,st,o)=>new Pyra3D(host,{state:st.slice(),height:o.height,dur:o.dur,onChange:o.onChange}),
  moves:['U',"U'",'L',"L'",'R',"R'",'B',"B'",'u',"u'",'l',"l'",'r',"r'",'b',"b'"],
  valid:t=>!!PYRA.PERM[t], goal:gp, goalText:t=>GPTEXT[t]||GPTEXT.solved,
  simLoad:(setup,sol)=>{SIMP.cube.hist.length=0; SIMP.cube.setState(PYRA.apply(PYRA.solved(),setup||'')); $('salg').value=sol||''; openSim();},
  startExam:(l,s)=>{location.hash='#exam'; setTimeout(()=>runExamP(l,s),30);}
};
LEARN.use(PA);
function stepsFor(setup,keys){ const r=PSOLVER.readState(PYRA.apply(PYRA.solved(),setup)); const st=PSOLVER.methodSolve(r,keys[0]); return st.filter(s=>keys.slice(1).includes(s.key)).flatMap(s=>s.moves).join(' '); }
const exP=(nu,ne,setup,sol,hu,he)=>({name:[nu,ne],setup,sol,view:'net',hint:hu?[hu,he]:null});
function caseP(c){ return {name:c.name,sol:c.alg,view:'net'}; }
function lessonsP(){
  const LL=libCases('LL').map(caseP), L4=libCases('L4E');
  return [
 {id:'lbl',num:1,name:["Boshlang'ich (LBL)","Beginner (LBL)"],color:'var(--lv1)',goalTime:'30–60 s',intro:["4 qadam: <b>uchlar</b> → <b>markazlar</b> → <b>birinchi qatlam</b> → <b>oxirgi qatlam</b>. Rasm — piramidaning yoyilmasi: o'rtada old (yashil) tomon, yonlarida chap va o'ng, pastda ostki tomon. Chap rasm — holat, o'ng — natija.","4 steps: <b>tips</b> → <b>centres</b> → <b>first layer</b> → <b>last layer</b>. The picture is the unfolded puzzle: front (green) in the middle, left and right beside it, bottom below. Left — case, right — result."],
  steps:[
   {id:'notation',short:['Notatsiya','Notation'],title:['Notatsiya','Notation'],text:["<b>U L R B</b> — shu uchdagi katta qatlamni 120° soat yo'nalishida burish (uchga tashqaridan qaraganda). <b>'</b> — teskari. Kichik harf (<b>u l r b</b>) — faqat uchning o'zi.","<b>U L R B</b> turn the big layer at that tip 120° clockwise (looking at the tip from outside). <b>'</b> means counter-clockwise. Lowercase (<b>u l r b</b>) turns only the tip."],goal:null,exam:false,exTitle:['Harakatlar','Moves'],
    examples:['U',"U'",'L','R','B','u'].map(m=>({name:[m,m],setup:'',sol:m,view:'net'}))},
   {id:'tips',short:['Uchlar','Tips'],title:['Uchlar','Tips'],text:["Har bir uchni ostidagi markaz ranglariga moslab buring. Har biri bitta harakat.","Turn each tip to match the centre right below it. One move each."],goal:{setup:'',view:'net'},
    examples:[exP("Bitta uch buralgan","One tip turned","u","u'"),exP("Ikki uch buralgan","Two tips turned","l' r","r' l"),exP("Hamma uchlar buralgan","All tips turned","u l r' b","b' r l' u'")]},
   {id:'centers3',short:['Markazlar','Centres'],title:['Markazlar','Centres'],text:["Pastki rangni tanlang (sariq). L, R va B bilan uchta markazni shunday buringki, sariq stikerlari pastga qarasin.","Pick the bottom colour (yellow). Turn L, R and B so the three centres show yellow on the bottom."],goal:{setup:'',view:'net'},
    examples:[exP("Bitta markaz buralgan","One centre turned","L","L'"),exP("Ikki markaz buralgan","Two centres turned","R' B","B' R"),exP("Uchala markaz","All three","L R B'","B R' L'")]},
   {id:'layer1',short:['Birinchi qatlam','First layer'],title:['Birinchi qatlam','First layer'],text:["Sariq 3 ta qirrani pastga, yon ranglari markazlarga mos holda qo'ying. Qirrani tepaga chiqaring, U bilan joyi ustiga olib keling va <code>R' U' R</code> yoki <code>L U L'</code> bilan tushiring.","Place the 3 yellow edges on the bottom matching the side centres. Bring an edge up, move it over its slot with U, and drop it with <code>R' U' R</code> or <code>L U L'</code>."],goal:{setup:'',view:'net'},
    examples:[exP("Bitta qirra tepada","One edge on top","R' U R","R' U' R"),exP("Ikki qirra joyida emas","Two edges out","L U' R U","R' U L'"),exP("Haqiqiy holat","Real case","R U' L B' U R'","R U' B L' U R'")]},
   {id:'ll',short:['Oxirgi qatlam','Last layer'],title:['Oxirgi qatlam — 11 holat','Last layer — 11 cases'],text:["Tepa markazni U bilan to'g'irlang, keyin qirralarga qarang: aylanish (↻/↺), teskari juft yoki ikkalasi. Holatni topib formulani bajaring.","Align the top centre with U, then look at the edges: a cycle (↻/↺), a flipped pair, or both. Find the case and run its algorithm."],goal:null,cases:LL}]},
 {id:'keyhole',num:2,name:['Keyhole','Keyhole'],color:'var(--lv2)',goalTime:'15–20 s',intro:["Kamroq harakat bilan birinchi qatlam. Oxirgi qatlam — o'sha 11 formula.","A first layer with fewer moves. The last layer uses the same 11 algorithms."],
  steps:[
   {id:'kh1',short:['2 markaz + 2 qirra','2 centres + 2 edges'],title:['Ikki markaz va ikki qirra','Two centres and two edges'],text:["Pastki rangdagi faqat <b>ikkita</b> markazni to'g'irlang va ularning yonidagi 2 ta qirrani qo'ying. Uchinchi markazga hali tegmang.","Align only <b>two</b> bottom centres and place the 2 edges next to them. Leave the third centre for now."],goal:null,exam:false},
   {id:'kh2',short:['Keyhole','Keyhole'],title:['Keyhole — teshik orqali kiritish','Keyhole insertion'],text:["To'g'irlanmagan markaz qatlamida bo'sh \"teshik\" bor. Uchinchi qirrani shu teshik orqali 1–2 harakat bilan kiriting, keyin markazni joyiga burang. Yechuvchida \"Boshlang'ich\" rejimini yoqib, birinchi qatlam qanday qisqa yig'ilishini kuzating.","The unsolved centre leaves an empty \"keyhole\". Drop the third edge in through it with 1–2 moves, then turn that centre home. Use the solver's \"Beginner\" mode to watch short first-layer solutions."],goal:null,exam:false},
   {id:'ll2',short:['Oxirgi qatlam','Last layer'],title:['Oxirgi qatlam','Last layer'],text:["1-darajadagi 11 ta formula. Endi ularni formulaga qaramasdan bajarishga harakat qiling.","The same 11 algorithms from level 1. Now try them without looking."],goal:null,cases:LL}]},
 {id:'l4e',num:3,name:['L4E','L4E'],color:'var(--lv3)',goalTime:'8–10 s',intro:["<b>Uchlar va markazlar</b> → <b>V</b> (pastda 2 ta qirra) → <b>oxirgi 4 qirra</b> bitta formula bilan. L4E holatlarini qisqasidan boshlab o'rganing.","<b>Tips and centres</b> → the <b>V</b> (2 bottom edges) → the <b>last 4 edges</b> with one algorithm. Learn the L4E cases starting with the short ones."],
  steps:[
   {id:'centers',short:['Markazlar','Centres'],title:['Barcha 4 markaz','All 4 centres'],text:["Har bir markazni o'z uchi atrofida bitta harakat bilan to'g'irlang.","Align every centre with one move around its tip."],goal:{setup:'',view:'net'},
    examples:[exP("Ikki markaz","Two centres","U' L","L' U"),exP("To'rtta markaz","Four centres","U L R' B","B' R L' U'")]},
   {id:'v',short:['V','V'],title:["V shakli","The V"],text:["Orqa uch atrofida pastki 2 ta qirrani qo'ying — \"V\" harfi hosil bo'ladi. Markazlarni buzmang. Buni ko'zdan kechirishda rejalashtiring.","Place the 2 bottom edges around the back tip — they form a \"V\". Keep the centres. Plan it during inspection."],goal:null,
    examples:[exP("Oson holat","Easy case","B U' B' U","U B U' B'"),exP("O'rtacha holat","Medium case","L R U L'","L U' R' L'"),exP("Haqiqiy holat","Real case","B' L R' U L","L' U' L' R B")]},
   {id:'l4s',short:['L4E qisqa','L4E short'],title:['L4E — 4–6 harakatli holatlar','L4E — 4–6 move cases'],text:["Eng ko'p uchraydigan va eng oson holatlar. Avval shularni yodlang.","The most common and easiest cases. Learn these first."],goal:null,cases:L4.filter(c=>c.len<=6).map(caseP)},
   {id:'l4m',short:['L4E o\'rta','L4E medium'],title:['L4E — 7–8 harakatli holatlar','L4E — 7–8 move cases'],text:["Qisqalarini o'rgangach, shularga o'ting.","Move on to these once the short ones are solid."],goal:null,cases:L4.filter(c=>c.len>=7&&c.len<=8).map(caseP)},
   {id:'l4l',short:['L4E uzun','L4E long'],title:['L4E — 9–10 harakatli holatlar','L4E — 9–10 move cases'],text:["Kam uchraydi. Ko'pincha V'ni boshqacha qurib, ularni chetlab o'tish mumkin.","Rare. Often you can avoid them by building the V differently."],goal:null,cases:L4.filter(c=>c.len>=9).map(caseP)}]},
 {id:'pro',num:4,name:['Pro','Pro'],color:'var(--lv4)',goalTime:'< 5 s',intro:["Yechimning katta qismi 15 soniyalik ko'zdan kechirishda rejalashtiriladi.","Most of the solve is planned in the 15-second inspection."],
  steps:[
   {id:'top',short:['Top-first','Top-first'],title:['Top-first','Top-first'],text:["Avval bitta uch atrofidagi \"tepa\"ni yig'asiz: markaz va unga tutashgan 3 ta qirra. So'ng pastki qatlam bitta formula bilan yechiladi.","First build a \"top\" around one tip: its centre and the 3 edges touching it. Then the bottom layer is solved with one algorithm."],goal:null,exam:false},
   {id:'flip',short:['1-flip','1-flip'],title:['1-flip','1-flip'],text:["Birinchi qatlamni ataylab bitta qirrasi teskari holda yig'asiz — ko'pincha 2–3 harakat tejaydi. So'ng maxsus formulalar bilan tugatasiz.","Build the first layer with one edge deliberately flipped — it often saves 2–3 moves. Then finish with dedicated algorithms."],goal:null,exam:false},
   {id:'insp',short:["Ko'zdan kechirish",'Inspection'],title:["Ko'zdan kechirish strategiyasi","Inspection strategy"],text:["15 soniyada: qaysi metod qisqaroq — V, tepa yoki 1-flip? Butun birinchi qadamni ko'z bilan bajarib qo'ying. Uchlarni ko'pincha oxirida yechishadi. Yechuvchining \"Eng qisqa\" rejimi bilan o'z yechimingizni solishtiring.","In 15 seconds: which method is shorter — V, top or 1-flip? Trace the whole first step with your eyes. Pros often leave the tips for the end. Compare your solutions with the solver's \"Shortest\" mode."],goal:null,exam:false}]}
];}
// ---------- exam ----------
const rp=n=>Math.floor(Math.random()*n);
function randScr(n){ const M=['U',"U'",'L',"L'",'R',"R'",'B',"B'"]; let a=[],last=''; while(a.length<n){const m=M[rp(8)]; if(m[0]===last) continue; last=m[0]; a.push(m);} return a.join(' '); }
function qP(step,kind){
  if(['tips','centers3','layer1','centers','v'].includes(step)){
    let setup,sol; const tipsAdd=['u','l',"r'",'b'].filter(()=>Math.random()<.5).join(' ');
    if(step==='tips'){ setup=(tipsAdd||'u')+''; sol=PA.invert(setup); }
    else if(step==='centers3'){ setup=['L','R','B'].map(v=>Math.random()<.5?v:v+"'").join(' '); sol=PA.invert(setup); }
    else if(step==='centers'){ setup=['U','L','R','B'].map(v=>Math.random()<.5?v:v+"'").join(' '); sol=PA.invert(setup); }
    else if(step==='layer1'){ setup=randScr(5+rp(3)); sol=stepsFor(setup,['lbl','layer1']); }
    else { setup=randScr(5+rp(3)); sol=stepsFor(setup,['l4e','centers','v']); }
    const nm={tips:['Uchlar','Tips'],centers3:['Markazlar','Centres'],layer1:['Birinchi qatlam','First layer'],centers:['Markazlar','Centres'],v:['V shakli','The V']}[step];
    return {kind:kind==='real'?'real':'sim',setup,sol,goal:step,view:'net',name:nm,prompt:kind==='real'?['Haqiqiy piramidada yeching','Solve it on your real puzzle']:[`Simulyatorda: ${GPTEXT[step][0].replace('Maqsad: ','')}`,`In the simulator: ${GPTEXT[step][1].replace('Goal: ','')}`]};
  }
  let cs; if(step==='ll'||step==='ll2') cs=libCases('LL'); else { const L4=libCases('L4E'); cs=step==='l4s'?L4.filter(c=>c.len<=6):step==='l4m'?L4.filter(c=>c.len>=7&&c.len<=8):L4.filter(c=>c.len>=9); }
  const c=cs[rp(cs.length)], pool=cs, base={setup:PYRA.invert(c.alg),sol:c.alg,view:'net',name:c.name,hint:null,goal:'solved'};
  if(kind==='name'&&(step==='ll'||step==='ll2')) return {...base,kind,prompt:['Bu qaysi holat?','Which case is this?'],answer:c.name,options:LEARN.optionsFrom(c.name,pool.map(x=>x.name))};
  if(kind==='name'||kind==='alg') return {...base,kind:'alg',prompt:['Qaysi formula bu holatni yechadi?','Which algorithm solves this case?'],answer:c.alg,options:LEARN.optionsFrom(c.alg,pool.map(x=>x.alg))};
  return {...base,kind:kind==='real'?'real':'sim',prompt:kind==='real'?['Haqiqiy piramidada yeching','Solve it on your real puzzle']:['Simulyatorda yeching — piramidani to\'liq yig\'ing','Solve in the simulator — fully solve the puzzle']};
}
function buildExamP(level,step){
  if(step){ const intuitive=['tips','centers3','layer1','centers','v'].includes(step); return (intuitive?['sim','sim','real','sim','sim']:['name','alg','sim','name','alg']).map(k=>qP(step,k)); }
  const P={lbl:[['tips','sim'],['centers3','sim'],['layer1','sim'],['layer1','real'],['ll','name'],['ll','name'],['ll','alg'],['ll','alg'],['ll','sim'],['ll','sim']],
    keyhole:[['ll2','name'],['ll2','name'],['ll2','alg'],['ll2','alg'],['ll2','sim'],['ll2','sim'],['ll2','real'],['ll2','name'],['ll2','alg'],['ll2','sim']],
    l4e:[['centers','sim'],['v','sim'],['v','sim'],['l4s','alg'],['l4s','alg'],['l4s','sim'],['l4s','sim'],['l4m','alg'],['l4m','sim'],['l4s','real']]}[level];
  return P.map(([s,k])=>qP(s,k));
}
function examLevelsP(){ return lessonsP().filter(l=>l.steps.some(s=>s.exam!==false)).map(l=>({id:l.id,num:l.num,name:l.name,color:l.color,steps:l.steps.filter(s=>s.exam!==false)})); }
function renderExamHomeP(){ LEARN.examHome($('v-exam'),examLevelsP()); }
function runExamP(level,step){ const lv=lessonsP().find(l=>l.id===level), st=step?lv.steps.find(s=>s.id===step):null;
  LEARN.startExam($('v-exam'),{key:level+'|'+(step||'all'),title:st?st.title:lv.name,questions:buildExamP(level,step),onExit:renderExamHomeP,onRetake:()=>runExamP(level,step)}); }
function levelPickerP(levels,cur){ return `<div class="lvpick">${levels.map(l=>{const b=LEARN.best(l.id+'|all'); return `<button class="${l.id===cur?'on':''}" data-lvp="${l.id}"><span class="dot" style="background:${l.color}">${l.num}</span><span class="tx"><b>${LEARN.T(l.name)}</b><small>${L('Maqsad','Goal')}: ${l.goalTime}${b!=null&&b>=80?' · ✓':''}</small></span></button>`;}).join('')}</div>`; }
function renderLessonsP(){
  const all=lessonsP(), lv=all.find(l=>l.id===(PDB.lvp||'lbl'))||all[0];
  $('v-lessons').innerHTML=`<h1>${L('Pyraminx darslari','Pyraminx lessons')}</h1>${levelPickerP(all,lv.id)}<h2 style="margin-top:6px">${lv.num}. ${LEARN.T(lv.name)}</h2>${LEARN.lessonHTML(lv)}`;
  document.querySelectorAll('[data-lvp]').forEach(b=>b.onclick=()=>{PDB.lvp=b.dataset.lvp; psave(); renderLessonsP();});
}

// full net modal
function openNet(code){ let m=document.getElementById('pnetm'); if(!m){ m=document.createElement('div'); m.id='pnetm'; m.className='lmodal'; m.innerHTML='<div class="box"></div>'; document.body.appendChild(m); m.addEventListener('click',e=>{ if(e.target===m||e.target.closest('[data-pnclose]')) m.classList.remove('on'); }); }
  const st=code.split('');
  m.firstChild.innerHTML=`<div style="display:flex;justify-content:space-between;align-items:center"><h3 style="margin:0">${L("To'liq xarita",'Full map')}</h3><button class="ghost lpb" data-pnclose>✕</button></div>
   <div style="display:flex;justify-content:center;margin:14px 0">${pnetSVG(st,300)}</div>
   <p class="muted" style="font-size:14px;margin:0">${L("Piramidani qog'ozdek yoyib qo'yganmiz: <b>o'rtadagi</b> uchburchak — old tomon (siz qarab turgan), <b>chapdagi</b> — chap tomon, <b>o'ngdagi</b> — o'ng tomon, <b>pastdagi</b> — ostki tomon. Barcha 4 tomon bir vaqtda ko'rinadi.","The puzzle unfolded like paper: the <b>middle</b> triangle is the front (facing you), <b>left</b> is the left face, <b>right</b> is the right face, <b>bottom</b> is the bottom face. All 4 faces at once.")}</p>`;
  m.classList.add('on'); }
document.addEventListener('click',e=>{ const b=e.target.closest('[data-pnet]'); if(b){ e.preventDefault(); e.stopPropagation(); openNet(b.dataset.pnet); } },true);
