// ===================== DATA =====================
// [id, uzName, enName, alg, uzHint, enHint]
const SETS = {
 oll1:{title:["2-look OLL · 1: sariq Krest (X)","2-look OLL · 1: yellow cross"],short:["OLL krest","OLL cross"],view:'oll-edge',pic:'top',cases:[
  ['line',"Chiziq","Line","F R U R' U' F'","Tepada ikki qarama-qarshi sariq qirra. Chiziqni gorizontal (chapdan o'ngga) ushlang.","Two opposite yellow edges on top. Hold the line horizontally (left to right)."],
  ['L',"L shakli","L shape","F U R U' R' F'","Ikki qo'shni sariq qirra. Ularni orqa va chap tomonga (soat 12 va 9) qaratib ushlang.","Two adjacent yellow edges. Hold them at the back and left (12 and 9 o'clock)."],
  ['dot',"Nuqta","Dot","F R U R' U' F' f R U R' U' f'","Faqat markaz sariq, sariq qirra yo'q. Ikki qismni oraliq burilishsiz ketma-ket bajaring.","Only the center is yellow, no yellow edges. Do both halves back to back, with no U turn in between."]]},
 oll2:{title:["2-look OLL · 2: burchaklar","2-look OLL · 2: corners"],short:["OLL burchak","OLL corners"],view:'oll',pic:'top',cases:[
  ['sune',"Sune","Sune","R U R' U R U2 R'","Bitta sariq burchak tepada. Uni old-chapga qo'ying: old-o'ng burchakning sariq stikeri oldga qaraydi.","One yellow corner on top. Put it front-left: the front-right corner's yellow sticker faces you."],
  ['antisune',"Antisune","Antisune","R U2 R' U' R U' R'","Bitta sariq burchak tepada. Uni orqa-o'ngga qo'ying: old-chap burchakning sariq stikeri oldga qaraydi.","One yellow corner on top. Put it back-right: the front-left corner's yellow sticker faces you."],
  ['H',"H","H","R U2 R' U' R U R' U' R U' R'","Tepada sariq burchak yo'q. Ikki juft fara: ularni old va orqa tomonga qo'ying.","No yellow corners on top. Two pairs of headlights: put them front and back."],
  ['pi',"Pi","Pi","R U2 R2 U' R2 U' R2 U2 R","Tepada sariq burchak yo'q, faqat bir tomonda fara. Farani chapga qo'ying; o'ngdagi burchaklar sariqlari old va orqaga qaraydi.","No yellow corners on top, headlights on one side only. Put them on the left; the right corners' yellows face front and back."],
  ['headlights',"Faralar (U)","Headlights (U)","R2 D' R U2 R' D R U2 R","Ikki qo'shni sariq burchak. Ularni oldga qo'ying — orqada faralar (ikki sariq stiker orqaga qaraydi).","Two adjacent yellow corners. Put them in front — the headlights (two yellow stickers) face the back."],
  ['T',"T (Xameleon)","T (Chameleon)","r U R' U' r' F R F'","Ikki qo'shni sariq burchak. Ularni o'ngga qo'ying — chapdagi burchaklar sariqlari old va orqaga qaraydi.","Two adjacent yellow corners. Put them on the right — the left corners' yellows face front and back."],
  ['bowtie',"Kapalak","Bowtie","F' r U R' U' r' F R","Ikki sariq burchak diagonal. Ularni old-chap va orqa-o'ngga qo'ying; old-o'ng burchakning sariqi oldga qaraydi.","Two yellow corners on a diagonal. Put them front-left and back-right; the front-right corner's yellow faces you."]]},
 pll1:{title:["2-look PLL","2-look PLL"],short:["PLL 2-look","PLL 2-look"],view:'pll',pic:'top',cases:[
  ['T',"T-perm","T-perm","R U R' U' R' F R2 U' R' U' R U R' F'","1-qadam (burchaklar). Faqat burchaklarga qarang: bir tomonda faralar (ikki burchak bir rang). Faralarni chapga qo'ying.","Step 1 (corners). Look only at corners: one side has headlights (two corners of one color). Put the headlights on the left."],
  ['Y',"Y-perm","Y-perm","F R U' R' U' R U R' F' R U R' U' R' F R F'","1-qadam (burchaklar). Hech qaysi tomonda fara yo'q — burchaklar diagonal almashadi. Istalgan burchakdan bajarsa bo'ladi.","Step 1 (corners). No headlights anywhere — the corners swap diagonally. Works from any angle."],
  ['Ua',"Ua-perm","Ua-perm","R U' R U R U R U' R' U' R2","2-qadam (qirralar). Bitta tomon to'liq yig'ilgan — uni orqaga qo'ying. Old qirra o'ng tomon rangida bo'lsa — Ua.","Step 2 (edges). One side is fully solved — put it at the back. If the front edge has the right side's color — Ua."],
  ['Ub',"Ub-perm","Ub-perm","R2 U R U R' U' R' U' R' U R'","2-qadam. Yig'ilgan tomonni orqaga qo'ying. Old qirra chap tomon rangida bo'lsa — Ub.","Step 2. Solved side at the back. If the front edge has the left side's color — Ub."],
  ['H',"H-perm","H-perm","M2 U M2 U2 M2 U M2","2-qadam. Yig'ilgan tomon yo'q; har tomonda qirra qarama-qarshi tomon rangida.","Step 2. No solved side; every edge has the opposite side's color."],
  ['Z',"Z-perm","Z-perm","M' U M2 U M2 U M' U2 M2 U'","2-qadam. Yig'ilgan tomon yo'q; qirralar qo'shni tomon rangida. Old↔chap va o'ng↔orqa qirralar almashadigan qilib ushlang.","Step 2. No solved side; edges show adjacent sides' colors. Hold it so the front↔left and right↔back edges swap."]]},
 pll2:{title:["To'liq PLL (qolgan 15 ta)","Full PLL (remaining 15)"],short:["PLL to'liq","PLL full"],view:'pll',pic:'top',cases:[
  ['Aa',"Aa-perm","Aa-perm","x R' U R' D2 R U' R' D2 R2 x'","Faqat 3 burchak aylanadi, qirralar joyida. Faralarni orqaga qo'ying.","Only 3 corners cycle, edges stay. Put the headlights at the back."],
  ['Ab',"Ab-perm","Ab-perm","x R2 D2 R U R' D2 R U' R x'","Faqat 3 burchak aylanadi (Aa'ning teskari yo'nalishi). Faralarni o'ngga qo'ying.","Only 3 corners cycle (opposite direction to Aa). Put the headlights on the right."],
  ['E',"E-perm","E-perm","x' R U' R' D R U R' D' R U R' D R U' R' D' x","Qirralar joyida, hech qaysi tomonda fara yo'q.","Edges solved, no headlights on any side."],
  ['F',"F-perm","F-perm","R' U' F' R U R' U' R' F R2 U' R' U' R U R' U R","Chap tomonda to'liq qator; qarshi tomonda uchta stiker uch xil rangda.","Full bar on the left; the opposite side shows three different colors."],
  ['Ga',"Ga-perm","Ga-perm","R2 U R' U R' U' R U' R2 U' D R' U R D'","G-perm: bir tomonda faralar, boshqa joyda 2x1 blok. To'rtta G'ni rasm orqali farqlash kerak.","G-perm: headlights on one side, a 2x1 block elsewhere. Tell the four Gs apart by their picture."],
  ['Gb',"Gb-perm","Gb-perm","R' U' R U D' R2 U R' U R U' R U' R2 D","G-perm: faralar + 2x1 blok.","G-perm: headlights + 2x1 block."],
  ['Gc',"Gc-perm","Gc-perm","R2 U' R U' R U R' U R2 U D' R U' R' D","G-perm: faralar + 2x1 blok.","G-perm: headlights + 2x1 block."],
  ['Gd',"Gd-perm","Gd-perm","R U R' U' D R2 U' R U' R' U R' U R2 D'","G-perm: faralar + 2x1 blok.","G-perm: headlights + 2x1 block."],
  ['Ja',"Ja-perm","Ja-perm","x R2 F R F' R U2 r' U r U2 x'","J-perm: bitta tomonda to'liq qator. Ja va Jb'ni qolgan bloklar joyi bilan farqlang.","J-perm: one side has a full bar. Tell Ja and Jb apart by where the other blocks are."],
  ['Jb',"Jb-perm","Jb-perm","R U R' F' R U R' U' R' F R2 U' R'","J-perm: bitta tomonda to'liq qator. Eng ko'p uchraydigan PLL'lardan.","J-perm: one side has a full bar. One of the most common PLLs."],
  ['Na',"Na-perm","Na-perm","R U R' U R U R' F' R U R' U' R' F R2 U' R' U2 R U' R'","N-perm: har bir tomonda 2x1 blok. Kam uchraydi.","N-perm: a 2x1 block on every side. Rare."],
  ['Nb',"Nb-perm","Nb-perm","R' U R U' R' F' U' F R U R' F R' F' R U' R","N-perm: har bir tomonda 2x1 blok (Na'ning ko'zgu nusxasi).","N-perm: a 2x1 block on every side (mirror of Na)."],
  ['Ra',"Ra-perm","Ra-perm","R U' R' U' R U R D R' U' R D' R' U2 R'","R-perm: faralar va 2x1 blok.","R-perm: headlights and a 2x1 block."],
  ['Rb',"Rb-perm","Rb-perm","R2 F R U R U' R' F' R U2 R' U2 R","R-perm: faralar va 2x1 blok (Ra'ning ko'zgu nusxasi).","R-perm: headlights and a 2x1 block (mirror of Ra)."],
  ['V',"V-perm","V-perm","R' U R U' R' f' U' R U2 R' U' R U' R' f R","Burchaklar diagonal almashadi; fara yo'q, lekin 2x1 blok bor.","Corners swap diagonally; no headlights, but there is a 2x1 block."]]},
 f2l:{title:["F2L asosiy holatlari (old-o'ng slot)","F2L basic cases (front-right slot)"],short:["F2L","F2L"],view:'f2l',pic:'iso',cases:[
  ['b1',"Asosiy: R U R'","Basic: R U R'","R U R'","Burchak slot ustida, oq stiker o'ngga qaragan. Qirra orqada, tepasi ko'k.","Corner above the slot, white facing right. Edge at the back, blue on top."],
  ['b2',"Asosiy: F' U' F","Basic: F' U' F","F' U' F","Burchak slot ustida, oq stiker oldga qaragan. Qirra chapda, tepasi qizil.","Corner above the slot, white facing front. Edge on the left, red on top."],
  ['b3',"Asosiy: U R U' R'","Basic: U R U' R'","U R U' R'","Burchak slot ustida, oq oldga qaragan. Qirra o'ngda (burchak yonida), tepasi ko'k.","Corner above the slot, white facing front. Edge on the right (next to the corner), blue on top."],
  ['b4',"Asosiy: U' F' U F","Basic: U' F' U F","U' F' U F","Burchak slot ustida, oq o'ngga qaragan. Qirra oldda (burchak yonida), tepasi qizil.","Corner above the slot, white facing right. Edge in front (next to the corner), red on top."],
  ['c5',"Juftlash 1","Pairing 1","U' R U R' U2 R U' R'","Oq oldga qaragan, qirra orqada (tepasi ko'k). Avval juft hosil qiling, keyin kiriting.","White faces front, edge at the back (blue on top). Build the pair first, then insert."],
  ['c6',"Juftlash 2","Pairing 2","U F' U' F U2 F' U F","Oq o'ngga qaragan, qirra chapda (tepasi qizil). Juftlash 1'ning ko'zgu nusxasi.","White faces right, edge on the left (red on top). Mirror of Pairing 1."],
  ['c7',"Juftlash 3","Pairing 3","U' R U2 R' U2 R U' R'","Oq oldga qaragan, qirra chapda (tepasi ko'k).","White faces front, edge on the left (blue on top)."],
  ['c8',"Juftlash 4","Pairing 4","U F' U2 F U2 F' U F","Oq o'ngga qaragan, qirra orqada (tepasi qizil).","White faces right, edge at the back (red on top)."],
  ['c9',"Juftlash 5","Pairing 5","U' R U' R' U F' U' F","Oq oldga qaragan, qirra orqada (tepasi qizil).","White faces front, edge at the back (red on top)."],
  ['c10',"Juftlash 6","Pairing 6","U' R U R' U R U R'","Oq o'ngga qaragan, qirra chapda (tepasi ko'k).","White faces right, edge on the left (blue on top)."],
  ['w1',"Oq tepada 1","White on top 1","R U2 R' U' R U R'","Burchakning oq stikeri tepaga qaragan, qirra o'ngda (tepasi ko'k). Avval burchakni R U2 R' bilan qayta joylang.","The corner's white sticker faces up, edge on the right (blue on top). First re-place the corner with R U2 R'."],
  ['w2',"Oq tepada 2","White on top 2","F' U2 F U F' U' F","Oq tepaga qaragan, qirra oldda (tepasi qizil).","White faces up, edge in front (red on top)."]]},
};
for(const k in SETS) SETS[k].cases=SETS[k].cases.map(([id,nu,ne,alg,hu,he])=>({id,nu,ne,alg,hu,he}));
const SET_ORDER=['f2l','oll1','oll2','pll1','pll2'];
const NM=c=>L(c.nu,c.ne), HN=c=>L(c.hu,c.he), ST=k=>L(SETS[k].title[0],SETS[k].title[1]), SH=k=>L(SETS[k].short[0],SETS[k].short[1]);

