//require
const TripResolver = require('../models/TripResolver');
const Trip = require('../models/Trip');
const db = require('../models/DB');
const { actions, state } = require('../models/Constants');

//const
const { workerType: me } = process.env;


process.on("message", async (message) => {

    switch (message.type) {

        case actions.tripResolverWorker.resolvePendingOneWayTrips.init: {

            const tr = await new TripResolver();

            //fetch pendingTrips
            const pendingTrips = Trip.fromJSON(await db.getPendingTripsBatch());

            const resolvedTrips = await tr.resolveOneWayTrips(pendingTrips);

            await db.saveResolvedTrips(resolvedTrips);
            
            process.send({
                from: me,
                type: actions.tripResolverWorker.resolvePendingOneWayTrips.end
            });
            break;
        }
    }
});

//notify to parent process end of init process
process.send({
    from: me,
    type: state.tripResolverWorker.ready
});
