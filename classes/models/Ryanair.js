const { RyanairTripAdapter } = require("./RyanairTripAdapter");

const r = require('../utils/Request');
const Airport = require('./Airport')
const cf = require('current-function')

class Ryanair {

    constructor(params) {

        this.name = "Ryanair";
        this.configs = {
            doTrip: {
                dateFormat: 'YYYY-MM-DD'
            },
            locale: 'es-es'
        };

        this.url = {
            doTrip: ''
        }
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
                (error, response, body) => {
                    if (error) {
                        console.log(`Error found in ${cf()}`);
                        console.log(error);
                        return
                    }

                    resolve(body.airports.map(airport => new Airport({
                        name: airport.name,
                        cityCode: airport.cityCode,
                        countryCode: airport.countryCode,
                        iataCode: airport.iataCode
                    })));
                }
            );
        })
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
                (error, response, body) => {
                    if (error) {
                        console.log(`Error found in ${cf()}`);
                        console.log(error);
                        return
                    }

                    resolve(body.airports
                        //get all destination airports for target city
                        .filter(airport => (airport.routes.includes(`city:${cityCode}`)))
                        //create destination object 
                        .map(airport => new Airport({
                            name: airport.name,
                            cityCode: airport.cityCode,
                            countryCode: airport.countryCode,
                            iataCode: airport.iataCode
                        })));
                }
            );
        })
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
                        console.log(`Error found in ${cf()}`);
                        console.log(error);
                        return
                    }

                    resolve(body.map(date => new Date(date)));
                }
            )
        });
    }

    doSingleTrip(trip) {
        const { originAirport, destinationAirport, departureDate, adults = 1, children = 0 } = trip,
            { locale } = this.configs;

            // console.log([
            //     `https://desktopapps.ryanair.com/v4/${locale}/availability?`,
            //     `Origin=${originAirport.iataCode}&`,
            //     `Destination=${destinationAirport.iataCode}&`,
            //     `DateOut=${departureDate}&`,
            //     `INF=0&`,
            //     `CHD=${children}&`,
            //     `TEEN=0&`,
            //     `ADT=${adults}&`,
            //     `FlexDaysIn=1&`,
            //     `FlexDaysOut=1&`,
            //     `IncludeConnectingFlights=true&`,
            //     `RoundTrip=false&`,
            //     `ToUs=AGREED&`,
            //     `exists=false`
            // ].join(''));

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
                        console.log(`Error found in ${cf()}`);
                        console.log(error);
                        return
                    }

                    trip.dateFormat = this.configs.doTrip.dateFormat;

                    resolve(
                        RyanairTripAdapter.doSingleTrip(trip, body)
                    );
                }
            )
        });
    }

    doRoundTrip({ originAirport, destinationAirport, departureDate }) {

    }

    fetchTrip({ }) { }

    doDestination(originAirport, { airportCode: destinationAirport }) {

        // this.fetchAvailableDates(originAirport, destinationAirport)
        //     .then(dates => console.log(dates))
    }
};

module.exports = Ryanair;