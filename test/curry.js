const expect = require('chai').expect;
const curry = require('../src/index');

function sum(a,b) {
    return (a+b);
}

function countargs(...args) {
    return args.length;
}

describe(`curryx()`, function() {

    it(`should throw if the arity is not a number or undefined`,
        function () {
            expect( () => curry('foobar', countargs) ).to.throw();
            expect( () => curry(null, countargs) ).to.throw();
            expect( () => curry(42n, countargs) ).to.throw();
        }
    )

    it(`should throw if the function is not a function nor a require()-like path that resolves to a function`,
        function () {
            expect( () => curry(2, 'foobar') ).to.throw();
            expect( () => curry(2, 'util#types') ).to.throw();
        }
    )

    it(`should read the arity from the function's length-property if an arity is not provided`,
        function () {

            const curried_sum = curry(sum);
            const increment = curried_sum(1);

            expect( increment ).to.be.a('function');
            expect( increment(42) ).to.be.equal(43);
        }
    )

    it(`should resolve a package name or module path`,
        function () {

            const curried = curry(2, 'util#format');
            expect( curried ).to.be.a('function');

            const curried_result = curried('My name is %s and my age is %d', 'Foobar', 42);
            const format_result = require('util').format('My name is %s and my age is %d', 'Foobar', 42);
            expect(curried_result).to.be.equal(format_result);

            const curried_pathtest = curry(1, '../src/index');
            expect( curried_pathtest ).to.be.a('function');
        }
    )

    describe(`the curried function`, function() {

        it(`should have the same name as the target function`,
            function () {

                const curried = curry(42, countargs);
                expect( curried.name ).to.be.equal(countargs.name);

                expect( curry(2, ()=>{}).name ).to.be.equal('');
            }
        )

        it(`should cache its arguments on successive invocations until the total number of arguments equals or exceeds the arity`,
            function () {

                const curried_countargs = curry(3, countargs);
                expect( curried_countargs ).to.be.a('function');

                const curried_countargs1 = curried_countargs(1);
                expect( curried_countargs1 ).to.be.a('function');

                const curried_countargs2 = curried_countargs1(2);
                expect( curried_countargs2 ).to.be.a('function');

                const curried_countargs3 = curried_countargs2(3);
                expect( curried_countargs3 ).to.equal(3);

                const curried_countargs4 = curried_countargs2(3,4);
                expect( curried_countargs4 ).to.equal(4);
            }
        )

        it(`should propagate its 'this'-value to the target function`,
            function () {

                const returnthis = curry(2, function() { return this });
                expect( returnthis(1,2) ).to.be.equal(global);

                const that = {};
                expect( returnthis.call(that, 1, 2) ).to.be.equal(that);

                const returnthat = returnthis.bind(that);
                expect( returnthat(1,2) ).to.be.equal(that);

                expect( returnthis(1,2) ).to.be.equal(global);
            }
        )

        it(`should prepend 'partial ' to the target function's name on subsequent currying steps`,
            function () {

                const curried = curry(2, sum);
                const increment = curried(1);

                expect( increment.name ).to.be.equal(`partial sum`);
            }
        )
    })

});