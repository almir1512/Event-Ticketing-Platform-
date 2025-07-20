// middleware/authorizeRoles.js

const authorizeRoles = (roles = []) => {
  return (req, res, next) => {
    console.log(req.role);
    if (!roles.includes(req.role)) {
      return res.status(403).json({ error: "Access denied" });
    }
    next();
  };
};

module.exports = authorizeRoles;
