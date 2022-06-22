# curryx
A curry function that will `require()` the target function if passed a package name or module path instead of a
function, works with both explicit or implicit arities, preserves the curried function's original name and allows
binding the curried function to a custom `this`-object.

## Description
This package contains a function that can make functions curryable with an optional, explicit arity. The target function
may be passed directly or, alternatively, a package name or module path may be passed instead, in which case the target
function will be `required()`-ed automatically. Optionally, a property-key may be appended to the package name to target
a specific property of the imported object. This allows you to use curryx as a drop-in replacement for Node's 
`require()`.

The curried function will have the same name as the original function. This makes debugging your code a helluva of a
lot easier than debugging a bunch of curried functions that all carry the same generic name.

The curried function may be bound to or called with a custom `this`-object, which it will propagate to the target
function.

## Installation

To install `curryx` type:

```

$ npm install curryx

```

## Usage
To curry an existing target function, pass the desired arity and the target function to `curryx`:

```javascript

const curry = require('curryx');

const sum = (a,b) => (a+b);
const curried_sum = curry(2, sum);

const increment = curried_sum(1);
increment(42); // returns 43

```

### Implicit arity
Optionally, you may omit the arity argument and only pass the target function. In this case, the arity will be set
implicitly by reading the target function's `length` property.

```javascript

// curried_sum will have binary arity since sum's 'length` equals 2
const curried_sum = curryx(sum);

```

> There be dragons when relying on an implicit arity. Spread parameters, default parameters and any parameter following
> the first default parameter in a target function's parameter list do not count towards the function's `length`
> property. This can lead to unpredictable behaviour when relying on an implicit arity for currying variadic functions
> (especially when using curried functions in a function composition). Provide an explicit arity and the dragons be
> there no more.

The `curryx` package comes with two convenience functions that implicitly curry with binary or ternary arity
respectively:

```javascript

const curry2 = require('curryx/binary');

// Identical to 'curry(2, sum)' or, since sum() is not 
// variadic, 'curry(sum)'
const curried_sum = curry2(sum);

```

Similarly, `ternary` submodule curries functions with ternary arity.

### Curried function name
The curried function preserves the original function's name, to facilitate debugging. On each curried invocation, the
returned function will also be tagged with a 'bound'-label.

```javascript

const sum = curry(
    function sum(a,b) {
        return (a+b);
    }
)

const increment = sum(1);

console.log(sum.name); // prints 'sum'
console.log(increment.name); // prints 'bound sum'

```

If you curry an anonymous function, the function's name will be empty:

```javascript

const sum = curry( (a,b) => (a+b) );
console.log(sum.name); // prints ''

```

### Automatic require()
Instead of passing the target function itself, you can pass the name of a package or path to a module that exports the
target function, in which case the target function will be `require()`-ed automatically. This effectively allows you to
use `curryx` as a drop-in replacement for `require()`:

```javascript

// Curry the function exported by default by the './sum.js' module
// with an implicit binary arity
const sum = curry('./sum');

```

In most cases the target function will not be exported by default. Instead, the package or module will export the target
function as a keyed property of the exported object. In that case, you can append a `#` to the package name or module
path followed by the target function's property key:

```javascript

// Curry the `isDeepStrictEqual()` function in Node's built-in
// `util` package
const isdeepstrictequal = curry('util#isDeepStrictEqual');

// Curry the `sum()` method of the object exported by the
// './mathutils' module
const sum = curry('./mathutils#sum');

```

### Curried functions and *this*

The curried function is a wrapper around the target function. On subsequent invocations, the wrapper function repeatedly
binds itself to its arguments until the total number of arguments equals or exceeds the arity, at which point the
target function itself is invoked. The wrapper function invokes the target function with its own `this`-object.

This means that you can specify a custom `this`-object for the curried function (by calling `bind()`, `call()` or
`apply()` on the curried function) and the curried function will propagate it to the target function.

Only the curried function can be bound to a custom `this`-object, however. Upon currying the initial arguments, you can
no longer change the `this`-object of the subsequent intermediate (partially applied) functions - they will always
remain bound to the `this`-object of the curried function at the time it was invoked with the initial arguments.

```javascript

const returnthis = curry( function(a,b) { return this } );

returnthis(1,2) === global; // returns 'true'

const that = {};
const differentthat = {};

returnthis.call(that,1,2) === that; // returns 'true'
returnthis.call(differentthat,1,2) === differentthat; // returns 'true'

const returnthat = returnthis.bind(that);
returnthat(1,2) === that; // returns 'true'
returnthat(1,2) === returnthis(1,2); // returns 'false'

// this does not work: the 'this'-object of the partially applied,
// intermediate functions cannot be changed
const returndifferentthat = returnthat.bind(differentthat);
returndifferentthat(1,2) === differentthat; // returns 'false'
returndifferentthat(1,2) === that; // returns 'true'
returndifferentthat(1,2) === returnthat(1,2); // returns 'true'

// the original curried function is not affected
returnthis(1,2) === global; // returns 'true'

```

To disallow specifying a `this`-object for the target function, `bind()` the target function before currying it.

## Typescript declarations?
Nope.