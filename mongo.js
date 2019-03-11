/* eslint-disable */
const db = require('./classes/models/DB');

(async () => {
	const Ryanair = require('./classes/models/implementations/Ryanair');
	const Trip = require('./classes/models/Trip');
	const moment = require('moment');
	const r = new Ryanair();
	const t = new Trip();
	const origin = 'BCN';
	const destination = 'OPO';
	const departure = '2019-03-18';
	const returnDate = '2019-03-21';
	
	// let allPendingTrips = await db.selectAllPendingTrips();
	// console.log("estos son los pendingTrips: ", allPendingTrips);
	
	// console.log("dropping PendingTrips");
	// await db.dropPendingTrips();
	
	// allPendingTrips = await db.selectAllPendingTrips();
	// console.log("estos son los pendingTrips: ", allPendingTrips);

	// return;
	r.fetchAvailableAirports()
		.then(airports => airports.find(airport => airport.iataCode == origin))
		.then(originAirport => {
			t.originAirport = originAirport;
			return r.fetchDestinations(originAirport);
		})
		.then(destinations => destinations.find(airport => airport.iataCode == destination))
		.then(async destinationAirport => {
			t.departureDate = moment(departure).format(r.configs.doSingleTrip.dateFormat);
			t.destinationAirport = destinationAirport;
			t.returnDate = moment(returnDate).format(r.configs.doRoundTrip.dateFormat);
			// console.log(t);
			// await db.savePendingTrip(t);
		});
})();