const mongoose = require("mongoose");//Because schema functionality comes from Mongoose.

const renterSchema = new mongoose.Schema({//"I am defining the structure of a renter."
  name: {  //Name must be text Name cannot be empty

    type: String,
    required: true,
  },

  phone: {
    type: String,
    required: true,
  },

  roomNumber: {
    type: String,
    required: true,
  },

  roomType: {
    type: String,
    required: true,
  },

  monthlyRent: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Renter", renterSchema);