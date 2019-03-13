
const TripBuilder = require('../models/TripBuilder');
const db = require('../models/DB');
const origin = 'OPO';


process.on("message", async (message) => {

    const tb = await new TripBuilder();

    if (message.type === "buildOneWayTrips-init") {

        for await (const trips of tb.buildOneWayTrips(origin)) {
            // console.log('found trips: ', trips);
            // console.log("before savePendingTrips");
            const success = await db.savePendingTrips(trips);
            // console.log("after savePendingTrips");
            (success) ? 
                console.log(`inserted ${trips.length} trips`)
                :
                console.log(`insert failed`)
                ;
        }

        process.send({
            type: 'buildOneWayTrips-end'
        });
    }
});

//notify to parent process end of init process
process.send({
    type: 'tripBuilderWorker-ready'
});
