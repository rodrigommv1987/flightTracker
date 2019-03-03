class Flight {

    constructor({ originAirport, destinationAirport, departureDate,
        arrivalDate, hasAvailableSeat, duration = null, adults = 1,
        children = 0, flightNumber = '', flightKey = '' }) {

        //basic info
        this.originAirport = originAirport;
        this.destinationAirport = destinationAirport;
        this.departureDate = departureDate;
        this.arrivalDate = arrivalDate;
        this.duration = duration || this.calculateDuration(departureDate, arrivalDate);
        this.adults = adults;
        this.children = children;

        //misc info
        this.flightKey = flightKey;
        this.flightNumber = flightNumber;
        this.hasAvailableSeat = hasAvailableSeat;

        //all flight segments that composes the flight
        this.segments = [];
    }

    setFlightPrice({ fareKey = '', fareClass = '', price = 0, hasDiscount = false,
        discountInPercent = 0, hasPromoDiscount = false }) {

        this.priceInfo = {
            fareKey, fareClass, price, hasDiscount, discountInPercent, hasPromoDiscount
        };
        return this;
    }

    addSegment(segments) {
        this.segments.push(...segments.map(
            ({ origin, destination, flightNumber, duration, time: [departureTime, arrivalTime] }) => ({
                origin, destination, flightNumber, duration, departureTime, arrivalTime
            }))
        );
        this.directFlight = this.segments.length === 1;
    }

    calculateDuration(departureDate, arrivalDate) {
        //TODO: 
    }
}

module.exports = Flight;