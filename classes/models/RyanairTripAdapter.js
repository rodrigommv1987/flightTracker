const Flight = require('./Flight');
class RyanairTripAdapter {

    static doSingleTrip(trip, serverResponse) {

        const [tripData] = serverResponse.trips,
            availableFlights = tripData.dates[0].flights.length > 0;

        if (availableFlights) {
            for (const flightData of tripData.dates[0].flights) {
                const { flightKey, regularFare = null, segments, flightNumber, time, duration } = flightData,
                    { iataCode: originAirport } = trip.originAirport,
                    { iataCode: destinationAirport } = trip.destinationAirport,
                    hasAvailableSeat = (regularFare !== null);

                let flight = new Flight({
                    //basic info
                    originAirport,
                    destinationAirport,
                    departureDate: time[0],
                    arrivalDate: time[1],
                    duration,
                    //misc info
                    flightKey,
                    flightNumber,
                    hasAvailableSeat
                });

                if (hasAvailableSeat) {
                    const { fareKey, fareClass } = regularFare,
                        { amount: price, hasDiscount, discountInPercent, hasPromoDiscount } = regularFare.fares[0];

                    flight.setFlightPrice({
                        fareKey, fareClass, price, hasDiscount, discountInPercent, hasPromoDiscount
                    });
                }

                flight.addSegment(segments);
                trip.addOneWayFlight(flight);
            }
        }

        trip.setAvailableFlights(availableFlights);

        return trip;
    }

}

exports.RyanairTripAdapter = RyanairTripAdapter;
