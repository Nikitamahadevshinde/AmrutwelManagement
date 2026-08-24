const mongoose = require("mongoose");

const renterSchema = new mongoose.Schema({

  // Renter name
  name: {
    type: String,
    required: true,
  },

  // Phone number
  phone: {
    type: String,
    required: true,
  },

  // Room number
  roomNumber: {
    type: String,
    required: true,
  },

  // Room type
  roomType: {
    type: String,
    required: true,
  },

  // Monthly rent
  monthlyRent: {
    type: Number,
    required: true,
  },

  // Date on which renter joined
  joiningDate: {
    type: Date,
    required: true,
  },

});

module.exports = mongoose.model("Renter", renterSchema);