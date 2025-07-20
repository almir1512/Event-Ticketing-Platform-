// controllers/superAdminController.js
const User = require("../models/user");

exports.updateUserRole = async (req, res, next) => {
  const role = req.body.role;
  const userId = req.body.userId;
  try {
    if (!["user", "admin", "superadmin"].includes(role)) {
      const err = new Error("invalid role");
      err.statusCode = 403;
      throw err;
    }

    const user = await User.findById(userId);
    if (!user) {
      const err = new Error("no super admin user found");
      err.statusCode = 404;
      throw err;
    }

    user.role = role;
    await user.save();
    res.json({ message: "Role updated", user });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};
