var socketIO = require('socket.io');

var SocketController = function (server) {

    this.screenSockets = [];

    this.deviceSockets = [];

    this.io = null;

    this._events = {};

    this.init(server);
};

var _events = {

    onSocketConnection: function (socket) {
        socket.on('screenready', _events.onScreenReady.bind(this, socket));
        socket.on('deviceready', _events.onDeviceReady.bind(this, socket));
    },

    onScreenReady: function (socket) {
        var data = { id: socket.id };
        this.screenSockets.push(socket);
        this.screenSockets.forEach(function (socket) {
            socket.emit('newplayer', data);
        });
    },

    onDeviceReady: function (socket) {
        this.deviceSockets.push(socket);
        socket.on('deviceorientation', this._events.onDeviceOrientation);
    },

    onDeviceOrientation: function (data) {
        this.screenSockets.forEach(function (socket) {
            socket.emit('deviceorientation', data);
        });
    }

};

SocketController.prototype.init = function (server) {
    this.io = socketIO.listen(server);
    this.io.set('log level', 1);

    this.bindScope();
    this.bindEvents();
};

SocketController.prototype.bindScope = function () {
    this._events.onSocketConnection = _events.onSocketConnection.bind(this);
    this._events.onDeviceOrientation = _events.onDeviceOrientation.bind(this);
};

SocketController.prototype.bindEvents = function () {
    this.io.sockets.on('connection', this._events.onSocketConnection);
};

module.exports = SocketController;