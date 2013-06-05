/**
 * @fileOverview This is an example of how to extend the EnvironmentBase class
 */
define([
    'game/environments/EnvironmentBase',
    'game/Input',
    'game/game-objects/Sword',
    'three',
    'physijs'
], function (
    EnvironmentBase,
    Input,
    Sword
) {
    "use strict";

    var TestWorld = function () {
        EnvironmentBase.call(this);

        /**
         * The ball that the user rolls around
         * @type {Sword}
         */
        this.sword = null;

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
        this.sword = new Sword();
        this.sword.mesh.position.y = 100;
        this.add(this.sword);
    };

    TestWorld.prototype.update = function () {
        this.updateCameraPosition();
    };

    TestWorld.prototype.updateCameraPosition = function () {
    };


    return TestWorld;
});