// ===== 2x2 solver (optimal, full distance table) — needs cube3/model.js =====
// 2x2 = corner stickers of the 3x3 model. DBL corner is kept fixed; moves U, R, F.
var C2=(function(){
  var N={U:[0,1,0],D:[0,-1,0],R:[1,0,0],L:[-1,0,0],F:[0,0,1],B:[0,0,-1]};
  var CORN=[[[1,1,1],'URF'],[[-1,1,1],'UFL'],[[-1,1,-1],'ULB'],[[1,1,-1],'UBR'],[[1,-1,1],'DFR'],[[-1,-1,1],'DLF'],[[-1,-1,-1],'DBL'],[[1,-1,-1],'DRB']];
  var SCH=SCHEME_LL;
  function solved(){return solvedCube().filter(function(t){return t.p.every(function(v){return v!==0;});});}
  var HOME=CORN.map(function(c){return c[1].split('').map(function(f){return SCH[f];});});
  function readCubie(st){ var cp=[],co=[];
    for(var i=0;i<8;i++){ var fs=CORN[i][1].split(''), p=CORN[i][0];
      var cols=fs.map(function(f){var t=stk(st,p,N[f]); return t?t.c:null;});
      var ori=-1; for(var k=0;k<3;k++) if(cols[k]===SCH.U||cols[k]===SCH.D) ori=k;
      if(ori<0) return {error:'corner',pos:CORN[i][1]};
      var piece=-1; for(var j=0;j<8;j++){var h=HOME[j]; if(cols[ori]===h[0]&&cols[(ori+1)%3]===h[1]&&cols[(ori+2)%3]===h[2]) piece=j;}
      if(piece<0) return {error:'corner',pos:CORN[i][1]};
      cp.push(piece); co.push(ori); }
    var seen=[]; for(i=0;i<8;i++){ if(seen[cp[i]]) return {error:'dup'}; seen[cp[i]]=1; }
    var tw=0; co.forEach(function(v){tw+=v;}); if(tw%3) return {error:'twist'};
    return {cp:cp,co:co};
  }
  // whole-cube rotations: find one putting the DBL piece home
  var ROTS=(function(){ var seen={},out=[],q=[''],base=solved();
    function key(st){return CORN.map(function(c){return c[1].split('').map(function(f){var t=stk(st,c[0],N[f]);return t.c;}).join('');}).join('|');}
    while(q.length&&out.length<24){ var r=q.shift(), st=apply(cloneSt(base),r), k=key(st); if(seen[k]) continue; seen[k]=1; out.push(r.trim());
      ['x','y','z'].forEach(function(m){q.push((r+' '+m).trim());}); }
    return out; })();
  function normalize(st){ // returns {rot, st}
    for(var i=0;i<ROTS.length;i++){ var s=ROTS[i]?apply(cloneSt(st),ROTS[i]):st;
      var cols=['D','B','L'].map(function(f){var t=stk(s,[-1,-1,-1],N[f]);return t&&t.c;});
      if(cols[0]===SCH.D&&cols[1]===SCH.B&&cols[2]===SCH.L) return {rot:ROTS[i],st:s}; }
    return null; }
  var MV=['U','U2',"U'",'R','R2',"R'",'F','F2',"F'"];
  var MC=MV.map(function(m){return readCubie(apply(solved(),m));});
  var POS=[0,1,2,3,4,5,7];
  var FACT=[1,1,2,6,24,120,720,5040];
  function permIdx(a){var n=a.length,x=0;for(var i=0;i<n;i++){var c=0;for(var j=i+1;j<n;j++)if(a[j]<a[i])c++;x+=c*FACT[n-1-i];}return x;}
  function idxPerm(x,n){var av=[],o=[];for(var i=0;i<n;i++)av.push(i);for(i=0;i<n;i++){var f=FACT[n-1-i],d=Math.floor(x/f);x%=f;o.push(av.splice(d,1)[0]);}return o;}
  function rel(p){return p===7?6:p;} function unrel(v){return v===6?7:v;}
  function enc(c){ var pa=POS.map(function(p){return rel(c.cp[p]);}); var t=0; for(var i=0;i<6;i++) t=t*3+c.co[POS[i]]; return permIdx(pa)*729+t; }
  function mul(a,b){var r={cp:[],co:[]};for(var i=0;i<8;i++){r.cp[i]=a.cp[b.cp[i]];r.co[i]=(a.co[b.cp[i]]+b.co[i])%3;}return r;}
  function decCube(x){ var t=x%729,p=(x-t)/729, pa=idxPerm(p,7), c={cp:[0,1,2,3,4,5,6,7],co:[0,0,0,0,0,0,0,0]};
    POS.forEach(function(pos,i){c.cp[pos]=unrel(pa[i]);}); var s=0; for(var i=5;i>=0;i--){c.co[POS[i]]=t%3;s+=c.co[POS[i]];t=(t-t%3)/3;} c.co[7]=(3-s%3)%3; return c; }
  var PM,TM,DIST=null;
  function init(){ if(DIST) return; PM=new Uint16Array(5040*9); TM=new Uint16Array(729*9);
    for(var i=0;i<5040;i++){ var c=decCube(i*729); for(var m=0;m<9;m++) PM[i*9+m]=Math.floor(enc(mul(c,MC[m]))/729); }
    for(i=0;i<729;i++){ var c2=decCube(i); for(m=0;m<9;m++) TM[i*9+m]=enc(mul(c2,MC[m]))%729; }
    DIST=new Int8Array(5040*729).fill(-1); DIST[0]=0; var fr=[0],d=0;
    while(fr.length){var nx=[];for(var q=0;q<fr.length;q++){var x=fr[q],t=x%729,p=(x-t)/729;for(var k=0;k<9;k++){var n=PM[p*9+k]*729+TM[t*9+k];if(DIST[n]<0){DIST[n]=d+1;nx.push(n);}}}fr=nx;d++;}
  }
  function optimalIdx(x){ init(); var out=[],g=0; while(DIST[x]>0&&g++<20){ var d=DIST[x],t=x%729,p=(x-t)/729; for(var k=0;k<9;k++){var n=PM[p*9+k]*729+TM[t*9+k]; if(DIST[n]===d-1){out.push(MV[k]); x=n; break;}} } return out; }
  function solveSt(st){ // full: returns {rot, moves} or {error}
    var nz=normalize(st); if(!nz) return {error:'corner'};
    var c=readCubie(nz.st); if(c.error) return c;
    return {rot:nz.rot, moves:optimalIdx(enc(c))};
  }
  function dist(st){init(); var c=readCubie(st); return c.error?-1:DIST[enc(c)];}
  return {init:init, solved:solved, readCubie:readCubie, normalize:normalize, solveSt:solveSt, optimalIdx:optimalIdx, enc:enc, dist:dist, MV:MV, ROTS:ROTS};
})();
