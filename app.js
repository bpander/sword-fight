var express = require('express');
var app = express();
var server = require('http').createServer(app);
var path = require('path');
var SocketController = require('./controllers/SocketController.js');

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

var socketController = new SocketController(server);

server.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});