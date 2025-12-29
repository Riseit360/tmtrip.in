// controllers/contactusController.js
const contactView = "../views/pages";

// Helper function to render pages with sensible defaults
const renderPage = (res, view, title, extra = {}) => {
  const defaults = {
    errors: {},
    old: {},
    success: null
  };

  const data = Object.assign({}, defaults, { title }, extra);
  return res.status(200).render(`${contactView}/${view}.ejs`, data);
};

// Try-catch wrapper (supports async)
const safeHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((error) => {
      console.error("Controller Error:", error);
      try {
        res.status(500).render("pages/500error", { title: "Server Error" });
      } catch (e) {
        res.status(500).send("Server Error");
      }
    });
  };
};

exports.contactus = safeHandler((req, res) => {
  return renderPage(res, "contactus", "Contact Us");
});
