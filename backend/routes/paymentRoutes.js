const express = require("express");

const Payment = require("../models/Payment");
const Renter = require("../models/Renter");

const router = express.Router();


// ==========================================
// GET payment history of a renter
// ==========================================

router.get("/renter/:renterId", async (req, res) => {

  try {

    const payments = await Payment.find({
      renter: req.params.renterId
    }).sort({
      createdAt: 1
    });

    res.status(200).json(payments);

  } catch (error) {

    console.error("Error fetching payments:", error);

    res.status(500).json({
      message: error.message
    });

  }

});


// ==========================================
// GET all payments
// ==========================================

router.get("/", async (req, res) => {

  try {

    const payments = await Payment.find()
      .populate("renter")
      .sort({
        createdAt: -1
      });

    res.status(200).json(payments);

  } catch (error) {

    console.error("Error fetching payments:", error);

    res.status(500).json({
      message: error.message
    });

  }

});


// ==========================================
// ADD PAYMENT
// ==========================================

router.post("/", async (req, res) => {

  try {

    const {
      renterId,
      roomNumber,
      month,
      amount,
      paymentDate
    } = req.body;


    // Check required fields

    if (
      !renterId ||
      !roomNumber ||
      !month ||
      amount === undefined ||
      amount === ""
    ) {

      return res.status(400).json({
        message: "All payment fields are required"
      });

    }


    // Find renter

    const renter = await Renter.findById(renterId);

    if (!renter) {

      return res.status(404).json({
        message: "Renter not found"
      });

    }


    // Check if payment already exists
    // for the same renter and month

    const existingPayment = await Payment.findOne({
      renter: renterId,
      month: month
    });


    if (existingPayment) {

      return res.status(400).json({
        message: `Payment for ${month} already exists`
      });

    }


    // Create payment

    const payment = new Payment({

      renter: renterId,

      roomNumber: Number(roomNumber),

      month: month,

      amount: Number(amount),

      status: "Paid",

      paymentDate: paymentDate
        ? new Date(paymentDate)
        : new Date()

    });


    await payment.save();


    res.status(201).json({

      message: "Payment added successfully",

      payment: payment

    });


  } catch (error) {

    console.error("Add payment error:", error);

    res.status(500).json({
      message: error.message
    });

  }

});


// ==========================================
// DELETE PAYMENT
// ==========================================

router.delete("/:id", async (req, res) => {

  try {

    const payment = await Payment.findByIdAndDelete(
      req.params.id
    );


    if (!payment) {

      return res.status(404).json({
        message: "Payment not found"
      });

    }


    res.status(200).json({

      message: "Payment deleted successfully",

      payment: payment

    });


  } catch (error) {

    console.error("Delete payment error:", error);

    res.status(500).json({
      message: error.message
    });

  }

});


module.exports = router;