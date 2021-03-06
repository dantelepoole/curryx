const expect = require('chai').expect;
const partial = require('../src/partial');

function sum(a,b) {
    return (a+b);
}

function countargs(...args) {
    return args.length;
}

function returnargs(...args) {
    return args;
}

describe(`partial()`, function() {

    it(`should throw if the function is not a function nor a require()-like path that resolves to a function`,
        function () {
            expect( () => partial(42) ).to.throw();
            expect( () => partial('foobar') ).to.throw();
            expect( () => partial('util#types') ).to.throw();
        }
    )

    it(`should set the returned function's name to indicate that is has been partially applied`,
        function () {
            const sum_partial = partial(sum, 1);
            expect(sum_partial.name).to.be.equal('partial sum');
        }
    )

    it(`should return a function bound to the arguments`,
        function () {
            const sum_partial = partial(sum, 1);
            expect( sum_partial(42) ).to.be.equal(43);

            const countargs_partial = partial(countargs, 1,2,3,4,5);
            expect( countargs_partial(6,7,8) ).to.be.equal(8);

            const returnargs_partial = partial(returnargs, 1,2,3,4,5);
            expect( returnargs_partial(6,7,8) ).to.be.deep.equal([1,2,3,4,5,6,7,8]);
        }
    )

    it(`should propagate its 'this'-value to the target function`,
        function () {

            const returnthis = partial(function() { return this });
            expect( returnthis(1,2) ).to.be.equal(global);

            const that = {};
            expect( returnthis.call(that, 1, 2) ).to.be.equal(that);

            const returnthat = returnthis.bind(that);
            expect( returnthat(1,2) ).to.be.equal(that);

            expect( returnthis(1,2) ).to.be.equal(global);
        }
    )
    it(`should resolve a package name or module path if a string is passed instead of a function`,
        function () {

            const format_partial = partial('util#format', 'My name is %s and my age is %d');
            expect( format_partial ).to.be.a('function');

            const format_partial_result = format_partial('Foobar', 42);
            const format_result = require('util').format('My name is %s and my age is %d', 'Foobar', 42);
            expect(format_partial_result).to.be.equal(format_result);

            const partial_pathtest = partial('../src/index');
            expect( partial_pathtest ).to.be.a('function');
        }
    )


})