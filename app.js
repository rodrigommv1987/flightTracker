/* eslint-disable */
console.log('*******************************************************');
console.log('*******************************************************');
console.log('*******************************************************');
// direct: !(airport.routes.findIndex(route => (route.includes(`connectingFlight:${iataCode}`))) !== -1)

const Ryanair = require('./classes/models/implementations/Ryanair');
const Trip = require('./classes/models/Trip');
const TripBuilder = require('./classes/models/TripBuilder');
const moment = require('moment');
const r = new Ryanair();
const t = new Trip();

// let a = {
// 	name: 'Rodrigo',
// 	surname: 'Martinez'
// };
// return;

// testTripBuilder();
function testTripBuilder() {
	new TripBuilder()
		.then(tb => {
			tb.loadAvailableAirports().then(a => console.log(a));
			return;
			const origin = 'BCN';
			// const destination = 'OPO';
			const departure = '2019-03-18';
			const returnDate = '2019-03-21';

			// const destination = 'ATH';
			const destination = 'FCO';
			// const departure = '2019-03-12';

			// const destination = 'CAG';
			// const departure = '2019-03-15';
			// tb.buildFridayToSundayTrips(origin,destination);
		});
}

// work();
function work() {
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
			return r.fetchDestinations(originAirport);
		})
		.then(destinations => destinations.find(airport => airport.iataCode == destination))
		.then(destinationAirport => {
			t.departureDate = moment(departure).format(r.configs.doSingleTrip.dateFormat);
			t.destinationAirport = destinationAirport;
			t.returnDate = moment(returnDate).format(r.configs.doRoundTrip.dateFormat);

			// return r.fetchAvailableDates(t.originAirport, t.destinationAirport);
			// return r.doSingleTrip(t);
			return r.doRoundTrip(t);
		})
		.then(trip => {

			console.log(JSON.stringify(trip));
			// trip.flights.forEach(flight => {
			// 	console.log(flight);
			// 	flight.oubound
			// });
			console.log("fin");
		});
}

workAsync();
async function workAsync(){
	const origin = 'BCN';
	const destination = 'OPO';
	const departure = '2019-03-18';
	const returnDate = '2019-03-21';

	// const destination = 'ATH';
	// const departure = '2019-03-12';

	// const destination = 'CAG';
	// const departure = '2019-03-15';

	const availAirports = await r.fetchAvailableAirports();
	const originAirport = availAirports.find(airport => airport.iataCode == origin);
	const destinations = await r.fetchDestinations(originAirport);
	const destinationAirport = destinations.find(airport => airport.iataCode == destination);

	const t = new Trip(
		originAirport,
		destinationAirport,
		moment(departure).format(r.configs.doSingleTrip.dateFormat),
		moment(returnDate).format(r.configs.doRoundTrip.dateFormat)
	);

	// console.log(t);

	const resolvedOneWayTrip = await r.doSingleTrip(t);
	console.log(resolvedOneWayTrip);

	const resolvedRoundTrip = await r.doRoundTrip(t);
	console.log(resolvedRoundTrip);

	/*

			// return r.fetchAvailableDates(t.originAirport, t.destinationAirport);
			// return r.doSingleTrip(t);
			return r.doRoundTrip(t);
		})
		.then(trip => {

			console.log(JSON.stringify(trip));
			// trip.flights.forEach(flight => {
			// 	console.log(flight);
			// 	flight.oubound
			// });
			console.log("fin");
		});
		*/
}

// buildOneWayTrips()
function buildOneWayTrips() {
	const origin = 'BCN';
	const destination = 'OPO';
	const departure = '2019-03-18';
	const returnDate = '2019-03-21';

	new TripBuilder()
		.then(tb => {
			tb.buildOneWayTrips(origin, destination).then(trips =>
				console.log(JSON.stringify(trips))
			);
		});
	// .then(async tb => {
	// 	const t = await tb.buildOneWayTripsAsync(origin, destination);
	// 	console.log(JSON.stringify(t));
	// });
}

function testPromiseAll() {
	const fs = require('fs');

	return Promise.all([
		new Promise(resolve => {
			fs.readdir(__dirname, (err, files) => resolve(files));
		}),
		new Promise(resolve => {
			fs.readdir(__dirname, (err, files) => resolve(files));
		}),
		new Promise(resolve => {
			fs.readdir(__dirname, (err, files) => resolve(files));
		}),
	]);
}

// testPromiseAll().then(values => {
// 	for (const value of values) {
// 		console.log(value);
// 	}
// })