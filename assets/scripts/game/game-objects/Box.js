define([
    'game/game-objects/GameObjectBase',
    'lib/Util'
], function (
    GameObjectBase,
    Util
) {
    "use strict";

    /**
     * An example of an object that extends GameObjectBase. Basically just a cube.
     * @extends {GameObjectBase}
     */
    var Box = function () {
        GameObjectBase.call(this);

        /////////////////////////////////////////
        // Put object-specific properties here //
        /////////////////////////////////////////
        
        this.width = 20;

        this.height = 20;

        this.depth = 20;


        ////////////////////////////////////
        // Put base class properties here //
        ////////////////////////////////////

        this.geometry = new THREE.CubeGeometry(this.width, this.height, this.depth);

        var friction = 1.9;
        var restitution = 0.2;
        this.material = Physijs.createMaterial(
            new THREE.MeshPhongMaterial({ color: 0xFF0000 }),
            friction,
            restitution
        );

        this.mesh = new Physijs.BoxMesh(this.geometry, this.material, 10);
        this.mesh.castShadow = true;

        Util.bindAll(_events, this);
        this.mesh.addEventListener('collision', _events.onCollision);
    };
    Box.prototype = new GameObjectBase();
    Box.prototype.constructor = Box;

    var _events = {

        onCollision: function (collidedWith, linearVelocity, angularVelocity) {
            var ballMesh = this.environment.ball.mesh;
            if (collidedWith === ballMesh) {
                this.mesh.removeEventListener('collision', _events.onCollision);
                var constraint = new Physijs.DOFConstraint(
                    ballMesh,
                    this.mesh,
                    new THREE.Vector3(ballMesh.geometry.radius, ballMesh.geometry.radius, ballMesh.geometry.radius)
                );
                this.environment.game.scene.addConstraint(constraint);
            }
        }
    };

    /**
     * Overwrite update function. This is an intentional no-op.
     */
    Box.prototype.update = Util.noop;


    return Box;
});