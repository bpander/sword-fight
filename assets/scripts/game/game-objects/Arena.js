define([
    'game/game-objects/GameObjectBase'
], function (
    GameObjectBase
) {
    "use strict";

    var Arena = function () {
        GameObjectBase.call(this);

        this.width = 1000;

        this.depth = this.width;

        this.geometry = new THREE.CubeGeometry(this.width, 1, this.depth);

        this.material = Physijs.createMaterial(
            new THREE.MeshLambertMaterial({ color: 0x0000FF }),
            2.9, // friction
            0.5  // restitution
        );

        this.mesh = new Physijs.BoxMesh(this.geometry, this.material, 0);
        this.mesh.receiveShadow = true;

        this.createWalls();
    };
    Arena.prototype = new GameObjectBase();
    Arena.prototype.constructor = Arena;

    Arena.prototype.createWalls = function () {
        var halfWidth = this.width / 2;
        var wallGeometry = new THREE.CubeGeometry(this.width, 50, 10);
        var wallMaterial = new Physijs.createMaterial(
            new THREE.MeshLambertMaterial({ color: 0x00FF00 }),
            1.9,
            0.5
        );

        this.walls = [
            {
                mesh: new Physijs.BoxMesh(wallGeometry, wallMaterial, 0),
                rotation: new THREE.Vector3(0, THREE.Math.degToRad(90), 0),
                position: new THREE.Vector3(-halfWidth, 45, 0)
            },
            {
                mesh: new Physijs.BoxMesh(wallGeometry, wallMaterial, 0),
                rotation: new THREE.Vector3(0, THREE.Math.degToRad(90), 0),
                position: new THREE.Vector3(halfWidth, 45, 0)
            },
            {
                mesh: new Physijs.BoxMesh(wallGeometry, wallMaterial, 0),
                rotation: new THREE.Vector3(0, 0, 0),
                position: new THREE.Vector3(0, 45, -halfWidth)
            },
            {
                mesh: new Physijs.BoxMesh(wallGeometry, wallMaterial, 0),
                rotation: new THREE.Vector3(0, 0, 0),
                position: new THREE.Vector3(0, 45, halfWidth)
            }
        ];

        this.walls.forEach(function (wall) {
            wall.mesh.position = wall.position;
            wall.mesh.rotation = wall.rotation;
            this.mesh.add(wall.mesh);
        }, this);

    };

    /**
     * Overwrite update function
     */
    Arena.prototype.update = function () {

    };


    return Arena;
});