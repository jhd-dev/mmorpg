(function(io){
    'use strict';
    
    var width = 800;
    var height = 600;
    
    var canvas = document.getElementById('viewport');
    var ctx = canvas.getContext('2d');
    ctx.textAlign = 'center';
    
    var chatMessages = document.getElementById('chat-message-cont');
    var chatForm = document.getElementById('chat-form');
    var chatInput = document.getElementById('chat-input');
    
    var entities = {
        players: [],
        bullets: []
    };
    
    var commands = {
        debug: function(variable){
            socket.emit('clientDebug', variable + ': ' + eval(variable));
        }
    };
    
    var socket = io();
    
    socket.on('entities', function(data){
        //console.log(data);
        entities = data;
    });
    
    socket.on('chatMsg', function(data){
        chatMessages.innerHTML += '<div class="chat-message">' + data.name + ': ' + data.msg + '</div>';
    });
    
    document.onkeydown = function(e){
        socket.emit('keyDown', {
            key: e.keyCode
        });
        if ([37, 38, 39, 40].indexOf(e.keyCode) !== -1){
            e.preventDefault();
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
    
    chatForm.onsubmit = function(e){
        var message = chatInput.value;
        if (message.charAt(0) === '/'){
            var inputs = message.substr(1).split(' ');
            if (commands[inputs[0]]){
                commands[inputs[0]].apply(null, inputs.slice(1));
            }
        } else {
            socket.emit('chatMsg', message.substr(0, 140));
        }
        e.preventDefault();
    };
    
    var update = setInterval(function(){
        ctx.clearRect(0, 0, width, height);
        for (var i = 0; i < entities.players.length; i ++){
            var player = entities.players[i];
            updatePosition(player);
            ctx.fillStyle = 'black';
            ctx.fillText(player.name, player.x, player.y - 20);
            ctx.strokeRect(player.x - 8, player.y - 8, 16, 16);
            ctx.fillStyle = player.color;
            ctx.fillRect(player.x - 8, player.y - 8, 16, 16);
        }
        for (i = 0; i < entities.bullets.length; i ++){
            var bullet = entities.bullets[i];
            updatePosition(bullet);
            ctx.strokeRect(bullet.x - 8, bullet.y - 8, 16, 16);
            ctx.fillStyle = 'black';
            ctx.fillRect(bullet.x - 8, bullet.y - 8, 16, 16);
        }
    }, 20);
    
    function updatePosition(entity){
        entity.x += entity.hspeed;
        entity.y += entity.vspeed;
    }
    
})(io);
