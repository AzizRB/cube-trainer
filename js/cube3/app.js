// ===================== SHELL / ROUTING =====================
const VIEWS=['darslar','mashq','qollar','imtihon','yechuvchi','taymer'];
const ALIAS={metronom:'qollar'};
const NAV_ICONS={
 reja:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6h11M9 12h11M9 18h11"/><path d="M3.5 6l1.5 1.5L7.5 5M3.5 12l1.5 1.5L7.5 11M3.5 18l1.5 1.5L7.5 17"/></svg>',
 darslar:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 21V5M8 7h7"/></svg>',
 mashq:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.2" fill="currentColor"/></svg>',
 yechuvchi:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M9 3v18M15 3v18M3 9h18M3 15h18"/></svg>',
 qollar:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 11V6a2 2 0 0 0-4 0v5M14 10V4a2 2 0 0 0-4 0v6M10 10.5V6a2 2 0 0 0-4 0v8a8 8 0 0 0 16 0v-2a2 2 0 0 0-4 0"/></svg>',
 imtihon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3h6l1 3H8z"/><rect x="5" y="5" width="14" height="16" rx="2"/><path d="m9 13 2 2 4-4"/></svg>',
 taymer:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 2M10 2h4M19 5l1.5-1.5"/></svg>'};
function renderHeader(){
  document.documentElement.lang=DB.lang;
  $('appName').textContent=L('Speedcubing trener','Speedcubing trainer');
  document.title=L('Speedcubing trener — CFOP','Speedcubing trainer — CFOP');
  $('langBtn').innerHTML=DB.lang==='en'?'🇺🇿 <span class="lbl">O\'zbekcha</span>':'🇬🇧 <span class="lbl">English</span>';
  $('simBtn').innerHTML='🧊<span class="lbl"> '+L('Simulyator','Simulator')+'</span>';
  const names=[L('Darslar','Lessons'),L('Tanib olish mashqi','Recognition drill'),L("Qo'l texnikasi",'Finger tricks'),L('Imtihon','Exam'),L('Yechuvchi','Solver'),L('Taymer','Timer')];
  const short={mashq:L('Mashq','Practice')};
  $('nav').innerHTML=VIEWS.map((v,i)=>`<a href="#${v}" data-v="${v}">${NAV_ICONS[v]}<span>${names[i]}</span></a>`).join('');
  $('bnav').innerHTML=VIEWS.filter(v=>v!=='qollar').map(v=>`<a href="#${v}" data-v="${v}">${NAV_ICONS[v]}<span>${short[v]||names[VIEWS.indexOf(v)]}</span></a>`).join('');
  $('footer').textContent=L("Natijalar va belgilar faqat shu brauzerda saqlanadi.","Your progress and times are saved in this browser only.");
  applyTheme(); markNav();
}
function markNav(){const v=curView(); document.querySelectorAll('#nav a').forEach(a=>a.classList.toggle('on',a.dataset.v===v)); const bv=v==='qollar'?'mashq':v; document.querySelectorAll('#bnav a').forEach(a=>a.classList.toggle('on',a.dataset.v===bv));}
function rawHash(){return (location.hash||'#darslar').slice(1);}
function curView(){const h=rawHash(); return VIEWS.includes(h)?h:(ALIAS[h]||'darslar');}
function curSub(){return curView()==='qollar'?'metro':'rec';}
function showSub(){ const sub=curSub(); document.querySelectorAll('.subtabs a').forEach(a=>a.classList.toggle('on',a.dataset.sub===sub)); }
function route(){const v=curView(); VIEWS.forEach(k=>$('v-'+k).classList.toggle('on',k===v)); markNav(); showSub();
  if(v!=='qollar') metroStop(); if(v==='yechuvchi') warmSolver(); if(v==='imtihon'&&!document.querySelector('#v-imtihon .xrun')) renderExamHome3(); window.scrollTo(0,0);}
window.addEventListener('hashchange',route);
function curTheme(){return DB.theme||(window.matchMedia&&matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');}
function applyTheme(){const t=curTheme(); document.documentElement.dataset.theme=t; const tm=document.querySelector('meta[name=theme-color]'); if(tm) tm.content=t==='dark'?'#141416':'#f6f5f2'; const b=$('themeBtn'); b.textContent=t==='dark'?'☀️':'🌙'; b.title=t==='dark'?L("Yorug' rejim","Light mode"):L("Qorong'i rejim","Dark mode");}

// ===================== PLAN =====================
const PLAN=[
 {tag:["1-hafta","Week 1"],title:["Asos: notatsiya, Krest (X), qo'l texnikasi","Basics: notation, cross, finger tricks"],tasks:[
  ["Darslar → Notatsiya bo'limini o'qing: R, U, F, M, r, f, x harakatlarini bilib oling","Lessons → read Notation: learn the R, U, F, M, r, f, x moves"],
  ["Qo'l texnikasi: R U R' U' (gold trigger) ni metronomda 120 harakat/daq tezlikda xatosiz bajaring","Finger tricks: do R U R' U' (gold trigger) cleanly at 120 moves/min on the metronome"],
  ["Oq Krest (X)ni pastda yig'ishga o'ting (ko'zdan kechirishda butun krestni rejalashtiring, 8 harakatdan kam)","Switch to solving the white cross on the bottom (plan the whole cross during inspection, under 8 moves)"],
  ["2-look OLL 1-qadam: Chiziq, L, Nuqta (3 ta formula)","2-look OLL step 1: Line, L, Dot (3 algorithms)"],
  ["OLL burchaklar: Sune va Antisune","OLL corners: Sune and Antisune"],
  ["Tanib olish mashqi: 'OLL krest' + 'OLL burchak' — 90% aniqlik","Recognition drill: 'OLL cross' + 'OLL corners' — 90% accuracy"]]},
 {tag:["2-hafta","Week 2"],title:["Intuitiv F2L va qolgan OLL","Intuitive F2L and the rest of OLL"],tasks:[
  ["F2L darsini o'qing: burchak + qirrani tepada juftlash g'oyasi","Read the F2L lesson: pairing the corner and edge on top"],
  ["F2L 4 ta asosiy holat (R U R', F' U' F, U R U' R', U' F' U F) — ko'rmasdan bajaring","The 4 basic F2L cases (R U R', F' U' F, U R U' R', U' F' U F) — without looking"],
  ["2-qatlamni endi butunlay F2L bilan yig'ing (birinchi qatlam burchaklarini alohida qo'ymasdan)","Build the first two layers with F2L only (no separate first-layer corners)"],
  ["OLL burchaklar: H, Pi, Faralar, T, Kapalak (5 ta)","OLL corners: H, Pi, Headlights, T, Bowtie (5)"],
  ["Tanib olish mashqi: barcha 10 ta OLL — o'rtacha tanish vaqti 1,5 s dan kam","Recognition drill: all 10 OLLs — average recognition under 1.5 s"]]},
 {tag:["3-hafta","Week 3"],title:["2-look PLL va lookahead","2-look PLL and lookahead"],tasks:[
  ["PLL burchaklar: T-perm va Y-perm","PLL corners: T-perm and Y-perm"],
  ["PLL qirralar: Ua, Ub, H, Z","PLL edges: Ua, Ub, H, Z"],
  ["Lookahead: 5 ta yechimni ataylab sekin, lekin hech to'xtamasdan bajaring","Lookahead: do 5 solves deliberately slowly, but without ever pausing"],
  ["Metronomda to'liq yechim: 60 bpm da boshlab, har kuni biroz oshiring","Full solves to a metronome: start at 60 bpm and raise it a little each day"],
  ["Taymer: kuniga 12 ta yechim, ao12 ni yozib boring. Maqsad: 1 daqiqadan kam","Timer: 12 solves a day, track your ao12. Goal: under 1 minute"]]},
 {tag:["4-hafta","Week 4"],title:["F2L'ni kengaytirish va to'liq PLL boshlanishi","Expanding F2L and starting full PLL"],tasks:[
  ["F2L 12 ta holatning hammasini o'rganing (Darslar → F2L)","Learn all 12 F2L cases (Lessons → F2L)"],
  ["F2L'da kubni aylantirmasdan (y harakatisiz) ishlashga harakat qiling","Try to do F2L without cube rotations (no y moves)"],
  ["To'liq PLL: kuniga 2 ta yangi formula (Jb, Ja, Aa, Ab'dan boshlang)","Full PLL: 2 new algorithms a day (start with Jb, Ja, Aa, Ab)"],
  ["Pro rejim: PLL'ni faqat 2 tomondan tanib olishni mashq qiling","Pro mode: practice recognizing PLL from just 2 sides"],
  ["Maqsad: ao12 — 40–50 soniya. Keyingi bosqich: to'liq OLL (57 ta)","Goal: ao12 of 40–50 seconds. Next stage: full OLL (57)"]]},
];
function renderPlanView(){
  let tot=0,done=0;
  const weeks=PLAN.map((w,wi)=>`<div class="panel week"><div class="tag">${L(...w.tag)}</div><h3>${L(...w.title)}</h3>${w.tasks.map((t,ti)=>{const k=wi+'-'+ti; tot++; const d=!!DB.plan[k]; if(d)done++;
    return `<label class="task ${d?'done':''}"><input type="checkbox" data-k="${k}" ${d?'checked':''}><span>${L(...t)}</span></label>`;}).join('')}</div>`).join('');
  const pct=Math.round(done/tot*100);
  $('v-reja').innerHTML=`<h1>${L("LBL'dan CFOP'ga: 4 haftalik reja","From LBL to CFOP: a 4-week plan")}</h1>
  <p class="lead">${L("Maqsad — har bir holatni bir qarashda tanib, o'ylamasdan bajarish. Buning uchun uchta ko'nikma kerak: <b>tanib olish</b> (rasmni ko'rib, holat nomini bilish), <b>mushak xotirasi</b> (formulani qo'l o'zi bajarishi) va <b>lookahead</b> (bitta qadamni bajarayotib, keyingisini ko'rish). Har kuni 30–40 daqiqa yetarli.",
   "The goal: recognize every case at a glance and execute it without thinking. That takes three skills: <b>recognition</b> (naming a case from a picture), <b>muscle memory</b> (your hands run the algorithm on their own) and <b>lookahead</b> (seeing the next step while executing the current one). 30–40 minutes a day is enough.")}</p>
  <div class="panel" style="margin-bottom:16px"><div class="row" style="justify-content:space-between"><b>${L("Umumiy jarayon","Overall progress")}</b><span class="muted">${pct}% (${done}/${tot})</span></div><div class="progress" style="margin-top:8px"><i style="width:${pct}%"></i></div></div>
  <div class="grid g2">${weeks}</div>
  <h2>${L("Har kungi mashg'ulot (30–40 daqiqa)","Daily session (30–40 minutes)")}</h2>
  <div class="grid g2"><div class="panel"><table>
    <tr><th>${L("Vaqt","Time")}</th><th>${L("Nima qilish","What to do")}</th></tr>
    <tr><td>5 ${L("daq","min")}</td><td>${L("Qizish: <b>Qo'l texnikasi</b> bo'limida metronom bilan triggerlar","Warm-up: triggers with the metronome in <b>Finger tricks</b>")} (<code>R U R' U'</code>, <code>R' F R F'</code>)</td></tr>
    <tr><td>10 ${L("daq","min")}</td><td>${L("<b>Tanib olish mashqi</b>: shu haftaning holatlari, aniqlik 90% dan oshguncha","<b>Recognition drill</b>: this week's cases until accuracy is above 90%")}</td></tr>
    <tr><td>10 ${L("daq","min")}</td><td>${L("Yangi formulalar: har birini haqiqiy kubda 20–30 marta, avval sekin","New algorithms: 20–30 reps each on a real cube, slowly at first")}</td></tr>
    <tr><td>10–15 ${L("daq","min")}</td><td>${L("<b>Taymer</b>: 12 ta to'liq yechim, ao12 natijani kuzating","<b>Timer</b>: 12 full solves, track your ao12")}</td></tr>
  </table></div>
  <div class="panel"><h3>${L("Asosiy qoidalar","Key rules")}</h3><ul class="clean">
    <li>${L("Oq Krest (X) <b>pastda</b>, sariq tepada yig'iladi. Bu sahifadagi barcha rasmlar ham shunday.","White cross on the <b>bottom</b>, yellow on top. Every picture here uses that orientation.")}</li>
    <li>${L("<b>Sekin, lekin to'xtamasdan</b> yechish tez-to'xta-tez yechishdan foydaliroq. Pauzalar — vaqtning asosiy yo'qotilishi.","Solving <b>slowly but without pauses</b> beats fast-stop-fast. Pauses are where most time is lost.")}</li>
    <li>${L("Formulani yodlashda avval <b>rasm → nom → formula</b> zanjirini o'rnating. Faqat harflarni yodlash emas.","When learning an algorithm, build the <b>picture → name → algorithm</b> chain, not just the letters.")}</li>
    <li>${L("Haftada bir marta ao12 natijangizni yozib boring — o'sishni ko'rish motivatsiya beradi.","Write down your ao12 once a week — seeing progress keeps you going.")}</li></ul></div></div>`;
  $('v-reja').querySelectorAll('[data-k]').forEach(i=>i.onchange=()=>{DB.plan[i.dataset.k]=i.checked; save(); renderPlanView();});
}

// ===================== LESSONS =====================
function lessonText(k){
 if(k==='notation') return `<h2 id="l-notation">${L("Notatsiya — harakatlar tili","Notation — the language of moves")}</h2>
 <div class="grid g2"><div class="panel"><table class="notation">
 <tr><td>R</td><td>${L("O'ng tomonni soat yo'nalishida 90° (o'ng tomonga qarab turganda)","Right face 90° clockwise (as seen looking at the right face)")}</td></tr>
 <tr><td>R'</td><td>${L("Teskari yo'nalishda (apostrof = teskari)","Counter-clockwise (apostrophe = inverse)")}</td></tr>
 <tr><td>R2</td><td>${L("180° (ikki marta)","180° (twice)")}</td></tr>
 <tr><td>U D L F B</td><td>${L("Tepa, past, chap, old, orqa tomonlar — xuddi shunday","Up, Down, Left, Front, Back — the same way")}</td></tr>
 <tr><td>M</td><td>${L("O'rta qatlam (L va R orasida), L yo'nalishida","Middle slice (between L and R), turned like L")}</td></tr>
 <tr><td>r, f</td><td>${L("Kichik harf: ikki qatlam birga (r = R + o'rta qatlam)","Lowercase: two layers together (r = R + middle slice)")}</td></tr>
 <tr><td>x, y</td><td>${L("Butun kubni aylantirish: x — R yo'nalishida, y — U yo'nalishida","Whole-cube rotation: x like R, y like U")}</td></tr>
 </table></div><div class="panel"><h3>${L("Rasmlarni qanday o'qish kerak","How to read the pictures")}</h3><ul class="clean">
 <li>${L("<b>Tepadan ko'rinish</b> (OLL, PLL): o'rtadagi 3×3 — tepa tomon, chetidagi ingichka chiziqlar — yon tomonlarning yuqori qatori. Pastki chiziq — sizga qaragan (old) tomon.","<b>Top view</b> (OLL, PLL): the 3×3 is the top face; the thin strips are the top rows of the side faces. The bottom strip is the side facing you (front).")}</li>
 <li>${L("<b>3D ko'rinish</b> (F2L): tepa, old (chapda) va o'ng tomon. Kulrang — ahamiyatsiz stikerlar.","<b>3D view</b> (F2L): top, front (left) and right faces. Gray stickers don't matter.")}</li>
 <li>${L("<b>OLL</b> rasmlarida faqat sariq muhim, qolgani kulrang.","In <b>OLL</b> pictures only yellow matters; everything else is gray.")}</li>
 <li>${L("Barcha holatlarda: sariq tepada, ko'k oldda, qizil o'ngda.","In every case: yellow on top, blue in front, red on the right.")}</li></ul></div></div>`;
 if(k==='cross') return `<h2 id="l-cross">${L("Krest (X) — oq krest pastda","Cross — the white cross (on the bottom)")}</h2>
 <div class="grid g2"><div class="panel"><ul class="clean">
 <li>${L("LBL'da krestni tepada yig'ib, keyin ag'darasiz. CFOP'da Krest (X) <b>darhol pastda</b> yig'iladi — shunda F2L juftlarini tepada ko'rib turasiz.","In LBL you build the cross on top and flip the cube. In CFOP the cross goes <b>straight to the bottom</b>, so you can see the F2L pairs on top.")}</li>
 <li>${L("Musobaqada 15 soniya ko'zdan kechirish bor. Shu vaqtda <b>butun krestni</b> boshida rejalashtiring.","Competitions give you 15 seconds of inspection. Use it to plan the <b>whole cross</b> in advance.")}</li>
 <li>${L("Yaxshi Krest (X) — 8 harakat yoki kam. Avval krestni tepada rejalashtirib, keyin pastda bajarishni mashq qiling.","A good cross is 8 moves or fewer. Practice planning it, then executing it on the bottom.")}</li></ul></div>
 <div class="panel"><h3>${L("Mashq","Practice")}</h3><ul class="clean"><li>${L("Taymerda aralashtiring, 15 soniya qarang, keyin <b>kubga qaramasdan</b> krestni yig'ishga urinib ko'ring. Avval 2 ta qirra, keyin 3, keyin 4.","Scramble with the timer, inspect for 15 seconds, then try to build the cross <b>without looking</b>. Start with 2 edges, then 3, then 4.")}</li>
 <li>${L("Qirralarni qo'yishda <b>F2L slotlarini</b> (bo'sh burchak-qirra joylari) eslab qoling.","While placing edges, keep track of the <b>F2L slots</b> (empty corner-edge spots).")}</li></ul></div></div>`;
 if(k==='f2l') return `<h2 id="l-f2l">${L("F2L — birinchi ikki qatlam birga","F2L — the first two layers together")}</h2>
 <div class="grid g2"><div class="panel"><h3>${L("G'oya","The idea")}</h3><ul class="clean">
 <li>${L("LBL'da avval burchakni, keyin o'rta qirrani alohida qo'yasiz. F2L'da <b>burchak va unga mos qirrani tepada juftlab</b>, bitta harakat bilan slotga kiritasiz.","In LBL you place the corner, then the middle edge, separately. In F2L you <b>pair the corner with its edge on top</b> and insert them into the slot together.")}</li>
 <li>${L("Har bir juft — oq burchak (masalan, oq-ko'k-qizil) va shu ranglardagi qirra (ko'k-qizil).","Each pair is a white corner (e.g. white-blue-red) and the matching edge (blue-red).")}</li>
 <li>${L("Hamma holatlar 3 ta g'oyaga tushadi: <b>juftlash</b>, <b>ajratish</b> (noto'g'ri joylashgan bo'lsa), <b>kiritish</b> (<code>R U R'</code> yoki <code>F' U' F</code>).","Every case comes down to 3 ideas: <b>pairing</b>, <b>separating</b> (when badly placed) and <b>inserting</b> (<code>R U R'</code> or <code>F' U' F</code>).")}</li></ul></div>
 <div class="panel"><h3>${L("Tanib olish kaliti","How to recognize")}</h3><ul class="clean">
 <li>${L("1) Burchakning <b>oq stikeri qayerga</b> qaragan: o'ngga, oldga yoki tepaga?","1) Where does the corner's <b>white sticker</b> face: right, front or up?")}</li>
 <li>${L("2) Qirra <b>qayerda</b> va uning <b>tepasidagi rang</b> qaysi?","2) <b>Where</b> is the edge, and which <b>color is on its top</b>?")}</li>
 <li>${L("Shu ikki savolga javob — holatni aniqlaydi. Quyidagi rasmlarda maqsad slot — old-o'ng.","Those two answers identify the case. In the pictures below the target slot is front-right.")}</li>
 <li>${L("Formulalarni yodlashdan ko'ra, <b>Qadamma-qadam</b> ko'rib, juft qanday hosil bo'lishini tushuning.","Rather than memorizing, use <b>Step by step</b> to see how the pair forms.")}</li></ul></div></div>`;
 if(k==='oll') return `<h2 id="l-oll">${L("OLL — tepani sariq qilish (2 qadamda)","OLL — making the top yellow (in 2 steps)")}</h2>
 <div class="tip">${L("Avval sariq Krest (X) (3 holat), keyin burchaklar (7 holat). Burchaklarni tanishda <b>tepadagi sariq burchaklar sonini</b> sanang: 0 ta → H yoki Pi; 1 ta → Sune yoki Antisune; 2 ta → Faralar, T yoki Kapalak. Keyin yon tomondagi sariq stikerlarga qarang.","First the yellow cross (3 cases), then the corners (7 cases). To recognize corners, count the <b>yellow corners on top</b>: 0 → H or Pi; 1 → Sune or Antisune; 2 → Headlights, T or Bowtie. Then look at the yellow stickers on the sides.")}</div>`;
 if(k==='pll') return `<h2 id="l-pll">${L("PLL — tepa qatlamni joyiga qo'yish","PLL — permuting the last layer")}</h2>
 <div class="tip">${L("<b>Faralar</b> — bir tomondagi ikki burchak bir xil rang. <b>Blok</b> — burchak va qirra yonma-yon bir rang. <b>Qator</b> — butun tomon bir rang. Pro kubchilar PLL'ni faqat 2 ta tomonga qarab taniydi: faralar va bloklarni qidiradi. Har bir rasm ostida tomonlar tahlili berilgan.","<b>Headlights</b> — two corners on one side share a color. <b>Block</b> — a corner and edge next to each other share a color. <b>Bar</b> — a whole side is one color. Pros recognize PLL from just 2 sides by looking for headlights and blocks. Each picture has a side-by-side breakdown below it.")}</div>`;
}
function caseCard(k,c){
  const S=SETS[k], st=caseState(c.alg,0,0);
  const feat=S.view==='pll'?`<div class="feat">${pllFeatures(st)}</div>`:'';
  return `<div class="card"><div class="pic">${S.pic==='iso'?isoSVG(st,S.view,150):topSVG(st,S.view,150)}</div>
   <div class="name">${NM(c)}</div><div class="algrow"><span class="alg">${c.alg}</span>${copyBtn(c.alg)}</div><div class="hint">${HN(c)}</div>${feat}
   <div class="row" style="gap:6px"><button class="sm" data-step="${k}|${c.id}">▶ ${L("Qadamma-qadam","Step by step")}</button><button class="sm" data-sim="${c.alg}">🧊 ${L("Simulyatorda","In simulator")}</button></div></div>`;
}
function renderLessonsView(){
  const nav=[['l-notation',L('Notatsiya','Notation')],['l-fingers',L('Barmoqlar','Fingers')],['l-cross',L('Krest (X)','Cross')],['l-f2l','F2L'],['l-oll','OLL'],['l-pll','PLL']];
  const block=k=>`<h3 style="margin:18px 0 10px">${ST(k)} <span class="muted" style="font-weight:500">· ${SETS[k].cases.length}</span></h3><div class="grid g3">${SETS[k].cases.map(c=>caseCard(k,c)).join('')}</div>`;
  $('v-darslar').innerHTML=`<h1>${L("Darslar va holatlar kutubxonasi","Lessons and case library")}</h1>
  <p class="lead">${L("Har bir holat rasmi formuladan hisoblab chizilgan — rasm aynan formula bajarilishidan oldingi holatni ko'rsatadi. Kubni rasmdagidek ushlang. <b>Qadamma-qadam</b> formulani harakat bo'yicha ko'rsatadi, <b>Simulyatorda</b> esa holatni 3D kubga yuklaydi.","Every picture is computed from its algorithm — it shows exactly the state before you run it. Hold the cube as pictured. <b>Step by step</b> walks through the moves; <b>In simulator</b> loads the case onto the 3D cube.")}</p>
  <div class="row" style="margin-bottom:8px">${nav.map(([id,n])=>`<button class="sm" data-jump="${id}">${n}</button>`).join('')}</div>
  ${lessonText('notation')+fingerLesson()+lessonText('cross')+lessonText('f2l')+block('f2l')+lessonText('oll')+block('oll1')+block('oll2')+lessonText('pll')+block('pll1')+block('pll2')}`;
}


// ===================== FINGER LESSON =====================
const FINGERS=[
 ['R',["O'ng qo'l · bilak","Right hand · wrist"],["Bilakni yuqoriga (o'zingizdan nariga) burang. Barmoqlar emas, bilak ishlaydi; bosh barmoq old tomonda qoladi.","Turn your wrist up (away from you). The wrist does the work, not the fingers; your thumb stays on the front."]],
 ["R'",["O'ng qo'l · bilak","Right hand · wrist"],["Bilakni pastga (o'zingizga tomon) burang.","Turn your wrist down (toward you)."]],
 ['U',["O'ng ko'rsatkich","Right index"],["Barmoq tepa qatlamning o'ng-orqa burchagida turadi va uni o'zingizga tomon chertadi.","The finger rests on the back-right of the top layer and flicks it toward you."]],
 ["U'",["Chap ko'rsatkich","Left index"],["Barmoq tepa qatlamning chap-orqa burchagida turadi va uni o'zingizga tomon chertadi.","The finger rests on the back-left of the top layer and flicks it toward you."]],
 ['U2',["O'ng ko'rsatkich + o'rta","Right index + middle"],["Ketma-ket ikki chertish (double flick): avval ko'rsatkich, darhol o'rta barmoq.","Two flicks in a row (double flick): index, then immediately middle finger."]],
 ['L',["Chap qo'l · bilak","Left hand · wrist"],["Chap bilakni pastga (o'zingizga tomon) burang.","Turn your left wrist down (toward you)."]],
 ["L'",["Chap qo'l · bilak","Left hand · wrist"],["Chap bilakni yuqoriga (nariga) burang.","Turn your left wrist up (away from you)."]],
 ['F',["O'ng ko'rsatkich","Right index"],["Old qatlamning o'ng-yuqori qismini pastga tortib burang. Bilak joyida qoladi.","Pull the top-right of the front layer down. The wrist stays put."]],
 ["F'",["O'ng bosh barmoq","Right thumb"],["Old qatlamning o'ng-past qismini bosh barmoq bilan yuqoriga itaring.","Push the bottom-right of the front layer up with your thumb."]],
 ['D',["Chap halqa barmoq","Left ring finger"],["Pastki qatlamni orqa tomondan chapga torting.","Pull the bottom layer to the left from the back."]],
 ["D'",["O'ng halqa barmoq","Right ring finger"],["Pastki qatlamni orqa tomondan o'ngga torting.","Pull the bottom layer to the right from the back."]],
 ["M'",["Chap halqa barmoq","Left ring finger"],["O'rta qatlamni pastki-orqa tomondan o'zingizga tomon itaring — old qismi yuqoriga chiqadi. H va Z-perm'da kerak.","Push the middle slice from the bottom-back toward you — the front goes up. Needed for H and Z-perm."]],
 ['M',["Chap halqa yoki ko'rsatkich","Left ring or index"],["Teskari yo'nalish: pastki qismni orqaga itaring yoki tepasini o'zingizga torting.","The reverse: push the bottom away, or pull the top toward you."]],
];
function moveArrow(mv){
  const m=parseTok(mv), [ax,pr]=MOVES[m.f];
  const vis=t=>(t.n[1]===1&&t.p[1]===1)||(t.n[2]===1&&t.p[2]===1)||(t.n[0]===1&&t.p[0]===1);
  let best=null;
  for(const t of solvedCube()){ if(!vis(t)||!pr(t.p[ax])) continue;
    const c={p:t.p.slice(),n:t.n.slice()}; move([c],m.f,m.a===2?1:m.a);
    if(!vis(c)||c.n.join()===t.n.join()) continue;
    const sc=t.p.filter(v=>v!==0).length; if(!best||sc<best.sc) best={a:t,b:c,sc}; }
  if(!best) return null;
  const A=best.a.p.map((v,i)=>v+best.a.n[i]*0.5), B=best.b.p.map((v,i)=>v+best.b.n[i]*0.5);
  const M3=A.map((v,i)=>(v+B[i])/2*1.3);
  return (P,size)=>{const a=P(...A),b=P(...B),c=P(...M3), id='ah'+Math.random().toString(36).slice(2,8);
    const d=`M${a[0].toFixed(1)},${a[1].toFixed(1)} Q${c[0].toFixed(1)},${c[1].toFixed(1)} ${b[0].toFixed(1)},${b[1].toFixed(1)}`;
    return `<defs><marker id="${id}" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#ff5a1f" stroke="#fff" stroke-width="1.2"/></marker></defs>
      <path d="${d}" fill="none" stroke="#fff" stroke-width="${size*0.05}" stroke-linecap="round"/>
      <path d="${d}" fill="none" stroke="#ff5a1f" stroke-width="${size*0.03}" stroke-linecap="round" marker-end="url(#${id})"/>
      ${m.a===2?`<text x="${(b[0]+6).toFixed(1)}" y="${(b[1]-6).toFixed(1)}" font-size="${size*0.12}" font-weight="800" fill="#ff5a1f" stroke="#fff" stroke-width="0.8" font-family="system-ui">×2</text>`:''}`;};
}
function fingerLesson(){
  const cards=FINGERS.map(([mv,who,how])=>`<div class="card fcard"><div class="pic" data-fpic="${mv}">${isoSVG(solvedCube(),'pll',140,moveArrow(mv))}</div>
    <div class="row" style="justify-content:space-between"><span class="alg" style="font-size:18px">${mv}</span><button class="sm" data-fplay="${mv}">▶ ${L("Ko'rish",'Show')}</button></div>
    <div class="who">${L(...who)}</div><div class="hint">${L(...how)}</div></div>`).join('');
  return `<h2 id="l-fingers">${L("Qo'l texnikasi: qaysi barmoq qaysi qatlamni buradi","Finger technique: which finger turns which layer")}</h2>
  <div class="grid g2" style="margin-bottom:14px">
   <div class="panel"><h3>${GLOSS.termify(L("Asosiy ushlash ({{homegrip|home grip}})","{{homegrip|Home grip}}"))}</h3><ul class="clean">
    <li>${L("Bosh barmoqlar <b>old tomonda</b>, pastki-o'rta qatlam atrofida.","Thumbs on the <b>front</b>, around the bottom and middle layers.")}</li>
    <li>${L("Ko'rsatkichlar <b>tepa qatlamning orqa burchaklarida</b> turadi — U va U' uchun tayyor.","Index fingers rest on the <b>back corners of the top layer</b>, ready for U and U'.")}</li>
    <li>${L("Qolgan barmoqlar orqada. Kubni kaft bilan emas, <b>barmoq uchlari</b> bilan yengil ushlang.","The other fingers sit on the back. Hold the cube <b>lightly with your fingertips</b>, not your palms.")}</li>
    <li>${L("Oddiy qoida: <b>R/L — bilak</b>, <b>U/U' — ko'rsatkich</b>, <b>D — halqa barmoq</b>, <b>F — ko'rsatkich yoki bosh barmoq</b>.","Rule of thumb: <b>R/L — wrist</b>, <b>U/U' — index finger</b>, <b>D — ring finger</b>, <b>F — index or thumb</b>.")}</li></ul></div>
   <div class="panel"><h3>${L("Best practice","Best practice")}</h3><ul class="clean">
    <li>${L("Har bir formula uchun <b>bitta barmoq tartibini</b> tanlang va doim shunday bajaring — mushak xotirasi shunda shakllanadi.","Pick <b>one fingering</b> per algorithm and always use it — that's how muscle memory forms.")}</li>
    <li>${GLOSS.termify(L("<b>{{regrip|Regrip}}</b> va {{rotation|kub aylantirish}}ni (<code>x</code>, <code>y</code>) kamaytiring: har biri ~0,3 s.","Cut <b>{{regrip|regrips}}</b> and {{rotation|cube rotations}} (<code>x</code>, <code>y</code>): each costs ~0.3 s."))}</li>
    <li>${L("Avval sekin va to'g'ri, keyin tez. Metronom bilan ritmni ushlang (Qo'l texnikasi bo'limi).","Slow and correct first, then fast. Keep the rhythm with the metronome (Finger tricks section).")}</li>
    <li>${GLOSS.termify(L("Misollar: <b>{{trigger|Gold trigger}}</b> <code>R U R' U'</code> = bilak · o'ng ko'rsatkich · bilak · chap ko'rsatkich. <b>Sledgehammer</b> <code>R' F R F'</code> = bilak · o'ng ko'rsatkich · bilak · o'ng bosh barmoq.","Examples: <b>{{trigger|Gold trigger}}</b> <code>R U R' U'</code> = wrist · right index · wrist · left index. <b>Sledgehammer</b> <code>R' F R F'</code> = wrist · right index · wrist · right thumb."))}</li></ul></div>
  </div>
  <p class="muted" style="margin-top:0">${L("Strelka — qatlam qaysi tomonga harakatlanishi. <b>▶ Ko'rish</b> harakatni 3D kubda ko'rsatadi.","The arrow shows which way the layer moves. <b>▶ Show</b> plays the move on a 3D cube.")}</p>
  <div class="grid g3">${cards}</div>`;
}
function playFinger(mv){
  const box=document.querySelector(`[data-fpic="${CSS.escape(mv)}"]`); if(!box||box.dataset.busy) return; box.dataset.busy=1;
  const cube=new Cube3D(box,{height:140,size:28,dur:()=>650}); cube.rx=-30; cube.ry=-45; cube.view(); box.querySelector('.scene').style.width='100%';
  setTimeout(()=>cube.enqueue([mv],false),350);
  setTimeout(()=>{box.innerHTML=isoSVG(solvedCube(),'pll',140,moveArrow(mv)); delete box.dataset.busy;},2600);
}

// ===================== STEPPER =====================
let STEP=null;
function openStepper(k,c){STEP={k,c,toks:tokens(c.alg),i:0}; drawStepper(); $('modal').classList.add('on');}
function drawStepper(){
  const {k,c,toks,i}=STEP, S=SETS[k];
  const st=caseState(c.alg,0,0); toks.slice(0,i).forEach(t=>{const m=parseTok(t);move(st,m.f,m.a);});
  $('modalBox').innerHTML=`<div class="row" style="justify-content:space-between"><h3 style="margin:0">${NM(c)} <span class="muted" style="font-weight:500">· ${SH(k)}</span></h3><button class="sm ghost" id="mClose">✕</button></div>
   <div class="row" style="justify-content:center;gap:24px;margin:14px 0">${isoSVG(st,S.view,190)}${topSVG(st,S.view,170)}</div>
   <div class="tokens">${toks.map((t,j)=>`<span class="${j<i?'done':j===i?'cur':''}">${t}</span>`).join('')}</div>
   <p class="muted" style="text-align:center;margin:10px 0">${i===0?L("Boshlang'ich holat","Starting position"):i===toks.length?L('Tayyor ✓','Done ✓'):L('Keyingi harakat','Next move')+': <b>'+toks[i]+'</b>'} · ${i}/${toks.length}</p>
   <div class="row" style="justify-content:center"><button id="mFirst">⏮</button><button id="mPrev">◀ ${L('Orqaga','Back')}</button><button class="primary" id="mNext">${L('Keyingi','Next')} ▶</button><button id="mLast">⏭</button></div>
   <p class="muted" style="font-size:13px;text-align:center;margin-bottom:0">${L('Klaviatura','Keyboard')}: <kbd>←</kbd> <kbd>→</kbd>. ${L("Haqiqiy kubni ham parallel ravishda burang.","Turn your real cube along with it.")}</p>`;
  const set=v=>{STEP.i=Math.max(0,Math.min(toks.length,v)); drawStepper();};
  $('mClose').onclick=closeModal; $('mFirst').onclick=()=>set(0); $('mLast').onclick=()=>set(toks.length);
  $('mPrev').onclick=()=>set(STEP.i-1); $('mNext').onclick=()=>set(STEP.i+1);
}
function closeModal(){$('modal').classList.remove('on'); STEP=null;}
$('modal').addEventListener('click',e=>{if(e.target.id==='modal')closeModal();});

// ===================== DRILL =====================
let CUR=null, SESSION={n:0,ok:0,times:[]};
const statKey=(k,id)=>k+':'+id;
const subtabsHTML=()=>`<div class="subtabs"><a href="#mashq" data-sub="rec">🎯 ${L('Tanib olish','Recognition')}</a><a href="#qollar" data-sub="metro">🎵 ${L("Metronom va qo'llar",'Metronome & hands')}</a></div>`;
function renderMashqShell(){
  $('v-mashq').innerHTML=subtabsHTML()+`<div id="mashq-rec"></div>`;
}
function renderDrillView(){
  $('mashq-rec').innerHTML=`<h1>${L("Tanib olish mashqi","Recognition drill")}</h1>
  <p class="lead">${L("Pro kubchilar holatni 0,5 soniyadan tez taniydi. Bu yerda holat tasodifiy burchakda ko'rsatiladi — siz nomini topasiz. Xato qilgan holatlaringiz keyinroq tez-tez qaytadi.","Pros recognize a case in under half a second. Here a case appears at a random angle and you name it. Cases you miss come back more often.")}</p>
  <div class="panel" style="margin-bottom:14px">
    <div class="row" style="margin-bottom:10px"><b>${L("To'plamlar","Sets")}:</b><span id="setChips" class="row"></span></div>
    <div class="row"><b>${L("Rejim","Mode")}:</b>
      <label class="chip"><input type="radio" name="mode" value="rec" ${DB.mode!=='alg'?'checked':''}> ${L("Nomini topish","Name the case")}</label>
      <label class="chip"><input type="radio" name="mode" value="alg" ${DB.mode==='alg'?'checked':''}> ${L("Formulani eslash","Recall the algorithm")}</label>
      <label class="chip"><input type="checkbox" id="proView" ${DB.pro?'checked':''}> ${L("Pro: PLL'ni 2 tomondan (3D)","Pro: PLL from 2 sides (3D)")}</label></div>
  </div>
  <div class="drill"><div class="panel stage" id="stage"></div><div class="panel"><div id="drillSide"></div></div></div>
  <h2>${L("Statistika","Statistics")}</h2>
  <div class="panel"><div class="stat" id="drillStat" style="margin-bottom:12px"></div><div style="overflow-x:auto"><table id="caseStats"></table></div>
  <div class="row" style="margin-top:10px"><button class="sm ghost" id="resetStats">${L("Statistikani tozalash","Reset statistics")}</button></div></div>`;
  renderSetChips(); renderDrillStats();
  $('resetStats').onclick=()=>{DB.stats={}; SESSION={n:0,ok:0,times:[]}; save(); renderDrillStats();};
  document.querySelectorAll('input[name=mode]').forEach(i=>i.onchange=()=>{DB.mode=i.value; save(); nextCase();});
  $('proView').onchange=e=>{DB.pro=e.target.checked; save(); drawDrill();};
  if(CUR) drawDrill(); else nextCase();
}
function renderSetChips(){
  $('setChips').innerHTML=SET_ORDER.map(k=>`<label class="chip ${DB.sets.includes(k)?'on':''}"><input type="checkbox" data-set="${k}" ${DB.sets.includes(k)?'checked':''}> ${SH(k)} <span class="muted">(${SETS[k].cases.length})</span></label>`).join('');
  document.querySelectorAll('[data-set]').forEach(i=>i.onchange=()=>{const k=i.dataset.set; DB.sets=DB.sets.filter(s=>s!==k); if(i.checked)DB.sets.push(k);
    if(!DB.sets.length)DB.sets=[k]; save(); renderSetChips(); nextCase();});
}
function pool(){const out=[]; SET_ORDER.filter(k=>DB.sets.includes(k)).forEach(k=>SETS[k].cases.forEach(c=>out.push({k,c}))); return out;}
function weight(k,id){const s=DB.stats[statKey(k,id)]; if(!s) return 3; const acc=s.r/(s.r+s.w); const avg=s.t/Math.max(1,s.r); return 1+(1-acc)*6+Math.min(3,avg/1500)+(s.r+s.w<3?2:0);}
function nextCase(){
  const P=pool(); let tot=0; const ws=P.map(o=>{const w=weight(o.k,o.c.id); tot+=w; return w;});
  let r=Math.random()*tot, idx=0; for(;idx<P.length;idx++){r-=ws[idx]; if(r<=0)break;} idx=Math.min(idx,P.length-1);
  if(CUR && P.length>1 && P[idx].k===CUR.k && P[idx].c.id===CUR.c.id) idx=(idx+1+Math.floor(Math.random()*(P.length-1)))%P.length;
  const o=P[idx], S=SETS[o.k];
  CUR={k:o.k,c:o.c,pre:S.view==='pll'?Math.floor(Math.random()*4):0,post:Math.floor(Math.random()*4),t0:performance.now(),answered:false};
  drawDrill();
}
const mode=()=>{const r=document.querySelector('input[name=mode]:checked'); return r?r.value:'rec';};
function drawDrill(){
  if(!$('stage')) return;
  const {k,c,pre,post}=CUR, S=SETS[k];
  const iso=$('proView').checked && S.view==='pll';
  const st=caseState(c.alg,pre,post);
  $('stage').innerHTML=`<div class="muted" style="font-size:13px">${ST(k)}</div>${(S.pic==='iso'||iso)?isoSVG(st,S.view,250):topSVG(st,S.view,240)}<div id="verdict" style="min-height:26px"></div>`;
  const side=$('drillSide'); CUR.answered=false; CUR.t0=performance.now();
  if(mode()==='rec'){
    side.innerHTML=`<h3>${L("Bu qaysi holat?","Which case is this?")}</h3><p class="muted" style="margin-top:0;font-size:13.5px">${L("Tez tanishga harakat qiling — vaqt o'lchanmoqda.","Be quick — you're being timed.")}</p>
     <div class="answers">${pool().map(o=>`<button data-ans="${o.k}|${o.c.id}">${NM(o.c)}${DB.sets.length>1?`<br><span class="muted" style="font-size:11px">${SH(o.k)}</span>`:''}</button>`).join('')}</div><div id="after"></div>`;
    side.querySelectorAll('[data-ans]').forEach(b=>b.onclick=()=>answer(b));
  } else {
    side.innerHTML=`<h3>${L("Formulani eslang","Recall the algorithm")}</h3><p class="muted" style="margin-top:0">${L("Holatni tanib, formulani haqiqiy kubda bajaring. Keyin tekshiring.","Recognize the case and run the algorithm on your cube. Then check.")}</p>
     <button class="primary" id="reveal">${L("Formulani ko'rsatish","Show algorithm")} <kbd style="color:inherit;border-color:rgba(255,255,255,.5);background:transparent">Space</kbd></button><div id="after"></div>`;
    $('reveal').onclick=reveal;
  }
}
function record(ok,ms){
  const key=statKey(CUR.k,CUR.c.id); const s=DB.stats[key]||(DB.stats[key]={r:0,w:0,t:0});
  if(ok){s.r++; s.t+=ms;} else s.w++; SESSION.n++; if(ok){SESSION.ok++; SESSION.times.push(ms);} save(); renderDrillStats();
}
function afterCard(ok){
  const {k,c}=CUR, S=SETS[k], ref=caseState(c.alg,0,0);
  const feat=S.view==='pll'?`<div class="feat" style="margin-top:6px">${pllFeatures(ref)}</div>`:'';
  return `<div class="card" style="margin-top:14px;background:${ok?'var(--ok-soft)':'var(--bad-soft)'}"><div class="row" style="align-items:flex-start;flex-wrap:nowrap;gap:12px">
   <div style="flex:none">${S.pic==='iso'?isoSVG(ref,S.view,110):topSVG(ref,S.view,110)}</div>
   <div><div class="name">${NM(c)}</div><div class="algrow" style="margin:4px 0"><span class="alg">${c.alg}</span>${copyBtn(c.alg)}</div><div class="hint">${HN(c)}</div>${feat}</div></div>
   <div class="muted" style="font-size:12.5px">${L("Chapdagi rasm — formulani boshlash holati. Kerak bo'lsa avval <code>U</code> bilan tepani shu holatga keltiring.","The small picture is the starting position. If needed, turn <code>U</code> first to match it.")}</div>
   <div><button class="sm" data-sim="${c.alg}">🧊 ${L("Simulyatorda ko'rish","See it in the simulator")}</button></div></div>`;
}
function answer(btn){
  if(CUR.answered) return; CUR.answered=true; const ms=performance.now()-CUR.t0;
  const[k,id]=btn.dataset.ans.split('|'); const ok=(k===CUR.k&&id===CUR.c.id);
  document.querySelectorAll('[data-ans]').forEach(b=>{const[bk,bid]=b.dataset.ans.split('|'); if(bk===CUR.k&&bid===CUR.c.id)b.classList.add('right');});
  if(!ok) btn.classList.add('wrong');
  $('verdict').innerHTML=`<span class="verdict ${ok?'ok':'no'}">${ok?L("To'g'ri!","Correct!")+' '+(ms/1000).toFixed(2)+' s':L('Xato — bu ','Wrong — it\'s ')+NM(CUR.c)}</span>`;
  record(ok,ms);
  $('after').innerHTML=afterCard(ok)+`<div class="row" style="margin-top:12px"><button class="primary" id="nextBtn">${L('Keyingi','Next')} ▶ <kbd style="color:inherit;border-color:rgba(255,255,255,.5);background:transparent">Enter</kbd></button></div>`;
  $('nextBtn').onclick=nextCase;
}
function reveal(){
  if(CUR.answered) return; CUR.answered=true; CUR.ms=performance.now()-CUR.t0; $('reveal').remove();
  $('after').innerHTML=afterCard(true)+`<div class="row" style="margin-top:12px"><button class="primary" id="knew">✓ ${L('Bildim','I knew it')} <kbd style="color:inherit;border-color:rgba(255,255,255,.5);background:transparent">1</kbd></button><button id="didnt">✗ ${L('Bilmadim',"I didn't")} <kbd>2</kbd></button></div>`;
  $('knew').onclick=()=>{record(true,CUR.ms); nextCase();}; $('didnt').onclick=()=>{record(false,0); nextCase();};
}
const fmtMs=ms=>(ms/1000).toFixed(2)+' s';
function renderDrillStats(){
  if(!$('drillStat')) return;
  const avg=SESSION.times.length?SESSION.times.reduce((a,b)=>a+b,0)/SESSION.times.length:0;
  $('drillStat').innerHTML=`<div><b>${SESSION.n}</b><span>${L("Shu seans","This session")}</span></div><div><b>${SESSION.n?Math.round(SESSION.ok/SESSION.n*100):0}%</b><span>${L("Aniqlik","Accuracy")}</span></div><div><b>${avg?fmtMs(avg):'—'}</b><span>${L("O'rtacha tanish","Avg recognition")}</span></div>`;
  const rows=[]; SET_ORDER.forEach(k=>SETS[k].cases.forEach(c=>{const s=DB.stats[statKey(k,c.id)]; if(s) rows.push({k,c,s,acc:s.r/(s.r+s.w),avg:s.r?s.t/s.r:0});}));
  rows.sort((a,b)=>a.acc-b.acc||b.avg-a.avg);
  $('caseStats').innerHTML=rows.length?`<tr><th>${L('Holat','Case')}</th><th>${L("To'plam",'Set')}</th><th>${L('Urinish','Attempts')}</th><th>${L('Aniqlik','Accuracy')}</th><th>${L("O'rt. vaqt",'Avg time')}</th></tr>`+rows.map(r=>`<tr><td>${NM(r.c)}</td><td class="muted">${SH(r.k)}</td><td>${r.s.r+r.s.w}</td>
    <td><div class="row" style="gap:8px;flex-wrap:nowrap"><div class="bar" style="width:70px"><i style="width:${Math.round(r.acc*100)}%;background:${r.acc>=.9?'var(--ok)':r.acc>=.6?'var(--accent)':'var(--bad)'}"></i></div>${Math.round(r.acc*100)}%</div></td><td>${r.avg?fmtMs(r.avg):'—'}</td></tr>`).join('')
    :`<tr><td class="muted">${L("Hali ma'lumot yo'q — mashqni boshlang. Eng zaif holatlar shu yerda tepada ko'rinadi.","No data yet — start drilling. Your weakest cases will show up at the top here.")}</td></tr>`;
}

// ===================== METRONOME (with 3D cube) =====================
const TRIGGERS=[["Gold trigger","R U R' U'"],["Sledgehammer","R' F R F'"],[["Teskari gold trigger","Reverse gold trigger"],"U R U' R'"],[["Chap gold trigger","Left gold trigger"],"L' U' L U"]];
function metroList(){const out=TRIGGERS.map(([n,a])=>({name:Array.isArray(n)?L(...n):n,alg:a,isCase:false}));
  SET_ORDER.forEach(k=>SETS[k].cases.forEach(c=>out.push({name:SH(k)+' · '+NM(c),alg:c.alg,isCase:true}))); return out;}
let M={on:false,timer:null,i:0,reps:0,ctx:null,sel:0,cube:null};
function metroItem(){return metroList()[M.sel];}
function metroStartState(){const it=metroItem(); return it.isCase?caseState(it.alg,0,0):solvedCube();}
function renderHandsView(){
  metroStop();
  $('v-qollar').innerHTML=subtabsHTML()+`<h1>${L("Qo'l texnikasi (finger tricks)","Finger tricks")}</h1>
  <p class="lead">${L("Tezlik qo'lning kuchidan emas, harakatlarning uzluksizligidan keladi. Metronom bilan formulalarni bir xil ritmda bajarishni o'rganing — avval sekin, keyin asta-sekin tezlashtiring.","Speed comes from flow, not force. Learn to run algorithms at an even rhythm with the metronome — slowly first, then gradually faster.")}</p>
  <div class="grid g2">
    <div class="panel">
      <h3>${L("Metronom bilan formula mashqi","Metronome algorithm practice")}</h3>
      <p class="muted" style="margin-top:0">${L("Har bir \"chiq\" ovozida bitta harakat qiling. 3D kub ham shu ritmda harakatlanadi.","Make one move on every click. The 3D cube moves to the same beat.")}</p>
      <div class="row" style="margin-bottom:10px;flex-wrap:nowrap"><select id="metroAlg" style="flex:1;min-width:0">${metroList().map((it,i)=>`<option value="${i}" ${i===M.sel?'selected':''}>${it.name} — ${it.alg}</option>`).join('')}</select><button class="sm" id="metroCopy" title="${L('Nusxa olish','Copy')}">⧉ ${L('Nusxa','Copy')}</button></div>
      <div class="row" style="margin-bottom:14px"><span>${L('Tezlik','Speed')}:</span><input type="range" id="bpm" min="40" max="300" step="10" value="${DB.bpm||90}"><b id="bpmVal">${DB.bpm||90}</b><span class="muted">${L('harakat/daq','moves/min')} (<span id="tps">${((DB.bpm||90)/60).toFixed(1)}</span> TPS)</span></div>
      <div class="metro" id="metroShow"></div>
      <div class="row" style="justify-content:center;margin-top:14px">
        <button class="primary" id="metroBtn">▶ ${L('Boshlash','Start')}</button>
        <span class="muted" id="metroReps"></span>
      </div>
      <div id="metroCube" style="margin-top:14px"></div>
      <div class="tip">${L("Formulani 10 marta xatosiz bajara olsangiz, tezlikni 10–20 ga oshiring. Xato ko'paysa, qaytib pasaytiring. Holat formulalarida kub har takror boshida holatga qaytadi va oxirida yig'ilgan bo'ladi.","Once you can do it 10 times cleanly, raise the speed by 10–20. If mistakes pile up, slow back down. For case algorithms the cube resets to the case at the start of every rep and ends solved.")}</div>
    </div>
    <div class="panel">
      <h3>${L("Asosiy qoidalar","Key techniques")}</h3>
      <table>
        <tr><th>${L('Harakat','Move')}</th><th>${L('Qanday bajariladi','How to do it')}</th></tr>
        <tr><td><code>U</code></td><td>${L("O'ng ko'rsatkich: tepa qatlamning o'ng-orqa burchagini o'zingizga tomon chertish","Right index: flick the back-right of the top layer toward you")}</td></tr>
        <tr><td><code>U'</code></td><td>${L("Chap ko'rsatkich: tepa qatlamning chap-orqa burchagini o'zingizga tomon chertish","Left index: flick the back-left of the top layer toward you")}</td></tr>
        <tr><td><code>U2</code></td><td>${L("O'ng ko'rsatkich + o'rta barmoq ketma-ket (ikki chertish)","Right index then middle finger (a double flick)")}</td></tr>
        <tr><td><code>R</code> / <code>R'</code></td><td>${L("Butun qo'l emas, faqat bilakni burang. Bosh barmoq old tomonda qoladi","Turn with your wrist, not your whole arm. Thumb stays on the front")}</td></tr>
        <tr><td><code>L</code> / <code>L'</code></td><td>${L("Chap bilak: <code>L</code> — pastga, <code>L'</code> — yuqoriga","Left wrist: <code>L</code> down, <code>L'</code> up")}</td></tr>
        <tr><td><code>F</code> / <code>F'</code></td><td>${L("<code>F</code> — o'ng ko'rsatkich pastga tortadi, <code>F'</code> — o'ng bosh barmoq yuqoriga itaradi. Bilak joyida","<code>F</code> — right index pulls down, <code>F'</code> — right thumb pushes up. Wrist stays put")}</td></tr>
        <tr><td><code>D</code> / <code>D'</code></td><td>${L("Halqa barmog'i bilan pastki qatlamni orqadan tortish: <code>D</code> — chap qo'l, <code>D'</code> — o'ng qo'l","Pull the bottom layer from the back with a ring finger: <code>D</code> left hand, <code>D'</code> right hand")}</td></tr>
        <tr><td><code>M'</code></td><td>${L("Chap halqa barmog'i o'rta qatlamni pastki-orqadan o'zingizga tomon itaradi (<code>M</code> — teskari)","Left ring finger pushes the middle slice from the bottom-back toward you (<code>M</code> is the reverse)")}</td></tr>
      </table>
      <div class="row" style="margin-top:12px"><button class="sm" data-goto="l-fingers">✋ ${L("Rasmli va animatsiyali dars","Lesson with pictures & animation")} →</button></div>
      <h3 style="margin-top:16px">${L("Silliqlik uchun","For smoothness")}</h3>
      <ul class="clean">
        <li>${GLOSS.termify(L("<b>{{regrip|Regrip}}</b>ni kamaytiring: formula davomida kubni qayta ushlamang.","Minimize <b>{{regrip|regrips}}</b>: don't re-grip the cube in the middle of an algorithm."))}</li>
        <li>${GLOSS.termify(L("<b>{{rotation|Kubni aylantirish}}</b>ni (<code>y</code>, <code>x</code>) kamaytiring — har biri ~0,3 s yo'qotadi.","Minimize <b>{{rotation|cube rotations}}</b> (<code>y</code>, <code>x</code>) — each costs ~0.3 s."))}</li>
        <li>${L("Kubni <b>yengil</b> ushlang. Siqib ushlash harakatni sekinlashtiradi.","Hold the cube <b>lightly</b>. Gripping hard slows you down.")}</li>
        <li>${GLOSS.termify(L("Magnitli speedcube va silikon {{lube|moy (lube)}} katta farq qiladi.","A magnetic speedcube and silicone {{lube|lube}} make a big difference."))}</li>
      </ul>
    </div>
  </div>`;
  M.cube=new Cube3D($('metroCube'),{height:window.innerWidth<760?210:250,size:window.innerWidth<760?38:44,state:metroStartState(),dur:()=>Math.min(260,(60000/+$('bpm').value)*0.7)});
  $('metroAlg').onchange=e=>{M.sel=+e.target.value; metroStop(); M.reps=0; M.cube.setState(metroStartState()); drawMetro();};
  $('metroCopy').onclick=e=>copyText(metroItem().alg,e.currentTarget);
  const bpm=$('bpm'); bpm.oninput=()=>{DB.bpm=+bpm.value; save(); $('bpmVal').textContent=bpm.value; $('tps').textContent=(bpm.value/60).toFixed(1); if(M.on){metroStop(true);metroStart();}};
  $('metroBtn').onclick=()=>M.on?metroStop():metroStart();
  drawMetro();
}
const metroToks=()=>tokens(metroItem().alg);
function drawMetro(){ if(!$('metroShow')) return; const t=metroToks(); $('metroShow').innerHTML=t.map((x,k)=>`<span class="${M.on&&k===M.cur?'cur':''}">${x}</span>`).join(''); $('metroReps').textContent=L('Takror','Reps')+': '+M.reps;}
function click(acc){ if(!M.ctx) return; try{const o=M.ctx.createOscillator(), g=M.ctx.createGain(); o.frequency.value=acc?1500:1000; g.gain.setValueAtTime(0.25,M.ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.001,M.ctx.currentTime+0.06); o.connect(g).connect(M.ctx.destination); o.start(); o.stop(M.ctx.currentTime+0.07);}catch(e){} }
function metroStart(){
  try{ M.ctx=M.ctx||new (window.AudioContext||window.webkitAudioContext)(); M.ctx.resume&&M.ctx.resume(); }catch(e){ M.ctx=null; }
  M.on=true; M.i=0; $('metroBtn').innerHTML='■ '+L("To'xtatish",'Stop');
  const iv=60000/+$('bpm').value;
  const tick=()=>{ const t=metroToks(), it=metroItem(), n=t.length+(it.isCase?1:0); // holat formulalarida 1 dam olish zarbi: yig'ilgan kub ko'rinadi
    if(M.i===0 && it.isCase) M.cube.setState(caseState(it.alg,0,0));
    if(M.i<t.length){ M.cur=M.i; click(M.i===0); M.cube.enqueue([t[M.i]],false); } else M.cur=-1;
    drawMetro(); M.i++; if(M.i>=n){M.i=0; M.reps++;} };
  tick(); M.timer=setInterval(tick,iv);
}
function metroStop(keep){ if(M.timer)clearInterval(M.timer); M.timer=null; const was=M.on; M.on=false; const b=$('metroBtn'); if(b)b.innerHTML='▶ '+L('Boshlash','Start');
  if(was && !keep && M.cube){ M.cube.setState(metroStartState()); } drawMetro(); }

// ===================== TIMER (with 3D scramble cube) =====================
let T={state:'idle',start:0,raf:0,holdT:0,inspStart:0,scr:'',cube:null};
function genScramble(){
  const faces=['U','D','L','R','F','B'], axis={U:0,D:0,L:1,R:1,F:2,B:2}, suf=['',"'",'2']; const out=[];
  while(out.length<20){const f=faces[Math.floor(Math.random()*6)]; const n=out.length;
    if(n&&out[n-1][0]===f) continue; if(n>1&&axis[out[n-1][0]]===axis[f]&&out[n-2][0]===f) continue;
    out.push(f+suf[Math.floor(Math.random()*3)]);} return out.join(' ');
}
function showScramble(){ $('scr').textContent=T.scr; const st=apply(solvedCube(SCHEME_WCA),T.scr); if(T.cube) T.cube.setState(st); $('scrNet').innerHTML=netSVG(st,230); }
function newScramble(){T.scr=genScramble(); showScramble();}
function fmt(ms){if(ms==null||!isFinite(ms))return 'DNF'; const s=ms/1000; if(s<60)return s.toFixed(2); const m=Math.floor(s/60); return m+':'+(s-m*60).toFixed(2).padStart(5,'0');}
function avgN(arr,n){if(arr.length<n)return null; const a=arr.slice(-n).map(t=>t.ms).sort((x,y)=>x-y); const cut=Math.ceil(n*0.05)||1; const mid=a.slice(cut,n-cut); return mid.reduce((x,y)=>x+y,0)/mid.length;}
function renderTimes(){
  if(!$('tstat')) return;
  const ts=DB.times; const best=ts.length?Math.min(...ts.map(t=>t.ms)):null; const mean=ts.length?ts.reduce((a,t)=>a+t.ms,0)/ts.length:null;
  const a5=avgN(ts,5), a12=avgN(ts,12);
  $('tstat').innerHTML=`<div><b>${best!=null?fmt(best):'—'}</b><span>${L('Eng yaxshi','Best')}</span></div><div><b>${a5!=null?fmt(a5):'—'}</b><span>ao5</span></div><div><b>${a12!=null?fmt(a12):'—'}</b><span>ao12</span></div><div><b>${mean!=null?fmt(mean):'—'}</b><span>${L("O'rtacha",'Mean')} (${ts.length})</span></div>`;
  $('ttable').innerHTML=ts.length?`<tr><th>#</th><th>${L('Vaqt','Time')}</th><th>${L('Aralashtirish','Scramble')}</th></tr>`+ts.map((t,i)=>`<tr><td class="muted">${i+1}</td><td><b>${fmt(t.ms)}</b></td><td class="muted" style="font-family:var(--mono);font-size:12px">${t.scr} ${copyBtn(t.scr)}</td></tr>`).reverse().join(''):`<tr><td class="muted">${L("Hali yechim yo'q.",'No solves yet.')}</td></tr>`;
}
function setTimerUI(cls,txt,hint){const el=$('timer'); if(!el) return; el.className='timer '+(cls||''); if(txt!=null)$('tdisp').textContent=txt; if(hint!=null)$('thint').textContent=hint;}
const idleHint=()=>window.matchMedia('(pointer:coarse)').matches?L("Bosib turing, qo'yib yuborganda boshlanadi","Press and hold, release to start"):L("Space ni bosib turing, qo'yib yuborganda boshlanadi","Hold Space, release to start");
function renderTimerView(){
  $('v-taymer').innerHTML=`<h1>${L('Taymer','Timer')}</h1>
  <p class="lead">${L("Rasmiy usul: aralashtirishda <b>oq tepada, yashil oldda</b> ushlang. Yechishni boshlashdan oldin kubni ag'darib, oqni pastga qo'ying.","Official orientation: scramble with <b>white on top, green in front</b>. Before solving, flip the cube so white is on the bottom.")}</p>
  <div class="grid g2">
    <div class="grid" style="gap:12px">
      <div class="panel">
        <div class="row" style="justify-content:space-between;margin-bottom:8px"><b>${L('Aralashtirish','Scramble')}</b><div class="row" style="gap:6px"><button class="sm" id="copyScr">⧉ ${L('Nusxa','Copy')}</button><button class="sm" id="newScr">↻ ${L('Yangi','New')}</button></div></div>
        <div class="scramble" id="scr"></div>
        <div class="row" style="justify-content:center;gap:14px;margin-top:12px;align-items:center">
          <div id="scrCube" style="width:230px"></div>
          <div id="scrNet"></div>
        </div>
        <div class="row" style="justify-content:center;margin-top:10px"><button class="sm" id="playScr">▶ ${L("Aralashtirishni ko'rsatish",'Play the scramble')}</button><span class="muted" style="font-size:12.5px">${L("Kubingizni shu bilan solishtiring","Compare it with your cube")}</span></div>
      </div>
      <div class="timer" id="timer"><div class="t" id="tdisp">0.00</div><div class="muted" id="thint" style="margin-top:12px"></div></div>
      <div class="row"><label class="chip"><input type="checkbox" id="insp" ${DB.insp?'checked':''}> ${L("15 soniya ko'zdan kechirish",'15-second inspection')}</label></div>
    </div>
    <div class="panel">
      <div class="stat" id="tstat" style="margin-bottom:12px"></div>
      <div class="times"><table id="ttable"></table></div>
      <div class="row" style="margin-top:10px"><button class="sm" id="delLast">${L("Oxirgisini o'chirish",'Delete last')}</button><button class="sm ghost" id="clrTimes">${L('Hammasini tozalash','Clear all')}</button></div>
      <div class="tip">${L("<b>ao5</b> — oxirgi 5 ta yechimning eng yaxshi va eng yomonini olib tashlab, qolgan 3 tasining o'rtachasi. <b>ao12</b> ham shunday. Kubchilar natijani bitta rekord bilan emas, o'rtacha bilan o'lchaydi.","<b>ao5</b> — the mean of your last 5 solves after dropping the best and worst. <b>ao12</b> works the same way. Cubers measure themselves by averages, not single records.")}</div>
    </div>
  </div>`;
  T.cube=new Cube3D($('scrCube'),{height:220,size:40,scheme:SCHEME_WCA,dur:()=>180});
  if(!T.scr) T.scr=genScramble(); showScramble(); renderTimes(); T.state='idle'; T.inspecting=false; setTimerUI('','0.00',idleHint());
  $('newScr').onclick=newScramble; $('copyScr').onclick=e=>copyText(T.scr,e.currentTarget);
  $('playScr').onclick=()=>{T.cube.setState(solvedCube(SCHEME_WCA)); setTimeout(()=>T.cube.enqueue(tokens(T.scr),false),250);};
  const tEl=$('timer'); tEl.addEventListener('pointerdown',e=>{e.preventDefault(); pressDown();}); tEl.addEventListener('pointerup',e=>{e.preventDefault(); pressUp();});
  $('delLast').onclick=()=>{DB.times.pop(); save(); renderTimes();};
  $('clrTimes').onclick=function(){ if(this.dataset.c){DB.times=[]; save(); renderTimes(); this.textContent=L('Hammasini tozalash','Clear all'); delete this.dataset.c;} else {this.dataset.c=1; this.textContent=L('Tasdiqlash: tozalash','Confirm: clear');} };
  $('insp').onchange=e=>{DB.insp=e.target.checked; save();};
}
function pressDown(){
  if(T.state==='running'){const ms=performance.now()-T.start; cancelAnimationFrame(T.raf); T.state='idle'; DB.times.push({ms:Math.round(ms),scr:T.scr}); save(); setTimerUI('',fmt(ms),idleHint()); renderTimes(); newScramble(); T.justStopped=true; return;}
  if(T.state==='idle' && $('insp').checked && !T.inspecting){ T.inspecting=true; T.inspStart=performance.now(); T.state='insp';
    const loop=()=>{ if(!['insp','hold','ready'].includes(T.state))return; const left=15-Math.floor((performance.now()-T.inspStart)/1000); if(T.state==='insp') setTimerUI('insp',left>0?String(left):'+2',L("Ko'zdan kechiring, keyin bosib turing","Inspect, then press and hold")); T.raf=requestAnimationFrame(loop);}; loop(); T.justStopped=true; return; }
  if(T.state==='idle'||T.state==='insp'){T.prev=T.state; T.state='hold'; setTimerUI('hold',null,L('Ushlab turing…','Keep holding…')); T.holdT=setTimeout(()=>{if(T.state==='hold'){T.state='ready'; setTimerUI('ready','0.00',L("Qo'yib yuboring!",'Release!'));}},300);}
}
function pressUp(){
  if(T.justStopped){T.justStopped=false; return;}
  if(T.state==='hold'){clearTimeout(T.holdT); T.state=T.prev==='insp'?'insp':'idle'; if(T.state==='idle')setTimerUI('',null,idleHint());}
  else if(T.state==='ready'){T.state='running'; T.inspecting=false; T.start=performance.now(); setTimerUI('','0.00',L("Istalgan tugmani bosib to'xtating",'Press any key to stop'));
    const loop=()=>{ if(T.state!=='running')return; $('tdisp').textContent=fmt(performance.now()-T.start); T.raf=requestAnimationFrame(loop);}; loop();}
}

// ===================== SIMULATOR DRAWER =====================
const SIM={cube:null,st:null,hist:[]};
function renderSimDrawer(){
  if(SIM.cube){SIM.st=SIM.cube.st; SIM.hist=SIM.cube.hist; SIM.cube.halt();}
  const faces=['R','L','U','D','F','B','M','x','y','z'];
  $('sim').innerHTML=`<div class="sim-head"><b>🧊 ${L('Simulyator','Simulator')}</b><span id="simStatus"></span><button class="sm ghost" id="simClose" style="margin-left:auto">✕</button></div>
  <div id="simCube"></div>
  <div class="muted" style="font-size:12.5px">${L("Aylantirish uchun sudrang","Drag to rotate")}</div>
  <div class="mgrid">${['',"'",'2'].map(sf=>faces.map(f=>`<button data-mv="${f+sf}">${f+sf}</button>`).join('')).join('')}</div>
  <div class="row" style="flex-wrap:nowrap;gap:6px"><input type="text" class="txt" id="simAlg" placeholder="${L('Formula','Algorithm')}: R U R' U'" autocomplete="off" spellcheck="false"><button class="icon" id="simCopy" title="${L('Nusxa olish','Copy')}">⧉</button><button class="primary sm" id="simRun">▶ ${L('Bajarish','Run')}</button></div>
  <div class="row" style="gap:6px">
    <button class="sm" id="simSetup" title="${L('Shu formula yechadigan holatni yaratadi','Creates the state this algorithm solves')}">${L("Holatni o'rnatish",'Set up case')}</button>
    <button class="sm" id="simScr">${L('Aralashtirish','Scramble')}</button>
    <button class="sm" id="simUndo">↶ ${L('Orqaga','Undo')}</button>
    <button class="sm" id="simReset">${L('Tiklash','Reset')}</button>
  </div>
  <div class="row"><span class="muted" style="font-size:13px">${L('Animatsiya','Animation')}:</span><input type="range" id="simSpeed" min="0" max="500" step="20" value="${DB.simSpeed!=null?DB.simSpeed:200}" style="width:160px"><span class="muted" style="font-size:13px" id="simSpeedVal"></span></div>
  <div id="simMsg" style="font-size:13px;min-height:18px"></div>
  <div><div class="row" style="justify-content:space-between"><span class="muted" style="font-size:12px;text-transform:uppercase;letter-spacing:.05em">${L('Harakatlar tarixi','Move history')}</span><button class="icon ghost" id="histCopy" title="${L('Nusxa olish','Copy')}">⧉</button></div><div class="hist" id="simHist">—</div></div>
  <div class="tip" style="font-size:13px;margin:0">${L("<b>Holatni o'rnatish</b> — formula yechadigan holatni yaratadi: avval o'zingiz yechib ko'ring, keyin <b>Bajarish</b> bilan tekshiring.<br>Klaviatura:","<b>Set up case</b> creates the state the algorithm solves: try solving it yourself first, then check with <b>Run</b>.<br>Keyboard:")} <kbd>R</kbd> <kbd>L</kbd> <kbd>U</kbd> <kbd>D</kbd> <kbd>F</kbd> <kbd>B</kbd> <kbd>M</kbd> <kbd>E</kbd> <kbd>S</kbd>, <kbd>X</kbd> <kbd>Y</kbd> <kbd>Z</kbd> — ${L('butun kub','whole cube')}; <kbd>Shift</kbd> — ${L("teskari (')","inverse (')")}.</div>`;
  SIM.cube=new Cube3D($('simCube'),{height:260,size:46,state:SIM.st||solvedCube(),hist:SIM.hist,dur:()=>+$('simSpeed').value,onChange:simInfo});
  $('sim').querySelector('.mgrid').onclick=e=>{const b=e.target.closest('[data-mv]'); if(b) SIM.cube.enqueue([b.dataset.mv]);};
  $('simClose').onclick=simClose;
  $('simRun').onclick=()=>{const t=simParse(); if(t){simMsg(''); SIM.cube.enqueue(t);}};
  $('simAlg').addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault(); $('simRun').click();}});
  $('simCopy').onclick=e=>{const v=$('simAlg').value.trim(); if(v) copyText(v,e.currentTarget);};
  $('histCopy').onclick=e=>{ if(SIM.cube.hist.length) copyText(SIM.cube.hist.join(' '),e.currentTarget);};
  $('simSetup').onclick=()=>{const t=simParse(); if(t) simLoad(t.join(' '));};
  $('simScr').onclick=()=>{const sc=genScramble(); SIM.cube.hist.length=0; SIM.cube.setState(apply(solvedCube(),sc)); $('simAlg').value=sc; simMsg(L('Aralashtirildi','Scrambled')+': '+sc);};
  $('simReset').onclick=()=>{SIM.cube.hist.length=0; SIM.cube.setState(solvedCube()); simMsg('');};
  $('simUndo').onclick=()=>{ if(SIM.cube.busy||SIM.cube.queue.length) return; const t=SIM.cube.hist.pop(); if(!t) return; SIM.cube.enqueue([invert(t)],false); };
  const sp=$('simSpeed'); const spv=()=>$('simSpeedVal').textContent=sp.value==='0'?L('darhol','instant'):(sp.value/1000).toFixed(2)+' s';
  sp.oninput=()=>{DB.simSpeed=+sp.value; save(); spv();}; spv();
}
function simInfo(cube){
  if(!$('simStatus')) return;
  $('simStatus').innerHTML=cube.solved()?`<span class="solved">${L("Yig'ilgan ✓",'Solved ✓')}</span>`:'';
  const hs=cube.hist.slice(-40); $('simHist').textContent=hs.length?(cube.hist.length>40?'… ':'')+hs.join(' '):'—';
}
function simMsg(t,bad){const el=$('simMsg'); el.textContent=t||''; el.style.color=bad?'var(--bad)':'var(--muted)';}
function simParse(){const v=$('simAlg').value.trim(); if(!v){simMsg(L('Avval formula yozing.','Type an algorithm first.'),true); return null;}
  const t=tokens(v); const bad=t.find(x=>{try{parseTok(x);return false;}catch(_){return true;}});
  if(bad){simMsg(L('Tushunarsiz harakat','Unknown move')+': '+bad,true); return null;} return t;}
function simOpen(){document.body.classList.add('sim-open'); DB.simOpen=true; save();}
function simClose(){document.body.classList.remove('sim-open'); DB.simOpen=false; save();}
function simLoad(alg){SIM.cube.hist.length=0; SIM.cube.setState(caseState(alg,0,0)); $('simAlg').value=alg; simOpen(); simMsg(L("Holat o'rnatildi. O'zingiz yechib ko'ring yoki ▶ Bajarish'ni bosing.","Case set up. Solve it yourself, or press ▶ Run."));}


// ===================== SOLVER (Yechuvchi) =====================
const SFACES=['U','F','R','B','L','D'];
const FNM={U:['Tepa','Up'],F:['Old','Front'],R:["O'ng",'Right'],B:['Orqa','Back'],L:['Chap','Left'],D:['Past','Down']};
const CNM={Y:['sariq','yellow'],W:['oq','white'],G:['yashil','green'],B:["ko'k",'blue'],R:['qizil','red'],O:["to'q sariq",'orange']};
const FN={U:[0,1,0],D:[0,-1,0],R:[1,0,0],L:[-1,0,0],F:[0,0,1],B:[0,0,-1]};
const HOLD={
 U:["Ko'k markaz sizga qarab tursin, kubni biroz egib <b>tepasiga</b> qarang. Rasmning pastki qatori — ko'k tomonga tegib turgan qator.","Keep blue facing you and tilt the cube to look at the <b>top</b>. The bottom row here is the row next to blue."],
 F:["Sariq tepada, <b>ko'k</b> markaz sizga qaragan holda ushlang.","Yellow on top, <b>blue</b> center facing you."],
 R:["Sariq tepada qolsin. Kubni chapga burib, <b>qizil</b> markazni o'zingizga qarating (ko'k chapda bo'ladi).","Keep yellow on top. Turn the cube left so <b>red</b> faces you (blue ends up on the left)."],
 B:["Sariq tepada. Kubni yana chapga burib, <b>yashil</b> markazni o'zingizga qarating (qizil chapda).","Yellow on top. Turn left again so <b>green</b> faces you (red on the left)."],
 L:["Sariq tepada, <b>to'q sariq</b> markaz sizga qaragan (ko'k o'ng tomonda).","Yellow on top, <b>orange</b> center facing you (blue on the right)."],
 D:["Ko'k sizga qaragan holda kubni oldinga ag'daring: <b>oq</b> tomon sizga qaraydi, ko'k tepaga chiqadi. Rasmning yuqori qatori — ko'k tomonga tegib turgan qator.","With blue facing you, tip the cube forward: <b>white</b> faces you and blue goes to the top. The top row here is the row next to blue."]};
function facePos(f,r,c){switch(f){case 'U':return[c-1,1,r-1];case 'F':return[c-1,1-r,1];case 'R':return[1,1-r,1-c];case 'B':return[1-c,1-r,-1];case 'L':return[-1,1-r,c-1];default:return[c-1,-1,1-r];}}
function blankInput(){const o={};SFACES.forEach(f=>{o[f]=Array(9).fill(null);o[f][4]=SCHEME_LL[f];});return o;}
function inpToStickers(inp){const st=[];SFACES.forEach(f=>{for(let r=0;r<3;r++)for(let c=0;c<3;c++){const p=facePos(f,r,c);st.push({p,n:FN[f].slice(),c:inp[f][r*3+c],h:p.slice()});}});return st;}
function stickersToInp(st){const o=blankInput();SFACES.forEach(f=>{for(let r=0;r<3;r++)for(let c=0;c<3;c++){const t=stk(st,facePos(f,r,c),FN[f]);o[f][r*3+c]=t?t.c:null;}});return o;}
let SV={face:'U',color:'Y',inp:(DB.solverInp&&DB.solverInp.U&&DB.solverInp.F[4]===SCHEME_LL.F)?DB.solverInp:blankInput(),mode:DB.solverMode||'cfop',res:null,cube:null,start:null,toks:[],segs:[],i:0,play:null,busy:false};
function saveInp(){DB.solverInp=SV.inp; save(); if(SV.res){SV.res=null; svStop(); svOut('');}}
// --- worker ---
let SWK=null, swId=0; const swCb={};
function getWorker(){ if(SWK!==null) return SWK;
  try{ SWK=new Worker('js/cube3/solver.worker.js');
    SWK.onmessage=e=>{const cb=swCb[e.data.id]; delete swCb[e.data.id]; if(cb) cb(e.data);};
    SWK.onerror=()=>{ SWK=false; Object.keys(swCb).forEach(k=>{const cb=swCb[k]; delete swCb[k]; mainThreadCall(cb._msg,cb);}); };
  }catch(e){ SWK=false; }
  return SWK;
}
function mainThreadCall(msg,res){ const run=()=>{ try{ res(SOLVER_HANDLE(msg)); }catch(e){ res({error:'crash',msg:String(e)}); } };
  if(typeof SOLVER_HANDLE!=='undefined'){ setTimeout(run,30); return; }
  const sc=document.createElement('script'); sc.src='js/cube3/solver.worker.js'; sc.onload=run; sc.onerror=()=>res({error:'crash'}); document.head.appendChild(sc); }
function solverCall(msg){ return new Promise(res=>{ const w=getWorker(); const id=++swId; msg=Object.assign({id},msg);
  if(!w){ mainThreadCall(msg,res); return; } res._msg=msg; swCb[id]=res; w.postMessage(msg); }); }
let warmed=false; function warmSolver(){ if(warmed) return; warmed=true; solverCall({cmd:'init'}).then(()=>{SV.ready=true; const el=$('svReady'); if(el) el.textContent='';}); }
// --- last layer (2-look OLL + 1-look PLL) on sticker model ---
const AUFS=['',"U","U2","U'"];
function centerC(st,n){return stk(st,n,n).c;}
function llUDone(st){const y=centerC(st,[0,1,0]);for(let x=-1;x<=1;x++)for(let z=-1;z<=1;z++)if(stk(st,[x,1,z],[0,1,0]).c!==y)return false;return true;}
function llEdgesDone(st){const y=centerC(st,[0,1,0]);return [[1,1,0],[-1,1,0],[0,1,1],[0,1,-1]].every(p=>stk(st,p,[0,1,0]).c===y);}
function isSolvedSt(st){const g={};for(const t of st){const k=t.n.join();if(g[k]===undefined)g[k]=t.c;else if(g[k]!==t.c)return false;}return true;}
function solvedAUF(st){for(let k=0;k<4;k++){const s=cloneSt(st);if(k)apply(s,AUFS[k]);if(isSolvedSt(s))return k;}return -1;}
function solveLL(st){
  const steps=[]; let cur=cloneSt(st);
  const pick=(keys,pred)=>{let best=null;for(const k of keys)for(const c of SETS[k].cases)for(let a=0;a<4;a++){const s=cloneSt(cur);if(a)apply(s,AUFS[a]);apply(s,c.alg);if(pred(s)){const len=(a?1:0)+tokens(c.alg).length;if(!best||len<best.len)best={k,c,a,len,s};}}return best;};
  const add=(type,b)=>{steps.push({type,k:b.k,c:b.c,moves:tokens((b.a?AUFS[b.a]+' ':'')+b.c.alg)}); cur=b.s;};
  if(!llEdgesDone(cur)){const b=pick(['oll1'],llEdgesDone); if(!b) return null; add('oll1',b);}
  if(!llUDone(cur)){const b=pick(['oll2'],llUDone); if(!b) return null; add('oll2',b);}
  if(solvedAUF(cur)<0){const b=pick(['pll1','pll2'],s=>solvedAUF(s)>=0); if(!b) return null; add('pll',b);}
  const k=solvedAUF(cur); if(k>0) steps.push({type:'auf',moves:[AUFS[k]]});
  return steps;
}
const PAIRNM=[["ko'k–qizil","blue–red"],["ko'k–to'q sariq","blue–orange"],["yashil–to'q sariq","green–orange"],["yashil–qizil","green–red"]];
const SLOTNM=[["old-o'ng","front-right"],["old-chap","front-left"],["orqa-chap","back-left"],["orqa-o'ng","back-right"]];
function posNm(code){return code.split('').map(f=>L(...FNM[f]).toLowerCase()).join('–');}
function solverErr(r){
  const cols=r.cols?r.cols.map(c=>L(...CNM[c])).join(', '):'';
  return ({corner:L(`<b>${posNm(r.pos||'')}</b> burchagida bunday ranglar birikmasi yo'q (${cols}). Shu atrofdagi stikerlarni tekshiring.`,`The <b>${posNm(r.pos||'')}</b> corner has an impossible colour combination (${cols}). Check the stickers around it.`),
    edge:L(`<b>${posNm(r.pos||'')}</b> qirrasida bunday ranglar birikmasi yo'q (${cols}). Shu atrofdagi stikerlarni tekshiring.`,`The <b>${posNm(r.pos||'')}</b> edge has an impossible colour combination (${cols}). Check the stickers around it.`),
    dupCorner:L("Bir xil burchak ikki marta uchrayapti — qaysidir stiker noto'g'ri kiritilgan.","The same corner appears twice — a sticker is wrong."),
    dupEdge:L("Bir xil qirra ikki marta uchrayapti — qaysidir stiker noto'g'ri kiritilgan.","The same edge appears twice — a sticker is wrong."),
    twist:L("Bitta burchak buralgan holatda: bunday holatni yig'ib bo'lmaydi. Stikerlarni tekshiring (yoki kub ochilib noto'g'ri yig'ilgan).","One corner is twisted: this state can't be solved. Check the stickers (or the cube was reassembled wrong)."),
    flip:L("Bitta qirra teskari aylangan: bunday holatni yig'ib bo'lmaydi. Stikerlarni tekshiring.","One edge is flipped: this state can't be solved. Check the stickers."),
    parity:L("Ikki bo'lak o'rni almashgan: bunday holatni yig'ib bo'lmaydi. Stikerlarni tekshiring.","Two pieces are swapped: this state can't be solved. Check the stickers."),
    crash:L("Ichki xato yuz berdi.","Internal error.")})[r.error]||r.error;
}
function renderSolverView(){
  $('v-yechuvchi').innerHTML=`<h1>${L("Yechuvchi","Solver")}</h1>
  <p class="lead">${L("Kubingiz ranglarini kiriting — dastur holatni tekshiradi va yechimni topadi: eng qisqa (~20 harakat) yoki CFOP bo'yicha qadamma-qadam (Krest (X) → F2L → OLL → PLL).","Enter your cube's colours — the solver checks the state and finds a solution: the shortest (~20 moves) or step by step with CFOP (Cross → F2L → OLL → PLL).")}</p>
  <div class="grid g2">
   <div class="panel" style="display:flex;flex-direction:column;gap:12px">
     <div class="ftabs" id="svTabs"></div>
     <div class="tip" style="margin:0;font-size:13.5px" id="svHold"></div>
     <div class="fgrid" id="svGrid"></div>
     <div class="palette" id="svPal"></div>
     <div class="counts" id="svCounts"></div>
     <div class="row" style="justify-content:center;gap:6px">
       <button class="sm" id="svFromSim">🧊 ${L("Simulyatordan olish","From simulator")}</button>
       <button class="sm" id="svRandom">🎲 ${L("Tasodifiy","Random")}</button>
       <button class="sm ghost" id="svClear">${L("Tozalash","Clear")}</button>
     </div>
     <div id="svNet" style="display:flex;justify-content:center"></div>
   </div>
   <div class="panel" style="display:flex;flex-direction:column;gap:12px">
     <div class="row"><b>${L("Yechim turi","Solution type")}:</b>
       <label class="chip"><input type="radio" name="svmode" value="cfop" ${SV.mode==='cfop'?'checked':''}> CFOP ${L("qadamma-qadam","step by step")}</label>
       <label class="chip"><input type="radio" name="svmode" value="short" ${SV.mode==='short'?'checked':''}> ${L("Eng qisqa","Shortest")} (~20)</label></div>
     <button class="primary" id="svSolve" style="font-size:16px;padding:12px">🧩 ${L("Yechimni topish","Find solution")}</button>
     <div class="muted" style="font-size:12.5px" id="svReady">${SV.ready?'':L("Birinchi marta jadvallar tayyorlanadi (telefonda 2–4 soniya).","The first run prepares lookup tables (2–4 s on a phone).")}</div>
     <div id="svOut"></div>
   </div>
  </div>`;
  document.querySelectorAll('input[name=svmode]').forEach(r=>r.onchange=()=>{SV.mode=r.value; DB.solverMode=r.value; save(); if(SV.res) showSolution();});
  $('svSolve').onclick=runSolve;
  $('svFromSim').onclick=()=>{const st=SIM.cube.st; const ok=SFACES.every(f=>centerC(st,FN[f])===SCHEME_LL[f]);
    if(!ok){svOut(`<div class="err">${L("Simulyatordagi kub butunicha aylantirilgan (x/y/z). Sariq tepada, ko'k oldda bo'lishi kerak.","The simulator cube has been rotated (x/y/z). Yellow must be on top and blue in front.")}</div>`); return;}
    SV.inp=stickersToInp(st); saveInp(); drawEditor(); svOut('');};
  $('svRandom').onclick=()=>{SV.inp=stickersToInp(apply(solvedCube(),genScramble())); saveInp(); drawEditor(); svOut('');};
  $('svClear').onclick=()=>{SV.inp=blankInput(); saveInp(); drawEditor(); svOut('');};
  drawEditor();
  if(SV.res) showSolution();
}
function svOut(h){const o=$('svOut'); if(o) o.innerHTML=h;}
function counts(){const c={Y:0,W:0,G:0,B:0,R:0,O:0},miss=[0];SFACES.forEach(f=>SV.inp[f].forEach(v=>{if(v)c[v]++;else miss[0]++;}));return {c,miss:miss[0]};}
function drawEditor(){
  if(!$('svTabs')) return;
  $('svTabs').innerHTML=SFACES.map(f=>{const done=SV.inp[f].every(v=>v);return `<button class="${SV.face===f?'on':''}" data-face="${f}"><span class="sw" style="background:${HEX[SCHEME_LL[f]]}"></span>${L(...FNM[f])}${done?'<span class="ok">✓</span>':''}</button>`;}).join('');
  $('svTabs').querySelectorAll('[data-face]').forEach(b=>b.onclick=()=>{SV.face=b.dataset.face; drawEditor();});
  $('svHold').innerHTML='✋ '+L(...HOLD[SV.face]);
  $('svGrid').innerHTML=SV.inp[SV.face].map((v,i)=>`<button data-si="${i}" class="${i===4?'cen':''}" style="background:${v?HEX[v]:'var(--gray)'}">${v?'':'?'}</button>`).join('');
  $('svGrid').querySelectorAll('[data-si]').forEach(b=>b.onclick=()=>{const i=+b.dataset.si; if(i===4) return; SV.inp[SV.face][i]=SV.inp[SV.face][i]===SV.color?null:SV.color; saveInp(); drawEditor();});
  $('svPal').innerHTML=['Y','W','G','B','R','O'].map(c=>`<button data-col="${c}" class="${SV.color===c?'on':''}" style="background:${HEX[c]}" title="${L(...CNM[c])}"></button>`).join('');
  $('svPal').querySelectorAll('[data-col]').forEach(b=>b.onclick=()=>{SV.color=b.dataset.col; drawEditor();});
  const {c,miss}=counts();
  $('svCounts').innerHTML=Object.keys(c).map(k=>`<span class="${c[k]>9?'bad':''}">${L(...CNM[k])}: ${c[k]}/9</span>`).join('')+(miss?`<span>${L("Bo'sh",'Empty')}: ${miss}</span>`:'');
  $('svNet').innerHTML=miniNet();
  $('svNet').querySelectorAll('[data-nf]').forEach(g=>g.onclick=()=>{SV.face=g.dataset.nf; drawEditor();});
}
function miniNet(){const u=14,fw=3*u+4,pos={U:[1,0],L:[0,1],F:[1,1],R:[2,1],B:[3,1],D:[1,2]};
  let s=`<svg class="netmini" viewBox="0 0 ${4*fw} ${3*fw}" width="${4*fw*1.2}" height="${3*fw*1.2}">`;
  SFACES.forEach(f=>{const[fx,fy]=pos[f]; s+=`<g data-nf="${f}"><rect x="${fx*fw}" y="${fy*fw}" width="${3*u+2}" height="${3*u+2}" rx="3" fill="${SV.face===f?'var(--accent)':'#111'}"/>`;
    SV.inp[f].forEach((v,i)=>{const r=(i/3)|0,c=i%3; s+=`<rect x="${fx*fw+1+c*u+1}" y="${fy*fw+1+r*u+1}" width="${u-2}" height="${u-2}" rx="2" fill="${v?HEX[v]:'#666'}"/>`;}); s+='</g>';});
  return s+'</svg>';}
async function runSolve(){
  const {c,miss}=counts();
  if(miss){svOut(`<div class="err">${L(`Hali ${miss} ta stiker bo'yalmagan. Har bir tomonni to'ldiring (✓ belgisi to'liq tomonni bildiradi).`,`${miss} stickers are still empty. Fill in every face (✓ marks a complete face).`)}</div>`); return;}
  const bad=Object.keys(c).filter(k=>c[k]!==9);
  if(bad.length){svOut(`<div class="err">${L("Har bir rangdan 9 tadan bo'lishi kerak:","Each colour must appear exactly 9 times:")} ${bad.map(k=>`${L(...CNM[k])} — ${c[k]}`).join(', ')}</div>`); return;}
  if(SV.busy) return; SV.busy=true;
  svOut(`<div class="muted">⏳ ${L("Hisoblanmoqda…","Solving…")}</div>`); $('svSolve').disabled=true;
  const start=inpToStickers(SV.inp);
  const r=await solverCall({cmd:'solve',st:start.map(t=>({p:t.p,n:t.n,c:t.c}))});
  SV.busy=false; if($('svSolve')) $('svSolve').disabled=false; SV.ready=true; if($('svReady')) $('svReady').textContent='';
  if(r.error){ SV.res=null; svOut(`<div class="err">${solverErr(r)}</div>`); return; }
  // CFOP: Krest + F2L from worker, then OLL/PLL here
  const cfop=[]; const st=cloneSt(start);
  if(r.cfop && !r.cfop.error){
    r.cfop.steps.forEach(sp=>{ if(sp.type==='cross') cfop.push({title:L('Krest (X)','Cross'),sub:L('oq krest pastda','white cross on the bottom'),moves:sp.moves});
      else cfop.push({title:'F2L',sub:L(`${PAIRNM[sp.pair][0]} jufti → ${SLOTNM[sp.pair][0]} slot`,`${PAIRNM[sp.pair][1]} pair → ${SLOTNM[sp.pair][1]} slot`),moves:sp.moves}); apply(st,sp.moves.join(' ')); });
    const ll=solveLL(st);
    if(ll) ll.forEach(sp=>{ if(sp.type==='oll1') cfop.push({title:L('OLL krest','OLL cross'),sub:NM(sp.c),moves:sp.moves,setKey:sp.k,caseId:sp.c.id});
      else if(sp.type==='oll2') cfop.push({title:'OLL',sub:NM(sp.c),moves:sp.moves,setKey:sp.k,caseId:sp.c.id});
      else if(sp.type==='pll') cfop.push({title:'PLL',sub:NM(sp.c),moves:sp.moves,setKey:sp.k,caseId:sp.c.id});
      else cfop.push({title:'AUF',sub:L("tepani to'g'irlash","align the top layer"),moves:sp.moves}); });
  }
  SV.res={start, short:r.short?[{title:L('Eng qisqa yechim','Shortest solution'),sub:r.short.length+' '+L('harakat','moves'),moves:r.short}]:[], cfop};
  showSolution();
}
function showSolution(){
  const segs=(SV.mode==='short'?SV.res.short:SV.res.cfop).filter(sg=>sg.moves.length);
  SV.segs=[]; SV.toks=[]; segs.forEach(sg=>{SV.segs.push({...sg,from:SV.toks.length}); SV.toks.push(...sg.moves);});
  SV.segs.forEach(sg=>sg.to=sg.from+sg.moves.length);
  const total=SV.toks.length;
  svOut(total===0?`<div class="tip" style="margin:0">${L("Kub allaqachon yig'ilgan ✓","The cube is already solved ✓")}</div>`:`
   <div class="row" style="justify-content:space-between"><b>${L('Jami','Total')}: ${total} ${L('harakat','moves')}</b>
     <div class="row" style="gap:6px"><button class="sm" data-copy="${SV.toks.join(' ')}">⧉ ${L('Nusxa','Copy')}</button><button class="sm" id="svToSim">🧊 ${L('Simulyatorda','In simulator')}</button></div></div>
   <div id="svCube"></div>
   <div class="tokens" id="svToks" style="max-height:110px;overflow:auto"></div>
   <div class="row" style="justify-content:center;gap:6px"><button id="svFirst">⏮</button><button id="svPrev">◀</button><button class="primary" id="svPlay">▶ ${L("O'ynash",'Play')}</button><button id="svNext">▶|</button><button id="svLast">⏭</button></div>
   <div class="steps" id="svSteps">${SV.segs.map((sg,i)=>`<div class="step" data-seg="${i}"><span class="num">${i+1}</span><div class="seg"><b>${sg.title}</b> <span class="muted">· ${sg.sub}</span><div class="alg" style="margin-top:4px;font-size:13px">${sg.moves.join(' ')}</div></div></div>`).join('')}</div>`);
  if(!total) return;
  SV.start=SV.res.start; SV.cube=new Cube3D($('svCube'),{height:240,size:40,state:cloneSt(SV.start),dur:()=>260});
  svSet(0);
  $('svFirst').onclick=()=>svSet(0); $('svLast').onclick=()=>svSet(SV.toks.length);
  $('svNext').onclick=svNext; $('svPrev').onclick=svPrev; $('svPlay').onclick=()=>SV.play?svStop():svPlayTo(SV.toks.length);
  $('svToSim').onclick=()=>{SIM.cube.hist.length=0; SIM.cube.setState(cloneSt(SV.start)); $('simAlg').value=SV.toks.join(' '); simOpen(); simMsg(L("Holat yuklandi. ▶ Bajarish yechimni o'ynaydi.","State loaded. ▶ Run plays the solution."));};
  $('svSteps').querySelectorAll('[data-seg]').forEach(el=>el.onclick=()=>{const sg=SV.segs[+el.dataset.seg]; svSet(sg.from); svPlayTo(sg.to);});
}
function svSet(i){svStop(); SV.i=i; const st=cloneSt(SV.start); if(i) apply(st,SV.toks.slice(0,i).join(' ')); SV.cube.setState(st); svDraw();}
function svNext(){ if(SV.i>=SV.toks.length||SV.cube.busy) return; SV.cube.enqueue([SV.toks[SV.i]],false); SV.i++; svDraw(); }
function svPrev(){ svStop(); if(SV.i<=0||SV.cube.busy) return; SV.i--; SV.cube.enqueue([invert(SV.toks[SV.i])],false); svDraw(); }
function svPlayTo(end){ svStop(); SV.end=end; $('svPlay').innerHTML='■ '+L("To'xtatish",'Stop');
  SV.play=setInterval(()=>{ if(!SV.cube||SV.cube.busy) return; if(SV.i>=SV.end){svStop(); return;} svNext(); },40); }
function svStop(){ if(SV.play){clearInterval(SV.play); SV.play=null;} const b=$('svPlay'); if(b) b.innerHTML='▶ '+L("O'ynash",'Play'); }
function svDraw(){ const el=$('svToks'); if(!el) return;
  el.innerHTML=SV.toks.map((t,k)=>`<span class="${k<SV.i?'done':k===SV.i?'cur':''}">${t}</span>`).join('');
  const cur=el.querySelector('.cur'); if(cur) cur.scrollIntoView({block:'nearest'});
  document.querySelectorAll('#svSteps [data-seg]').forEach(s=>{const sg=SV.segs[+s.dataset.seg]; s.classList.toggle('cur',SV.i>=sg.from&&SV.i<sg.to);}); }

// ===================== GLOBAL EVENTS =====================
document.addEventListener('click',e=>{
  const cp=e.target.closest('[data-copy]'); if(cp){copyText(cp.dataset.copy,cp); return;}
  const gt=e.target.closest('[data-goto]'); if(gt){LESSON_LV='start'; renderLessons3(); location.hash='#darslar'; setTimeout(()=>{const el=$(gt.dataset.goto)||$('ls-hands'); if(el) el.scrollIntoView({behavior:'smooth',block:'start'});},80); return;}
  const fp=e.target.closest('[data-fplay]'); if(fp){playFinger(fp.dataset.fplay); return;}
  const j=e.target.closest('[data-jump]'); if(j){$(j.dataset.jump).scrollIntoView({behavior:'smooth',block:'start'}); return;}
  const sm=e.target.closest('[data-sim]'); if(sm){simLoad(sm.dataset.sim); return;}
  const b=e.target.closest('[data-step]'); if(b){const[k,id]=b.dataset.step.split('|'); openStepper(k,SETS[k].cases.find(c=>c.id===id));}
});
document.addEventListener('keydown',e=>{
  // stepper
  if(STEP){ if(e.key==='Escape')closeModal(); if(e.key==='ArrowRight'){STEP.i=Math.min(STEP.toks.length,STEP.i+1);drawStepper();} if(e.key==='ArrowLeft'){STEP.i=Math.max(0,STEP.i-1);drawStepper();} return; }
  const inField=['INPUT','SELECT','TEXTAREA'].includes(e.target.tagName)&&e.target.type!=='checkbox'&&e.target.type!=='radio';
  const view=curView();
  // timer
  if(view==='taymer' && !e.repeat && !inField){ if(e.key===' '||T.state==='running'){e.preventDefault(); pressDown(); return;} }
  // drill
  if(view==='mashq' && CUR && !inField){
    if(CUR.answered && e.key==='Enter' && mode()==='rec'){e.preventDefault(); nextCase(); return;}
    if(mode()==='alg'){
      if(!CUR.answered && e.key===' '){e.preventDefault(); reveal(); return;}
      if(CUR.answered && e.key==='1'){record(true,CUR.ms); nextCase(); return;}
      if(CUR.answered && e.key==='2'){record(false,0); nextCase(); return;}
    }
  }
  // simulator keys
  if(document.body.classList.contains('sim-open') && !inField && !e.ctrlKey && !e.metaKey && !e.altKey && !e.repeat){
    const k=e.key.length===1?e.key.toLowerCase():''; let f=null;
    if(k && 'rludfbmes'.includes(k)) f=k.toUpperCase(); else if(k && 'xyz'.includes(k)) f=k;
    if(f){ e.preventDefault(); SIM.cube.enqueue([f+(e.shiftKey?"'":'')]); }
  }
});
document.addEventListener('keyup',e=>{ if(curView()!=='taymer') return; if(e.key===' '||T.justStopped){e.preventDefault(); pressUp();} });
$('langBtn').onclick=()=>{ if(T.state==='running') return; DB.lang=DB.lang==='en'?'uz':'en'; save(); renderAll(); };
$('themeBtn').onclick=()=>{DB.theme=curTheme()==='dark'?'light':'dark'; save(); applyTheme();};
$('simBtn').onclick=()=>document.body.classList.contains('sim-open')?simClose():simOpen();

// ===================== INIT =====================
function renderAll(){
  svStop(); renderHeader(); renderLessons3(); renderExamHome3(); renderMashqShell(); renderDrillView(); renderHandsView(); renderSolverView(); renderTimerView(); renderSimDrawer(); showSub();
  if(STEP) drawStepper();
  VIEWS.forEach(k=>$('v-'+k).classList.toggle('on',k===curView()));
}
renderAll();
if(DB.simOpen && window.innerWidth>=900) simOpen();
route();
