const express = require("express");
const bookingController = require("../controllers/booking");
const { verifyUser } = require("../middleware/is-auth");
const booking = require("../models/booking");
const router = express.Router();

router.post("/", verifyUser, bookingController.createBooking);
router.get("/", verifyUser, bookingController.viewBookings);

router.delete("/:bookingId", verifyUser, bookingController.deleteBooking);

router.get("/qr/:bookingId", verifyUser, bookingController.genQR);
module.exports = router;
