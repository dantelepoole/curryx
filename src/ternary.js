/**
 * @module curry3
 */

'use strict';

const curry = require('./index');

/**
 * Convenience function that passes its argument to {@link module:curry curry()} with an arity of 3.
 * 
 * @function curry3
 * @see {@link module:binary}
 * @param {(function|string)} func The function to curry or a package/module name that resolves to the function to curry
 * @returns {function}
 */
module.exports = function curry3(func) {
    return curry(3, func);
}