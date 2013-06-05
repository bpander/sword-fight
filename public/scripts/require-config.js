var require = {

    paths: {
        'three': 'lib-thirdparty/three.min-physijs',
        'physijs': 'lib-thirdparty/physi',
        'socket.io': 'lib-thirdparty/socket.io-client/socket.io',
        'tweenjs': 'lib-thirdparty/tween.min'
    },

    shim: {
        'physijs': ['three']
    }

};