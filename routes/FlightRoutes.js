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
        res.status(404).render("pages/404error");
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
        console.error('Flight Search Error:', error);
        res.status(404).render("pages/404error");
    }
})

// From Data 
router.post('/get-a-quate', async (req, res) => {
    try {
        // Call flight search service
        const getAQuateResult = await flightData.getAQuate(req, res);
        const profileData = getAQuateResult.data.personal_details;
        console.log('profileData: ', profileData);

        // Safety check
        if (!getAQuateResult || getAQuateResult.status !== 'success') {
            return res.status(400).json({ status: 'error', message: 'Unable to submit quote' });
        }

        // Pages Direcdtory
        return res.status(200).render("email/thanks_me.ejs", {
          title: "Thank You",
            data: profileData
        });

    } catch (error) {
        console.error('Get a quate Error:', error);
        res.status(404).render("pages/404error");
    }
});






module.exports = router;