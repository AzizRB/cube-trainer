// ===================== STORAGE & LANGUAGE =====================
const KEY='cubeTrainer.v1';
let DB={plan:{},stats:{},times:[],sets:['oll2','pll1'],insp:false,lang:'en'};
try{const raw=localStorage.getItem(KEY); if(raw) DB=Object.assign(DB,JSON.parse(raw));}catch(e){}
if(!DB.langSet){ DB.lang='en'; DB.langSet=1; }
document.addEventListener('click',e=>{ const a=e.target.closest('.pswitch a[href],.switch a[href]'); if(!a||a.classList.contains('on')) return; a.classList.add('ld'); document.querySelectorAll('.pswitch a,.switch a').forEach(x=>{ if(x!==a) x.style.pointerEvents='none'; }); });
window.addEventListener('pageshow',()=>document.querySelectorAll('.pswitch a,.switch a').forEach(x=>{x.classList.remove('ld'); x.style.pointerEvents='';}));
function save(){try{localStorage.setItem(KEY,JSON.stringify(DB));}catch(e){}}
const L=(uz,en)=>DB.lang==='en'?en:uz;
const $=id=>document.getElementById(id);

// ===================== COPY =====================
function copyText(text,btn){
  const flash=msg=>{ if(!btn) return; if(!btn.dataset.orig) btn.dataset.orig=btn.innerHTML; btn.innerHTML=msg; clearTimeout(btn._t); btn._t=setTimeout(()=>{btn.innerHTML=btn.dataset.orig; delete btn.dataset.orig;},1400); };
  const fallback=()=>{ try{const ta=document.createElement('textarea'); ta.value=text; ta.setAttribute('readonly',''); ta.style.cssText='position:fixed;top:0;left:0;opacity:0'; document.body.appendChild(ta); ta.select(); const ok=document.execCommand('copy'); ta.remove(); flash(ok?'✓':L('Nusxa olinmadi','Copy failed')); }catch(e){ flash(L('Nusxa olinmadi','Copy failed')); } };
  try{ navigator.clipboard.writeText(text).then(()=>flash('✓'),fallback); }catch(e){ fallback(); }
}
const copyBtn=(text,cls)=>`<button class="${cls||'icon ghost'}" data-copy="${text}" title="${L('Nusxa olish','Copy')}">⧉</button>`;

