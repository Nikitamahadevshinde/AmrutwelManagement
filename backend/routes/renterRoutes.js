// const express = require("express");
// const Renter = require("../models/Renter");

// const router = express.Router();


// router.get("/", async (req, res) => {
//   try {
//     const renters = await Renter.find();

//     res.status(200).json(renters);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// router.post("/", async (req, res) => {
//   try {
//     const renter = new Renter(req.body);

//     await renter.save();

//     res.status(201).json(renter);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });


// module.exports = router;


const express = require("express");
const Renter = require("../models/Renter");

const router = express.Router();


// GET all renters
router.get("/", async (req, res) => {
  try {
    const renters = await Renter.find();

    res.status(200).json(renters);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// POST a new renter
router.post("/", async (req, res) => {
  try {
    const renter = new Renter(req.body);

    await renter.save();

    res.status(201).json(renter);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// DELETE a renter
router.delete("/:id", async (req, res) => {
  try {
    const deletedRenter = await Renter.findByIdAndDelete(req.params.id);

    if (!deletedRenter) {
      return res.status(404).json({ message: "Renter not found" });
    }

    res.status(200).json({
      message: "Renter deleted successfully",
      renter: deletedRenter
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


module.exports = router;