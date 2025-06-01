(function(){const a=document.createElement("link").relList;if(a&&a.supports&&a.supports("modulepreload"))return;for(const d of document.querySelectorAll('link[rel="modulepreload"]'))p(d);new MutationObserver(d=>{for(const e of d)if(e.type==="childList")for(const o of e.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&p(o)}).observe(document,{childList:!0,subtree:!0});function c(d){const e={};return d.integrity&&(e.integrity=d.integrity),d.referrerPolicy&&(e.referrerPolicy=d.referrerPolicy),d.crossOrigin==="use-credentials"?e.credentials="include":d.crossOrigin==="anonymous"?e.credentials="omit":e.credentials="same-origin",e}function p(d){if(d.ep)return;d.ep=!0;const e=c(d);fetch(d.href,e)}})();const E={name:"A",pos:0,goods:1,launchCost:0},A={name:"B",pos:8,goods:1,launchCost:9,display:`
         ,MMM8&&&.
    _...MMMMM88&&&&..._
 .::'''MMMMM88&&&&&&'''::.
::     MMMMM88&&&&&&     ::
'::....MMMMM88&&&&&&....::'
   '''''MMMMM88&&&&'''''
   jgs   'MMM8&&&'

`},P={name:"C",pos:15,goods:2,launchCost:15,display:`
 ~+       *       +
    '                  |
()    .-.,="\`\`"=.    - o -
      '=/_       \\     |
   *   |  '=._    |
              \`=./\`,        '
     .   '=.__.=' \`='      *
                      +
 O jgs  *        '       .

`},v={name:"D",pos:30,goods:5,launchCost:30,display:`
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

`},w={name:"Ship 1",destination1:E,destination2:A,pos:0,direction:!0,speed:1,capacity:1,upgradeSpeedCost:5,upgradeCapacityCost:8},N=t=>new Promise(a=>setTimeout(a,t)),O=[A,P,v],U=5;let L=8;const m=[w];let l=5,D=0;const j=async t=>{if(l>=t.upgradeSpeedCost&&t.speed<4)switch(t.speed+=1,l-=t.upgradeSpeedCost,t.speed){case 2:t.upgradeSpeedCost+=2;break;case 3:t.upgradeSpeedCost+=5;break}},Q=async t=>{if(l>=t.upgradeCapacityCost&&t.capacity<4)switch(t.capacity+=1,l-=t.upgradeCapacityCost,t.speed){case 2:t.upgradeCapacityCost+=3;break;case 3:t.upgradeCapacityCost+=7;break}},k=async t=>{if(l>=t.launchCost){const a={name:"Ship "+(m.length+1),destination1:E,destination2:t,speed:1,capacity:1,pos:0,direction:!0,upgradeSpeedCost:U,upgradeCapacityCost:L};l-=t.launchCost,t.launchCost=Math.floor(t.launchCost*1.5),m.push(a)}},I=[],b=(t,a)=>{I.push({item:t,upgradeFunc:a})},h=[],q=(t,a)=>{h.push({item:t,upgradeFunc:a})},S=({id:t,textContent:a,onclick:c,disabled:p})=>{const d=s({id:t,elementTypeArg:"button"});return a&&(d.textContent=a),c&&(d.onclick=c),d.disabled=!!p,d},s=({id:t,innerText:a,elementTypeArg:c})=>{let p=document.getElementById(t);if(!p){const d=c||"div";p=document.createElement(d),p.id=t}return a!==void 0&&(p.innerText=a),p},F=async()=>{for(;;)X(),J(),await N(300)},X=async()=>{G(),m.forEach(t=>{t.pos>=t.destination2.pos?(t.direction=!1,t.pos==t.destination2.pos):t.pos<=t.destination1.pos&&(t.direction=!0,t.pos==t.destination1.pos,D!==0&&(l+=t.capacity*t.destination2.goods)),t.direction?t.pos+=t.speed:t.pos-=t.speed}),D+=1},G=async()=>{for(const t of I){const{item:a,upgradeFunc:c}=t;await c(a)}I.length=0;for(const t of h){const{item:a,upgradeFunc:c}=t;await c(a)}h.length=0},J=()=>{const t=s({id:"ships"});m.forEach(e=>{const o="shipParent-"+e.name.split(" ").join("-"),n=s({id:o}),y=s({id:o+"-shipName",innerText:e.name+": ",elementTypeArg:"span"}),u=s({id:o+"-planet1",innerText:e.destination1.name,elementTypeArg:"span"});let i="";if(e.pos>0&&e.pos<e.destination2.pos){if(e.direction?i+=">":i+="<",e.capacity===2?i+="=":e.capacity===3?i+="==":e.capacity>3&&(i+="==="),e.speed===2)i+="~";else if(e.speed>2){const x=e.direction?"}":"{";e.speed===3?i+=x:e.speed>3&&(i+=x+x)}let T=0;Math.min(e.pos,i.length),e.direction?T=Math.min(e.pos,i.length):T=Math.min(e.destination2.pos-e.pos,i.length),i=i.substring(0,T),e.direction&&(i=i.split("").reverse().join(""))}const C=s({id:o+"-shipDisplay",innerText:i,elementTypeArg:"span"}),f=i.length;let r=0,g=0;e.pos<=0?(r=0,g=e.destination2.pos-1-Math.max(e.pos,0)):e.pos<e.destination2.pos&&e.direction?(r=Math.max(e.pos-1-(f-1),0),g=e.destination2.pos-1-e.pos):e.pos<e.destination2.pos&&!e.direction?(r=e.pos-1,g=Math.max(e.destination2.pos-1-e.pos-(f-1),0)):e.pos>=e.destination2.pos&&(r=e.destination2.pos-1,g=0);const M=s({id:o+"-preShip",innerText:".".repeat(r),elementTypeArg:"span"}),_=s({id:o+"-postShip",innerText:".".repeat(g),elementTypeArg:"span"}),B=s({id:o+"-planet2",innerText:e.destination2.name,elementTypeArg:"span"});n.childElementCount||(n.appendChild(y),n.appendChild(u),n.appendChild(M),n.appendChild(C),n.appendChild(_),n.appendChild(B)),document.getElementById(n.id)||t.appendChild(n)});const a=s({id:"gameInfo"});let c=s({id:"credits",innerText:"Credits: "+l.toString()});a.childElementCount||a.appendChild(c);const p=s({id:"shipsInfo"});m.forEach(e=>{const o="shipInfo-"+e.name.split(" ").join("-"),n=s({id:o});n.className="shipInfo";const y=s({id:o+"-"+e.name,innerText:e.name}),u=s({id:o+"-destination",innerText:"Destination: Planet "+e.destination2.name}),i=s({id:o+"-speed",innerText:"Speed: "+e.speed}),C=s({id:o+"-capacity",innerText:"Capacity: "+e.capacity}),f=S({id:o+"-addSpeed",textContent:"Upgrade speed ("+e.upgradeSpeedCost+" credits)",onclick:()=>{b(e,j)},disabled:l<e.upgradeSpeedCost||e.speed===4});e.speed===4&&(i.textContent+=" (MAX)",f.textContent="Upgrade speed",f.disabled=!0);const r=S({id:o+"addCapacity",textContent:"Upgrade capacity ("+e.upgradeCapacityCost+" credits)",onclick:()=>{b(e,Q)},disabled:l<e.upgradeCapacityCost});e.capacity===4&&(C.textContent+=" (MAX)",r.textContent="Upgrade capacity",r.disabled=!0),n.childElementCount||(n.appendChild(y),n.appendChild(u),n.appendChild(i),n.appendChild(C),n.appendChild(f),n.appendChild(r)),document.getElementById(n.id)||p.appendChild(n)});const d=s({id:"planetsInfo"});O.forEach(e=>{const o="planetInfo-"+e.name.split(" ").join("-"),n=s({id:o});n.className="planetInfo";const y=s({id:o+"-name",innerText:"Planet "+e.name}),u=s({id:o+"-display",innerText:e.display});u.className="planetDisplay";const i=m.find(_=>_.destination2===e);i||(u.innerText=u.innerText.replace(/[ \t]/g,"/"));const C=i?e.pos:"???",f=s({id:o+"-distance",innerText:"Distance: "+C}),r=i?e.goods:"???",g=s({id:o+"-goods",innerText:"Goods multiplier: "+r}),M=S({id:o+"addShip",textContent:"Launch new ship ("+e.launchCost+" credits)",onclick:()=>{q(e,k)},disabled:l<e.launchCost});n.childElementCount||(n.appendChild(y),n.appendChild(u),n.appendChild(f),n.appendChild(g),n.appendChild(M)),document.getElementById(n.id)||d.append(n)})};F();
