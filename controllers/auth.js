const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const User = require("../models/user");

const JWT_SECRET = "secret";

exports.signup = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const name = req.body.name;
  const role = req.body.role;

  try {
    const hashedPassword = await bcrypt.hash(password, 12);

    const existingUser = await User.findOne({ email: email });

    if (existingUser) {
      const err = new Error("Email already found");
      err.statusCode = 409;
      throw err;
    }
    const user = new User({
      email: email,
      password: hashedPassword,
      name: name,
      role: role,
    });

    const result = await user.save();

    res.status(200).json({ message: "user created", userId: result._id });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

exports.login = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      const err = new Error("Email not found please register");
      err.statusCode = 401;
      throw err;
    }

    const isEqual = await bcrypt.compare(password, user.password);

    if (!isEqual) {
      const err = new Error("Password is wrong");
      err.statusCode = 422;
      throw err;
    }
    const token = jwt.sign(
      {
        email: email,
        userId: user._id.toString(),
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: "2h" }
    );
    res.status(200).json({
      token: token,
      userId: user._id.toString(),
    });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};
