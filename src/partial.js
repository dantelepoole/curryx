/**
 * @module partial
 */

'use strict';

const CHAR_HASH = '#';
const ERR_BAD_FUNCTION = `The function has type %s. Expected a function.`;
const KEY_NONE = undefined;
const TYPE_FUNCTION = 'function';

module.exports = function partial(func, ...args) {
    
    if( typeof func !== TYPE_FUNCTION ) func = importfunction(func);

    return func.bind(null, ...args);
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