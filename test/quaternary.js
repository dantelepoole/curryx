const expect = require('chai').expect;
const curryx = require('../src');
const curry4 = require('../src/quaternary');

function countargs(...args) {
    return args.length;
}

describe(`quaternary()`, function() {

    it(`should return a function curried with quaternary arity`,
        function () {

            const curried = curry4(countargs);
            expect(curried).to.be.a('function');

            expect( curried(1) ).to.be.a('function');
            expect( curried(1,2) ).to.be.a('function');
            expect( curried(1,2,3) ).to.be.a('function');
            expect( curried(1,2,3,4) ).to.be.equal(4);
            expect( curried(1,2,3,4,5) ).to.be.equal(5);

        }
    )

    it(`should be accessible as a method of curryx`,
        function () {
            expect(curry4).to.be.equal(curryx.quaternary);
        }
    )

})