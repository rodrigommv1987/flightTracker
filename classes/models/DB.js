const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';
const dbName = 'flightTracker';

class DB {

    constructor() {

        this.collections = {
            trip: 'trip',
            pendingTrips: 'pendingTrips'
        };
    }

    async selectAllTrip() {

        const { trip } = this.collections,
            collection = await this.getCollection(trip);

        const docs = await collection.find().toArray();

        this.close();
        return docs;
    }

    async saveTrip(t) {
        const { trip } = this.collections,
            collection = await this.getCollection(trip);

        const r = await collection.insertOne(t);

        this.close();

        return (r.insertedCount === 1);
    }

    async selectAllPendingTrips() {

        const { pendingTrips } = this.collections,
            collection = await this.getCollection(pendingTrips);

        const docs = await collection.find().toArray();

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

module.exports = db;