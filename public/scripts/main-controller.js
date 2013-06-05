require([
    'lib-thirdparty/ready', // Because there's no sense loading jQuery if all we use it for is the 'onready' callback
    'controller/Controller'
], function (
    ready,
    Controller
) {
    "use strict";


    ready(function () {

        Controller.init();

        var table = {};
        table.rotation = {};
        table.rotation.alpha = document.getElementById('rotation_alpha');
        table.rotation.beta = document.getElementById('rotation_beta');
        table.rotation.gamma = document.getElementById('rotation_gamma');
        table.acceleration = {};
        table.acceleration.x = document.getElementById('acceleration_x');
        table.acceleration.y = document.getElementById('acceleration_y');
        table.acceleration.z = document.getElementById('acceleration_z');

        setInterval(function () {
            table.rotation.alpha.innerHTML = Controller.rotation.alpha;
            table.rotation.beta.innerHTML = Controller.rotation.beta;
            table.rotation.gamma.innerHTML = Controller.rotation.gamma;

            table.acceleration.x.innerHTML = Controller.acceleration.x;
            table.acceleration.y.innerHTML = Controller.acceleration.y;
            table.acceleration.z.innerHTML = Controller.acceleration.z;
        }, 500);

    });

});