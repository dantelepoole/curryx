/**
 * @module curry2
 */

'use strict';

const curry = require('./index');

/**
 * Convenience function that passes its argument to {@link module:curry curry()} with an arity of 2.
 * 
 * @function curry2
 * @see {@link module:ternary}
 * @param {(function|string)} func The function to curry or a package/module name that resolves to the function to curry
 * @returns {function}
 */
module.exports = function curry2(func) {
    return curry(2, func);
}