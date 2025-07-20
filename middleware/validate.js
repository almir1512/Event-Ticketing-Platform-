const { validationResult } = require("express-validator");

module.exports = (req, res, next) => {
  const error = validationResult(req);

  if (!error.isEmpty()) {
    return res
      .status(400)
      .json({ errors: error.array().map((err) => err.msg) });
  }
  next();
};
