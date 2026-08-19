const $=s=>document.querySelector(s),$$=s=>document.querySelectorAll(s);
window.addEventListener("load",()=>setTimeout(()=>$("#boot").classList.add("done"),900));$("#year").textContent=new Date().getFullYear();
const cursor=$(".cursor");addEventListener("pointermove",e=>{cursor.style.left=e.clientX+"px";cursor.style.top=e.clientY+"px";document.documentElement.style.setProperty("--mx",e.clientX/innerWidth-.5);document.documentElement.style.setProperty("--my",e.clientY/innerHeight-.5)});
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.classList.add("visible")}),{threshold:.1});$$(".reveal").forEach(x=>io.observe(x));
$$("[data-tilt]").forEach(el=>el.addEventListener("pointermove",e=>{let r=el.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;el.style.transform=`perspective(900px) rotateX(${y*-7}deg) rotateY(${x*9}deg)`;}));$$("[data-tilt]").forEach(el=>el.addEventListener("pointerleave",()=>el.style.transform=""));
$$(".magnetic").forEach(el=>el.addEventListener("pointermove",e=>{let r=el.getBoundingClientRect(),x=e.clientX-r.left-r.width/2,y=e.clientY-r.top-r.height/2;el.style.transform=`translate(${x*.12}px,${y*.12}px)`}));$$(".magnetic").forEach(el=>el.addEventListener("pointerleave",()=>el.style.transform=""));
const bg=$("#bg"),ctx=bg.getContext("2d");let stars=[],w,h;function resize(){w=innerWidth;h=innerHeight;bg.width=w*devicePixelRatio;bg.height=h*devicePixelRatio;ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);stars=Array.from({length:Math.min(210,Math.floor(w*h/6500))},()=>({x:Math.random()*w,y:Math.random()*h,z:Math.random(),v:.15+Math.random()*.7,r:.3+Math.random()*1.7}))}resize();addEventListener("resize",resize);(function particles(){ctx.clearRect(0,0,w,h);for(const s of stars){s.y+=s.v*(.5+s.z);if(s.y>h)s.y=-5;ctx.globalAlpha=.12+s.z*.35;ctx.fillStyle=s.z>.72?"#ff674a":"#b8c6c9";ctx.beginPath();ctx.arc(s.x,s.y,s.r+s.z*1.2,0,7);ctx.fill()}requestAnimationFrame(particles)})();
const frame=$("#modelFrame"),source=$("#sourceModel");function loadModel(id,name){frame.src=`https://sketchfab.com/models/${id}/embed?autostart=1&ui_theme=dark&ui_infos=0&ui_watermark=0&ui_stop=0&transparent=0&camera=0`;$("#liveName").textContent=name;source.href=`https://sketchfab.com/3d-models/${id}`;}
loadModel("755270d2e3c544059d123516a770161c","ACT 3 HOUSE");
$$(".m").forEach(b=>b.onclick=()=>{$$(".m").forEach(x=>x.classList.remove("active"));b.classList.add("active");$("#modelTitle").innerHTML=b.dataset.title.replace(" / ","<br>");$("#modelDesc").textContent=b.dataset.desc;loadModel(b.dataset.id,b.dataset.name)});
let auto=false;$("#rotateToggle").onclick=()=>{auto=!auto;$("#rotateToggle").textContent=auto?"AUTO ROTATE: ON":"AUTO ROTATE";frame.contentWindow?.postMessage(JSON.stringify({type:"command",command:"rotate",params:{speed:auto?1:0}}),"*")};
/* Trailer */
const vid=$("#trailerVideo"),prog=$("#videoProgress"),vt=$("#videoTime");$("#playTrailer").onclick=()=>vid.paused?vid.play():vid.pause();$("#muteTrailer").onclick=()=>{vid.muted=!vid.muted;$("#muteTrailer").textContent=vid.muted?"SOUND: OFF":"SOUND: ON"};vid.addEventListener("timeupdate",()=>{prog.style.width=(vid.currentTime/vid.duration*100)+"%";let t=Math.floor(vid.currentTime),m=String(Math.floor(t/60)).padStart(2,"0"),s=String(t%60).padStart(2,"0");vt.textContent=`${m}:${s}`});
/* Archive modal */
$("#archive").onclick=()=>$("#archiveModal").classList.add("open");$(".close").onclick=()=>$("#archiveModal").classList.remove("open");$("#archiveModal").onclick=e=>{if(e.target.id==="archiveModal")$("#archiveModal").classList.remove("open")};
/* Egg */
let clicks=0,timer;$("#egg").onclick=()=>{clicks++;clearTimeout(timer);timer=setTimeout(()=>clicks=0,1200);if(clicks>=5){clicks=0;$("#gameModal").classList.add("open");startGame()}};
/* Photo mode */
addEventListener("keydown",e=>{if(e.key.toLowerCase()==="f"){document.body.classList.toggle("photo-mode");document.querySelector("header").style.opacity=document.body.classList.contains("photo-mode")?"0":"1";document.querySelector("footer").style.opacity=document.body.classList.contains("photo-mode")?"0":"1"}});
/* hidden code */
let code="";addEventListener("keydown",e=>{code+=(e.key||"").toLowerCase();if(code.includes("neighbor")){$("#archive").textContent="ARCHIVE UNLOCKED ✓";$("#archive").style.background="#1e7d42";code=""}if(code.length>30)code=code.slice(-20)});
/* mini game */
const gc=$("#game"),g=gc.getContext("2d"),keys={},gameResult=$("#gameResult");let raf,player,neighbor,items,score;addEventListener("keydown",e=>{keys[e.key.toLowerCase()]=true;if(e.key==="Escape")$("#gameModal").classList.remove("open")});addEventListener("keyup",e=>keys[e.key.toLowerCase()]=false);$(".close-game").onclick=()=>{$("#gameModal").classList.remove("open");cancelAnimationFrame(raf)};
function startGame(){player={x:120,y:430,r:15};neighbor={x:760,y:90,r:20,dx:1.2};items=[{x:240,y:110,taken:false},{x:500,y:400,taken:false},{x:650,y:170,taken:false},{x:390,y:250,taken:false}];score=0;$("#score").textContent="0000";gameResult.classList.remove("show");cancelAnimationFrame(raf);loop()}
function loop(){update();draw();raf=requestAnimationFrame(loop)}function update(){let sp=4;if(keys.w||keys.arrowup)player.y-=sp;if(keys.s||keys.arrowdown)player.y+=sp;if(keys.a||keys.arrowleft)player.x-=sp;if(keys.d||keys.arrowright)player.x+=sp;player.x=Math.max(25,Math.min(gc.width-25,player.x));player.y=Math.max(25,Math.min(gc.height-25,player.y));neighbor.x+=neighbor.dx;if(neighbor.x>gc.width-35||neighbor.x<35)neighbor.dx*=-1;for(const k of items)if(!k.taken&&Math.hypot(player.x-k.x,player.y-k.y)<28){k.taken=true;score+=250;$("#score").textContent=String(score).padStart(4,"0")}if(Math.hypot(player.x-neighbor.x,player.y-neighbor.y)<34){gameResult.textContent="CAUGHT — TRY AGAIN";gameResult.classList.add("show");cancelAnimationFrame(raf)}if(items.every(k=>k.taken)){gameResult.textContent="ARCHIVE UNLOCKED +1000";gameResult.classList.add("show");score+=1000;$("#score").textContent=String(score).padStart(4,"0");cancelAnimationFrame(raf)}}
function draw(){g.fillStyle="#090d0e";g.fillRect(0,0,gc.width,gc.height);g.strokeStyle="#172223";g.lineWidth=2;for(let x=0;x<gc.width;x+=45){g.beginPath();g.moveTo(x,0);g.lineTo(x,gc.height);g.stroke()}for(let y=0;y<gc.height;y+=45){g.beginPath();g.moveTo(0,y);g.lineTo(gc.width,y);g.stroke()}for(const k of items)if(!k.taken){g.fillStyle="#ff5535";g.beginPath();g.arc(k.x,k.y,8,0,7);g.fill();g.strokeStyle="#ff553555";g.beginPath();g.arc(k.x,k.y,20,0,7);g.stroke()}g.fillStyle="#65ff83";g.beginPath();g.arc(player.x,player.y,player.r,0,7);g.fill();g.fillStyle="#ff5535";g.beginPath();g.arc(neighbor.x,neighbor.y,neighbor.r,0,7);g.fill();g.fillStyle="#fff";g.font="700 12px monospace";g.fillText("NIGHT SHIFT",20,25)}
/* BUILD 04 — FX CONSOLE */
const fxStage=$("#fxStage"),fxMode=$("#fxMode"),fxIntensity=$("#fxIntensity"),fxOut=$("#fxOut");
$$('.fx-buttons button').forEach(btn=>btn.addEventListener('click',()=>{const mode=btn.dataset.fx;$$('.fx-buttons button').forEach(x=>x.classList.remove('active'));btn.classList.add('active');fxStage.className='fx-stage fx-'+mode;fxMode.textContent=mode.toUpperCase()}));
fxIntensity?.addEventListener('input',()=>{const v=fxIntensity.value;fxOut.textContent=v+'%';fxStage.style.setProperty('--fx-power',v/100);fxStage.style.filter=`contrast(${1+v/500}) saturate(${.75+v/140})`});
$$('.fx-toggles button').forEach(btn=>btn.addEventListener('click',()=>{const cls='fx-'+btn.dataset.toggle;btn.classList.toggle('on');if(btn.classList.contains('on'))fxStage.classList.add(cls);else fxStage.classList.remove(cls)}));
/* Interactive perspective for the FX stage */
fxStage?.addEventListener('pointermove',e=>{const r=fxStage.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;fxStage.style.setProperty('--tiltX',(y*-5)+'deg');fxStage.style.setProperty('--tiltY',(x*7)+'deg');fxStage.style.transform=`perspective(1100px) rotateX(${y*-2}deg) rotateY(${x*3}deg)`});fxStage?.addEventListener('pointerleave',()=>fxStage.style.transform='');
/* Trailer controls */
const trailerVideo=$("#trailerVideo"),playTrailer=$("#playTrailer"),muteTrailer=$("#muteTrailer"),fullTrailer=$("#fullTrailer"),progress=$("#videoProgress"),timeEl=$("#videoTime");
playTrailer?.addEventListener('click',()=>{if(trailerVideo.paused){trailerVideo.play();playTrailer.textContent='PAUSE'}else{trailerVideo.pause();playTrailer.textContent='PLAY'}});
muteTrailer?.addEventListener('click',()=>{trailerVideo.muted=!trailerVideo.muted;muteTrailer.textContent=trailerVideo.muted?'SOUND: OFF':'SOUND: ON'});
trailerVideo?.addEventListener('timeupdate',()=>{const pct=trailerVideo.duration?(trailerVideo.currentTime/trailerVideo.duration*100):0;progress.style.width=pct+'%';const t=Math.floor(trailerVideo.currentTime),m=String(Math.floor(t/60)).padStart(2,'0'),ss=String(t%60).padStart(2,'0');timeEl.textContent=m+':'+ss});
fullTrailer?.addEventListener('click',()=>trailerVideo.requestFullscreen?.());
/* Click progress to seek */
$('.trailer-progress')?.addEventListener('pointerdown',e=>{const r=e.currentTarget.getBoundingClientRect();if(trailerVideo.duration)trailerVideo.currentTime=((e.clientX-r.left)/r.width)*trailerVideo.duration});
/* Keyboard camera tricks */
addEventListener('keydown',e=>{if(e.key==='1')document.querySelector('[data-fx="cinematic"]')?.click();if(e.key==='2')document.querySelector('[data-fx="holo"]')?.click();if(e.key==='3')document.querySelector('[data-fx="glitch"]')?.click();if(e.key==='4')document.querySelector('[data-fx="liquid"]')?.click();});

/* BUILD 05: model vault interactions */
const modelModal=document.getElementById("modelModal"), modalFrame=document.getElementById("modalModelFrame"), modalName=document.getElementById("modalModelName"), modalAuthor=document.getElementById("modalModelAuthor"), modalSource=document.getElementById("modalSource");
document.querySelectorAll(".open-model").forEach(btn=>btn.addEventListener("click",()=>{
  const card=btn.closest(".model-card-item"), uid=card.dataset.uid, title=card.dataset.title, author=card.dataset.author;
  modalName.textContent=title; modalAuthor.textContent=author+" · SKETCHFAB";
  modalFrame.src=`https://sketchfab.com/models/${uid}/embed?autostart=1&ui_theme=dark&ui_infos=0&ui_watermark=1`;
  modalSource.href=`https://sketchfab.com/models/${uid}`;
  modelModal.classList.add("open");
}));
document.querySelector(".close-model-modal")?.addEventListener("click",()=>{modelModal.classList.remove("open");modalFrame.src=""});
modelModal?.addEventListener("click",e=>{if(e.target===modelModal){modelModal.classList.remove("open");modalFrame.src=""}});
const modelSearch=document.getElementById("modelSearch"), modelFilter=document.getElementById("modelFilter"), modelCards=[...document.querySelectorAll(".model-card-item")];
function filterModels(){
 const q=(modelSearch?.value||"").toLowerCase(), f=modelFilter?.value||"all";
 modelCards.forEach(c=>{const text=c.textContent.toLowerCase(), kind=c.dataset.kind; let ok=text.includes(q)&&(f==="all"||kind===f||(kind==="3d"&&f===c.querySelector(".card-tag")?.textContent?.toLowerCase())); c.style.display=ok?"":"none"});
}
modelSearch?.addEventListener("input",filterModels);modelFilter?.addEventListener("change",filterModels);
const readProgress=document.getElementById("readProgress"), reading=document.getElementById("read");
addEventListener("scroll",()=>{if(!reading||!readProgress)return;const r=reading.getBoundingClientRect(), total=Math.max(1,r.height-innerHeight);readProgress.style.width=Math.max(0,Math.min(100,(-r.top/total)*100))+"%"});

/* BUILD 06 — VERSE SYSTEMS */
const $id=id=>document.getElementById(id);
const unlocks=new Set(JSON.parse(localStorage.getItem('hnv6-unlocks')||'[]'));
function unlock(key){
  unlocks.add(key);localStorage.setItem('hnv6-unlocks',JSON.stringify([...unlocks]));
  document.querySelector(`[data-ach="${key}"]`)?.classList.add('unlocked');
  const n=document.querySelectorAll('.achievement.unlocked').length;$id('achievementCount').textContent=n+'/6';
}
document.querySelectorAll('.achievement').forEach(x=>{if(unlocks.has(x.dataset.ach))x.classList.add('unlocked')});
$id('achievementCount').textContent=document.querySelectorAll('.achievement.unlocked').length+'/6';

/* Raven Brooks map + weather */
document.querySelectorAll('.map-house,.map-pin').forEach(el=>el.addEventListener('click',()=>{
  $id('mapPlace').textContent=el.dataset.place;$id('mapCopy').textContent=el.dataset.copy;unlock('contact');
  if(el.classList.contains('map-pin')){el.style.opacity='.35';collectOne(el)}
}));
const weatherNames={night:'NIGHT / CLEAR',sunset:'SUNSET / AMBER',storm:'STORM / SIGNAL',fog:'FOG / LOW VIS',snow:'SNOW / STATIC'};
document.querySelectorAll('.weather-btn').forEach(btn=>btn.addEventListener('click',()=>{
 document.body.dataset.weather=btn.dataset.weather;$id('weatherLabel').textContent=weatherNames[btn.dataset.weather];
 document.querySelectorAll('.weather-btn').forEach(x=>x.classList.remove('active'));btn.classList.add('active');
}));

/* Character lab */
const charFrame=$id('charFrame'),charName=$id('charName');
function setChar(id,name){charFrame.src=`https://sketchfab.com/models/${id}/embed?autostart=1&ui_theme=dark&ui_infos=0&ui_watermark=1`;charName.textContent=name}
setChar('06d357fa696e4e968f0c1d9ff321bbfc','THE NEIGHBOR');
document.querySelectorAll('.char-btn').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('.char-btn').forEach(x=>x.classList.remove('active'));btn.classList.add('active');setChar(btn.dataset.char,btn.dataset.name)}));
document.querySelectorAll('.char-mode').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('.char-mode').forEach(x=>x.classList.remove('active'));btn.classList.add('active');$id('charMode').textContent=btn.dataset.mode.toUpperCase();charFrame.style.filter=btn.dataset.mode==='wire'?'contrast(1.5) grayscale(1)':btn.dataset.mode==='xray'?'invert(.9) hue-rotate(120deg)':btn.dataset.mode==='holo'?'hue-rotate(120deg) saturate(2) brightness(1.2)':'none'}));
const animScrub=$id('animScrub'),animProgress=$id('animProgress');
animScrub?.addEventListener('input',()=>animProgress.style.width=animScrub.value+'%');
$id('playAllAnim')?.addEventListener('click',()=>{
 let start=performance.now(); function tick(t){let p=((t-start)/5000*100)%100;animScrub.value=p;animProgress.style.width=p+'%';if(p<99)requestAnimationFrame(tick)} requestAnimationFrame(tick);
});

/* Investigation board */
let selectedClue=null,links=[];
const clueEls=[...document.querySelectorAll('.clue')], svg=$id('caseLines');
function clueCenter(el){let b=el.getBoundingClientRect(),r=$id('caseBoard').getBoundingClientRect();return{x:(b.left+b.width/2-r.left)/r.width*900,y:(b.top+b.height/2-r.top)/r.height*520}}
function drawLinks(){svg.innerHTML=links.map(([a,b])=>{let p=clueCenter(a),q=clueCenter(b);return `<line x1="${p.x}" y1="${p.y}" x2="${q.x}" y2="${q.y}"/>`}).join('');$id('clueCount').textContent=String(links.length).padStart(2,'0')}
clueEls.forEach(el=>el.addEventListener('click',()=>{
 if(selectedClue===el){el.classList.remove('selected');selectedClue=null;return}
 if(!selectedClue){selectedClue=el;el.classList.add('selected');$id('caseLog').innerHTML+='> SELECTED '+el.dataset.clue+'<br>';return}
 if(selectedClue!==el){
   if(!links.some(([a,b])=>(a===selectedClue&&b===el)||(a===el&&b===selectedClue)))links.push([selectedClue,el]);
   selectedClue.classList.remove('selected');el.classList.remove('selected');selectedClue=null;drawLinks();unlock('link');
   $id('caseLog').innerHTML+='> LINKED '+links.at(-1)[0].dataset.clue+' ↔ '+links.at(-1)[1].dataset.clue+'<br>';
   if(links.length>=3){$id('basementState').textContent='UNLOCKED';$id('basementDoor').classList.add('open');$id('basementReadout').textContent='THREE LINKS ACCEPTED. THE DOOR IS LISTENING.';unlock('basement')}
 }
}));
addEventListener('resize',drawLinks);

/* Basement rooms */
document.querySelectorAll('.basement-room').forEach(el=>el.addEventListener('click',()=>{
 $id('basementReadout').textContent=links.length>=3?`${el.dataset.room} // SIGNAL FOUND // ADDING CLUE...`:'ACCESS DENIED // LINK MORE CASE CLUES';
 if(links.length>=3)collectOne(el);
}));
$id('basementDoor')?.addEventListener('click',()=>{if(links.length>=3){$id('basementReadout').textContent='UNKNOWN ROOM OPEN // CAMERA FEED 00:00:17';unlock('basement')}else $id('basementReadout').textContent='LOCKED // THREE CONNECTIONS REQUIRED'});

/* House builder */
const buildStage=$id('buildStage'), roofSelect=$id('roofSelect'),wallRange=$id('wallRange'),windowRange=$id('windowRange'),doorSelect=$id('doorSelect'),lightRange=$id('lightRange');
function renderHouse(){
 buildStage.dataset.roof=roofSelect.value;buildStage.style.setProperty('--wall-level',wallRange.value);buildStage.style.setProperty('--window-level',windowRange.value);buildStage.dataset.door=doorSelect.value;buildStage.style.setProperty('--house-light',lightRange.value/100);
 $id('houseDNA').textContent=`${roofSelect.value.toUpperCase()} / ${wallRange.value}F / ${windowRange.value}W / ${doorSelect.value.toUpperCase()}`;
}
[roofSelect,wallRange,windowRange,doorSelect,lightRange].forEach(x=>x?.addEventListener('input',renderHouse));
$id('randomHouse')?.addEventListener('click',()=>{roofSelect.value=['tower','gable','flat'][Math.floor(Math.random()*3)];wallRange.value=1+Math.floor(Math.random()*3);windowRange.value=1+Math.floor(Math.random()*4);doorSelect.value=['red','black','glass'][Math.floor(Math.random()*3)];lightRange.value=30+Math.floor(Math.random()*70);renderHouse();unlock('builder')});
renderHouse();

/* Collectibles */
const collectibleEls=[...document.querySelectorAll('.map-pin,.basement-room')],collected=new Set(JSON.parse(localStorage.getItem('hnv6-collected')||'[]'));
function collectOne(el){let key=el.dataset.place||el.dataset.room;if(!key||collected.has(key))return;collected.add(key);localStorage.setItem('hnv6-collected',JSON.stringify([...collected]));$id('collectCount').textContent=`${collected.size} / 12`;el.classList.add('collected')}
$id('collectCount').textContent=`${collected.size} / 12`;

/* VHS / Nightmare */
$id('vhsToggle')?.addEventListener('click',()=>{document.body.classList.toggle('vhs-mode');unlock('vhs');$id('vhsToggle').textContent=document.body.classList.contains('vhs-mode')?'EXIT VHS MODE':'ENTER VHS MODE'});
$id('nightmareToggle')?.addEventListener('click',()=>{document.body.classList.toggle('nightmare-mode');unlock('dream');$id('nightmareToggle').textContent=document.body.classList.contains('nightmare-mode')?'EXIT NIGHTMARE':'ENTER NIGHTMARE'});

/* Terminal */
const terminalModal=$id('terminalModal'),terminalScreen=$id('terminalScreen'),terminalInput=$id('terminalInput');
$id('terminalBtn')?.addEventListener('click',()=>{terminalModal.classList.add('open');terminalInput.focus()});
document.querySelector('.close-terminal')?.addEventListener('click',()=>terminalModal.classList.remove('open'));
terminalModal?.addEventListener('click',e=>{if(e.target===terminalModal)terminalModal.classList.remove('open')});
$id('terminalForm')?.addEventListener('submit',e=>{
 e.preventDefault();let cmd=terminalInput.value.trim().toLowerCase();let out='';
 if(cmd==='help')out='> scan house\\n> scan neighbor\\n> open basement\\n> search clue 017\\n> access unknown';
 else if(cmd==='scan house')out='> HOUSE SIGNATURE FOUND\\n> ACT 3 / 755270...';
 else if(cmd==='scan neighbor')out='> BIOMETRIC UNKNOWN\\n> EYES ON CAMERA 04';
 else if(cmd==='open basement')out=links.length>=3?'> ACCESS GRANTED / UNKNOWN ROOM':' > ACCESS DENIED / 3 LINKS REQUIRED';
 else if(cmd==='search clue 017')out='> CLUE 017 / KEY / LOCATION: RAVEN BROOKS';
 else if(cmd==='access unknown')out='> SIGNAL ACCEPTED\\n> WHO IS WATCHING?';
 else out='> COMMAND NOT FOUND / TRY help';
 terminalScreen.textContent+='\\n> '+cmd+'\\n'+out;terminalInput.value='';terminalScreen.scrollTop=terminalScreen.scrollHeight;
});

/* Achievements */
const achModal=$id('achievementsModal');
$id('achievementsBtn')?.addEventListener('click',()=>achModal.classList.add('open'));
document.querySelector('.close-achievements')?.addEventListener('click',()=>achModal.classList.remove('open'));
achModal?.addEventListener('click',e=>{if(e.target===achModal)achModal.classList.remove('open')});

/* Secret ending */
const finalEl=document.querySelector('.final');
function checkFinal(){if(unlocks.size>=6&&collected.size>=8){finalEl.querySelector('h2').innerHTML='THE<br><em>VERSE IS WATCHING.</em>';finalEl.querySelector('p').textContent='100% archive state reached. UNKNOWN ROOM / FINAL SIGNAL AVAILABLE.'}}
setInterval(checkFinal,1200);
