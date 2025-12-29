// controllers/maincontroller.js

const baseView = "../views/pages";

// Helper function to render pages
const renderPage = (res, view, title) => {
    return res.status(200).render(`${baseView}/${view}.ejs`, { title });
};

// Try-catch wrapper for the error handling
const safeHandler = (fn) => {
    return (req, res, next) => {
        try {
            fn(req, res, next);
        } catch (error) {
            console.error("Controller Error:", error);
            
        }
    };
};

// Controllers
exports.index = safeHandler((req, res) => {
    return renderPage(res, "index", "Home — TMTrip");
});

exports.flights = safeHandler((req, res) => {
    return renderPage(res, "flights", "Book-Flights");
});

exports.travelloan = safeHandler((req, res) => {
    return renderPage(res, "travelloan", "Travelloan");
});

exports.forex = safeHandler((req, res) => {
    return renderPage(res, "forex", "Forex");
});

exports.holidaypackages = safeHandler((req, res) => {
    return renderPage(res, "holidaypackages", "Holiday Packages");
});

exports.comingsoon = safeHandler((req, res) => {
    return renderPage(res, "comingsoon", "Coming Soon");
});

exports.contactus = safeHandler((req, res) => {
    return renderPage(res, "contactus", "Contact Us");
});

exports.termCondition = safeHandler((req, res) => {
    return renderPage(res, "tmtrip-term-condition", "TMTrip — Terms & Conditions");
});

exports.privacyPolicy = safeHandler((req, res) => {
    return renderPage(res, "tmtrip-privacy-policy", "TMTrip — Privacy Policy");
});
