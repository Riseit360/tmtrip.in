// Npm Modules
const mongoose = require("mongoose");


// Booking/Quote Sub Schema
const BookingSchema = new mongoose.Schema({
    destination: {
        type: String,
        required: true
    },

    departure_city: {
        type: String,
        required: true
    },

    booking_type: {
        type: String,
        default: "flight_quote"
    },

    source: {
        type: String,
        default: "website"
    },

    created_at: {
        type: Date,
        default: Date.now
    }
}, {
    _id: false
});


// Main User Schema
const QuoteSchema = new mongoose.Schema({
    personal_details: {
        full_name: {
            type: String,
            required: true,
            trim: true
        },

        phone: {
            type: String,
            required: true,
            index: true
        },

        email: {
            type: String,
            required: true,
            lowercase: true,
            index: true
        }
    },

    bookings: [BookingSchema],

    agree_terms: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});


// Compound Index (No Duplicate User)
QuoteSchema.index({
    "personal_details.email": 1,
    "personal_details.phone": 1
}, {
    unique: true
});

module.exports = mongoose.model("Quote", QuoteSchema);