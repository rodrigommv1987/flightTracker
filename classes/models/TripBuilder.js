const fs = require('fs');
const moment = require('moment');
const Trip = require('./Trip');
const { wait } = require('../utils/Utils.js');

class TripBuilder {

    constructor() {

        //the constructor resolves when all internal async operations are finished
        return new Promise((constructorResolve, reject) => {
            Promise.all([
                this.loadImplementations()
            ]).then(() => {
                constructorResolve(this);
            });
        });
    }

    loadImplementations() {

        return new Promise((resolve, reject) => {
            fs.readdir(__dirname + '/implementations', (err, files) => {

                this.airlines = new Map();
                for (const file of files) {

                    if (file == 'Vueling.js') break;

                    const implementation = new (require(`${__dirname}/implementations/${file}`));

                    this.airlines.set(implementation.name, {
                        name: implementation.name,
                        implementation: {
                            file,
                            handle: implementation
                        }
                    });
                }

                resolve(this);
            });
        });
    }

    loadAvailableAirports() {

        return new Promise((loadAvailableAirportsResolve, reject) => {

            const promises = [];

            for (const airline of this.getImplementations) {

                //for each existing airline, save all available airports to the airlines map
                promises.push(
                    new Promise((resolve, reject) => {
                        airline.fetchAvailableAirports()
                            .then(airports => {
                                this.airlines.set(airline.name, {
                                    ...this.airlines.get(airline.name),
                                    availableAirports: airports
                                });
                                resolve();
                            });
                    })
                );
            }
            Promise.all(
                promises
            ).then(() => {
                loadAvailableAirportsResolve(this);
            });
        });

    }

    //TODO:
    buildFridayToSundayTrips(originAirport, destinationAirport) {
        //for each implementation
        //get max date for origin airport

        for (const airline of this.getImplementations) {
            airline.fetchAvailableAirports()
                .then(airports => airports.find(airport => airport.iataCode == originAirport))
                .then(originAirport => {
                    console.log(originAirport);
                    // t.originAirport = originAirport;
                    // return r.fetchDestinations(originAirport);
                });
        }
    }

    buildOneWayTrips(originAirportIata, destinationAirportIata) {

        return new Promise((buildOneWayTripsResolve, reject) => {

            for (const airline of this.getImplementations) {

                let originAirport, destinationAirport, availableDates;

                Promise.all([
                    airline.findAirport(originAirportIata),
                    airline.findAirport(destinationAirportIata)
                ])
                    .then((airports) => {
                        originAirport = airports[0];
                        destinationAirport = airports[1];
                        return airline.fetchAvailableDates(originAirport, destinationAirport)
                    })
                    .then(response => {

                        availableDates = response.slice(0, 5);
                        const trips = [];

                        for (const date of availableDates) {
                            const t = new Trip(
                                originAirport,
                                destinationAirport,
                                moment(date).format(airline.configs.doSingleTrip.dateFormat)
                            );
                            trips.push(t);
                        }
                        buildOneWayTripsResolve(trips);
                    });
            }
        });

    }

    async buildOneWayTripsAsync(originAirportIata, destinationAirportIata) {

        const trips = [];
        for (const airline of this.getImplementations) {
            const originAirport = await airline.findAirport(originAirportIata);
            const destinationAirport = await airline.findAirport(destinationAirportIata);
            const availableDates = (
                await airline.fetchAvailableDates(originAirport, destinationAirport)
            ).slice(0, 5);
            for (const date of availableDates) {
                const t = new Trip(
                    originAirport,
                    destinationAirport,
                    moment(date).format(airline.configs.doSingleTrip.dateFormat)
                );
                trips.push(t);
                // console.log(t);
                // await wait(1000);
            }
        }
        // console.log(trips);
        return trips;
    }

    get getImplementations() {
        const imps = [];
        for (const { implementation: { handle } } of this.airlines.values()) {
            imps.push(handle);
        }
        return imps;
    }

}

module.exports = TripBuilder;