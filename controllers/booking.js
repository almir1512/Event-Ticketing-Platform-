const mongoose = require("mongoose");
const QRCode = require("qrcode");
const Event = require("../models/event");
const Booking = require("../models/booking");

exports.createBooking = async (req, res, next) => {
  const { eventId, seatsBooked } = req.body;

  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    const err = new Error("invalid eventId");
    err.statusCode = 400;
    throw err;
  }

  try {
    const event = await Event.findById(eventId);
    if (!event) {
      const err = new Error("no event found");
      err.statusCode = 404;
      throw err;
    }
    if (event.seatsAvailable < seatsBooked) {
      console.log("here");
      const err = new Error("no enough seats available");
      err.statusCode = 400;
      throw err;
    }
    if (!seatsBooked || seatsBooked <= 0) {
      const err = new Error("Invalid number of seats booked");
      err.statusCode = 400;
      throw err;
    }

    event.seatsAvailable -= seatsBooked;
    await event.save();

    const booking = await Booking.create({
      userId: req.userId,
      eventId,
      seatsBooked,
    });
    res.status(200).json({ message: "created booking", booking });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

exports.viewBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ userId: req.userId }).populate(
      "eventId"
    );
    if (bookings.length == 0) {
      const err = new Error("no bookings found");
      err.statusCode = 404;
      throw err;
    }
    res.status(200).json({ bookings: bookings });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

exports.deleteBooking = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.bookingId)) {
      return res.status(400).json({ error: "invalid booking id format" });
    }
    const booking = await Booking.findById(req.params.bookingId);
    if (!booking) {
      const err = new Error("booking not found");
      err.statusCode = 404;
      throw err;
    }
    if (req.userId.toString() !== booking.userId.toString()) {
      const err = new Error("Not authorized to delete booking");
      err.statusCode = 403;
      throw err;
    }
    const event = await Event.findById(booking.eventId);
    if (!event) {
      const err = new Error("no event for the booking found");
      err.statusCode = 404;
      throw err;
    }
    event.seatsAvailable += booking.seatsBooked;
    await event.save();

    await booking.deleteOne();
    res
      .status(200)
      .json({ message: "booking deleted", bookingId: req.params.bookingId });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

exports.genQR = async (req, res, next) => {
  try {
    const { bookingId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      return res.status(400).json({ error: "invalid booking id format" });
    }

    const booking = await Booking.findById(bookingId).populate("eventId");
    if (!booking) {
      const err = new Error("no booking found ");
      err.statusCode = 404;
      throw err;
    }

    if (req.userId.toString() !== booking.userId.toString()) {
      const err = new Error("Not authorized to create qr code for booking");
      err.statusCode = 403;
      throw err;
    }

    const qrPayload = {
      event: booking.eventId.title,
      date: booking.eventId.date,
      seats: booking.seatsBooked,
      user: req.userId,
      bookingId: booking._id,
    };
    const qrData = JSON.stringify(qrPayload);

    const qrImage = await QRCode.toDataURL(qrData); // base64 image string

    res.status(200).json({ qrcode: qrImage }); // Send to frontend
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};
