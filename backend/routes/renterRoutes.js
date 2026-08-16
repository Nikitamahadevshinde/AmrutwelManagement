const express = require("express");
const Renter = require("../models/Renter");

const router = express.Router();


router.get("/", async (req, res) => {
  try {
    const renters = await Renter.find();

    res.status(200).json(renters);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const renter = new Renter(req.body);

    await renter.save();

    res.status(201).json(renter);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


module.exports = router;