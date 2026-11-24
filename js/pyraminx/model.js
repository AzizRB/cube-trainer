// ===== Pyraminx model =====
// Vertices: U (top), L (front-left), R (front-right), B (back). Faces: F(U,L,R) green, Lf(U,L,B) red, Rf(U,R,B) blue, D(L,R,B) yellow.
// 36 stickers (9 per face). Moves: U L R B (large, 120° clockwise looking at the vertex), u l r b (tips only), with ' and 2? (Pyraminx uses only ').
var PYRA = (function(){
  var s8=Math.sqrt(8)/3, r3=Math.sqrt(6)/3;
  var V={U:[0,1,0], L:[-r3,-1/3,s8/2], R:[r3,-1/3,s8/2], B:[0,-1/3,-s8]};
  // faces: [name, colour, vertex order (counter-clockwise seen from outside)]
  var FACES=[['F','G',['U','L','R']],['L','R',['U','B','L']],['R','B',['U','R','B']],['D','Y',['L','B','R']]];
  function add(a,b){return [a[0]+b[0],a[1]+b[1],a[2]+b[2]];}
  function mul(a,k){return [a[0]*k,a[1]*k,a[2]*k];}
  function dot(a,b){return a[0]*b[0]+a[1]*b[1]+a[2]*b[2];}
  function bary(P,i,j,k){return add(add(mul(P[0],i/3),mul(P[1],j/3)),mul(P[2],k/3));}
  // build stickers: each with face index, triangle corners (3D), centroid, type, piece vertex/edge
  var ST=[];
  FACES.forEach(function(f,fi){ var P=f[2].map(function(n){return V[n];});
    for(var i=0;i<=2;i++)for(var j=0;j<=2-i;j++){var k=2-i-j; // up triangles
      var tri=[bary(P,i+1,j,k),bary(P,i,j+1,k),bary(P,i,j,k+1)];
      var type=(i===2||j===2||k===2)?'tip':'edge';
      var vtx=i===2?f[2][0]:j===2?f[2][1]:k===2?f[2][2]:null;
      var ev=type==='edge'?[i===0?null:f[2][0],j===0?null:f[2][1],k===0?null:f[2][2]].filter(Boolean).sort().join(''):null;
      ST.push({f:fi,tri:tri,type:type,v:vtx,e:ev,bar:[[i+1,j,k],[i,j+1,k],[i,j,k+1]]});}
    for(i=0;i<=1;i++)for(j=0;j<=1-i;j++){k=1-i-j; // down triangles = axial centres
      var tri2=[bary(P,i,j+1,k+1),bary(P,i+1,j,k+1),bary(P,i+1,j+1,k)];
      var vx=i===1?f[2][0]:j===1?f[2][1]:f[2][2];
      ST.push({f:fi,tri:tri2,type:'center',v:vx,e:null,bar:[[i,j+1,k+1],[i+1,j,k+1],[i+1,j+1,k]]});}
  });
  ST.forEach(function(s){s.c=mul(add(add(s.tri[0],s.tri[1]),s.tri[2]),1/3);});
  function rotate(p,axis,ang){ // Rodrigues
    var c=Math.cos(ang),s=Math.sin(ang),k=axis,d=dot(k,p);
    var cr=[k[1]*p[2]-k[2]*p[1],k[2]*p[0]-k[0]*p[2],k[0]*p[1]-k[1]*p[0]];
    return [p[0]*c+cr[0]*s+k[0]*d*(1-c),p[1]*c+cr[1]*s+k[1]*d*(1-c),p[2]*c+cr[2]*s+k[2]*d*(1-c)];
  }
  function nearest(p){var bi=-1,bd=1e9;for(var i=0;i<ST.length;i++){var q=ST[i].c,d=(q[0]-p[0])*(q[0]-p[0])+(q[1]-p[1])*(q[1]-p[1])+(q[2]-p[2])*(q[2]-p[2]);if(d<bd){bd=d;bi=i;}}return bi;}
  // layer membership: height along vertex axis; cuts at 1/9 (large) and 5/9 (tip)
  function inLayer(s,vn,tipOnly){return dot(s.c,V[vn])>(tipOnly?5/9:1/9);}
  // permutations: perm[i] = index where sticker i goes
  var PERM={};
  ['U','L','R','B'].forEach(function(vn){ [false,true].forEach(function(tip){
    var name=tip?vn.toLowerCase():vn, p=[];
    for(var i=0;i<ST.length;i++){ p[i]= inLayer(ST[i],vn,tip) ? nearest(rotate(ST[i].c,V[vn],-2*Math.PI/3)) : i; }
    PERM[name]=p;
    var p2=[]; for(i=0;i<ST.length;i++) p2[i]=p[p[i]]; PERM[name+"'"]=p2;
  });});
  function solved(){return ST.map(function(s){return FACES[s.f][1];});}
  function applyMove(st,m){var p=PERM[m]; if(!p) throw new Error('bad move '+m); var out=new Array(st.length); for(var i=0;i<st.length;i++) out[p[i]]=st[i]; return out;}
  function tokens(alg){return alg.trim().split(/\s+/).filter(Boolean);}
  function apply(st,alg){tokens(alg).forEach(function(t){st=applyMove(st,t);}); return st;}
  function invert(alg){return tokens(alg).reverse().map(function(t){return t.slice(-1)==="'"?t.slice(0,-1):t+"'";}).join(' ');}
  function isSolved(st){for(var f=0;f<4;f++){var c=null;for(var i=0;i<36;i++)if(ST[i].f===f){if(c===null)c=st[i];else if(st[i]!==c)return false;}}return true;}
  return {V:V,FACES:FACES,ST:ST,PERM:PERM,rotate:rotate,dot:dot,inLayer:inLayer,solved:solved,applyMove:applyMove,apply:apply,invert:invert,tokens:tokens,isSolved:isSolved};
})();
if(typeof module!=='undefined') module.exports=PYRA;
