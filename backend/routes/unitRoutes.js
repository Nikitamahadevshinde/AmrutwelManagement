// Creating API routes that allow our application
// to add, view, edit, and delete units

const express = require("express");
const Unit = require("../models/Unit");

const router = express.Router();


// ==========================================
// GET ALL UNITS
// ==========================================

router.get("/", async (req, res) => {
  try {

    const units = await Unit.find()
      .populate(
        "renter",
        "name phone roomNumber roomType monthlyRent joiningDate"
      )
      .sort({ unitNumber: 1 });

    res.status(200).json(units);

  } catch (error) {

    console.error("Error fetching units:", error);

    res.status(500).json({
      message: error.message,
    });

  }
});


// ==========================================
// GET ONE UNIT
// ==========================================

router.get("/:id", async (req, res) => {
  try {

    const unit = await Unit.findById(req.params.id)
      .populate(
        "renter",
        "name phone roomNumber roomType monthlyRent joiningDate"
      );

    if (!unit) {

      return res.status(404).json({
        message: "Unit not found",
      });

    }

    res.status(200).json(unit);

  } catch (error) {

    console.error("Error fetching unit:", error);

    res.status(500).json({
      message: error.message,
    });

  }
});


// ==========================================
// POST - CREATE NEW UNIT
// ==========================================

router.post("/", async (req, res) => {
  try {

    const {
      unitNumber,
      floor,
      unitType,
      occupancyType
    } = req.body;


    // Check if unit already exists
    const existingUnit = await Unit.findOne({
      unitNumber
    });

    if (existingUnit) {

      return res.status(400).json({
        message: "Unit number already exists",
      });

    }


    // ========================================
    // Determine rent automatically
    // ========================================

    let monthlyRent;

    if (occupancyType === "Owner") {

      monthlyRent = 0;

    } else if (unitType === "Single Room") {

      monthlyRent = 5000;

    } else if (unitType === "1RK") {

      monthlyRent = 6000;

    } else if (
      unitType === "1BHK" ||
      unitType === "1 BHK"
    ) {

      monthlyRent = 8000;

    } else {

      return res.status(400).json({
        message: "Invalid room type",
      });

    }


    // ========================================
    // Create unit
    // ========================================

    const unit = new Unit({

      unitNumber,

      floor,

      unitType,

      monthlyRent,

      status:
        occupancyType === "None"
          ? "Vacant"
          : "Occupied",

      occupancyType,

      renter: null,

    });


    await unit.save();


    // Return populated unit
    const populatedUnit = await Unit.findById(
      unit._id
    ).populate(
      "renter",
      "name phone roomNumber roomType monthlyRent joiningDate"
    );


    res.status(201).json(populatedUnit);

  } catch (error) {

    console.error("Error creating unit:", error);

    res.status(500).json({
      message: error.message,
    });

  }
});


// ==========================================
// PUT - UPDATE UNIT
// ==========================================

router.put("/:id", async (req, res) => {
  try {

    const {
      unitNumber,
      floor,
      unitType,
      occupancyType
    } = req.body;


    // ========================================
    // Determine rent
    // ========================================

    let monthlyRent;

    if (occupancyType === "Owner") {

      monthlyRent = 0;

    } else if (unitType === "Single Room") {

      monthlyRent = 5000;

    } else if (unitType === "1RK") {

      monthlyRent = 6000;

    } else if (
      unitType === "1BHK" ||
      unitType === "1 BHK"
    ) {

      monthlyRent = 8000;

    } else {

      return res.status(400).json({
        message: "Invalid room type",
      });

    }


    // ========================================
    // Update unit
    // ========================================

    const updatedUnit =
      await Unit.findByIdAndUpdate(

        req.params.id,

        {
          unitNumber,
          floor,
          unitType,
          monthlyRent,

          status:
            occupancyType === "None"
              ? "Vacant"
              : "Occupied",

          occupancyType,

          // Do not remove the renter reference
          // when updating an occupied renter room
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


    // Populate renter information
    const populatedUnit =
      await Unit.findById(
        updatedUnit._id
      ).populate(
        "renter",
        "name phone roomNumber roomType monthlyRent joiningDate"
      );


    res.status(200).json(populatedUnit);

  } catch (error) {

    console.error("Error updating unit:", error);

    res.status(500).json({
      message: error.message,
    });

  }
});


// ==========================================
// DELETE UNIT
// ==========================================

router.delete("/:id", async (req, res) => {
  try {

    const unit = await Unit.findById(
      req.params.id
    );

    if (!unit) {

      return res.status(404).json({
        message: "Unit not found",
      });

    }


    // Don't delete occupied room
    if (unit.status === "Occupied") {

      return res.status(400).json({
        message:
          "Cannot delete an occupied unit",
      });

    }


    const deletedUnit =
      await Unit.findByIdAndDelete(
        req.params.id
      );


    res.status(200).json({

      message:
        "Unit deleted successfully",

      unit: deletedUnit,

    });

  } catch (error) {

    console.error("Error deleting unit:", error);

    res.status(500).json({
      message: error.message,
    });

  }
});


module.exports = router;