const mongoose = require('mongoose');
const config = require('./config.json');

mongoose.Promise = global.Promise;
mongoose.set('strictQuery', false);

class Connection {
    constructor() {
        this.connectionEstablished = false;
    }

    async connect() {
        if (this.connectionEstablished) {
            console.log("🔁 MongoDB already connected.");
            return;
        }

        try {
            const host = process.env.HOST || 'localhost';
            const isDevelopmentHost = config.SECRET.hosts.includes(host);

            const dbURI = isDevelopmentHost ?
                config.MongoDB.Production.UrlLink :
                config.MongoDB.Development.UrlLink;

            await mongoose.connect(dbURI); // Clean, no deprecated options

            this.connectionEstablished = true;
            console.log("MongoDB connected successfully.");
            
        } catch (error) {
            console.error("❌ MongoDB connection error:", error.message);
            throw error; // Let app.js handle this
        }
    }
}

module.exports = new Connection();