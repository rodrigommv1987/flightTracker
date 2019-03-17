const workers = {
    tripBuilderWorker: 'tripBuilderWorker',
    tripResolverWorker: 'tripResolverWorker'
};

const actions = {
    [workers.tripBuilderWorker]: {
        buildOneWayTrips: {
            init: 'buildOneWayTrips-init',
            end: 'buildOneWayTrips-end'
        }
    },
    [workers.tripResolverWorker]: {
        resolvePendingOneWayTrips: {
            init: 'resolvePendingOneWayTrips-init',
            end: 'resolvePendingOneWayTrips-end'
        }
    }
};

const state = {
    [workers.tripBuilderWorker]: {
        ready: `${workers.tripBuilderWorker}-ready`
    },
    [workers.tripResolverWorker]: {
        ready: `${workers.tripResolverWorker}-ready`
    }
};

module.exports.workers = workers;
module.exports.actions = actions;
module.exports.state = state;