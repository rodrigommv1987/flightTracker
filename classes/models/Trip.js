class Trip {

    constructor(originAirport = null, destinationAirport = null, departureDate = null, arrivalDate = null) {

        //basic trip information - one way trips
        this.originAirport = originAirport;
        this.destinationAirport = destinationAirport;
        this.departureDate = departureDate;
        this.arrivalDate = arrivalDate;
        this.adults = 1;
        this.children = 0;
        this.roundTrip = false;

        //the trip has not been filled up with data from the server
        this.fetchedFromServer = false;
        this.airline = '';
        //here will be search results
        this.flights = [{
            outbound: [],
            inbound: []
        }]

    }

    availableFlights(availableFlights) {
        this.availableFlights = availableFlights
    }

};

module.exports = Trip;