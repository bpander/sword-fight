define([
    'lib/Util',
    'socket.io'
], function (
    Util
) {
    'use strict';

    var Controller = {

        acceleration: {
            x: 0,
            y: 0,
            z: 0
        },

        rotation: {
            alpha: 0,
            beta: 0,
            gamma: 0
        },

        /**
         * The socket along which we send the device's orientation data
         * @type {Socket.IO}
         */
        socket: null

    };

    var _events = {

        onDeviceMotion: function (e) {
            this.acceleration = e.acceleration;
        },

        onDeviceOrientation: function (e) {
            this.rotation.alpha = e.alpha;
            this.rotation.beta = e.beta;
            this.rotation.gamma = e.gamma;
        },

        onSocketConnect: function () {
            this.socket.emit('deviceready');
            setInterval(function () {
                this.socket.emit('deviceorientation', {
                    rotation: this.rotation
                });
            }.bind(this), 100);
        }

    };

    Controller.init = function () {
        this.socket = io.connect('//10.20.2.143');
        _events = Util.bindAll(_events, this);
        this.bindEvents();
    };

    Controller.bindEvents = function () {
        window.addEventListener('devicemotion', _events.onDeviceMotion);
        window.addEventListener('deviceorientation', _events.onDeviceOrientation);
        this.socket.on('connect', _events.onSocketConnect);
    };

    return Controller;
});