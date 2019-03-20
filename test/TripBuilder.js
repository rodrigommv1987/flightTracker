const assert = require('assert');
const TripBuilder = require('../src/models/TripBuilder');
// const moment = require('moment');

describe('TripBuilder', function () {

    describe('Testing TripBuilder methods', function () {

        describe('constructor', function () {

            it('creates a new instance', async function () {
                const tr = await new TripBuilder();
                
                assert.equal(tr instanceof TripBuilder, true);
            });
            it('a new TripBuilder instance has a getImplementations getter', async function () {
                const tr = await new TripBuilder();
                
                assert.equal(typeof tr.getImplementations, "object");
            });
        });
    });
});