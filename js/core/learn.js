// ===== Shared lesson cards, player and exam engine =====
// A puzzle "adapter" A provides: id, solved(), apply(st,alg)->new st, invert(alg), tokens(alg), pic(st,view,size),
// make3D(host,st,opts), moves[], valid(tok), goal(type,st), goalText(type)->[uz,en], simLoad(setup,sol), startExam(level,step)
var LEARN=(function(){
  const esc=s=>String(s).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;');
  const T=a=>Array.isArray(a)?L(a[0],a[1]):a;
  const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
  let A=null; // current adapter

  // ---------- lesson cards ----------
  function caseBlock(c){
    const setup=c.setup!=null?c.setup:A.invert(c.sol);
    const before=A.apply(A.solved(),setup), after=A.apply(before,c.sol), sz=c.size||104;
    return `<div class="lcase">
      ${c.name?`<div class="nm">${T(c.name)}</div>`:''}${c.hint?`<div class="hint">${T(c.hint)}</div>`:''}
      <div class="ba"><figure>${A.pic(before,c.view,sz)}<figcaption>${L('Holat','Case')}</figcaption></figure><span class="arr">→</span><figure>${A.pic(after,c.afterView||c.view,sz)}<figcaption>${L('Natija','Result')}</figcaption></figure></div>
      <div class="lrow"><span class="k">${L('Yechim','Solution')}</span><span><code>${c.sol||'—'}</code></span>${c.sol?`<button class="cp ghost" data-copy="${esc(c.sol)}" title="${L('Nusxa','Copy')}">⧉</button>`:'<span></span>'}</div>
      <div class="lrow"><span class="k">${L('Hosil qilish','Set up')}</span><span><code>${setup||'—'}</code></span>${setup?`<button class="cp ghost" data-copy="${esc(setup)}" title="${L('Nusxa','Copy')}">⧉</button>`:'<span></span>'}</div>
      <div class="lbtns"><button data-lplay="${esc(setup)}" data-lsol="${esc(c.sol)}" data-ltitle="${esc(T(c.name||''))}">▶ ${L("Ko'rish",'Watch')}</button></div>
    </div>`;
  }
  function stepCard(s,i,level){
    const g=s.goal?`<div class="lgoal">${A.pic(A.apply(A.solved(),s.goal.setup||''),s.goal.view,s.goal.size||92)}${L('Maqsad','Goal')}</div>`:'<span></span>';
    const sec=(title,list)=>list&&list.length?`<div class="lsub">${T(title)}</div><div class="lcases">${list.map(caseBlock).join('')}</div>`:'';
    return `<article class="lstep" id="ls-${s.id}">
      <div class="lhead"><span class="lnum">${i}</span><div><h3>${T(s.title)}</h3><p>${T(s.text)}</p>${s.extra?`<div style="margin-top:10px">${T(s.extra)}</div>`:''}</div>${g}</div>
      ${sec(s.exTitle||[`Misollar`,`Examples`],s.examples)}
      ${sec(s.caseTitle||[`Holatlar va formulalar`,`Cases and algorithms`],s.cases)}
      ${s.exam!==false?`<div class="lfoot"><span class="muted">${L("Tushundingizmi? O'zingizni sinab ko'ring.","Got it? Test yourself.")}</span><button class="pri" data-lmini="${level}|${s.id}">📝 ${L('Mini-test','Mini test')}</button></div>`:''}
    </article>`;
  }
  function lessonHTML(level){
    const nav=level.steps.length>2?`<div class="lnav">${level.steps.map((s,i)=>`<a href="javascript:void 0" data-lgo="ls-${s.id}">${i+1}. ${T(s.short||s.title)}</a>`).join('')}</div>`:'';
    return `${level.intro?`<div class="lintro">${T(level.intro)}</div>`:''}${nav}<div class="lsteps">${level.steps.map((s,i)=>stepCard(s,i+1,level.id)).join('')}</div>`;
  }

  // ---------- player ----------
  function modal(){ let m=document.getElementById('lmodal'); if(!m){ m=document.createElement('div'); m.id='lmodal'; m.className='lmodal'; m.innerHTML='<div class="box"></div>'; document.body.appendChild(m); m.addEventListener('click',e=>{if(e.target===m) closeModal();}); } return m; }
  function closeModal(){ const m=document.getElementById('lmodal'); if(m) m.classList.remove('on'); if(PL){PL.playing=false; if(PL.t) clearInterval(PL.t);} }
  const ICO={first:'<svg viewBox="0 0 24 24"><path d="M6 5v14M19 5 9 12l10 7z" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>',
    prev:'<svg viewBox="0 0 24 24"><path d="M15 5 7 12l8 7z" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>',
    next:'<svg viewBox="0 0 24 24"><path d="M9 5l8 7-8 7z" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>',
    play:'<svg viewBox="0 0 24 24"><path d="M7 4.5 19.5 12 7 19.5z" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>',
    pause:'<svg viewBox="0 0 24 24"><rect x="6" y="5" width="4" height="14" rx="1" fill="currentColor"/><rect x="14" y="5" width="4" height="14" rx="1" fill="currentColor"/></svg>',
    again:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12a8 8 0 1 0 2.4-5.7M4 4v5h5"/></svg>'};
  let PL=null;
  function openPlayer(setup,sol,title){
    if(PL&&PL.t) clearInterval(PL.t);
    const m=modal(), box=m.firstChild, toks=A.tokens(sol||''); const start=()=>A.apply(A.solved(),setup||'');
    box.innerHTML=`<div class="row" style="display:flex;justify-content:space-between;align-items:center"><h3 style="margin:0">${title||''}</h3><button class="ghost lpb" data-lclose aria-label="close">✕</button></div>
      ${A.orient?`<div class="lorient">${T(A.orient)}</div>`:''}<div class="lpc" style="margin:8px 0"></div><div class="ltok"></div>
      <div class="lpbar"><button class="lpb" data-p="0" title="${L('Boshidan','Restart')}">${ICO.first}</button><button class="lpb" data-p="-1" title="${L('Orqaga','Back')}">${ICO.prev}</button><button class="lpb pri big" data-p="play"></button><button class="lpb" data-p="1" title="${L('Bitta harakat','One move')}">${ICO.next}</button></div>`;
    const cube=A.make3D(box.querySelector('.lpc'),start(),{height:240,dur:()=>420});
    const P=PL={i:0,playing:false,t:null,wait:0};
    const draw=()=>{box.querySelector('.ltok').innerHTML=toks.length?toks.map((t,k)=>`<span class="${k<P.i?'done':k===P.i&&P.i<toks.length?'cur':''}">${t}</span>`).join(''):`<span>${L("Bu holat allaqachon yig'ilgan","Already solved")}</span>`;
      const pb=box.querySelector('[data-p="play"]'); pb.innerHTML=P.playing?ICO.pause:P.i>=toks.length&&toks.length?ICO.again:ICO.play; pb.title=P.playing?L('Pauza','Pause'):L("O'ynatish",'Play');};
    const reset=()=>{P.i=0; cube.setState(start());};
    const play=()=>{ if(!toks.length) return; if(P.i>=toks.length) reset(); P.playing=true; P.wait=Date.now()+(P.i===0?450:0); draw(); };
    P.t=setInterval(()=>{ if(!document.body.contains(box)||!m.classList.contains('on')){clearInterval(P.t);return;}
      if(!P.playing||cube.busy||Date.now()<P.wait) return;
      if(P.i>=toks.length){P.playing=false; draw(); return;}
      cube.enqueue([toks[P.i]],false); P.i++; P.wait=Date.now()+460; draw(); },60);
    box.querySelectorAll('[data-p]').forEach(b=>b.onclick=()=>{const p=b.dataset.p;
      if(p==='play'){ P.playing?(P.playing=false):play(); }
      else { P.playing=false;
        if(p==='0') reset();
        else if(p==='1'){ if(P.i<toks.length&&!cube.busy){cube.enqueue([toks[P.i]],false); P.i++;} }
        else if(p==='-1'){ if(P.i>0&&!cube.busy){P.i--; cube.enqueue([A.invert(toks[P.i])],false);} } }
      draw(); });
    box.querySelector('[data-lclose]').onclick=closeModal;
    draw(); m.classList.add('on'); play();
  }

  // ---------- exam ----------
  const KEY=()=>'learn.'+A.id;
  function results(){ try{return JSON.parse(localStorage.getItem(KEY()))||{};}catch(e){return {};} }
  function saveResult(k,pct){ const r=results(); if(!(k in r)||pct>r[k]) r[k]=pct; try{localStorage.setItem(KEY(),JSON.stringify(r));}catch(e){} }
  function best(k){ const r=results(); return k in r?r[k]:null; }
  let X=null; // running exam
  function examHome(host,levels){
    X=null;
    host.innerHTML=`<h1>${L('Imtihon','Exam')}</h1><p class="lead">${L("O'rganganingizni tekshiring: holatni tanish, formulani tanlash, simulyatorda yoki haqiqiy kubda yechish. 80% va undan yuqori — daraja o'tilgan hisoblanadi.","Check what you've learned: recognise cases, pick algorithms, solve in the simulator or on your real puzzle. 80% or more passes the level.")}</p>
      <div class="xhome">${levels.map(lv=>{const b=best(lv.id+'|all'); return `<div class="xlvl"><div class="top"><span class="lnum" style="background:${lv.color||'var(--accent)'}">${lv.num}</span><div><h3>${T(lv.name)}</h3><div class="muted" style="font-size:13px">${lv.steps.length} ${L('qadam','steps')} · 10 ${L('savol','questions')}</div></div>
        <div class="score">${b!=null?`<b>${b}%</b>${b>=80?`<span class="badge">✓ ${L("O'tdi",'Passed')}</span>`:L('eng yaxshi','best')}`:L('hali topshirilmagan','not taken yet')}</div></div>
        <div class="xbar"><button class="pri" data-xstart="${lv.id}|">📝 ${L('Imtihonni boshlash','Start exam')}</button><span class="muted" style="font-size:13px">${L('yoki bitta qadam:','or one step:')}</span></div>
        <div class="xmini">${lv.steps.map(s=>{const sb=best(lv.id+'|'+s.id); return `<button data-xstart="${lv.id}|${s.id}">${T(s.short||s.title)}${sb!=null?` · ${sb}%`:''}</button>`;}).join('')}</div></div>`;}).join('')}</div>`;
    host.querySelectorAll('[data-xstart]').forEach(b=>b.onclick=()=>{const [l,s]=b.dataset.xstart.split('|'); A.startExam(l,s||null);});
  }
  function startExam(host,cfg){ // cfg: {key,title,questions,onExit}
    X={host,cfg,qs:cfg.questions,i:0,res:[],t0:Date.now()}; renderQ();
  }
  function prog(){ return `<div class="xprog">${X.qs.map((q,k)=>{const r=X.res[k]; return `<i class="${r==null?(k===X.i?'cur':''):r===1?'ok':r===.5?'half':'no'}"></i>`;}).join('')}</div>`; }
  const KIND={name:['Holatni tani','Recognise the case'],alg:['Formulani tanla','Pick the algorithm'],sim:['Simulyatorda yech','Solve in the simulator'],real:['Haqiqiy kub bilan','On your real puzzle']};
  function renderQ(){
    const q=X.qs[X.i], st=A.apply(A.solved(),q.setup||''); X.cur={hint:false,shown:false,done:false};
    let body='';
    if(q.kind==='name'||q.kind==='alg'){
      body=`<div class="xpic">${A.pic(st,q.view,q.kind==='name'?220:200)}</div><div class="xopts">${q.options.map((o,k)=>`<button data-xo="${k}">${q.kind==='alg'?`<code>${o}</code>`:esc(o)}</button>`).join('')}</div>`;
    } else if(q.kind==='sim'){
      body=`<div class="xsim"></div><div class="xmoves">${A.moves.map(m=>`<button data-xm="${m}">${m}</button>`).join('')}</div>
        <div class="xin"><input class="xinp" placeholder="${L('Formula yozing','Type moves')}: R U R' U'" autocomplete="off" spellcheck="false"><button class="pri" data-xrun>▶</button><button data-xundo title="${L('Orqaga','Undo')}">↶</button><button data-xreset title="${L('Boshidan','Restart')}">⟲</button></div>`;
    } else if(q.kind==='real'){
      body=`<div class="xpic">${A.pic(st,q.view||'full',180)}</div>
        <div class="xsol">1) ${L('Kubingizni yig\'ilgan holatga keltiring','Start from a solved puzzle')}. 2) ${L('Shu formulani bajaring','Apply this setup')}: <code>${q.setup}</code> ${`<button class="ghost" data-copy="${esc(q.setup)}" style="padding:2px 8px;min-height:0">⧉</button>`}<br>3) ${L('Endi holatni o\'zingiz yeching. Taymer ishlayapti.','Now solve it yourself. The timer is running.')}</div>
        <div class="xtimer" data-xt>0.0</div>`;
    }
    X.host.innerHTML=`<div class="xrun">${prog()}<div class="xq"><div class="xbar"><span class="kind">${T(KIND[q.kind])} · ${X.i+1}/${X.qs.length}</span><span class="sp"></span><button class="ghost" data-xquit style="font-size:13px">✕ ${L('Chiqish','Quit')}</button></div>
      <h3>${T(q.prompt)}</h3>${A.orient&&(q.kind==='sim'||q.kind==='real')?`<div class="lorient">${T(A.orient)}</div>`:''}${body}<div class="xmsg" data-xmsg></div><div data-xhintbox></div><div data-xsolbox></div>
      <div class="xbar"><button data-xhint title="${L('Kichik yordam. Savol yarim ball oladi.','A small clue. The question gets half credit.')}">💡 ${L('Maslahat','Hint')} <small class="muted">½</small></button><button data-xshow>👁 ${L("Yechimni ko'rsatish",'Show solution')}</button><span class="sp"></span>
        ${q.kind==='real'?`<button data-xreal="0">✗ ${L('Yecholmadim',"Couldn't")}</button><button class="pri" data-xreal="1">✓ ${L('Yechdim','Solved')}</button>`:''}
        <button class="pri" data-xnext style="display:none">${X.i+1<X.qs.length?L('Keyingi','Next')+' ▶':L('Natija','Results')+' ▶'}</button></div></div></div>`;
    const H=X.host, msg=(t,ok)=>{const el=H.querySelector('[data-xmsg]'); el.textContent=t; el.className='xmsg '+(ok===true?'ok':ok===false?'no':'');};
    const solBox=()=>{H.querySelector('[data-xsolbox]').innerHTML=`<div class="xsol"><b>${q.name?T(q.name)+' — ':''}</b>${L('Yechim','Solution')}: <code>${q.sol||'—'}</code>${A.orient?`<div class="lorient" style="margin:8px 0 0">${T(A.orient)}</div>`:''} <button class="ghost" data-lplay="${esc(q.setup||'')}" data-lsol="${esc(q.sol||'')}" data-ltitle="${esc(T(q.name||''))}" style="padding:2px 8px;min-height:0">▶</button></div>`;};
    const finish=score=>{ if(X.cur.done) return; X.cur.done=true; let s=score; if(s===1&&(X.cur.hint||X.cur.shown)) s=.5; X.res[X.i]=s; H.querySelector('[data-xnext]').style.display=''; H.querySelector('.xprog').outerHTML=prog(); if(X.timer){clearInterval(X.timer);X.timer=null;} };
    H.querySelector('[data-xquit]').onclick=()=>{ if(X.timer) clearInterval(X.timer); X.cfg.onExit(); };
    H.querySelector('[data-xhint]').onclick=()=>{ if(X.cur.hint) return; X.cur.hint=true; const tk=A.tokens(q.sol||''), parts=[], nm=q.name?T(q.name):'', ht=q.hint?T(q.hint):'';
      if(ht&&ht!==nm) parts.push(ht);
      if(q.kind==='sim'||q.kind==='real'){ if(!parts.length&&q.goal) parts.push(T(A.goalText(q.goal))); if(tk.length) parts.push(L('Birinchi harakat','First move')+': <code>'+tk[0]+'</code> ('+L('jami','total')+' '+tk.length+')'); }
      else if(q.kind==='alg'){ if(nm) parts.unshift(L('Bu holat','This is')+': <b>'+nm+'</b>'); if(tk.length>1) parts.push(L('Formula shunday boshlanadi','The algorithm starts with')+': <code>'+tk.slice(0,2).join(' ')+' …</code>'); }
      else if(!parts.length&&tk.length) parts.push(L('Yechim formulasi','Its algorithm')+': <code>'+tk.slice(0,3).join(' ')+' …</code>');
      if(!parts.length) parts.push(T(A.goalText(q.goal)));
      H.querySelector('[data-xhintbox]').innerHTML=`<div class="xhint"><b>💡 ${L('Maslahat','Hint')}</b><div>${parts.join('<br>')}</div><small class="muted">${L('Bu savol endi yarim ball oladi.','This question now gives half credit.')}</small></div>`;
      H.querySelector('[data-xhint]').disabled=true; };
    H.querySelector('[data-xshow]').onclick=()=>{ X.cur.shown=true; solBox(); if(q.kind==='name'||q.kind==='alg') H.querySelectorAll('[data-xo]').forEach(b=>{ if(q.options[+b.dataset.xo]===q.answer) b.classList.add('right'); }), finish(0); };
    H.querySelector('[data-xnext]').onclick=()=>{ X.i++; X.i<X.qs.length?renderQ():showResults(); };
    if(q.kind==='name'||q.kind==='alg') H.querySelectorAll('[data-xo]').forEach(b=>b.onclick=()=>{ if(X.cur.done) return; const ok=q.options[+b.dataset.xo]===q.answer;
      H.querySelectorAll('[data-xo]').forEach(x=>{ if(q.options[+x.dataset.xo]===q.answer) x.classList.add('right'); }); if(!ok) b.classList.add('wrong');
      msg(ok?L("To'g'ri! 🎉",'Correct! 🎉'):L("Noto'g'ri",'Wrong'),ok); solBox(); finish(ok?1:0); });
    if(q.kind==='sim'){
      const cube=A.make3D(H.querySelector('.xsim'),st,{height:250,dur:()=>200,onChange:c=>{ if(!X.cur.done && c.hist.length && A.goal(q.goal,c.st)){ msg(L("Barakalla! Maqsadga yetdingiz ✓",'Well done! Goal reached ✓')+` (${c.hist.length} ${L('harakat','moves')})`,true); solBox(); finish(1);} }});
      const run=t=>{ if(X.cur.done) return; cube.enqueue(t); };
      H.querySelectorAll('[data-xm]').forEach(b=>b.onclick=()=>run([b.dataset.xm]));
      const inp=H.querySelector('.xinp'), go=()=>{const t=A.tokens(inp.value); const bad=t.find(x=>!A.valid(x)); if(bad){msg(L('Tushunarsiz harakat: ','Unknown move: ')+bad,false); return;} msg('',null); inp.value=''; run(t);};
      H.querySelector('[data-xrun]').onclick=go; inp.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault(); go();}});
      H.querySelector('[data-xundo]').onclick=()=>{ if(cube.busy||X.cur.done) return; const t=cube.hist.pop(); if(t) cube.enqueue([A.invert(t)],false); };
      H.querySelector('[data-xreset]').onclick=()=>{ if(X.cur.done) return; cube.hist.length=0; cube.setState(A.apply(A.solved(),q.setup||'')); };
      msg(T(A.goalText(q.goal)),null);
    }
    if(q.kind==='real'){ const t0=Date.now(), el=H.querySelector('[data-xt]'); X.timer=setInterval(()=>{el.textContent=((Date.now()-t0)/1000).toFixed(1);},100);
      H.querySelectorAll('[data-xreal]').forEach(b=>b.onclick=()=>{ const ok=b.dataset.xreal==='1'; msg(ok?L('Zo\'r! ✓','Great! ✓'):L("Hechqisi yo'q — yechimni ko'ring",'No worries — check the solution'),ok); solBox(); finish(ok?1:0); H.querySelectorAll('[data-xreal]').forEach(x=>x.style.display='none'); }); }
  }
  function showResults(){
    const n=X.qs.length, sc=X.res.reduce((a,b)=>a+(b||0),0), pct=Math.round(sc/n*100), secs=Math.round((Date.now()-X.t0)/1000);
    saveResult(X.cfg.key,pct);
    const col=r=>r===1?'var(--ok)':r===.5?'#eab308':'var(--bad)', ic=r=>r===1?'✓':r===.5?'½':'✗';
    X.host.innerHTML=`<div class="xrun xres"><div class="xbar"><div><div class="muted">${T(X.cfg.title)}</div><div class="xbig" style="color:${pct>=80?'var(--ok)':pct>=50?'#ca8a04':'var(--bad)'}">${pct}%</div></div><span class="sp"></span>
      <div style="text-align:right">${pct>=80?`<span class="badge" style="font-size:14px">✓ ${L("O'tdi!",'Passed!')}</span>`:`<span class="muted">${L("O'tish uchun 80% kerak",'80% needed to pass')}</span>`}<div class="muted" style="margin-top:4px">${Math.floor(secs/60)}:${String(secs%60).padStart(2,'0')} · ${sc} / ${n}</div></div></div>
      <div class="xlist">${X.qs.map((q,k)=>`<div class="it"><span class="ic" style="background:${col(X.res[k])}">${ic(X.res[k])}</span><div style="flex:1;min-width:0"><b>${T(q.name||KIND[q.kind])}</b> <span class="muted" style="font-size:12.5px">· ${T(KIND[q.kind])}</span><div style="margin-top:4px"><code style="font:600 13px var(--mono)">${q.sol||''}</code></div></div><button class="ghost" data-lplay="${esc(q.setup||'')}" data-lsol="${esc(q.sol||'')}" data-ltitle="${esc(T(q.name||''))}" style="padding:4px 10px;min-height:0">▶</button></div>`).join('')}</div>
      <div class="xbar"><button data-xback>← ${L('Imtihonlar','Exams')}</button><span class="sp"></span><button class="pri" data-xagain>↻ ${L('Qayta topshirish','Retake')}</button></div></div>`;
    X.host.querySelector('[data-xback]').onclick=()=>X.cfg.onExit();
    X.host.querySelector('[data-xagain]').onclick=()=>X.cfg.onRetake();
  }
  // question helpers
  function optionsFrom(answer,pool,n){ const others=shuffle(pool.filter(x=>x!==answer)).slice(0,(n||4)-1); return shuffle([answer].concat(others)); }
  // ---------- global events ----------
  document.addEventListener('click',e=>{
    if(!A) return;
    const p=e.target.closest('[data-lplay]'); if(p){ openPlayer(p.dataset.lplay,p.dataset.lsol,p.dataset.ltitle); return; }
    const s=e.target.closest('[data-lsim]'); if(s){ A.simLoad(s.dataset.lsim,s.dataset.lsol); return; }
    const m=e.target.closest('[data-lmini]'); if(m){ const [l,st]=m.dataset.lmini.split('|'); A.startExam(l,st); return; }
    const g=e.target.closest('[data-lgo]'); if(g){ const el=document.getElementById(g.dataset.lgo); if(el) el.scrollIntoView({behavior:'smooth',block:'start'}); return; }
  });
  document.addEventListener('keydown',e=>{ if(e.key==='Escape') closeModal(); });
  return {use:a=>{A=a;}, lessonHTML, stepCard, openPlayer, closeModal, examHome, startExam, optionsFrom, shuffle, best, T};
})();
