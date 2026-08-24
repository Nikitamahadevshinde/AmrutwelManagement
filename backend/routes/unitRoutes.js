//creating  the API routes that will allow our application to add, view, edit, and delete units


const express = require("express");
const Unit = require("../models/Unit");

const router = express.Router();


// GET all units
router.get("/", async (req, res) => {
  try {
    const units = await Unit.find()
  .populate("renter", "name phone")
  .sort({ unitNumber: 1 });
    res.status(200).json(units);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});


// POST a new unit
router.post("/", async (req, res) => {
  try {
    const {
      unitNumber,
      floor,
      unitType,
      occupancyType
    } = req.body;


    // Check if unit already exists
    const existingUnit = await Unit.findOne({ unitNumber });

    if (existingUnit) {
      return res.status(400).json({
        message: "Unit number already exists",
      });
    }


    // Automatically determine rent
    let monthlyRent;

    if (occupancyType === "Owner") {
      monthlyRent = 0;
    } else if (unitType === "Single Room") {
      monthlyRent = 5000;
    } else if (unitType === "1RK") {
      monthlyRent = 6000;
    } else if (unitType === "1BHK") {
      monthlyRent = 8000;
    }


    // Create unit
    const unit = new Unit({
      unitNumber,
      floor,
      unitType,
      monthlyRent,
      status: occupancyType === "None" ? "Vacant" : "Occupied",
      occupancyType,
    });


    await unit.save();

    res.status(201).json(unit);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});


// PUT - Update a unit
router.put("/:id", async (req, res) => {
  try {

    const {
      unitNumber,
      floor,
      unitType,
      occupancyType
    } = req.body;


    // Automatically determine rent
    let monthlyRent;

    if (occupancyType === "Owner") {
      monthlyRent = 0;
    } else if (unitType === "Single Room") {
      monthlyRent = 5000;
    } else if (unitType === "1RK") {
      monthlyRent = 6000;
    } else if (unitType === "1BHK") {
      monthlyRent = 8000;
    }


    const updatedUnit = await Unit.findByIdAndUpdate(
      req.params.id,
      {
        unitNumber,
        floor,
        unitType,
        monthlyRent,
        status: occupancyType === "None"
          ? "Vacant"
          : "Occupied",
        occupancyType,
      },
      {
        new: true,
        runValidators: true,
      }
    );


    if (!updatedUnit) {
      return res.status(404).json({
        message: "Unit not found",
      });
    }


    res.status(200).json(updatedUnit);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});


// DELETE a unit
router.delete("/:id", async (req, res) => {
  try {

    const unit = await Unit.findById(req.params.id);

    if (!unit) {
      return res.status(404).json({
        message: "Unit not found",
      });
    }


    // Don't allow deleting an occupied unit
    if (unit.status === "Occupied") {
      return res.status(400).json({
        message: "Cannot delete an occupied unit",
      });
    }


    const deletedUnit = await Unit.findByIdAndDelete(
      req.params.id
    );


    res.status(200).json({
      message: "Unit deleted successfully",
      unit: deletedUnit,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});


module.exports = router;

