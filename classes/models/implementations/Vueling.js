const r = require('../../utils/Request');
const Airport = require('../Airport');

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
            doTrip: ''
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
}

module.exports = Vueling;