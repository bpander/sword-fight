define([
], function (
) {
    "use strict";

    var Util = {};

    Util.bindAll = function (methodObject, thisArg) {
        var boundMethods = {};
        var methodName;
        for (methodName in methodObject) {
            if (methodObject[methodName] instanceof Function) {
                boundMethods[methodName] = methodObject[methodName].bind(thisArg);
            }
        }
        return boundMethods;
    };

    Util.noop = function () {};

    Util.requestPointerLock = function(elem) {
        elem.requestPointerLock = elem.requestPointerLock || elem.mozRequestPointerLock || elem.webkitRequestPointerLock || Util.noop;
        elem.requestPointerLock();
    };

    /**
     * This is basically just ripped out of jQuery.extend
     * @see http://api.jquery.com/jQuery.extend/
     * @return {Object}
     */
    Util.extend = function () {
        var src, copyIsArray, copy, name, options, clone,
            target = arguments[0] || {},
            i = 1,
            length = arguments.length,
            deep = false;

        // Handle a deep copy situation
        if ( typeof target === "boolean" ) {
            deep = target;
            target = arguments[1] || {};
            // skip the boolean and the target
            i = 2;
        }

        // Handle case when target is a string or something (possible in deep copy)
        if ( typeof target !== "object" && target instanceof Function === false ) {
            target = {};
        }

        // extend jQuery itself if only one argument is passed
        if ( length === i ) {
            // target = this;
            // --i;
            throw new Error('You must specify an object with which to extend');
        }

        for ( ; i < length; i++ ) {
            // Only deal with non-null/undefined values
            if ( (options = arguments[ i ]) != null ) {
                // Extend the base object
                for ( name in options ) {
                    src = target[ name ];
                    copy = options[ name ];

                    // Prevent never-ending loop
                    if ( target === copy ) {
                        continue;
                    }

                    // Recurse if we're merging plain objects or arrays
                    if ( deep && copy && ( this.isPlainObject(copy) || (copyIsArray = Array.isArray(copy)) ) ) {
                        if ( copyIsArray ) {
                            copyIsArray = false;
                            clone = src && Array.isArray(src) ? src : [];

                        } else {
                            clone = src && this.isPlainObject(src) ? src : {};
                        }

                        // Never move original objects, clone them
                        target[ name ] = this.extend( deep, clone, copy );

                    // Don't bring in undefined values
                    } else if ( copy !== undefined ) {
                        target[ name ] = copy;
                    }
                }
            }
        }

        // Return the modified object
        return target;
    };

    Util.isPlainObject = function (obj) {
        var key;
        var isPlainObject = true;
        if (JSON.stringify(obj) !== '{}') {
            return isPlainObject = false;
        }
        for (key in obj) {
            isPlainObject = false;
            break;
        }
        return isPlainObject;
    };


    return Util;
});