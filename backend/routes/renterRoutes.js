const express = require("express");

const router = express.Router();


router.get("/", (req, res) => {    
    res.send("Renter route is working");
});


module.exports = router;