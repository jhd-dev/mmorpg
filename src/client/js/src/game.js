(function(io, $, Vue){
    'use strict';
    
    let width = 800;
    let height = 600;
    let canvasWidth = 800;
    let canvasHeight = 600;
    
    let rightKey = 68;
    let upKey = 87;
    let leftKey = 65;
    let downKey = 83;
    
    let app = new Vue({
        el: '#game',
        data: {
            messages: [{
                type: 'info',
                msg: 'Welcome to the game!'
            }],
            items: []
        }
    });
    
    let canvas = document.getElementById('viewport');
    let ctx = canvas.getContext('2d');
    resizeCanvas();
    
    let textboxFocused = false;
    
    let entities = {};
    let clientId = '';
    let tileSize = 16;
    let fps = 60;
    let showHitboxes = false;
    let sprites = {};
    let currentMapName = '';
    let updateInterval = null;
    let mapDir = '../../img/maps';
    
    const commands = {
        help: function(){
            app.messages.push({
                type: 'info',
                msg: 'Commands:\n/help - List all commands'
            });
        },
        debug: function(variable){
            socket.emit('clientDebug', variable + ': ' + eval(variable));
        },
        hitboxes: function(show = !showHitboxes){
            showHitboxes = show;
        }
    };
    
    let socket = io();
    
    socket.on('prep', data => {console.log('prep:', data);
        currentMapName = data.mapName;
        let spriteNames = Object.keys(data.sprites);
        let spritesRemaining = spriteNames.length;
        spriteNames.forEach(spriteName => {
            sprites[spriteName] = new Image();
            sprites[spriteName].src = data.sprites[spriteName];
            sprites[spriteName].onload = () => {
                spritesRemaining --;
                if (!spritesRemaining){
                    sprites[data.mapName] = new Image();
                    sprites[data.mapName].src = mapDir + '/' + data.mapName + '.png'; console.log(sprites[data.mapName].src);
                    sprites[data.mapName].onload = () => {console.log(sprites[currentMapName]);
                        socket.emit('prepComplete');
                    };
                }
            };
        });
        if (!spritesRemaining){
            sprites[data.mapName] = new Image();
            sprites[data.mapName].src = mapDir + '/' + data.mapName + '.png'; console.log(sprites[data.mapName].src);
            sprites[data.mapName].onload = () => {console.log(sprites[currentMapName]);
                socket.emit('prepComplete');
            };
        }
    });
    
    socket.on('init', function(data){console.log(data);
        entities = data.entities;
        Object.keys(entities).forEach(id => {
            entities[id].id = id;
            entities[id].type = entities[id].types[entities[id].types.length - 1];
        });
        clientId = data.clientId;
        //currentMapName = data.mapName;
        updateInterval = setInterval(update, 1000 / fps);
    });
    
    socket.on('update', function(data){//console.log(entities, clientId);//console.log(data);
        for (let removed of data.removed){
            delete entities[removed.id];
        }
        
        let instanceIds = Object.keys(data.entities);
        for (let j = 0; j < instanceIds.length; j ++){
            let instanceId = instanceIds[j];
            let changes = Object.keys(data.entities[instanceId]);
            for (let k = 0; k < changes.length; k ++){
                let changedProp = changes[k];
                let changedVal = data.entities[instanceId][changedProp];
                if (!entities[instanceId]){
                    entities[instanceId] = data.entities[instanceId];
                    entities[instanceId].type = entities[instanceId].types[entities[instanceId].types.length - 1];console.log(entities[instanceId].type);
                    entities[instanceId].id = instanceId;
                } else {
                    entities[instanceId][changedProp] = changedVal;
                    updateException('', instanceId, changedProp);
                }
            }
        }
        //app.$set(app, 'items', data.inventory.items);
    });
    
    socket.on('chatMsg', data => {
        app.messages = app.messages.concat([data]);
    });
    
    $(document)
        .ready(function(){
            
            $('#viewport').on('mousedown', function(e){console.log('click');
                let rect = canvas.getBoundingClientRect();
                socket.emit('click', {
                    x:  Math.max(e.clientX, e.clientX - canvasWidth / 2 + entities[clientId].x) - rect.left,
                    y:  Math.max(e.clientY, e.clientY - canvasHeight / 2 + entities[clientId].y) - rect.top
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
                let message = $('#chat-input').val();
                if (message.charAt(0) === '/'){
                    let inputs = message.substr(1).split(' ');
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
        
    $(window).on('resize', function(){
        resizeCanvas();
    });
    
    function updateException(objectType, instanceId, changedProp){
        let object = entities[instanceId];
        if (objectType === 'Player'){
            if (changedProp === 'x'){
                object.xCenter = object.x + object.width / 2;
            } else if (changedProp === 'y'){
                object.yCenter = object.y + object.height / 2;
            }
        }
    }
    
    function update(){
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        drawMap();
        drawEntities();
    }
    
    function drawMap(){
        let coors = getRelativeCoors([0, 0]);
        let left = coors[0];
        let top = coors[1];
        /*for (let x = 0; x < width; x += 480){
            for (let y = 0; y < height; y += 480){
                ctx.drawImage(background, left + x, top + y, 480, 480);
            }
        }*/
        /*map.forEach((row, y) => {
            row.forEach((tile, x) => {
                ctx.drawImage(spritesheet, (tile * (tileSize + 1)) % 968, tile * (tileSize + 1), tileSize, tileSize, left + x * tileSize, top + y * tileSize, tileSize, tileSize);
            });
        });*/
        /*map.layers.forEach(layer => {
            layer.tiles.forEach(tile => {
                
            });
        });*/
        console.log(sprites[currentMapName], currentMapName, sprites);
        ctx.drawImage(sprites[currentMapName], left, top);
    }
    
    function drawEntities(){
        Object.keys(entities)  
            .reduce((acc, id) => acc.concat(entities[id]), [])
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
                if (showHitboxes){
                    ctx.strokeStyle = 'rgb(' + Math.floor(Math.random()*256) + ',' + Math.floor(Math.random()*256) + ',' + Math.floor(Math.random()*256) + ')';
                    drawShape(entity.hitboxPoints.map(([x, y]) => getRelativeCoors([x, y])));
                }
            });
    }
    
    function getRelativeCoors(coors){
        return entities[clientId] ? [Math.min(coors[0], coors[0] - entities[clientId].x + canvasWidth / 2), Math.min(coors[1], coors[1] - entities[clientId].y + canvasHeight / 2)] : [0, 0];
    }
    
    function updatePosition(entity){
        entity.x += entity.hspeed / 2;
        entity.y += entity.vspeed / 2;
    }
    
    function drawShape(points, fill = false){
        ctx.beginPath();
        ctx.moveTo(points[0][0], points[0][1]);
        points.forEach(coors => {
            ctx.lineTo(coors[0], coors[1]);
        });
        ctx.closePath();
        if (fill){
            ctx.fill();
        } else {
            ctx.stroke();
        }
    }
    
    function resizeCanvas(){
        canvasWidth = window.innerWidth;
        canvasHeight = window.innerHeight;
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        setCanvasSettings();
    }
    
    function setCanvasSettings(){
        ctx.mozImageSmoothingEnabled = false;
        ctx.webkitImageSmoothingEnabled = false;
        ctx.msImageSmoothingEnabled = false;
        ctx.imageSmoothingEnabled = false;
        ctx.textAlign = 'center';
    }
    
})(io, jQuery, Vue);
