'use strict';

/******/(function (modules) {
    /******/ // The module cache
    /******/var installedModules = {};
    /******/
    /******/ // The require function
    /******/function __webpack_require__(moduleId) {
        /******/
        /******/ // Check if module is in cache
        /******/if (installedModules[moduleId]) {
            /******/return installedModules[moduleId].exports;
            /******/
        }
        /******/ // Create a new module (and put it into the cache)
        /******/var module = installedModules[moduleId] = {
            /******/i: moduleId,
            /******/l: false,
            /******/exports: {}
            /******/
        };
        /******/
        /******/ // Execute the module function
        /******/modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
        /******/
        /******/ // Flag the module as loaded
        /******/module.l = true;
        /******/
        /******/ // Return the exports of the module
        /******/return module.exports;
        /******/
    }
    /******/
    /******/
    /******/ // expose the modules object (__webpack_modules__)
    /******/__webpack_require__.m = modules;
    /******/
    /******/ // expose the module cache
    /******/__webpack_require__.c = installedModules;
    /******/
    /******/ // identity function for calling harmony imports with the correct context
    /******/__webpack_require__.i = function (value) {
        return value;
    };
    /******/
    /******/ // define getter function for harmony exports
    /******/__webpack_require__.d = function (exports, name, getter) {
        /******/if (!__webpack_require__.o(exports, name)) {
            /******/Object.defineProperty(exports, name, {
                /******/configurable: false,
                /******/enumerable: true,
                /******/get: getter
                /******/
            });
            /******/
        }
        /******/
    };
    /******/
    /******/ // getDefaultExport function for compatibility with non-harmony modules
    /******/__webpack_require__.n = function (module) {
        /******/var getter = module && module.__esModule ?
        /******/function getDefault() {
            return module['default'];
        } :
        /******/function getModuleExports() {
            return module;
        };
        /******/__webpack_require__.d(getter, 'a', getter);
        /******/return getter;
        /******/
    };
    /******/
    /******/ // Object.prototype.hasOwnProperty.call
    /******/__webpack_require__.o = function (object, property) {
        return Object.prototype.hasOwnProperty.call(object, property);
    };
    /******/
    /******/ // __webpack_public_path__
    /******/__webpack_require__.p = "/dist/";
    /******/
    /******/ // Load entry module and return exports
    /******/return __webpack_require__(__webpack_require__.s = 0);
    /******/
})([
/* 0 */
/***/function (module, exports, __webpack_require__) {
    "use strict";

    var _slicedToArray = function () {
        function sliceIterator(arr, i) {
            var _arr = [];var _n = true;var _d = false;var _e = undefined;try {
                for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
                    _arr.push(_s.value);
                    if (i && _arr.length === i) break;
                }
            } catch (err) {
                _d = true;
                _e = err;
            } finally {
                try {
                    if (!_n && _i["return"]) _i["return"]();
                } finally {
                    if (_d) throw _e;
                }
            }return _arr;
        }return function (arr, i) {
            if (Array.isArray(arr)) {
                return arr;
            } else if (Symbol.iterator in Object(arr)) {
                return sliceIterator(arr, i);
            } else {
                throw new TypeError("Invalid attempt to destructure non-iterable instance");
            }
        };
    }();
    (function (io, $, Vue) {
        'use strict';

        var canvasWidth = 800;
        var canvasHeight = 600;
        var canvasCenter = {
            x: 400,
            y: 300
        };
        var camera = {
            x: 0,
            y: 0,
            hspeed: 0,
            vspeed: 0
        };
        var viewScale = 1;
        var viewZoom = 4;
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
        resizeCanvas();
        var textboxFocused = false;
        var entities = {};
        var clientId = '';
        var tileSize = 16;
        var fps = 60;
        var showHitboxes = false;
        var sprites = {};
        var currentMapName = '';
        var updateInterval = null;
        var mapDir = '../../img/maps';
        var commands = {
            help: function help() {
                app.messages.push({
                    type: 'info',
                    msg: 'Commands:\n/help - List all commands'
                });
            },
            debug: function debug(variable) {
                socket.emit('clientDebug', variable + ': ' + eval(variable));
            },
            hitboxes: function hitboxes() {
                var show = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : !showHitboxes;
                showHitboxes = show;
            }
        };
        var socket = io();
        socket.on('prep', function (data) {
            console.log('prep:', data);
            currentMapName = data.mapName;
            var spriteNames = Object.keys(data.sprites);
            var spritesRemaining = spriteNames.length;
            spriteNames.forEach(function (spriteName) {
                sprites[spriteName] = new Image();
                sprites[spriteName].src = data.sprites[spriteName];
                sprites[spriteName].onload = function () {
                    spritesRemaining--;
                    if (!spritesRemaining) {
                        sprites[data.mapName] = new Image();
                        sprites[data.mapName].src = mapDir + '/' + data.mapName + '.png'; //console.log(sprites[data.mapName].src);
                        sprites[data.mapName].onload = function () {
                            console.log(sprites[currentMapName]);
                            socket.emit('prepComplete');
                        };
                    }
                };
            });
            if (!spritesRemaining) {
                sprites[data.mapName] = new Image();
                sprites[data.mapName].src = mapDir + '/' + data.mapName + '.png'; //console.log(sprites[data.mapName].src);
                sprites[data.mapName].onload = function () {
                    console.log(sprites[currentMapName]);
                    socket.emit('prepComplete');
                };
            }
        });
        socket.on('init', function (data) {
            console.log(data);
            entities = data.entities;
            Object.keys(entities).forEach(function (id) {
                entities[id].id = id;
                entities[id].type = entities[id].types[entities[id].types.length - 1];
            });
            clientId = data.clientId;
            //currentMapName = data.mapName;
            updateInterval = setInterval(update, 1000 / fps);
        });
        socket.on('update', function (data) {
            //console.log(entities, clientId);//console.log(data);
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;
            try {
                for (var _iterator = data.removed[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var removed = _step.value;
                    delete entities[removed.id];
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }
            var instanceIds = Object.keys(data.entities);
            for (var j = 0; j < instanceIds.length; j++) {
                var instanceId = instanceIds[j];
                var changes = Object.keys(data.entities[instanceId]);
                for (var k = 0; k < changes.length; k++) {
                    var changedProp = changes[k];
                    var changedVal = data.entities[instanceId][changedProp];
                    if (!entities[instanceId]) {
                        entities[instanceId] = data.entities[instanceId];
                        entities[instanceId].type = entities[instanceId].types[entities[instanceId].types.length - 1];
                        console.log(entities[instanceId].type);
                        entities[instanceId].id = instanceId;
                    } else {
                        entities[instanceId][changedProp] = changedVal;
                        updateException('', instanceId, changedProp);
                    }
                }
            }
            //app.$set(app, 'items', data.inventory.items);
        });
        socket.on('chatMsg', function (data) {
            app.messages = app.messages.concat([data]);
        });
        $(document).ready(function () {
            $('#viewport').on('mousedown', function (e) {
                console.log('click');
                var rect = canvas.getBoundingClientRect();
                socket.emit('click', {
                    x: Math.max(e.clientX, e.clientX - canvasCenter.x + camera.x * viewScale) / viewScale - rect.left,
                    y: Math.max(e.clientY, e.clientY - canvasCenter.y + camera.y * viewScale) / viewScale - rect.top
                });
            });
            $('#game-cont').on('contextmenu', function (e) {
                e.preventDefault();
            });
            $('#show-chat-btn').on('click', showChat);
            $('#show-inventory-btn').on('click', showInventory);
            $('#chat-input, .login-input').on("focus", function () {
                textboxFocused = true;
            }).on("blur", function () {
                textboxFocused = false;
            });
            $('#chat-cont').on('click', function (e) {
                $('#chat-input').focus();
            });
            $('#chat-form').on('submit', function (e) {
                e.preventDefault();
                var message = $('#chat-input').val();
                if (message.charAt(0) === '/') {
                    var inputs = message.substr(1).split(' ');
                    if (commands[inputs[0]]) {
                        commands[inputs[0]].apply(null, inputs.slice(1));
                    } else {
                        socket.emit('chatMsg', { message: message.substr(0, 140) });
                    }
                } else {
                    socket.emit('chatMsg', { message: message.substr(0, 140) });
                }
                $('#chat-input').blur();
                $('#chat-input').val('');
                textboxFocused = false;
            });
        }).on('keydown', function (e) {
            if (!textboxFocused) {
                socket.emit('keyDown', {
                    key: e.keyCode
                });
                if ([rightKey, upKey, leftKey, downKey].indexOf(e.keyCode) !== -1) {
                    e.preventDefault();
                }
                if (e.keyCode === 84) {
                    $('#chat-input').focus();
                    e.preventDefault();
                }
                if (e.keyCode === 191) {
                    $('#chat-input').focus();
                }
            }
        }).on('keyup', function (e) {
            socket.emit('keyUp', {
                key: e.keyCode
            });
        });
        $(window).on('resize', function () {
            resizeCanvas();
        });
        function updateException(objectType, instanceId, changedProp) {
            var object = entities[instanceId];
            if (objectType === 'Player') {
                if (changedProp === 'x') {
                    object.xCenter = object.x + object.width / 2;
                } else if (changedProp === 'y') {
                    object.yCenter = object.y + object.height / 2;
                }
            }
        }
        function update() {
            clearCanvas();
            updateCamera();
            drawMap();
            drawEntities();
        }
        function drawMap() {
            var coors = getRelativeCoors([0, 0]);
            var left = coors[0];
            var top = coors[1];
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
            //dddconsole.log(sprites[currentMapName], currentMapName, sprites);
            var map = sprites[currentMapName];
            ctx.drawImage(map, left, top, map.width * viewScale, map.height * viewScale);
        }
        function drawEntities() {
            Object.keys(entities).reduce(function (acc, id) {
                return acc.concat(entities[id]);
            }, []).sort(function (a, b) {
                return a.y + a.height > b.y + b.height;
            }).forEach(function (entity) {
                var coors = getRelativeCoors([entity.x, entity.y]);
                var x = coors[0];
                var y = coors[1];
                switch (entity.type) {
                    case 'Player':
                        updatePosition(entity);
                        ctx.fillStyle = 'black';
                        ctx.fillText(entity.name, x + 8 * viewScale, y - 12 * viewScale);
                        ctx.strokeRect(x, y, 16 * viewScale, 16 * viewScale);
                        ctx.fillStyle = entity.color;
                        ctx.fillRect(x, y, 16 * viewScale, 16 * viewScale);
                        //if (id === clientId){
                        ctx.fillStyle = 'black';
                        ctx.fillRect(x - 4 * viewScale, y - 8 * viewScale, 24 * viewScale, 4 * viewScale);
                        ctx.fillStyle = 'red';
                        ctx.fillRect(x - 4 * viewScale, y - 8 * viewScale, 24 * viewScale * entity.hp / entity.maxHp, 4 * viewScale);
                        //}
                        break;
                    case 'Bullet':
                        updatePosition(entity);
                        ctx.strokeRect(x, y, 16 * viewScale, 16 * viewScale);
                        ctx.fillStyle = 'black';
                        ctx.fillRect(x, y, 16 * viewScale, 16 * viewScale);
                        break;
                    case 'Enemy':
                        updatePosition(entity);
                        ctx.strokeRect(x, y, 16 * viewScale, 16 * viewScale);
                        ctx.fillStyle = '#922';
                        ctx.fillRect(x, y, 16 * viewScale, 16 * viewScale);
                        ctx.fillStyle = 'black';
                        ctx.fillRect(x - 4 * viewScale, y - 8 * viewScale, 24 * viewScale, 4 * viewScale);
                        ctx.fillStyle = 'red';
                        ctx.fillRect(x - 4 * viewScale, y - 8 * viewScale, 24 * viewScale * entity.hp / entity.maxHp, 4 * viewScale);
                        ctx.fillStyle = 'black';
                        ctx.fillText(entity.name, x + 8 * viewScale, y - 12 * viewScale);
                        break;
                    case 'ItemDrop':
                        updatePosition(entity);
                        ctx.strokeRect(x, y, 16 * viewScale, 16 * viewScale);
                        ctx.fillStyle = 'pink';
                        ctx.fillRect(x, y, 16 * viewScale, 1 * viewScale);
                        break;
                    default:
                        console.warn('unrecognized type ' + entity.type);
                        break;
                }
                if (showHitboxes) {
                    ctx.strokeStyle = 'rgb(' + Math.floor(Math.random() * 256) + ',' + Math.floor(Math.random() * 256) + ',' + Math.floor(Math.random() * 256) + ')';
                    drawShape(entity.hitboxPoints.map(function (_ref) {
                        var _ref2 = _slicedToArray(_ref, 2),
                            x = _ref2[0],
                            y = _ref2[1];
                        return getRelativeCoors([x, y]);
                    }));
                }
            });
        }
        function getRelativeCoors(coors) {
            return entities[clientId] ? [viewScale * Math.min(coors[0], coors[0] - camera.x + canvasCenter.x / viewScale), viewScale * Math.min(coors[1], coors[1] - camera.y + canvasCenter.y / viewScale)] : [canvasCenter.x, canvasCenter.y];
        }
        function updatePosition(entity) {
            entity.x += entity.hspeed / 2;
            entity.y += entity.vspeed / 2;
        }
        function drawShape(points) {
            var fill = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
            ctx.beginPath();
            ctx.moveTo(points[0][0], points[0][1]);
            points.forEach(function (coors) {
                ctx.lineTo(coors[0], coors[1]);
            });
            ctx.closePath();
            if (fill) {
                ctx.fill();
            } else {
                ctx.stroke();
            }
        }
        function resizeCanvas() {
            var tempCanvas = document.createElement('canvas');
            tempCanvas.width = canvasWidth;
            tempCanvas.height = canvasHeight;
            var tempContext = tempCanvas.getContext("2d");
            tempContext.drawImage(ctx.canvas, 0, 0);
            canvasWidth = window.innerWidth;
            canvasHeight = window.innerHeight;
            canvas.width = canvasWidth;
            canvas.height = canvasHeight;
            canvasCenter.x = canvasWidth / 2;
            canvasCenter.y = canvasHeight / 2;
            viewScale = Math.max(1, Math.floor(Math.log2(Math.min(canvasWidth, canvasHeight)) / viewZoom));
            setCanvasSettings();
            ctx.drawImage(tempContext.canvas, 0, 0);
        }
        function setCanvasSettings() {
            ctx.mozImageSmoothingEnabled = false;
            ctx.webkitImageSmoothingEnabled = false;
            ctx.msImageSmoothingEnabled = false;
            ctx.imageSmoothingEnabled = false;
            ctx.textAlign = 'center';
        }
        function clearCanvas() {
            //ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        }
        function updateCamera() {
            camera.x = Math.max(canvasCenter.x / viewScale, entities[clientId].x);
            camera.y = Math.max(canvasCenter.y / viewScale, entities[clientId].y);
            //console.log('Camera:  ' + camera.x + ', ' + camera.y);
            //console.log('Player:  ' + entities[clientId].x + ', ' + entities[clientId].y + '  ==>  ' + getRelativeCoors([entities[clientId].x, entities[clientId].y], true));
        }
        function showChat() {
            $('#chat-cont').toggleClass('showing');
        }
        function showInventory() {
            //$('#inventory-cont').toggleClass('showing');
        }
    })(io, jQuery, Vue);
    /***/
}]);