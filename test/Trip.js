const assert = require('assert');
const Trip = require('../src/models/Trip');
const moment = require('moment');

describe('Trip', function () {

    describe('Testing Trip methods', function () {

        describe('constructor', function () {

            it('creates a new instance with null attributes', function () {
                const trip = new Trip();
                assert.equal(trip.originAirport, null);
                assert.equal(trip.destinationAirport, null);
                assert.equal(trip.departureDate, null);
                assert.equal(trip.returnDate, null);
            });

            it('creates a new instance with the provided params', function () {
                const originAirport = {
                    name: 'Barcelona-El Prat',
                    cityCode: 'BARCELONA',
                    countryCode: 'es',
                    iataCode: 'BCN'
                };
                const destinationAirport = {
                    name: 'Oporto',
                    cityCode: 'PORTO',
                    countryCode: 'pt',
                    iataCode: 'OPO'
                };
                const today = new Date();
                const dateFormat = 'YYYY-MM-DD';

                const trip = new Trip(
                    originAirport,
                    destinationAirport,
                    moment(today).format(dateFormat),
                    moment(today).add(1, 'days').format(dateFormat)
                );

                assert.equal(trip.originAirport, originAirport);
                assert.equal(trip.destinationAirport, destinationAirport);
                assert.equal(trip.departureDate, moment(today).format(dateFormat));
                assert.equal(trip.returnDate, moment(today).add(1, 'days').format(dateFormat));
            });

            it('a fresh Trip object has zero flights', function () {
                const trip = new Trip();
                assert(trip.flights.length === 0);
            });
        });

        describe('addOneWayFlight', function () {

            it('executing the method adds just one flight', function () {
                const trip = new Trip();
                trip.addOneWayFlight({
                    outbound: {
                        availableOutboundFlight: true,
                        flights: [{}]
                    },
                    airline: 'airlineName',
                    flightSearchURL: 'www.example.com',
                    timestamp: (+new Date()),
                    dateFormat: 'YYYY-MM-DD'
                });
                assert.equal(trip.flights.length, 1);
            });

            it('this method is chainable', function () {
                const trip = new Trip();
                const returnValue = trip.addOneWayFlight({
                    outbound: {
                        availableOutboundFlight: true,
                        flights: [{}]
                    },
                    airline: 'airlineName',
                    flightSearchURL: 'www.example.com',
                    timestamp: (+new Date()),
                    dateFormat: 'YYYY-MM-DD'
                });
                assert.equal(returnValue, trip);
            });

            it('does not set the roundTrip attribute to true', function () {
                const trip = new Trip();
                trip.addOneWayFlight({
                    outbound: {
                        availableOutboundFlight: true,
                        flights: [{}]
                    },
                    inbound: {
                        availableInboundFlight: true,
                        flights: [{}]
                    },
                    airline: 'airlineName',
                    flightSearchURL: 'www.example.com',
                    timestamp: (+new Date()),
                    dateFormat: 'YYYY-MM-DD'
                });
                assert.equal(trip.roundTrip, false);
            });

        });

        describe('addRoundTripFlight', function () {

            it('executing the method adds just one flight', function () {
                const trip = new Trip();
                trip.addRoundTripFlight({
                    outbound: {
                        availableOutboundFlight: true,
                        flights: [{}]
                    },
                    inbound: {
                        availableInboundFlight: true,
                        flights: [{}]
                    },
                    airline: 'airlineName',
                    flightSearchURL: 'www.example.com',
                    timestamp: (+new Date()),
                    dateFormat: 'YYYY-MM-DD'
                });
                assert.equal(trip.flights.length, 1);
            });

            it('this method is chainable', function () {
                const trip = new Trip();
                const returnValue = trip.addRoundTripFlight({
                    outbound: {
                        availableOutboundFlight: true,
                        flights: [{}]
                    },
                    inbound: {
                        availableInboundFlight: true,
                        flights: [{}]
                    },
                    airline: 'airlineName',
                    flightSearchURL: 'www.example.com',
                    timestamp: (+new Date()),
                    dateFormat: 'YYYY-MM-DD'
                });
                assert.equal(trip, returnValue);
            });

            it('sets the roundTrip attribute to true', function () {
                const trip = new Trip();
                trip.addRoundTripFlight({
                    outbound: {
                        availableOutboundFlight: true,
                        flights: [{}]
                    },
                    inbound: {
                        availableInboundFlight: true,
                        flights: [{}]
                    },
                    airline: 'airlineName',
                    flightSearchURL: 'www.example.com',
                    timestamp: (+new Date()),
                    dateFormat: 'YYYY-MM-DD'
                });
                assert.equal(trip.roundTrip, true);
            });

        });

        describe('fromJSON', function () {
            const today = new Date();
            const dateFormat = 'YYYY-MM-DD';
            it('is static', function () {
                assert.equal(typeof Trip.fromJSON, "function");

                const trip = new Trip();
                assert.equal(trip.fromJSON, undefined);
            });
            it('given a single Trip data object, it returns one Trip instance', function () {
                const trip = Trip.fromJSON({
                    originAirport: {
                        name: 'Barcelona-El Prat',
                        cityCode: 'BARCELONA',
                        countryCode: 'es',
                        iataCode: 'BCN'
                    },
                    destinationAirport: {
                        name: 'Oporto',
                        cityCode: 'PORTO',
                        countryCode: 'pt',
                        iataCode: 'OPO'
                    },
                    departureDate: moment(today).format(dateFormat),
                    returnDate: moment(today).add(1, 'days').format(dateFormat)
                });

                assert.equal(trip instanceof Trip, true);
            });
            it('given a single Trip data object, it returns a Trip instance loaded with those values', function () {
                const originAirport = {
                    name: 'Barcelona-El Prat',
                    cityCode: 'BARCELONA',
                    countryCode: 'es',
                    iataCode: 'BCN'
                };
                const destinationAirport = {
                    name: 'Oporto',
                    cityCode: 'PORTO',
                    countryCode: 'pt',
                    iataCode: 'OPO'
                };
                const trip = Trip.fromJSON({
                    originAirport: {
                        name: 'Barcelona-El Prat',
                        cityCode: 'BARCELONA',
                        countryCode: 'es',
                        iataCode: 'BCN'
                    },
                    destinationAirport: {
                        name: 'Oporto',
                        cityCode: 'PORTO',
                        countryCode: 'pt',
                        iataCode: 'OPO'
                    },
                    departureDate: moment(today).format(dateFormat),
                    returnDate: moment(today).add(1, 'days').format(dateFormat)
                });

                assert.equal(trip.originAirport.name, originAirport.name);
                assert.equal(trip.originAirport.cityCode, originAirport.cityCode);
                assert.equal(trip.originAirport.countryCode, originAirport.countryCode);
                assert.equal(trip.originAirport.iataCode, originAirport.iataCode);

                assert.equal(trip.destinationAirport.name, destinationAirport.name);
                assert.equal(trip.destinationAirport.cityCode, destinationAirport.cityCode);
                assert.equal(trip.destinationAirport.countryCode, destinationAirport.countryCode);
                assert.equal(trip.destinationAirport.iataCode, destinationAirport.iataCode);

                assert.equal(trip.departureDate, moment(today).format(dateFormat));
                assert.equal(trip.returnDate, moment(today).add(1, 'days').format(dateFormat));
            });
            it('given an array of n Trip data object, it returns an array of length n', function () {
                const tripsData = [
                    {
                        originAirport: {
                            name: 'Barcelona-El Prat',
                            cityCode: 'BARCELONA',
                            countryCode: 'es',
                            iataCode: 'BCN'
                        },
                        destinationAirport: {
                            name: 'Oporto',
                            cityCode: 'PORTO',
                            countryCode: 'pt',
                            iataCode: 'OPO'
                        },
                        departureDate: moment(today).format(dateFormat),
                        returnDate: moment(today).add(1, 'days').format(dateFormat)
                    },
                    {
                        originAirport: {
                            name: 'Barcelona-El Prat',
                            cityCode: 'BARCELONA',
                            countryCode: 'es',
                            iataCode: 'BCN'
                        },
                        destinationAirport: {
                            name: 'Oporto',
                            cityCode: 'PORTO',
                            countryCode: 'pt',
                            iataCode: 'OPO'
                        },
                        departureDate: moment(today).format(dateFormat),
                        returnDate: moment(today).add(1, 'days').format(dateFormat)
                    },
                    {
                        originAirport: {
                            name: 'Barcelona-El Prat',
                            cityCode: 'BARCELONA',
                            countryCode: 'es',
                            iataCode: 'BCN'
                        },
                        destinationAirport: {
                            name: 'Oporto',
                            cityCode: 'PORTO',
                            countryCode: 'pt',
                            iataCode: 'OPO'
                        },
                        departureDate: moment(today).format(dateFormat),
                        returnDate: moment(today).add(1, 'days').format(dateFormat)
                    }
                ];
                const trips = Trip.fromJSON(tripsData);

                assert.equal(trips.length, 3);
            });
            it('given an array of n Trip data object, it returns an array of length n of Trips instances', function () {
                const tripsData = [
                    {
                        originAirport: {
                            name: 'Barcelona-El Prat',
                            cityCode: 'BARCELONA',
                            countryCode: 'es',
                            iataCode: 'BCN'
                        },
                        destinationAirport: {
                            name: 'Oporto',
                            cityCode: 'PORTO',
                            countryCode: 'pt',
                            iataCode: 'OPO'
                        },
                        departureDate: moment(today).format(dateFormat),
                        returnDate: moment(today).add(1, 'days').format(dateFormat)
                    },
                    {
                        originAirport: {
                            name: 'Barcelona-El Prat',
                            cityCode: 'BARCELONA',
                            countryCode: 'es',
                            iataCode: 'BCN'
                        },
                        destinationAirport: {
                            name: 'Oporto',
                            cityCode: 'PORTO',
                            countryCode: 'pt',
                            iataCode: 'OPO'
                        },
                        departureDate: moment(today).format(dateFormat),
                        returnDate: moment(today).add(1, 'days').format(dateFormat)
                    },
                    {
                        originAirport: {
                            name: 'Barcelona-El Prat',
                            cityCode: 'BARCELONA',
                            countryCode: 'es',
                            iataCode: 'BCN'
                        },
                        destinationAirport: {
                            name: 'Oporto',
                            cityCode: 'PORTO',
                            countryCode: 'pt',
                            iataCode: 'OPO'
                        },
                        departureDate: moment(today).format(dateFormat),
                        returnDate: moment(today).add(1, 'days').format(dateFormat)
                    }
                ];
                const trips = Trip.fromJSON(tripsData);

                assert.equal(trips[0] instanceof Trip, true);
                assert.equal(trips[1] instanceof Trip, true);
                assert.equal(trips[2] instanceof Trip, true);
            });
        });

    });

});