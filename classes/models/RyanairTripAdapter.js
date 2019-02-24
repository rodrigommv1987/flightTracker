const Flight = require('./Flight');
class RyanairTripAdapter {

    static doSingleTrip(trip, serverResponse) {

        const [tripData] = serverResponse.trips,
            availableFlights = tripData.dates[0].flights.length > 0;

        if (availableFlights) {
            const flights = tripData.dates[0].flights.map(flightData => {

                const { flightKey, regularFare, segments, flightNumber, time, duration } = flightData,
                    { originAirport } = trip.originAirport,
                    { destinationAirport } = trip.destinationAirport;

                const flight = new Flight({
                    originAirport,
                    destinationAirport,
                    departureDate: time[0],
                    arrivalDate: time[1],
                    duration,
                });

                // //misc info
                // this.flightKey = '';
                // this.flightNumber = '';

                // //price related info
                // this.price = 0;
                // this.hasDiscount = false;
                // this.discountInPercent = 0;
                // this.hasPromoDiscount = 

                // //all flight segments that composes the flight
                // this.segments = [];
                // console.log(f);
            })
        }

        trip.availableFlights(availableFlights);
        // console.log(trip);
        return trip;
    }

}

exports.RyanairTripAdapter = RyanairTripAdapter;
