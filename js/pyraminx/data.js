// ===== Pyraminx content: levels, tasks, case naming =====
const PLEVELS=[
 {id:1,color:'var(--lv1)',name:["Boshlang'ich","Beginner"],method:["Qatlamma-qatlam (LBL)","Layer by layer (LBL)"],goal:["30–60 s","30–60 s"],
  intro:["Har qanday holatni ishonch bilan yechishni o'rganasiz. Formulalar kam, asosiy narsa — tushunish.","Learn to solve any scramble with confidence. Few algorithms — the point is understanding."],
  steps:[
   [["Notatsiya","Notation"],["<b>U L R B</b> — shu uchdagi katta qatlamni 120° soat yo'nalishida burish (uchga tashqaridan qaraganda). <b>'</b> — teskari. Kichik harf (<b>u l r b</b>) — faqat uchning o'zi.","<b>U L R B</b> turn the big layer at that tip 120° clockwise (looking at the tip from outside). <b>'</b> means counter-clockwise. Lowercase (<b>u l r b</b>) turns only the tip."]],
   [["Uchlar","Tips"],["Har bir uchni uning ostidagi markaz ranglariga moslab buring (u, l, r, b). Bu eng oson qadam — har biri bitta harakat.","Turn each tip to match the centre right below it (u, l, r, b). The easiest step — one move each."]],
   [["Markazlar","Centres"],["Pastki rangni tanlang (masalan, sariq). L, R va B bilan uchta markazni shunday buringki, ularning sariq stikeri pastga qarasin.","Pick a bottom colour (e.g. yellow). Use L, R and B so the three centres show yellow on the bottom."]],
   [["Birinchi qatlam","First layer"],["Sariq rangli 3 ta qirrani pastga, yon ranglari markazlarga mos holda qo'ying. Qirrani tepaga chiqaring, kerakli joy ustiga U bilan olib keling va <code>R' U' R</code> yoki <code>L U L'</code> bilan tushiring.","Place the 3 yellow edges on the bottom matching the side centres. Bring an edge to the top, move it over its slot with U, and insert it with <code>R' U' R</code> or <code>L U L'</code>."]],
   [["Oxirgi qatlam","Last layer"],["Tepa markazni U bilan to'g'irlang, keyin quyidagi 11 holatdan birini tanib formulani bajaring.","Align the top centre with U, then recognise one of the 11 cases below and run its algorithm."]]],
  lib:'LL',
  tasks:[["Notatsiyani o'rganing va simulyatorda har bir harakatni sinab ko'ring","Learn the notation and try every move in the simulator"],["Uchlar va markazlarni 10 marta ketma-ket xatosiz yig'ing","Solve tips and centres 10 times in a row without mistakes"],["Birinchi qatlamni formulasiz, tushunib yig'ing","Build the first layer intuitively, without algorithms"],["Oxirgi qatlam: 11 holatni tanib olish mashqida 90% aniqlikka chiqing","Last layer: reach 90% accuracy on the 11 cases in the drill"],["Taymerda 5 ta to'liq yechim — 1 daqiqadan kam","5 full solves on the timer — under 1 minute"]]},
 {id:2,color:'var(--lv2)',name:["O'rta","Intermediate"],method:["Keyhole","Keyhole"],goal:["15–20 s","15–20 s"],
  intro:["Kamroq harakat bilan birinchi qatlam. Formulalar o'sha 11 ta, lekin qatlam ancha tez quriladi.","A faster first layer with fewer moves. Same 11 algorithms, but the layer goes together much quicker."],
  steps:[
   [["Uchlar","Tips"],["Avvalgidek uchlarni to'g'irlang (tezlashganingizda ularni oxiriga qoldirsa ham bo'ladi).","Solve the tips as before (once you're faster you can leave them for the end)."]],
   [["Ikki markaz + ikki qirra","Two centres + two edges"],["Pastki rangdagi faqat <b>ikkita</b> markazni to'g'irlang va ularning orasidagi va yonidagi 2 ta qirrani qo'ying. Uchinchi markazga tegmang.","Align only <b>two</b> bottom centres and place the 2 edges next to them. Leave the third centre alone."]],
   [["Keyhole — teshik orqali kiritish","Keyhole insertion"],["To'g'irlanmagan markaz qatlamida bo'sh \"teshik\" bor. Uchinchi qirrani shu teshik orqali bitta-ikki harakat bilan kiriting, keyin markazni joyiga burang.","The unsolved centre leaves an empty \"keyhole\" slot. Drop the third edge in through it with a move or two, then turn that centre home."]],
   [["Oxirgi qatlam","Last layer"],["1-darajadagi 11 ta formula bilan.","With the same 11 algorithms from level 1."]]],
  lib:'LL',
  tasks:[["Keyhole g'oyasini simulyatorda 10 marta sinab ko'ring","Try the keyhole idea 10 times in the simulator"],["Birinchi qatlam — 8 harakatdan kam","First layer in under 8 moves"],["Oxirgi qatlamni formulaga qaramasdan bajaring","Do the last layer without looking up algorithms"],["Taymerda ao12 — 20 soniyadan kam","Timer ao12 under 20 seconds"]]},
 {id:3,color:'var(--lv3)',name:["Tezkor","Fast"],method:["L4E (oxirgi 4 qirra)","L4E (last 4 edges)"],goal:["8–10 s","8–10 s"],
  intro:["Tezkor kubchilarning asosiy metodi. \"V\" shaklini quring, qolgan 4 qirrani bitta formula bilan yeching.","The main method of fast solvers. Build a \"V\", then finish the last 4 edges with one algorithm."],
  steps:[
   [["Uchlar va markazlar","Tips and centres"],["Barcha 4 markazni to'g'irlang (har biri bitta harakat).","Align all 4 centres (one move each)."]],
   [["V shakli","The V"],["Pastki rangdagi 2 ta qirrani orqa uch atrofida qo'ying — \"V\" harfiga o'xshaydi. Markazlarni buzmang. Buni ko'zdan kechirish paytida rejalashtiring.","Place 2 bottom edges around the back tip so they form a \"V\". Don't break the centres. Plan it during inspection."]],
   [["Oxirgi 4 qirra","Last 4 edges"],["Qolgan 4 qirraning holatini tanib, bitta formulani bajaring. Avval qisqa (4–6 harakatli) holatlardan boshlang.","Recognise the state of the remaining 4 edges and run one algorithm. Start with the short (4–6 move) cases."]]],
  lib:'L4E',
  tasks:[["V'ni ko'zdan kechirishda to'liq rejalashtiring (10 marta)","Fully plan the V during inspection (10 times)"],["L4E: 4–6 harakatli 26 ta holatni o'rganing","L4E: learn the 26 cases of 4–6 moves"],["L4E: 7–8 harakatli holatlarni o'rganing","L4E: learn the 7–8 move cases"],["Taymerda ao12 — 10 soniyadan kam","Timer ao12 under 10 seconds"]]},
 {id:4,color:'var(--lv4)',name:["Pro","Pro"],method:["Top-first, 1-flip","Top-first, 1-flip"],goal:["< 5 s","< 5 s"],
  intro:["Bu darajada yechimning katta qismi 15 soniyalik ko'zdan kechirishda rejalashtiriladi. Bir nechta metodni bilib, har holatga eng qisqasini tanlaysiz.","At this level most of the solve is planned in the 15-second inspection. You know several methods and pick the shortest for each scramble."],
  steps:[
   [["Top-first","Top-first"],["Avval bitta uch atrofidagi \"tepa\"ni yig'asiz: shu uchning markazi va unga tutashgan 3 ta qirra. So'ng pastki qatlam bitta formula bilan yechiladi.","First build a \"top\" around one tip: its centre plus the 3 edges touching it. Then the bottom layer is solved with one algorithm."]],
   [["1-flip","1-flip"],["Birinchi qatlamni ataylab bitta qirrasi teskari holda yig'asiz — bu ko'pincha 2–3 harakat tejaydi. So'ng maxsus formulalar bilan tugatasiz.","Build the first layer with one edge deliberately flipped — it often saves 2–3 moves. Then finish with dedicated algorithms."]],
   [["Ko'zdan kechirish","Inspection"],["15 soniyada: qaysi metod qisqaroq? V, tepa yoki 1-flip — butun birinchi qadamni ko'z bilan bajarib qo'ying. Uchlarni ko'pincha oxirida yechishadi.","In 15 seconds: which method is shorter? V, top or 1-flip — trace the whole first step with your eyes. Pros often leave the tips for the end."]],
   [["Yechuvchidan o'rganing","Learn from the solver"],["Yechuvchida \"Eng qisqa\" rejimini yoqing: har aralashtirishning optimal yechimini ko'rib, o'z yechimingiz bilan solishtiring.","Use the solver's \"Shortest\" mode: compare the optimal solution of each scramble with your own."]]],
  lib:null,
  tasks:[["Har aralashtirishda 2 ta metodni solishtiring (Yechuvchi yordamida)","Compare 2 methods on each scramble (with the solver)"],["Ko'zdan kechirishda V yoki tepani to'liq rejalashtiring","Fully plan the V or top during inspection"],["Taymerda ao12 — 5 soniyadan kam","Timer ao12 under 5 seconds"]]},
];
// ---- case naming ----
// edge index: BL0 BR1 BU2 LR3 LU4 RU5
function llName(c){
  const cw=c.ep[2]===4, ccw=c.ep[2]===5;
  const fl=[2,4,5].filter(i=>c.eo[i]);
  let flip=''; if(fl.length===2){ const un=[2,4,5].find(i=>!c.eo[i]); flip= un===2?L("old juft teskari","front pair flipped"):un===4?L("o'ng juft teskari","right pair flipped"):L("chap juft teskari","left pair flipped"); }
  const rot= cw?L("Aylanish ↻","Cycle ↻"):ccw?L("Aylanish ↺","Cycle ↺"):'';
  return rot&&flip?rot+' + '+flip:(rot||(flip.charAt(0).toUpperCase()+flip.slice(1)));
}
function libCases(key){
  const list=PSOLVER.LIB[key].map((c,i)=>({i,ep:c.ep,eo:c.eo,alg:c.alg,len:c.alg.split(' ').length}));
  if(key==='LL'){ list.forEach(c=>c.name=llName(c)); return list; }
  list.sort((a,b)=>a.len-b.len||a.i-b.i); list.forEach((c,k)=>c.name='L4E #'+(k+1)); return list;
}
function caseState(c){ return PYRA.apply(PYRA.solved(), PYRA.invert(c.alg)); }
