// routes/mainroutes.js
const express = require("express");
const router = express.Router();

const {

    contactus, 
   
} = require("../controllers/contactusController");

// TMTrip Pages

router.get("/contactus", contactus);





module.exports = router;
