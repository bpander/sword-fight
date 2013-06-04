define([
    'game/game-objects/GameObjectBase',
    'game/Input',
    'lib/Util',
    'three',
    'physijs'
], function (
    GameObject,
    Input,
    Util
) {
    "use strict";

    var Ball = function () {
        GameObject.call(this);

        this.radius = 50;

        this.segments = 32;

        this.rings = 32;

        this.force = 100;

        this.geometry = new THREE.SphereGeometry(this.radius, this.segments, this.rings);
        this.material = Physijs.createMaterial(
            new THREE.MeshLambertMaterial({
                map: new THREE.ImageUtils.loadTexture('assets/images/Planet_2_d.png')
            }),
            1.6, // medium friction
            0.9 // low restitution
        );
        this.mesh = new Physijs.SphereMesh(
            this.geometry,
            this.material,
            50.0
        );

        this.init();
    };
    Ball.prototype = new GameObject();
    Ball.prototype.constructor = Ball;

    var _topOfBall = null;

    Ball.prototype.init = function () {
        _topOfBall = new THREE.Vector3(0, this.radius, 0);
        this.mesh.position.y = this.radius + 50;
        this.mesh.castShadow = true;
    };

    Ball.prototype.update = function () {
        var isMovingForward = Input.isKeyDown(Input.KEYS.W);
        var isMovingLeft = Input.isKeyDown(Input.KEYS.A);
        var isMovingBackward = Input.isKeyDown(Input.KEYS.S);
        var isMovingRight = Input.isKeyDown(Input.KEYS.D);
        var relativeRotation = this.environment.relativeRotation;
        var forceX;
        var forceZ;

        if (isMovingForward || isMovingBackward) {
            var relativeRotation = relativeRotation;
            forceX = Math.sin(relativeRotation) * this.force;
            forceZ = Math.cos(relativeRotation) * this.force;
            if (isMovingForward) {
                this.mesh.applyImpulse({ x: -forceX, y: 0, z: -forceZ }, _topOfBall);
            }
            if (isMovingBackward) {
                this.mesh.applyImpulse({ x: forceX, y: 0, z: forceZ }, _topOfBall);
            }
        }
        if (isMovingLeft || isMovingRight) {
            var perpendicularRotation = relativeRotation + THREE.Math.degToRad(90);
            forceX = Math.sin(perpendicularRotation) * this.force;
            forceZ = Math.cos(perpendicularRotation) * this.force;
            if (isMovingLeft) {
                this.mesh.applyImpulse({ x: -forceX, y: 0, z: -forceZ }, _topOfBall);
            }
            if (isMovingRight) {
                this.mesh.applyImpulse({ x: forceX, y: 0, z: forceZ }, _topOfBall);
            }
        }
    };

    Ball.prototype.destroy = function () {
        document.removeEventListener('keydown', _private.onKeyDown);
        document.removeEventListener('keyup', _private.onKeyUp);
    };

    Ball.prototype.bindEvents = function () {
        document.addEventListener('keydown', _private.onKeyDown, false);
        document.addEventListener('keyup', _private.onKeyUp, false);
    };


    return Ball;
});