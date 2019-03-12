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
		.then(async tb => {
			await tb.loadAvailableAirports()
			console.log(tb);
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
function buildOneWayTrips() {
	const origin = 'BCN';
	const destination = 'OPO';
	const departure = '2019-03-18';
	const returnDate = '2019-03-21';
	const fs = require('fs');

	new TripBuilder().then(async tb => {
		let i=1;
		for await (let filteredItem of tb.buildOneWayTripsGenerator(origin)){
			// console.log(filteredItem);
			fs.writeFile(`./json/trips${i}.json`, JSON.stringify(filteredItem), () => {}); 
			i++;
			// console.log(JSON.stringify(trips))
		}
	});

	// .then(async tb => {
	// 	const t = await tb.buildOneWayTripsAsync(origin, destination);
	// 	console.log(JSON.stringify(t));
	// });
}

async function testAsyncConstructor() {

	class AsyncConstructor {
		constructor() {
			return (async () => {

				// All async code here
				console.log("constructor: antes de await");
				this.value = await r.fetchAvailableAirports();
				this.value = this.value.slice(0, 2);
				console.log(this.value);
				return this; // when done
			})();
		}
	}

	console.log("antes de instance");
	let instance = await new AsyncConstructor();
	console.log(instance);
}
// testAsyncConstructor();
