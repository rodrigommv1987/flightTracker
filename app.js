/* eslint-disable */
console.log('*******************************************************');
console.log('*******************************************************');
console.log('*******************************************************');
// direct: !(airport.routes.findIndex(route => (route.includes(`connectingFlight:${iataCode}`))) !== -1)
const { workers, actions, state } = require('./src/models/Constants');
const Ryanair = require('./src/models/implementations/Ryanair');
const Trip = require('./src/models/Trip');
const TripBuilder = require('./src/models/TripBuilder');
const TripResolver = require('./src/models/TripResolver');
const moment = require('moment');
const db = require('./src/models/DB');
const r = new Ryanair();
const t = new Trip();

// workAsync();
async function workAsync() {
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
}

buildOneWayTrips()
async function buildOneWayTrips() {
	const tr = await new TripBuilder();
	
	console.log(typeof tr.getImplementations);
	// console.log(Object.getOwnPropertyDescriptor(tr,tr.getImplementations));
	
	// console.log(Object.entries(tr));

	// console.log(Object.getOwnPropertyDescriptors(tr));
	// console.log(Object.getOwnPropertyNames(tr));
	// console.log(Object.getPrototypeOf(tr));
	// console.log(Object.keys(tr));
	// console.log(tr.getImplementations);
	return;


	const origin = 'BCN';
	const destination = 'OPO';
	const departure = '2019-03-18';
	const returnDate = '2019-03-21';
	const fs = require('fs');

	const originAirport = await r.findAirport(origin);
	console.log(originAirport);
	return;
	const destinationAirport = await r.findAirport(destination);
	const availableDestinations = await r.fetchDestinations(destinationAirport);
	const availableDates = await r.fetchAvailableDates(originAirport, destinationAirport);
	
	console.table(originAirport);
	console.table(destinationAirport);
	console.table(availableDestinations);
	console.table(availableDates);

	// const tb = await new TripBuilder();

	// for await (const trips of tb.buildOneWayTrips(origin)) {

	// 	if (trips.length === 0) {
	// 		// console.log(trips);
	// 		process.exit(0);
	// 	}
	// }


	//for each available destination
	// .then(async tb => {
	// 	const t = await tb.buildOneWayTripsAsync(origin, destination);
	// 	console.log(JSON.stringify(t));
	// });
}

// resolveOneWayTripTest();
async function resolveOneWayTripTest() {
	// const origin = 'BCN';
	// const tb = await new TripBuilder();

	// const tripsGenerator = tb.buildOneWayTrips(origin);
	// const trips = await tripsGenerator.next();
	// const batch = trips.value.slice(0, 5);

	const pendingTrips = await db.getPendingTripsBatch();
	console.table(pendingTrips);

	const tr = await new TripResolver();
	const resolvedBatch = await tr.resolveOneWayTrips(Trip.fromJSON(pendingTrips));
	console.table(resolvedBatch);
}