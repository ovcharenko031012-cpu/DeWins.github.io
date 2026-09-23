(function(){
/* ---------- data ---------- */
var RAR = {
  c:{n:'Обычный',col:'var(--r-common)',w:52,m:.3},
  u:{n:'Необычный',col:'var(--r-uncommon)',w:26,m:.7},
  r:{n:'Редкий',col:'var(--r-rare)',w:13,m:1.6},
  e:{n:'Эпический',col:'var(--r-epic)',w:7,m:4},
  l:{n:'Легендарный',col:'var(--r-legend)',w:2,m:10}
};
var TYPES={pistol:'Пистолет',rifle:'Винтовка',knife:'Нож',glove:'Перчатки'};
// Редкость зависит от типа оружия, а не от места в списке:
// пистолеты — попроще, винтовки — средние, ножи и перчатки — самые крутые.
// Керамбит — единственный легендарный предмет во всей игре.
function rarityFor(type,name){
  if(type==='knife')return name.indexOf('Керамбит')>-1?'l':'e';
  if(type==='glove')return 'e';
  if(type==='rifle')return 'u';
  return 'c';
}
// Названия и оружие — настоящие скины CS2 (по данным wiki.cs.money).
// Картинки взять нельзя: чужие изображения (Steam/Valve), поэтому иконки рисуются сами.
var CASES=[
 {id:'dew',name:'Росинка',price:50,col:'#ffcf4d',items:['Glock-18 | Блок-18@pistol','P250 | Азимов@pistol','MAC-10 | Световой короб@rifle','MP7 | Улыбочка@rifle','Кукри | Африканская сетка@knife','Спортивные перчатки | Ампутация@glove','SG 553 | Пульсар@rifle','Классический нож | Синяя сталь@knife']},
 {id:'storm',name:'Гроза',price:150,col:'#4f9dff',items:['P2000 | Восход@pistol','Обмотки рук | Слоновая кость@glove','Galil AR | Хамелеон@rifle','Tec-9 | Шлак@pistol','Кукри | Ночная полоса@knife','Мотоциклетные перчатки | Полосы удачи@glove','FAMAS | Пуантилизм@rifle','Складной нож | Тигровый зуб@knife']},
 {id:'waste',name:'Пустошь',price:300,col:'#ffc35a',items:['CZ75-Auto | Ползучая смерть@pistol','Nova | Печать тьмы@rifle','Перчатки «Бладхаунд» | Пустынный барс@glove','Five-SeveN | Гибрид@pistol','Кукри | Северный лес@knife','Водительские перчатки | Королевский джейд@glove','UMP-45 | Мотор@rifle','Нож Боуи | Ножевая рана@knife']},
 {id:'neon',name:'Неон',price:600,col:'#ff5fb0',items:['Dual Berettas | Убежище@pistol','Перчатки «Гидра» | Загар@glove','AUG | Атлант@rifle','Zeus x27 | Олимп@pistol','Кукри | Убийство@knife','Перчатки спецназа | Хаос в кино@glove','XM1014 | Ирэдзуми@rifle','Нож-бабочка | Убийство@knife']},
 {id:'deep',name:'Глубина',price:1200,col:'#3aa6ff',items:['USP-S | Зубоскал@pistol','Перчатки «Сломанный клык» | Ночь@glove','Обрез | Аналоговый ввод@rifle','Desert Eagle | Печать императора@pistol','Кукри | Патина@knife','Спортивные перчатки | Ампутация@glove','SSG 08 | Катастрофа@rifle','Кукри | Поверхностная закалка@knife']},
 {id:'crown',name:'Корона',price:3000,col:'#9b7bff',items:['Glock-18 | Блок-18@pistol','Водительские перчатки | Королевский джейд@glove','M4A4 | Мастер травли@rifle','P250 | Азимов@pistol','Штык-нож М9 | Мраморный градиент@knife','Перчатки «Гидра» | Загар@glove','AK-47 | Наследство@rifle','Кукри | Градиент@knife']},
 {id:'dusk',name:'Полночь',price:90,col:'#7b8cff',items:['Tec-9 | Шлак@pistol','Обмотки рук | Слоновая кость@glove','MP7 | Улыбочка@rifle','P2000 | Восход@pistol','Классический нож | Синяя сталь@knife','Мотоциклетные перчатки | Полосы удачи@glove','Galil AR | Хамелеон@rifle','Кукри | Vanilla@knife']},
 {id:'retro',name:'Ретро',price:450,col:'#ff8a4c',items:['Five-SeveN | Гибрид@pistol','Перчатки спецназа | Хаос в кино@glove','FAMAS | Пуантилизм@rifle','CZ75-Auto | Ползучая смерть@pistol','Складной нож | Тигровый зуб@knife','Перчатки «Бладхаунд» | Пустынный барс@glove','AUG | Атлант@rifle','Керамбит | Градиент@knife']}
];
var GROUPS=[
 {n:'Для старта',ids:['dew','dusk','storm']},
 {n:'Классика',ids:['waste','retro','neon']},
 {n:'Премиум',ids:['deep','crown']}
];
var ALL=[];
CASES.forEach(function(cs){
  var seed=cs.id.length*7+cs.price;
  cs.list=cs.items.map(function(s,i){
    var p=s.split('@'), rk=rarityFor(p[1],p[0]);
    var jitter=.9+((seed*(i+3))%21)/100;
    var it={key:cs.id+i,name:p[0],type:p[1],rar:rk,value:Math.max(1,Math.round(cs.price*RAR[rk].m*jitter)),cid:cs.id};
    ALL.push(it); return it;
  });
  var cnt={};cs.list.forEach(function(it){cnt[it.rar]=(cnt[it.rar]||0)+1});
  cs.list.forEach(function(it){it.chance=RAR[it.rar].w/cnt[it.rar]});
});
function caseById(id){return CASES.filter(function(c){return c.id===id})[0]}

/* ---------- icons ---------- */
var SHAPES={
 pistol:'<rect x="8" y="18" width="60" height="15" rx="4"/><rect x="68" y="21" width="14" height="9" rx="2"/><path d="M16 33h16v20q0 4-4 4h-8q-4 0-4-4z"/><path d="M30 33v10q-8 1-8-6" fill="none" stroke-width="3"/>',
 rifle:'<rect x="6" y="24" width="70" height="13" rx="4"/><rect x="76" y="26" width="18" height="9" rx="2"/><path d="M18 37h14v18q0 3-3 3h-8q-3 0-3-3z"/><rect x="38" y="15" width="6" height="9" rx="1"/><path d="M56 37l-8 20h11l6-20z"/>',
 knife:'<g transform="rotate(-24 48 33)"><rect x="2" y="18" width="24" height="24" rx="7"/><rect x="9" y="18" width="4" height="24" fill="#0006"/><rect x="17" y="18" width="4" height="24" fill="#0006"/><rect x="27" y="12" width="5" height="36" rx="2"/><path d="M34 20L90 4l4 8-58 24z"/></g>',
 glove:'<path d="M22 50V26q0-4 4-4t4 4v-8q0-4 4-4t4 4v-2q0-4 4-4t4 4v4q0-3 4-3t4 4v22q0 10-8 12H32q-10 0-10-8z"/><rect x="26" y="52" width="32" height="6" rx="2"/>'
};
var uid=0;
function icon(type,color){
  var id='g'+(uid++);
  return '<svg viewBox="0 0 96 64" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><defs><linearGradient id="'+id+'" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".95"/><stop offset="1" stop-color="'+color+'"/></linearGradient></defs><g fill="url(#'+id+')" stroke="rgba(0,0,0,.35)" stroke-width="1">'+SHAPES[type]+'</g></svg>';
}
function boxSvg(col,type){
  // кейс нарисован как кубок; из него выглядывает силуэт оружия
  var wpn=type?icon(type,col):'';
  return '<svg class="box" viewBox="0 0 140 130" aria-hidden="true">'+
   '<ellipse cx="70" cy="120" rx="40" ry="6" fill="rgba(0,0,0,.4)"/>'+
   '<rect x="58" y="96" width="24" height="16" rx="3" fill="'+col+'" fill-opacity=".35" stroke="'+col+'" stroke-width="2"/>'+
   '<rect x="44" y="108" width="52" height="10" rx="4" fill="'+col+'" fill-opacity=".5" stroke="'+col+'" stroke-width="2"/>'+
   '<path d="M40 20h60v6c0 22-12 40-30 40S40 48 40 26z" fill="#12242c" stroke="'+col+'" stroke-width="2.5"/>'+
   '<path d="M40 24c-16 0-24 10-24 22s10 18 22 18" fill="none" stroke="'+col+'" stroke-width="2.5"/>'+
   '<path d="M100 24c16 0 24 10 24 22s-10 18-22 18" fill="none" stroke="'+col+'" stroke-width="2.5"/>'+
   '<foreignObject x="30" y="0" width="80" height="52">'+wpn+'</foreignObject>'+
   '</svg>';
}
function fmt(n){return Math.round(n).toLocaleString('ru-RU')}
function rc(r){return RAR[r].col}

/* ---------- state ---------- */
var S={bal:1000,inv:[],lastBonus:0,promo:false,feed:[],steam:null,cnt:{},best:null,hist:[],pid:0,used:[],free:{}};
try{var raw=localStorage.getItem('dewins_v1');if(raw){var o=JSON.parse(raw);if(o&&typeof o.bal==='number')S=Object.assign(S,o)}}catch(e){}
if(!S.pid)S.pid=100000+Math.floor(Math.random()*900000);
if(!S.cnt)S.cnt={};if(!S.hist)S.hist=[];if(!S.used)S.used=[];if(!S.free)S.free={};if(S.promo&&S.used.indexOf('DEWINS')<0)S.used.push('DEWINS');
function hist(t,a){S.hist.unshift({t:t,a:a||0,d:Date.now()});S.hist=S.hist.slice(0,40)}
function openLabel(c){var f=S.free[c.id]||0;return f>0?'Открыть бесплатно (осталось '+f+')':'Открыть за '+fmt(c.price)+' DW'}
function redeemPromo(raw){
  var code=(raw||'').trim().toUpperCase(),P=window.DEWINS_PROMOS||{};
  if(!code){toast('Введи промокод');return}
  var pr=P[code];
  if(!pr){toast('Такого промокода нет');return}
  if(pr.expires&&Date.now()>Date.parse(pr.expires+'T23:59:59')){toast('Срок промокода истёк');return}
  if(S.used.indexOf(code)>-1){toast('Ты уже использовал этот промокод');return}
  var msg,amt=0,cs;
  if(pr.type==='balance'){S.bal+=pr.amount;amt=pr.amount;msg='+'+fmt(pr.amount)+' DW'}
  else if(pr.type==='freecase'){cs=caseById(pr.case);if(!cs){toast('Промокод настроен неверно');return}
    var n=pr.count||1;S.free[pr.case]=(S.free[pr.case]||0)+n;msg='Бесплатных открытий «'+cs.name+'»: +'+n}
  else if(pr.type==='item'){cs=caseById(pr.case);var pool=cs?cs.list.filter(function(i){return i.rar===pr.rarity}):[];
    if(!pool.length){toast('Промокод настроен неверно');return}
    var w=pool[Math.floor(Math.random()*pool.length)];S.inv.unshift(newItem(w));msg='Предмет: '+w.name+' ('+fmt(w.value)+' DW)'}
  else{toast('Неизвестный тип промокода');return}
  S.used.push(code);hist('Промокод '+code+': '+msg,amt);toast(msg);render();
}
function save(){try{localStorage.setItem('dewins_v1',JSON.stringify(S))}catch(e){}}
var view='cases',curCase=null,busy=false,upSel=null,upMult=2,fast=false,lastWin=null,contractSel=[];
var $app=document.getElementById('app');

function toast(t){var el=document.getElementById('toast');el.textContent=t;el.classList.add('show');clearTimeout(toast.t);toast.t=setTimeout(function(){el.classList.remove('show')},2200)}
function setBal(){document.getElementById('bal').textContent=fmt(S.bal);save()}
function newItem(it){return {uid:Date.now().toString(36)+Math.random().toString(36).slice(2,6),key:it.key,name:it.name,type:it.type,rar:it.rar,value:it.value}}

/* ---------- item card ---------- */
function itemCard(it,extra){
  return '<div class="item" style="--rc:'+rc(it.rar)+'">'+icon(it.type,rc(it.rar))+
   '<div class="nm">'+it.name+'</div><div class="ty">'+TYPES[it.type]+'</div>'+
   (extra||'<div class="vl">'+fmt(it.value)+' DW</div>')+'</div>';
}

/* ---------- ticker ---------- */
function fakeFeed(){
  var out=[];for(var i=0;i<14;i++){var it=ALL[Math.floor(Math.random()*ALL.length)];out.push({name:it.name,type:it.type,rar:it.rar,nick:NICKS[Math.floor(Math.random()*NICKS.length)]})}return out;
}
var LIVE=(window.DEWINS_CONFIG&&window.DEWINS_CONFIG.liveUrl)||'';
var FB=window.DEWINS_CONFIG&&window.DEWINS_CONFIG.firebase;
var USEFB=!!(FB&&FB.databaseURL);
if(USEFB)LIVE='firebase';
else if(LIVE==='auto')LIVE=(location.protocol==='https:'?'wss://':'ws://')+location.host;
var NICKS=['Dew_King','Мокрый Гном','Nightfall','Капелька','Vasyl_77','Rain Man','Shadow.X','Тихий омут','Kuzya2000','Neon_Wolf','Росинка','Grom','Deep_Sea','Лунатик','Skyline','Марта','Ivan_Dnipro','Storm','Corvus','Барс'];
var NICK_RE=/^[A-Za-z0-9А-Яа-яІіЇїЄєҐґ_ .-]{4,24}$/;
var feed=LIVE?[]:fakeFeed();
var online=2300+Math.floor(Math.random()*500);
var ws=null,wsOpen=false;
setInterval(function(){
  if(LIVE)return;
  online+=Math.floor(Math.random()*15)-7;
  var el=document.getElementById('online');if(el)el.textContent=online;
},4000);
function esc(t){return String(t).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function okItem(x){return !!x&&typeof x.name==='string'&&x.name.length>0&&x.name.length<=40&&RAR.hasOwnProperty(x.rar)&&TYPES.hasOwnProperty(x.type)}
function cleanItem(x){return {name:x.name,type:x.type,rar:x.rar,nick:(typeof x.nick==='string'&&NICK_RE.test(x.nick))?x.nick:''}}
function pushDrop(it,quiet){var c=cleanItem(it);c.fresh=!quiet;feed.unshift(c);feed=feed.slice(0,24);renderTicker()}
function announce(it){
  var m=cleanItem(it);m.nick=pName();
  if(USEFB){
    if(fbDb&&wsOpen){try{m.ts=firebase.database.ServerValue.TIMESTAMP;fbDb.ref('drops').push(m)}catch(e){}}
    return;
  }
  if(LIVE){if(ws&&wsOpen)ws.send(JSON.stringify({type:'drop',item:m}));return}
  pushDrop(m);
}
function connectLive(){
  try{ws=new WebSocket(LIVE)}catch(e){setTimeout(connectLive,5000);return}
  ws.onopen=function(){wsOpen=true;renderTicker()};
  ws.onclose=function(){wsOpen=false;renderTicker();setTimeout(connectLive,5000)};
  ws.onerror=function(){try{ws.close()}catch(e){}};
  ws.onmessage=function(ev){
    if(typeof ev.data!=='string'||ev.data.length>20000)return;
    var d;try{d=JSON.parse(ev.data)}catch(e){return}
    if(!d)return;
    if(d.type==='online'&&typeof d.n==='number'){online=Math.max(0,Math.floor(d.n));var el=document.getElementById('online');if(el)el.textContent=online}
    else if(d.type==='history'&&Array.isArray(d.items)){feed=d.items.filter(okItem).slice(0,24).map(cleanItem);renderTicker()}
    else if(d.type==='drop'&&okItem(d.item))pushDrop(d.item);
  };
}
var fbDb=null,fbMe=null;
function loadScript(src,cb){var el=document.createElement('script');el.src=src;el.onload=cb;el.onerror=function(){setTimeout(function(){loadScript(src,cb)},5000)};document.head.appendChild(el)}
function connectFirebase(){
  if(window.firebase&&firebase.database){startFirebase();return}
  var base='https://www.gstatic.com/firebasejs/10.12.2/';
  loadScript(base+'firebase-app-compat.js',function(){loadScript(base+'firebase-database-compat.js',startFirebase)});
}
function startFirebase(){
  try{
    if(!firebase.apps||!firebase.apps.length)firebase.initializeApp(FB);
    fbDb=firebase.database();
  }catch(e){toast('Не удалось подключить Firebase');return}
  fbDb.ref('.info/connected').on('value',function(snap){
    var was=wsOpen;wsOpen=snap.val()===true;
    if(wsOpen&&!was){fbMe=fbDb.ref('presence').push();fbMe.onDisconnect().remove();fbMe.set(true)}
    renderTicker();
  });
  fbDb.ref('presence').on('value',function(snap){online=snap.numChildren();var el=document.getElementById('online');if(el)el.textContent=online});
  var q=fbDb.ref('drops').orderByChild('ts').limitToLast(24),ready=false;
  q.on('child_added',function(snap){var d=snap.val();if(okItem(d))pushDrop(d,!ready)});
  q.once('value',function(){ready=true});
}
function simTick(){
  var c=CASES[Math.floor(Math.random()*CASES.length)];
  var w=roll(c);pushDrop({name:w.name,type:w.type,rar:w.rar,nick:NICKS[Math.floor(Math.random()*NICKS.length)]});
  setTimeout(simTick,1800+Math.random()*4200);
}
function renderTicker(){
  var list=feed.slice(0,24);
  var tip=LIVE?(wsOpen?'Онлайн в реальном времени':'Нет связи с сервером, переподключаемся…'):'Демо: данные имитируются';
  document.getElementById('ticker').innerHTML='<div class="online" title="'+tip+'"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M2 9a15 15 0 0 1 20 0M5.5 13a10 10 0 0 1 13 0M9 17a5 5 0 0 1 6 0"/><circle cx="12" cy="20" r="1" fill="currentColor"/></svg><span id="online">'+(LIVE&&!wsOpen?'—':online)+'</span></div>'+list.map(function(it){
    return '<div class="tk'+(it.fresh?' fresh':'')+'" style="--rc:'+rc(it.rar)+'">'+icon(it.type,rc(it.rar))+'<div><strong>'+esc(it.name)+'</strong><span>'+(it.nick?esc(it.nick)+' · ':'')+TYPES[it.type]+'</span></div></div>'
  }).join('');
  feed.forEach(function(x){x.fresh=false});
}

/* ---------- views ---------- */
function heroCols(){
  var cols='';
  for(var c=0;c<3;c++){
    var html='';
    for(var k=0;k<2;k++)for(var i=0;i<7;i++){var it=ALL[(i*5+c*11+ (k?0:0))%ALL.length];html+='<div class="mini" style="--rc:'+rc(it.rar)+'">'+icon(it.type,rc(it.rar))+'</div>'}
    cols+='<div class="hero-col">'+html+'</div>';
  }
  return cols;
}
function vCases(){
  var h='<section class="hero"><div class="hero-strip" aria-hidden="true">'+heroCols()+'</div>'+
   '<h1>Открывай кейсы.<br>Забирай дроп.</h1>'+
   '<p>Шесть кейсов, честная рулетка и шансы каждого предмета на виду. Стартовый баланс — 1 000 DW.</p>'+
   '<div class="cta"><button class="btn" data-open="dew">Открыть кейс</button><button class="btn ghost" data-go="bonus">Забрать бонус</button></div></section>'+
   '';
  h+=GROUPS.map(function(g){
    return '<section class="grp"><h2 class="grp-t"><i></i>'+g.n+'<i></i></h2><div class="grid-cases">'+
    g.ids.map(function(id){var c=caseById(id);
      return '<button class="case" style="--cc:'+c.col+'" data-open="'+c.id+'"><h3>'+c.name+'</h3>'+boxSvg(c.col,c.list[Math.floor(Math.random()*c.list.length)].type)+'<span class="pill">'+fmt(c.price)+' DW</span></button>'}).join('')+'</div></section>';
  }).join('');
  return h;
}
function vOpen(){
  var c=caseById(curCase);
  var h='<button class="back" data-go="cases">← Все кейсы</button>'+
  '<div class="op-head"><h2>'+c.name+'</h2><div style="color:var(--mute)">Цена: <b style="color:var(--text)">'+fmt(c.price)+' DW</b></div></div>'+
  '<div class="reel-box"><div class="pointer"></div><div class="reel" id="reel">'+idleReel(c)+'</div></div>'+
  '<div class="controls"><button class="btn" id="openBtn">'+openLabel(c)+'</button>'+
  '<label class="chk"><input type="checkbox" id="fast"'+(fast?' checked':'')+'> Быстро, без анимации</label></div>'+
  '<div class="result" id="result"></div>'+
  '<h2>Что внутри</h2><div class="grid-items" style="margin-bottom:40px">'+
  c.list.slice().sort(function(a,b){return b.value-a.value}).map(function(it){return itemCard(it,'<div class="vl">'+fmt(it.value)+' DW</div><div class="ch">шанс '+it.chance.toFixed(it.chance<10?1:0).replace('.',',')+'%</div>')}).join('')+'</div>';
  return h;
}
function idleReel(c){
  var h='';for(var i=0;i<14;i++)h+=itemCard(c.list[(i*3)%c.list.length]);return h;
}
function vInv(){
  var total=S.inv.reduce(function(a,i){return a+i.value},0);
  var h='<h2>Инвентарь</h2><p class="sub">'+(S.inv.length?('Предметов: '+S.inv.length+' · на сумму '+fmt(total)+' DW'):'')+'</p>';
  if(!S.inv.length)return h+'<div class="empty">Пока пусто. Открой кейс — выпавшие предметы окажутся здесь.<br><br><button class="btn" data-go="cases">К кейсам</button></div>';
  h+='<div class="controls"><button class="btn amber" id="sellAll">Продать всё за '+fmt(total)+' DW</button></div><div class="grid-items" style="margin-bottom:40px">'+
   S.inv.map(function(it){return '<div>'+itemCard(it)+'<button class="btn ghost" style="width:100%;margin-top:6px;padding:8px" data-sell="'+it.uid+'">Продать</button></div>'}).join('')+'</div>';
  return h;
}
var upTgt=null,upAdd=0,upFast=false,ufl={iq:'',is:'asc',tq:'',ts:'asc',tmin:'',tmax:''};
function $id(x){return document.getElementById(x)}
function selItem(){return S.inv.filter(function(i){return i.uid===upSel})[0]||null}
function tgtItem(){return upTgt?(ALL.filter(function(a){return a.key===upTgt})[0]||null):null}
function stake(){var it=selItem();return (it?it.value:0)+upAdd}
function byMult(){
  var st=stake();if(st<=0||!upMult)return;
  var want=st*upMult,best=null,bd=1e18;
  ALL.forEach(function(x){if(x.value>st){var d=Math.abs(x.value-want);if(d<bd){bd=d;best=x}}});
  upTgt=best?best.key:null;
}
function upChance(st,tg){if(!tg||st<=0||tg.value<=st)return 0;return Math.min(.9,st/tg.value*.95)}
function slotHtml(it,txt){
  if(!it)return '<div class="slot-empty">'+boxSvg('#ffcf4d')+'<span>'+txt+'</span></div>';
  return itemCard(it);
}
function filt(k){
  var f='<div class="filters"><input type="search" id="'+k+'q" placeholder="Поиск по названию" value="'+ufl[k+'q']+'">'+
   '<select id="'+k+'s" aria-label="Сортировка"><option value="asc"'+(ufl[k+'s']==='asc'?' selected':'')+'>От слабых к крутым</option><option value="desc"'+(ufl[k+'s']==='desc'?' selected':'')+'>От крутых к слабым</option></select>';
  if(k==='t')f+='<input type="number" id="tmin" min="0" placeholder="от" value="'+ufl.tmin+'"><input type="number" id="tmax" min="0" placeholder="до" value="'+ufl.tmax+'">';
  return f+'</div>';
}
function vUpgrade(){
  return '<div class="up-title"><h2>Апгрейд</h2><p class="sub">Поставь предмет, DW или всё вместе и выбери цель подороже. Проиграешь — ставка сгорит.</p></div>'+
  '<div class="up-result" id="upResult"></div>'+
  '<div class="up2">'+
   '<div class="up-side"><h3>Выбери предмет</h3><p>Предмет, который хочешь апгрейдить</p><div class="slot" id="slotA"></div>'+
    '<div class="amt"><button data-amt="-" aria-label="Меньше DW">−</button><span id="amtV">0 DW</span><input type="range" id="amt" min="0" max="'+Math.floor(S.bal)+'" step="1" value="'+upAdd+'" aria-label="Добавить DW"><button data-amt="+" aria-label="Больше DW">+</button></div></div>'+
   '<div class="up-mid" id="upMid"></div>'+
   '<div class="up-side"><h3>Выбери цель</h3><p>Предмет, который хочешь получить</p><div class="slot" id="slotB"></div><div class="mults" id="mults"></div></div>'+
  '</div>'+
  '<div class="up-lists">'+
   '<section class="lst"><h3>Мой инвентарь</h3>'+filt('i')+'<div class="grid-items sm" id="invList"></div></section>'+
   '<section class="lst"><h3>Предметы для апгрейда</h3>'+filt('t')+'<div class="grid-items sm" id="tgList"></div></section>'+
  '</div>';
}
function upRefresh(){
  if(!$id('slotA'))return;
  if(upAdd>Math.floor(S.bal))upAdd=Math.floor(S.bal);
  byMult();
  var it=selItem(),tg=tgtItem(),st=stake();
  $id('slotA').innerHTML=slotHtml(it,'Выбери предмет из инвентаря')+(upAdd>0?'<div class="plus">+ '+fmt(upAdd)+' DW</div>':'');
  $id('slotB').innerHTML=slotHtml(tg,'Выбери цель в списке ниже');
  $id('amtV').textContent=fmt(upAdd)+' DW';
  $id('amt').value=upAdd;
  $id('mults').innerHTML=[1.5,2,5,10].map(function(m){return '<button data-m="'+m+'" class="'+(m===upMult?'on':'')+'">x'+String(m).replace('.',',')+'</button>'}).join('');
  var ch=upChance(st,tg);
  $id('upMid').innerHTML='<div class="ring" id="ring" style="--deg:'+(ch*360)+'deg"><div class="needle" id="needle"></div><div class="rc"><small>Шанс апгрейда</small><span class="pct">'+(ch*100).toFixed(2).replace('.',',')+'<em>%</em></span><span class="xx">x'+(tg&&st>0?(tg.value/st).toFixed(2).replace('.',','):'0,00')+'</span></div></div>'+
   '<label class="chk"><input type="checkbox" id="ufast"'+(upFast?' checked':'')+'> Быстрая игра</label>'+
   '<button class="btn" id="upGo"'+(ch>0?'':' disabled')+'>Апгрейдить</button>'+
   (tg&&st>0&&tg.value<=st?'<div class="warn">Цель должна стоить больше ставки</div>':'');
  upLists();
}
var RO={c:0,u:1,r:2,e:3,l:4};
function cmp(a,b,dir){var d=(a.value-b.value)||(RO[a.rar]-RO[b.rar])||a.name.localeCompare(b.name);return dir==='desc'?-d:d}
function upLists(){
  var q=ufl.iq.toLowerCase();
  var inv=S.inv.filter(function(i){return i.name.toLowerCase().indexOf(q)>-1}).sort(function(a,b){return cmp(a,b,ufl.is)});
  $id('invList').innerHTML=inv.length?inv.map(function(i){return '<div class="inv-item'+(i.uid===upSel?' sel':'')+'" data-pick="'+i.uid+'">'+itemCard(i)+'</div>'}).join(''):'<div class="empty">'+(S.inv.length?'Ничего не найдено':'Инвентарь пуст. Открой кейс или поставь DW слайдером.')+'</div>';
  var tq=ufl.tq.toLowerCase(),mn=parseFloat(ufl.tmin),mx=parseFloat(ufl.tmax);
  var tl=ALL.filter(function(a){return a.name.toLowerCase().indexOf(tq)>-1&&(isNaN(mn)||a.value>=mn)&&(isNaN(mx)||a.value<=mx)}).sort(function(a,b){return cmp(a,b,ufl.ts)});
  $id('tgList').innerHTML=tl.length?tl.map(function(a){return '<div class="inv-item'+(a.key===upTgt?' sel':'')+'" data-tgt="'+a.key+'">'+itemCard(a)+'</div>'}).join(''):'<div class="empty">Ничего не найдено</div>';
}
function doUpgrade(){
  if(busy)return;
  var it=selItem(),tg=tgtItem(),st=stake();
  var ch=upChance(st,tg);
  if(ch<=0){toast('Выбери ставку и цель дороже неё');return}
  var r=Math.random(),ok=r<ch;
  busy=true;
  S.bal-=upAdd;
  if(it)S.inv=S.inv.filter(function(i){return i.uid!==it.uid});
  setBal();
  $id('upGo').disabled=true;
  var end=function(){
    hist(ok?('Апгрейд удался: '+tg.name):('Апгрейд не удался, ставка '+fmt(st)+' DW'),0);
    if(ok){var ni=newItem(tg);S.inv.unshift(ni);announce(tg)}
    showUpgradeResult(ok,tg,st);
  };
  if(upFast){setTimeout(end,250);return}
  var n=$id('needle');
  void n.offsetWidth;
  n.style.transition='transform 4s cubic-bezier(.1,.7,.1,1)';
  n.style.transform='rotate('+(360*5+r*360)+'deg)';
  setTimeout(end,4300);
}
function confettiDots(n,col){
  var out='';
  for(var i=0;i<n;i++){
    var l=Math.round(Math.random()*100);
    var d=(Math.random()*.4).toFixed(2);
    var c=[col,'#ffc35a','#ff5fb0','#5ce1d0'][i%4];
    out+='<i style="left:'+l+'%;background:'+c+';animation-delay:'+d+'s"></i>';
  }
  return out;
}
function showReveal(elId,ok,item,title,descHtml){
  var el=$id(elId);
  if(!el)return;
  el.className='up-result show '+(ok?'win':'lose');
  if(ok){
    el.innerHTML='<div class="confetti">'+confettiDots(20,rc(item.rar))+'</div>'+itemCard(item)+'<div><h3>'+title+'</h3><p>'+descHtml+'</p></div>';
  }else{
    el.innerHTML='<div class="lose-icon">✕</div><div><h3>'+title+'</h3><p>'+descHtml+'</p></div>';
  }
}
function showUpgradeResult(ok,tg,st){
  if(ok){
    showReveal('upResult',true,tg,'Апгрейд удался!','Получен предмет: <b>'+tg.name+'</b> · '+fmt(tg.value)+' DW');
    toast('Успех! Получен предмет: '+tg.name);
  }else{
    showReveal('upResult',false,null,'Не повезло','Ставка '+fmt(st)+' DW потеряна');
    toast('Не вышло. Ставка потеряна');
  }
  setTimeout(finishUpgrade,1900);
}
function finishUpgrade(){
  busy=false;upSel=null;upTgt=null;upAdd=0;upMult=2;
  render();
}
/* ---------- контракт: обменять несколько предметов одной редкости на один более крутой ---------- */
var CT_TIERS=['c','u','e','l'];
function nextTier(t){var i=CT_TIERS.indexOf(t);return i>=0&&i<CT_TIERS.length-1?CT_TIERS[i+1]:null}
function contractTier(){
  if(!contractSel.length)return null;
  var it=S.inv.filter(function(x){return x.uid===contractSel[0]})[0];
  return it?it.rar:null;
}
function ctPick(uid){
  if(busy)return;
  var idx=contractSel.indexOf(uid);
  if(idx>-1){contractSel.splice(idx,1);render();return}
  var it=S.inv.filter(function(x){return x.uid===uid})[0];if(!it)return;
  var tier=contractTier();
  if(tier&&it.rar!==tier){toast('Можно выбрать только предметы одной редкости');return}
  if(contractSel.length>=10){toast('Максимум 10 предметов за раз');return}
  contractSel.push(uid);render();
}
function vContract(){
  var tier=contractTier(),next=tier?nextTier(tier):null;
  var pool=next?ALL.filter(function(x){return x.rar===next}):[];
  var need=3;
  var ok=tier&&contractSel.length>=need&&contractSel.length<=10&&next&&pool.length>0;
  var chips=tier?('<span class="tier-chip" style="--rc:'+rc(tier)+'">'+RAR[tier].n+'</span><span class="ct-arrow">→</span>'+(next?('<span class="tier-chip" style="--rc:'+rc(next)+'">'+RAR[next].n+'</span>'):'<span class="tier-chip">максимум</span>')):'Выбери предметы одной редкости';
  var invHtml=S.inv.length?S.inv.slice().sort(function(a,b){return (RO[a.rar]-RO[b.rar])||(a.value-b.value)}).map(function(it){
    var dis=tier&&it.rar!==tier;
    return '<div class="inv-item'+(contractSel.indexOf(it.uid)>-1?' sel':'')+(dis?' dis':'')+'" data-ctpick="'+it.uid+'">'+itemCard(it)+'</div>';
  }).join(''):'<div class="empty">Инвентарь пуст. Сначала открой кейс.</div>';
  return '<div class="up-title"><h2>Контракт</h2><p class="sub">Сдай от 3 до 10 предметов одной редкости и получи один случайный предмет более высокой редкости.</p></div>'+
   '<div class="up-result" id="ctResult"></div>'+
   '<div class="ct-panel"><div class="ct-info">'+chips+'</div><div class="ct-count">Выбрано: '+contractSel.length+' / 10 (нужно от '+need+')</div>'+
   '<button class="btn" id="ctGo"'+(ok?'':' disabled')+'>Заключить контракт</button></div>'+
   '<div class="grid-items sm" style="max-height:none">'+invHtml+'</div>';
}
function doContract(){
  if(busy)return;
  var tier=contractTier();if(!tier)return;
  var next=nextTier(tier);
  if(!next){toast('У этой редкости нет следующей ступени');return}
  if(contractSel.length<3){toast('Нужно минимум 3 предмета');return}
  var pool=ALL.filter(function(x){return x.rar===next});
  if(!pool.length){toast('Нет предметов такой редкости');return}
  var picked=pool[Math.floor(Math.random()*pool.length)];
  var ids=contractSel.slice();
  S.inv=S.inv.filter(function(i){return ids.indexOf(i.uid)<0});
  var ni=newItem(picked);S.inv.unshift(ni);
  announce(picked);
  hist('Контракт: '+ids.length+' предметов → '+picked.name,0);
  busy=true;contractSel=[];
  showReveal('ctResult',true,picked,'Контракт исполнен!','Получен предмет: <b>'+picked.name+'</b> · '+fmt(picked.value)+' DW');
  setTimeout(function(){busy=false;render();},1900);
}
var PROMO_KEYS=(function(){var o='';for(var y=0;y<3;y++)for(var x=0;x<3;x++)o+='<rect x="'+(52+x*38)+'" y="'+(100+y*22)+'" width="30" height="15" rx="4" fill="#4a3320"/>';return o})();
function vBonus(){
  var left=S.lastBonus+864e5-Date.now();
  var ready=left<=0;
  return '<div class="up-title"><h2>Бонусы</h2><p class="sub">Забирай бесплатные DW на баланс</p></div>'+
  '<section class="promo-card"><div class="pc-text"><h3>Промокод</h3><p>Есть промокод? Введи его здесь. Каждый код работает один раз.</p>'+
  '<div class="promo"><input id="promoIn" placeholder="Промокод" maxlength="20" autocomplete="off"><button class="btn amber" id="promoGo">Применить</button></div></div>'+
  '<svg class="promo-art" viewBox="0 0 220 170" aria-hidden="true"><rect x="12" y="14" width="196" height="146" rx="18" fill="#2b1d12" stroke="#ffc35a" stroke-width="3"/><rect x="28" y="30" width="164" height="54" rx="10" fill="#ffc35a"/><text x="110" y="68" text-anchor="middle" font-family="Unbounded,Arial Black,sans-serif" font-weight="900" font-size="28" fill="#3a2200">PROMO</text>'+PROMO_KEYS+'<circle cx="178" cy="104" r="6" fill="#ff5f5f"/><circle cx="178" cy="124" r="6" fill="#ffcf4d"/></svg></section>'+
  '<div class="bonus-grid">'+
  '<div class="card"><h3>Ежедневный бонус</h3><p>500 DW раз в 24 часа.</p><button class="btn" id="daily"'+(ready?'':' disabled')+'>'+(ready?'Забрать 500 DW':'Через '+hm(left))+'</button></div>'+
  '<div class="card"><h3>Кончились DW?</h3><p>Продай предметы из инвентаря или сбрось баланс до 1 000 DW.</p><button class="btn ghost" id="reset">Сбросить прогресс</button></div></div>';
}
var ptab='acc';
function pName(){return S.steam?S.steam.name:'Гость'}
function avStyle(){var n=pName(),h=0;for(var i=0;i<n.length;i++)h=(h*31+n.charCodeAt(i))%360;return 'background:linear-gradient(135deg,hsl('+h+',65%,58%),hsl('+((h+50)%360)+',65%,32%))'}
function renderAvatar(){var b=document.getElementById('avBtn');if(b)b.innerHTML='<span class="av" style="'+avStyle()+'">'+pName().charAt(0).toUpperCase()+'</span>'+(S.steam?'<i class="dot"></i>':'')}
function parseSteam(v){
  v=(v||'').trim();var m;
  if((m=v.match(/steamcommunity\.com\/id\/([A-Za-z0-9_-]{2,32})/i)))return {id:m[1],name:m[1],url:'https://steamcommunity.com/id/'+m[1]};
  if((m=v.match(/steamcommunity\.com\/profiles\/(7656119\d{10})/i))||(m=v.match(/^(7656119\d{10})$/)))return {id:m[1],name:'Steam '+m[1].slice(-4),url:'https://steamcommunity.com/profiles/'+m[1]};
  if(/^[A-Za-z0-9А-Яа-яІіЇїЄєҐґ_ .-]{4,24}$/.test(v))return {id:v,name:v,url:null};
  return null;
}
function vProfile(){
  var st=S.steam;
  var h='<section class="prof"><div class="prof-head"><span class="av lg" style="'+avStyle()+'">'+pName().charAt(0).toUpperCase()+'</span>'+
   '<div class="prof-name"><b>'+pName()+'</b><span>ID '+S.pid+'</span></div>'+
   '<div class="prof-act">'+(st?(st.url?'<a class="steam-pill on" href="'+st.url+'" target="_blank" rel="noopener">Steam подключён</a>':'<span class="steam-pill on">Аккаунт: '+pName()+'</span>')+'<button class="icon-btn" id="steamOff" title="Отключить Steam" aria-label="Отключить Steam">⎋</button>':'<span class="steam-pill">Steam не подключён</span>')+'</div></div>'+
   '<div class="tabs"><button data-ptab="acc" class="'+(ptab==='acc'?'on':'')+'">Аккаунт</button><button data-ptab="skins" class="'+(ptab==='skins'?'on':'')+'">Скины ('+S.inv.length+')</button></div>';
  if(ptab==='skins'){
    var total=S.inv.reduce(function(a,i){return a+i.value},0);
    h+=S.inv.length?'<div class="controls"><button class="btn amber" id="sellAll">Продать всё за '+fmt(total)+' DW</button></div><div class="grid-items sm" style="max-height:none">'+
      S.inv.map(function(it){return '<div>'+itemCard(it)+'<button class="btn ghost" style="width:100%;margin-top:6px;padding:8px" data-sell="'+it.uid+'">Продать</button></div>'}).join('')+'</div>'
      :'<div class="empty">Скинов пока нет. Открой кейс, и они появятся здесь.</div>';
    return h+'</section>';
  }
  var favId=null,fm=0;Object.keys(S.cnt).forEach(function(k){if(S.cnt[k]>fm){fm=S.cnt[k];favId=k}});
  var fav=favId?caseById(favId):null;
  h+='<div class="pgrid"><div class="wallet"><small>Баланс DeWins</small><div class="big">'+fmt(S.bal)+' <i>DW</i></div><button class="btn" data-go="bonus">Забрать бонус</button></div>'+
   '<div class="pcards"><div class="pc"><small>Любимый кейс</small><b>'+(fav?fav.name:'Пока нет')+'</b>'+(fav?'<span>Открыт '+fm+' раз</span><button class="btn sm" data-open="'+fav.id+'">Открыть</button>':'<button class="btn sm" data-open="dew">Открыть</button>')+'</div>'+
   '<div class="pc"><small>Лучший дроп</small><b>'+(S.best?S.best.name:'Пока нет')+'</b>'+(S.best?'<span style="color:'+rc(S.best.rar)+'">'+RAR[S.best.rar].n+' · '+fmt(S.best.value)+' DW</span>':'<span>Выигрышей ещё не было</span>')+'</div>'+
   '<div class="pc"><small>Кейсов открыто</small><b>'+Object.keys(S.cnt).reduce(function(a,k){return a+S.cnt[k]},0)+'</b><span>всего за всё время</span></div></div>'+
   '<div class="steam-box"><h3>Steam</h3>'+(st?'<p>'+(st.url?'Профиль привязан: <a href="'+st.url+'" target="_blank" rel="noopener">'+st.url.replace('https://','')+'</a>':'Ник: <b>'+pName()+'</b>')+'</p><p class="hint">Ник не проверяется через Steam. Это только метка в демо.</p>':
     '<p>Привяжи свой профиль по ссылке или SteamID64.</p><div class="promo"><input id="steamIn" placeholder="steamcommunity.com/id/ник" autocomplete="off"><button class="btn" id="steamGo">Подключить</button></div><p class="hint">Демо: данные хранятся только в этом браузере, вход через Steam не выполняется.</p>')+'</div>'+
   '<div class="hist"><h3>История операций</h3>'+(S.hist.length?S.hist.slice(0,10).map(function(x){var d=new Date(x.d);return '<div class="hrow"><span>'+x.t+'</span><em class="'+(x.a>0?'pos':x.a<0?'neg':'')+'">'+(x.a?((x.a>0?'+':'')+fmt(x.a)):'')+'</em><time>'+d.toLocaleTimeString('ru-RU',{hour:'2-digit',minute:'2-digit'})+'</time></div>'}).join(''):'<p class="hint">Операций пока не было.</p>')+'</div></div></section>';
  return h;
}
function hm(ms){var m=Math.ceil(ms/6e4);return Math.floor(m/60)+' ч '+(m%60)+' мин'}

/* ---------- render / events ---------- */
function render(){
  document.querySelectorAll('#nav button').forEach(function(b){b.classList.toggle('on',b.dataset.v===(view==='open'?'cases':view))});
  $app.innerHTML=view==='cases'?vCases():view==='open'?vOpen():view==='inv'?vInv():view==='upgrade'?vUpgrade():view==='contract'?vContract():view==='profile'?vProfile():vBonus();
  setBal();renderTicker();
  if(view==='upgrade')upRefresh();
  renderAvatar();
}
function go(v){if(busy)return;view=v;render();window.scrollTo(0,0)}
document.getElementById('nav').addEventListener('click',function(e){var b=e.target.closest('button');if(b)go(b.dataset.v)});
document.getElementById('logo').addEventListener('click',function(){go('cases')});
document.getElementById('avBtn').addEventListener('click',function(){go('profile')});

$app.addEventListener('click',function(e){
  var t=e.target.closest('[data-open],[data-go],[data-sell],[data-ptab],[data-pick],[data-tgt],[data-ctpick],[data-amt],[data-m],#steamGo,#steamOff,#openBtn,#sellAll,#upGo,#ctGo,#daily,#promoGo,#reset,#keep,#sellRes');
  if(!t)return;
  if(t.dataset.open){if(busy)return;curCase=t.dataset.open;view='open';render();window.scrollTo(0,0);return}
  if(t.dataset.go){go(t.dataset.go);return}
  if(t.dataset.sell){sell(t.dataset.sell);return}
  if(t.dataset.ptab){ptab=t.dataset.ptab;render();return}
  if(t.dataset.pick){if(busy)return;upSel=(upSel===t.dataset.pick)?null:t.dataset.pick;upRefresh();return}
  if(t.dataset.tgt){if(busy)return;upTgt=t.dataset.tgt;upMult=null;upRefresh();return}
  if(t.dataset.ctpick){ctPick(t.dataset.ctpick);return}
  if(t.dataset.m){if(busy)return;if(stake()<=0){toast('Сначала выбери предмет или добавь DW');return}upMult=parseFloat(t.dataset.m);upRefresh();return}
  if(t.dataset.amt){if(busy)return;var step=Math.max(1,Math.round(S.bal/20));upAdd=Math.max(0,Math.min(Math.floor(S.bal),upAdd+(t.dataset.amt==='+'?step:-step)));upRefresh();return}
  switch(t.id){
    case 'openBtn':openCase();break;
    case 'steamGo':var sp=parseSteam(document.getElementById('steamIn').value);
      if(!sp){toast('Нужна ссылка вида steamcommunity.com/id/… или SteamID64');break}
      S.steam=sp;hist('Вход: '+sp.name,0);toast('Ник сохранён: '+sp.name);render();break;
    case 'steamOff':S.steam=null;view='cases';render();showGate();break;
    case 'sellAll':var tot=S.inv.reduce(function(a,i){return a+i.value},0);S.bal+=tot;hist('Продажа всего инвентаря',tot);S.inv=[];toast('Продано на '+fmt(tot)+' DW');render();break;
    case 'upGo':doUpgrade();break;
    case 'ctGo':doContract();break;
    case 'daily':S.lastBonus=Date.now();S.bal+=500;hist('Ежедневный бонус',500);toast('+500 DW');render();break;
    case 'promoGo':redeemPromo(document.getElementById('promoIn').value);break;
    case 'reset':if(confirm('Сбросить баланс и инвентарь?')){S={bal:1000,inv:[],lastBonus:0,promo:false,feed:[],steam:S.steam,cnt:{},best:null,hist:[],pid:S.pid,used:S.used,free:{}};toast('Прогресс сброшен');render()}break;
    case 'keep':document.getElementById('result').classList.remove('show');break;
    case 'sellRes':if(lastWin){sell(lastWin.uid,true);document.getElementById('result').classList.remove('show')}break;
  }
});
$app.addEventListener('keydown',function(e){if(e.key==='Enter'&&e.target.id==='promoIn')redeemPromo(e.target.value)});
$app.addEventListener('change',function(e){
  var id=e.target.id;
  if(id==='fast')fast=e.target.checked;
  if(id==='ufast')upFast=e.target.checked;
  if(ufl.hasOwnProperty(id)){ufl[id]=e.target.value;upLists()}
});
$app.addEventListener('input',function(e){
  var id=e.target.id;
  if(busy)return;
  if(id==='amt'){upAdd=parseInt(e.target.value,10)||0;upRefresh();return}
  if(ufl.hasOwnProperty(id)){ufl[id]=e.target.value;upLists()}
});

function sell(id,quiet){
  var i=S.inv.findIndex(function(x){return x.uid===id});if(i<0)return;
  var it=S.inv.splice(i,1)[0];S.bal+=it.value;hist('Продажа: '+it.name,it.value);if(upSel===id)upSel=null;
  toast('Продано: +'+fmt(it.value)+' DW');
  if(quiet){setBal()}else render();
}

/* ---------- open case ---------- */
function roll(c){
  var tot=0;c.list.forEach(function(i){tot+=i.chance});
  var r=Math.random()*tot,acc=0;
  for(var i=0;i<c.list.length;i++){acc+=c.list[i].chance;if(r<acc)return c.list[i]}
  return c.list[0];
}
function openCase(){
  if(busy)return;
  var c=caseById(curCase);
  var free=(S.free[c.id]||0)>0;
  if(!free&&S.bal<c.price){toast('Не хватает DW. Забери бонус.');return}
  if(free)S.free[c.id]--;else S.bal-=c.price;
  setBal();
  var win=roll(c);
  document.getElementById('result').classList.remove('show');
  var reel=document.getElementById('reel'),btn=document.getElementById('openBtn');
  var N=60,WIN=52,html='';
  for(var i=0;i<N;i++){html+=itemCard(i===WIN?win:c.list[Math.floor(Math.random()*c.list.length)])}
  reel.style.transition='none';reel.style.transform='translateX(0)';reel.innerHTML=html;
  var finish=function(){
    var it=newItem(win);S.inv.unshift(it);lastWin=it;S.cnt[c.id]=(S.cnt[c.id]||0)+1;if(!S.best||win.value>S.best.value)S.best={name:win.name,value:win.value,rar:win.rar,type:win.type};hist('Кейс «'+c.name+'»: '+win.name,free?0:-c.price);
    announce(win);
    busy=false;btn.disabled=false;btn.textContent=openLabel(c);setBal();renderTicker();
    var r=document.getElementById('result');
    r.style.setProperty('--rc',rc(win.rar));
    r.innerHTML=(win.rar==='e'||win.rar==='l'?'<div class="confetti">'+confettiDots(20,rc(win.rar))+'</div>':'')+itemCard(win)+'<div><h3>'+win.name+'</h3><p>'+RAR[win.rar].n+' · '+TYPES[win.type]+' · '+fmt(win.value)+' DW</p><div class="acts"><button class="btn amber" id="sellRes">Продать за '+fmt(win.value)+' DW</button><button class="btn ghost" id="keep">Оставить</button></div></div>';
    r.classList.add('show');
  };
  busy=true;btn.disabled=true;
  if(fast){reel.style.transform='translateX(0)';setTimeout(finish,120);return}
  var box=reel.parentElement.clientWidth;
  var itemW=160,jitter=(Math.random()-.5)*100;
  var target=-(WIN*itemW+10+75-box/2+jitter);
  void reel.offsetWidth;
  reel.style.transition='transform 6.2s cubic-bezier(.08,.72,.12,1)';
  reel.style.transform='translateX('+target+'px)';
  var done=false;
  var cb=function(){if(done)return;done=true;reel.removeEventListener('transitionend',cb);finish()};
  reel.addEventListener('transitionend',cb);
  setTimeout(cb,6600);
}

function setInert(v){['header','.ticker','main','footer'].forEach(function(q){var e=document.querySelector(q);if(e){if(v)e.setAttribute('inert','');else e.removeAttribute('inert')}})}
function runLoader(ms,cb){
  var L=$id('loader'),bar=$id('lbar'),tx=$id('ltxt');
  if(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches)ms=500;
  var msgs=['Заводим рулетку…','Раскладываем кейсы…','Ищем твой профиль…','Почти готово…'];
  L.style.display='grid';void L.offsetWidth;L.classList.remove('hide');bar.style.width='0%';
  var t0=performance.now();
  function tick(now){
    var p=Math.min(1,(now-t0)/ms),e=1-Math.pow(1-p,2);
    bar.style.width=(e*100)+'%';
    tx.textContent=msgs[Math.min(msgs.length-1,Math.floor(p*msgs.length))];
    if(p<1)requestAnimationFrame(tick);
    else{L.classList.add('hide');setTimeout(function(){L.style.display='none';if(cb)cb()},380)}
  }
  requestAnimationFrame(tick);
}
function showGate(){setInert(true);$id('gate').style.display='grid';$id('gateErr').textContent='';setTimeout(function(){$id('gateIn').focus()},60)}
function connectGate(){
  var raw=$id('gateIn').value.trim(),sp=parseSteam(raw);
  if(!sp){
    $id('gateErr').textContent=raw.length<4?'Ник должен быть длиннее 3 символов.':raw.length>24?'Ник не должен быть длиннее 24 символов.':'Допустимы буквы, цифры, пробел, точка, дефис и подчёркивание.';
    return}
  S.steam=sp;hist('Вход: '+sp.name,0);save();
  $id('gate').style.display='none';$id('gateIn').value='';
  view='cases';render();
  runLoader(1200,function(){setInert(false);toast('Добро пожаловать, '+sp.name)});
}
$id('gateGo').addEventListener('click',connectGate);
$id('gateIn').addEventListener('keydown',function(e){if(e.key==='Enter')connectGate()});
/* ---------- init ---------- */
setInert(true);
render();
if(USEFB)connectFirebase();else if(LIVE)connectLive();else setTimeout(simTick,2500);
runLoader(2600,function(){if(!S.steam)showGate();else setInert(false)});
})();
