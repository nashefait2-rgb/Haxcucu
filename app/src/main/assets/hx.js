(function(){
if(window.__hx)return;
var H=window.__hx={theme:0,chat:true};
try{H.theme=parseInt(localStorage.getItem('hxtheme')||'0',10)||0;}catch(e){}

var T=[
'html,body{background:#000!important}'
+'[class*="-view"],.dialog,.top-section{background:#0b0b0b!important;color:#fff!important}'
+'button{background:#141414!important;color:#fff!important;border:1px solid #e10600!important;border-radius:8px!important}'
+'button:active,button.selected{background:#e10600!important}'
+'h1,h2{border-color:#e10600!important}'
+'input,select,textarea{background:#000!important;color:#fff!important;border:1px solid #555!important}'
+'a{color:#e10600!important}',

'html,body{background:#050a1a!important}'
+'[class*="-view"],.dialog,.top-section{background:#0a1230!important;color:#e8f6ff!important}'
+'button{background:#0b2a5c!important;color:#e8f6ff!important;border:1px solid #00c8ff!important;border-radius:8px!important}'
+'button:active,button.selected{background:#00c8ff!important;color:#000!important}'
+'h1,h2{border-color:#00c8ff!important}'
+'input,select,textarea{background:#050a1a!important;color:#e8f6ff!important;border:1px solid #00c8ff!important}'
+'a{color:#00c8ff!important}',

'html,body{background:#140a05!important}'
+'[class*="-view"],.dialog,.top-section{background:#1f120a!important;color:#ffe9d2!important}'
+'button{background:#3a2008!important;color:#ffe9d2!important;border:1px solid #ff9a2e!important;border-radius:8px!important}'
+'button:active,button.selected{background:#ff9a2e!important;color:#000!important}'
+'h1,h2{border-color:#ff9a2e!important}'
+'input,select,textarea{background:#140a05!important;color:#ffe9d2!important;border:1px solid #ff9a2e!important}'
+'a{color:#ff9a2e!important}'
];

var BASE='[data-hook=inputbtn],[data-hook=miscbtn]{display:none!important}'
+'.room-view{overflow-y:auto!important;-webkit-overflow-scrolling:touch;touch-action:pan-y;max-height:calc(100vh - 150px)!important}'
+'.roomlist-view,.createroom-view{overflow-y:auto!important;touch-action:pan-y}'
+'.chatbox-view{box-sizing:border-box}'
+'.chatbox-view-contents{height:100%!important;box-sizing:border-box}';

function docs(d,r){r=r||[];r.push(d);var f=d.getElementsByTagName('iframe');
for(var i=0;i<f.length;i++){try{if(f[i].contentDocument)docs(f[i].contentDocument,r);}catch(e){}}return r;}

function fix(c,r){
var s=c.style;
s.setProperty('position','fixed','important');
s.setProperty('left',r.left+'px','important');
s.setProperty('top',r.top+'px','important');
s.setProperty('width',r.width+'px','important');
s.setProperty('height',r.height+'px','important');
s.setProperty('right','auto','important');
s.setProperty('bottom','auto','important');
s.setProperty('margin','0','important');
s.setProperty('z-index','9999','important');
}

function drag(h,c,mode){
var sx,sy,r;
h.addEventListener('pointerdown',function(e){
e.preventDefault();e.stopPropagation();
try{h.setPointerCapture(e.pointerId);}catch(x){}
r=c.getBoundingClientRect();sx=e.clientX;sy=e.clientY;fix(c,r);
});
h.addEventListener('pointermove',function(e){
if(sx===undefined)return;
var dx=e.clientX-sx,dy=e.clientY-sy,s=c.style;
if(mode===0){
s.setProperty('left',(r.left+dx)+'px','important');
s.setProperty('top',(r.top+dy)+'px','important');
}else{
s.setProperty('width',Math.max(160,r.width+dx)+'px','important');
s.setProperty('height',Math.max(90,r.height+dy)+'px','important');
}
});
var end=function(){sx=undefined;};
h.addEventListener('pointerup',end);
h.addEventListener('pointercancel',end);
}

function chatSetup(d){
var c=d.querySelector('.chatbox-view');
if(!c||c.__hx)return;
c.__hx=1;
var base='position:absolute;z-index:99999;touch-action:none;color:#fff;background:#e10600;text-align:center;font-size:18px;opacity:.85;';
var mv=d.createElement('div');mv.textContent='\u2725';
mv.style.cssText=base+'top:0;left:0;width:44px;height:30px;line-height:30px;border-radius:0 0 8px 0;';
var rs=d.createElement('div');rs.textContent='\u21F2';
rs.style.cssText=base+'right:0;bottom:0;width:40px;height:34px;line-height:34px;border-radius:8px 0 0 0;';
c.appendChild(mv);c.appendChild(rs);
drag(mv,c,0);drag(rs,c,1);
}

function hideTabs(d){
var b=d.getElementsByTagName('button');
for(var i=0;i<b.length;i++){
var t=(b[i].textContent||'').trim();
if(t==='Input'||t==='Misc'){b[i].style.setProperty('display','none','important');}
}
}

function apply(){
var ds=docs(document);
for(var i=0;i<ds.length;i++){
var d=ds[i];
var s=d.getElementById('hxs');
if(!s){s=d.createElement('style');s.id='hxs';(d.head||d.documentElement).appendChild(s);}
var css=BASE+T[H.theme]+(H.chat?'':'.chatbox-view{display:none!important}');
if(s.textContent!==css)s.textContent=css;
hideTabs(d);
chatSetup(d);
}
}

window.hxTheme=function(){
H.theme=(H.theme+1)%T.length;
try{localStorage.setItem('hxtheme',String(H.theme));}catch(e){}
apply();
return H.theme;
};
window.hxChat=function(){H.chat=!H.chat;apply();return H.chat;};

setInterval(apply,700);
apply();
})();
