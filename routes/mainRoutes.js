// routes/mainroutes.js
const express = require("express");
const router = express.Router();

const {
    index,
    flights,
    travelloan,
    forex,
    holidaypackages,
    comingsoon,
    contactus, 
    termCondition,
    privacyPolicy,
} = require("../controllers/mainController");

// TMTrip Pages
router.get("/", index);
router.get("/flights", flights);
router.get("/travelloan", travelloan);

router.get("/forex", forex);
router.get("/holidaypackages", holidaypackages);
router.get("/contactus", contactus);





router.get("/tmtrip-term-condition", termCondition);

router.get("/tmtrip-privacy-policy", privacyPolicy);


router.get("/comingsoon", comingsoon);



module.exports = router;
