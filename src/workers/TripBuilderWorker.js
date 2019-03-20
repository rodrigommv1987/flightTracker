//require
const TripBuilder = require('../models/TripBuilder');
const db = require('../models/DB');
const { actions, state } = require('../models/Constants');
const { logTripBuilderWorkerReceive, logTripBuilderWorkerSend, logTripBuilderWorkerMsg } = require('../utils/Utils');

//const
const { workerType: me } = process.env;

const origin = 'BCN';

process.on("message", async (message) => {

    switch (message.type) {

        case actions.tripBuilderWorker.buildOneWayTrips.init: {

            logTripBuilderWorkerReceive(actions.tripBuilderWorker.buildOneWayTrips.init);
            const tb = await new TripBuilder();
            let count = 0;

            for await (const trips of tb.buildOneWayTrips(origin)) {
                const success = await db.savePendingTrips(trips);

                if (success) count += trips.length;
            }
            logTripBuilderWorkerMsg(`Inserted ${count} trips.`);
            logTripBuilderWorkerSend(actions.tripBuilderWorker.buildOneWayTrips.end);
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
