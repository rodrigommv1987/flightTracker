const TripBase = require('./TripBase');

class TripResolver extends TripBase {

    constructor() {
        super();
    }

    async resolveOneWayTrips(trips = []) {
        if (trips.length === 0) return;

        for (const airline of this.getImplementations) {

            //replace each trip with a resolved copy of the trip
            for (const [index, trip] of trips.entries()) {
                trips[index] = await airline.doSingleTrip(trip);
            }
        }

        return trips;
    }
}

module.exports = TripResolver;