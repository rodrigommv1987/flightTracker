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
        this.flights = []
    }

    /*
        ToDo:
        implement search logic for best (cheapest) flight as a getter
    */
    get bestFlight() { }

    addOneWayFlight({ outbound: { availableOutboundFlight, flights }, airline, timestamp, dateFormat }) {

        this.flights.push({
            status: {
                availableOutboundFlight,
                availableInboundFlight: false
            },
            airline,
            timestamp,
            dateFormat,
            outboundFlights: flights,
            inboundFlights: null
        });

        return this;
    }

    addRoundTripFlight({ outbound: { availableOutboundFlight, flights:outboundFlights },
        inbound: { availableInboundFlight, flights:inboundFlights }, airline, timestamp, dateFormat }) {

        this.roundTrip = true;
        this.flights.push({
            status: {
                availableOutboundFlight,
                availableInboundFlight
            },
            airline,
            timestamp,
            dateFormat,
            outboundFlights: outboundFlights,
            inboundFlights: inboundFlights
        })

        return this;
    }
};

module.exports = Trip;