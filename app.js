// Required Modules
const express = require('express');
const dotenv = require('dotenv');
const http = require('http');
const cors = require('cors');
const path = require('path');
const session = require('express-session');
const cookieParser = require('cookie-parser');

// Database Connection Middleware 
const dbConnection = require('./config/connection');

// App Initialization
dotenv.config();
const app = express();
const port = process.env.PORT || 3000;


// Global Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


// Session Configuration
app.use(
    session({
        name: "app.sid", // custom session name
        secret: process.env.SESSION_SECRET || "supersecretkey",
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            maxAge: 1000 * 60 * 60,
            secure: false,
            sameSite: "lax"
        }
    })
);


// View Engine (EJS)
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


// CORS Configuration (FIXED)
app.use(
    cors({
        origin: true, // allow current origin
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true
    })
);


// Static Files
app.use(express.static(path.join(__dirname, "public")));
  

// Global Template Variables
app.use((req, res, next) => {
    res.locals.errors = {};
    res.locals.old = {};
    res.locals.success = null;
    next();
});


// Routesz
app.use("/", require("./routes/mainRoutes"));
app.use("/", require("./routes/FlightRoutes"));


// 404 Handler
app.use((req, res) => {
    res.status(404).render("pages/404error");
});



// Start Server after DB Connection
dbConnection.connect().then(() => {
    // Server Start
    const server = http.createServer(app);
    server.listen(port, () => {
        console.log(`🚀 Server running on port ${port}`);
        console.log(`🌐 http://localhost:${port}`);
    });
}).catch((err) => {
    console.error("❌ Failed to start server. DB connection error:", err);
    process.exit(1); // Exit if DB didn't connect
});