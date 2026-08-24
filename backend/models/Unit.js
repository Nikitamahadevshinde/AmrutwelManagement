const mongoose = require("mongoose");

const unitSchema = new mongoose.Schema({

  // Room number from 1 to 20
  unitNumber: {
    type: Number,
    required: true,
    unique: true,
    min: 1,
    max: 20,
  },

  // Floor number from 1 to 5
  floor: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },

  // Type of room
  unitType: {
    type: String,
    required: true,
    enum: ["Single Room", "1RK", "1BHK"],
  },

  // Monthly rent
  monthlyRent: {
    type: Number,
    required: true,
    min: 0,
  },

  // Current occupancy status
  status: {
    type: String,
    enum: ["Vacant", "Occupied"],
    default: "Vacant",
  },

  // Who occupies the unit
  occupancyType: {
    type: String,
    enum: ["Owner", "Renter", "None"],
    default: "None",
  },

  // Renter occupying this unit
  renter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Renter",
    default: null,
  },

});

module.exports = mongoose.model("Unit", unitSchema);