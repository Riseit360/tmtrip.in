// Npm Modules
const mongoose = require('mongoose');

// Config import
const config = require('./config.json');

// Mongoose Setup
mongoose.Promise = global.Promise;
mongoose.set('strictQuery', false);



class Connection {

    // Singleton pattern
    constructor() {
        this.connectionEstablished = false;
    }

    async connect() {
        if (this.connectionEstablished) {
            console.log("🔁 MongoDB already connected.");
            return;
        }

        try {
            // Determine host environment
            const host = require('os').hostname();  
            const isDevelopmentHost = config.SECRET.hosts.includes(host);

            // Choose DB URI based on environment
            const dbURI = isDevelopmentHost ?
                config.MongoDB.Production.UrlLink :
                config.MongoDB.Development.UrlLink;
            console.log('dbURI: ', dbURI);


            // Clean, no deprecated options
            await mongoose.connect(dbURI);

            this.connectionEstablished = true;
            console.log("MongoDB connected successfully.");
        } catch (error) {
            console.error("❌ MongoDB connection error:", error.message);
            throw error; // Let app.js handle this
        }
    }
}

module.exports = new Connection();