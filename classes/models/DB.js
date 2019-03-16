const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';
const dbName = 'flightTracker';

class DB {

    constructor() {

        this.collections = {
            resolvedTrips: 'resolvedTrips',
            pendingTrips: 'pendingTrips'
        };
    }

    async selectAllResolvedTrip() {

        const { resolvedTrips } = this.collections,
            collection = await this.getCollection(resolvedTrips);

        const docs = await collection.find().toArray();

        this.close();
        return docs;
    }

    async saveResolvedTrips(rt) {
        const { resolvedTrips } = this.collections,
            collection = await this.getCollection(resolvedTrips);

        const r = await collection.insertMany(rt);

        this.close();

        return (r.insertedCount === rt.length);
    }

    async selectAllPendingTrips() {

        const { pendingTrips } = this.collections,
            collection = await this.getCollection(pendingTrips);

        const docs = await collection.find().toArray();

        this.close();
        return docs;
    }

    async getPendingTripsBatch() {

        const batchSize = 10,
            { pendingTrips } = this.collections,
            collection = await this.getCollection(pendingTrips);

        const docs = await collection.find().limit(batchSize).toArray();
        const ids = docs.map(function (doc) { return doc._id; });
        await collection.deleteMany({ _id: { $in: ids } });
        this.close();
        return docs;
    }

    async savePendingTrip(pt) {

        if (Array.isArray(pt)) {
            this.savePendingTrip(pt);
            return;
        }

        const { pendingTrips } = this.collections,
            collection = await this.getCollection(pendingTrips);

        const r = await collection.insertOne(pt);

        this.close();

        return (r.insertedCount === 1);
    }

    async savePendingTrips(pt) {

        if (pt.length === 0) return false;

        const { pendingTrips } = this.collections,
            collection = await this.getCollection(pendingTrips);

        const r = await collection.insertMany(pt);

        this.close();

        return (r.insertedCount === pt.length);
    }

    async dropPendingTrips() {
        const { pendingTrips } = this.collections;
        await this.dropCollection(pendingTrips);
    }

    async dropCollection(collection) {
        const client = await new MongoClient(url, { useNewUrlParser: true }).connect();
        await client.db(dbName).collection(collection).deleteMany();
        client.close();
    }

    async getCollection(collection) {
        this.client = await new MongoClient(url, { useNewUrlParser: true }).connect();
        return this.client.db(dbName).collection(collection);
    }

    close() {
        this.client.close();
    }
}

const db = new DB();

// (async (params) => {
//     const a = await db.getPendingTripsBatch();
//     console.table(a);
// })();

module.exports = db;