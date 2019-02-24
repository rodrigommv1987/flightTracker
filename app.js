// direct: !(airport.routes.findIndex(route => (route.includes(`connectingFlight:${iataCode}`))) !== -1)

const Ryanair = require('./classes/models/Ryanair')
const Trip = require('./classes/models/Trip')
const moment = require('moment')
const r = new Ryanair();
let t = new Trip();

console.log(null || 'success!');
return;
r.fetchAvailableAirports()
	.then(airports => airports.find(airport => airport.iataCode == 'BCN'))
	.then(originAirport => {
		t.originAirport = originAirport;
		return r.fetchDestinations(originAirport)
	})
	.then(destinations => destinations.find(airport => airport.iataCode == 'KRK'))
	.then(destinationAirport => {
		// t.departureDate = moment().add(1, 'day').format(r.configs.doTrip.dateFormat);
		t.departureDate = moment('2019-06-13').format(r.configs.doTrip.dateFormat);
		t.destinationAirport = destinationAirport;
		// return r.fetchAvailableDates(t.originAirport, t.destinationAirport)
		return r.doSingleTrip(t)
	})
	.then(trip => console.log("fin"))
	// .then(trip => {
	// 	console.log("fin")
	// });
