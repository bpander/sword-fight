define([
    'lib/Util'
], function (
    Util
) {
    'use strict';

    var Controller = {};

    var _events = {

        onDeviceMotion: function (e) {
            this.acceleration = e.acceleration;
        },

        onDeviceOrientation: function (e) {
            this.rotation.alpha = e.alpha;
            this.rotation.beta = e.beta;
            this.rotation.gamma = e.gamma;
        }
    };

    Controller.acceleration = {
        x: 0,
        y: 0,
        z: 0
    };

    Controller.rotation = {
        alpha: 0,
        beta: 0,
        gamma: 0
    };

    Controller.init = function () {
        _events = Util.bindAll(_events, this);
        this.bindEvents();
    };

    Controller.bindEvents = function () {
        window.addEventListener('devicemotion', _events.onDeviceMotion);
        window.addEventListener('deviceorientation', _events.onDeviceOrientation);
    };

    return Controller;
});