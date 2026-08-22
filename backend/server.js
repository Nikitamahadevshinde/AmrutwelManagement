const express = require("express");
const cors = require("cors");
const renterRoutes = require("./routes/renterRoutes");
const connectDB = require("./config/db");

const app = express();

app.use(cors());
app.use(express.json());
connectDB();//connects the database.

const PORT = 5000;

app.use("/api/renters", renterRoutes);//connect renter routes


app.get("/", (req, res) => {
    res.send("Amrutwel Management Backend Running 🚀");
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});