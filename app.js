var express = require('express');
var app = express();
var server = require('http').createServer(app);
var path = require('path');
var io = require('socket.io').listen(server);

// Middleware
app.set('port', process.env.TEST_PORT || 80);
app.use(express.favicon());
// app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', function (req, res) {
    res.sendfile(__dirname + '/public/index.html');
});

app.get('/sword', function (req, res) {
    res.sendfile(__dirname + '/public/sword.html');
});

// Sockets
var screenSockets = [];
var deviceSockets = [];
io.set('log level', 1);
io.sockets.on('connection', function (socket) {

    socket.on('screenready', function () {
        screenSockets.push(socket);
    });

    socket.on('deviceready', function () {
        deviceSockets.push(socket);
        socket.on('deviceorientation', function (data) {
            screenSockets.forEach(function (socket) {
                socket.emit('deviceorientation', data);
            });
        });
    });

});

server.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});