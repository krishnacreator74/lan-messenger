const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  let token = req.headers.authorization;

  if (!token) return res.status(401).json({ msg: "No token" });

  // 🔥 FIX HERE
  if (token.startsWith("Bearer ")) {
    token = token.slice(7);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      id: decoded.id,
      name: decoded.name,
    };

    next();
  } catch (err) {
    return res.status(401).json({ msg: "Invalid token" });
  }
};