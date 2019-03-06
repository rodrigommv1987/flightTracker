class Trip {

    constructor(originAirport = null, destinationAirport = null, departureDate = null, returnDate = null) {

        //basic trip information - one way trips
        this.originAirport = originAirport;
        this.destinationAirport = destinationAirport;
        this.departureDate = departureDate;
        this.returnDate = returnDate;
        this.adults = 1;
        this.children = 0;
        this.roundTrip = false;

        //here will be search results
        this.flights = [];
    }

    addOneWayFlight({ outbound: { availableOutboundFlight, flights }, airline, flightSearchURL, timestamp, dateFormat }) {

        this.flights.push({
            status: {
                availableOutboundFlight,
                availableInboundFlight: false
            },
            airline,
            flightSearchURL,
            timestamp,
            dateFormat,
            outboundFlights: flights,
            inboundFlights: null
        });

        return this;
    }

    addRoundTripFlight({ outbound: { availableOutboundFlight, flights: outboundFlights },
        inbound: { availableInboundFlight, flights: inboundFlights }, airline, flightSearchURL, timestamp, dateFormat }) {

        this.roundTrip = true;
        this.flights.push({
            status: {
                availableOutboundFlight,
                availableInboundFlight
            },
            airline,
            flightSearchURL,
            timestamp,
            dateFormat,
            outboundFlights: outboundFlights,
            inboundFlights: inboundFlights
        });

        return this;
    }
}

module.exports = Trip;

//TODO: implement search logic for best (cheapest) flight as a getter
// get bestFlight() { }