// Required Modules
const express = require('express');
const dotenv = require('dotenv');
const http = require('http');
const path = require('path');
const session = require('express-session');
const cookieParser = require('cookie-parser');

// Initialize App
dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Session Setup
app.use(
    session({
        secret: process.env.SESSION_SECRET || "supersecretbijaykey123",
        resave: false, 
        saveUninitialized: false,
        cookie: {
            httpOnly: true,          // Protects from JS access
            maxAge: 1000 * 60 * 60,  // 1 hour session
            secure: false            // true only if using HTTPS
        }
    })
);

// View Engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Static Files
app.use(express.static(path.join(__dirname, "public")));

// ensure templates always have these keys
app.use((req, res, next) => {
  res.locals.errors = {};
  res.locals.old = {};
  res.locals.success = null;
  next();
});


// Routes
app.use('/', require('./routes/mainRoutes'));

// 404
app.use((req, res) => {
    res.status(404).render("pages/404error");
});

// Start Server
http.createServer(app).listen(port, () => {
    console.log(`Server running on port ${port}`);
    console.log(`http://localhost:${port}`);
});
