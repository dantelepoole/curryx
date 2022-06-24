# curryx
A curry function that will `require()` the target function if passed a string instead of a
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

The package also exports convenience functions `binary()`, `ternary()` and `quaternary()` to allow currying a target
function without having to pass an explicit arity.

Finally, the package exports a `partial()` function for partial function application, which will also `require()` the
target function if it is passed a string instead of a function.

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

The `curryx` package comes with three convenience functions that implicitly curry with binary, ternary or quaternary
arity respectively. These functions are also accessible as methods of `curryx()`.

```javascript

const curry2 = require('curryx/binary');

// Identical to 'curry(2, sum)' or, since sum() is not 
// variadic, 'curry(sum)'
const curried_sum = curry2(sum);

// alteratively:
const curryx = require('curryx');
const curried_sum = curryx.binary(sum);

```

Similarly, the `ternary` and `quaternary` submodules curry functions with ternary and quaternary arity respectively.

### Curried function name
The curried function preserves the target function's name to facilitate debugging. On each curried invocation, the
returned function will also be tagged with a 'partial'-label.

```javascript

const sum = curry(
    function sum(a,b) {
        return (a+b);
    }
)

console.log(sum.name); // prints 'sum'

const increment = sum(1);
console.log(increment.name); // prints 'partial sum'

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

As of version 2.0.0, `curryx()` no longer relies on Javascript's `Function.prototype.bind()` method. As a result, a
curried function can be invoked with a custom `this`-object (using the regular `bind()`, `call()` or `apply()` methods).

```javascript

const returnthis = curry( function(a,b) { return this } );

const defaultthis = this;
returnthis(1,2) === defaultthis; // returns 'true'

const that = {};
returnthis.call(that,1,2) === that; // returns 'true'

```

To disallow custom `this`-objects for the target function, `bind()` the target function before currying it.

### partial(*function*, ...*args*)

`partial()` works similarly to Javascript's `Function.prototype.bind()` method, except it doesn't allow for passing
a `this`-object. So it can only be used for partially applying a function to the given arguments. However, the same
result can still be achieved by invoked the partially applied function itself with a custom `this`-object (using the
regular `bind()`, `call()` or `apply()` methods), which it then will forward to the target function.

Like `curryx()`, `partial()` will `require()` the target function if it is passed a string instead of a function.

```javascript

const partial = require('curryx/partial');

function sum(a,b) { return (a+b) }

const increment = partial(sum, 1);

console.log(increment.name); // prints `partial sum`
increment(42); // returns 43

const someobject = { value:42 };
const isequaltosomeobject = partial('util#isDeepStrictEqual', someobject);

isequaltosomeobject( { value:42 } ); // returns true

```

## Typescript declarations?
Nope.