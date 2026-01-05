// Express Route module import
var express = require('express');
const axios = require("axios");

// Config import
const config = require("../config/config.json");
const Quote = require("../module/quoteModel");
const emailcontroller = require('./mail/emailsendcontroller')


// EMT Flight API config
const EMT = config.EMT.Flight;
const sendemail = new emailcontroller();



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

    // 1. Flight Search Function
    async flightsearch(req) {
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
            const payload = {
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
            const response = await axios.post(fullURL, payload, {
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
            const TraceId = response.data.TraceId;


            // 8. BUILD RENDER / REDIRECT PARAMETERS
            const px = `${input.Adults ?? 1}-${input.Childs ?? 0}-${input.Infants ?? 0}`;
            const srch = `${input.From}|${input.To}|${input.date}`;

            const searchParams = {
                srch, px, cbn: input.Cabin ?? 0, isow: true, isdm: true, lang: "en-us",
                IsDoubleSeat: false, CCODE: "IN", curr: "INR", apptype: "B2C"
            };
            const queryString = new URLSearchParams(searchParams).toString();

            // Successful respons
            return ({ status: "success", flights: segments, TraceId, queryString, FlightAvailabilityRQ: payload });

        } catch (error) {
            console.log('error: ', error);
            // ❌ Error handling
            return ({ status: "error", message: error });
        }
    }

    // 2. Fare Rule Function
    async fareRule(req) {
        try {
            // Extract required data
            const { TraceId, ResultIndex } = req.body;

            // Prepare payload
            const payload = {
                TraceId,
                ResultIndex,
                Authentication: this.getEMTAuthentication(req)
            };

            // API Call
            const response = await axios.post(`${EMT.base_url}/FareRule`, payload, {
                headers: {
                    "Content-Type": "application/json"
                }
            });

            // Return fare rules
            return { status: "success", fareRule: response.data.FareRules };

        } catch (err) {
            return { status: "error", message: err.message };
        }
    }

    // 3. RePrice Function
    async rePrice(req) {
        try {
            // Extract required data
            const { TraceId, ItineraryKey, FlightAvailabilityRQ } = req.body;
            if (!TraceId || !ItineraryKey || !FlightAvailabilityRQ) {
                return { status: "error", message: "TraceId / ItineraryKey / FlightAvailabilityRQ missing" };
            }

            // Prepare payload
            const payload = {
                TraceId: TraceId,
                ItineraryKey: ItineraryKey,
                FlightAvailabilityRQ: FlightAvailabilityRQ,
                Authentication: {
                    ...this.getEMTAuthentication(req),
                    IpAddress: "127.0.0.1"
                }
            };
            console.log("RePrice Payload =>", payload);

            // API Call
            const response = await axios.post(`${EMT.base_url}/AirRePriceRQ`, payload, {
                headers: {
                    "Content-Type": "application/json"
                }
            });
            console.log('response.data: ', response.data);

            // Return fare
            return { status: "success", fare: response.data.Fare };

        } catch (err) {
            return { status: "error", message: err.message };
        }
    }

    // 4.Book Flight Function
    async bookFlight(req) {
        try {
            // Extract required data
            const { TraceId, ResultIndex, Passengers } = req.body;

            // Prepare payload
            const payload = {
                TraceId,
                ResultIndex,
                Passengers,
                Authentication: this.getEMTAuthentication(req)
            };

            // API Call
            const response = await axios.post(`${EMT.base_url}/Book`, payload, {
                headers: {
                    "Content-Type": "application/json"
                }
            });

            // Return booking details
            return { status: "success", bookingId: response.data.BookingId, pnr: response.data.PNR };

        } catch (err) {
            return { status: "error", message: err.message };
        }
    }

    // 5. Ticket Issue Function
    async ticketIssue(req) {
        try {
            // Extract required data
            const { BookingId } = req.body;

            // Prepare payload
            const payload = {
                BookingId,
                Authentication: this.getEMTAuthentication(req)
            };

            // API Call
            const response = await axios.post(`${EMT.base_url}/Ticket`, payload, {
                headers: {
                    "Content-Type": "application/json"
                }
            });

            // Return ticket details
            return { status: "success", ticket: response.data };

        } catch (err) {
            return { status: "error", message: err.message };
        }
    }

    // Form Data Function
    async getAQuate(req, res) {
        try {
            // 1. Get form data
            const formData = req.body;

            // 2. Basic validation (extra safety)
            if (!formData.destination || !formData.departure_city || !formData.full_name || !formData.phone || !formData.email || formData.agree_terms !== "yes") {
                return ({ status: "error", message: "All fields are required" });
            }

            // Booking object
            const bookingData = {
                destination: formData.destination,
                departure_city: formData.departure_city
            };

            // 1️. Check if user already exists
            const existingUser = await Quote.findOne({
                "personal_details.email": formData.email,
                "personal_details.phone": formData.phone
            });

            // Mailer Data Save
            const emailResult = await sendemail.sendemailfromcontactus(formData);
            console.log('sendemail: ', emailResult);


            // 2️. If user exists → push booking
            if (existingUser) {
                // save data
                existingUser.bookings.push(bookingData);
                await existingUser.save();

                // Return success
                return ({ status: "success", message: "Booking added to existing user", data: existingUser });
            }

            // 3️. If new user → create document
            const newQuote = new Quote({
                personal_details: {
                    full_name: formData.full_name,
                    phone: formData.phone,
                    email: formData.email
                },
                bookings: [bookingData],
                agree_terms: formData.agree_terms === "yes"
            });

            // Save new user
            await newQuote.save();

            // Return success
            return ({ status: "success", message: "New user & booking created", data: formData });

        } catch (error) {
            console.error("Quote Save Error:", error);
            return ({ status: "error", message: "Server Error" });
        }
    }

}







// Export class
module.exports = flightAPIDta;
