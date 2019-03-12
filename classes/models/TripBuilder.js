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

    async loadAvailableAirports() {

        let airports;
        for (const airline of this.getImplementations) {

            //for each existing airline, save all available airports to the airlines map
            airports = await airline.fetchAvailableAirports();
            this.airlines.set(airline.name, {
                ...this.airlines.get(airline.name),
                availableAirports: airports
            });
        }
    }

    buildFridayToSundayTrips(originAirport, destinationAirport) {
        //TODO:
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

    async buildOneWayTrips(originAirportIata/*, destinationAirportIata*/) {

        // let trips = [];
        //for each airline
        for (const airline of this.getImplementations) {
            const originAirport = await airline.findAirport(originAirportIata);
            const availableDestinations = airline.fetchDestinations(originAirport);

            for (const destinationAirport of availableDestinations) {

                const availableDates = (
                    await airline.fetchAvailableDates(originAirport, destinationAirport)
                );

                //for each available date
                for (const date of availableDates) {
                    trips.push(new Trip(
                        originAirport,
                        destinationAirport,
                        moment(date).format(airline.configs.doSingleTrip.dateFormat)
                    ));
                    // console.log(t);
                    await wait(1000);
                }
                // await db.savePendingTrips(trips);                
            }

        }
        // console.log(trips);
        // return trips;
    }

    async * buildOneWayTripsGenerator(originAirportIata/*, destinationAirportIata*/) {

        //for each airline
        for (const airline of this.getImplementations) {
            const originAirport = await airline.findAirport(originAirportIata);
            const availableDestinations = await airline.fetchDestinations(originAirport);


            //for each available destination
            for (const destinationAirport of availableDestinations) {
                const availableDates = (
                    await airline.fetchAvailableDates(originAirport, destinationAirport)
                );

                const trips = [];
                //for each available date
                for (const date of availableDates) {
                    trips.push(new Trip(
                        originAirport,
                        destinationAirport,
                        moment(date).format(airline.configs.doSingleTrip.dateFormat)
                    ));
                }
                yield trips;
            }

        }
        // console.log(trips);
        // return trips;
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