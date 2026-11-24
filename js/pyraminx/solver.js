// ===== Pyraminx solver: optimal (full distance table) + method steps =====
// Requires PYRA (model.js). Works in a Web Worker (importScripts) or main thread.
var PSOLVER=(function(){
  var ST=PYRA.ST, PERM=PYRA.PERM, FACES=PYRA.FACES;
  var VN=['U','L','R','B'];
  var MOVES=['U',"U'",'L',"L'",'R',"R'",'B',"B'"];
  // --- piece slots from sticker model ---
  var EDGE_KEYS=[]; ST.forEach(function(s){ if(s.type==='edge' && EDGE_KEYS.indexOf(s.e)<0) EDGE_KEYS.push(s.e); }); EDGE_KEYS.sort();
  var EDGE_ST=EDGE_KEYS.map(function(k){ var a=[]; ST.forEach(function(s,i){ if(s.e===k) a.push(i); }); a.sort(function(x,y){return ST[x].f-ST[y].f;}); return a; });
  var AX_ST=VN.map(function(v){ var a=[]; ST.forEach(function(s,i){ if(s.type==='center'&&s.v===v) a.push(i); }); a.sort(function(x,y){return ST[x].f-ST[y].f;}); return a; });
  var TIP_ST=VN.map(function(v){ var a=[]; ST.forEach(function(s,i){ if(s.type==='tip'&&s.v===v) a.push(i); }); a.sort(function(x,y){return ST[x].f-ST[y].f;}); return a; });
  var SOL=PYRA.solved();
  // edge move table: for move m, position i -> [j, flip]
  var EM={}, AM={};
  MOVES.forEach(function(m){ var p=PERM[m]; EM[m]=[]; AM[m]=[];
    EDGE_ST.forEach(function(sts,i){ var t0=p[sts[0]]; for(var j=0;j<6;j++){ var k=EDGE_ST[j].indexOf(t0); if(k>=0){ EM[m][i]=[j,k]; } } });
    AX_ST.forEach(function(sts,v){ var t0=p[sts[0]], k=sts.indexOf(t0); AM[m][v]=k<0?0:k; }); });
  // --- read pieces from a colour state ---
  function edgeColors(st,i){return EDGE_ST[i].map(function(x){return st[x];});}
  var EDGE_HOME=EDGE_ST.map(function(s){return s.map(function(x){return SOL[x];});});
  function readState(st){ // -> {ep:[piece at pos], eo:[], ao:[], to:[]} or {error}
    var ep=[],eo=[],ao=[],to=[];
    for(var i=0;i<6;i++){ var c=edgeColors(st,i), found=-1, o=0;
      for(var j=0;j<6;j++){ var h=EDGE_HOME[j]; if(c[0]===h[0]&&c[1]===h[1]){found=j;o=0;} else if(c[0]===h[1]&&c[1]===h[0]){found=j;o=1;} }
      if(found<0) return {error:'edge',pos:EDGE_KEYS[i]}; ep.push(found); eo.push(o); }
    function rotIdx(sts){ var c=sts.map(function(x){return st[x];}), h=sts.map(function(x){return SOL[x];});
      for(var k=0;k<3;k++){ if(c[0]===h[k]&&c[1]===h[(k+1)%3]&&c[2]===h[(k+2)%3]) return k; } return -1; }
    for(var v=0;v<4;v++){ var a=rotIdx(AX_ST[v]); if(a<0) return {error:'center',pos:VN[v]}; ao.push(a);
      var t=rotIdx(TIP_ST[v]); if(t<0) return {error:'tip',pos:VN[v]}; to.push(t); }
    return {ep:ep,eo:eo,ao:ao,to:to};
  }
  function verify(s){ var seen=[]; for(var i=0;i<6;i++){ if(seen[s.ep[i]]) return 'dupEdge'; seen[s.ep[i]]=1; }
    var f=0; s.eo.forEach(function(x){f+=x;}); if(f%2) return 'flip';
    var par=0; for(i=0;i<6;i++)for(var j=i+1;j<6;j++) if(s.ep[i]>s.ep[j]) par++; if(par%2) return 'parity'; return null; }
  // apply move at piece level
  function mv(s,m){ var ep=[],eo=[],ao=s.ao.slice(); var t=EM[m];
    for(var i=0;i<6;i++){ var j=t[i][0]; ep[j]=s.ep[i]; eo[j]=s.eo[i]^(t[i][1]); }
    for(var v=0;v<4;v++) ao[v]=(s.ao[v]+AM[m][v])%3; // placeholder; corrected below by sticker check
    return {ep:ep,eo:eo,ao:ao,to:s.to}; }
  // derive correct axial delta empirically via sticker states
  (function(){ MOVES.forEach(function(m){ var st=PYRA.applyMove(SOL.slice(),m), r=readState(st); for(var v=0;v<4;v++) AM[m][v]=r.ao[v]; }); })();
  (function(){ MOVES.forEach(function(m){ var st=PYRA.applyMove(SOL.slice(),m), r=readState(st), t=[];
      for(var i=0;i<6;i++){ var j=-1; for(var q=0;q<6;q++) if(r.ep[q]===i) j=q; t[i]=[j,r.eo[j]]; } EM[m]=t; }); })();
  // --- coordinates ---
  var FACT=[1,1,2,6,24,120,720];
  function permIdx(p){var n=p.length,idx=0;for(var i=0;i<n;i++){var c=0;for(var j=i+1;j<n;j++)if(p[j]<p[i])c++;idx+=c*FACT[n-1-i];}return idx;}
  function idxPerm(idx,n){var a=[],out=[];for(var i=0;i<n;i++)a.push(i);for(i=0;i<n;i++){var f=FACT[n-1-i],d=Math.floor(idx/f);idx%=f;out.push(a.splice(d,1)[0]);}return out;}
  function enc(s){var e=0;for(var i=0;i<6;i++)e=e*2+s.eo[i];var a=0;for(var v=0;v<4;v++)a=a*3+s.ao[v];return (permIdx(s.ep)*64+e)*81+a;}
  function dec(x){var a=x%81;x=(x-a)/81;var e=x%64,p=(x-e)/64;var ao=[],eo=[];for(var v=3;v>=0;v--){ao[v]=a%3;a=(a-ao[v])/3;}for(var i=5;i>=0;i--){eo[i]=e&1;e>>=1;}return {ep:idxPerm(p,6),eo:eo,ao:ao,to:[0,0,0,0]};}
  var DIST=null, PM, EOM, AOM;
  function init(){ if(DIST) return;
    PM=new Uint16Array(720*8); EOM=new Uint8Array(64*8); AOM=new Uint8Array(81*8);
    var k,i;
    for(i=0;i<720;i++){ var b={ep:idxPerm(i,6),eo:[0,0,0,0,0,0],ao:[0,0,0,0]}; for(k=0;k<8;k++) PM[i*8+k]=permIdx(mv(b,MOVES[k]).ep); }
    for(i=0;i<64;i++){ var eo=[],x=i; for(var q=5;q>=0;q--){eo[q]=x&1;x>>=1;} var b2={ep:[0,1,2,3,4,5],eo:eo,ao:[0,0,0,0]};
      for(k=0;k<8;k++){ var r=mv(b2,MOVES[k]).eo,e=0; for(q=0;q<6;q++) e=e*2+r[q]; EOM[i*8+k]=e; } }
    for(i=0;i<81;i++){ var ao=[],y=i; for(q=3;q>=0;q--){ao[q]=y%3;y=(y-ao[q])/3;} var b3={ep:[0,1,2,3,4,5],eo:[0,0,0,0,0,0],ao:ao};
      for(k=0;k<8;k++){ var r3=mv(b3,MOVES[k]).ao,a=0; for(q=0;q<4;q++) a=a*3+r3[q]; AOM[i*8+k]=a; } }
    DIST=new Int8Array(720*64*81).fill(-1); DIST[0]=0; var fr=new Int32Array([0]),d=0;
    while(fr.length){ var nx=[]; for(var f=0;f<fr.length;f++){ var x2=fr[f],a2=x2%81,t=(x2-a2)/81,e2=t%64,p2=(t-e2)/64;
        for(k=0;k<8;k++){ var n=(PM[p2*8+k]*64+EOM[e2*8+k])*81+AOM[a2*8+k]; if(DIST[n]<0){DIST[n]=d+1;nx.push(n);} } }
      fr=nx; d++; }
  }
  var TIP_FIX=VN.map(function(v,i){ var t=v.toLowerCase(), r=readState(PYRA.applyMove(SOL.slice(),t)); // move t gives orientation r.to[i]
    var undo1 = r.to[i]===1 ? t+"'" : t;   // to undo orientation 1
    var undo2 = r.to[i]===1 ? t : t+"'";   // to undo orientation 2
    return [null,undo1,undo2]; });
  function tipMoves(s){ var out=[]; for(var v=0;v<4;v++){ var o=((s.to[v]-s.ao[v])%3+3)%3; if(o) out.push(TIP_FIX[v][o]); } return out; }
  function optimal(s){ init(); var out=[], cur=s, g=0;
    while(DIST[enc(cur)]>0 && g++<20){ var dd=DIST[enc(cur)]; for(var k=0;k<8;k++){ var n=mv(cur,MOVES[k]); if(DIST[enc(n)]===dd-1){out.push(MOVES[k]); cur=n; break;} } }
    return out; }
  // generic subgoal search (IDA*) with predicate, using DIST as no heuristic (depth small)
  function searchGoal(s,goal,maxD,moves){ moves=moves||MOVES; var path=[];
    function dfs(c,d,last){ if(goal(c)) return true; if(d===0) return false;
      for(var k=0;k<moves.length;k++){ var m=moves[k]; if(last && last[0]===m[0]) continue; path.push(m); if(dfs(mv(c,m),d-1,m)) return true; path.pop(); } return false; }
    for(var d=0;d<=maxD;d++){ if(dfs(s,d,null)) return path.slice(); } return null; }

  // ---------- method solving ----------
  var LIB={"LL": [{"ep": [0, 1, 2, 3, 4, 5], "eo": [0, 0, 1, 0, 1, 0], "alg": "L U' R U' R' U L' U"}, {"ep": [0, 1, 2, 3, 4, 5], "eo": [0, 0, 1, 0, 0, 1], "alg": "R' U L' U L U' R U'"}, {"ep": [0, 1, 2, 3, 4, 5], "eo": [0, 0, 0, 0, 1, 1], "alg": "R U' R' U R' L R L'"}, {"ep": [0, 1, 4, 3, 5, 2], "eo": [0, 0, 0, 0, 0, 0], "alg": "R' U' L' U L R"}, {"ep": [0, 1, 4, 3, 5, 2], "eo": [0, 0, 1, 0, 1, 0], "alg": "R' U' R' L R L' U R"}, {"ep": [0, 1, 4, 3, 5, 2], "eo": [0, 0, 1, 0, 0, 1], "alg": "L R U R' U' L'"}, {"ep": [0, 1, 4, 3, 5, 2], "eo": [0, 0, 0, 0, 1, 1], "alg": "R U R' U R U R'"}, {"ep": [0, 1, 5, 3, 2, 4], "eo": [0, 0, 0, 0, 0, 0], "alg": "R' L' U' L U R"}, {"ep": [0, 1, 5, 3, 2, 4], "eo": [0, 0, 1, 0, 1, 0], "alg": "L U R U' R' L'"}, {"ep": [0, 1, 5, 3, 2, 4], "eo": [0, 0, 1, 0, 0, 1], "alg": "R U' R' U' R U' R'"}, {"ep": [0, 1, 5, 3, 2, 4], "eo": [0, 0, 0, 0, 1, 1], "alg": "R' U' L R' L' R U R"}], "L4E": [{"ep": [0, 1, 2, 3, 4, 5], "eo": [0, 0, 1, 1, 0, 0], "alg": "R U R' U L' U' L U'"}, {"ep": [0, 1, 2, 3, 4, 5], "eo": [0, 0, 0, 1, 1, 0], "alg": "R L' U L U' L R' L'"}, {"ep": [0, 1, 2, 3, 4, 5], "eo": [0, 0, 1, 0, 1, 0], "alg": "L U' R U' R' U L' U"}, {"ep": [0, 1, 2, 3, 4, 5], "eo": [0, 0, 0, 1, 0, 1], "alg": "R U R' L R' L' R U'"}, {"ep": [0, 1, 2, 3, 4, 5], "eo": [0, 0, 1, 0, 0, 1], "alg": "R' U L' U L U' R U'"}, {"ep": [0, 1, 2, 3, 4, 5], "eo": [0, 0, 0, 0, 1, 1], "alg": "R U' R' U R' L R L'"}, {"ep": [0, 1, 2, 3, 4, 5], "eo": [0, 0, 1, 1, 1, 1], "alg": "U L' U L R U' B U' B' R'"}, {"ep": [0, 1, 4, 3, 5, 2], "eo": [0, 0, 0, 0, 0, 0], "alg": "R' U' L' U L R"}, {"ep": [0, 1, 4, 3, 5, 2], "eo": [0, 0, 1, 1, 0, 0], "alg": "R U' R L R L U' L U'"}, {"ep": [0, 1, 4, 3, 5, 2], "eo": [0, 0, 0, 1, 1, 0], "alg": "L' U L R U R' U"}, {"ep": [0, 1, 4, 3, 5, 2], "eo": [0, 0, 1, 0, 1, 0], "alg": "R' U' R' L R L' U R"}, {"ep": [0, 1, 4, 3, 5, 2], "eo": [0, 0, 0, 1, 0, 1], "alg": "U' L' U L R U R' U'"}, {"ep": [0, 1, 4, 3, 5, 2], "eo": [0, 0, 1, 0, 0, 1], "alg": "L R U R' U' L'"}, {"ep": [0, 1, 4, 3, 5, 2], "eo": [0, 0, 0, 0, 1, 1], "alg": "R U R' U R U R'"}, {"ep": [0, 1, 4, 3, 5, 2], "eo": [0, 0, 1, 1, 1, 1], "alg": "U L' U L R U R'"}, {"ep": [0, 1, 5, 3, 2, 4], "eo": [0, 0, 0, 0, 0, 0], "alg": "R' L' U' L U R"}, {"ep": [0, 1, 5, 3, 2, 4], "eo": [0, 0, 1, 1, 0, 0], "alg": "U R U' R' L' U' L U"}, {"ep": [0, 1, 5, 3, 2, 4], "eo": [0, 0, 0, 1, 1, 0], "alg": "R' L R' L U L' R' L' U'"}, {"ep": [0, 1, 5, 3, 2, 4], "eo": [0, 0, 1, 0, 1, 0], "alg": "L U R U' R' L'"}, {"ep": [0, 1, 5, 3, 2, 4], "eo": [0, 0, 0, 1, 0, 1], "alg": "U' R U' R' L' U' L"}, {"ep": [0, 1, 5, 3, 2, 4], "eo": [0, 0, 1, 0, 0, 1], "alg": "R U' R' U' R U' R'"}, {"ep": [0, 1, 5, 3, 2, 4], "eo": [0, 0, 0, 0, 1, 1], "alg": "R' U' L R' L' R U R"}, {"ep": [0, 1, 5, 3, 2, 4], "eo": [0, 0, 1, 1, 1, 1], "alg": "R U' R' L' U' L U'"}, {"ep": [0, 1, 3, 2, 5, 4], "eo": [0, 0, 0, 0, 0, 0], "alg": "L R' L' R' U R' U'"}, {"ep": [0, 1, 3, 2, 5, 4], "eo": [0, 0, 1, 1, 0, 0], "alg": "R' L R L U' L U"}, {"ep": [0, 1, 3, 2, 5, 4], "eo": [0, 0, 0, 1, 1, 0], "alg": "R' L' R' U R L R U'"}, {"ep": [0, 1, 3, 2, 5, 4], "eo": [0, 0, 1, 0, 1, 0], "alg": "U R U' R' L' U L U'"}, {"ep": [0, 1, 3, 2, 5, 4], "eo": [0, 0, 0, 1, 0, 1], "alg": "U L' U' L R U R' U'"}, {"ep": [0, 1, 3, 2, 5, 4], "eo": [0, 0, 1, 0, 0, 1], "alg": "R U' R' U' L' U L U"}, {"ep": [0, 1, 3, 2, 5, 4], "eo": [0, 0, 0, 0, 1, 1], "alg": "R U' R' U R U R' U'"}, {"ep": [0, 1, 3, 2, 5, 4], "eo": [0, 0, 1, 1, 1, 1], "alg": "L' U L U' L' U' L U"}, {"ep": [0, 1, 4, 2, 3, 5], "eo": [0, 0, 0, 0, 0, 0], "alg": "U R U R' U"}, {"ep": [0, 1, 4, 2, 3, 5], "eo": [0, 0, 1, 1, 0, 0], "alg": "U' R' L R L' U"}, {"ep": [0, 1, 4, 2, 3, 5], "eo": [0, 0, 0, 1, 1, 0], "alg": "U' L' U L"}, {"ep": [0, 1, 4, 2, 3, 5], "eo": [0, 0, 1, 0, 1, 0], "alg": "L' U' L' R' L' R U"}, {"ep": [0, 1, 4, 2, 3, 5], "eo": [0, 0, 0, 1, 0, 1], "alg": "U' L' U' L U' R U' R' U"}, {"ep": [0, 1, 4, 2, 3, 5], "eo": [0, 0, 1, 0, 0, 1], "alg": "R U' R U' L' U L R U"}, {"ep": [0, 1, 4, 2, 3, 5], "eo": [0, 0, 0, 0, 1, 1], "alg": "U R U' R' U L' U' L"}, {"ep": [0, 1, 4, 2, 3, 5], "eo": [0, 0, 1, 1, 1, 1], "alg": "R U R L R L U' L"}, {"ep": [0, 1, 5, 2, 4, 3], "eo": [0, 0, 0, 0, 0, 0], "alg": "U L R' L' R U'"}, {"ep": [0, 1, 5, 2, 4, 3], "eo": [0, 0, 1, 1, 0, 0], "alg": "U' L' U' L U'"}, {"ep": [0, 1, 5, 2, 4, 3], "eo": [0, 0, 0, 1, 1, 0], "alg": "L' U L' U R U' R' L' U'"}, {"ep": [0, 1, 5, 2, 4, 3], "eo": [0, 0, 1, 0, 1, 0], "alg": "U R U R' U L' U L U'"}, {"ep": [0, 1, 5, 2, 4, 3], "eo": [0, 0, 0, 1, 0, 1], "alg": "R U R L R L' U'"}, {"ep": [0, 1, 5, 2, 4, 3], "eo": [0, 0, 1, 0, 0, 1], "alg": "U R U' R'"}, {"ep": [0, 1, 5, 2, 4, 3], "eo": [0, 0, 0, 0, 1, 1], "alg": "L' U' L' R' L' R' U R'"}, {"ep": [0, 1, 5, 2, 4, 3], "eo": [0, 0, 1, 1, 1, 1], "alg": "U' L' U L U' R U R'"}, {"ep": [0, 1, 3, 4, 2, 5], "eo": [0, 0, 0, 0, 0, 0], "alg": "U' R U' R' U'"}, {"ep": [0, 1, 3, 4, 2, 5], "eo": [0, 0, 1, 1, 0, 0], "alg": "L' U' L U"}, {"ep": [0, 1, 3, 4, 2, 5], "eo": [0, 0, 0, 1, 1, 0], "alg": "U' R' L R L U L"}, {"ep": [0, 1, 3, 4, 2, 5], "eo": [0, 0, 1, 0, 1, 0], "alg": "U' L R' L' R U"}, {"ep": [0, 1, 3, 4, 2, 5], "eo": [0, 0, 0, 1, 0, 1], "alg": "L' U L U' R U R' U'"}, {"ep": [0, 1, 3, 4, 2, 5], "eo": [0, 0, 1, 0, 0, 1], "alg": "U' R U R' U L' U L U"}, {"ep": [0, 1, 3, 4, 2, 5], "eo": [0, 0, 0, 0, 1, 1], "alg": "R U R L' U' L U R U'"}, {"ep": [0, 1, 3, 4, 2, 5], "eo": [0, 0, 1, 1, 1, 1], "alg": "L' U L' R' L' R' U' R'"}, {"ep": [0, 1, 2, 4, 5, 3], "eo": [0, 0, 0, 0, 0, 0], "alg": "R U' R' U' L' U' L"}, {"ep": [0, 1, 2, 4, 5, 3], "eo": [0, 0, 1, 1, 0, 0], "alg": "L R U R' U' L U' L U"}, {"ep": [0, 1, 2, 4, 5, 3], "eo": [0, 0, 0, 1, 1, 0], "alg": "L' U L U'"}, {"ep": [0, 1, 2, 4, 5, 3], "eo": [0, 0, 1, 0, 1, 0], "alg": "U' R U' R' U L' U' L U'"}, {"ep": [0, 1, 2, 4, 5, 3], "eo": [0, 0, 0, 1, 0, 1], "alg": "R' L R L'"}, {"ep": [0, 1, 2, 4, 5, 3], "eo": [0, 0, 1, 0, 0, 1], "alg": "U R U' R U' L' U L R"}, {"ep": [0, 1, 2, 4, 5, 3], "eo": [0, 0, 0, 0, 1, 1], "alg": "U' R U R'"}, {"ep": [0, 1, 2, 4, 5, 3], "eo": [0, 0, 1, 1, 1, 1], "alg": "L' U' L U' R U' R'"}, {"ep": [0, 1, 5, 4, 3, 2], "eo": [0, 0, 0, 0, 0, 0], "alg": "U L R' L' R' U R' U"}, {"ep": [0, 1, 5, 4, 3, 2], "eo": [0, 0, 1, 1, 0, 0], "alg": "L' U L R U' R'"}, {"ep": [0, 1, 5, 4, 3, 2], "eo": [0, 0, 0, 1, 1, 0], "alg": "R' U' L' U L' R L'"}, {"ep": [0, 1, 5, 4, 3, 2], "eo": [0, 0, 1, 0, 1, 0], "alg": "U R U' R' U' L' U L"}, {"ep": [0, 1, 5, 4, 3, 2], "eo": [0, 0, 0, 1, 0, 1], "alg": "L R L U L' R' L' U'"}, {"ep": [0, 1, 5, 4, 3, 2], "eo": [0, 0, 1, 0, 0, 1], "alg": "R U R' U' R U' R' U"}, {"ep": [0, 1, 5, 4, 3, 2], "eo": [0, 0, 0, 0, 1, 1], "alg": "R U R' L' U' L"}, {"ep": [0, 1, 5, 4, 3, 2], "eo": [0, 0, 1, 1, 1, 1], "alg": "R U R' U' L R' L' R"}, {"ep": [0, 1, 3, 5, 4, 2], "eo": [0, 0, 0, 0, 0, 0], "alg": "U R' L R L' U'"}, {"ep": [0, 1, 3, 5, 4, 2], "eo": [0, 0, 1, 1, 0, 0], "alg": "U L R' L' R' U' R'"}, {"ep": [0, 1, 3, 5, 4, 2], "eo": [0, 0, 0, 1, 1, 0], "alg": "R U' R L R L U L"}, {"ep": [0, 1, 3, 5, 4, 2], "eo": [0, 0, 1, 0, 1, 0], "alg": "L' U' L' R U R' U' L' U"}, {"ep": [0, 1, 3, 5, 4, 2], "eo": [0, 0, 0, 1, 0, 1], "alg": "R U R' U'"}, {"ep": [0, 1, 3, 5, 4, 2], "eo": [0, 0, 1, 0, 0, 1], "alg": "U L' U L U"}, {"ep": [0, 1, 3, 5, 4, 2], "eo": [0, 0, 0, 0, 1, 1], "alg": "U L' U' L U' R U' R' U'"}, {"ep": [0, 1, 3, 5, 4, 2], "eo": [0, 0, 1, 1, 1, 1], "alg": "R U' R' U L' U' L U"}, {"ep": [0, 1, 2, 5, 3, 4], "eo": [0, 0, 0, 0, 0, 0], "alg": "R' L R L U L U'"}, {"ep": [0, 1, 2, 5, 3, 4], "eo": [0, 0, 1, 1, 0, 0], "alg": "R U R' U R' L R L' U"}, {"ep": [0, 1, 2, 5, 3, 4], "eo": [0, 0, 0, 1, 1, 0], "alg": "L R' L' R"}, {"ep": [0, 1, 2, 5, 3, 4], "eo": [0, 0, 1, 0, 1, 0], "alg": "U R' L R L' U L' U L"}, {"ep": [0, 1, 2, 5, 3, 4], "eo": [0, 0, 0, 1, 0, 1], "alg": "R U' R' U"}, {"ep": [0, 1, 2, 5, 3, 4], "eo": [0, 0, 1, 0, 0, 1], "alg": "U L' U L U' R U R' U"}, {"ep": [0, 1, 2, 5, 3, 4], "eo": [0, 0, 0, 0, 1, 1], "alg": "U L' U' L"}, {"ep": [0, 1, 2, 5, 3, 4], "eo": [0, 0, 1, 1, 1, 1], "alg": "R U R' U L' U L"}, {"ep": [0, 1, 4, 5, 2, 3], "eo": [0, 0, 0, 0, 0, 0], "alg": "L' U' L U L' U L U'"}, {"ep": [0, 1, 4, 5, 2, 3], "eo": [0, 0, 1, 1, 0, 0], "alg": "R U R' U' L' U' L U"}, {"ep": [0, 1, 4, 5, 2, 3], "eo": [0, 0, 0, 1, 1, 0], "alg": "R U' R' L' U L"}, {"ep": [0, 1, 4, 5, 2, 3], "eo": [0, 0, 1, 0, 1, 0], "alg": "U L' U L' R' L' R U"}, {"ep": [0, 1, 4, 5, 2, 3], "eo": [0, 0, 0, 1, 0, 1], "alg": "R U R' U R U' R' U'"}, {"ep": [0, 1, 4, 5, 2, 3], "eo": [0, 0, 1, 0, 0, 1], "alg": "L' U' L R U R'"}, {"ep": [0, 1, 4, 5, 2, 3], "eo": [0, 0, 0, 0, 1, 1], "alg": "U' R' L' R' U R L R"}, {"ep": [0, 1, 4, 5, 2, 3], "eo": [0, 0, 1, 1, 1, 1], "alg": "R U' R L R L' U"}]};
  function idx(k){return EDGE_KEYS.indexOf(k);}
  function edgesOK(s,keys){for(var i=0;i<keys.length;i++){var j=idx(keys[i]);if(s.ep[j]!==j||s.eo[j])return false;}return true;}
  function axOK(s,vs){for(var i=0;i<vs.length;i++){if(s.ao[VN.indexOf(vs[i])])return false;}return true;}
  // BFS over partial goal (hash of relevant pieces), returns shortest move list
  function partialSolve(s,keys,vs){
    function h(c){var o=[];keys.forEach(function(k){var piece=idx(k);for(var j=0;j<6;j++)if(c.ep[j]===piece){o.push(j,c.eo[j]);}});vs.forEach(function(v){o.push(c.ao[VN.indexOf(v)]);});return o.join(',');}
    if(edgesOK(s,keys)&&axOK(s,vs)) return [];
    var seen={}; seen[h(s)]=1; var fr=[{c:s,p:[]}];
    for(var d=0;d<12;d++){var nx=[];for(var q=0;q<fr.length;q++){for(var k=0;k<8;k++){var m=MOVES[k],c=mv(fr[q].c,m),hk=h(c);if(seen[hk])continue;seen[hk]=1;var p=fr[q].p.concat([m]);if(edgesOK(c,keys)&&axOK(c,vs))return p;nx.push({c:c,p:p});}}fr=nx;}
    return null;
  }
  function seq(s,ms){for(var i=0;i<ms.length;i++)s=mv(s,ms[i]);return s;}
  function matchLib(s,list,pre){ // try pre-moves then library alg; returns {pre,alg,i}
    for(var a=0;a<pre.length;a++){ var s1=seq(s,pre[a]); if(enc(s1)===0) return {pre:pre[a],alg:null};
      for(var i=0;i<list.length;i++){ var al=list[i].alg.split(' '); if(enc(seq(s1,al))===0) return {pre:pre[a],alg:list[i].alg,i:i}; } }
    return null;
  }
  function methodSolve(s,method){
    var steps=[], tips=tipMoves(s); s={ep:s.ep.slice(),eo:s.eo.slice(),ao:s.ao.slice(),to:[0,0,0,0]};
    steps.push({key:'tips',moves:tips});
    if(method==='lbl'){
      var a=partialSolve(s,['BL','BR','LR'],['L','R','B']); if(!a) return null; steps.push({key:'layer1',moves:a}); s=seq(s,a);
      var r=matchLib(s,LIB.LL,[[],['U'],["U'"]]); if(!r) return null;
      if(r.pre.length) steps.push({key:'align',moves:r.pre});
      if(r.alg) steps.push({key:'ll',moves:r.alg.split(' '),caseIdx:r.i});
    } else if(method==='l4e'){
      var c=[]; ['U','L','R','B'].forEach(function(v,vi){var o=s.ao[vi]; if(o){ var m1=v, m2=v+"'"; var t1=mv(s,m1); c.push(t1.ao[vi]===0?m1:m2); s=mv(s,c[c.length-1]); }});
      steps.push({key:'centers',moves:c});
      var vv=partialSolve(s,['BL','BR'],['U','L','R','B']); if(!vv) return null; steps.push({key:'v',moves:vv}); s=seq(s,vv);
      var r2=matchLib(s,LIB.L4E,[[]]); if(!r2) return null;
      if(r2.alg) steps.push({key:'l4e',moves:r2.alg.split(' '),caseIdx:r2.i});
    }
    return steps;
  }
  return {init:init, methodSolve:methodSolve, LIB:LIB, readState:readState, verify:verify, mv:mv, enc:enc, dec:dec, optimal:optimal, tipMoves:tipMoves, searchGoal:searchGoal, MOVES:MOVES, EDGE_KEYS:EDGE_KEYS, VN:VN, dist:function(s){init();return DIST[enc(s)];}};
})();
if(typeof module!=='undefined') module.exports=PSOLVER;
