const r = require('../../utils/Request');
const Flight = require('../Flight');
const Airport = require('../Airport');
const moment = require('moment');

class Vueling {

    constructor(params) {

        this.name = "Vueling";
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

module.exports = Vueling;