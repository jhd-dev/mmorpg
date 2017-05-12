!function(t){function e(i){if(n[i])return n[i].exports;var c=n[i]={i:i,l:!1,exports:{}};return t[i].call(c.exports,c,c.exports,e),c.l=!0,c.exports}var n={};e.m=t,e.c=n,e.i=function(t){return t},e.d=function(t,n,i){e.o(t,n)||Object.defineProperty(t,n,{configurable:!1,enumerable:!0,get:i})},e.n=function(t){var n=t&&t.__esModule?function(){return t.default}:function(){return t};return e.d(n,"a",n),n},e.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},e.p="/dist/",e(e.s=0)}([function(module,exports,__webpack_require__){"use strict";!function(io,$,Vue){function updateException(t,e,n){var i=entities[t][e];"Player"===t&&("x"===n?i.xCenter=i.x+i.width/2:"y"===n&&(i.yCenter=i.y+i.height/2))}function update(){ctx.clearRect(0,0,width,height),drawMap(),drawEntities()}function drawMap(){for(var t=getRelativeCoors([0,0]),e=t[0],n=t[1],i=0;i<width;i+=480)for(var c=0;c<height;c+=480)ctx.drawImage(background,e+i,n+c,480,480)}function drawEntities(){Object.keys(entities).reduce(function(t,e){return t.concat(Object.keys(entities[e]).map(function(t){return entities[e][t]}))},[]).sort(function(t,e){return t.y+t.height>e.y+e.height}).forEach(function(t){var e=getRelativeCoors([t.x,t.y]),n=e[0],i=e[1];switch(t.type){case"Player":updatePosition(t),ctx.fillStyle="black",ctx.fillText(t.name,n+8,i-12),ctx.strokeRect(n,i,16,16),ctx.fillStyle=t.color,ctx.fillRect(n,i,16,16),ctx.fillStyle="black",ctx.fillRect(n-4,i-8,24,4),ctx.fillStyle="red",ctx.fillRect(n-4,i-8,24*t.hp/t.maxHp,4);break;case"Bullet":updatePosition(t),ctx.strokeRect(n,i,16,16),ctx.fillStyle="black",ctx.fillRect(n,i,16,16);break;case"Enemy":updatePosition(t),ctx.strokeRect(n,i,16,16),ctx.fillStyle="#922",ctx.fillRect(n,i,16,16),ctx.fillStyle="black",ctx.fillRect(n-4,i-8,24,4),ctx.fillStyle="red",ctx.fillRect(n-4,i-8,24*t.hp/t.maxHp,4),ctx.fillStyle="black",ctx.fillText(t.name,n+8,i-12);break;case"ItemDrop":updatePosition(t),ctx.strokeRect(n,i,16,16),ctx.fillStyle="pink",ctx.fillRect(n,i,16,16);break;default:console.warn("unrecognized type "+t.type)}})}function getRelativeCoors(t){return[t[0]-entities.Player[clientId].x+width/2,t[1]-entities.Player[clientId].y+height/2]}function updatePosition(t){t.x+=t.hspeed/2,t.y+=t.vspeed/2}var width=800,height=600,rightKey=68,upKey=87,leftKey=65,downKey=83,app=new Vue({el:"#game",data:{messages:[{type:"info",msg:"Welcome to the game!"}],items:[]}}),canvas=document.getElementById("viewport"),ctx=canvas.getContext("2d");ctx.textAlign="center";var textboxFocused=!1,entities={},clientId="",background=new Image;background.src="../img/grass.png";var commands={help:function(){app.messages.push({type:"info",msg:"Commands:\n/help - List all commands"})},debug:function debug(variable){socket.emit("clientDebug",variable+": "+eval(variable))}},socket=io();socket.on("init",function(t){entities=t.entities,Object.keys(entities).forEach(function(t){Object.keys(entities[t]).forEach(function(e){entities[t][e].type=t,entities[t][e].id=e})}),clientId=t.clientId,setInterval(update,20)}),socket.on("update",function(t){var e=!0,n=!1,i=void 0;try{for(var c,o=t.removed[Symbol.iterator]();!(e=(c=o.next()).done);e=!0){var a=c.value;delete entities[a.type][a.id]}}catch(t){n=!0,i=t}finally{try{!e&&o.return&&o.return()}finally{if(n)throw i}}for(var r=Object.keys(t.entities),l=0;l<r.length;l++)for(var s=r[l],u=Object.keys(t.entities[s]),f=0;f<u.length;f++)for(var d=u[f],p=Object.keys(t.entities[s][d]),y=0;y<p.length;y++){var x=p[y],h=t.entities[s][d][x];entities[s][d]?(entities[s][d][x]=h,updateException(s,d,x)):(entities[s][d]=t.entities[s][d],entities[s][d].type=s,entities[s][d].id=d)}app.$set(app,"items",t.inventory.items)}),socket.on("chatMsg",function(t){app.messages=app.messages.concat([t])}),$.getJSON(window.location.host+"/api/user",function(t){}),$(document).ready(function(){$("#viewport").on("mousedown",function(t){var e=canvas.getBoundingClientRect();socket.emit("click",{x:t.clientX-e.left-width/2+entities.Player[clientId].x,y:t.clientY-e.top-height/2+entities.Player[clientId].y})}),$("#game-cont").on("contextmenu",function(t){t.preventDefault()}),$("#chat-input, .login-input").on("focus",function(){textboxFocused=!0}).on("blur",function(){textboxFocused=!1}),$("#chat-cont").on("click",function(t){$("#chat-input").focus()}),$("#chat-form").on("submit",function(t){t.preventDefault();var e=$("#chat-input").val();if("/"===e.charAt(0)){var n=e.substr(1).split(" ");commands[n[0]]?commands[n[0]].apply(null,n.slice(1)):socket.emit("chatMsg",e.substr(0,140))}else socket.emit("chatMsg",e.substr(0,140));$("#chat-input").blur(),$("#chat-input").val(""),textboxFocused=!1})}).on("keydown",function(t){textboxFocused||(socket.emit("keyDown",{key:t.keyCode}),-1!==[68,87,65,83].indexOf(t.keyCode)&&t.preventDefault(),84===t.keyCode&&($("#chat-input").focus(),t.preventDefault()),191===t.keyCode&&$("#chat-input").focus())}).on("keyup",function(t){socket.emit("keyUp",{key:t.keyCode})})}(io,jQuery,Vue)}]);
//# sourceMappingURL=game.js.map