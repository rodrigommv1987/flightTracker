var cluster = require('cluster');
let tripBuilderWorker; 


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

    cluster.on('message', (worker, message, handle) => {
        
        console.log(`Master received message: ${message.type}`);

        switch (message.type) {
            case 'tripBuilderWorkerFinishedInit': {
                console.log("sending createTrips order to tripBuilderWorker");
                tripBuilderWorker.send({
                    type: 'createTrips'
                });
                break;
            }
            case 'finishedCreateTrips': {
                console.log("trips received from tripBuilderWorker");
                console.log((message.data));
                process.exit(0);                
                break;
            }
            default:
                break;
        }
    });
}