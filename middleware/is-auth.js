const jwt = require("jsonwebtoken");

const JWT_SECRET = "secret";

exports.verifyUser = (req, res, next) => {
  const authHeader = req.get("Authorization");

  if (!authHeader) {
    const err = new Error("no token found");
    err.statusCode = 401;
    throw err;
  }

  const token = authHeader.split(" ")[1];

  let decodedToken;
  try {
    decodedToken = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    err.statusCode = 500;
    throw err;
  }
  if (!decodedToken) {
    const err = new Error("not authenticated");
    err.statusCode = 422;
    throw err;
  }
  req.userId = decodedToken.userId;
  req.role = decodedToken.role;
  next();
};
