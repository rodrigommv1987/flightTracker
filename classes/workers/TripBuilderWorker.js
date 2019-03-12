
const TripBuilder = require('../models/TripBuilder');


const origin = 'BCN';

new TripBuilder().then(tb => {

    process.on("message", async (message) => {

        if (message.type === "createTrips") {
    
            const trips = await tb.buildOneWayTrips(origin);
            // console.log(JSON.stringify(trips));

            // for await (const filteredItem of filterAsyncData())
            // console.log(filteredItem);

            process.send({
                type: 'finishedCreateTrips',
                data: JSON.stringify(trips)
            });
        }
    });

    //notify to parent process end of init process
    process.send({
        type: 'tripBuilderWorkerFinishedInit'
    });
});