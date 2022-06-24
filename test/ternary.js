const expect = require('chai').expect;
const curry3 = require('../src/ternary');

function countargs(...args) {
    return args.length;
}

describe(`ternary()`, function() {

    it(`should return a function curried with ternary arity`,
        function () {

            const curried = curry3(countargs);
            expect(curried).to.be.a('function');

            expect( curried(1) ).to.be.a('function');
            expect( curried(1,2) ).to.be.a('function');
            expect( curried(1,2,3) ).to.be.equal(3);
            expect( curried(1,2,3,4) ).to.be.equal(4);

        }
    )
})