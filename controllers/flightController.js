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

            // 1️. Input data from request body
            const input = req.body;
            const FlightSearchDetails = {
                BeginDate: input.date || "2026-02-15",
                Origin: input.From || "DEL",
                Destination: input.To || "BOM"
            };

            // 2️. Create UpdateIssueData exactly as EMT API expects
            const UpdateIssueData = {
                Adults: input.Adults || 1,
                Authentication: this.getEMTAuthentication(req),
                Cabin: input.Cabin || 0,
                Childs: input.Childs || 1,
                FlightSearchDetails: [FlightSearchDetails],
                Infants: input.Infants || 1,
                TraceId: input.TraceId || "EMTB2B73fd0ca9fcf4436cbe8b59fded57e616",
                TripType: input.TripType || 0,
            };
            console.log('UpdateIssueData: ', UpdateIssueData);

            // 3️. API URL
            const fullURL = `${EMT.base_url}/FlightSearch`;

            // 4️. API Call
            const response = await axios.post(fullURL, UpdateIssueData, {
                headers: {
                    "Content-Type": "application/json"
                }
            });
            console.log('response: ', response);


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
