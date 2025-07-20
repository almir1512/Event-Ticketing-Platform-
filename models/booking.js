const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const bookingSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  eventId: {
    type: Schema.Types.ObjectId,
    ref: "Event",
    required: true,
  },
  seatsBooked: {
    type: Number,
  },
  bookingDate: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Booking", bookingSchema);
