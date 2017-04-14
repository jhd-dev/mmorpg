var express = require('express');
var http = require('http');
var routes = require('./server/routes/router');
var events = require('./server/sockets/events');

var port = 8080;

var app = express();
app.use('/', express.static(__dirname + '/client'));
app.use('/shared', express.static(__dirname + '/shared'));
routes(app);

var server = http.Server(app);
server.listen(port, function(){
    console.log('Listening on port ' + port);
});

var io = require('socket.io')(server, {});
events(io);
