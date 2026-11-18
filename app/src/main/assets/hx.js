(function(){
if(window.__hx3)return;window.__hx3=1;
var D=document,S={theme:0,fav:{},hud:{},sel:'chat'};
try{var p=JSON.parse(localStorage.getItem('hx3')||'{}');for(var k in p)S[k]=p[k];}catch(e){}
S.edit=false;
function save(){try{localStorage.setItem('hx3',JSON.stringify(S));}catch(e){}}
function docs(d,r){r=r||[];r.push(d);var f=d.getElementsByTagName('iframe');for(var i=0;i<f.length;i++){try{if(f[i].contentDocument)docs(f[i].contentDocument,r);}catch(e){}}return r;}
function q(s){var a=docs(D);for(var i=0;i<a.length;i++){var e=a[i].querySelector(s);if(e)return e;}return null;}
function qa(s){var o=[],a=docs(D);for(var i=0;i<a.length;i++)o=o.concat([].slice.call(a[i].querySelectorAll(s)));return o;}
function btn(t){var b=qa('button');for(var i=0;i<b.length;i++){if((b[i].textContent||'').trim().toLowerCase().indexOf(t)>=0)return b[i];}return null;}
function key(type,k,c,kc){var a=docs(D);for(var i=0;i<a.length;i++){var o=a[i].body||a[i].documentElement;o.dispatchEvent(new KeyboardEvent(type,{key:k,code:c,keyCode:kc,which:kc,bubbles:true,cancelable:true}));}}
function views(){var o=[],a=qa('[class*="-view"]');for(var i=0;i<a.length;i++){var e=a[i];if(!e.parentElement||!e.parentElement.closest('[class*="-view"]'))o.push(e);}return o;}
function mode(){var v=views(),i,lob=v.length>0;
for(i=0;i<v.length;i++)if(!v[i].classList.contains('roomlist-view'))lob=false;
if(lob)return 'lobby';
if(q('.room-view'))return 'room';
var c=qa('canvas');for(i=0;i<c.length;i++)if(c[i].offsetWidth>100&&c[i].offsetHeight>100)return 'game';
return 'other';}

var TH=[
{bg:'#000',pn:'#0a0a0a',bt:'#111',ac:'#fff',tx:'#fff',bd:'#333'},
{bg:'#000',pn:'#0b0b0b',bt:'#141414',ac:'#e10600',tx:'#fff',bd:'#e10600'},
{bg:'#050a1a',pn:'#0a1230',bt:'#0b2a5c',ac:'#00c8ff',tx:'#e8f6ff',bd:'#00c8ff'}];
function fcss(t){return 'html,body{background:'+t.bg+'!important}[class*="-view"],.dialog,.top-section{background:'+t.pn+'!important;color:'+t.tx+'!important}button{background:'+t.bt+'!important;color:'+t.tx+'!important;border:1px solid '+t.bd+'!important;border-radius:8px!important}button:active{background:'+t.ac+'!important;color:#000!important}h1,h2{border-color:'+t.ac+'!important}input,select,textarea{background:'+t.bg+'!important;color:'+t.tx+'!important;border:1px solid '+t.bd+'!important}a{color:'+t.ac+'!important}[data-hook=inputbtn],[data-hook=miscbtn]{display:none!important}.chatbox-view-contents{height:100%!important}';}

var CSS='#hxl{position:fixed;left:0;top:0;right:0;bottom:0;z-index:5000;display:none;flex-direction:column;padding:2vh 3vh;background:var(--bg);color:var(--tx);font:3.6vh sans-serif}'
+'#hxl *{box-sizing:border-box}'
+'#hxl button,#hxl input,#hxe button,#hxb button{background:var(--bt);color:var(--tx);border:1px solid var(--bd);border-radius:1vh;font:inherit}'
+'#hxl button,#hxl input{height:7vh;padding:0 1.5vh}'
+'#hxl button.on{background:var(--ac);color:#000}'
+'#hxl .hh{display:flex;align-items:center;gap:2vh;height:9vh}'
+'#hxl .lg{font-size:6.5vh;letter-spacing:.3vh}#hxl .sp{flex:1}'
+'#hxl .hr{display:flex;gap:1.5vh;margin:1.5vh 0}#hxl #lq{flex:1}'
+'#hxl .hb{flex:1;display:flex;gap:2vh;min-height:0}'
+'#hxl .lw{flex:1;display:flex;flex-direction:column;min-width:0;gap:1vh}'
+'#ll{flex:1;overflow-y:auto;border:1px solid var(--bd);border-radius:1vh;background:var(--pn);-webkit-overflow-scrolling:touch}'
+'#ll .rw{display:flex;align-items:center;gap:1.5vh;height:8vh;padding:0 1.5vh;border-bottom:1px solid var(--bd)}'
+'#ll .st{font-size:5vh;width:5vh;color:var(--ac)}'
+'#ll .nm{flex:1;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}'
+'#ll .pl{opacity:.7;font-size:3vh}'
+'#hxl .sd{width:24vh;display:flex;flex-direction:column;gap:1.5vh}#hxl .sd button{height:9vh}'
+'#hxb{position:fixed;left:2vh;top:1vh;z-index:6500;display:flex;gap:1vh}'
+'#hxb button{width:9vh;height:9vh;font-size:5vh;background:rgba(0,0,0,.6)}'
+'#hxj{position:fixed;left:4vh;bottom:4vh;width:42vh;height:42vh;border-radius:50%;background:rgba(255,255,255,.18);touch-action:none;z-index:6000;display:none;transform-origin:0 0}'
+'#hxj i{position:absolute;left:14vh;top:14vh;width:14vh;height:14vh;border-radius:50%;background:rgba(255,255,255,.5)}'
+'#hxk{position:fixed;right:5vh;bottom:5vh;width:25vh;height:25vh;border-radius:50%;background:rgba(255,160,64,.35);touch-action:none;z-index:6000;display:none;transform-origin:0 0}'
+'#hxk.d{background:rgba(255,160,64,.7)}'
+'.gh{position:fixed;z-index:6800;border:2px dashed #ff0;background:rgba(255,255,0,.12);color:#ff0;font:3vh sans-serif;touch-action:none;min-width:8vh;min-height:5vh}'
+'#hxe{position:fixed;right:2vh;top:12vh;width:46vh;max-height:80vh;overflow-y:auto;z-index:7000;display:none;background:rgba(0,0,0,.92);border:1px solid var(--bd);border-radius:1.5vh;padding:1.5vh;color:#fff;font:3vh sans-serif}'
+'#hxe .tb{display:flex;flex-wrap:wrap;gap:.8vh;margin-bottom:1vh}#hxe button{padding:.8vh 1.2vh;font-size:3vh}#hxe button.on{background:var(--ac);color:#000}'
+'#hxe label{display:block;margin:.8vh 0}#hxe input[type=range]{width:100%}#hxe input[type=checkbox]{width:3.5vh;height:3.5vh;vertical-align:middle}'
+'#hxt{position:fixed;left:50%;bottom:10vh;transform:translateX(-50%);background:rgba(0,0,0,.85);color:#fff;padding:1.5vh 3vh;border-radius:1vh;z-index:9000;font:3.4vh sans-serif;display:none}';

var st=D.createElement('style');st.textContent=CSS;D.head.appendChild(st);
var tst=D.createElement('style');D.head.appendChild(tst);
function el(t,id,h){var e=D.createElement(t);if(id)e.id=id;if(h)e.innerHTML=h;D.body.appendChild(e);return e;}
function $(i){return D.getElementById(i);}

var L=el('div','hxl','<div class=hh><b class=lg>Haxcucu</b><span>username:</span><input id=ln placeholder=Tag size=10><i class=sp></i><button id=lo title=Original>\u2750</button><button id=ls>\u2699</button><button id=lt>\uD83C\uDFA8</button></div>'
+'<div class=hr><input id=lq placeholder="Buscar host"><button id=f0 class=on>Todos</button><button id=f1>Favoritos</button><button id=lf>\u21BB</button></div>'
+'<div class=hb><div class=lw><div id=ll></div><input id=lk placeholder="Link buscar"></div><div class=sd><button id=lc>Crear host</button><button id=lp>Replay</button><button id=lz>Chiches</button><button id=lx>Cerrar</button></div></div>');
var B=el('div','hxb','<button id=hxz>\uD83D\uDD0D</button><button id=hxc>\uD83D\uDCAC</button><button id=hxd>\u270E</button>');
var J=el('div','hxj','<i></i>'),K=el('div','hxk');
var T=el('div','hxt');
var P=el('div','hxe','<div class=tb id=etb></div><label><input type=checkbox id=eo> Mostrar</label><label>Tama\u00F1o<input type=range id=es min=50 max=200></label><label>Opacidad<input type=range id=ea min=20 max=100></label><label id=elw>Largo<input type=range id=el min=60 max=400></label><div class=tb><button id=er>Restablecer</button><button id=ex class=on>Listo</button></div>');

function toast(s){T.textContent=s;T.style.display='block';setTimeout(function(){T.style.display='none';},1800);}

var HUD={chat:{n:'Chat',sel:'.chatbox-view'},score:{n:'Marcador',sel:'.game-state-view'},stats:{n:'Ping/FPS',sel:'.stats-view'},joy:{n:'Joystick'},kick:{n:'Bot\u00F3n'}};
function H(k){return S.hud[k]||(S.hud[k]={on:true,s:1,o:1});}
function applyFr(k){var e=q(HUD[k].sel);if(!e)return;var h=H(k),s=e.style;
function f(a,b){s.setProperty(a,b,'important');}
if(!h.on&&!S.edit)f('display','none');else s.removeProperty('display');
f('transform-origin','top left');f('transform','scale('+h.s+')');f('opacity',(!h.on&&S.edit)?.3:h.o);
if(h.x!=null){f('position','fixed');f('left',h.x+'px');f('top',h.y+'px');f('right','auto');f('bottom','auto');f('margin','0');f('z-index','9000');}
if(h.l)f('height',h.l+'px');}
function applyOwn(k,e,m){var h=H(k);e.style.display=(m==='game'&&(h.on||S.edit))?'block':'none';
e.style.opacity=h.on?h.o:.3;e.style.transform='scale('+h.s+')';
if(h.x!=null){e.style.left=h.x+'px';e.style.top=h.y+'px';e.style.right='auto';e.style.bottom='auto';}}

var dirs=[false,false,false,false],NM=['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'],KC=[37,39,38,40];
function jset(n){for(var i=0;i<4;i++){if(n[i]!==dirs[i]){dirs[i]=n[i];key(n[i]?'keydown':'keyup',NM[i],NM[i],KC[i]);}}}
function jm(e){var r=J.getBoundingClientRect(),R=r.width/2,dx=e.clientX-(r.left+R),dy=e.clientY-(r.top+R),d=Math.hypot(dx,dy);
if(d>R){dx*=R/d;dy*=R/d;}var s=H('joy').s;J.firstChild.style.transform='translate('+(dx/s)+'px,'+(dy/s)+'px)';var t=R*.3;jset([dx<-t,dx>t,dy<-t,dy>t]);}
function jend(){J.__a=0;J.firstChild.style.transform='';jset([false,false,false,false]);}
J.addEventListener('pointerdown',function(e){if(S.edit)return;J.setPointerCapture(e.pointerId);J.__a=1;jm(e);});
J.addEventListener('pointermove',function(e){if(J.__a&&!S.edit)jm(e);});
J.addEventListener('pointerup',jend);J.addEventListener('pointercancel',jend);
function kend(){if(K.className==='d'){K.className='';key('keyup','x','KeyX',88);}}
K.addEventListener('pointerdown',function(e){if(S.edit)return;K.setPointerCapture(e.pointerId);K.className='d';key('keydown','x','KeyX',88);});
K.addEventListener('pointerup',kend);K.addEventListener('pointercancel',kend);

function drag(n,k,own){var p0,x0,y0;
n.addEventListener('pointerdown',function(e){if(!S.edit)return;e.preventDefault();n.setPointerCapture(e.pointerId);p0=[e.clientX,e.clientY];var r=n.getBoundingClientRect();x0=r.left;y0=r.top;n.__d=1;});
n.addEventListener('pointermove',function(e){if(!n.__d)return;var h=H(k),nx=x0+e.clientX-p0[0],ny=y0+e.clientY-p0[1];
if(own){h.x=Math.round(nx);h.y=Math.round(ny);applyOwn(k,n,'game');}
else{n.style.left=nx+'px';n.style.top=ny+'px';var o=n.__off||[0,0];h.x=Math.round(nx-o[0]);h.y=Math.round(ny-o[1]);applyFr(k);}});
var end=function(){if(n.__d){n.__d=0;save();}};n.addEventListener('pointerup',end);n.addEventListener('pointercancel',end);}
drag(J,'joy',true);drag(K,'kick',true);
var G={};['chat','score','stats'].forEach(function(k){var g=el('div',null,HUD[k].n);g.className='gh';g.style.display='none';G[k]=g;drag(g,k,false);});

function sync(){var h=H(S.sel);$('eo').checked=h.on;$('es').value=Math.round(h.s*100);$('ea').value=Math.round(h.o*100);$('el').value=h.l||150;
$('elw').style.display=S.sel==='chat'?'block':'none';
var t=$('etb');t.textContent='';
Object.keys(HUD).forEach(function(k){var b=D.createElement('button');b.textContent=HUD[k].n;b.className=(k===S.sel)?'on':'';b.onclick=function(){S.sel=k;sync();};t.appendChild(b);});}
function applyAll(){var m=mode();['chat','score','stats'].forEach(applyFr);applyOwn('joy',J,m);applyOwn('kick',K,m);}
$('eo').onchange=function(){H(S.sel).on=this.checked;save();applyAll();};
$('es').oninput=function(){H(S.sel).s=this.value/100;save();applyAll();};
$('ea').oninput=function(){H(S.sel).o=this.value/100;save();applyAll();};
$('el').oninput=function(){H(S.sel).l=+this.value;save();applyAll();};
$('er').onclick=function(){delete S.hud[S.sel];var c=HUD[S.sel];if(c.sel){var e=q(c.sel);if(e)e.removeAttribute('style');}else{var o=S.sel==='joy'?J:K;o.removeAttribute('style');}save();sync();applyAll();};
$('ex').onclick=function(){S.edit=false;P.style.display='none';save();applyAll();};
$('hxd').onclick=function(){S.edit=true;P.style.display='block';sync();applyAll();};
var zz=0;$('hxz').onclick=function(){zz=zz%4+1;var k=''+zz;key('keydown',k,'Digit'+k,48+zz);setTimeout(function(){key('keyup',k,'Digit'+k,48+zz);},60);};
$('hxc').onclick=function(){var h=H('chat');h.on=!h.on;save();applyFr('chat');};

var flt=0,sig='',raw=0;
function rows(){return qa('.roomlist-view tbody tr');}
function renderList(){var rs=rows(),w=($('lq').value||'').toLowerCase(),a=[];
for(var i=0;i<rs.length;i++){var t=rs[i].children;if(t.length<4)continue;var n=(t[0].textContent||'').trim();
if(w&&n.toLowerCase().indexOf(w)<0)continue;var fv=!!S.fav[n];if(flt&&!fv)continue;
a.push({i:i,n:n,p:(t[1].textContent||'').trim(),k:(t[2].textContent||'').trim(),d:(t[3].textContent||'').trim(),f:fv});}
var s=JSON.stringify(a);if(s===sig)return;sig=s;
var box=$('ll'),sc=box.scrollTop;box.textContent='';
a.forEach(function(r){var d=D.createElement('div');d.className='rw';d.dataset.i=r.i;d.dataset.n=r.n;
function sp(c,x){var e=D.createElement('span');e.className=c;e.textContent=x;d.appendChild(e);}
var b=D.createElement('b');b.className='st';b.textContent=r.f?'\u2605':'\u2606';d.appendChild(b);
sp('nm',r.n);sp('pl',r.p);sp('pl',r.k.toLowerCase()==='yes'?'\uD83D\uDD12':'');sp('pl',r.d);box.appendChild(d);});
box.scrollTop=sc;}
$('ll').addEventListener('click',function(e){var r=e.target.closest('.rw');if(!r)return;
if(e.target.classList.contains('st')){var n=r.dataset.n;if(S.fav[n])delete S.fav[n];else S.fav[n]=1;save();sig='';renderList();return;}
var tr=rows()[+r.dataset.i];if(tr){tr.click();setTimeout(function(){var j=btn('join room');if(j)j.click();},120);}});
$('lq').oninput=function(){sig='';renderList();};
function setF(v){flt=v;$('f0').className=v?'':'on';$('f1').className=v?'on':'';sig='';renderList();}
$('f0').onclick=function(){setF(0);};$('f1').onclick=function(){setF(1);};
$('lf').onclick=function(){var b=btn('refresh');if(b)b.click();};
$('lc').onclick=function(){var b=btn('create room');if(b)b.click();};
$('lp').onclick=function(){var b=btn('replays');if(b)b.click();};
$('ls').onclick=function(){var b=btn('settings');if(b)b.click();};
$('lz').onclick=function(){toast('Chiches: pr\u00F3ximamente');};
$('lx').onclick=function(){if(window.HxApp)HxApp.close();};
$('lo').onclick=function(){raw=1;};
$('lt').onclick=function(){S.theme=(S.theme+1)%TH.length;save();themeApply();tick();};
$('lk').onkeydown=function(e){if(e.key!=='Enter')return;var v=this.value.trim();if(!v)return;
location.href=/^https?:/.test(v)?v:'https://www.haxball.com/play?c='+encodeURIComponent(v);};
function nickInit(){var n=$('ln');if(D.activeElement===n)return;var v='';try{v=localStorage.getItem('player_name')||'';}catch(e){}if(n.value!==v)n.value=v;}
function nickSet(){var v=$('ln').value.trim();if(!v)return;try{localStorage.setItem('player_name',v);}catch(e){}
var b=btn('change nick');if(!b)return;b.click();
setTimeout(function(){var i=q('[class*="-view"] input[type=text],[class*="-view"] input:not([type])');
if(i){i.value=v;i.dispatchEvent(new Event('input',{bubbles:true}));var o=btn('ok');if(o)o.click();}},300);}
$('ln').onkeydown=function(e){if(e.key==='Enter'){this.blur();}};
$('ln').onchange=nickSet;

function mkScroll(el){if(el.__hs)return;el.__hs=1;var y0,sy,v=0,t0,raf;
el.addEventListener('touchstart',function(e){cancelAnimationFrame(raf);y0=e.touches[0].clientY;sy=el.scrollTop;t0=Date.now();v=0;},{passive:true});
el.addEventListener('touchmove',function(e){var ns=sy+(y0-e.touches[0].clientY),d=ns-el.scrollTop,n=Date.now();el.scrollTop=ns;v=d/Math.max(1,n-t0);t0=n;if(el.scrollHeight>el.clientHeight)e.preventDefault();},{passive:false});
el.addEventListener('touchend',function(){var f=function(){if(Math.abs(v)<.02)return;el.scrollTop+=v*16;v*=.94;raf=requestAnimationFrame(f);};f();});}
function roomScroll(){var rv=q('.room-view');if(!rv)return;var e=rv;
for(var i=0;i<5&&e;i++){if(e.scrollHeight>e.clientHeight+4&&e!==D.body&&e.tagName!=='HTML'){e.style.setProperty('overflow-y','auto','important');mkScroll(e);return;}e=e.parentElement;}}

var curT=-1;
function themeApply(){if(curT===S.theme)return;curT=S.theme;var t=TH[S.theme];
tst.textContent=':root{--bg:'+t.bg+';--pn:'+t.pn+';--bt:'+t.bt+';--ac:'+t.ac+';--tx:'+t.tx+';--bd:'+t.bd+'}';}
function frameCss(){var a=docs(D),c=fcss(TH[S.theme]);
for(var i=1;i<a.length;i++){var d=a[i],s=d.getElementById('hxs');
if(!s){s=d.createElement('style');s.id='hxs';(d.head||d.documentElement).appendChild(s);}
if(s.textContent!==c)s.textContent=c;}}

function tick(){var m=mode();themeApply();frameCss();
if(m!=='lobby')raw=0;
L.style.display=(m==='lobby'&&!raw)?'flex':'none';
if(m==='lobby'&&!raw){nickInit();renderList();}
var g=m==='game',r=m==='room';
$('hxz').style.display=g?'':'none';$('hxc').style.display=(g||r)?'':'none';$('hxd').style.display=g?'':'none';
B.style.display=(g||r)?'flex':'none';
applyOwn('joy',J,m);applyOwn('kick',K,m);
if(g||r)['chat','score','stats'].forEach(applyFr);
if(r)roomScroll();
if(!g&&S.edit){S.edit=false;P.style.display='none';}
['chat','score','stats'].forEach(function(k){var gh=G[k];
if(!S.edit||!g){gh.style.display='none';return;}
var e=q(HUD[k].sel);if(!e){gh.style.display='none';return;}
if(gh.__d)return;
var rc=e.getBoundingClientRect(),fr=e.ownerDocument.defaultView.frameElement,fo=fr?fr.getBoundingClientRect():{left:0,top:0};
gh.__off=[fo.left,fo.top];gh.style.display='block';
gh.style.left=(fo.left+rc.left)+'px';gh.style.top=(fo.top+rc.top)+'px';gh.style.width=rc.width+'px';gh.style.height=rc.height+'px';});}
setInterval(tick,400);tick();
})();;e.textContent=t;setTimeout(function(){e.remove();},1800);}

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
  
