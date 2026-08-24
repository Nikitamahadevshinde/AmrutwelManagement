const express = require("express");
const Renter = require("../models/Renter");
const Unit = require("../models/Unit");

const router = express.Router();


// ==========================================
// Validation
// ==========================================

const validateRenter = (data) => {

  const { name, phone, roomNumber } = data;

  if (!name || !phone || !roomNumber) {
    return "Name, phone and room number are required";
  }

  if (!/^[A-Za-z\s]+$/.test(name.trim())) {
    return "Name can contain only letters and spaces";
  }

  if (!/^\d{10}$/.test(String(phone))) {
    return "Phone number must contain exactly 10 digits";
  }

  const room = Number(roomNumber);

  if (!Number.isInteger(room) || room < 1 || room > 20) {
    return "Room number must be between 1 and 20";
  }

  return null;
};


// ==========================================
// GET all renters
// ==========================================

router.get("/", async (req, res) => {

  try {

    const renters = await Renter.find();

    res.status(200).json(renters);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

});


// ==========================================
// POST - Add renter
// ==========================================

router.post("/", async (req, res) => {

  try {

    const validationError = validateRenter(req.body);

    if (validationError) {

      return res.status(400).json({
        message: validationError
      });

    }


    const roomNumber = Number(req.body.roomNumber);


    // Find unit
    const unit = await Unit.findOne({
      unitNumber: roomNumber
    });


    if (!unit) {

      return res.status(404).json({
        message: "Unit not found"
      });

    }


    // Owner room cannot be rented
    if (unit.occupancyType === "Owner") {

      return res.status(400).json({
        message: "This room belongs to the owner and cannot be assigned to a renter"
      });

    }


    // Room already occupied
    if (unit.status === "Occupied") {

      return res.status(400).json({
        message: "This room is already occupied"
      });

    }


    // Create renter
    const renter = new Renter({

      name: req.body.name.trim(),

      phone: String(req.body.phone),

      roomNumber: String(unit.unitNumber),

      roomType: unit.unitType,

      monthlyRent: unit.monthlyRent

    });


    await renter.save();


    // Update unit
    unit.status = "Occupied";

    unit.occupancyType = "Renter";

    unit.renter = renter._id;

    await unit.save();


    res.status(201).json({

      message: "Renter added successfully",

      renter: renter,

      unit: unit

    });


  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

});


// ==========================================
// DELETE renter
// ==========================================

router.delete("/:id", async (req, res) => {

  try {

    const renter = await Renter.findById(req.params.id);


    if (!renter) {

      return res.status(404).json({
        message: "Renter not found"
      });

    }


    const roomNumber = Number(renter.roomNumber);


    // Delete renter
    await Renter.findByIdAndDelete(req.params.id);


    // Find unit
    const unit = await Unit.findOne({
      unitNumber: roomNumber
    });


    // Make room vacant
    if (unit && unit.occupancyType === "Renter") {

      unit.status = "Vacant";

      unit.occupancyType = "None";

      unit.renter = null;

      await unit.save();

    }


    res.status(200).json({

      message: "Renter deleted successfully",

      renter: renter,

      unit: unit

    });


  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

});


// ==========================================
// EDIT renter
// ==========================================

router.put("/:id", async (req, res) => {

  try {

    const validationError = validateRenter(req.body);

    if (validationError) {

      return res.status(400).json({
        message: validationError
      });

    }


    const renter = await Renter.findById(req.params.id);


    if (!renter) {

      return res.status(404).json({
        message: "Renter not found"
      });

    }


    const oldRoomNumber = Number(renter.roomNumber);

    const newRoomNumber = Number(req.body.roomNumber);


    // ======================================
    // Same room
    // ======================================

    if (oldRoomNumber === newRoomNumber) {

      const unit = await Unit.findOne({
        unitNumber: newRoomNumber
      });


      if (!unit) {

        return res.status(404).json({
          message: "Unit not found"
        });

      }


      if (unit.occupancyType === "Owner") {

        return res.status(400).json({
          message: "This room belongs to the owner"
        });

      }


      renter.name = req.body.name.trim();

      renter.phone = String(req.body.phone);

      renter.roomNumber = String(unit.unitNumber);

      renter.roomType = unit.unitType;

      renter.monthlyRent = unit.monthlyRent;


      await renter.save();


      // Make sure unit points to renter
      unit.status = "Occupied";

      unit.occupancyType = "Renter";

      unit.renter = renter._id;

      await unit.save();


      return res.status(200).json({

        message: "Renter updated successfully",

        renter: renter,

        unit: unit

      });

    }


    // ======================================
    // Changing room
    // ======================================

    const newUnit = await Unit.findOne({
      unitNumber: newRoomNumber
    });


    if (!newUnit) {

      return res.status(404).json({
        message: "New unit not found"
      });

    }


    if (newUnit.occupancyType === "Owner") {

      return res.status(400).json({
        message: "The new room belongs to the owner"
      });

    }


    if (newUnit.status === "Occupied") {

      return res.status(400).json({
        message: "The new room is already occupied"
      });

    }


    // Old unit
    const oldUnit = await Unit.findOne({
      unitNumber: oldRoomNumber
    });


    // Make old room vacant
    if (oldUnit && oldUnit.occupancyType === "Renter") {

      oldUnit.status = "Vacant";

      oldUnit.occupancyType = "None";

      oldUnit.renter = null;

      await oldUnit.save();

    }


    // Update renter
    renter.name = req.body.name.trim();

    renter.phone = String(req.body.phone);

    renter.roomNumber = String(newUnit.unitNumber);

    renter.roomType = newUnit.unitType;

    renter.monthlyRent = newUnit.monthlyRent;


    await renter.save();


    // Occupy new room
    newUnit.status = "Occupied";

    newUnit.occupancyType = "Renter";

    newUnit.renter = renter._id;

    await newUnit.save();


    res.status(200).json({

      message: "Renter updated successfully",

      renter: renter,

      oldUnit: oldUnit,

      newUnit: newUnit

    });


  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

});


module.exports = router;