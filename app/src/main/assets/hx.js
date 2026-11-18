(function(){
if(window.__hx)return;window.__hx=1;

/* ---------- utilidades ---------- */
var LS=function(k,v){try{if(v===undefined)return localStorage.getItem(k);localStorage.setItem(k,v);}catch(e){}return null;};
var JS=function(k,d){try{var x=JSON.parse(LS(k));return x==null?d:x;}catch(e){return d;}};
function $(t,c,p){var e=document.createElement(t);if(c)e.className=c;if(p)p.appendChild(e);return e;}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
var vis=function(e){return !!(e&&e.getClientRects().length);};

/* ---------- temas (0 = negro por defecto) ---------- */
var PAL=[
{b:'#000',p:'#0b0b0b',c:'#141414',f:'#fff',a:'#e10600',t:'#fff'},
{b:'#050a1a',p:'#0a1230',c:'#0b2a5c',f:'#e8f6ff',a:'#00c8ff',t:'#000'},
{b:'#140a05',p:'#1f120a',c:'#3a2008',f:'#ffe9d2',a:'#ff9a2e',t:'#000'}];
var theme=parseInt(LS('hx2theme')||'0',10)||0;if(theme<0||theme>=PAL.length)theme=0;

var favs=JS('hx2favs',[]),cfg=JS('hx2cfg',{}),filt='all',qry='';
var G=null,mode='none',modal=false,hold=0,editing=false;

/* ---------- elementos del HUD ---------- */
var IT=[
{id:'chat',n:'Chat',sel:'.chatbox-view',wh:1,d:{on:1,sz:1,op:1,fx:.2,fy:1,w:.45,h:.3}},
{id:'score',n:'Marcador',sel:'.game-state-view',d:{on:1,sz:1,op:1}},
{id:'stats',n:'Ping / FPS',sel:'.stats-view',d:{on:1,sz:1,op:1}},
{id:'stick',n:'Joystick',own:1,bw:120,bh:120,d:{on:1,sz:1,op:.8,fx:.02,fy:.96}},
{id:'kick',n:'Botón patear',own:1,bw:80,bh:80,d:{on:1,sz:1,op:.8,fx:.98,fy:.92}},
{id:'zoom',n:'Zoom',own:1,bw:44,bh:44,d:{on:1,sz:1,op:.8,fx:.01,fy:.3}}];
var byId={};IT.forEach(function(i){byId[i.id]=i;});
function C(it){return(cfg[it.id]=Object.assign({},it.d,cfg[it.id]||{}));}
function save(){LS('hx2cfg',JSON.stringify(cfg));}

/* ---------- documentos / iframe ---------- */
function alldocs(d,r){r.push(d);var f=d.getElementsByTagName('iframe');
for(var i=0;i<f.length;i++){try{if(f[i].contentDocument)alldocs(f[i].contentDocument,r);}catch(e){}}return r;}
function gdoc(){var ds=alldocs(document,[]);
for(var i=0;i<ds.length;i++){if(ds[i].querySelector('.roomlist-view,.game-view,.choose-nickname-view'))return ds[i];}return null;}
function press(root,hook,txt){
var b=hook&&root.querySelector('[data-hook='+hook+']');
if(!b){var l=root.querySelectorAll('button');for(var i=0;i<l.length;i++){
if(l[i].textContent.trim().toLowerCase().indexOf(txt.toLowerCase())>-1){b=l[i];break;}}}
if(b){b.click();return true;}return false;}

function calc(d){
if(!d)return['none',false];
var m='none';
if(vis(d.querySelector('.roomlist-view')))m='lobby';
else if(vis(d.querySelector('.room-view')))m='room';
else if(vis(d.querySelector('canvas')))m='game';
var md=false;
if(m!=='none'){
var l=d.querySelectorAll('.dialog,.createroom-view,.settings-view,.replay-view,.choose-nickname-view,.simple-dialog-view');
for(var i=0;i<l.length;i++){var e=l[i];
if(e.classList.contains('room-view')||e.classList.contains('roomlist-view')||e.querySelector('.room-view,.roomlist-view'))continue;
if(vis(e)){md=true;break;}}}
return[m,md];}

/* hace que el iframe ocupe toda la pantalla y esconde header/anuncios de la página */
function layoutFrame(d){
var f=d&&d.defaultView&&d.defaultView.frameElement;if(!f)return;
var e=f;
while(e&&e!==document.body&&e.parentNode){
var ch=e.parentNode.children;
for(var i=0;i<ch.length;i++){var s=ch[i];
if(s===e||s.tagName==='SCRIPT'||s.tagName==='STYLE'||(s.id&&s.id.indexOf('hx')===0)||(s.classList&&s.classList.contains('hxown')))continue;
if(s.style.display!=='none')s.style.setProperty('display','none','important');}
if(e!==f){e.style.setProperty('margin','0','important');e.style.setProperty('padding','0','important');}
e=e.parentNode;}
var st=f.style,set=function(k,v){st.setProperty(k,v,'important');};
set('position','fixed');set('left','0');set('top','0');set('width','100%');set('height','100%');set('border','0');set('z-index','1');}

/* scroll garantizado en paneles largos (room-view, crear sala, diálogos) */
function fixScroll(el,d){
if(!el)return;
var t=el.getBoundingClientRect().top,h=d.defaultView.innerHeight;
el.style.setProperty('max-height',Math.max(120,h-t-8)+'px','important');
el.style.setProperty('overflow-y','auto','important');
if(!el.__hxs){el.__hxs=1;var y0=0,t0=0,on=false,skip=false;
el.addEventListener('touchstart',function(e){skip=e.target.type==='range';y0=e.touches[0].clientY;t0=el.scrollTop;on=false;},{passive:true});
el.addEventListener('touchmove',function(e){if(skip)return;var dy=y0-e.touches[0].clientY;
if(!on&&Math.abs(dy)<8)return;on=true;
if(el.scrollHeight>el.clientHeight){el.scrollTop=t0+dy;e.preventDefault();}},{passive:false});}}

/* ---------- CSS ---------- */
function themeCss(p){
return 'html,body{background:'+p.b+'!important}'
+'[class*="-view"],.dialog,.top-section{background:'+p.p+'!important;color:'+p.f+'!important}'
+'button{background:'+p.c+'!important;color:'+p.f+'!important;border:1px solid '+p.a+'!important;border-radius:8px!important}'
+'button:active,button.selected{background:'+p.a+'!important;color:'+p.t+'!important}'
+'h1,h2{border-color:'+p.a+'!important}'
+'input,select,textarea{background:'+p.b+'!important;color:'+p.f+'!important;border:1px solid '+p.a+'!important}'
+'a{color:'+p.a+'!important}';}
var BASE='[data-hook=inputbtn],[data-hook=miscbtn]{display:none!important}'
+'.chatbox-view{box-sizing:border-box}.chatbox-view-contents{height:100%!important;box-sizing:border-box}'
+'.room-view,.createroom-view,.dialog{-webkit-overflow-scrolling:touch;touch-action:pan-y}'
+'html:not([data-hx=game]) .chatbox-view{display:none!important}'
+'html[data-hx=game] .top-section,html[data-hx=game] .chatbox-view,html[data-hx=game] .chatbox-view-contents,html[data-hx=game] .stats-view{background:transparent!important}'
+'html[data-hx=game] .game-state-view{background:rgba(0,0,0,.5)!important}';

var U=$('style');U.id='hxu';document.head.appendChild(U);
var UI=
'html,body{background:var(--b)!important;margin:0!important;overflow:hidden!important}'
+'#hxL{position:fixed;left:0;top:0;right:0;bottom:0;z-index:2147483000;display:none;flex-direction:column;background:var(--b);color:var(--f);font:14px/1.2 system-ui,sans-serif;box-sizing:border-box}'
+'#hxL .hd{display:flex;align-items:center;gap:8px;padding:6px 10px}'
+'#hxL .logo{font-size:26px;font-weight:800;border:2px solid var(--a);border-radius:6px;padding:0 10px}'
+'#hxL .un{display:flex;align-items:center;gap:6px;font-size:12px}'
+'#hxL .sp{flex:1}'
+'#hxL input{background:var(--p);color:var(--f);border:1px solid var(--a);border-radius:6px;padding:7px 9px;font-size:14px;min-width:0;box-sizing:border-box}'
+'#hxL button{background:var(--c);color:var(--f);border:1px solid var(--a);border-radius:8px;padding:8px 12px;font-size:14px;font-weight:600}'
+'#hxL button:active,#hxL button.on{background:var(--a);color:var(--t)}'
+'#hxL .bd{flex:1;display:flex;gap:10px;padding:0 10px 10px;min-height:0}'
+'#hxL .main{flex:1;display:flex;flex-direction:column;gap:6px;min-width:0}'
+'#hxL .bar{display:flex;gap:6px}#hxL .bar input{flex:1}'
+'#hxL .list{flex:1;overflow-y:auto;-webkit-overflow-scrolling:touch;border:1px solid var(--a);border-radius:8px;background:var(--p);min-height:0}'
+'#hxL .rw{display:flex;align-items:center;gap:8px;padding:9px 10px;border-bottom:1px solid #ffffff14}'
+'#hxL .rw:active{background:var(--c)}'
+'#hxL .nm{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}'
+'#hxL .mt{opacity:.7;font-size:12px;white-space:nowrap}'
+'#hxL .st{font-size:22px;color:var(--a);padding:0 6px}'
+'#hxL .em{padding:16px;opacity:.6}'
+'#hxL .side{width:130px;display:flex;flex-direction:column;gap:8px}'
+'.hxown{position:fixed;left:0;top:0;transform-origin:0 0;touch-action:none;z-index:2147482000;display:none}'
+'.hxst{width:120px;height:120px;border-radius:50%;background:rgba(255,255,255,.18);border:2px solid rgba(255,255,255,.35);box-sizing:border-box}'
+'.hxkn{position:absolute;left:38px;top:38px;width:44px;height:44px;border-radius:50%;background:rgba(255,255,255,.55)}'
+'.hxkk{width:80px;height:80px;border-radius:50%;background:rgba(255,160,64,.45);border:2px solid rgba(255,160,64,.8);box-sizing:border-box}'
+'.hxzm{width:44px;height:44px;border-radius:8px;background:rgba(0,0,0,.55);color:#fff;font-size:22px;text-align:center;line-height:44px}'
+'.hxe .hxown{pointer-events:none}'
+'.hxpx{position:fixed;z-index:2147483200;border:2px dashed var(--a);background:rgba(255,255,255,.08);color:#fff;font:11px sans-serif;touch-action:none;box-sizing:border-box;overflow:hidden}'
+'#hxED{position:fixed;top:54px;right:8px;z-index:2147482500;display:none;width:36px;height:36px;border-radius:8px;border:1px solid var(--a);background:rgba(0,0,0,.55);color:#fff;font-size:18px;text-align:center;line-height:36px}'
+'#hxP2{position:fixed;right:8px;top:8px;width:250px;max-height:calc(100% - 16px);z-index:2147483400;background:var(--p);color:var(--f);border:1px solid var(--a);border-radius:10px;font:13px system-ui,sans-serif;display:flex;flex-direction:column}'
+'#hxP2 .ph{padding:8px 10px;font-weight:700;display:flex;justify-content:space-between;touch-action:none;border-bottom:1px solid var(--a)}'
+'#hxP2 .pb{overflow-y:auto;-webkit-overflow-scrolling:touch;padding:6px 10px;touch-action:pan-y}'
+'#hxP2 .it{padding:6px 0;border-bottom:1px solid #ffffff14}'
+'#hxP2 .sr{display:flex;align-items:center;gap:6px;margin-top:4px}#hxP2 .sr span{width:62px;font-size:12px}#hxP2 .sr input{flex:1;min-width:0}'
+'#hxP2 .pf{display:flex;gap:6px;padding:8px 0}#hxP2 button{flex:1;background:var(--c);color:var(--f);border:1px solid var(--a);border-radius:8px;padding:7px}'
+'.hxtoast{position:fixed;left:50%;bottom:20px;transform:translateX(-50%);background:#222;color:#fff;padding:8px 14px;border-radius:8px;z-index:2147483600;font:13px sans-serif}';
function applyUI(){var p=PAL[theme];
U.textContent=':root{--b:'+p.b+';--p:'+p.p+';--c:'+p.c+';--f:'+p.f+';--a:'+p.a+';--t:'+p.t+'}'+UI;}
applyUI();
function toast(t){var e=$('div','hxtoast',document.body);e.textContent=t;setTimeout(function(){e.remove();},1800);}

/* ---------- key events hacia el juego ---------- */
function key(k,c,kc,down){if(!G)return;var o=G.body||G.documentElement;
o.dispatchEvent(new KeyboardEvent(down?'keydown':'keyup',{key:k,code:c,keyCode:kc,which:kc,bubbles:true,cancelable:true}));}

/* ---------- controles táctiles (JS puro, sin capas nativas) ---------- */
var NM=['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'],KC=[37,39,38,40];
function mkStick(){
var e=$('div','hxown hxst',document.body),k=$('div','hxkn',e),id=null,dirs=[0,0,0,0];
function end(){id=null;k.style.transform='';for(var i=0;i<4;i++){if(dirs[i]){dirs[i]=0;key(NM[i],NM[i],KC[i],false);}}}
function upd(ev){
var r=e.getBoundingClientRect(),R=r.width/2,sc=r.width/120;
var dx=ev.clientX-(r.left+R),dy=ev.clientY-(r.top+R),dd=Math.hypot(dx,dy);
if(dd>R){dx*=R/dd;dy*=R/dd;}
k.style.transform='translate('+(dx/sc)+'px,'+(dy/sc)+'px)';
var th=R*.3,n=[dx<-th,dx>th,dy<-th,dy>th];
for(var i=0;i<4;i++){if(n[i]!==!!dirs[i]){dirs[i]=n[i]?1:0;key(NM[i],NM[i],KC[i],n[i]);}}}
e.addEventListener('pointerdown',function(ev){if(id!==null)return;id=ev.pointerId;try{e.setPointerCapture(id);}catch(x){}upd(ev);ev.preventDefault();});
e.addEventListener('pointermove',function(ev){if(ev.pointerId===id)upd(ev);});
['pointerup','pointercancel'].forEach(function(t){e.addEventListener(t,function(ev){if(ev.pointerId===id)end();});});
e.__reset=end;return e;}
function mkKick(){
var e=$('div','hxown hxkk',document.body),id=null;
function end(){if(id!==null){id=null;key('x','KeyX',88,false);}}
e.addEventListener('pointerdown',function(ev){if(id!==null)return;id=ev.pointerId;try{e.setPointerCapture(id);}catch(x){}key('x','KeyX',88,true);ev.preventDefault();});
['pointerup','pointercancel'].forEach(function(t){e.addEventListener(t,function(ev){if(ev.pointerId===id)end();});});
e.__reset=end;return e;}
var zoomN=0;
function mkZoom(){
var e=$('div','hxown hxzm',document.body);e.textContent='\uD83D\uDD0D';
e.addEventListener('pointerdown',function(ev){ev.preventDefault();zoomN=zoomN%4+1;var k=String(zoomN),kc=48+zoomN;
key(k,'Digit'+k,kc,true);setTimeout(function(){key(k,'Digit'+k,kc,false);},60);});
return e;}
byId.stick.el=mkStick();byId.kick.el=mkKick();byId.zoom.el=mkZoom();

/* ---------- aplicar config a cada elemento del HUD ---------- */
var CLR=['position','left','top','right','bottom','width','height','transform','transform-origin','opacity','display','margin','z-index'];
function place(it){
var c=C(it),W=innerWidth,H=innerHeight,el=it.own?it.el:(G&&G.querySelector(it.sel));
if(!el)return;
var s=el.style;
if(it.own){
var show=mode==='game'&&!modal&&c.on;
var key2=[show,W,H,JSON.stringify(c)].join();
if(it.k===key2)return;it.k=key2;
if(!show){s.display='none';if(el.__reset)el.__reset();return;}
var sz=c.sz;
s.display='block';s.opacity=c.op;s.transform='scale('+sz+')';
s.left=c.fx*Math.max(0,W-it.bw*sz)+'px';s.top=c.fy*Math.max(0,H-it.bh*sz)+'px';
return;}
if(mode!=='game'){if(it.ap){CLR.forEach(function(p){s.removeProperty(p);});it.ap=0;it.k=null;}return;}
var key3=[mode,W,H,JSON.stringify(c),el.offsetWidth,el.offsetHeight].join();
if(it.k===key3)return;it.k=key3;
function set(k,v){s.setProperty(k,v,'important');}
var bw,bh;
if(it.wh){bw=c.w*W;bh=c.h*H;set('width',bw+'px');set('height',bh+'px');}
else{bw=el.offsetWidth;bh=el.offsetHeight;}
if(c.fx!=null){
set('position','fixed');set('right','auto');set('bottom','auto');set('margin','0');set('z-index','9999');
set('left',c.fx*Math.max(0,W-bw*c.sz)+'px');set('top',c.fy*Math.max(0,H-bh*c.sz)+'px');}
set('transform-origin','0 0');set('transform','scale('+c.sz+')');set('opacity',c.op);
if(!c.on)set('display','none');else s.removeProperty('display');
it.ap=1;}

/* ---------- editor de HUD ---------- */
var panel=null,proxies=[],ed=$('div');ed.id='hxED';ed.textContent='\u270E';document.body.appendChild(ed);
function rectOf(it){var el=it.own?it.el:(G&&G.querySelector(it.sel));return el?el.getBoundingClientRect():null;}
function syncProxies(){proxies.forEach(function(o){var r=rectOf(o.it);if(!r)return;
o.p.style.left=r.left+'px';o.p.style.top=r.top+'px';o.p.style.width=r.width+'px';o.p.style.height=r.height+'px';});}
function buildProxies(){
proxies.forEach(function(o){o.p.remove();});proxies=[];
IT.forEach(function(it){
if(!C(it).on)return;var r=rectOf(it);if(!r)return;
var p=$('div','hxpx',document.body);p.textContent=it.n;
var st=null;
p.addEventListener('pointerdown',function(e){e.preventDefault();try{p.setPointerCapture(e.pointerId);}catch(x){}
var r0=rectOf(it);st={x:e.clientX,y:e.clientY,l:r0.left,t:r0.top,w:r0.width,h:r0.height};});
p.addEventListener('pointermove',function(e){if(!st)return;
var W=innerWidth,H=innerHeight,c=C(it);
var l=Math.min(Math.max(0,st.l+e.clientX-st.x),Math.max(0,W-st.w));
var t=Math.min(Math.max(0,st.t+e.clientY-st.y),Math.max(0,H-st.h));
c.fx=W-st.w>0?l/(W-st.w):0;c.fy=H-st.h>0?t/(H-st.h):0;
place(it);p.style.left=l+'px';p.style.top=t+'px';});
var up=function(){if(st){st=null;save();syncProxies();}};
p.addEventListener('pointerup',up);p.addEventListener('pointercancel',up);
proxies.push({it:it,p:p});});
syncProxies();}
function sl(it,k,lbl,mn,mx,stp){return '<div class=sr><span>'+lbl+'</span><input type=range data-id='+it.id+' data-k='+k+' min='+mn+' max='+mx+' step='+stp+' value='+C(it)[k]+'></div>';}
function buildPanel(){
if(panel)panel.remove();
panel=$('div',null,document.body);panel.id='hxP2';
var h='<div class=ph><span>Editar HUD</span><span data-a=done>\u2715</span></div><div class=pb>';
IT.forEach(function(it){var c=C(it);
h+='<div class=it><label><input type=checkbox data-id='+it.id+' data-k=on '+(c.on?'checked':'')+'> '+it.n+'</label>'
+sl(it,'sz','Tama\u00f1o',.5,2,.05)+sl(it,'op','Opacidad',.2,1,.05)
+(it.wh?sl(it,'w','Ancho',.2,.9,.01)+sl(it,'h','Alto',.1,.7,.01):'')+'</div>';});
h+='<div class=pf><button data-a=reset>Restablecer</button><button data-a=done>Listo</button></div></div>';
panel.innerHTML=h;
panel.addEventListener('input',function(e){var t=e.target,it=byId[t.dataset.id];if(!it)return;
C(it)[t.dataset.k]=t.type==='checkbox'?(t.checked?1:0):+t.value;
place(it);if(t.type==='checkbox')buildProxies();else syncProxies();});
panel.addEventListener('change',save);
panel.addEventListener('click',function(e){var a=e.target.dataset&&e.target.dataset.a;
if(a==='done')closeEdit();
if(a==='reset'){cfg={};save();IT.forEach(function(i){i.k=null;});tick();buildPanel();buildProxies();}});
var hd=panel.querySelector('.ph'),sx,sy,r0,dr=false;
hd.addEventListener('pointerdown',function(e){if(e.target.dataset.a)return;dr=true;hd.setPointerCapture(e.pointerId);r0=panel.getBoundingClientRect();sx=e.clientX;sy=e.clientY;});
hd.addEventListener('pointermove',function(e){if(!dr)return;panel.style.right='auto';
panel.style.left=Math.max(0,r0.left+e.clientX-sx)+'px';panel.style.top=Math.max(0,r0.top+e.clientY-sy)+'px';});
hd.addEventListener('pointerup',function(){dr=false;});}
function openEdit(){editing=true;document.body.classList.add('hxe');buildPanel();buildProxies();}
function closeEdit(){editing=false;document.body.classList.remove('hxe');
if(panel){panel.remove();panel=null;}proxies.forEach(function(o){o.p.remove();});proxies=[];save();}
ed.addEventListener('click',openEdit);

/* ---------- Lobby Haxcucu ---------- */
var L=$('div'),items=[],t0=null,tn=-1,dirty=true;
L.id='hxL';
L.innerHTML='<div class=hd><div class=logo>Haxcucu</div>'
+'<label class=un>username:<input id=hxN placeholder="Tag" size=12 maxlength=25></label><span class=sp></span>'
+'<button id=hxS>\u2699</button><button id=hxT>Tema</button></div>'
+'<div class=bd><div class=main>'
+'<div class=bar><input id=hxQ placeholder="Buscar Hos"><button data-f=all class=on>Todos</button><button data-f=fav>Favoritos</button><button id=hxR>\u27F3</button></div>'
+'<div class=list id=hxList></div>'
+'<input id=hxK placeholder="Link buscar" enterkeyhint=go></div>'
+'<div class=side><button id=hxC>Crear Host</button><button id=hxP>Replay</button><button id=hxCh>Chiches</button><button id=hxX>Cerrar</button></div></div>';
document.body.appendChild(L);
var list=L.querySelector('#hxList'),nick=L.querySelector('#hxN');
function lroot(){return G&&(G.querySelector('.roomlist-view')||G);}
function syncList(){
var rv=G&&G.querySelector('.roomlist-view');if(!rv)return;
var t=[].slice.call(rv.querySelectorAll('tbody tr'));
if(!t.length)t=[].slice.call(rv.querySelectorAll('tr')).filter(function(r){return !r.querySelector('th');});
if(!dirty&&t.length===tn&&t[0]===t0)return;
dirty=false;tn=t.length;t0=t[0];
var q=qry.toLowerCase();items=[];
t.forEach(function(r){var td=r.children;if(td.length<2)return;
var n=td[0].textContent.trim(),f=favs.indexOf(n)>-1;
if(filt==='fav'&&!f)return;if(q&&n.toLowerCase().indexOf(q)<0)return;
items.push({r:r,n:n,p:td[1].textContent.trim(),w:td[2]?td[2].textContent.trim():'',d:td[3]?td[3].textContent.trim():'',f:f});});
items.sort(function(a,b){return (b.f?1:0)-(a.f?1:0);});
var h='';items.slice(0,300).forEach(function(o,i){
h+='<div class=rw data-i='+i+'><span class=st>'+(o.f?'\u2605':'\u2606')+'</span><span class=nm>'+esc(o.n)+'</span><span class=mt>'+esc(o.p)+(o.w==='Yes'?' \uD83D\uDD12':'')+' '+esc(o.d)+'</span></div>';});
list.innerHTML=h||'<div class=em>Sin salas</div>';}
list.addEventListener('click',function(e){
var rw=e.target.closest('.rw');if(!rw||!G)return;var o=items[+rw.dataset.i];if(!o)return;
if(e.target.closest('.st')){var k=favs.indexOf(o.n);if(k<0)favs.push(o.n);else favs.splice(k,1);
LS('hx2favs',JSON.stringify(favs));dirty=true;syncList();return;}
o.r.dispatchEvent(new G.defaultView.MouseEvent('click',{bubbles:true,cancelable:true}));
setTimeout(function(){press(lroot(),'join','Join Room');},80);});
L.querySelector('#hxQ').addEventListener('input',function(e){qry=e.target.value;dirty=true;syncList();});
L.querySelectorAll('[data-f]').forEach(function(b){b.addEventListener('click',function(){
filt=b.dataset.f;L.querySelectorAll('[data-f]').forEach(function(x){x.classList.toggle('on',x===b);});dirty=true;syncList();});});
L.querySelector('#hxR').addEventListener('click',function(){if(G){press(lroot(),'refresh','Refresh');dirty=true;}});
L.querySelector('#hxC').addEventListener('click',function(){if(G)press(lroot(),'create','Create Room');});
L.querySelector('#hxP').addEventListener('click',function(){if(G)press(lroot(),'replayb','Replays');});
L.querySelector('#hxS').addEventListener('click',function(){if(G)press(lroot(),'settings','Settings');});
L.querySelector('#hxCh').addEventListener('click',function(){toast('Chiches: pr\u00f3ximamente');});
L.querySelector('#hxX').addEventListener('click',function(){if(window.HX&&HX.close)HX.close();else window.close();});
L.querySelector('#hxT').addEventListener('click',function(){theme=(theme+1)%PAL.length;LS('hx2theme',String(theme));applyUI();});
var K=L.querySelector('#hxK');
function goLink(){var v=K.value.trim();if(!v)return;if(v.indexOf('haxball.com')<0){toast('Link inv\u00e1lido');return;}
if(!/^https?:/i.test(v))v='https://'+v;location.href=v;}
K.addEventListener('keydown',function(e){if(e.key==='Enter')goLink();});
K.addEventListener('input',function(){if(/haxball\.com\/play\?c=/i.test(K.value))goLink();});
function curNick(){try{return G.defaultView.localStorage.getItem('player_name')||'';}catch(e){return '';}}
function setNick(n){
if(!G)return;LS('hx2nick',n);hold=Date.now()+1500;
press(lroot(),'changenick','Change Nick');
setTimeout(function(){
var ds=[].slice.call(G.querySelectorAll('.dialog,.choose-nickname-view')).filter(vis),dlg=ds[ds.length-1];
var inp=dlg&&dlg.querySelector('input');if(!inp)return;
var W=G.defaultView;
Object.getOwnPropertyDescriptor(W.HTMLInputElement.prototype,'value').set.call(inp,n);
inp.dispatchEvent(new W.Event('input',{bubbles:true}));
setTimeout(function(){var bs=dlg.querySelectorAll('button'),ok=dlg.querySelector('[data-hook=ok]');
for(var i=0;i<bs.length&&!ok;i++){if(/^(ok|accept|change|set|save)/i.test(bs[i].textContent.trim()))ok=bs[i];}
if(ok)ok.click();},80);},300);}
nick.addEventListener('keydown',function(e){if(e.key==='Enter')nick.blur();});
nick.addEventListener('change',function(){var v=nick.value.trim();if(v)setNick(v);});

/* ---------- loop principal (liviano, fuera del render del juego) ---------- */
var CSS_GAME='';
function tick(){
G=gdoc();
var r=calc(G);mode=r[0];modal=r[1];
if(G){
layoutFrame(G);
var s=G.getElementById('hxs');
if(!s){s=G.createElement('style');s.id='hxs';(G.head||G.documentElement).appendChild(s);}
var css=BASE+themeCss(PAL[theme]);
if(s.textContent!==css)s.textContent=css;
if(G.documentElement.getAttribute('data-hx')!==mode)G.documentElement.setAttribute('data-hx',mode);
var b=G.getElementsByTagName('button');
for(var i=0;i<b.length;i++){var t=(b[i].textContent||'').trim();
if((t==='Input'||t==='Misc')&&b[i].style.display!=='none')b[i].style.setProperty('display','none','important');}
if(mode==='room')fixScroll(G.querySelector('.room-view'),G);
var dl=G.querySelectorAll('.createroom-view,.dialog');
for(var j=0;j<dl.length;j++){var e=dl[j];
if(vis(e)&&!e.classList.contains('room-view')&&!e.classList.contains('settings-view')&&!e.querySelector('.room-view,.roomlist-view'))fixScroll(e,G);}}
var showL=mode==='lobby'&&(!modal||Date.now()<hold);
var want=showL?'flex':'none';
if(L.style.display!==want)L.style.display=want;
if(showL){syncList();if(document.activeElement!==nick&&!nick.value)nick.value=curNick()||LS('hx2nick')||'';}
IT.forEach(place);
var eb=(mode==='game'&&!modal&&!editing)?'block':'none';
if(ed.style.display!==eb)ed.style.display=eb;
if(editing&&mode!=='game')closeEdit();}
window.hxTheme=function(){theme=(theme+1)%PAL.length;LS('hx2theme',String(theme));applyUI();return theme;};
setInterval(tick,350);tick();
})();
  
