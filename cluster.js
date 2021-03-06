//require
const cluster = require('cluster');
const cron = require("node-cron");
const db = require('./src/models/DB');
const { workers, actions, state } = require('./src/models/Constants');
const { logMasterSend, logMasterReceive } = require('./src/utils/Utils');

//const
let tripBuilderWorker, tripResolverWorker, tripBuilderWorkerInit = false, tripResolverWorkerInit = false;
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
            require('./src/workers/TripBuilderWorker');
            break;
        }
        case workers.tripResolverWorker: {
            require('./src/workers/TripResolverWorker');
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
            console.log("init cron job: buildOneWayTrips");
            cron.schedule("5 * * * * *", function () {
                logMasterSend(actions.tripBuilderWorker.buildOneWayTrips.init, workers.tripBuilderWorker);
                tripBuilderWorker.send({
                    type: actions.tripBuilderWorker.buildOneWayTrips.init
                });
            }).start();
            break;
        }
        case actions.tripBuilderWorker.buildOneWayTrips.end: {
            logMasterReceive(actions.tripBuilderWorker.buildOneWayTrips.end, workers.tripBuilderWorker);
            console.log('');
            // logMasterSend(actions.tripResolverWorker.resolvePendingOneWayTrips.init, workers.tripResolverWorker);
            // tripResolverWorker.send({
            //     type: actions.tripResolverWorker.resolvePendingOneWayTrips.init
            // });
            break;
        }
        default:
            break;
    }
}

async function resolveTripResolverMessage(message) {

    switch (message.type) {
         case actions.tripResolverWorker.resolvePendingOneWayTrips.end: {
            logMasterReceive(actions.tripResolverWorker.resolvePendingOneWayTrips.end, workers.tripResolverWorker);
            const allResolvedTrips = await db.selectAllResolvedTrip();
            console.table(allResolvedTrips);
            process.exit(0);
            break;
        }
        default:
            break;
    }
}