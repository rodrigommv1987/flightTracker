// direct: !(airport.routes.findIndex(route => (route.includes(`connectingFlight:${iataCode}`))) !== -1)

const Ryanair = require('./classes/models/Ryanair')
const Trip = require('./classes/models/Trip')
const moment = require('moment')
const r = new Ryanair();
let t = new Trip();


// let a = {
// 	name: 'Rodrigo',
// 	surname: 'Martinez',
// };

// return;
const origin = 'BCN';
const destination = 'OPO';
const departure = '2019-03-18';
const returnDate = '2019-03-21';
// const destination = 'ATH';
// const departure = '2019-03-12';

// const destination = 'CAG';
// const departure = '2019-03-15';


r.fetchAvailableAirports()
	.then(airports => airports.find(airport => airport.iataCode == origin))
	.then(originAirport => {
		t.originAirport = originAirport;
		return r.fetchDestinations(originAirport)
	})
	.then(destinations => destinations.find(airport => airport.iataCode == destination))
	.then(destinationAirport => {
		t.departureDate = moment(departure).format(r.configs.doSingleTrip.dateFormat);
		t.destinationAirport = destinationAirport;
		t.returnDate = moment(returnDate).format(r.configs.doRoundTrip.dateFormat);

		// return r.fetchAvailableDates(t.originAirport, t.destinationAirport)
		// return r.doSingleTrip(t)
		return r.doRoundTrip(t)
	})
	.then(trip => {

		console.log(JSON.stringify(trip));
		// trip.flights.forEach(flight => {
		// 	console.log(flight);
		// 	flight.oubound
		// });
		console.log("fin");
	})
