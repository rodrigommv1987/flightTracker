const fs = require('fs');

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

                // this.implementations = files.map(file => {

                //     const implementation = new (require(`${__dirname}/implementations/${file}`));
                //     return {
                //         name: implementation.name,
                //         implementation: {
                //             file,
                //             handle: implementation
                //         }
                //     };
                // });

                // const implementations = {};
                // for (const file of files) {

                //     const implementation = new (require(`${__dirname}/implementations/${file}`));

                //     implementations[implementation.name] = {
                //         name: implementation.name,
                //         implementation: {
                //             file,
                //             handle: implementation
                //         }
                //     };
                // }
                // this.implementations = implementations;

                this.airlines = new Map();
                for (const file of files) {

                    // if (file == 'Vueling.js') break;

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

                promises.push(
                    new Promise((resolve, reject) => {
                        airline.fetchAvailableAirports()
                            .then(airports => {
                                this.airlines.set(airline.name, {
                                    ...this.airlines.get(airline.name),
                                    availableAirports: airports.slice(0, 5)
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

    get getImplementations() {
        const imps = [];
        for (const { implementation: { handle } } of this.airlines.values()) {
            imps.push(handle);
        }
        return imps;
    }

}

module.exports = TripBuilder;