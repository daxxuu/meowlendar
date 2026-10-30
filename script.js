const MN=['January','February','March','April','May','June','July','August','September','October','November','December'];
const WD=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const pad=n=>String(n).padStart(2,'0'),key=(y,m,d)=>y+'-'+pad(m+1)+'-'+pad(d);
function easter(y){const a=y%19,b=Math.floor(y/100),c=y%100,d=Math.floor(b/4),e=b%4,f=Math.floor((b+8)/25),g=Math.floor((b-f+1)/3),h=(19*a+b-d-g+15)%30,i=Math.floor(c/4),k=c%4,l=(32+2*e+2*i-h-k)%7,m=Math.floor((a+11*h+22*l)/451),mo=Math.floor((h+l-7*m+114)/31),da=((h+l-7*m+114)%31)+1;return new Date(y,mo-1,da)}
const CNY={2025:[0,29],2026:[1,17],2027:[1,6],2028:[0,26],2029:[1,13]};
const FIT={2025:[2,31],2026:[2,20],2027:[2,10],2028:[1,27],2029:[1,15]},FAD={2025:[5,6],2026:[4,27],2027:[4,16],2028:[4,5],2029:[3,24]};
const cache={};
function hols(y){if(cache[y])return cache[y];const H={};
const add=(m,d,n,t)=>{(H[key(y,m,d)]=H[key(y,m,d)]||[]).push({n,t})};
const R='Regular Holiday',S='Special Non-Working Day',W='Special Working Day';
add(0,1,'New Year’s Day',R);add(3,9,'Araw ng Kagitingan',R);add(4,1,'Labor Day',R);add(5,12,'Independence Day',R);
add(10,30,'Bonifacio Day',R);add(11,25,'Christmas Day',R);add(11,30,'Rizal Day',R);
add(7,21,'Ninoy Aquino Day',S);add(10,1,'All Saints’ Day',S);add(11,8,'Immaculate Conception',S);add(11,31,'Last Day of the Year',S);
add(1,25,'EDSA People Power Anniv.',W);add(10,2,'All Souls’ Day',W);add(11,24,'Christmas Eve',S);
let a=new Date(y,7,31);while(a.getDay()!==1)a.setDate(a.getDate()-1);add(7,a.getDate(),'National Heroes Day',R);
const e=easter(y),sh=o=>{const x=new Date(e);x.setDate(x.getDate()+o);return x};
[[-3,'Maundy Thursday',R],[-2,'Good Friday',R],[-1,'Black Saturday',S],[0,'Easter Sunday','Observance']].forEach(([o,n,t])=>{const x=sh(o);add(x.getMonth(),x.getDate(),n,t)});
if(CNY[y])add(CNY[y][0],CNY[y][1],'Chinese New Year',S);
if(FIT[y])add(FIT[y][0],FIT[y][1],'Eid’l Fitr (date may shift)',R);
if(FAD[y])add(FAD[y][0],FAD[y][1],'Eid’l Adha (date may shift)',R);
return cache[y]=H}
let evs={};try{evs=JSON.parse(localStorage.getItem('doodle-events')||'{}')}catch(e){}
const saveE=()=>{try{localStorage.setItem('doodle-events',JSON.stringify(evs))}catch(e){}};
const hOf=(y,m,d)=>(hols(y)[key(y,m,d)]||[]).concat((evs[key(y,m,d)]||[]).map(n=>({n,t:'Event'})));
let notes={};try{notes=JSON.parse(localStorage.getItem('doodle-notes')||'{}')}catch(e){}
const save=()=>{try{localStorage.setItem('doodle-notes',JSON.stringify(notes))}catch(e){}};
const now=new Date();let vy=now.getFullYear(),vm=now.getMonth(),sel=null;
const $=id=>document.getElementById(id),grid=$('grid');
const circle='<svg viewBox="0 0 50 50"><path d="M25 3C38 2 48 12 47 26C46 40 36 48 24 47C11 46 3 37 4 24C5 12 14 4 28 5"/></svg>';
function render(dir){
  const draw=()=>{
    $('title').innerHTML=MN[vm]+'<small>'+vy+'</small>';
    const first=new Date(vy,vm,1).getDay(),dim=new Date(vy,vm+1,0).getDate(),prevDim=new Date(vy,vm,0).getDate();
    let h='';
    for(let i=0;i<42;i++){
      let d=i-first+1,m=vm,y=vy,mute='';
      if(d<1){d=prevDim+d;m=vm-1;mute=' mute'}else if(d>dim){d-=dim;m=vm+1;mute=' mute'}
      const dt=new Date(vy,m,d);y=dt.getFullYear();m=dt.getMonth();
      if(i>=35&&mute)break;
      const k=key(y,m,d),hs=hOf(y,m,d),nn=(notes[k]||[]).length;
      const isT=y===now.getFullYear()&&m===now.getMonth()&&d===now.getDate();
      h+=`<div class="d${mute}${dt.getDay()===0?' sun':''}${sel===k?' sel':''}" data-k="${k}" data-y="${y}" data-m="${m}" data-d="${d}">${isT?circle:''}<span class="n">${d}</span><div class="mk">${hs.length?'<b class="h"></b>':''}${nn?'<b></b>':''}</div></div>`}
    grid.innerHTML=h;
  };
  if(!dir){draw();return}
  grid.style.setProperty('--dx',(dir*40)+'px');grid.className='grid out';
  setTimeout(()=>{draw();grid.className='grid in'},220);
}
function go(n){vm+=n;if(vm<0){vm=11;vy--}if(vm>11){vm=0;vy++}render(n)}
$('prev').onclick=()=>go(-1);$('next').onclick=()=>go(1);
$('todayBtn').onclick=()=>{const dir=(now.getFullYear()*12+now.getMonth())>(vy*12+vm)?1:-1;vy=now.getFullYear();vm=now.getMonth();render(dir)};
let sx=0;document.querySelector('.sheet').addEventListener('touchstart',e=>sx=e.touches[0].clientX,{passive:true});
document.querySelector('.sheet').addEventListener('touchend',e=>{const dx=e.changedTouches[0].clientX-sx;if(Math.abs(dx)>70)go(dx<0?1:-1)});
/* long press */
const tip=$('tip');let lp=null,fired=false,hideT=null,sp=null;
function showTip(el){
  const y=+el.dataset.y,m=+el.dataset.m,d=+el.dataset.d,hs=hOf(y,m,d);
  let h=`<h4>${MN[m].slice(0,3)} ${d}</h4>`;
  h+=hs.length?hs.map(x=>`<p>✦ ${x.n}<br><span class="soft">${x.t}</span></p>`).join(''):'<p class="soft">No holiday or event ✎</p>';
  tip.innerHTML=h;const r=el.getBoundingClientRect();tip.classList.add('on');
  const w=tip.offsetWidth,th=tip.offsetHeight;
  let x=Math.min(Math.max(8,r.left+r.width/2-w/2),innerWidth-w-8),yy=r.top-th-12;if(yy<8)yy=r.bottom+10;
  tip.style.left=x+'px';tip.style.top=yy+'px';
  clearTimeout(hideT);hideT=setTimeout(()=>tip.classList.remove('on'),3500);
}
grid.addEventListener('pointerdown',e=>{const el=e.target.closest('.d');if(!el)return;fired=false;sp=[e.clientX,e.clientY];
  lp=setTimeout(()=>{fired=true;if(navigator.vibrate)navigator.vibrate(15);showTip(el)},450)});
const cancel=()=>clearTimeout(lp);
grid.addEventListener('pointermove',e=>{if(sp&&Math.hypot(e.clientX-sp[0],e.clientY-sp[1])>10)cancel()});
['pointerup','pointercancel','pointerleave'].forEach(t=>grid.addEventListener(t,cancel));
grid.addEventListener('contextmenu',e=>e.preventDefault());
grid.addEventListener('click',e=>{const el=e.target.closest('.d');if(!el)return;if(fired){fired=false;return}openPane(el)});
/* pane */
const pane=$('pane'),ov=$('ov');
function openPane(el){
  tip.classList.remove('on');
  const y=+el.dataset.y,m=+el.dataset.m,d=+el.dataset.d,k=el.dataset.k;sel=k;
  if(m!==vm){vm=m;vy=y;render()}else{grid.querySelectorAll('.d').forEach(c=>c.classList.toggle('sel',c.dataset.k===k))}
  const paint=()=>{
    const hs=hOf(y,m,d),ns=notes[k]||[];
    pane.innerHTML=`<button class="x close" id="cl">✕</button><h2>${MN[m]} ${d}</h2><div class="sub">${WD[new Date(y,m,d).getDay()]}, ${y}</div>`+
    hs.map(x=>`<div class="hol"><span>✦</span><div>${x.n}<small>${x.t}</small></div></div>`).join('')+
    (ns.length?ns.map((t,i)=>`<div class="note"><span>✎ ${t.replace(/</g,'&lt;')}</span><button class="x" data-i="${i}" aria-label="Delete">✕</button></div>`).join(''):'<div class="empty">no notes yet… add one ↓</div>')+
    `<div class="add"><input id="inp" maxlength="120" placeholder="write a note…" autocomplete="off"><button class="btn" id="ad">Add</button></div>`;
    $('cl').onclick=closePane;
    const add=()=>{const v=$('inp').value.trim();if(!v)return;(notes[k]=notes[k]||[]).push(v);save();paint();render();$('inp').focus()};
    $('ad').onclick=add;$('inp').onkeydown=e=>{if(e.key==='Enter')add()};
    pane.querySelectorAll('.note .x').forEach(b=>b.onclick=()=>{notes[k].splice(+b.dataset.i,1);if(!notes[k].length)delete notes[k];save();paint();render()});
  };
  paint();pane.classList.add('on');ov.classList.add('on');
}
function closePane(){pane.classList.remove('on');ov.classList.remove('on');sel=null;grid.querySelectorAll('.sel').forEach(c=>c.classList.remove('sel'))}
ov.onclick=closePane;document.addEventListener('keydown',e=>{if(e.key==='Escape')closePane()});
Object.keys(notes).forEach(k=>{if(Array.isArray(notes[k]))notes[k]=notes[k].join('\n')});
const card=$('card'),esc=s=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;');
card.addEventListener('click',e=>{if(!e.target.closest('.del')){card.querySelectorAll('.del').forEach(x=>x.remove());card.querySelectorAll('.arm').forEach(x=>x.classList.remove('arm'))}});
function closePane(){card.classList.remove('on');ov.classList.remove('on');render()}
function showTip(el){openCard(el,'events')}
function openPane(el){openCard(el,'note')}
function openCard(el,mode){
  const y=+el.dataset.y,m=+el.dataset.m,d=+el.dataset.d,k=el.dataset.k,r=el.getBoundingClientRect();
  card.style.setProperty('--fx',(r.left+r.width/2-innerWidth/2)+'px');card.style.setProperty('--fy',(r.top+r.height/2-innerHeight/2)+'px');
  const paint=()=>{
    const hs=hols(y)[k]||[],es=evs[k]||[];
    let h=`<h2>${d}</h2><div class="sub">${WD[new Date(y,m,d).getDay()]}, ${MN[m]} ${y}</div>`;
    if(mode==='note')h+=`<textarea id="nt" maxlength="600" placeholder="…">${esc(notes[k]||'')}</textarea>`;
    else{
      h+=hs.map(x=>`<div class="ev"><span>✦ ${x.n}<small>${x.t}</small></span></div>`).join('');
      h+=es.map((t,i)=>`<div class="ev cu" data-i="${i}"><span>◆ ${esc(t)}</span></div>`).join('');
      h+=`<div class="add"><input id="inp" maxlength="80" placeholder="+ event" autocomplete="off"></div>`;
    }
    card.innerHTML=h;
    if(mode==='note'){$('nt').oninput=e=>{const v=e.target.value;if(v.trim())notes[k]=v;else delete notes[k];save()}}
    else{
      $('inp').onkeydown=e=>{if(e.key==='Enter'){const v=e.target.value.trim();if(!v)return;(evs[k]=evs[k]||[]).push(v);saveE();paint();$('inp').focus()}};
      card.querySelectorAll('.ev.cu').forEach(r=>{let t;
        r.onpointerdown=()=>{t=setTimeout(()=>{if(navigator.vibrate)navigator.vibrate(15);card.querySelectorAll('.del').forEach(x=>x.remove());card.querySelectorAll('.arm').forEach(x=>x.classList.remove('arm'));r.classList.add('arm');r.insertAdjacentHTML('beforeend','<button class="del">Delete</button>');r.querySelector('.del').onclick=()=>{evs[k].splice(+r.dataset.i,1);if(!evs[k].length)delete evs[k];saveE();paint()}},450)};
        ['pointerup','pointerleave','pointercancel'].forEach(n=>r.addEventListener(n,()=>clearTimeout(t)));
        r.oncontextmenu=e=>e.preventDefault()});
    }
  };
  card.classList.toggle('mini',mode==='events');card.classList.remove('on');paint();ov.classList.add('on');
  const w=card.offsetWidth,hh=card.offsetHeight;
  const L=mode==='note'?(innerWidth-w)/2:Math.min(Math.max(8,r.left+r.width/2-w/2),innerWidth-w-8),T=mode==='note'?Math.max(8,(innerHeight-hh)/2):Math.min(Math.max(8,r.top-8),innerHeight-hh-8);
  card.style.left=L+'px';card.style.top=T+'px';card.style.setProperty('--ox',(r.left+r.width/2-L)+'px');card.style.setProperty('--oy',(r.top+r.height/2-T)+'px');
  requestAnimationFrame(()=>requestAnimationFrame(()=>card.classList.add('on')));
}
render();
