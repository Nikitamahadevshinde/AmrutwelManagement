const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({

  // Renter who made the payment
  renter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Renter",
    required: true,
  },

  // Room number
  roomNumber: {
    type: Number,
    required: true,
  },

  // Month for which rent is being paid
  // Example: "August 2026"
  month: {
    type: String,
    required: true,
  },

  // Amount of rent
  amount: {
    type: Number,
    required: true,
    min: 0,
  },

  // Payment status
  status: {
    type: String,
    enum: ["Paid", "Unpaid"],
    default: "Unpaid",
  },

  // Date on which payment was made
  paymentDate: {
    type: Date,
    default: null,
  },

}, {
  timestamps: true
});

module.exports = mongoose.model("Payment", paymentSchema);