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
            IpAddress: req.ip || "127.0.0.1"
        };
    }


    // Flight Search Function
    async flightsearch(req, res) {
        try {

            // 1️. Input data from request body
            const input = req.body;

            // 2️. Create UpdateIssueData exactly as EMT API expects
           const UpdateIssueData = {
                Adults: input.Adults || 1,
                Childs: input.Childs || 0,
                Infants: input.Infants || 0,
                Cabin: input.Cabin || 0,
                TripType: input.TripType || 0,
                TraceId: input.TraceId,
                Authentication: this.getEMTAuthentication(req),
                FlightSearchDetails: input.FlightSearchDetails
            };

            // 3️. API URL
            const fullURL = `${EMT.base_url}/FlightSearch`;

            // 4️. API Call
            const response = await axios.post(fullURL, UpdateIssueData, {
                headers: {
                    "Content-Type": "application/json"
                }
            });

            // 5️. Success response
            return ({ status: "success", data: response.data });

        } catch (error) {
            // ❌ Error handling
            return ({ status: "error", message: error.response?.data || error.message });
        }
    }








}







// Export class
module.exports = flightAPIDta;
