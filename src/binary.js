/**
 * @module curryx2
 */

'use strict';

const curryx = require('./index');

/**
 * Convenience function that passes its argument to {@link module:curryx curryx()} with an arity of 2.
 * 
 * @function curryx2
 * @see {@link module:ternary}
 * @param {(function|string)} func The function to curry or a package/module name that resolves to the function to curry
 * @returns {function}
 */
module.exports = function curryx2(func) {
    return curryx(2, func);
}