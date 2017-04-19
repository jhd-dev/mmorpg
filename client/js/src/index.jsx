(function(React, ReactDOM, io, $){
    'use strict';
    
    var width = 800;
    var height = 600;
    
    var rightKey = 68;
    var upKey = 87;
    var leftKey = 65;
    var downKey = 83;
    
    var entities = {
        players: [],
        bullets: []
    };
    var clientId = '';
    var textboxFocused = false;
    
    var background = new Image();
    background.src = '../img/grass.png';
    
    var socket = io();
    
    function drawMap(ctx){
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
    
    class App extends React.Component {
        
        constructor(props){
            super(props);
            
            this.state = {
                loaded: false
            };
            
            this.update = this.update.bind(this);
            
            socket.on('init', (data) => {
                entities = data.entities;
                clientId = data.clientId;
                setInterval(this.update, 20);
            });
            
            socket.on('update', (data) => {
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
            
        }
        
        componentDidMount(){
            var canvas = document.getElementById('viewport');
            var ctx = canvas.getContext('2d');
            ctx.textAlign = 'center';
            this.setState({ ctx });
            
            var gameCont = document.getElementById('game');
            var chatInput = document.getElementById('chat-input');
            
            var textboxes = [chatInput];
            for (var i = 0; i < textboxes.length; i ++){
                textboxes[i].onfocus = function(){
                    textboxFocused = true;
                };
                textboxes[i].onblur = function(){
                    textboxFocused = false;
                };
            }
            
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
            
            this.setState({
                loaded: true
            });
            
        }
        
        update(){
            if (this.state.loaded){
                var ctx = this.state.ctx;
                ctx.clearRect(0, 0, width, height);
                drawMap(ctx);
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
        }
        
        render(){
            return <div id="wrapper">
                <div id="col-main">
                    <h1 id="head-main">Fun Game Thing</h1>
                    <div id="game">
                        <Chat />
                        <canvas id="viewport" width="800" height="600"></canvas>
                    </div>
                </div>
                <div id="sidebar">
                    <h2 id="login-head">Login:</h2>
                    <form id="login-form">
                        <span className="login-label">Username:</span>
                        <input className="login-input" type="text" name="username" />
                        <br />
                        <span className="login-label">Password:</span>
                        <input className="login-input" type="password" name="password" />
                        <br />
                        <input className="login-submit" type="submit" value="Login" />
                    </form>
                    <h2 id="login-head">Sign up:</h2>
                    <form id="signup-form" action="/signup" method="POST">
                        <span className="login-label">Username:</span>
                        <input className="login-input" type="text" name="username" />
                        <br />
                        <span className="login-label">Password:</span>
                        <input className="login-input" type="password" name="password" />
                        <br />
                        <input className="login-submit" type="submit" value="Sign Up" />
                    </form>
                </div>
            </div>;
        }
        
    }
    
    class Chat extends React.Component {
        
        constructor(props){
            super(props);
            
            this.state = {
                messages: []
            };
            
            this.sendMessage = this.sendMessage.bind(this);
            
            this.commands = {
                help: () => {
                    this.setState({
                        messages: this.state.messages.concat({
                            type: 'info',
                            message: 'Commands: /help - List available commands'
                        })
                    });
                },
                debug: function(variable){
                    socket.emit('clientDebug', variable + ': ' + eval(variable));
                }
            };
            
            socket.on('chatMsg', (data) => {
                this.setState({
                    messages: this.state.messages.concat(data)
                });
            });
        }
        
        componentDidMount(){
            var chatCont = document.getElementById('chat-cont');
            var chatForm = document.getElementById('chat-form');
            var chatInput = document.getElementById('chat-input');
            
            chatCont.onclick = (e) => {
                chatInput.focus();
            };
            
            chatForm.onsubmit = (e) => {
                
            };
        }
        
        sendMessage(e){
            var $chatInput = $('#chat-input');
            var message = $chatInput.value;
            if (message.charAt(0) === '/'){
                var inputs = message.substr(1).split(' ');
                if (this.commands[inputs[0]]){
                    this.commands[inputs[0]].apply(null, inputs.slice(1));
                } else {
                    socket.emit('chatMsg', message.substr(0, 140));
                }
            } else {
                socket.emit('chatMsg', message.substr(0, 140));
            }
            $chatInput.blur();
            $chatInput.value('');
            textboxFocused = false;
            e.preventDefault();
            return false;
        }
        
        render(){
            return <div id="chat-cont">
                <div id="chat">
                    <div id="chat-message-cont">
                        <div className="chat-message">Welcome!</div>
                        {this.state.messages.map(message => {
                            if (message.type === 'normal'){
                                return <div className="chat-message">{message.name}: {message.msg}</div>;
                            } else if (message.type === 'private'){
                                return <div className="chat-message chat-message-private">{message.name} to {message.recipient}: {message.msg}</div>;
                            } else if (message.type === 'info'){
                                return <div className="chat-message chat-message-info">{message.msg}</div>;
                            }
                        })}
                    </div>
                    <form id="chat-form" onSubmit={this.sendMessage} autoComplete="off">
                        &gt; <input id="chat-input" type="text" name="message" placeholder="Press 'T' to chat" /><input id="chat-submit" type="submit" value="Send" />
                    </form>
                </div>
            </div>;
        }
        
    }
    
    ReactDOM.render(<App />, document.getElementById('root'));
    
})(React, ReactDOM, io, $);
