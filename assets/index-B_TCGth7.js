(function(){const d=document.createElement("link").relList;if(d&&d.supports&&d.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))p(o);new MutationObserver(o=>{for(const e of o)if(e.type==="childList")for(const n of e.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&p(n)}).observe(document,{childList:!0,subtree:!0});function c(o){const e={};return o.integrity&&(e.integrity=o.integrity),o.referrerPolicy&&(e.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?e.credentials="include":o.crossOrigin==="anonymous"?e.credentials="omit":e.credentials="same-origin",e}function p(o){if(o.ep)return;o.ep=!0;const e=c(o);fetch(o.href,e)}})();const A={name:"A",pos:0,goods:1,launchCost:0},P={name:"B",pos:8,goods:1,launchCost:9,display:`
         ,MMM8&&&.
    _...MMMMM88&&&&..._
 .::'''MMMMM88&&&&&&'''::.
::     MMMMM88&&&&&&     ::
'::....MMMMM88&&&&&&....::'
   '''''MMMMM88&&&&'''''
   jgs   'MMM8&&&'

`},w={name:"C",pos:15,goods:2,launchCost:15,display:`
 ~+       *       +
    '                  |
()    .-.,="\`\`"=.    - o -
      '=/_       \\     |
   *   |  '=._    |
              \`=./\`,        '
     .   '=.__.=' \`='      *
                      +
 O jgs  *        '       .

`},N={name:"D",pos:30,goods:5,launchCost:30,display:`
     .        ___---___
           .--\\        --.     .   .
         ./.;_.\\     __/~ \\.
    .   /;  / \`-'  __\\    . \\
       / ,--'     / .   .;   \\      |
      | .|       /       __   |    -O-
     |__/    __ |  . ;   \\ | . |    |
     |      /  \\\\_    . ;| \\___|
o    |      \\  .~\\\\___,--'     |
      |     | . ; ~~~~\\_    __|
       \\    \\   .  .  ; \\  /_/
   .    \\   /         . |  ~/    .
 .       ~\\ \\   .      /  /~
           ~--___ ; ___--~
      .          ---         .    -JT

`},O={name:"Ship 1",destination1:A,destination2:P,pos:0,direction:!0,speed:1,capacity:1,upgradeSpeedCost:5,upgradeCapacityCost:8},B=t=>new Promise(d=>setTimeout(d,t)),U=[P,w,N],E=5;let L=8;const C=[O];let l=5,D=0;const Q=async t=>{if(l>=t.upgradeSpeedCost&&t.speed<4)switch(t.speed+=1,l-=t.upgradeSpeedCost,t.speed){case 2:t.upgradeSpeedCost+=2;break;case 3:t.upgradeSpeedCost+=5;break}},j=async t=>{if(l>=t.upgradeCapacityCost&&t.capacity<4)switch(t.capacity+=1,l-=t.upgradeCapacityCost,t.speed){case 2:t.upgradeCapacityCost+=3;break;case 3:t.upgradeCapacityCost+=7;break}},k=async t=>{if(l>=t.launchCost){const d={name:"Ship "+(C.length+1),destination1:A,destination2:t,speed:1,capacity:1,pos:0,direction:!0,upgradeSpeedCost:E,upgradeCapacityCost:L};l-=t.launchCost,t.launchCost=Math.floor(t.launchCost*1.5),C.push(d)}},I=[],b=(t,d)=>{I.push({item:t,upgradeFunc:d})},h=[],q=(t,d)=>{h.push({item:t,upgradeFunc:d})},S=({id:t,textContent:d,onclick:c,disabled:p})=>{const o=s({id:t,elementTypeArg:"button"});return d&&(o.textContent=d),c&&(o.onclick=c),o.disabled=!!p,o},s=({id:t,innerText:d,elementTypeArg:c})=>{let p=document.getElementById(t);if(!p){const o=c||"div";p=document.createElement(o),p.id=t}return d!==void 0&&(p.innerText=d),p},F=async()=>{for(;;)X(),J(),await B(300)},X=async()=>{G(),C.forEach(t=>{t.pos>=t.destination2.pos?(t.direction=!1,t.pos==t.destination2.pos):t.pos<=t.destination1.pos&&(t.direction=!0,t.pos==t.destination1.pos,D!==0&&(l+=t.capacity*t.destination2.goods)),t.direction?t.pos+=t.speed:t.pos-=t.speed}),D+=1},G=async()=>{for(const t of I){const{item:d,upgradeFunc:c}=t;await c(d)}I.length=0;for(const t of h){const{item:d,upgradeFunc:c}=t;await c(d)}h.length=0},J=()=>{const t=s({id:"ships"});C.forEach(e=>{const n="shipParent-"+e.name,i=s({id:n}),m=s({id:n+"-shipName",innerText:e.name+": ",elementTypeArg:"span"}),u=s({id:n+"-planet1",innerText:e.destination1.name,elementTypeArg:"span"});let a="";if(e.pos>0&&e.pos<e.destination2.pos){if(e.direction?a+=">":a+="<",e.capacity===2?a+="=":e.capacity===3?a+="==":e.capacity>3&&(a+="==="),e.speed===2)a+="~";else if(e.speed>2){const x=e.direction?"}":"{";e.speed===3?a+=x:e.speed>3&&(a+=x+x)}let T=0;Math.min(e.pos,a.length),e.direction?T=Math.min(e.pos,a.length):T=Math.min(e.destination2.pos-e.pos,a.length),a=a.substring(0,T),e.direction&&(a=a.split("").reverse().join(""))}const y=s({id:n+"-shipDisplay",innerText:a,elementTypeArg:"span"}),g=a.length;let f=0,r=0;e.pos<=0?(f=0,r=e.destination2.pos-1-Math.max(e.pos,0)):e.pos<e.destination2.pos&&e.direction?(f=Math.max(e.pos-1-(g-1),0),r=e.destination2.pos-1-e.pos):e.pos<e.destination2.pos&&!e.direction?(f=e.pos-1,r=Math.max(e.destination2.pos-1-e.pos-(g-1),0)):e.pos>=e.destination2.pos&&(f=e.destination2.pos-1,r=0);const M=s({id:n+"-preShip",innerText:".".repeat(f),elementTypeArg:"span"}),_=s({id:n+"-postShip",innerText:".".repeat(r),elementTypeArg:"span"}),v=s({id:n+"-planet2",innerText:e.destination2.name,elementTypeArg:"span"});i.appendChild(m),i.appendChild(u),i.appendChild(M),i.appendChild(y),i.appendChild(_),i.appendChild(v),t.appendChild(i)});const d=s({id:"gameInfo"});let c=s({id:"credits",innerText:"Credits: "+l.toString()});d.appendChild(c);const p=s({id:"shipsInfo"});C.forEach(e=>{const n=s({id:"shipInfo-"+e.name});n.className="shipInfo";const i=s({id:"shipInfo-name-"+e.name,innerText:e.name}),m=s({id:"shipInfo-destination-"+e.name,innerText:"Destination: Planet "+e.destination2.name}),u=s({id:"shipInfo-speed-"+e.name,innerText:"Speed: "+e.speed}),a=s({id:"shipInfo-capacity-"+e.name,innerText:"Capacity: "+e.capacity}),y="addSpeed"+e.name,g=S({id:y,textContent:"Upgrade speed ("+e.upgradeSpeedCost+" credits)",onclick:()=>{b(e,Q)},disabled:l<e.upgradeSpeedCost||e.speed===4});e.speed===4&&(u.textContent+=" (MAX)",g.textContent="Upgrade speed",g.disabled=!0);const f="addCapacity"+e.name,r=S({id:f,textContent:"Upgrade capacity ("+e.upgradeCapacityCost+" credits)",onclick:()=>{b(e,j)},disabled:l<e.upgradeCapacityCost});e.capacity===4&&(a.textContent+=" (MAX)",r.textContent="Upgrade capacity",r.disabled=!0),n.appendChild(i),n.appendChild(m),n.appendChild(u),n.appendChild(a),n.appendChild(g),n.appendChild(r),p.appendChild(n)});const o=s({id:"planetsInfo"});U.forEach(e=>{const n="planetInfo-"+e.name,i=s({id:n});i.className="planetInfo";const m=s({id:n+"-name",innerText:"Planet "+e.name}),u=s({id:n+"-display",innerText:e.display});u.className="planetDisplay";const a=C.find(_=>_.destination2===e);a||(u.innerText=u.innerText.replace(/[ \t]/g,"/"));const y=a?e.pos:"???",g=s({id:n+"-distance",innerText:"Distance: "+y}),f=a?e.goods:"???",r=s({id:n+"-goods",innerText:"Goods multiplier: "+f}),M=S({id:"addShip"+e.name,textContent:"Launch new ship ("+e.launchCost+" credits)",onclick:()=>{q(e,k)},disabled:l<e.launchCost});o.append(i),i.appendChild(m),i.appendChild(u),i.appendChild(g),i.appendChild(r),i.appendChild(M)})};F();
