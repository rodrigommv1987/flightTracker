const assert = require('assert');
const Ryanair = require('../../src/models/implementations/Ryanair');
const Airport = require('../../src/models/Airport');
const moment = require('moment');

describe('Ryanair', function () {

    describe('Testing Ryanair methods', function () {

        describe('findAirport', function () {

            it('does not execute without an argument', async function () {
                const r = new Ryanair();
                let ret;

                ret = await r.findAirport();
                assert.equal(ret, null);
            });

            it('only accepts a string as argument', async function () {
                const r = new Ryanair();
                let ret;

                ret = await r.findAirport({});
                assert.equal(ret, null);

                ret = await r.findAirport(42);
                assert.equal(ret, null);

                ret = await r.findAirport([]);
                assert.equal(ret, null);

                ret = await r.findAirport('BCN');
                assert.notEqual(ret, null);
            });

            it('given a valid airport iataCode, it returns an Airport instance', async function () {
                const r = new Ryanair();
                const airport = await r.findAirport('BCN');

                assert.equal(airport instanceof Airport, true);
            });
        });

        describe('fetchAvailableAirports', function () {

            it('returns an array of airports', async function () {
                const r = new Ryanair();
                const airports = await r.fetchAvailableAirports();

                assert.equal(Array.isArray(airports), true);
                assert.equal(airports.length > 0, true);
                assert.equal(airports[0] instanceof Airport, true);
                assert.equal(airports[airports.length-1] instanceof Airport, true);
            });
        });

        describe('fetchAvailableDates', function () {

            it('accepts two Airline instance or two objects the same Airline data as arguments, anything else returns null', async function () {
                this.timeout(0);
                const r = new Ryanair();
                const origin = await r.findAirport('BCN');
                const destination = await r.findAirport('OPO');
                
                let invalidReturnValue =  await r.fetchAvailableDates('hello','world'); 
                assert.equal(invalidReturnValue, null);
                
                invalidReturnValue =  await r.fetchAvailableDates('hello',42); 
                assert.equal(invalidReturnValue, null);

                invalidReturnValue =  await r.fetchAvailableDates([],42); 
                assert.equal(invalidReturnValue, null);

                let availableDates = await r.fetchAvailableDates(origin,destination);
                assert.equal(Array.isArray(availableDates), true);

                availableDates = await r.fetchAvailableDates({iataCode:'ATH'},{iataCode:'BCN'});
                assert.equal(Array.isArray(availableDates), true);
            });
            
            it('given two valid arguments, it returns an array of date objects', async function () {
                this.timeout(0);
                const r = new Ryanair();
                const origin = await r.findAirport('BCN');
                const destination = await r.findAirport('OPO');
                const availableDates = await r.fetchAvailableDates(origin,destination);
                
                assert.equal(Array.isArray(availableDates), true);
                assert.equal(availableDates.length > 0, true);
                assert.equal(availableDates[0] instanceof Date, true);
                assert.equal(availableDates[availableDates.length-1] instanceof Date, true);
            });

            it('if given one destination reachable from the origin, it returns an array of dates', async function () {
                this.timeout(0);
                const r = new Ryanair();
                const origin = await r.findAirport('BCN');
                const destinations = await r.fetchDestinations(origin);
                const availableDates = await r.fetchAvailableDates(origin,destinations[0]);

                assert.equal(Array.isArray(availableDates), true, "return value is not an array");
                assert.equal(availableDates.length > 0, true,"empty array received");
                assert.equal(availableDates[0] instanceof Date, true,"the first element of the array is not a Date");
                assert.equal(availableDates[availableDates.length-1] instanceof Date, true,"the last element of the array is not a Date");
            });

            it('if given one destination not reachable from the origin, it returns an empty array', async function () {
                this.timeout(0);
                const r = new Ryanair();
                const origin = await r.findAirport('BCN');
                const destination = await r.findAirport('GVA');
                const availableDates = await r.fetchAvailableDates(origin,destination);
                
                assert.equal(Array.isArray(availableDates), true);
                assert.equal(availableDates.length === 0, true);
            });
        });
    });
});