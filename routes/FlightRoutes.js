// routes/mainroutes.js
const express = require("express");
const router = express.Router();

// File and Functions import
const flightAPIDta = require("../controllers/flightController.js");


// File canvert in object
const flightData = new flightAPIDta();



// Flight Routes
router.get('/flight-search/list',  async(req, res)=>{
    try {
        const flightSearchResult = await flightData.flightsearch(req, res);
        console.log('flightSearchResult: ', flightSearchResult);




    } catch (error) {
        
    }
})



// Flight Pages
router.get('/flight-search',  async (req, res) => {
    try {
        // Pages Direcdtory
        return res.status(200).render("flight/flight-search.ejs", {
            title: "Dashboard"
        });
    } catch (error) {

    }
})






module.exports = router;