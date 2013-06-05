define([
    'lib/Util',
    'game/Input',
    'three',
    'physijs'
], function (
    Util,
    Input
) {
    "use strict";

    Physijs.scripts.worker = 'scripts/lib-thirdparty/physijs_worker.js';

    var Game = {

        /**
         * THREEjs WebGL renderer
         * @type {THREE.WebGLRenderer}
         */
        renderer: null,

        /**
         * THREEjs camera object
         * @type {THREE.PerspectiveCamera}
         */
        camera: null,

        /**
         * Physijs scene
         * @type {Physjs.Scene}
         */
        scene: null,

        /**
         * The environment that we'll play the game in. Will be an instance of a class that extends EnvironmentBase.
         * @type {EnvironmentBase}
         */
        environment: null,

        /**
         * The socket over which we send game data
         * @type {Socket.IO}
         */
        socket: null
    };
    window.Game = Game;

    var _events = {

        onResize: function () {
            this.setAspectRatio();
        },

        onEnvironmentLoaded: function () {
            this.animate();
        },

        onClick: function (e) {
            Util.requestPointerLock(e.currentTarget);
        },

        onSocketConnect: function () {
            this.socket.emit('screenready');
            this.socket.on('deviceorientation', _events.onDeviceOrientation);
        },

        onDeviceOrientation: function (data) {
            var mesh = this.environment.sword.mesh;
            mesh.rotation.y = THREE.Math.degToRad(data.rotation.alpha);
            mesh.rotation.x = THREE.Math.degToRad(data.rotation.beta);
            mesh.rotation.z = THREE.Math.degToRad(data.rotation.gamma * -1);
            mesh.__dirtyRotation  = true;
        }
    };

    var _options = {

        enablePointerLock: true

    };


    /**
     * Initialize the game framework
     * @param  {Object}  params
     * @param  {Boolean} params.enablePointerLock
     * @return {Game}
     */
    Game.init = function (params) {

        this.socket = io.connect('//localhost');

        Util.extend(_options, params);

        // Create the renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.shadowMapEnabled = true;
        this.renderer.shadowMapSoft = true;

        // Append the renderer's dom element and request pointer lock
        document.body.appendChild(this.renderer.domElement);
        if (_options.requestPointerLock === true) {
            Util.requestPointerLock(this.renderer.domElement);
        }

        // Set up the camera and scene
        this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 10000);
        this.setAspectRatio();

        this.scene = new Physijs.Scene();
        this.scene.setGravity(new THREE.Vector3( 0, 0, 0 ));
        this.scene.add(this.camera);

        // Get the ball rolling...
        Input.init();
        this.bindScope();
        this.bindEvents();

        return this;
    };

    /**
     * The animation loop
     */
    Game.animate = function () {
        this.render();
        requestAnimationFrame(this.animate);
    };

    /**
     * Run the physics simulation, update the environment, update the input object and render the scene
     */
    Game.render = function () {
        this.scene.simulate();
        this.environment.updateObjects();
        this.environment.update();
        Input.update();
        this.renderer.render(this.scene, this.camera);
    };

    /**
     * Binds the `this` argument for any function that needs it
     * @return {Game}
     */
    Game.bindScope = function () {
        _events = Util.bindAll(_events, this);
        this.animate = this.animate.bind(this);
        return this;
    };

    /**
     * Binds any event handlers
     * @return {Game}
     */
    Game.bindEvents = function () {
        window.addEventListener('resize', _events.onResize, false);
        if (_options.requestPointerLock === true) {
            this.renderer.domElement.addEventListener('click', _events.onClick);
        }
        this.socket.on('connect', _events.onSocketConnect);
        return this;
    };

    /**
     * Update the aspect ratio for THREEjs
     * @return {Game}
     */
    Game.setAspectRatio = function () {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize( window.innerWidth, window.innerHeight );
        return this;
    };

    /**
     * Loads an environment and runs it when it's finished
     * @param  {EnvironmentBase} environment  An instance of a class that is extended from EnvironmentBase that we want to run
     * @return {Game}
     */
    Game.loadEnvironment = function (environment) {
        this.environment = environment;
        this.environment.game = this;

        this.environment.load(_events.onEnvironmentLoaded);
        return this;
    };


    return Game;
});