(function(io, Vue){
    'use strict';
    
    var width = 800;
    var height = 600;
    
    var rightKey = 68;
    var upKey = 87;
    var leftKey = 65;
    var downKey = 83;
    
    var app = new Vue({
        el: '#chat-cont',
        data: {
            messages: [{
                type: 'info',
                msg: 'Welcome to the game!'
            }]
        }
    });
    
    var canvas = document.getElementById('viewport');
    var ctx = canvas.getContext('2d');
    ctx.textAlign = 'center';
    
    var gameCont = document.getElementById('game');
    
    var chatCont = document.getElementById('chat-cont');
    var chatForm = document.getElementById('chat-form');
    var chatInput = document.getElementById('chat-input');
    
    var textboxFocused = false;
    var textboxes = [chatInput];
    for (var i = 0; i < textboxes.length; i ++){
        textboxes[i].onfocus = function(){
            textboxFocused = true;
        };
        textboxes[i].onblur = function(){
            textboxFocused = false;
        };
    }
    
    var entities = {
        players: [],
        bullets: []
    };
    var clientId = '';
    
    var background = new Image();
    background.src = '../img/grass.png';
    
    var commands = {
        help: function(){
            app.messages.push({
                type: 'info',
                msg: 'Commands:\n/help - List all commands'
            });
        },
        debug: function(variable){
            socket.emit('clientDebug', variable + ': ' + eval(variable));
        }
    };
    
    var socket = io();
    
    socket.on('init', function(data){
        entities = data.entities;console.log(entities);
        clientId = data.clientId;
        setInterval(update, 20);
    });
    
    socket.on('update', function(data){
        for (var removed of data.removed){
            delete entities[removed.type][removed.id];
        }
        var objects = Object.keys(data.entities);
        for (var i = 0; i < objects.length; i ++){
            var objectType = objects[i];
            var instanceIds = Object.keys(data.entities[objectType]);
            for (var j = 0; j < instanceIds.length; j ++){
                var instanceId = instanceIds[j];
                var changes = Object.keys(data.entities[objectType][instanceId]);
                for (var k = 0; k < changes.length; k ++){
                    var changedProp = changes[k];
                    var changedVal = data.entities[objectType][instanceId][changedProp];
                    if (!entities[objectType][instanceId]){
                        entities[objectType][instanceId] = data.entities[objectType][instanceId];
                    } else {
                        entities[objectType][instanceId][changedProp] = changedVal;
                    }
                }
            }
        }
    });
    
    socket.on('chatMsg', data => {
        app.messages = app.messages.concat([data]);
    });
    
    document.onkeydown = function(e){
        if (!textboxFocused){
            socket.emit('keyDown', {
                key: e.keyCode
            });
            if ([rightKey, upKey, leftKey, downKey].indexOf(e.keyCode) !== -1){
                e.preventDefault();
            }
            if (e.keyCode === 84){
                chatInput.focus();
                e.preventDefault();
            }
            if (e.keyCode === 191){
                chatInput.focus();
            }
        }
    };
    
    document.onkeyup = function(e){
        socket.emit('keyUp', {
            key: e.keyCode
        });
    };
    
    /*document.getElementById('login-form').onsubmit = function(e){
        socket.emit('login', {
            username: 'porygonj',
            password: 'abcd1234'
        });
        e.preventDefault();
    };*/
    
    canvas.onclick = function(e){
        var rect = canvas.getBoundingClientRect();
        socket.emit('click', {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        });
    };
    
    gameCont.oncontextmenu = function(e){
        e.preventDefault();
    };
    
    chatCont.onclick = function(e){
        chatInput.focus();
    };
    
    chatForm.onsubmit = function(e){
        var message = chatInput.value;
        if (message.charAt(0) === '/'){
            var inputs = message.substr(1).split(' ');
            if (commands[inputs[0]]){
                commands[inputs[0]].apply(null, inputs.slice(1));
            } else {
                socket.emit('chatMsg', message.substr(0, 140));
            }
        } else {
            socket.emit('chatMsg', message.substr(0, 140));
        }
        chatInput.blur();
        chatInput.value = '';
        textboxFocused = false;
        e.preventDefault();
    };
    
    
    function update(){
        ctx.clearRect(0, 0, width, height);
        drawMap();
        if (entities.Player){
            for (let id in entities.Player){
                var player = entities.Player[id];
                updatePosition(player);
                ctx.fillStyle = 'black';
                ctx.fillText(player.name, player.x, player.y - 20);
                ctx.strokeRect(player.x - 8, player.y - 8, 16, 16);
                ctx.fillStyle = player.color;
                ctx.fillRect(player.x - 8, player.y - 8, 16, 16);
                //if (id === clientId){
                    ctx.fillStyle = 'black';
                    ctx.fillRect(player.x - 12, player.y - 16, 24, 4);
                    ctx.fillStyle = 'red';
                    ctx.fillRect(player.x - 12, player.y - 16, 24 * player.hp / player.maxHp, 4);
                //}
            }
        }
        if (entities.Bullet){
            for (let id in entities.Bullet){
                var bullet = entities.Bullet[id];
                updatePosition(bullet);
                ctx.strokeRect(bullet.x - 8, bullet.y - 8, 16, 16);
                ctx.fillStyle = 'black';
                ctx.fillRect(bullet.x - 8, bullet.y - 8, 16, 16);
            }
        }
        if (entities.Enemy){
            for (let id in entities.Enemy){
                var enemy = entities.Enemy[id];
                if (enemy){
                    updatePosition(enemy);
                    ctx.strokeRect(enemy.x - 8, enemy.y - 8, 16, 16);
                    ctx.fillStyle = '#922';
                    ctx.fillRect(enemy.x - 8, enemy.y - 8, 16, 16);
                    ctx.fillStyle = 'black';
                    ctx.fillRect(enemy.x - 12, enemy.y - 16, 24, 4);
                    ctx.fillStyle = 'red';
                    ctx.fillRect(enemy.x - 12, enemy.y - 16, 24 * enemy.hp / enemy.maxHp, 4);
                    ctx.fillStyle = 'black';
                    ctx.fillText(enemy.name, enemy.x, enemy.y - 20);
                }
            }
        }
    }
    
    function drawMap(){
        for (var x = 0; x < width; x += 480){
            for (var y = 0; y < height; y += 480){
                ctx.drawImage(background, x, y, 480, 480);
            }
        }
    }
    
    function updatePosition(entity){
        entity.x += entity.hspeed / 2;
        entity.y += entity.vspeed / 2;
    }
    
})(io, Vue);
