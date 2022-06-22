/**
 * @module curryx4
 */

'use strict';

const curryx = require('./index');

/**
 * Convenience function that passes its argument to {@link module:curryx curryx()} with an arity of 4.
 * 
 * @function curryx4
 * @see {@link module:binary}
 * @param {(function|string)} func The function to curry or a package/module name that resolves to the function to curry
 * @returns {function}
 */
module.exports = function curryx4(func) {
    return curryx(4, func);
}