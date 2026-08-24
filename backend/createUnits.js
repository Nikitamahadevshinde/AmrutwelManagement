
const mongoose = require("mongoose");
const Unit = require("./models/Unit");
const connectDB = require("./config/db");

const units = [

  // Floor 1
  {
    unitNumber: 1,
    floor: 1,
    unitType: "1BHK",
    monthlyRent: 0,
    status: "Occupied",
    occupancyType: "Owner",
  },
  {
    unitNumber: 2,
    floor: 1,
    unitType: "1RK",
    monthlyRent: 6000,
    status: "Vacant",
    occupancyType: "None",
  },
  {
    unitNumber: 3,
    floor: 1,
    unitType: "1RK",
    monthlyRent: 6000,
    status: "Vacant",
    occupancyType: "None",
  },
  {
    unitNumber: 4,
    floor: 1,
    unitType: "1RK",
    monthlyRent: 6000,
    status: "Vacant",
    occupancyType: "None",
  },

  // Floor 2
  {
    unitNumber: 5,
    floor: 2,
    unitType: "1RK",
    monthlyRent: 6000,
    status: "Vacant",
    occupancyType: "None",
  },
  {
    unitNumber: 6,
    floor: 2,
    unitType: "1BHK",
    monthlyRent: 8000,
    status: "Vacant",
    occupancyType: "None",
  },
  {
    unitNumber: 7,
    floor: 2,
    unitType: "1RK",
    monthlyRent: 6000,
    status: "Vacant",
    occupancyType: "None",
  },
  {
    unitNumber: 8,
    floor: 2,
    unitType: "1RK",
    monthlyRent: 6000,
    status: "Vacant",
    occupancyType: "None",
  },
  {
    unitNumber: 9,
    floor: 2,
    unitType: "1RK",
    monthlyRent: 6000,
    status: "Vacant",
    occupancyType: "None",
  },

  // Floor 3
  {
    unitNumber: 10,
    floor: 3,
    unitType: "1RK",
    monthlyRent: 6000,
    status: "Vacant",
    occupancyType: "None",
  },
  {
    unitNumber: 11,
    floor: 3,
    unitType: "1BHK",
    monthlyRent: 8000,
    status: "Vacant",
    occupancyType: "None",
  },
  {
    unitNumber: 12,
    floor: 3,
    unitType: "1RK",
    monthlyRent: 6000,
    status: "Vacant",
    occupancyType: "None",
  },
  {
    unitNumber: 13,
    floor: 3,
    unitType: "1RK",
    monthlyRent: 6000,
    status: "Vacant",
    occupancyType: "None",
  },
  {
    unitNumber: 14,
    floor: 3,
    unitType: "1RK",
    monthlyRent: 6000,
    status: "Vacant",
    occupancyType: "None",
  },

  // Floor 4
  {
    unitNumber: 15,
    floor: 4,
    unitType: "1RK",
    monthlyRent: 6000,
    status: "Vacant",
    occupancyType: "None",
  },
  {
    unitNumber: 16,
    floor: 4,
    unitType: "1BHK",
    monthlyRent: 8000,
    status: "Vacant",
    occupancyType: "None",
  },
  {
    unitNumber: 17,
    floor: 4,
    unitType: "1RK",
    monthlyRent: 6000,
    status: "Vacant",
    occupancyType: "None",
  },
  {
    unitNumber: 18,
    floor: 4,
    unitType: "1RK",
    monthlyRent: 6000,
    status: "Vacant",
    occupancyType: "None",
  },
  {
    unitNumber: 19,
    floor: 4,
    unitType: "1RK",
    monthlyRent: 6000,
    status: "Vacant",
    occupancyType: "None",
  },

  // Floor 5
  {
    unitNumber: 20,
    floor: 5,
    unitType: "Single Room",
    monthlyRent: 5000,
    status: "Vacant",
    occupancyType: "None",
  },
];

const createUnits = async () => {
  try {

    await connectDB();

    // Remove existing units
    await Unit.deleteMany({});

    // Create all 20 units
    await Unit.insertMany(units);

    console.log("✅ All 20 units created successfully!");

    process.exit(0);

  } catch (error) {

    console.error("❌ Error creating units:", error);

    process.exit(1);
  }
};

createUnits();

