/**
 * @module curryx
 */

'use strict';

const ARITY_NONE = undefined;
const CHAR_HASH = '#';
const CURRY_ERROR = 'CurryError';
const FUNCTION_ANONYMOUS = '<anonymous>';
const KEY_NONE = undefined;
const TYPE_FUNCTION = 'function';
const TYPE_NUMBER = 'number';
const TYPE_OBJECT = 'object';

const ERR_BAD_ARITY = `The arity has type %s. Expected a number.`;
const ERR_BAD_FUNCTION = `The path '%s' resolved to a type %s. Expected a function.`;

const format = require('util').format;

const prototostring = Object.prototype.toString.call.bind(Object.prototype.toString);

module.exports = function curryx(arity, func) {

    if( arguments.length === 1 ) [arity, func] = [ARITY_NONE, arity];

    if( typeof func !== TYPE_FUNCTION ) func = resolvefunction(func);

    arity = (arity === ARITY_NONE) ? func.length
          : (typeof arity === TYPE_NUMBER) ? arity
          : fail(ERR_BAD_ARITY, gettype(arity));

          
    // the following rather awkward way of defining the curried function allows us set it's name dynamically
    const curriedname = `curried(${arity}) ${func.name || FUNCTION_ANONYMOUS}`;
    const curriedfunction = {
        [curriedname] : function(...args) {
            return (args.length < arity) ? curriedfunction.bind(this, ...args) : func.call(this, ...args);
        }
    }[curriedname];

    return curriedfunction;
}

function resolvefunction(path) {

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
    return (type === TYPE_OBJECT) ? prototostring(value).slice(8,-1) : type;
}