//require
const TripResolver = require('../models/TripResolver');
const db = require('../models/DB');
const { actions, state } = require('../models/Constants');

//const
const { workerType: me } = process.env;


process.on("message", async (message) => {

    switch (message.type) {

        case actions.tripResolverWorker.resolvePendingOneWayTrips.init: {

            const tr = await new TripResolver();

            //fetch pendingTrips
            const pendingTrips = await db.getPendingTripsBatch();
            console.table(pendingTrips);

            /*
                convertir los pendingtrips traidos de la base de datos a objetos 
                de la clase Trip, implementar el fromJSON de la clase trip
            */


            const resolvedTrips = await tr.resolveOneWayTrips(pendingTrips);
            // await db.saveResolvedTrips(resolvedTrips);
            // process.send({
            //     from: me,
            //     type: actions.tripResolverWorker.resolvePendingOneWayTrips.end
            // });
            break;
        }
    }
});

//notify to parent process end of init process
process.send({
    from: me,
    type: state.tripResolverWorker.ready
});
