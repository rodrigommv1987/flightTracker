//require
const TripBuilder = require('../models/TripBuilder');
const db = require('../models/DB');
const { actions, state } = require('../models/Constants');

//const
const { workerType: me } = process.env;

const origin = 'BCN';

process.on("message", async (message) => {

    switch (message.type) {

        case actions.tripBuilderWorker.buildOneWayTrips.init: {

            const tb = await new TripBuilder();

            for await (const trips of tb.buildOneWayTrips(origin)) {
                const success = await db.savePendingTrips(trips);
                (success) ?
                    console.log(`inserted ${trips.length} trips`)
                    :
                    console.log(`insert failed`)
                    ;
            }

            process.send({
                from: me,
                type: actions.tripBuilderWorker.buildOneWayTrips.end
            });
            break;
        }
    }
});

//notify to parent process end of init process
process.send({
    from: me,
    type: state.tripBuilderWorker.ready
});
