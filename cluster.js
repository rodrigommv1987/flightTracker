//require
const cluster = require('cluster');
const db = require('./classes/models/DB');
const { workers, actions, state } = require('./classes/models/Constants');

//const
let tripBuilderWorker, tripResolverWorker;
const { workerType: me } = process.env;



if (cluster.isMaster) {

    //set up cluster event listeners
    init();

    //create workers
    tripBuilderWorker = cluster.fork({ workerType: workers.tripBuilderWorker });
    tripResolverWorker = cluster.fork({ workerType: workers.tripResolverWorker });
}
else {

    switch (me) {
        case workers.tripBuilderWorker: {
            require('./classes/workers/TripBuilderWorker');
            break;
        }
        case workers.tripResolverWorker: {
            require('./classes/workers/TripResolverWorker');
            break;
        }
    }
}

function init() {
    cluster.on('online', function (worker) {
    });

    cluster.on('exit', function (worker, code, signal) {
        console.log('Worker ' + worker.process.pid + ' died with code: ' + code + ', and signal: ' + signal);
    });

    cluster.on('message', async (worker, message, handle) => {

        // console.log(`Master received message: ${message.type}`);

        switch (message.from) {
            case workers.tripBuilderWorker: {
                resolveTripBuilderMessage(message);
                break;
            }
            case workers.tripResolverWorker: {
                resolveTripResolverMessage(message);
                break;
            }
            default:
                break;
        }
    });
}

async function resolveTripBuilderMessage(message) {

    switch (message.type) {
        case state.tripBuilderWorker.ready: {
            console.log(`Master: sending ${actions.tripBuilderWorker.buildOneWayTrips.init} action to ${workers.tripBuilderWorker}`);
            tripBuilderWorker.send({
                type: actions.tripBuilderWorker.buildOneWayTrips.init
            });
            break;
        }
        case actions.tripBuilderWorker.buildOneWayTrips.end: {
            console.log(`Master: received ${actions.tripBuilderWorker.buildOneWayTrips.end} action from ${workers.tripBuilderWorker}`);
            const data = await db.selectAllPendingTrips();
            // console.log(JSON.stringify(data));
            console.table(data);

            console.log(`Master: sending ${actions.tripResolverWorker.resolvePendingOneWayTrips.init} action to ${workers.tripResolverWorker}`);
            tripResolverWorker.send({
                type: actions.tripResolverWorker.resolvePendingOneWayTrips.init
            });
            break;
        }
        default:
            break;
    }
}

async function resolveTripResolverMessage(message) {

    switch (message.type) {
        case state.tripResolverWorker.ready: {
            console.log(`Master: sending ${actions.tripResolverWorker.resolvePendingOneWayTrips.init} action to ${workers.tripResolverWorker}`);
            tripResolverWorker.send({
                type: actions.tripResolverWorker.resolvePendingOneWayTrips.init
            });
            break;
        }
        case actions.tripResolverWorker.resolvePendingOneWayTrips.end: {
            console.log(`Master: received ${actions.tripResolverWorker.resolvePendingOneWayTrips.end} action from ${workers.tripResolverWorker}`);
            const allResolvedTrips = await db.selectAllResolvedTrip();
            console.table(allResolvedTrips);
            break;
        }
        default:
            break;
    }
}