/* ScriptX-Engine — app logic */
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const ld=(k,d)=>{try{return JSON.parse(localStorage.getItem(k))||d}catch(e){return d}};
const DS={name:'you',hue:250,theme:'auto',fs:14,tab:2,as:1,lp:1,ww:0,ac:1,ln:1,br:1,dev:'phone',con:1,vis:'public',recent:[]};
const S={...DS,...ld('scriptx.s',{})};
const sv=()=>{try{localStorage.setItem('scriptx.s',JSON.stringify(S))}catch(e){}};
const GB=1024**3,REPO=8*GB,TOT=64*GB;let Q={quota:0,usage:0,persisted:false};
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const sz=b=>b>=GB?(b/GB).toFixed(2)+' GB':b>=1048576?(b/1048576).toFixed(1)+' MB':b>=1024?Math.round(b/1024)+' KB':b+' B';
const ago=t=>{const m=(Date.now()-t)/6e4;return m<1?'just now':m<60?Math.floor(m)+' min ago':m<1440?Math.floor(m/60)+' h ago':Math.floor(m/1440)+' d ago'};
const ext=f=>f.includes('.')?f.split('.').pop().toLowerCase():'';
const I={home:'M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z',repo:'M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z',add:'M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z',set:'M3 17v2h6v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2zM7 9v2H3v2h4v2h2V9H7zm14 4v-2H11v2h10zm-6-4h2V7h4V5h-4V3h-2v6z',stor:'M2 20h20v-4H2v4zm2-3h2v2H4v-2zM2 4v4h20V4H2zm4 3H4V5h2v2zm-4 7h20v-4H2v4zm2-3h2v2H4v-2z',fold:'M10 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z',file:'M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm-1 7V3.5L18.5 9H13z',srch:'M15.5 14h-.79l-.28-.27A6.47 6.47 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z',play:'M8 5v14l11-7z',del:'M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z',up:'M9 16h6v-6h4l-7-7-7 7h4v6zm-4 2h14v2H5v-2z',lock:'M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z',ref:'M17.65 6.35A7.96 7.96 0 0012 4a8 8 0 108 8h-2a6 6 0 11-1.76-4.24L13 11h7V4l-2.35 2.35z'};
const ic=(n,w=24)=>`<svg viewBox="0 0 24 24" width="${w}" height="${w}" fill="currentColor" aria-hidden="true"><path d="${I[n]}"/></svg>`;

/* storage (IndexedDB) */
let DBP;const db=()=>DBP||(DBP=new Promise((ok,no)=>{const r=indexedDB.open('scriptx',1);r.onupgradeneeded=()=>{r.result.createObjectStore('repos',{keyPath:'id'});r.result.createObjectStore('files',{keyPath:'k'}).createIndex('r','r')};r.onsuccess=()=>ok(r.result);r.onerror=()=>no(r.error)}));
const MEM={repos:new Map(),files:new Map()};let useMem=false;
function memStore(n){const m=MEM[n],kp=n==='repos'?'id':'k',rq=v=>({result:v});return{put:o=>{m.set(o[kp],o);return rq(o[kp])},delete:k=>{m.delete(k);return rq()},getAll:()=>rq([...m.values()]),index:()=>({getAll:id=>rq([...m.values()].filter(f=>f.r===id))})}}
const idb=(s,m,f)=>useMem?Promise.resolve().then(()=>{const q=f(memStore(s));return q&&q.result}):db().then(d=>new Promise((ok,no)=>{const t=d.transaction(s,m),q=f(t.objectStore(s));t.oncomplete=()=>ok(q&&q.result);t.onerror=()=>no(t.error);t.onabort=()=>no(t.error)}));
let R=[],cur=null,F={},openT=[],act=null,dir='',dirty=false,P='home',tab='code',qry='',filt='all';
const tot=()=>R.reduce((a,r)=>a+(r.size||0),0),cap=()=>Q.quota?Math.min(TOT,Q.quota):TOT;
async function est(){try{if(navigator.storage){const e=await navigator.storage.estimate();Q.quota=e.quota||0;Q.usage=e.usage||0;Q.persisted=await navigator.storage.persisted()}}catch(e){}}
async function put(p,d){const z=typeof d==='string'?new Blob([d]).size:d.size,old=F[p]?F[p].z:0,dl=z-old;
 if(dl>0&&(cur.size+dl>REPO||tot()+dl>cap())){toast(cur.size+dl>REPO?'This repository reached its 8 GB limit.':'Total storage limit reached.');return false}
 try{const t=Date.now();await idb('files','readwrite',s=>s.put({k:cur.id+'/'+p,r:cur.id,p,d,z,t}));F[p]={d,z,t};cur.size+=dl;cur.t=t;await idb('repos','readwrite',s=>s.put(cur));return true}
 catch(e){toast('The browser could not save this. Storage may be full.');return false}}
async function rmFile(p){await idb('files','readwrite',s=>s.delete(cur.id+'/'+p));cur.size-=F[p].z;delete F[p];await idb('repos','readwrite',s=>s.put(cur))}
async function rmRepo(id){const fs=await idb('files','readonly',s=>s.index('r').getAll(id));await idb('files','readwrite',s=>{fs.forEach(f=>s.delete(f.k))});await idb('repos','readwrite',s=>s.delete(id));R=R.filter(r=>r.id!==id);if(cur&&cur.id===id)cur=null}
async function loadRepo(id){cur=R.find(r=>r.id===id)||null;F={};openT=[];act=null;dir='';if(!cur)return;(await idb('files','readonly',s=>s.index('r').getAll(id))).forEach(f=>F[f.p]={d:f.d,z:f.z,t:f.t})}
async function flush(){if(dirty&&act&&F[act]&&typeof F[act].d==='string'){dirty=false;const ok=await put(act,F[act].d);setSv(ok?'Saved':'Not saved',!ok)}}

/* highlight + autocomplete */
const RX={js:[/(\/\/.*|\/\*[\s\S]*?\*\/)|("(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*'|`(?:\\.|[^`\\])*`)|\b(const|let|var|function|return|if|else|for|while|new|class|import|export|from|async|await|true|false|null|this|try|catch|of|in|public|static|void|int|string|fn|func|use|struct|package|echo)\b|\b(\d+\.?\d*)\b|\b([A-Za-z_$][\w$]*)(?=\()/g,'c s k n f'],
py:[/(#.*)|("(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*')|\b(def|class|import|from|return|if|elif|else|for|while|in|not|and|or|None|True|False|with|as|try|except|lambda|echo|then|fi|do|done)\b|\b(\d+\.?\d*)\b|\b([A-Za-z_]\w*)(?=\()/g,'c s k n f'],
html:[/(<!\-\-[\s\S]*?\-\->)|("[^"\n]*"|'[^'\n]*')|(<\/?[\w-]+|\/?>)|(\b[\w-]+(?==))/g,'c s k f'],
css:[/(\/\*[\s\S]*?\*\/)|("[^"\n]*"|'[^'\n]*')|([\w-]+)(?=\s*:)|(#[0-9a-fA-F]{3,8}\b|\b\d+\.?\d*(?:px|rem|em|%|vh|vw|ms|s)?\b)|([.#][\w-]+)/g,'c s f n k'],
json:[/("(?:\\.|[^"\\])*")(?=\s*:)|("(?:\\.|[^"\\])*")|\b(true|false|null)\b|(-?\d+\.?\d*)/g,'f s k n'],
md:[/^(#+ .*)$|(`[^`\n]*`)|(\*\*[^*\n]+\*\*)/gm,'k s n']};
const HK={ts:'js',tsx:'js',jsx:'js',mjs:'js',cjs:'js',java:'js',c:'js',h:'js',cpp:'js',cc:'js',cs:'js',go:'js',rs:'js',php:'js',kt:'js',swift:'js',dart:'js',sh:'py',rb:'py',lua:'py',htm:'html',xml:'html',svg:'html',vue:'html',scss:'css',less:'css'};
const hk=f=>{const e=ext(f);return RX[e]?e:HK[e]||''};
function hl(code,k){const r=RX[k];if(!r)return esc(code);const cl=r[1].split(' ');let o='',i=0,m;r[0].lastIndex=0;
 while((m=r[0].exec(code))){if(!m[0]){r[0].lastIndex++;continue}o+=esc(code.slice(i,m.index));const g=m.slice(1).findIndex(x=>x!==undefined);o+=`<span class="${cl[g]}">${esc(m[0])}</span>`;i=m.index+m[0].length}
 return o+esc(code.slice(i))}
const LN={js:'JavaScript',py:'Python',html:'HTML',css:'CSS',json:'JSON',md:'Markdown',ts:'TypeScript',java:'Java',c:'C',cpp:'C++',go:'Go',rs:'Rust',php:'PHP',sh:'Shell',rb:'Ruby',lua:'Lua',kt:'Kotlin',cs:'C#',swift:'Swift'};
const ACS={js:'print=console.log(§)|log=console.log(§)|function=function §() {\n  \n}|const=const § = |let=let § = |if=if (§) {\n  \n}|for=for (let i = 0; i < §; i++) {\n  \n}|while=while (§) {\n  \n}|return=return §|class=class § {\n  constructor() {\n  }\n}|async=async function §() {\n}|await=await §|import=import § from \'\';|fetch=fetch(§)|setTimeout=setTimeout(() => {\n  §\n}, 1000)|querySelector=document.querySelector(\'§\')|addEventListener=addEventListener(\'click\', (e) => {\n  §\n})|alert=alert(§)|prompt=prompt(§)|try=try {\n  §\n} catch (e) {\n  console.error(e)\n}|JSON.stringify=JSON.stringify(§)',
py:'print=print(§)|def=def §():\n    |if=if §:\n    |elif=elif §:\n    |else=else:\n    §|for=for § in :\n    |while=while §:\n    |import=import §|from=from § import |class=class §:\n    def __init__(self):\n        |return=return §|input=input(§)|len=len(§)|range=range(§)|try=try:\n    §\nexcept Exception as e:\n    print(e)|with=with open(\'§\') as f:\n    |lambda=lambda §: |str=str(§)|int=int(§)|list=list(§)|dict=dict(§)|open=open(\'§\')',
html:'print=<p>§</p>|div=<div>§</div>|span=<span>§</span>|p=<p>§</p>|h1=<h1>§</h1>|h2=<h2>§</h2>|a=<a href="§"></a>|img=<img src="§" alt="">|button=<button>§</button>|input=<input type="text" §>|ul=<ul>\n  <li>§</li>\n</ul>|form=<form>\n  §\n</form>|script=<script>\n  §\n<\/script>|style=<style>\n  §\n</style>|link=<link rel="stylesheet" href="§">|meta=<meta name="viewport" content="width=device-width, initial-scale=1">|section=<section>§</section>|nav=<nav>§</nav>|table=<table>\n  <tr><td>§</td></tr>\n</table>|canvas=<canvas id="§"></canvas>',
css:'color=color: §;|background=background: §;|display=display: flex;|flex=flex: §;|grid=display: grid;\n  grid-template-columns: §;|margin=margin: §;|padding=padding: §;|border=border: 1px solid §;|border-radius=border-radius: §;|font-size=font-size: §;|width=width: §;|height=height: §;|position=position: §;|align-items=align-items: §;|justify-content=justify-content: §;|transition=transition: § .2s;|@media=@media (max-width: §px) {\n  \n}|box-shadow=box-shadow: 0 2px 8px §;',
java:'print=System.out.println(§);|main=public static void main(String[] args) {\n    §\n}|class=public class § {\n}|for=for (int i = 0; i < §; i++) {\n}|if=if (§) {\n}|import=import §;|String=String § = "";|ArrayList=ArrayList<§> list = new ArrayList<>();|Scanner=Scanner sc = new Scanner(System.in);|return=return §;',
c:'print=printf("§\\n");|printf=printf("§\\n");|cout=std::cout << § << std::endl;|main=int main() {\n    §\n    return 0;\n}|include=#include <§>|for=for (int i = 0; i < §; i++) {\n}|if=if (§) {\n}|while=while (§) {\n}|return=return §;|scanf=scanf("%d", &§);',
go:'print=fmt.Println(§)|func=func §() {\n}|main=package main\n\nimport "fmt"\n\nfunc main() {\n    §\n}|for=for i := 0; i < §; i++ {\n}|if=if § {\n}|import=import "§"|var=var § = |return=return §',
rs:'print=println!("§");|fn=fn §() {\n}|main=fn main() {\n    §\n}|let=let § = ;|for=for i in 0..§ {\n}|if=if § {\n}|use=use §;|struct=struct § {\n}|match=match § {\n    _ => {}\n}',
php:'print=echo "§";|echo=echo "§";|function=function §() {\n}|foreach=foreach ($§ as $item) {\n}|if=if (§) {\n}|php=<?php\n§|var_dump=var_dump(§);',
sh:'print=echo "§"|echo=echo "§"|if=if [ § ]; then\nfi|for=for i in §; do\ndone|while=while §; do\ndone|read=read -p "§" var',
rb:'print=puts §|puts=puts §|def=def §\nend|if=if §\nend|each=§.each do\nend|class=class §\nend|require=require \'§\'',
lua:'print=print(§)|function=function §()\nend|for=for i = 1, § do\nend|if=if § then\nend|local=local § = |require=require("§")'};
const AM={ts:'js',tsx:'js',jsx:'js',mjs:'js',cjs:'js',htm:'html',xml:'html',svg:'html',vue:'html',scss:'css',less:'css',kt:'java',cpp:'c',cc:'c',h:'c',cs:'c',bash:'sh',zsh:'sh'};
const ACD={};const acKey=f=>{const e=ext(f);return AM[e]||e};
const acData=k=>ACD[k]||(ACD[k]=(ACS[k]||'').split('|').filter(Boolean).map(e=>{const i=e.indexOf('=');return[e.slice(0,i),e.slice(i+1)]}));
let acL=[],acI=0;
function acHide(){const a=$('#ac');if(a)a.style.display='none';acL=[]}
function curWord(t){const s=t.selectionStart;return(t.value.slice(0,s).match(/[A-Za-z_@][\w-]*$/)||[''])[0]}
function acShow(){const t=$('#ta');if(!t||!S.ac||!act)return acHide();const w=curWord(t);if(!w||t.selectionEnd!==t.selectionStart)return acHide();
 const lw=w.toLowerCase();let l=acData(acKey(act)).filter(e=>e[0].toLowerCase().startsWith(lw)&&e[0]!==w);const seen=new Set(l.map(e=>e[0]));
 (t.value.match(/[A-Za-z_]\w{2,}/g)||[]).forEach(x=>{if(x!==w&&x.toLowerCase().startsWith(lw)&&!seen.has(x)){seen.add(x);l.push([x,x,1])}});
 acL=l.slice(0,8);if(!acL.length)return acHide();acI=Math.min(acI,acL.length-1);
 const a=$('#ac');a.innerHTML=acL.map((e,i)=>`<li class="${i===acI?'on':''}" data-i="${i}"><b>${esc(e[0])}</b><small>${e[2]?'word':'snippet'}</small></li>`).join('');
 const s=t.selectionStart,pre=t.value.slice(0,s),ln=pre.split('\n').length-1,col=pre.length-pre.lastIndexOf('\n')-1;
 const sp=document.createElement('span');sp.style.cssText='position:absolute;visibility:hidden;font:inherit;white-space:pre';sp.textContent='M'.repeat(20);t.parentNode.appendChild(sp);const cw=sp.getBoundingClientRect().width/20;sp.remove();
 const lh=parseFloat(getComputedStyle(t).lineHeight)||22;a.style.display='block';
 a.style.left=Math.max(4,Math.min(14+(S.ww?0:col*cw-t.scrollLeft),t.clientWidth-230))+'px';a.style.top=Math.min(12+(ln+1)*lh-t.scrollTop,t.clientHeight-20)+'px'}
function acPick(i){const e=acL[i],t=$('#ta');if(!e)return;const w=curWord(t),s=t.selectionStart;let st=s-w.length,ins=e[1];
 if(ins[0]==='<'&&t.value[st-1]==='<')st--;
 const ind=(t.value.slice(0,st).split('\n').pop().match(/^\s*/)||[''])[0];ins=ins.replace(/\n/g,'\n'+ind);const c=ins.indexOf('§');ins=ins.replace('§','');
 t.setRangeText(ins,st,s,'end');if(c>=0)t.setSelectionRange(st+c,st+c);acHide();t.dispatchEvent(new Event('input'))}

/* helpers */
let tt;function toast(m){const e=$('#toast');e.textContent=m;e.classList.add('on');clearTimeout(tt);tt=setTimeout(()=>e.classList.remove('on'),3000)}
function dlg({t,m='',v,ph='',ok='OK',bad}){return new Promise(res=>{const d=document.createElement('dialog');d.innerHTML=`<h3>${esc(t)}</h3><p>${esc(m)}</p>${v!==undefined?`<input value="${esc(v)}" placeholder="${esc(ph)}" aria-label="${esc(t)}">`:''}<div class="da"><button class="btn t" value="0">Cancel</button><button class="btn${bad?' bad':''}" value="1">${esc(ok)}</button></div>`;document.body.appendChild(d);d.showModal();const i=d.querySelector('input');if(i){i.focus();i.setSelectionRange(i.value.length,i.value.length);i.onkeydown=e=>{if(e.key==='Enter')d.querySelector('[value="1"]').click()}}
 d.onclick=e=>{const b=e.target.closest('button');if(b){d.close();d.remove();res(b.value==='1'?(i?i.value.trim():true):false)}};d.oncancel=()=>{d.remove();res(false)}})}
const md=s=>esc(s).replace(/```([\s\S]*?)```/g,'<pre>$1</pre>').replace(/^### (.*)$/gm,'<h3>$1</h3>').replace(/^## (.*)$/gm,'<h2>$1</h2>').replace(/^# (.*)$/gm,'<h1>$1</h1>').replace(/\*\*([^*\n]+)\*\*/g,'<b>$1</b>').replace(/`([^`\n]+)`/g,'<code>$1</code>').replace(/^- (.*)$/gm,'<li>$1</li>').replace(/\n{2,}/g,'<br><br>');
const rurl=(sub='')=>'#/repo/'+encodeURIComponent(cur.id)+sub;
function theme(){const d=S.theme==='dark'||(S.theme==='auto'&&matchMedia('(prefers-color-scheme:dark)').matches),r=document.documentElement;r.dataset.theme=d?'dark':'light';r.style.setProperty('--h',S.hue);r.style.setProperty('--fs',S.fs+'px');document.body.classList.toggle('nol',!S.ln);$('#avt').textContent=(S.name[0]||'Y').toUpperCase()}
function setSv(t,bad){const e=$('#sv');if(e){e.textContent=t;e.style.color=bad?'var(--err)':''}}

/* pages */
const meter=(v,m)=>`<div class="meter"><i style="width:${Math.max(0,Math.min(100,v/m*100))}%"></i></div>`;
const repoItem=r=>`<a class="ri st" href="#/repo/${encodeURIComponent(r.id)}" data-go="#/repo/${encodeURIComponent(r.id)}"><span class="ic">${ic('repo')}</span><div><b>${esc(S.name)} / ${esc(r.name)}</b> <i class="pill">${r.vis==='private'?ic('lock',12)+' Private':'Public'}</i><p>${esc(r.desc||'No description')}</p><small>${sz(r.size||0)} · updated ${ago(r.t)}</small></div></a>`;
const empty=()=>`<div class="empty cd"><h2>No repositories yet</h2><p>Create a repository to start adding files. It starts empty, with no template.</p><a class="btn" href="#/new" data-go="#/new">${ic('add')} New repository</a></div>`;
function home(){const g=new Date().getHours(),hi=g<12?'Good morning':g<18?'Good afternoon':'Good evening',rc=S.recent.filter(x=>R.some(r=>r.id===x.r));
 return `<div class="pg"><h1 class="lt">${hi}, ${esc(S.name)}</h1>
 <a class="cd st" href="#/storage" data-go="#/storage" style="display:block"><h2>Storage</h2>${meter(tot(),cap())}<small>${sz(tot())} used of ${sz(cap())} · ${R.length} ${R.length===1?'repository':'repositories'}</small></a>
 <div class="sec"><h2>Your repositories</h2><a class="btn t" href="#/repos" data-go="#/repos">See all</a></div>${R.length?R.slice().sort((a,b)=>b.t-a.t).slice(0,5).map(repoItem).join(''):empty()}
 ${rc.length?`<div class="sec"><h2>Recent files</h2></div>`+rc.map(x=>`<div class="ri st" data-a="recent" data-r="${esc(x.r)}" data-p="${esc(x.p)}" style="cursor:pointer"><span class="ic">${ic('file')}</span><div><b>${esc(x.p)}</b><small>${esc(x.r)} · ${ago(x.t)}</small></div></div>`).join(''):''}</div>`}
function repos(){const q=qry.toLowerCase(),L=R.filter(r=>(filt==='all'||r.vis===filt)&&(r.name+' '+(r.desc||'')).toLowerCase().includes(q)).sort((a,b)=>b.t-a.t);
 return `<div class="pg"><h1 class="lt">Repositories</h1><div class="chips">${['all','public','private'].map(f=>`<a href="#/repos" data-a="filt" data-p="${f}" class="${filt===f?'on':''}">${f[0].toUpperCase()+f.slice(1)}</a>`).join('')}</div>${L.length?L.map(repoItem).join(''):R.length?'<div class="empty">Nothing matches your search.</div>':empty()}</div>`}
function newRepo(){return `<div class="pg" style="max-width:640px"><h1 class="lt">Create a new repository</h1>
 <label class="fld"><span>Owner</span><input value="${esc(S.name)}" disabled></label>
 <label class="fld"><span>Repository name</span><input id="rn" placeholder="my-project" autocomplete="off"></label>
 <label class="fld"><span>Description (optional)</span><input id="rd" autocomplete="off"></label>
 <div class="opts" id="vo"><div class="opt ${S.vis==='public'?'on':''}" data-a="pv" data-p="public"><b>Public</b><small>Listed in your repositories</small></div><div class="opt ${S.vis==='private'?'on':''}" data-a="pv" data-p="private"><b>${ic('lock',14)} Private</b><small>Marked private on this device</small></div></div>
 <div class="row"><div><b>Add a README file</b><small>Off by default. The repository starts empty.</small></div><button class="swt" id="rr" data-a="rr" role="switch" aria-checked="false" aria-label="Add a README file"></button></div>
 <div class="da"><a class="btn t" href="#/repos" data-go="#/repos">Cancel</a><button class="btn" data-a="create">Create repository</button></div></div>`}
function listing(){const E={};for(const p in F){if(!p.startsWith(dir))continue;const r=p.slice(dir.length),i=r.indexOf('/'),n=i<0?r:r.slice(0,i),e=E[n]||(E[n]={n,f:i>=0,z:0,t:0});e.z+=F[p].z;e.t=Math.max(e.t,F[p].t)}
 const L=Object.values(E).sort((a,b)=>b.f-a.f||a.n.localeCompare(b.n)),segs=dir.split('/').filter(Boolean);let acc='';
 const cr=`<div class="crumbs"><a data-a="cd" data-p="">${esc(cur.name)}</a>${segs.map(s=>{acc+=s+'/';return `/ <a data-a="cd" data-p="${esc(acc)}">${esc(s)}</a>`}).join('')}<span style="flex:1"></span><button class="btn t sm" data-a="newfile">${ic('add',16)} New file</button><button class="btn t sm" data-a="upload">${ic('up',16)} Upload</button></div>`;
 const rd=typeof (F[dir+'README.md']||{}).d==='string'?`<div class="cd" style="margin-top:14px"><b>README.md</b><div class="md">${md(F[dir+'README.md'].d)}</div></div>`:'';
 const body=!L.length?`<div class="empty cd"><h2>This repository is empty</h2><p>Create a file with any name and extension, or upload files from your device.</p><button class="btn" data-a="newfile">${ic('add')} Create a file</button> <button class="btn t" data-a="upload">${ic('up')} Upload files</button></div>`
 :`<div class="tbl"><div class="tr"><span>${esc(S.name)}</span><span class="sp"></span><span>${L.length} items</span></div>${L.map(e=>`<div class="tr st" data-a="${e.f?'cd':'open'}" data-p="${esc(dir+e.n+(e.f?'/':''))}">${ic(e.f?'fold':'file',22)}<span>${esc(e.n)}</span><span class="sp"></span><span class="m">${sz(e.z)}</span><span class="m">${ago(e.t)}</span></div>`).join('')}</div>`;
 return `${cr}<div class="cols"><div>${body}${rd}</div><div class="cd"><h2>About</h2><p>${esc(cur.desc||'No description provided.')}</p><small>${cur.vis==='private'?'Private':'Public'} · ${Object.keys(F).length} files</small>${meter(cur.size,REPO)}<small>${sz(cur.size)} of 8 GB</small></div></div><input type="file" id="up" multiple hidden>`}
function editor(){const f=F[act];if(typeof f.d!=='string')return `<div class="cd"><h2>${esc(act)}</h2><p>Binary file · ${sz(f.z)}. It can't be edited here.</p><button class="btn" data-a="dl">Download</button> <button class="btn bad" data-a="del">Delete</button> <button class="btn t" data-a="close" data-p="${esc(act)}">Close</button></div>`;
 return `<div class="edw"><div class="ex">${Object.keys(F).sort().map(p=>`<div class="exi st ${p===act?'on':''}" data-a="open" data-p="${esc(p)}">${esc(p)}</div>`).join('')}</div><div class="em">
 <div class="etabs">${openT.map(p=>`<div class="etab ${p===act?'on':''}" data-a="open" data-p="${esc(p)}">${esc(p.split('/').pop())}<i data-a="close" data-p="${esc(p)}">✕</i></div>`).join('')}</div>
 <div class="code ${S.ww?'ww':''}"><pre id="gut"></pre><div class="wrap"><pre id="hl"></pre><textarea id="ta" spellcheck="false" autocapitalize="off" autocomplete="off" aria-label="Code editor"></textarea><ul class="ac" id="ac"></ul></div></div>
 <div class="stb"><span id="pos">Ln 1, Col 1</span><span>${LN[ext(act)]||(ext(act)?ext(act).toUpperCase():'Plain text')}</span><span id="sv">Saved</span><span class="sp"></span><button class="btn t sm" data-a="del">Delete</button><button class="btn sm" data-a="gorun">${ic('play',16)} Run</button></div></div></div>`}
function preview(){return `<div class="pbar"><div class="seg">${['phone','tablet','desktop'].map(d=>`<button data-a="devc" data-p="${d}" class="${S.dev===d?'on':''}">${d[0].toUpperCase()+d.slice(1)}</button>`).join('')}</div><span style="flex:1"></span><button class="ib" data-a="reload" aria-label="Reload preview">${ic('ref')}</button><button class="btn t sm" data-a="con">Console</button></div><div id="stage"><div id="dev"><iframe id="fr" sandbox="allow-scripts allow-modals" title="App preview"></iframe></div></div><div id="log" class="${S.con?'':'off'}"></div>`}
function rset(){return `<div style="max-width:620px"><label class="fld"><span>Description</span><input id="rdesc" value="${esc(cur.desc||'')}"></label><div class="row"><b>Visibility</b><select data-s="rvis"><option value="public" ${cur.vis==='public'?'selected':''}>Public</option><option value="private" ${cur.vis==='private'?'selected':''}>Private</option></select></div><button class="btn t" data-a="saverepo">Save changes</button>
 <div class="cd" style="margin-top:28px"><h2 style="color:var(--err)">Delete this repository</h2><p>This removes all ${Object.keys(F).length} files from this device and can't be undone.</p><button class="btn bad" data-a="delrepo" data-p="${esc(cur.id)}">Delete repository</button></div></div>`}
function repoPg(){const T=[['code','Code',''],['preview','Preview','/preview'],['settings','Settings','/settings']];
 return `<div class="pg"><div class="rh"><span class="av">${ic('repo')}</span><h1>${esc(S.name)} / <b>${esc(cur.name)}</b></h1><i class="pill">${cur.vis==='private'?ic('lock',12)+' Private':'Public'}</i></div>
 <div class="tabs2">${T.map(t=>`<a href="${rurl(t[2])}" data-go="${rurl(t[2])}" class="${tab===t[0]?'on':''}">${t[1]}</a>`).join('')}</div>${tab==='preview'?preview():tab==='settings'?rset():act&&F[act]?editor():listing()}</div>`}
const row=(t,s,c)=>`<div class="row"><div><b>${t}</b><small>${s}</small></div>${c}</div>`,tg=k=>`<button class="swt ${S[k]?'on':''}" data-t="${k}" role="switch" aria-checked="${!!S[k]}" aria-label="${k}"></button>`;
const sel=(k,o)=>`<select data-s="${k}">${o.map(x=>`<option value="${x[0]}" ${String(S[k])===String(x[0])?'selected':''}>${x[1]}</option>`).join('')}</select>`;
function settings(){return `<div class="pg" style="max-width:720px"><h1 class="lt">Settings</h1>
 <div class="cd"><h2>Profile</h2>${row('Display name','Shown as the owner of your repositories',`<button class="btn t sm" data-a="name">${esc(S.name)}</button>`)}${row('Default visibility','Used when you create a repository',sel('vis',[['public','Public'],['private','Private']]))}</div>
 <div class="cd"><h2>Display</h2>${row('Theme','Follow the system or pick one',sel('theme',[['auto','System default'],['light','Light'],['dark','Dark']]))}<div class="row"><div><b>Wallpaper colour</b><small>The whole interface follows this colour</small></div></div><div class="hues">${[250,330,25,140,195,60,290].map(h=>`<button data-h="${h}" class="${S.hue===h?'on':''}" style="background:hsl(${h} 60% 50%)" aria-label="Colour ${h}"></button>`).join('')}</div></div>
 <div class="cd"><h2>Editor</h2>${row('Font size','Editor text size',`<input type="range" min="11" max="22" value="${S.fs}" data-r="fs" aria-label="Font size">`)}${row('Tab size','Spaces inserted by Tab',sel('tab',[[2,'2 spaces'],[4,'4 spaces'],[8,'8 spaces']]))}${row('Autocomplete','Suggest commands like print while you type',tg('ac'))}${row('Autosave','Save as you type',tg('as'))}${row('Live preview','Refresh the preview while you type',tg('lp'))}${row('Word wrap','Wrap long lines',tg('ww'))}${row('Line numbers','Show the gutter',tg('ln'))}${row('Auto-close brackets','Add the closing ( [ { and quotes',tg('br'))}</div>
 <div class="cd"><h2>Data</h2>${row('Storage','See usage per repository and the 8 GB / 64 GB limits','<a class="btn t sm" href="#/storage" data-go="#/storage">Open</a>')}${row('Reset settings','Keeps your repositories','<button class="btn t sm" data-a="reset">Reset</button>')}</div>
 <div class="cd"><h2>About</h2><p>ScriptX-Engine runs entirely in your browser. Files are stored on this device and are not synced to GitHub.</p></div></div>`}
function storage(){const c=cap(),t=tot();return `<div class="pg" style="max-width:720px"><h1 class="lt">Storage</h1>
 <div class="cd"><h2>${sz(t)} used</h2><p>of ${sz(c)} available to ScriptX-Engine</p>${meter(t,c)}<small>Limits: 8 GB per repository, 64 GB in total.${Q.quota&&Q.quota<TOT?' Your browser currently allows '+sz(Q.quota)+', so that is the effective total.':''}</small></div>
 <div class="cd"><h2>Browser storage</h2>${row('Browser quota',Q.quota?'How much this site may use':'Not reported by this browser',`<b>${Q.quota?sz(Q.quota):'—'}</b>`)}${row('Used by this site','All site data, including repositories',`<b>${sz(Q.usage)}</b>`)}${row('Persistent storage',Q.persisted?'The browser will keep your data when space runs low':'The browser may clear data when space runs low',Q.persisted?'<b>On</b>':'<button class="btn t sm" data-a="persist">Allow</button>')}</div>
 <div class="sec"><h2>Repositories</h2></div>${R.length?R.map(r=>`<div class="cd"><div class="row" style="padding:0"><div><b>${esc(r.name)}</b><small>${sz(r.size)} of 8 GB</small></div><button class="btn t sm" data-a="delrepo" data-p="${esc(r.id)}">Delete</button></div>${meter(r.size,REPO)}</div>`).join(''):'<div class="empty">No repositories are using storage.</div>'}
 ${R.length?'<button class="btn bad" data-a="wipe">Delete all data</button>':''}</div>`}

/* preview */
const SHIM=`(function(){var p=function(t,a){parent.postMessage({sx:1,t:t,m:[].map.call(a,function(x){try{return typeof x==='object'?JSON.stringify(x):String(x)}catch(e){return String(x)}}).join(' ')},'*')};['log','warn','error','info'].forEach(function(k){var o=console[k];console[k]=function(){p(k,arguments);o.apply(console,arguments)}});onerror=function(m,s,l){p('error',[m+' (line '+l+')'])}})();`;
const fd=f=>F[f]&&typeof F[f].d==='string'?F[f].d:null;
function build(){let h=fd('index.html');if(h==null)return '<p style="font-family:sans-serif;padding:20px">Add an index.html file to see a preview.</p>';
 h=h.replace(/<link[^>]*href=["']([^"']+)["'][^>]*>/g,(m,f)=>fd(f)!=null?'<style>'+fd(f)+'</style>':m);
 h=h.replace(/<script([^>]*)src=["']([^"']+)["']([^>]*)><\/script>/g,(m,a,f)=>fd(f)!=null?'<script>'+fd(f).replace(/<\/script/g,'<\\/script')+'<\/script>':m);
 return '<script>'+SHIM+'<\/script>'+h}
const DV={phone:[412,860],tablet:[800,1100],desktop:[1280,800]};
function fit(){const d=$('#dev'),s=$('#stage');if(!d||!s)return;const [w,h]=DV[S.dev],wide=S.dev!=='phone',pw=wide?20:22,ph=wide?20:34;d.classList.toggle('wide',wide);d.style.width=w+pw+'px';d.style.height=h+ph+'px';d.style.transform='scale('+Math.max(.15,Math.min(1,(s.clientWidth-16)/(w+pw),(s.clientHeight-16)/(h+ph)))+')'}
function runPv(){const f=$('#fr');if(!f)return;f.srcdoc=build();$('#log').innerHTML='';fit()}
addEventListener('message',e=>{const f=$('#fr');if(f&&e.source===f.contentWindow&&e.data&&e.data.sx){const d=document.createElement('div');d.className=e.data.t;d.textContent=e.data.m;const l=$('#log');l.appendChild(d);l.scrollTop=l.scrollHeight}});

/* render + routing */
const NAV=[['home','Home','#/'],['repos','Repositories','#/repos'],['storage','Storage','#/storage'],['settings','Settings','#/settings']],NI={home:'home',repos:'repo',storage:'stor',settings:'set'};
async function render(){await flush();const h=ROUTE.replace(/^#\/?/,'').split('/').map(decodeURIComponent);P=h[0]||'home';let b='';
 if(P==='repo'){if(!cur||cur.id!==h[1])await loadRepo(h[1]);if(!cur){go('#/repos');return}tab=h[2]||'code';b=repoPg()}
 else b=({home,repos,new:newRepo,storage,settings}[P]||home)();
 if(P==='storage'||P==='home')await est();
 const y=$('#main').scrollTop;$('#main').innerHTML=P==='storage'?storage():b;if(P==='storage')$('#main').scrollTop=y;
 document.body.dataset.p=P;const on=P==='repo'||P==='new'?'repos':P;$('#rail').innerHTML=NAV.map(n=>`<a class="ni ${n[0]===on?'on':''}" href="${n[2]}" data-go="${n[2]}"><i>${ic(NI[n[0]])}</i>${n[1]}</a>`).join('');
 if(P==='repo'&&tab==='code'&&act&&F[act]&&typeof F[act].d==='string')mountEd();if(P==='repo'&&tab==='preview')runPv()}
function mountEd(){const t=$('#ta');t.value=F[act].d;paint();t.focus({preventScroll:true})}
function paint(){const t=$('#ta'),v=t.value;$('#hl').innerHTML=hl(v,hk(act))+'\n';$('#gut').textContent=Array.from({length:v.split('\n').length},(_,i)=>i+1).join('\n')+'\n';sync()}
function sync(){const t=$('#ta');if(!t)return;$('#hl').scrollTop=t.scrollTop;$('#hl').scrollLeft=t.scrollLeft;$('#gut').scrollTop=t.scrollTop}
function pos(){const t=$('#ta');if(!t)return;const b=t.value.slice(0,t.selectionStart).split('\n');$('#pos').textContent='Ln '+b.length+', Col '+(b[b.length-1].length+1)}
let ROUTE=location.hash;
const go=h=>{ROUTE=h;try{if(location.hash!==h)location.hash=h}catch(e){}return render()};
let t1;function sched(){dirty=true;setSv('Unsaved');if(S.as){clearTimeout(t1);t1=setTimeout(async()=>{await flush()},500)}if(S.lp&&$('#fr')){clearTimeout(sched.p);sched.p=setTimeout(runPv,700)}}
addEventListener('hashchange',()=>{if(location.hash!==ROUTE){ROUTE=location.hash;render()}});
addEventListener('error',e=>toast('Error: '+e.message));
$('#sf').onsubmit=e=>{e.preventDefault();qry=$('#sq').value;filt='all';go('#/repos')};
$('#sic').innerHTML=ic('srch');$('#fab').innerHTML=ic('add')+'New repository';

/* editor events */
document.addEventListener('input',e=>{const t=e.target;
 if(t.id==='ta'&&F[act]){F[act].d=t.value;paint();pos();sched();acShow();return}
 if(t.dataset.r==='fs'){S.fs=+t.value;sv();theme()}});
document.addEventListener('scroll',e=>{if(e.target.id==='ta'){sync();acHide()}},true);
document.addEventListener('keyup',e=>{if(e.target.id==='ta')pos()});
document.addEventListener('keydown',e=>{const t=e.target,c=e.ctrlKey||e.metaKey;
 if(c&&e.key==='s'&&act){e.preventDefault();dirty=true;flush().then(()=>toast('Saved'));return}
 if(t.id!=='ta')return;
 if(acL.length&&$('#ac').style.display==='block'){if(e.key==='ArrowDown'){e.preventDefault();acI=(acI+1)%acL.length;return acShow()}if(e.key==='ArrowUp'){e.preventDefault();acI=(acI+acL.length-1)%acL.length;return acShow()}if(e.key==='Enter'||e.key==='Tab'){e.preventDefault();return acPick(acI)}if(e.key==='Escape'){acHide();return}}
 const up=()=>t.dispatchEvent(new Event('input'));
 if(c&&e.key==='Enter'){e.preventDefault();go(rurl('/preview'));return}
 if(e.key==='Tab'){e.preventDefault();t.setRangeText(' '.repeat(S.tab),t.selectionStart,t.selectionEnd,'end');up()}
 else if(e.key==='Enter'){const s=t.selectionStart,ln=t.value.slice(0,s).split('\n').pop(),ind=ln.match(/^\s*/)[0]+(/[{(\[:]$/.test(ln)?' '.repeat(S.tab):'');e.preventDefault();t.setRangeText('\n'+ind,s,t.selectionEnd,'end');up()}
 else if(S.br&&'([{"\''.includes(e.key)&&t.selectionStart===t.selectionEnd){const pr={'(':')','[':']','{':'}','"':'"',"'":"'"},s=t.selectionStart;e.preventDefault();t.setRangeText(e.key+pr[e.key],s,s,'start');t.setSelectionRange(s+1,s+1);up()}});
document.addEventListener('mousedown',e=>{const li=e.target.closest('#ac li');if(li){e.preventDefault();acPick(+li.dataset.i)}});
addEventListener('beforeunload',e=>{if(dirty&&!S.as){e.preventDefault();e.returnValue=''}});

/* actions */
function bad(n){return !n||/^\/|\.\.|\\|\/\/|\/$/.test(n)||n.length>255}
document.addEventListener('click',async e=>{
 const gl=e.target.closest('[data-go]');if(gl){e.preventDefault();go(gl.dataset.go);return}
 const tgl=e.target.closest('[data-t]');if(tgl){S[tgl.dataset.t]=S[tgl.dataset.t]?0:1;sv();theme();const y=$('#main').scrollTop;await render();$('#main').scrollTop=y;return}
 const hb=e.target.closest('[data-h]');if(hb){S.hue=+hb.dataset.h;sv();theme();const y=$('#main').scrollTop;await render();$('#main').scrollTop=y;return}
 const el=e.target.closest('[data-a]');if(!el)return;const a=el.dataset.a,p=el.dataset.p;
 if(a==='open'){await flush();act=p;if(!openT.includes(p))openT.push(p);S.recent=[{r:cur.id,p,t:Date.now()},...S.recent.filter(x=>!(x.r===cur.id&&x.p===p))].slice(0,6);sv();render()}
 else if(a==='recent'){await loadRepo(el.dataset.r);if(cur&&F[p]){act=p;openT=[p]}go('#/repo/'+encodeURIComponent(el.dataset.r))}
 else if(a==='cd'){await flush();dir=p;act=null;render()}
 else if(a==='close'){await flush();openT=openT.filter(x=>x!==p);if(act===p)act=openT[openT.length-1]||null;render()}
 else if(a==='newfile'){const v=await dlg({t:'New file',m:'Use any name and extension. Add / to put it in a folder.',v:dir,ph:'src/main.py',ok:'Create'});if(!v)return;if(bad(v))return toast('Use a file name without a leading or trailing slash.');if(!F[v]&&!(await put(v,'')))return;await flush();act=v;if(!openT.includes(v))openT.push(v);render()}
 else if(a==='upload')$('#up').click();
 else if(a==='del'){if(await dlg({t:'Delete file?',m:act,ok:'Delete',bad:1})){const f=act;openT=openT.filter(x=>x!==f);dirty=false;act=openT[openT.length-1]||null;await rmFile(f);render()}}
 else if(a==='dl'){const u=URL.createObjectURL(F[act].d),l=document.createElement('a');l.href=u;l.download=act.split('/').pop();l.click()}
 else if(a==='gorun'){await flush();go(rurl('/preview'))}
 else if(a==='reload')runPv();
 else if(a==='devc'){S.dev=p;sv();$$('#main .seg button').forEach(b=>b.classList.toggle('on',b.dataset.p===p));fit()}
 else if(a==='con'){S.con=S.con?0:1;sv();$('#log').classList.toggle('off',!S.con);fit()}
 else if(a==='filt'){filt=p;qry='';$('#sq').value='';render()}
 else if(a==='pv'){$$('#vo .opt').forEach(o=>o.classList.toggle('on',o===el));S.vis=p;sv()}
 else if(a==='rr'){el.classList.toggle('on');el.setAttribute('aria-checked',el.classList.contains('on'))}
 else if(a==='create'){const n=$('#rn').value.trim();if(!/^[\w.-]{1,60}$/.test(n))return toast('Use letters, numbers, dots, dashes and underscores.');if(R.some(r=>r.id===n))return toast('A repository with that name already exists.');
  const r={id:n,name:n,desc:$('#rd').value.trim(),vis:S.vis,size:0,c:Date.now(),t:Date.now()};try{await idb('repos','readwrite',s=>s.put(r))}catch(x){return toast('The browser could not create the repository.')}
  R.push(r);cur=r;F={};openT=[];act=null;dir='';if($('#rr').classList.contains('on'))await put('README.md','# '+n+'\n\n'+r.desc+'\n');toast('Repository created');go('#/repo/'+encodeURIComponent(n))}
 else if(a==='saverepo'){cur.desc=$('#rdesc').value.trim();await idb('repos','readwrite',s=>s.put(cur));toast('Saved')}
 else if(a==='delrepo'){const r=R.find(x=>x.id===p);if(await dlg({t:'Delete '+r.name+'?',m:'All of its files will be removed from this device.',ok:'Delete',bad:1})){await rmRepo(p);toast('Repository deleted');go(P==='storage'?'#/storage':'#/repos')}}
 else if(a==='wipe'){if(await dlg({t:'Delete all data?',m:'Every repository and file will be removed from this device.',ok:'Delete all',bad:1})){for(const r of R.slice())await rmRepo(r.id);go('#/storage')}}
 else if(a==='persist'){try{Q.persisted=await navigator.storage.persist()}catch(x){}toast(Q.persisted?'Persistent storage is on.':'The browser declined persistent storage.');render()}
 else if(a==='name'){const v=await dlg({t:'Display name',v:S.name,ok:'Save'});if(v){S.name=v.slice(0,30);sv();theme();render()}}
 else if(a==='reset'){if(await dlg({t:'Reset settings?',m:'Your repositories are kept.',ok:'Reset'})){Object.assign(S,DS,{name:S.name,recent:S.recent});sv();theme();render()}}});
document.addEventListener('change',async e=>{const t=e.target;
 if(t.dataset.s==='rvis'){cur.vis=t.value;await idb('repos','readwrite',s=>s.put(cur));toast('Saved')}
 else if(t.dataset.s){S[t.dataset.s]=isNaN(t.value)?t.value:+t.value;sv();theme()}
 else if(t.id==='up'){let n=0;for(const f of t.files){const b=new Uint8Array(await f.slice(0,4096).arrayBuffer());const ok=await put(dir+f.name,b.includes(0)?f:await f.text());if(!ok)break;n++}t.value='';if(n)toast(n+' file'+(n>1?'s':'')+' uploaded');render()}});
matchMedia('(prefers-color-scheme:dark)').onchange=theme;addEventListener('resize',fit);
(async()=>{theme();try{await Promise.race([db(),new Promise((_,no)=>setTimeout(no,2000))])}catch(e){useMem=true;toast('Browser storage is blocked here, so changes last only until you close this page.')}
 try{R=await idb('repos','readonly',s=>s.getAll())||[]}catch(e){useMem=true;R=[]}render()})();
