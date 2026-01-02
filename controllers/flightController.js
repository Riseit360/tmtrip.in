// Express Route module import
var express = require('express');
const axios = require("axios");

// Config import
const config = require("../config/config.json");

// EMT Flight API config
const EMT = config.EMT.Flight;



class flightAPIDta {

    // Get EMT Authentication Details
    getEMTAuthentication(req) {
        return {
            UserName: EMT.username,
            Password: EMT.Password,
            PortalID: 1,
            UserType: 0,
            IpAddress: req.ip || "10.10.10.10"
        };
    }

    // Flight Search Function
    async flightsearch(req, res) {
        try {

            // 0. Input data from request body
            let input = {};

            // 1. Decide source: BODY or QUERY            
            if (req.body && Object.keys(req.body).length > 0) {
                input = req.body;
            } else if (req.query && Object.keys(req.query).length > 0) {
                // srch = DEL|BOM|2026-02-15
                const { srch, px, cbn } = req.query;
                if (!srch || !px) {
                    return { status: "error", message: "Invalid search parameters" };
                }
                const [From, To, date] = srch.split('|');
                const [Adults, Childs, Infants] = px.split('-').map(Number);
                input = { From, To, date, Adults, Childs, Infants, Cabin: Number(cbn || 0), TripType: 0 };
            }

            // 2. Validation 
            if (!input.From || !input.To || !input.date) {
                return ({ status: "error", message: "From, To and date are required" });
            }

            // 3. Flight Search Details
            const FlightSearchDetails = {
                BeginDate: input.date,
                Origin: input.From,
                Destination: input.To
            };

            // 4. EMT Payload
            const UpdateIssueData = {
                Adults: input.Adults ?? 1,
                Childs: input.Childs ?? 0,
                Infants: input.Infants ?? 0,
                Cabin: input.Cabin ?? 0,
                TripType: input.TripType ?? 0,
                TraceId: input.TraceId || "EMT_TEST_TRACE",
                Authentication: this.getEMTAuthentication(req),
                FlightSearchDetails: [FlightSearchDetails]
            };

            // 5. EMT API Call
            const fullURL = `${EMT.base_url}/FlightSearch`;
            const response = await axios.post(fullURL, UpdateIssueData, {
                headers: {
                    "Content-Type": "application/json"
                }
            });

            // API Response
            const apiData = response.data;

            // 6. EMT Response Validation
            if (apiData.Errors) {
                return ({ status: "error", message: "EMT API Error", errors: apiData.Errors });
            }

            // Check journeys
            if (!apiData.Journeys || apiData.Journeys.length === 0) {
                return ({ status: "error", message: "No flights found" });
            }

            // 7. Extract flights
            const journeys = apiData.Journeys;
            const firstJourney = journeys[0];
            const segments = firstJourney.Segments || [];


            // 8. BUILD RENDER / REDIRECT PARAMETERS
            const px = `${input.Adults ?? 1}-${input.Childs ?? 0}-${input.Infants ?? 0}`;
            const srch = `${input.From}|${input.To}|${input.date}`;

            const searchParams = {
                srch, px, cbn: input.Cabin ?? 0, isow: true, isdm: true, lang: "en-us",
                IsDoubleSeat: false, CCODE: "IN", curr: "INR", apptype: "B2C"
            };
            const queryString = new URLSearchParams(searchParams).toString();

            // Successful respons
            return ({ status: "success", flights: segments, queryString });

        } catch (error) {
            console.log('error: ', error);
            // ❌ Error handling
            return ({ status: "error", message: error });
        }
    }








}







// Export class
module.exports = flightAPIDta;
