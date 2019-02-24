const request = require('request');
const fs = require('fs');

let origin = 'BCN',
    destination = 'OPO';

function getHome() {
    request({
        method: 'GET',
        uri: 'https://www.ryanair.com',
        headers: {
            'authority': 'www.ryanair.com',
            'method': 'GET',
            'path': '/',
            'scheme': 'https',
            'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
            'accept-encoding': 'gzip, deflate, br',
            'accept-language': 'es-ES,es;q=0.9,en;q=0.8',
            'cache-control': 'no-cache',
            'cookie': 'RYANSESSION=XF2YeQolAvQAADFx9gMAAABe',
            'dnt': '1',
            'pragma': 'no-cache',
            'upgrade-insecure-requests': '1',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.81 Safari/537.36'
        }
    },
        function (error, response, body) {
            if (error) {
                console.log("Error found");
                console.log(error);
                return
            }
            // console.log(response.headers);
            console.log(body);

        }
    )
}

// getHome()

function b(origin, destination) {

    var proxyUrl = "http://178.219.171.43:45637";

    var proxiedRequest = request.defaults({ 'proxy': proxyUrl });

    // proxiedRequest.get({
    request.get({
        uri: `https://services-api.ryanair.com/farfnd/3/oneWayFares/${origin}/${destination}/availabilities`,
        json: true,
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Accept-Encoding': 'gzip, deflate, br',
            'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
            'DNT': '1',
            'Host': 'services-api.ryanair.com',
            'Origin': 'https://www.ryanair.com',
            'Pragma': 'no-cache',
            'Referer': 'https://www.ryanair.com/es/es/',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.81 Safari/537.36',
        }
    },
        function (error, response, body) {
            if (error) {
                console.log("Error found");
                console.log(error);
                return
            }
            // console.log(response.request);
            // console.log(body);
            body.forEach(date => console.log(new Date(date)));

        }
    )
}

b(origin, destination);

function c(origin, destination) {
    // https://desktopapps.ryanair.com/v4/es-es/availability?ADT=1&CHD=0&DateIn=2019-09-12&DateOut=2019-09-05&Destination=OPO&FlexDaysIn=6&FlexDaysOut=4&INF=0&IncludeConnectingFlights=true&Origin=BCN&RoundTrip=true&TEEN=0&ToUs=AGREED&exists=false&promoCode=
    request({
        method: 'GET',
        uri: `https://desktopapps.ryanair.com/v4/es-es/availability?ADT=1&CHD=0&DateIn=2019-09-12&DateOut=2019-09-05&Destination=${destination}&FlexDaysIn=6&FlexDaysOut=4&INF=0&IncludeConnectingFlights=true&Origin=${origin}&RoundTrip=true&TEEN=0&ToUs=AGREED&exists=false&promoCode=`,
        headers: {
            'authority': 'desktopapps.ryanair.com',
            'method': 'GET',
            'path': `/v4/es-es/availability?ADT=1&CHD=0&DateIn=2019-09-12&DateOut=2019-09-05&Destination=${destination}&FlexDaysIn=6&FlexDaysOut=4&INF=0&IncludeConnectingFlights=true&Origin=${origin}&RoundTrip=true&TEEN=0&ToUs=AGREED&exists=false&promoCode=`,
            'scheme': 'https',
            'accept': 'application/json, text/plain, */*',
            'accept-encoding': 'gzip, deflate, br',
            'accept-language': 'es-ES,es;q=0.9,en;q=0.8',
            'cache-control': 'no-cache',
            'cookie': 'RYANSESSION=XF2YeQolAvQAADFx9gMAAABe; check=true; mkt=/es/es/; fr-correlation-id=af4fc757-89b3-4317-a792-37c083cec456; AMCVS_64456A9C54FA26ED0A4C98A5%40AdobeOrg=1; agses=AZ6ujoYBAHE6A4v0jdZI9eIiJWzfnDE.; agso=AeRN-F4BANmwBIv0jdZIXAz781yxZyk.; agscs=AV81accBANmwBIv0jdZIXAz783WtlYQ.; _pxvid=a6d35350-2bd0-11e9-b02f-dbad667f84b7; AMCV_64456A9C54FA26ED0A4C98A5%40AdobeOrg=-330454231%7CMCIDTS%7C17936%7CMCMID%7C00750383135415228663698140124762013087%7CMCAAMLH-1550255877%7C6%7CMCAAMB-1550255877%7C6G1ynYcLPuiQxYZrsz_pkqfLG9yMXBpb2zX5dvJdYQJzPXImdj0y%7CMCOPTOUT-1549658276s%7CNONE%7CMCAID%7CNONE%7CMCCIDH%7C-265859108%7CMCSYNCSOP%7C411-17943%7CvVersion%7C3.1.2; s_cc=true; _px3=1bdf8f7e7af952c3e287e363b5a5111202683036ebcb3e4cc74247a0283ecf86:7sb9uimp4f4w+IKEYWpNRDeXbfEP4Ct0SDF5Px9i8rEBntlSEuq518lRN06dccOJlijkXhsowRCeYr8OrVKVPQ==:1000:WqM+FsCIcYhLty0ohZ5pZIiTV926AgsPbDqNMVZTSNY0uBm4klMI4wADZKhfMvKp7rAMo7jUtjFiH5ydMyBgLMCZP77c2lHdHQ0WZ6BqMr0WOu048QbDFBhzhipg0/mBgvOxXygTk4ebNIkGUoHyQJNbXUGQ7NRf6ENXZj9ILHI=; s_nr2=1549654168291-Repeat; s_sq=%5B%5BB%5D%5D; mbox=PC#f3e6a2fc47d04c0ab445439b6c4534ae.26_13#1612898971|session#68c33dbc0c114a288eec76ae262f8144#1549656031',
            'dnt': '1',
            'origin': 'https://www.ryanair.com',
            'pragma': 'no-cache',
            'referer': `https://www.ryanair.com/es/es/booking/home/${origin}/${destination}/2019-09-07/2019-09-14/1/0/0/0`,
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.81 Safari/537.36'
        }
    },
        function (error, response, body) {
            if (error) {
                console.log("Error found");
                console.log(error);
                return
            }
            // console.log(response.headers);
            console.log(body);

        }
    )


}

// c(origin, destination);

function getDestinations() {
    request({
        method: 'GET',
        json: true,
        uri: 'https://api.ryanair.com/aggregate/4/common?embedded=airports,countries,cities,regions,nearbyAirports,defaultAirport&market=es-es'
    },
        function (error, response, body) {
            if (error) {
                console.log("Error found");
                console.log(error);
                return
            }
            // console.log(response.statusCode);
            console.log(JSON.stringify(body));
            // fs.writeFileSync('destinations.json', JSON.stringify(body));
        }
    )
    //.pipe(fs.createWriteStream('destinations1.json'))
}
// getDestinations();

function getStations() {
    request({
        method: 'GET',
        json: true,
        headers : {
            'accept': 'application/json, text/plain, */*',
            'authority': 'desktopapps.ryanair.com',
            'method': 'GET',
            'path': '/v4/es-es/res/stations',
            'scheme': 'https',
            'accept-encoding': 'gzip, deflate, br',
            'accept-language': 'es-ES,es;q=0.9,en;q=0.8',
            'cache-control': 'no-cache',
            'cookie': 'RYANSESSION=XF2YeQolAvQAADFx9gMAAABe; check=true; mkt=/es/es/; fr-correlation-id=af4fc757-89b3-4317-a792-37c083cec456; AMCVS_64456A9C54FA26ED0A4C98A5%40AdobeOrg=1; agses=AZ6ujoYBAHE6A4v0jdZI9eIiJWzfnDE.; agso=AeRN-F4BANmwBIv0jdZIXAz781yxZyk.; agscs=AV81accBANmwBIv0jdZIXAz783WtlYQ.; _pxvid=a6d35350-2bd0-11e9-b02f-dbad667f84b7; s_cc=true; s_nr2=1549654168291-Repeat; s_sq=%5B%5BB%5D%5D; mbox=PC#f3e6a2fc47d04c0ab445439b6c4534ae.26_13#1612898971|session#68c33dbc0c114a288eec76ae262f8144#1549656031; agsd=vA627NqYcLknOHwsZaLZsDwwd31JMTW5XsNL5cKbsJPUHA2H; agsn=643vg7Bzsr-XwNpn35zOoiKRTCXyhyHAVcPPg-mq4hU.; agssn=AUVuTycBAJR-4K8EjtZIpwEOog..; _px3=1dad7b656cf4d879f0a22a5655f905fb51d86f8e14340d8c35e06663cd9d1834:jtc0QsG0hUKYpSQ+lN3GNynBFdwLOEfK6krVhGrKpRg3ng4tgFZJ0VxwVYqtnBCP3iDgW7wM9lSW5w9vUSNXew==:1000:xe+9bbxKkyV985xrefEbElie3Q9oJeQeOxJC6cyIvScuLzlG9PwyCeuof0huspMzZOgEwml9epi1voV7qtao70SSBmQqakicPd0dUOfeo/0/z5SguD4DABkiqe8KnrGRh6W/PAuqfOtazweavPvCcGOlOr6r5G3ia0Fmbnc21Lo=; AMCV_64456A9C54FA26ED0A4C98A5%40AdobeOrg=-330454231%7CMCIDTS%7C17941%7CMCMID%7C00750383135415228663698140124762013087%7CMCAAMLH-1550255877%7C6%7CMCAAMB-1550080337%7C6G1ynYcLPuiQxYZrsz_pkqfLG9yMXBpb2zX5dvJdYQJzPXImdj0y%7CMCOPTOUT-1549658276s%7CNONE%7CMCAID%7CNONE%7CMCCIDH%7C-265859108%7CMCSYNCSOP%7C411-17943%7CvVersion%7C3.1.2',
            'dnt': '1',
            'origin': 'https://www.ryanair.com',
            'pragma': 'no-cache',
            'referer': 'https://www.ryanair.com/es/es/',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.81 Safari/537.36'
        },
        uri: 'https://desktopapps.ryanair.com/v4/es-es/res/stations'
    },
        function (error, response, body) {
            if (error) {
                console.log("Error found");
                console.log(error);
                return
            }

            //response.on('end', () => console.log("end event emmited"))
            // console.log(response.statusCode);
            //  console.log(JSON.stringify(body));
             console.log((body));
            // fs.writeFileSync('destinations.json', JSON.stringify(body));
        }
    )
    //.on('data', (data) => console.log("data event emmited", data.toString()))
    //.pipe(fs.createWriteStream('stations.json'))
}
// getStations();