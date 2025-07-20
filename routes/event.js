const express = require("express");
const eventController = require("../controllers/event");
const { verifyUser } = require("../middleware/is-auth");
const authorizeRoles = require("../middleware/authorizeRoles");
const router = express.Router();

//PPUBLIC ROUTES
router.get("/", eventController.getEvents);

router.get("/:eventId", eventController.getEventById);

//ADMIN ROUTES
router.post(
  "/",
  verifyUser,
  authorizeRoles(["admin", "superadmin"]),
  eventController.createEvent
);

router.put(
  "/:eventId",
  verifyUser,
  authorizeRoles(["admin", "superadmin"]),
  eventController.updateEvent
);

router.delete(
  "/:eventId",
  verifyUser,
  authorizeRoles(["admin", "superadmin"]),
  eventController.deleteEvent
);

module.exports = router;
