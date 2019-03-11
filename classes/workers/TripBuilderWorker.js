
// console.log(`starting process of type: ${process.env.workerType}`);

const TripBuilder = require('../models/TripBuilder');
const db = require('../models/DB');

const origin = 'BCN';
const destination = 'OPO';
const departure = '2019-03-18';
const returnDate = '2019-03-21';

const tb = new TripBuilder().then(tb => {

    process.on("message", async (message) => {

        if (message.type === "createTrips") {
            console.log("TripBuilderWorker starting to create trips");
            const trips = await tb.buildOneWayTrips(origin, destination);
            console.log("TripBuilderWorker finished creating trips");
            // console.log(JSON.stringify(trips));
            process.send({
                type: 'finishedCreateTrips',
                data: JSON.stringify(trips)
            });
            process.exit(0);
        }
    });

    //notify to parent process end of init process
    process.send({
        type: 'finishedInit'
    });
});