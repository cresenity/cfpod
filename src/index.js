const Pod = require('./Pod');

require('./helpers');

/*
 |--------------------------------------------------------------------------
 | Welcome to Laravel Pod!
 |--------------------------------------------------------------------------
 |
 | Laravel Pod provides a clean, fluent API for defining basic webpack
 | build steps for your Laravel application. Pod supports a variety
 | of common CSS and JavaScript pre-processors out of the box.
 |
 */

let pod = Pod.primary;

pod.boot();

module.exports = pod.api;
