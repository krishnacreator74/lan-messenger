const jwt = require("jsonwebtoken");

// =========================
// AUTH MIDDLEWARE
// =========================
module.exports = function (req, res, next) {
  let token = req.headers.authorization;

  // No token
  if (!token) {
    return res.status(401).json({ msg: "No token" });
  }

  // Remove "Bearer " prefix if present
  if (token.startsWith("Bearer ")) {
    token = token.slice(7);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user to request
    req.user = {
      id: decoded.id,
      name: decoded.name,
    };

    next();
  } catch (err) {
    return res.status(401).json({ msg: "Invalid token" });
  }
};