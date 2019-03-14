/* eslint-disable */
console.log('*******************************************************');
console.log('*******************************************************');
console.log('*******************************************************');
// direct: !(airport.routes.findIndex(route => (route.includes(`connectingFlight:${iataCode}`))) !== -1)
const { workers, actions, state } = require('./classes/models/Constants');
const me = 'tripBuilderWorker';
// console.log(me);
// console.log(actions);
// console.log(actions[me]);
// console.log(actions[me].buildOneWayTrips);
console.log(actions[me].buildOneWayTrips.end);
return;
const Ryanair = require('./classes/models/implementations/Ryanair');
const Trip = require('./classes/models/Trip');
const TripBuilder = require('./classes/models/TripBuilder');
const TripResolver = require('./classes/models/TripResolver');
const moment = require('moment');
const r = new Ryanair();
const t = new Trip();

// let a = {
// 	name: 'Rodrigo',
// 	surname: 'Martinez'
// };
// return;


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

// buildOneWayTrips()
function buildOneWayTrips() {
	const origin = 'BCN';
	const destination = 'OPO';
	const departure = '2019-03-18';
	const returnDate = '2019-03-21';
	const fs = require('fs');

	new TripBuilder().then(async tb => {
		let i = 1;
		for await (let trips of tb.buildOneWayTripsGenerator(origin)) {
			// console.log(trips);
			fs.writeFile(`./json/trips${i}.json`, JSON.stringify(trips), () => { });
			i++;
		}
	});

	// .then(async tb => {
	// 	const t = await tb.buildOneWayTripsAsync(origin, destination);
	// 	console.log(JSON.stringify(t));
	// });
}

resolveOneWayTripTest();
async function resolveOneWayTripTest() {
	const origin = 'BCN';
	const tb = await new TripBuilder();

	const tripsGenerator = tb.buildOneWayTrips(origin);
	const trips = await tripsGenerator.next();
	const batch = trips.value.slice(0, 5);
	console.table(batch);

	const tr = await new TripResolver();
	const resolvedBatch = await tr.resolveOneWayTrips(batch);
	console.log(JSON.stringify(resolvedBatch));
}