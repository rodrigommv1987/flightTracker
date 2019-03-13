var cluster = require('cluster');
let tripBuilderWorker; 
const db = require('./classes/models/DB');

if (cluster.isMaster) {

    console.log('Master cluster setting up 1 worker...');

    //set up cluster event listeners
    init();

    tripBuilderWorker = cluster.fork({ workerType: 'tripBuilderWorker' });

}
else {
    require('./classes/workers/TripBuilderWorker');
}

function init() {
    cluster.on('online', function (worker) {
    });

    cluster.on('exit', function (worker, code, signal) {
        console.log('Worker ' + worker.process.pid + ' died with code: ' + code + ', and signal: ' + signal);
    });

    cluster.on('message', async (worker, message, handle) => {
        
        // console.log(`Master received message: ${message.type}`);

        switch (message.type) {
            case 'tripBuilderWorker-ready': {
                console.log("Master: sending buildOneWayTrips order to tripBuilderWorker");
                tripBuilderWorker.send({
                    type: 'buildOneWayTrips-init'
                });
                break;
            }
            case 'buildOneWayTrips-end': {
                console.log("Master: buildOneWayTrips-end order received from tripBuilderWorker");
                const data = await db.selectAllPendingTrips();
                console.log(JSON.stringify(data)); 
                process.exit(0);
                break;
            }
            default:
                break;
        }
    });
}