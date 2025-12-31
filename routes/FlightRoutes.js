// routes/mainroutes.js
const express = require("express");
const router = express.Router();

// File and Functions import
const flightAPIDta = require("../controllers/flightController");


// File canvert in object
const flightData = new flightAPIDta();



// Flight Routes
router.get('/flight-search', flightData.flightsearch, (req, res) => {
    try {
        // Pages Direcdtory
        return res.status(200).render("flight/flight-search.ejs", {
            title: "Dashboard"
        });
    } catch (error) {

    }
})






module.exports = router;