// routes/mainroutes.js
const express = require("express");
const router = express.Router();

// File and Functions import
const flightAPIDta = require("../controllers/flightController.js");


// File canvert in object
const flightData = new flightAPIDta();



// 1. Flight Search Routes
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

// 2. Flight Search List Routes
router.get('/flight-search/listing', async (req, res) => {
    try {
        // Call flight search service
        const flightSearchResult = await flightData.flightsearch(req);
        console.log('flightSearchResult: ', flightSearchResult.flights[0]);
        console.log('Legs: ', flightSearchResult.flights[0].Bonds[0].Legs);
        console.log('Fare: ', flightSearchResult.flights[0].Fare.PaxFares);
   
        


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

// 3. Flight Fare Rule Routes
router.post("/flight/fare-rule", async (req, res) => {
    try {
        // Call fare rule service
        const fareRuleResult = await flightData.fareRule(req);

        // Safety check
        if (fareRuleResult.status !== "success") {
            return res.status(400).json(fareRuleResult);
        }

        // Pages Direcdtory
        return res.status(200).json(fareRuleResult);

    } catch (error) {
        console.error("Fare Rule Error:", error);
        return res.status(404).render("pages/404error");
    }
});

// 4. Flight RePrice Routes
router.post("/flight/reprice", async (req, res) => {
    try {
        // Call rePrice service
        const rePriceResult = await flightData.rePrice(req);

        // Safety check
        if (rePriceResult.status !== "success") {
            return res.status(400).json(rePriceResult);
        }

        // Pages Direcdtory
        return res.status(200).json(rePriceResult);
    } catch (error) {
        console.error("RePrice Error:", error);
        return res.status(404).render("pages/404error");
    }
});

// 5. Flight Book Routes
router.post("/flight/book", async (req, res) => {
    try {
        // Call book flight service
        const bookingResult = await flightData.bookFlight(req);

        // Safety check
        if (bookingResult.status !== "success") {
            return res.status(400).json(bookingResult);
        }

        // Pages Direcdtory
        return res.status(200).json(bookingResult);

    } catch (error) {
        console.error("Booking Error:", error);
        return res.status(404).render("pages/404error");
    }
});

// 6. Flight Ticket Issue Routes
router.post("/flight/ticket", async (req, res) => {
    try {
        // Call ticket issue service
        const ticketResult = await flightData.ticketIssue(req);

        // Safety check
        if (ticketResult.status !== "success") {
            return res.status(400).json(ticketResult);
        }

        // Pages Direcdtory
        return res.status(200).json(ticketResult);

    } catch (error) {
        console.error("Ticket Issue Error:", error);
        return res.status(404).render("pages/404error");
    }
});

// From Data 
router.post('/get-a-quate', async (req, res) => {
    try {
        // Call flight search service
        const getAQuateResult = await flightData.getAQuate(req, res); 

        // Safety check
        if (!getAQuateResult || getAQuateResult.status !== 'success') {
            return res.status(400).json({ status: 'error', message: 'Unable to submit quote' });
        }

        // Pages Direcdtory
        return res.status(200).render("email/thankyou.ejs", {
            title: "Thank You"
        });

    } catch (error) {
        console.error('Get a quate Error:', error);
        res.status(404).render("pages/404error");
    }
});






module.exports = router;