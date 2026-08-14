const mongoose = require("mongoose");//Brings Mongoose into this file.

const connectDB = async () => {//Creates a function whose only job is:to connect backend to mongodb
  try {
    await mongoose.connect("mongodb://localhost:27017/amrutwelDB");//Actually attempts the connection.

    console.log("MongoDB Connected Successfully");//Shows success message.
  } catch (error) {//If connection fails, show error.
    console.log("MongoDB Connection Failed");
    console.log(error);

    process.exit(1);
  }
};

module.exports = connectDB;//Allows server.js to use this function.