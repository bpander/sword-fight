/**
 * @fileOverview This is an example of how to extend the EnvironmentBase class
 */
define([
    'game/environments/EnvironmentBase',
    'game/Input',
    'game/game-objects/Ball',
    'game/game-objects/Box',
    'game/game-objects/Arena',
    'three',
    'physijs'
], function (
    EnvironmentBase,
    Input,
    Ball,
    Box,
    Arena
) {
    "use strict";

    var TestWorld = function () {
        EnvironmentBase.call(this);

        /**
         * The ball that the user rolls around
         * @type {Ball}
         */
        this.ball = null;

        /**
         * The arena that holds the ball
         * @type {Arena}
         */
        this.arena = null;

        /**
         * This is where we keep track of the true rotation of the camera (in radians)
         * @type {Number}
         */
        this.relativeRotation = 0;
    };
    TestWorld.prototype = new EnvironmentBase();
    TestWorld.prototype.constructor = TestWorld;

    TestWorld.prototype.ready = function () {
        this.game.camera.position.set(0, 100, 200);

        // Create lights
        var ambientLight = new THREE.AmbientLight(0xAAAAAA);
        this.game.scene.add(ambientLight);

        var directionalLight = new THREE.DirectionalLight(0xFFFFFF, 0.5);
        directionalLight.position.y = 200;
        directionalLight.castShadow = true;
        directionalLight.shadowMapWidth = 2048;
        directionalLight.shadowMapHeight = 2048;
        this.game.scene.add(directionalLight);

        // Create objects
        this.ball = new Ball();
        this.ball.mesh.position.y = 200;
        this.add(this.ball);

        this.box = new Box();
        this.box.mesh.position.set(0, 0, 0);
        this.box.mesh.rotation.set(0.174, 0.174, 0.174);
        this.add(this.box);

        this.arena = new Arena();
        this.add(this.arena);
    };

    TestWorld.prototype.update = function () {
        this.updateCameraPosition();
    };

    TestWorld.prototype.updateCameraPosition = function () {
        var camera = this.game.camera;

        // Figure out where to place the camera (transcribing a cylinder around the ball) based on the mouse's movement
        var deltaRotation = Input.mouse.movementX * 0.01;
        this.relativeRotation = this.relativeRotation - deltaRotation;
        camera.position.x = Math.sin(this.relativeRotation) * 200 + this.ball.mesh.position.x;
        camera.position.y = camera.position.y + Input.mouse.movementY;
        camera.position.z = Math.cos(this.relativeRotation) * 200 + this.ball.mesh.position.z;

        // Finally, tell the camera to focus on the ball
        camera.lookAt(this.ball.mesh.position);
    };


    return TestWorld;
});