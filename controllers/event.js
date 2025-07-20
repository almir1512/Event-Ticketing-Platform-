const mongoose = require("mongoose");
const Event = require("../models/event");

exports.createEvent = async (req, res, next) => {
  try {
    const result = await Event.create({ ...req.body, userId: req.userId });
    if (!result) {
      const err = new Error("event creation failed");
      err.statusCode = 401;
      throw err;
    }
    res.status(200).json({ message: "event created", event: result._id });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};
exports.getEvents = async (req, res, next) => {
  try {
    const { search = "", page = 1, limit = 2 } = req.query;
    const query = {
      $or: [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ],
    };
    const events = await Event.find(query)
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Event.countDocuments();

    if (!events) {
      const err = new Error("no events found");
      err.statusCode = 400;
      throw err;
    }
    res.status(200).json({
      events: events,
      total,
      currentPage: Number(page),
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

exports.getEventById = async (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.eventId)) {
    return res.status(400).json({ error: "Invalid event ID format" });
  }
  try {
    const event = await Event.findById(req.params.eventId);
    // console.log(events);
    if (!event) {
      const err = new Error("No event found");
      err.statusCode = 404;
      throw err;
    }

    res.status(200).json({ event: event });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.updateEvent = async (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.eventId)) {
    return res.status(400).json({ error: "Invalid event ID format" });
  }
  try {
    const event = await Event.findById(req.params.eventId);
    if (!event) {
      const err = new Error("No event found");
      err.statusCode = 404;
      throw err;
    }
    if (req.userId.toString() !== event.userId.toString()) {
      const err = new Error("Not authorized to update this event");
      err.statusCode = 403;
      throw err;
    }
    Object.assign(event, req.body);
    const updatedEvent = await event.save();
    res.status(200).json({ event: updatedEvent, message: "updated event" });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

exports.deleteEvent = async (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.eventId)) {
    return res.status(400).json({ error: "Invalid event ID format" });
  }
  try {
    const event = await Event.findById(req.params.eventId);
    if (!event) {
      const err = new Error("No event found to delete");
      err.statusCode = 404;
      throw err;
    }
    if (req.userId.toString() !== event.userId.toString()) {
      console.log("here");
      const err = new Error("Not authorized to delete this event");
      err.statusCode = 403;
      throw err;
    }
    await event.deleteOne();
    res
      .status(200)
      .json({ message: "event deleted", eventId: req.params.eventId });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};
