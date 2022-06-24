const expect = require('chai').expect;
const curryx = require('../src');
const curry2 = require('../src/binary');

function countargs(...args) {
    return args.length;
}

describe(`binary()`, function() {

    it(`should return a function curried with binary arity`,
        function () {

            const curried = curry2(countargs);
            expect(curried).to.be.a('function');

            expect( curried(1) ).to.be.a('function');
            expect( curried(1,2) ).to.be.equal(2);
            expect( curried(1,2,3) ).to.be.equal(3);

        }
    )

})