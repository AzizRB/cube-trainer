// ===== 3x3 lessons (step cards) + exam, built on core/learn.js =====
const CROSS_POOL=[["B L B' F2 D' L U", "U' B D F2 L'"], ["F U' F' L' R D2 U' B", "B' D2 R' L"], ["L2 B' U' R' L", "U L2 U R B'"], ["L' R2 U2 D F'", "U F B2 D' L"], ["L R' U' L2 B' R D2 L2", "F' D2 R' L'"], ["B' U B' F' U2 D F", "R2 F' D' F B'"], ["F B' D2 U2 B U' R'", "R B D2 F' B'"], ["R' B U L2 B' F2 U'", "U F L2 U F R'"], ["L2 U' D2 U L' F2 L2", "F2 R' L D2"], ["R' L F B R F' L B2", "R2 B R L' B'"], ["B' L' D L R2 F'", "F2 R2 L D' L'"], ["F' D L2 R2 D R' L", "R L' U B' D2 B'"], ["D2 R D' B' R F R'", "B D R' B' D2"], ["B2 U R2 D R' F2", "R' U F2 R' L2"], ["L U B2 L2 R' L' R' B", "R2 B2 L' B'"], ["R2 L2 U B2 L2 U2", "U2 F2 D F2 B2"], ["B2 R' L' B' D2", "R D2 L B R"], ["F U' R' B L F", "L' F' B' R"], ["D2 R' L2 U2 B' L2", "F' R2 B' L'"], ["U L2 D L R L' B", "B' R' D' L2"], ["F L' R F' D U L2 F'", "R' B L' F' B2 R D"], ["L2 F' R2 L2 U D2 R2 B", "R2 U L2 B' D2"], ["L D2 R' D' L2 U F2 R2", "R2 F2 D' L B2"], ["R2 D' U' B L' B2", "B L D2 B D'"]];
const AUF3=['',"U","U2","U'"], AUF3I=['',"U'","U2","U"];
function centerOf(st,n){return stk(st,n,n).c;}
function g3(type,st){
  const ok=t=>t.c===centerOf(st,t.n);
  if(type==='cross') return st.every(t=>!(t.p[1]===-1&&t.p.filter(v=>v===0).length===1)||ok(t)) && st.filter(t=>t.p[1]===-1&&t.p.filter(v=>v===0).length===1).length>0 && st.filter(t=>t.p[1]===-1&&t.p.filter(v=>v===0).length===1).every(ok);
  const f2l=st.every(t=>t.p[1]===1||ok(t));
  if(type==='f2l') return f2l;
  const uc=centerOf(st,[0,1,0]);
  if(type==='oll1') return f2l&&[[1,1,0],[-1,1,0],[0,1,1],[0,1,-1]].every(p=>stk(st,p,[0,1,0]).c===uc);
  if(type==='oll2') return f2l&&st.filter(t=>t.n[1]===1).every(t=>t.c===uc);
  const solved=s=>s.every(t=>t.c===centerOf(s,t.n));
  if(type==='pll') return AUF3.some(a=>solved(a?apply(cloneSt(st),a):st));
  return solved(st);
}
const G3TEXT={cross:["Maqsad: oq Krest (X) pastda, qirralar yon markazlarga mos.","Goal: white cross on the bottom, edges matching the side centres."],f2l:["Maqsad: birinchi ikki qatlam to'liq yig'ilgan.","Goal: the first two layers fully solved."],oll1:["Maqsad: tepada sariq krest.","Goal: a yellow cross on top."],oll2:["Maqsad: tepa butunlay sariq.","Goal: the whole top yellow."],pll:["Maqsad: kub to'liq yig'ilgan (U bilan to'g'irlash mumkin).","Goal: the cube fully solved (a final U turn is fine)."],solved:["Maqsad: kub to'liq yig'ilgan.","Goal: the cube fully solved."]};
const C3A={orient:['Ushlash: <i style="background:#FFD500"></i> sariq tepada, <i style="background:#009E60"></i> yashil oldingizda (<i style="background:#FF5800"></i> to\'q sariq o\'ngda, <i style="background:#FFFFFF"></i> oq pastda)','Hold: <i style="background:#FFD500"></i> yellow on top, <i style="background:#009E60"></i> green facing you (<i style="background:#FF5800"></i> orange on the right, <i style="background:#FFFFFF"></i> white on the bottom)'],
  id:'c3', simIcon:'🧊',
  solved:()=>solvedCube(),
  apply:(st,alg)=>alg&&alg.trim()?apply(cloneSt(st),alg):cloneSt(st),
  invert:a=>a&&a.trim()?invert(a):'', tokens:a=>a&&a.trim()?tokens(a):[],
  pic:(st,view,size)=>{ if(view==='f2l'||view==='cross'||view==='full') return isoSVG(st,view==='full'?'pll':view,size*1.1); return topSVG(st,view,size); },
  make3D:(host,st,o)=>new Cube3D(host,{view:o.view,state:cloneSt(st),height:o.height,size:Math.round(o.height/5.6),dur:o.dur,onChange:o.onChange}),
  moves:['R',"R'",'R2','U',"U'",'U2','F',"F'",'F2','L',"L'",'L2','D',"D'",'D2','B',"B'",'B2','M',"M'"],
  valid:t=>{try{parseTok(t);return true;}catch(e){return false;}},
  goal:g3, goalText:t=>G3TEXT[t]||G3TEXT.solved,
  simLoad:(setup,sol)=>{SIM.cube.hist.length=0; SIM.cube.setState(apply(solvedCube(),setup||'')); $('simAlg').value=sol||''; simOpen(); simMsg(L("Holat tayyor. O'zingiz yeching yoki ▶ Bajarish'ni bosing.","Case ready. Solve it yourself or press ▶ Run."));},
  startExam:(l,s)=>{location.hash='#imtihon'; setTimeout(()=>runExam3(l,s),30);}
};
LEARN.use(C3A);
const caseObj=(k,c)=>({name:[c.nu,c.ne],hint:[c.hu,c.he],sol:c.alg,view:SETS[k].view==='oll-edge'?'oll-edge':SETS[k].view});
const pick=(k,ids)=>SETS[k].cases.filter(c=>ids.includes(c.id)).map(c=>caseObj(k,c));
const ex=(nu,ne,setup,sol,view,hu,he)=>({name:[nu,ne],setup,sol,view:view||'cross',hint:hu?[hu,he]:null});
function lessons3(){ return [
 {id:'start',num:0,name:['Boshlash','Getting started'],color:'var(--muted)',intro:["Avval harakatlar tilini (notatsiya) va kubni qanday ushlashni o'rganing. Keyingi barcha darslar shunga tayanadi.","First learn the language of moves (notation) and how to hold the cube. Every later lesson builds on this."],
  steps:[
   {id:'notation',short:['Notatsiya','Notation'],title:['Notatsiya — harakatlar tili','Notation — the language of moves'],text:["Har bir harf — bitta tomonni 90° burish. Harf yonida <b>'</b> bo'lsa teskari, <b>2</b> bo'lsa 180°. Quyidagi misollarda chap rasm — boshlang'ich holat, o'ng rasm — harakatdan keyin.","Each letter turns one face 90°. A <b>'</b> means counter-clockwise, a <b>2</b> means 180°. In the examples the left picture is before, the right one after the move."],
    goal:null,exam:false,exTitle:['Asosiy harakatlar','Basic moves'],
    examples:[['R',"O'ng tomon","Right face"],["R'","O'ng, teskari","Right, inverse"],['U',"Tepa tomon","Top face"],["U'","Tepa, teskari","Top, inverse"],['F',"Old tomon","Front face"],['L',"Chap tomon","Left face"],['D',"Past tomon","Bottom face"],['R2',"O'ng, 180°","Right, 180°"]].map(([m,u,e])=>({name:[m+' — '+u,m+' — '+e],setup:'',sol:m,view:'full',size:96}))},
   {id:'hands',short:['Barmoqlar','Fingers'],title:["Qo'l texnikasi","Finger technique"],text:["Qaysi barmoq qaysi qatlamni buradi — strelka va animatsiya bilan.","Which finger turns which layer — with arrows and animation."],goal:null,exam:false,extra:[`__FINGERS__`,`__FINGERS__`]}]},
 {id:'cfop',num:1,name:['4-look CFOP','4-look CFOP'],color:'var(--accent)',intro:["CFOP 4 bosqichdan iborat: <b>Krest (X)</b> → <b>F2L</b> → <b>OLL</b> → <b>PLL</b>. Har qadamni tartib bilan o'ting: rasmga qarang, \"Hosil qilish\" formulasi bilan holatni kubingizda yarating va yechimni bajaring. Oxirida mini-test bilan tekshiring.","CFOP has 4 stages: <b>Cross</b> → <b>F2L</b> → <b>OLL</b> → <b>PLL</b>. Go step by step: look at the picture, create the case on your cube with the \"Set up\" moves, then run the solution. Finish with the mini test."],
  steps:[
   {id:'cross',short:['Krest (X)','Cross'],title:['Krest (X) — oq krest pastda','Cross — white cross on the bottom'],text:["Oq markaz pastda. 4 ta oq qirrani shunday qo'yingki, ularning ikkinchi rangi yon markaz bilan bir xil bo'lsin. Formula yodlash shart emas — quyidagi 4 vaziyatni tushunsangiz, har qanday krestni yig'asiz. Rasmlarda faqat krest qirralari rangli.","White centre on the bottom. Place the 4 white edges so their second colour matches the side centre. No memorising needed — understand the 4 situations below and you can build any cross. Only the cross edges are coloured in the pictures."],
    goal:{setup:'',view:'cross'},exTitle:['Vaziyatlar (yig\'ilgan kubdan hosil qiling)','Situations (set them up from a solved cube)'],
    examples:[ex("Qirra tepada, oq tomoni tepaga qaragan","Edge on top, white facing up","F2 U","U' F2",'cross',"U bilan qirrani o'z markazi ustiga olib keling, keyin F2.","Bring the edge above its centre with U, then F2."),
     ex("Qirra o'rta qatlamda","Edge in the middle layer","F","F'",'cross',"Bitta burilish bilan pastga tushadi.","One turn drops it in."),
     ex("Qirra tepada, oq tomoni yonga qaragan","Edge on top, white facing sideways","R' F' R U'","U R' F R",'cross',"Avval yon tomonga burib, keyin o'z joyiga kiriting.","Turn it to the side first, then insert it."),
     ex("Ikki qirra tepada","Two edges on top","R2 U F2","F2 U' R2",'cross',"Har birini navbat bilan joyiga tushiring.","Drop them in one at a time."),
     ex("Haqiqiy holat: 3 ta qirra joyida emas","Real case: 3 edges out of place","D R' F L2 U B","D2 B' R D' B2",'cross',"Ko'zdan kechirishda butun yechimni rejalashtiring.","Plan the whole solution during inspection.")]},
   {id:'f2l',short:['F2L','F2L'],title:['F2L — burchak va qirrani juftlab kiritish','F2L — pair a corner with its edge and insert'],text:["Har bir slot uchun oq burchak va unga mos qirrani <b>tepada</b> juftlab, birga slotga kiritasiz. Avval 4 ta asosiy holatni o'rganing — qolganlari ularga keltiriladi. Rasmlarda maqsad — old-o'ng slot, kulrang qismlar ahamiyatsiz.","For each slot, pair the white corner with its matching edge <b>on top</b> and insert them together. Learn the 4 basic cases first — all others reduce to them. The target is the front-right slot; grey parts don't matter."],
    goal:{setup:'',view:'f2l'},caseTitle:['Asosiy 4 holat + juftlash','The 4 basic cases + pairing'],cases:pick('f2l',['b1','b2','b3','b4','c5','c6','c7','c8','c9','c10','w1','w2'])},
   {id:'oll1',short:['OLL krest','OLL cross'],title:['OLL 1: sariq krest','OLL 1: the yellow cross'],text:["F2L tugagach tepaga qarang: sariq qirralar qanday joylashgan? 3 holatdan biri bo'ladi — chiziq, L shakli yoki nuqta.","After F2L look at the top: how are the yellow edges arranged? It's one of 3 cases — line, L shape or dot."],
    goal:{setup:'',view:'oll-edge'},cases:pick('oll1',['line','L','dot'])},
   {id:'oll2',short:['OLL burchak','OLL corners'],title:['OLL 2: tepani butunlay sariq qilish','OLL 2: make the whole top yellow'],text:["Tepadagi sariq burchaklarni sanang: 0 ta → H yoki Pi; 1 ta → Sune yoki Antisune; 2 ta → Faralar, T yoki Kapalak. Keyin yon tomonlardagi sariqlarga qarab aniqlang.","Count the yellow corners on top: 0 → H or Pi; 1 → Sune or Antisune; 2 → Headlights, T or Bowtie. Then decide by the yellow stickers on the sides."],
    goal:{setup:'',view:'oll'},cases:pick('oll2',['sune','antisune','H','pi','headlights','T','bowtie'])},
   {id:'pllc',short:['PLL burchak','PLL corners'],title:['PLL 1: burchaklarni joyiga qo\'yish','PLL 1: place the corners'],text:["Faqat burchaklarga qarang. Bir tomonda <b>faralar</b> (ikki burchak bir xil rang) bo'lsa — T-perm, hech qayerda bo'lmasa — Y-perm.","Look only at the corners. If one side has <b>headlights</b> (two corners of the same colour) — T-perm; if none — Y-perm."],
    goal:{setup:'',view:'pll'},cases:pick('pll1',['T','Y'])},
   {id:'plle',short:['PLL qirra','PLL edges'],title:['PLL 2: qirralarni joyiga qo\'yish','PLL 2: place the edges'],text:["Burchaklar joyida. Bitta tomon to'liq yig'ilgan bo'lsa — Ua yoki Ub; hech biri yig'ilmagan bo'lsa — H yoki Z.","The corners are in place. If one side is fully solved — Ua or Ub; if none — H or Z."],
    goal:{setup:'',view:'pll'},cases:pick('pll1',['Ua','Ub','H','Z'])}]},
 {id:'pll21',num:2,name:["To'liq PLL","Full PLL"],color:'var(--ok)',intro:["Ikki bosqichli PLL o'rniga oxirgi qatlamni bitta formula bilan yechasiz. Guruhlar bo'yicha o'rganing — har guruhda o'xshash tanib olish belgisi bor.","Instead of 2-look PLL, solve the last layer with one algorithm. Learn by groups — each group shares a recognition pattern."],
  steps:[
   {id:'pa',short:['A, E','A, E'],title:['Faqat burchaklar: A va E','Corners only: A and E'],text:["Qirralar joyida, faqat burchaklar almashadi.","Edges are solved, only the corners move."],goal:{setup:'',view:'pll'},cases:pick('pll2',['Aa','Ab','E'])},
   {id:'pj',short:['J, F, R, V','J, F, R, V'],title:["Bitta qator yoki blok: J, F, R, V","A bar or a block: J, F, R, V"],text:["Bir tomonda to'liq qator yoki 2x1 blok ko'rinadi.","One side shows a full bar or a 2x1 block."],goal:{setup:'',view:'pll'},cases:pick('pll2',['Ja','Jb','F','Ra','Rb','V'])},
   {id:'pg',short:['G','G'],title:["G-perm'lar","G-perms"],text:["Bir tomonda faralar va boshqa joyda 2x1 blok. To'rttasini rasm orqali farqlang.","Headlights on one side and a 2x1 block elsewhere. Tell the four apart by their picture."],goal:{setup:'',view:'pll'},cases:pick('pll2',['Ga','Gb','Gc','Gd'])},
   {id:'pn',short:['N','N'],title:["N-perm'lar","N-perms"],text:["Har bir tomonda 2x1 blok. Kam uchraydi.","A 2x1 block on every side. Rare."],goal:{setup:'',view:'pll'},cases:pick('pll2',['Na','Nb'])}]}
];}
// ---------- exam questions ----------
function simplify3(alg){ const out=[]; tokens(alg).forEach(t=>{ const m=parseTok(t); const last=out.length?parseTok(out[out.length-1]):null;
  if(last&&last.f===m.f){ out.pop(); const a=(last.a+m.a)%4; if(a) out.push(m.f+(a===1?'':a===2?'2':"'")); } else out.push(t); }); return out.join(' '); }
const rnd=n=>Math.floor(Math.random()*n);
const STEP_SET={oll1:['oll1',['line','L','dot']],oll2:['oll2',['sune','antisune','H','pi','headlights','T','bowtie']],pllc:['pll1',['T','Y']],plle:['pll1',['Ua','Ub','H','Z']],
  pa:['pll2',['Aa','Ab','E']],pj:['pll2',['Ja','Jb','F','Ra','Rb','V']],pg:['pll2',['Ga','Gb','Gc','Gd']],pn:['pll2',['Na','Nb']],f2l:['f2l',null]};
const STEP_GOAL={cross:'cross',f2l:'f2l',oll1:'oll1',oll2:'oll2',pllc:'pll',plle:'pll',pa:'pll',pj:'pll',pg:'pll',pn:'pll'};
function qFor(step,kind){
  if(step==='cross'){ const [s,sol]=CROSS_POOL[rnd(CROSS_POOL.length)];
    return {kind:kind==='real'?'real':'sim',setup:s,sol,goal:'cross',view:'cross',name:['Krest (X)','Cross'],prompt:kind==='real'?["Kubingizda krestni yig'ing","Build the cross on your cube"]:["Oq krestni pastda yig'ing","Build the white cross on the bottom"]}; }
  const [k,ids]=STEP_SET[step]; const all=SETS[k].cases.filter(c=>!ids||ids.includes(c.id)); const c=all[rnd(all.length)];
  const pool=(step.startsWith('p')&&step!=='pllc'&&step!=='plle')?SETS.pll2.cases.concat(SETS.pll1.cases):all;
  const a=rnd(4), setup=invert(c.alg)+(a?' '+AUF3[a]:''), sol=simplify3((a?AUF3I[a]+' ':'')+c.alg), view=SETS[k].view;
  const base={setup,sol,view,name:[c.nu,c.ne],hint:[c.hu,c.he],goal:STEP_GOAL[step]};
  if(kind==='name') return {...base,kind,setup:invert(c.alg),sol:c.alg,prompt:['Bu qaysi holat?','Which case is this?'],answer:NM(c),options:LEARN.optionsFrom(NM(c),pool.map(NM).filter((v,i,s)=>s.indexOf(v)===i))};
  if(kind==='alg') return {...base,kind,setup:invert(c.alg),sol:c.alg,prompt:['Qaysi formula bu holatni yechadi?','Which algorithm solves this case?'],answer:c.alg,options:LEARN.optionsFrom(c.alg,pool.map(x=>x.alg))};
  if(kind==='real') return {...base,kind,prompt:['Haqiqiy kubda yeching','Solve it on your real cube']};
  return {...base,kind:'sim',prompt:G3TEXT[STEP_GOAL[step]].map(x=>x.replace(/^Maqsad: /,'').replace(/^Goal: /,'')).map((x,i)=>(i?'Solve in the simulator — ':'Simulyatorda yeching — ')+x)};
}
const KINDS_STEP={cross:['sim','sim','real','sim','sim'],f2l:['sim','alg','sim','real','alg']};
function buildExam3(level,step){
  const lv=lessons3().find(l=>l.id===level); let qs=[];
  if(step){ const ks=KINDS_STEP[step]||['name','alg','sim','name','alg']; qs=ks.map(k=>qFor(step,k)); }
  else { const plan=level==='cfop'?[['cross','sim'],['cross','real'],['f2l','sim'],['f2l','alg'],['oll1','name'],['oll2','alg'],['oll2','sim'],['pllc','name'],['plle','alg'],['plle','sim']]
      :[['pa','name'],['pj','name'],['pg','name'],['pn','name'],['pa','alg'],['pj','alg'],['pg','alg'],['pj','sim'],['pg','sim'],['pa','real']];
    qs=plan.map(([s,k])=>qFor(s,k)); }
  return qs;
}
function examLevels3(){ return lessons3().filter(l=>l.num>0).map(l=>({id:l.id,num:l.num,name:l.name,color:l.color,steps:l.steps})); }
function renderExamHome3(){ LEARN.examHome($('v-imtihon'),examLevels3()); }
function runExam3(level,step){
  const lv=lessons3().find(l=>l.id===level); const st=step?lv.steps.find(s=>s.id===step):null;
  LEARN.startExam($('v-imtihon'),{key:level+'|'+(step||'all'),title:st?st.title:lv.name,questions:buildExam3(level,step),onExit:renderExamHome3,onRetake:()=>runExam3(level,step)});
}
// ---------- lessons view ----------
let LESSON_LV=(DB.lessonLv||'cfop');
function renderLessons3(){
  const lvls=lessons3(); if(!lvls.find(l=>l.id===LESSON_LV)) LESSON_LV='cfop';
  const lv=lvls.find(l=>l.id===LESSON_LV);
  lv.steps.forEach(s=>{ if(s.extra&&s.extra[0]==='__FINGERS__') s.extra=[fingerLesson(),fingerLesson()]; });
  $('v-darslar').innerHTML=`<div class="seg3">${lvls.map(l=>{const b=LEARN.best(l.id+'|all'); return `<button class="${l.id===lv.id?'on':''}" data-l3="${l.id}">${l.num}. ${LEARN.T(l.name)}${b!=null&&b>=80?' ✓':''}</button>`;}).join('')}</div>
    <h1>${LEARN.T(lv.name)}</h1>${LEARN.lessonHTML(lv)}`;
  document.querySelectorAll('[data-l3]').forEach(b=>b.onclick=()=>{LESSON_LV=b.dataset.l3; DB.lessonLv=LESSON_LV; save(); renderLessons3(); window.scrollTo(0,0);});
}
