/**
 * @module curryx
 */

'use strict';

const ARITY_NONE = undefined;
const CHAR_HASH = '#';
const CURRY_ERROR = 'CurryError';
const KEY_NONE = undefined;
const TYPE_FUNCTION = 'function';
const TYPE_NUMBER = 'number';
const TYPE_OBJECT = 'object';

const ERR_BAD_ARITY = `The arity has type %s. Expected a number.`;
const ERR_BAD_FUNCTION = `The path '%s' resolved to a type %s. Expected a function.`;

const format = require('util').format;

module.exports = curryx;

function curryx(arity, func) {

    if( arguments.length === 1 ) [arity, func] = [ARITY_NONE, arity];

    if( typeof func !== TYPE_FUNCTION ) func = importfunction(func);

    arity = (arity === ARITY_NONE) ? func.length
          : (typeof arity === TYPE_NUMBER) ? arity
          : fail(ERR_BAD_ARITY, gettype(arity));

    return initiatecurry(arity, func, []);
}

curryx.binary = function binary(func) { return curryx(2, func) };
curryx.ternary = function ternary(func) { return curryx(3, func) };
curryx.quaternary = function quaternary(func) { return curryx(4, func) };

function initiatecurry(arity, func, curriedargs=[], ...args) {

    if(curriedargs.length + args.length >= arity) return func.call(this, ...curriedargs, ...args);

    const funcname = (args.length === 0) ? func.name : `partial ${func.name || FUNCTION_ANONYMOUS}`;

    return {
        [funcname] : function(...additionalargs) {
            return initiatecurry.call(this, arity, func, [...curriedargs, ...args], ...additionalargs);
        }
    }[funcname]
}

function importfunction(path) {

    const [module, key] = String(path).split(CHAR_HASH);
    const func = (key === KEY_NONE) ? require(module) : require(module)?.[key];

    if( typeof func !== TYPE_FUNCTION ) fail(ERR_BAD_FUNCTION, path, gettype(func) );

    return func;
}

function fail(formatmsg, ...formatargs) {

    const errormessage = format(formatmsg, ...formatargs);
    const error = new Error(errormessage);

    error.name = CURRY_ERROR;

    throw error;
}

function gettype(value) {

    const type = typeof value;

    // return the value's class name if value has type object
    return (type === TYPE_OBJECT) ? Object.prototype.toString.call(value).slice(8,-1) : type;
}
