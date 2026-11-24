// ===== Rubik solver core: Kociemba two-phase + CFOP (Krest, F2L) =====
// Works in a Web Worker or Node. Derives all cubie move tables from a sticker model.
var SOLVER = (function(){
  // ---- sticker model (same convention as the page) ----
  var SCH = {U:'Y',D:'W',F:'G',B:'B',R:'O',L:'R'};
  var NRM = {U:[0,1,0],D:[0,-1,0],R:[1,0,0],L:[-1,0,0],F:[0,0,1],B:[0,0,-1]};
  function faceOf(n){return n[1]===1?'U':n[1]===-1?'D':n[2]===1?'F':n[2]===-1?'B':n[0]===1?'R':'L';}
  function solvedSt(){var st=[],N=[[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]];
    for(var x=-1;x<=1;x++)for(var y=-1;y<=1;y++)for(var z=-1;z<=1;z++)for(var k=0;k<6;k++){var n=N[k],p=[x,y,z],a=n[0]?0:n[1]?1:2; if(p[a]===n[a]) st.push({p:p,n:n.slice(),c:SCH[faceOf(n)]});} return st;}
  function rot(v,a,s){var x=v[0],y=v[1],z=v[2]; if(a===0)return s>0?[x,-z,y]:[x,z,-y]; if(a===1)return s>0?[z,y,-x]:[-z,y,x]; return s>0?[-y,x,z]:[y,-x,z];}
  var FM={U:[1,1,-1],D:[1,-1,1],R:[0,1,-1],L:[0,-1,1],F:[2,1,-1],B:[2,-1,1]};
  function stMove(st,f,amt){var d=FM[f];for(var k=0;k<amt;k++)for(var i=0;i<st.length;i++){var t=st[i];if(t.p[d[0]]===d[1]){t.p=rot(t.p,d[0],d[2]);t.n=rot(t.n,d[0],d[2]);}}return st;}
  function stGet(st,p,n){for(var i=0;i<st.length;i++){var t=st[i];if(t.p[0]===p[0]&&t.p[1]===p[1]&&t.p[2]===p[2]&&t.n[0]===n[0]&&t.n[1]===n[1]&&t.n[2]===n[2])return t;}return null;}

  // ---- cubie definitions ----
  var CORN=[[[1,1,1],'URF'],[[-1,1,1],'UFL'],[[-1,1,-1],'ULB'],[[1,1,-1],'UBR'],[[1,-1,1],'DFR'],[[-1,-1,1],'DLF'],[[-1,-1,-1],'DBL'],[[1,-1,-1],'DRB']];
  var EDGE=[[[1,1,0],'UR'],[[0,1,1],'UF'],[[-1,1,0],'UL'],[[0,1,-1],'UB'],[[1,-1,0],'DR'],[[0,-1,1],'DF'],[[-1,-1,0],'DL'],[[0,-1,-1],'DB'],[[1,0,1],'FR'],[[-1,0,1],'FL'],[[-1,0,-1],'BL'],[[1,0,-1],'BR']];
  // facelet colours of a sticker state -> cubie; returns {cp,co,ep,eo} or {error}
  function stickersToCubie(get){ // get(face, pos) -> colour
    var cen={}; ['U','D','R','L','F','B'].forEach(function(f){cen[f]=get(f,NRM[f]);});
    var cp=[],co=[],ep=[],eo=[], err=null;
    var homeC=CORN.map(function(c){return c[1].split('').map(function(f){return cen[f];});});
    var homeE=EDGE.map(function(e){return e[1].split('').map(function(f){return cen[f];});});
    for(var i=0;i<8;i++){var fs=CORN[i][1].split(''),p=CORN[i][0];
      var cols=fs.map(function(f){return get(f,p);});
      var ori=-1; for(var k=0;k<3;k++) if(cols[k]===cen.U||cols[k]===cen.D) ori=k;
      var piece=-1; for(var j=0;j<8;j++){var h=homeC[j]; if(ori>=0 && cols[ori]===h[0] && cols[(ori+1)%3]===h[1] && cols[(ori+2)%3]===h[2]) piece=j;}
      if(piece<0) return {error:'corner',pos:CORN[i][1],cols:cols};
      cp.push(piece); co.push(ori);
    }
    for(var i2=0;i2<12;i2++){var fs2=EDGE[i2][1].split(''),p2=EDGE[i2][0];
      var c2=fs2.map(function(f){return get(f,p2);}); var piece2=-1, o2=0;
      for(var j2=0;j2<12;j2++){var h2=homeE[j2]; if(c2[0]===h2[0]&&c2[1]===h2[1]){piece2=j2;o2=0;} else if(c2[0]===h2[1]&&c2[1]===h2[0]){piece2=j2;o2=1;}}
      if(piece2<0) return {error:'edge',pos:EDGE[i2][1],cols:c2};
      ep.push(piece2); eo.push(o2);
    }
    return {cp:cp,co:co,ep:ep,eo:eo};
  }
  function stToCubie(st){return stickersToCubie(function(f,p){var t=stGet(st,p,NRM[f]);return t?t.c:null;});}
  function verify(c){ // returns null if solvable, else error code
    var seenC=[],seenE=[]; for(var i=0;i<8;i++){ if(seenC[c.cp[i]]) return 'dupCorner'; seenC[c.cp[i]]=1; }
    for(var j=0;j<12;j++){ if(seenE[c.ep[j]]) return 'dupEdge'; seenE[c.ep[j]]=1; }
    var tw=0,fl=0; c.co.forEach(function(v){tw+=v;}); c.eo.forEach(function(v){fl+=v;});
    if(tw%3) return 'twist'; if(fl%2) return 'flip';
    if(parity(c.cp)!==parity(c.ep)) return 'parity';
    return null;
  }
  function parity(p){var s=0;for(var i=0;i<p.length;i++)for(var j=i+1;j<p.length;j++)if(p[i]>p[j])s++;return s&1;}
  function mul(a,b){var r={cp:[],co:[],ep:[],eo:[]};
    for(var i=0;i<8;i++){r.cp[i]=a.cp[b.cp[i]];r.co[i]=(a.co[b.cp[i]]+b.co[i])%3;}
    for(var j=0;j<12;j++){r.ep[j]=a.ep[b.ep[j]];r.eo[j]=(a.eo[b.ep[j]]+b.eo[j])%2;} return r;}
  function idCube(){return {cp:[0,1,2,3,4,5,6,7],co:[0,0,0,0,0,0,0,0],ep:[0,1,2,3,4,5,6,7,8,9,10,11],eo:[0,0,0,0,0,0,0,0,0,0,0,0]};}

  var FACES=['U','R','F','D','L','B']; // move m = face*3 + (power-1)
  var MOVE_NAMES=[]; FACES.forEach(function(f){MOVE_NAMES.push(f,f+'2',f+"'");});
  var MC=[]; // 18 move cubies
  (function(){ for(var f=0;f<6;f++){ var base=stToCubie(stMove(solvedSt(),FACES[f],1)); var c=base;
      for(var k=0;k<3;k++){ MC[f*3+k]=c; c=mul(c,base);} } })();

  // ---- coordinates ----
  var Cnk=[]; for(var n=0;n<13;n++){Cnk[n]=[];for(var k=0;k<13;k++)Cnk[n][k]=0;} for(n=0;n<13;n++){Cnk[n][0]=1;for(k=1;k<=n;k++)Cnk[n][k]=Cnk[n-1][k-1]+(k<=n-1?Cnk[n-1][k]:0);}
  function getTwist(c){var t=0;for(var i=0;i<7;i++)t=t*3+c.co[i];return t;}
  function setTwist(c,t){var s=0;for(var i=6;i>=0;i--){c.co[i]=t%3;s+=c.co[i];t=(t/3)|0;}c.co[7]=(3-s%3)%3;}
  function getFlip(c){var t=0;for(var i=0;i<11;i++)t=t*2+c.eo[i];return t;}
  function setFlip(c,t){var s=0;for(var i=10;i>=0;i--){c.eo[i]=t&1;s+=c.eo[i];t>>=1;}c.eo[11]=s&1;}
  function getSlice(c){var a=0,x=0;for(var j=11;j>=0;j--){if(c.ep[j]>=8){a+=Cnk[11-j][x+1];x++;}}return a;}
  var SLICE_REP=[]; (function(){ for(var a=0;a<12;a++)for(var b=a+1;b<12;b++)for(var d=b+1;d<12;d++)for(var e=d+1;e<12;e++){
      var c=idCube(), pos=[a,b,d,e], o=0, s=8; c.ep=[]; for(var i=0;i<12;i++){ if(pos.indexOf(i)>=0) c.ep[i]=s++; else c.ep[i]=o++; }
      SLICE_REP[getSlice(c)]=c.ep.slice(); } })();
  function permIdx(arr){var n=arr.length,idx=0;for(var i=0;i<n;i++){var cnt=0;for(var j=i+1;j<n;j++)if(arr[j]<arr[i])cnt++;idx=idx*(n-i)+cnt;}return idx;}
  function idxPerm(idx,n){var digits=[];for(var i=n-1;i>=0;i--){digits[i]=idx%(n-i);idx=(idx/(n-i))|0;}var avail=[];for(i=0;i<n;i++)avail.push(i);var out=[];for(i=0;i<n;i++){out.push(avail.splice(digits[i],1)[0]);}return out;}
  function getCperm(c){return permIdx(c.cp);}
  function getUDperm(c){return permIdx(c.ep.slice(0,8));}
  function getSperm(c){return permIdx(c.ep.slice(8).map(function(v){return v-8;}));}

  var P2MOVES=[0,1,2,9,10,11,4,13,7,16]; // U U2 U' D D2 D' R2 L2 F2 B2
  var ready=false, twM, flM, slM, cpM, udM, spM, prTS, prFS, prCS, prUS;
  // CFOP tables
  var crossDist, pairDist=[], eTo=[], eFl=[], cTo=[], cTw=[];

  function init(){
    if(ready) return;
    var i,m,c,d;
    twM=new Uint16Array(2187*18); flM=new Uint16Array(2048*18); slM=new Uint16Array(495*18);
    for(i=0;i<2187;i++){c=idCube();setTwist(c,i);for(m=0;m<18;m++)twM[i*18+m]=getTwist(mul(c,MC[m]));}
    for(i=0;i<2048;i++){c=idCube();setFlip(c,i);for(m=0;m<18;m++)flM[i*18+m]=getFlip(mul(c,MC[m]));}
    for(i=0;i<495;i++){c=idCube();c.ep=SLICE_REP[i].slice();for(m=0;m<18;m++)slM[i*18+m]=getSlice(mul(c,MC[m]));}
    cpM=new Uint16Array(40320*10); udM=new Uint16Array(40320*10); spM=new Uint8Array(24*10);
    for(i=0;i<40320;i++){c=idCube();c.cp=idxPerm(i,8);for(m=0;m<10;m++)cpM[i*10+m]=getCperm(mul(c,MC[P2MOVES[m]]));}
    for(i=0;i<40320;i++){c=idCube();c.ep=idxPerm(i,8).concat([8,9,10,11]);for(m=0;m<10;m++)udM[i*10+m]=getUDperm(mul(c,MC[P2MOVES[m]]));}
    for(i=0;i<24;i++){c=idCube();c.ep=[0,1,2,3,4,5,6,7].concat(idxPerm(i,4).map(function(v){return v+8;}));for(m=0;m<10;m++)spM[i*10+m]=getSperm(mul(c,MC[P2MOVES[m]]));}
    prTS=bfs(2187,495,twM,slM,18); prFS=bfs(2048,495,flM,slM,18);
    prCS=bfs(40320,24,cpM,spM,10); prUS=bfs(40320,24,udM,spM,10);
    // piece-level move maps for CFOP
    for(m=0;m<18;m++){eTo[m]=[];eFl[m]=[];cTo[m]=[];cTw[m]=[];
      for(i=0;i<12;i++){eTo[m][MC[m].ep[i]]=i;eFl[m][MC[m].ep[i]]=MC[m].eo[i];}
      for(i=0;i<8;i++){cTo[m][MC[m].cp[i]]=i;cTw[m][MC[m].cp[i]]=MC[m].co[i];}}
    // cross table: 4 edges (pieces 4..7), each pos*2+ori (0..23)
    crossDist=new Int8Array(331776).fill(-1);
    var start=crossIndex([4,5,6,7],[0,0,0,0]); crossDist[start]=0; var frontier=[start], depth=0;
    while(frontier.length){var next=[];for(var f=0;f<frontier.length;f++){var idx=frontier[f],pos=[],ori=[],t=idx;
        for(var k=0;k<4;k++){var v=t%24;t=(t/24)|0;pos.push(v>>1);ori.push(v&1);}
        for(m=0;m<18;m++){var np=[],no=[];for(k=0;k<4;k++){np.push(eTo[m][pos[k]]);no.push(ori[k]^eFl[m][pos[k]]);}
          var ni=crossIndex(np,no); if(crossDist[ni]<0){crossDist[ni]=depth+1;next.push(ni);}}}
      frontier=next;depth++;}
    for(var p=0;p<4;p++){var tab=new Int8Array(576).fill(-1),s0=pairIndex(4+p,0,8+p,0);tab[s0]=0;var fr=[s0],dp=0;
      while(fr.length){var nx=[];for(var q=0;q<fr.length;q++){var id=fr[q],e=id%24,cc=(id/24)|0,cpos=(cc/3)|0,cori=cc%3,epos=e>>1,eori=e&1;
          for(m=0;m<18;m++){var ni2=pairIndex(cTo[m][cpos],(cori+cTw[m][cpos])%3,eTo[m][epos],eori^eFl[m][epos]); if(tab[ni2]<0){tab[ni2]=dp+1;nx.push(ni2);}}}
        fr=nx;dp++;}
      pairDist[p]=tab;}
    ready=true;
  }
  function crossIndex(pos,ori){var idx=0;for(var k=3;k>=0;k--)idx=idx*24+pos[k]*2+ori[k];return idx;}
  function pairIndex(cpos,cori,epos,eori){return (cpos*3+cori)*24+epos*2+eori;}
  function bfs(n1,n2,m1,m2,nm){var tab=new Int8Array(n1*n2).fill(-1);tab[0]=0;var done=1,depth=0,total=n1*n2;
    while(done<total){var found=0;for(var i=0;i<total;i++){if(tab[i]!==depth)continue;var a=(i/n2)|0,b=i%n2;
        for(var m=0;m<nm;m++){var j=m1[a*nm+m]*n2+m2[b*nm+m];if(tab[j]<0){tab[j]=depth+1;done++;found++;}}}
      depth++; if(!found)break;} return tab;}

  // ---- two-phase search ----
  function kociemba(cube,opts){
    init(); opts=opts||{}; var maxLen=opts.maxLen||23, timeLimit=opts.time||1500, t0=Date.now();
    var best=null, bestLen=maxLen+1, sol1=[], tw0=getTwist(cube), fl0=getFlip(cube), sl0=getSlice(cube);
    function axisSkip(f,last){ return last>=0 && (f===last || (f%3===last%3 && f<last)); }
    function phase2(c, d1){
      var cp=getCperm(c), ud=getUDperm(c), sp=getSperm(c), sol2=[];
      var lim=bestLen-1-d1; if(lim<0) return;
      for(var d2=0; d2<=Math.min(lim,18); d2++){ if(s2(cp,ud,sp,d2,sol1.length?Math.floor(sol1[sol1.length-1]/3):-1)){ best=sol1.concat(sol2); bestLen=best.length; return; } }
      function s2(cp,ud,sp,depth,last){
        if(depth===0) return cp===0&&ud===0&&sp===0;
        if(Math.max(prCS[cp*24+sp],prUS[ud*24+sp])>depth) return false;
        for(var mi=0;mi<10;mi++){var mv=P2MOVES[mi],f=Math.floor(mv/3); if(axisSkip(f,last)) continue;
          sol2.push(mv); if(s2(cpM[cp*10+mi],udM[ud*10+mi],spM[sp*10+mi],depth-1,f)) return true; sol2.pop();}
        return false;
      }
    }
    var stop=false;
    function s1(tw,fl,sl,depth,last){
      if(stop) return;
      if(depth===0){
        if(tw===0&&fl===0&&sl===0){
          if(sol1.length>0){var lm=sol1[sol1.length-1]; if(P2MOVES.indexOf(lm)>=0) return;}
          var c=cube; for(var i=0;i<sol1.length;i++) c=mul(c,MC[sol1[i]]);
          phase2(c,sol1.length);
          if(best && Date.now()-t0>timeLimit) stop=true;
        }
        return;
      }
      if(Math.max(prTS[tw*495+sl],prFS[fl*495+sl])>depth) return;
      for(var m=0;m<18;m++){var f=Math.floor(m/3); if(axisSkip(f,last)) continue;
        sol1.push(m); s1(twM[tw*18+m],flM[fl*18+m],slM[sl*18+m],depth-1,f); sol1.pop(); if(stop) return;}
    }
    for(var d1=0; d1<bestLen && !stop; d1++){ s1(tw0,fl0,sl0,d1,-1); if(Date.now()-t0>timeLimit*4 && best) break; }
    return best? best.map(function(m){return MOVE_NAMES[m];}) : null;
  }

  // ---- CFOP: Krest + F2L (library of optimal algs for FR slot, mapped to other slots) ----
  var F2L_LIB=[[0, 0, 0, 0, "R U2 R' U' R U R'"], [0, 0, 0, 1, "U2 R B U B2 R B R2"], [0, 0, 1, 0, "U2 R2 U2 R' U' R U' R2"], [0, 0, 1, 1, "F' U2 F U F' U' F"], [0, 0, 2, 0, "R B U2 B' R'"], [0, 0, 2, 1, "U' F' U2 F2 R' F' R"], [0, 0, 3, 0, "U R U B' R B R2"], [0, 0, 3, 1, "F' L' U2 L F"], [0, 0, 8, 0, "R2 U R2 U R2 U2 R2"], [0, 0, 8, 1, "R U' R' F' U2 F"], [0, 1, 0, 0, "U2 R2 U R' U R U2 R2"], [0, 1, 0, 1, "R U' R' U2 F' U' F"], [0, 1, 1, 0, "R U' B U2 B' U2 R'"], [0, 1, 1, 1, "U2 F' U2 F"], [0, 1, 2, 0, "F2 U' L' U L F2"], [0, 1, 2, 1, "R2 B U B' U' R2"], [0, 1, 3, 0, "R U R'"], [0, 1, 3, 1, "R2 U2 F R2 F' U2 R2"], [0, 1, 8, 0, "U R U2 B U2 B' R'"], [0, 1, 8, 1, "U F' U' F U' R U R'"], [0, 2, 0, 0, "U R U' R'"], [0, 2, 0, 1, "F U2 F2 U' F2 U' F'"], [0, 2, 1, 0, "R U2 B U B' U R'"], [0, 2, 1, 1, "U F' U F U' F' U' F"], [0, 2, 2, 0, "R U B U2 B' U R'"], [0, 2, 2, 1, "F' U' F"], [0, 2, 3, 0, "F2 L' U' L U F2"], [0, 2, 3, 1, "R2 U B U' B' R2"], [0, 2, 8, 0, "U2 R B U2 B' U2 R'"], [0, 2, 8, 1, "U2 R U R' U2 F' U2 F"], [1, 0, 0, 0, "R U B' R B R2"], [1, 0, 0, 1, "U F' L F' L' F2"], [1, 0, 1, 0, "U R2 U2 F R F' U2 R2"], [1, 0, 1, 1, "U R B U B2 R B R2"], [1, 0, 2, 0, "U R2 U2 R' U' R U' R2"], [1, 0, 2, 1, "U F2 U2 R' F' R U2 F2"], [1, 0, 3, 0, "U R B' R B R2"], [1, 0, 3, 1, "U2 F' U2 F2 R' F' R"], [1, 0, 8, 0, "R U' B U2 B' U R'"], [1, 0, 8, 1, "R U2 R' F' U' F"], [1, 1, 0, 0, "U' R U R'"], [1, 1, 0, 1, "F' U2 F U F' U2 F"], [1, 1, 1, 0, "U R2 U R' U R U2 R2"], [1, 1, 1, 1, "U' R U' R' U2 F' U' F"], [1, 1, 2, 0, "F' U2 F U' R U R'"], [1, 1, 2, 1, "U F' U2 F"], [1, 1, 3, 0, "U' F2 U' L' U L F2"], [1, 1, 3, 1, "U F' L' U' L U2 F"], [1, 1, 8, 0, "R U2 B U2 B' R'"], [1, 1, 8, 1, "F' U' F U' R U R'"], [1, 2, 0, 0, "U R B U B' U2 R'"], [1, 2, 0, 1, "U' R2 U B U' B' R2"], [1, 2, 1, 0, "R U' R'"], [1, 2, 1, 1, "U2 R U2 R' U F' U' F"], [1, 2, 2, 0, "U' R U2 B U B' U R'"], [1, 2, 2, 1, "F' U F U' F' U' F"], [1, 2, 3, 0, "R U B U2 B' U2 R'"], [1, 2, 3, 1, "U' F' U' F"], [1, 2, 8, 0, "U R B U2 B' U2 R'"], [1, 2, 8, 1, "U R U R' U2 F' U2 F"], [2, 0, 0, 0, "R B' R B R2"], [2, 0, 0, 1, "U F' U2 F2 R' F' R"], [2, 0, 1, 0, "U' R U B' R B R2"], [2, 0, 1, 1, "F' L F' L' F2"], [2, 0, 2, 0, "R2 U2 F R F' U2 R2"], [2, 0, 2, 1, "R B U B2 R B R2"], [2, 0, 3, 0, "R2 U2 R' U' R U' R2"], [2, 0, 3, 1, "F2 U2 R' F' R U2 F2"], [2, 0, 8, 0, "R U' B U B' U R'"], [2, 0, 8, 1, "U F' U2 F R U R'"], [2, 1, 0, 0, "U2 F2 U' L' U L F2"], [2, 1, 0, 1, "F' L' U' L U2 F"], [2, 1, 1, 0, "U2 R U R'"], [2, 1, 1, 1, "U F' U' L' U2 L U2 F"], [2, 1, 2, 0, "R2 U R' U R U2 R2"], [2, 1, 2, 1, "U2 R U' R' U2 F' U' F"], [2, 1, 3, 0, "U2 R U' B U2 B' U2 R'"], [2, 1, 3, 1, "F' U2 F"], [2, 1, 8, 0, "F' L' U2 L U2 F"], [2, 1, 8, 1, "F' U F U R U R'"], [2, 2, 0, 0, "U R U2 R' U2 R U' R'"], [2, 2, 0, 1, "U2 F' U' F"], [2, 2, 1, 0, "R B U B' U2 R'"], [2, 2, 1, 1, "U2 R2 U B U' B' R2"], [2, 2, 2, 0, "R U2 R'"], [2, 2, 2, 1, "U R U2 R' U F' U' F"], [2, 2, 3, 0, "U2 R U2 B U B' U R'"], [2, 2, 3, 1, "F2 U' F U' F' U2 F2"], [2, 2, 8, 0, "R B U2 B' U2 R'"], [2, 2, 8, 1, "R U R' U2 F' U2 F"], [3, 0, 0, 0, "U' R2 U2 R' U' R U' R2"], [3, 0, 0, 1, "U F' U2 F U F' U' F"], [3, 0, 1, 0, "U R B U2 B' R'"], [3, 0, 1, 1, "F' U2 F2 R' F' R"], [3, 0, 2, 0, "U2 R U B' R B R2"], [3, 0, 2, 1, "U F' L' U2 L F"], [3, 0, 3, 0, "U R U2 R' U' R U R'"], [3, 0, 3, 1, "U' R B U B2 R B R2"], [3, 0, 8, 0, "F' U L' U2 L U' F"], [3, 0, 8, 1, "F' U2 F R U R'"], [3, 1, 0, 0, "U R U' B U2 B' U2 R'"], [3, 1, 0, 1, "F' U F"], [3, 1, 1, 0, "U F2 U' L' U L F2"], [3, 1, 1, 1, "U R2 B U B' U' R2"], [3, 1, 2, 0, "U R U R'"], [3, 1, 2, 1, "F' U' L' U2 L U2 F"], [3, 1, 3, 0, "R U' R' U R U R'"], [3, 1, 3, 1, "U R U' R' U2 F' U' F"], [3, 1, 8, 0, "U2 R U2 B U2 B' R'"], [3, 1, 8, 1, "U2 F' U' F U' R U R'"], [3, 2, 0, 0, "U R U2 B U B' U R'"], [3, 2, 0, 1, "U2 F' U F U' F' U' F"], [3, 2, 1, 0, "R U2 R' U2 R U' R'"], [3, 2, 1, 1, "U F' U' F"], [3, 2, 2, 0, "U F2 L' U' L U F2"], [3, 2, 2, 1, "U R2 U B U' B' R2"], [3, 2, 3, 0, "U2 R U' R'"], [3, 2, 3, 1, "R U2 R' U F' U' F"], [3, 2, 8, 0, "F' U2 L' U2 L F"], [3, 2, 8, 1, "R U R' U F' U' F"], [4, 0, 0, 0, "R' U2 B' R' B U2 R"], [4, 0, 0, 1, "R U2 R' U2 F' U' F"], [4, 0, 1, 0, "F' U2 F U2 R U R'"], [4, 0, 1, 1, "R' U2 B' R B U2 R"], [4, 0, 2, 0, "R U2 B U2 B' U2 R'"], [4, 0, 2, 1, "R U R' U' F' U' F"], [4, 0, 3, 0, "R U2 B U B' U2 R'"], [4, 0, 3, 1, "F U2 L F2 L' U2 F'"], [4, 0, 8, 1, "R U' R U2 F R2 F' U2 R2"], [4, 1, 0, 0, "R U2 B' R B R2"], [4, 1, 0, 1, "U2 R' F R F2 U' F"], [4, 1, 1, 0, "U2 R B U2 B' U R'"], [4, 1, 1, 1, "U R' F R F2 U' F"], [4, 1, 2, 0, "U R B U2 B' U R'"], [4, 1, 2, 1, "R' F R F2 U' F"], [4, 1, 3, 0, "R B U2 B' U R'"], [4, 1, 3, 1, "R U' R' F' U' F"], [4, 1, 8, 0, "R U2 R U2 F R F' U2 R2"], [4, 1, 8, 1, "R U2 B U B2 R B R2"], [4, 2, 0, 0, "U2 R2 B' R' B U2 R'"], [4, 2, 0, 1, "U R U2 R' F' U2 F"], [4, 2, 1, 0, "U R2 B' R' B U2 R'"], [4, 2, 1, 1, "R U2 R' F' U2 F"], [4, 2, 2, 0, "R2 B' R' B U2 R'"], [4, 2, 2, 1, "F' L' U2 L U' F"], [4, 2, 3, 0, "R U' B U2 B' R'"], [4, 2, 3, 1, "U2 R U2 R' F' U2 F"], [4, 2, 8, 0, "R U2 R U R' U R U2 R2"], [4, 2, 8, 1, "R U' R' F' L' U2 L F"]];
  var SLOT_MAP=[{},{R:'F',F:'L',L:'B',B:'R'},{R:'L',F:'B',L:'R',B:'F'},{R:'B',F:'R',B:'L',L:'F'}];
  function mapAlg(alg,slot){var mp=SLOT_MAP[slot];return alg.split(' ').map(function(t){var f=t[0];return (mp[f]||f)+t.slice(1);});}
  function nameToMove(t){var f=FACES.indexOf(t[0]);var a=t.length===1?0:t[1]==='2'?1:2;return f*3+a;}
  var LIB_MOVES=null, EXTRACT=null;
  function cfopF2L(cube){
    init();
    if(!LIB_MOVES){LIB_MOVES=[];EXTRACT=[];for(var s=0;s<4;s++){LIB_MOVES[s]=F2L_LIB.map(function(r){return mapAlg(r[4],s).map(nameToMove);});
      EXTRACT[s]=[mapAlg("R U R'",s).map(nameToMove),mapAlg("R U' R'",s).map(nameToMove),mapAlg("R U2 R'",s).map(nameToMove)];}}
    var st={eP:[],eO:[],cP:[],cO:[]}, i;
    for(i=0;i<12;i++){st.eP[cube.ep[i]]=i;st.eO[cube.ep[i]]=cube.eo[i];}
    for(i=0;i<8;i++){st.cP[cube.cp[i]]=i;st.cO[cube.cp[i]]=cube.co[i];}
    function mv(s,m){var r={eP:s.eP.slice(),eO:s.eO.slice(),cP:s.cP.slice(),cO:s.cO.slice()},k;
      for(k=0;k<12;k++){r.eP[k]=eTo[m][s.eP[k]];r.eO[k]=s.eO[k]^eFl[m][s.eP[k]];}
      for(k=0;k<8;k++){r.cP[k]=cTo[m][s.cP[k]];r.cO[k]=(s.cO[k]+cTw[m][s.cP[k]])%3;} return r;}
    function seq(s,ms){for(var k=0;k<ms.length;k++)s=mv(s,ms[k]);return s;}
    function crossOK(s){for(var k=4;k<8;k++)if(s.eP[k]!==k||s.eO[k])return false;return true;}
    function pairOK(s,p){return s.cP[4+p]===4+p&&s.cO[4+p]===0&&s.eP[8+p]===8+p&&s.eO[8+p]===0;}
    var steps=[];
    // Krest: exact table descent
    var cross=[],g=0;
    function cIdx(s){return crossIndex([s.eP[4],s.eP[5],s.eP[6],s.eP[7]],[s.eO[4],s.eO[5],s.eO[6],s.eO[7]]);}
    while(crossDist[cIdx(st)]>0&&g++<20){var cur=crossDist[cIdx(st)];for(var m=0;m<18;m++){var n2=mv(st,m);if(crossDist[cIdx(n2)]===cur-1){cross.push(m);st=n2;break;}}}
    steps.push({type:'cross',moves:cross.map(function(m){return MOVE_NAMES[m];})});
    var guard=0;
    while(guard++<12){
      var solved=[0,1,2,3].map(function(p){return pairOK(st,p);});
      if(solved.indexOf(false)<0) break;
      var best=null;
      function tryLib(base,pre){
        for(var p=0;p<4;p++){ if(solved[p]) continue;
          for(var a=0;a<LIB_MOVES[p].length;a++){var ms=LIB_MOVES[p][a]; if(best && pre.length+ms.length>=best.moves.length) continue;
            var r=seq(base,ms); if(!crossOK(r)||!pairOK(r,p)) continue; var ok=true;
            for(var q=0;q<4;q++) if(solved[q]&&!pairOK(r,q)){ok=false;break;}
            if(ok) best={pair:p,moves:pre.concat(ms),state:r};}}
      }
      tryLib(st,[]);
      if(!best){ for(var q=0;q<4;q++){ if(solved[q]) continue; for(var x=0;x<3;x++){ tryLib(seq(st,EXTRACT[q][x]),EXTRACT[q][x]); } } }
      if(!best) return {steps:steps,error:'f2l'};
      st=best.state; steps.push({type:'f2l',pair:best.pair,moves:best.moves.map(function(m){return MOVE_NAMES[m];})});
    }
    return {steps:steps};
  }
  return {init:init, kociemba:kociemba, cfopF2L:cfopF2L, stickersToCubie:stickersToCubie, verify:verify, mul:mul, MC:MC, MOVE_NAMES:MOVE_NAMES, idCube:idCube, stToCubie:stToCubie, solvedSt:solvedSt, stMove:stMove};
})();


function SOLVER_HANDLE(d){
  try{
    if(d.cmd==='init'){SOLVER.init();return {id:d.id,ok:1};}
    var st=d.st, N={U:[0,1,0],D:[0,-1,0],R:[1,0,0],L:[-1,0,0],F:[0,0,1],B:[0,0,-1]};
    var get=function(f,p){var n=N[f];for(var i=0;i<st.length;i++){var t=st[i];if(t.p[0]===p[0]&&t.p[1]===p[1]&&t.p[2]===p[2]&&t.n[0]===n[0]&&t.n[1]===n[1]&&t.n[2]===n[2])return t.c;}return null;};
    var c=SOLVER.stickersToCubie(get);
    if(c.error) return {id:d.id,error:c.error,pos:c.pos,cols:c.cols};
    var v=SOLVER.verify(c); if(v) return {id:d.id,error:v};
    return {id:d.id, short:SOLVER.kociemba(c,{time:900}), cfop:SOLVER.cfopF2L(c)};
  }catch(err){ return {id:d.id,error:'crash',msg:String(err)}; }
}
if(typeof window==='undefined' && typeof self!=='undefined'){ self.onmessage=function(e){postMessage(SOLVER_HANDLE(e.data));}; }
