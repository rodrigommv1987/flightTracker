const Flight = require('../Flight');
const Airport = require('../Airport');
const r = require('../../utils/Request');
const moment = require('moment');

class Ryanair {

    constructor(params) {

        this.name = "Ryanair";
        this.configs = {
            doSingleTrip: {
                dateFormat: 'YYYY-MM-DD'
            },
            doRoundTrip: {
                dateFormat: 'YYYY-MM-DD'
            },
            locale: 'es-es'
        };

        this.url = {
            doTrip: '',
            flightSearch: {
                url: 'https://www.ryanair.com/es/es/booking/home/**originAirport**/**destinationAirport**/**departureDate**/**arrivalDate**/**adults**/**teens**/**children**/**infants**',
                dateFormat: 'YYYY-MM-DD'
            }
        };
    }

    findAirport(targetIataCode) {
        const { locale } = this.configs;

        return new Promise((resolve, reject) => {
            r.request({
                method: 'GET',
                json: true,
                url: [
                    `https://api.ryanair.com/aggregate/4/common?`,
                    `embedded=airports&`,
                    `market=${locale}`
                ].join('')
            },
                (error, response, { airports }) => {
                    if (error) {
                        // console.log(`Error found in fetchDestinations`);
                        // console.log(error);
                        return;
                    }

                    const [{ name, cityCode, countryCode, iataCode }] = airports.filter(airport => (airport.iataCode === targetIataCode));
                    
                    resolve(new Airport({
                        name, cityCode, countryCode, iataCode
                    }));
                }
            );
        });
    }

    fetchAvailableAirports() {
        const { locale } = this.configs;

        return new Promise((resolve, reject) => {
            r.request({
                method: 'GET',
                json: true,
                url: [
                    `https://api.ryanair.com/aggregate/4/common?`,
                    `embedded=airports&`,
                    `market=${locale}`
                ].join('')
            },
                (error, response, { airports }) => {
                    if (error) {
                        // console.log(`Error found in fetchAvailableAirports`);
                        // console.log(error);
                        // throw(error);
                        return;
                    }

                    resolve(airports.map(
                        ({ name, cityCode, countryCode, iataCode }) => new Airport({
                            name, cityCode, countryCode, iataCode
                        })
                    ));
                }
            );
        });
    }

    fetchDestinations({ cityCode }) {

        const { locale } = this.configs;

        return new Promise((resolve, reject) => {
            r.request({
                method: 'GET',
                json: true,
                url: [
                    `https://api.ryanair.com/aggregate/4/common?`,
                    `embedded=airports&`,
                    `market=${locale}`
                ].join('')
            },
                (error, response, { airports }) => {
                    if (error) {
                        // console.log(`Error found in fetchDestinations`);
                        // console.log(error);
                        return;
                    }

                    resolve(airports
                        //get all destination airports for target city
                        .filter(airport => (airport.routes.includes(`city:${cityCode}`)))
                        //create destination object 
                        .map(({ name, cityCode, countryCode, iataCode }) => new Airport({
                            name, cityCode, countryCode, iataCode
                        }))
                    );
                }
            );
        });
    }

    fetchAvailableDates({ iataCode: originIataCode }, { iataCode: destinationIataCode }) {

        return new Promise((resolve, reject) => {
            r.request({
                method: 'GET',
                url: `https://services-api.ryanair.com/farfnd/3/oneWayFares/${originIataCode}/${destinationIataCode}/availabilities`,
                json: true
            },
                (error, response, body) => {
                    if (error) {
                        // console.log(`Error found in fetchAvailableDates`);
                        // console.log(error);
                        return;
                    }

                    resolve(body.map(date => new Date(date)));
                }
            );
        });
    }

    doSingleTrip(trip) {

        const { originAirport, destinationAirport, departureDate, adults = 1, children = 0 } = trip,
            { locale, doSingleTrip: { dateFormat } } = this.configs,
            { flightSearch: { url, dateFormat: flightSearchDateFormat } } = this.url;

        return new Promise((resolve, reject) => {
            r.request({
                method: 'GET',
                json: true,
                url: [
                    `https://desktopapps.ryanair.com/v4/${locale}/availability?`,
                    `Origin=${originAirport.iataCode}&`,
                    `Destination=${destinationAirport.iataCode}&`,
                    `DateOut=${departureDate}&`,
                    `INF=0&`,
                    `CHD=${children}&`,
                    `TEEN=0&`,
                    `ADT=${adults}&`,
                    `FlexDaysOut=0&`,
                    `IncludeConnectingFlights=true&`,
                    `RoundTrip=false&`,
                    `ToUs=AGREED&`,
                    `exists=false`
                ].join('')
            },
                (error, response, body) => {
                    if (error) {
                        // console.log(`Error found in doSingleTrip`);
                        // console.log(error);
                        return;
                    }

                    resolve(trip.addOneWayFlight({
                        ...this.parseSingleTripResponse(trip, body),
                        airline: this.name,
                        flightSearchURL: url
                            .replace('**originAirport**', originAirport.iataCode)
                            .replace('**destinationAirport**', destinationAirport.iataCode)
                            .replace('**departureDate**', moment(departureDate).format(flightSearchDateFormat))
                            .replace('**arrivalDate**', '')
                            .replace('**adults**', adults)
                            .replace('**teens**', 0)
                            .replace('**children**', children)
                            .replace('**infants**', 0),
                        timestamp: (+new Date()),
                        dateFormat
                    }));
                }
            );
        });
    }

    parseSingleTripResponse(trip, serverResponse) {

        const [outboundFlight] = serverResponse.trips,
            availableOutboundFlight = outboundFlight.dates[0].flights.length > 0;
        let outboundFlights = [];

        if (availableOutboundFlight) {
            outboundFlights = this.getFlightsFromServerResponse(
                outboundFlight.dates[0].flights,
                trip.originAirport.iataCode,
                trip.destinationAirport.iataCode
            );
        }

        return {
            outbound: {
                availableOutboundFlight,
                flights: outboundFlights
            }
        };
    }

    doRoundTrip(trip) {

        const { originAirport, destinationAirport, departureDate, returnDate, adults = 1, children = 0 } = trip,
            { locale, doRoundTrip: { dateFormat } } = this.configs,
            { flightSearch: { url, dateFormat: flightSearchDateFormat } } = this.url;

        return new Promise((resolve, reject) => {
            r.request({
                method: 'GET',
                json: true,
                url: [
                    `https://desktopapps.ryanair.com/v4/${locale}/availability?`,
                    `Origin=${originAirport.iataCode}&`,
                    `Destination=${destinationAirport.iataCode}&`,
                    `DateOut=${departureDate}&`,
                    `DateIn=${returnDate}&`,
                    `INF=0&`,
                    `CHD=${children}&`,
                    `TEEN=0&`,
                    `ADT=${adults}&`,
                    `FlexDaysOut=0&`,
                    `FlexDaysIn=0&`,
                    `IncludeConnectingFlights=true&`,
                    `RoundTrip=true&`,
                    `ToUs=AGREED&`,
                    `exists=false`
                ].join('')
            },
                (error, response, body) => {
                    if (error) {
                        // console.log(`Error found in doRoundTrip`);
                        // console.log(error);
                        return;
                    }

                    resolve(trip.addRoundTripFlight({
                        ...this.parseRoundTripResponse(trip, body),
                        airline: this.name,
                        flightSearchURL: url
                            .replace('**originAirport**', originAirport.iataCode)
                            .replace('**destinationAirport**', destinationAirport.iataCode)
                            .replace('**departureDate**', moment(departureDate).format(flightSearchDateFormat))
                            .replace('**arrivalDate**', moment(returnDate).format(flightSearchDateFormat))
                            .replace('**adults**', adults)
                            .replace('**teens**', 0)
                            .replace('**children**', children)
                            .replace('**infants**', 0),
                        timestamp: (+new Date()),
                        dateFormat
                    }));
                }
            );
        });
    }

    parseRoundTripResponse(trip, serverResponse) {

        const [outboundFlight, inboundFlight] = serverResponse.trips,
            availableOutboundFlight = outboundFlight.dates[0].flights.length > 0,
            availableInboundFlight = inboundFlight.dates[0].flights.length > 0;
        let outboundFlights = [], inboundFlights = [];

        if (availableOutboundFlight) {
            outboundFlights = this.getFlightsFromServerResponse(
                outboundFlight.dates[0].flights,
                trip.originAirport.iataCode,
                trip.destinationAirport.iataCode
            );
        }
        if (availableInboundFlight) {
            inboundFlights = this.getFlightsFromServerResponse(
                inboundFlight.dates[0].flights,
                trip.originAirport.iataCode,
                trip.destinationAirport.iataCode
            );
        }

        return {
            outbound: {
                availableOutboundFlight,
                flights: outboundFlights
            },
            inbound: {
                availableInboundFlight,
                flights: inboundFlights
            }
        };
    }

    getFlightsFromServerResponse(flights, originAirport, destinationAirport) {

        return flights.map(flightData => {
            const { flightKey, regularFare = null, segments, flightNumber, time, duration } = flightData,
                hasAvailableSeat = (regularFare !== null);

            const flight = new Flight({
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

            return flight;
        });
    }
}

module.exports = Ryanair;