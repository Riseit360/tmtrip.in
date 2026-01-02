// routes/mainroutes.js
const express = require("express");
const router = express.Router();

// File and Functions import
const flightAPIDta = require("../controllers/flightController.js");


// File canvert in object
const flightData = new flightAPIDta();



// Flight Routes
router.post('/flight-search', async (req, res) => {
    try {
        // Call flight search service
        const flightSearchResult = await flightData.flightsearch(req, res);

        // Safety check
        if (!flightSearchResult || flightSearchResult.status !== 'success') {
            return res.status(400).json({ status: 'error', message: 'Flight search failed' });
        }

        // Redirect with required query params
        return res.redirect(`/flight-search/listing?${flightSearchResult.queryString}`);

    } catch (error) {
        console.error('Flight Search Error:', error);
        return res.status(500).json({ status: 'error', message: 'Server error' });
    }
})

// Flight Pages
router.get('/flight-search/listing', async (req, res) => {
    try {
        // Call flight search service
        const flightSearchResult = await flightData.flightsearch(req, res); 

        // Pages Direcdtory
        return res.status(200).render("flight/flight-search.ejs", {
            title: "Dashboard",
            data: flightSearchResult
        });
    } catch (error) {

    }
})






module.exports = router;