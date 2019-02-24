class Flight {
    constructor({ originAirport, destinationAirport, departureDate, arrivalDate, 
        duration = null, adults = 1, children = 0, flightNumber = '', flightKey = '',
        price = 0, hasDiscount = false, discountInPercent = 0, hasPromoDiscount = false}) {

        //basic info
        this.originAirport = originAirport;
        this.destinationAirport = destinationAirport;
        this.departureDate = departureDate;
        this.arrivalDate = arrivalDate;
        this.adults = adults;
        this.children = children;
        this.duration = duration || this.calculateDuration(departureDate, arrivalDate);

        //misc info
        this.flightKey = flightKey;
        this.flightNumber = flightNumber;

        //price related info
        this.price = price;
        this.hasDiscount = hasDiscount;
        this.discountInPercent = discountInPercent;
        this.hasPromoDiscount = hasPromoDiscount;

        //all flight segments that composes the flight
        this.segments = [];
    }

    calculateDuration(departureDate, arrivalDate) {
        //ToDo 
    }
}

module.exports = Flight;