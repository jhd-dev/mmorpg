(function(io, $, Vue){
    'use strict';
    
    var width = 800;
    var height = 600;
    
    var rightKey = 68;
    var upKey = 87;
    var leftKey = 65;
    var downKey = 83;
    
    var app = new Vue({
        el: '#game',
        data: {
            messages: [{
                type: 'info',
                msg: 'Welcome to the game!'
            }],
            items: []
        }
    });
    
    var canvas = document.getElementById('viewport');
    var ctx = canvas.getContext('2d');
    ctx.textAlign = 'center';
    
    var textboxFocused = false;
    
    var entities = {};
    var clientId = '';
    
    var background = new Image();
    background.src = '../img/grass.png';
    
    const commands = {
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
        entities = data.entities;
        Object.keys(entities).forEach(type => {
           Object.keys(entities[type]).forEach(id => {
               entities[type][id].type = type;
               entities[type][id].id = id;
           });
        });
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
                        entities[objectType][instanceId].type = objectType;
                        entities[objectType][instanceId].id = instanceId;
                    } else {
                        entities[objectType][instanceId][changedProp] = changedVal;
                        updateException(objectType, instanceId, changedProp);
                    }
                }
            }
        }
        app.$set(app, 'items', data.inventory.items);
    });
    
    socket.on('chatMsg', data => {
        app.messages = app.messages.concat([data]);
    });
    
    $.getJSON(window.location.host + '/api/user', function(user){
        //alert(user);
    });
    
    $(document)
        .ready(function(){
            
            $('#viewport').on('mousedown', function(e){
                var rect = canvas.getBoundingClientRect();
                socket.emit('click', {
                    x: e.clientX - rect.left - width / 2 + entities.Player[clientId].x,
                    y: e.clientY - rect.top - height / 2 + entities.Player[clientId].y
                });
            });
            
            $('#game-cont').on('contextmenu', function(e){
                e.preventDefault();
            });
            
            $('#chat-input, .login-input')
                .on("focus", function(){
                    textboxFocused = true;
                })
                .on("blur", function(){
                    textboxFocused = false;
                });
            
            $('#chat-cont').on('click', function(e){
                $('#chat-input').focus();
            });
            
            $('#chat-form').on('submit', function(e){
                e.preventDefault();
                var message = $('#chat-input').val();
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
                $('#chat-input').blur();
                $('#chat-input').val('');
                textboxFocused = false;
                
            });
            
        })
        .on('keydown', function(e){
            if (!textboxFocused){
                socket.emit('keyDown', {
                    key: e.keyCode
                });
                if ([rightKey, upKey, leftKey, downKey].indexOf(e.keyCode) !== -1){
                    e.preventDefault();
                }
                if (e.keyCode === 84){
                    $('#chat-input').focus();
                    e.preventDefault();
                }
                if (e.keyCode === 191){
                    $('#chat-input').focus();
                }
            }
        })
        .on('keyup', function(e){
            socket.emit('keyUp', {
                key: e.keyCode
            });
        });
    
    function updateException(objectType, instanceId, changedProp){
        var object = entities[objectType][instanceId];
        if (objectType === 'Player'){
            if (changedProp === 'x'){
                object.xCenter = object.x + object.width / 2;
            } else if (changedProp === 'y'){
                object.yCenter = object.y + object.height / 2;
            }
        }
    }
    
    function update(){
        ctx.clearRect(0, 0, width, height);
        drawMap();
        drawEntities();
    }
    
    function drawMap(){
        var coors = getRelativeCoors([0, 0]);
        var left = coors[0];
        var top = coors[1];
        for (var x = 0; x < width; x += 480){
            for (var y = 0; y < height; y += 480){
                ctx.drawImage(background, left + x, top + y, 480, 480);
            }
        }
    }
    
    function drawEntities(){
        Object.keys(entities)  
            .reduce((acc, type) => acc.concat(Object.keys(entities[type]).map(id => entities[type][id])), [])
            .sort((a, b) => a.y + a.height > b.y + b.height)
            .forEach(entity => {
                let coors = getRelativeCoors([entity.x, entity.y]);
                let x = coors[0];
                let y = coors[1];
                switch (entity.type){
                    case 'Player':
                        updatePosition(entity);
                        ctx.fillStyle = 'black';
                        ctx.fillText(entity.name, x + 8, y - 12);
                        ctx.strokeRect(x, y, 16, 16);
                        ctx.fillStyle = entity.color;
                        ctx.fillRect(x, y, 16, 16);
                        //if (id === clientId){
                            ctx.fillStyle = 'black';
                            ctx.fillRect(x - 4, y - 8, 24, 4);
                            ctx.fillStyle = 'red';
                            ctx.fillRect(x - 4, y - 8, 24 * entity.hp / entity.maxHp, 4);
                        //}
                        break;
                    case 'Bullet':
                        updatePosition(entity);
                        ctx.strokeRect(x, y, 16, 16);
                        ctx.fillStyle = 'black';
                        ctx.fillRect(x, y, 16, 16);
                        break;
                    case 'Enemy':
                        updatePosition(entity);
                        ctx.strokeRect(x, y, 16, 16);
                        ctx.fillStyle = '#922';
                        ctx.fillRect(x, y, 16, 16);
                        ctx.fillStyle = 'black';
                        ctx.fillRect(x - 4, y - 8, 24, 4);
                        ctx.fillStyle = 'red';
                        ctx.fillRect(x - 4, y - 8, 24 * entity.hp / entity.maxHp, 4);
                        ctx.fillStyle = 'black';
                        ctx.fillText(entity.name, x + 8, y - 12);
                        break;
                    case 'ItemDrop':
                        updatePosition(entity);
                        ctx.strokeRect(x, y, 16, 16);
                        ctx.fillStyle = 'pink';
                        ctx.fillRect(x, y, 16, 16);
                        break;
                    default:
                        console.warn('unrecognized type ' + entity.type);
                        break;
                }
            });
    }
    
    function getRelativeCoors(coors){
        return [coors[0] - entities.Player[clientId].x + width / 2, coors[1] - entities.Player[clientId].y + height / 2];
    }
    
    function updatePosition(entity){
        entity.x += entity.hspeed / 2;
        entity.y += entity.vspeed / 2;
    }
    
})(io, jQuery, Vue);
