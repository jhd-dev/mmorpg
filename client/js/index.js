(function(io){
    'use strict';
    
    var width = 800;
    var height = 600;
    
    var rightKey = 68;
    var upKey = 87;
    var leftKey = 65;
    var downKey = 83;
    
    var canvas = document.getElementById('viewport');
    var ctx = canvas.getContext('2d');
    ctx.textAlign = 'center';
    
    var chatCont = document.getElementById('chat-cont');
    var chatMessages = document.getElementById('chat-message-cont');
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
        debug: function(variable){
            socket.emit('clientDebug', variable + ': ' + eval(variable));
        }
    };
    
    var socket = io();
    
    socket.on('init', function(data){
        entities = data.entities;
        clientId = data.clientId;
        setInterval(update, 20);
    });
    
    socket.on('update', function(data){
        entities = data.entities;
        /*var objects = Object.keys(data.entities);
        for (var i = 0; i < objects.length; i ++){
            var objectType = objects[i];
            var instanceIds = Object.keys(data.entities[objectType]);
            for (var j = 0; j < instanceIds.length; j ++){
                var instanceId = instanceIds[j];
                var changes = Object.keys(data.entities[objectType][instanceId]);
                for (var k = 0; k < changes.length; k ++){
                    var changedProp = changes[k];
                    var changedVal = data.entities[objectType][instanceId];
                    entities[objectType][instanceId][changedProp] = changedVal;
                }
            }
        }*/
    });
    
    socket.on('chatMsg', function(data){
        chatMessages.innerHTML += '<div class="chat-message">' + data.name + ': ' + data.msg + '</div>';
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
            for (var i = 0; i < entities.Player.length || 0; i ++){
                var player = entities.Player[i];
                updatePosition(player);
                ctx.fillStyle = 'black';
                ctx.fillText(player.name, player.x, player.y - 20);
                ctx.strokeRect(player.x - 8, player.y - 8, 16, 16);
                ctx.fillStyle = player.color;
                ctx.fillRect(player.x - 8, player.y - 8, 16, 16);
                //if (i === clientId){
                    ctx.fillStyle = 'black';
                    ctx.fillRect(player.x - 12, player.y - 16, 24, 4);
                    ctx.fillStyle = 'red';
                    ctx.fillRect(player.x - 12, player.y - 16, 24 * player.hp / player.maxHp, 4);
                //}
            }
        }
        if (entities.Bullet){
            for (i = 0; i < entities.Bullet.length || 0; i ++){
                var bullet = entities.Bullet[i];
                updatePosition(bullet);
                ctx.strokeRect(bullet.x - 8, bullet.y - 8, 16, 16);
                ctx.fillStyle = 'black';
                ctx.fillRect(bullet.x - 8, bullet.y - 8, 16, 16);
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
    
})(io);
