const TripBase = require('./TripBase');
const moment = require('moment');
const Trip = require('./Trip');

class TripBuilder extends TripBase {

    constructor() {
        super();
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
                    // console.log(originAirport);
                    // t.originAirport = originAirport;
                    // return r.fetchDestinations(originAirport);
                });
        }
    }

    async * buildOneWayTrips(originAirportIata) {

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
    }
}

module.exports = TripBuilder;