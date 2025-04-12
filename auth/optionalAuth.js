const jwt = require("jsonwebtoken");
require("dotenv").config();

function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith("Bearer ")) {
    try {
      const token = authHeader.split(" ")[1];
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      req.user = payload; // Now req.user is optionally available
    } catch (err) {
      // Invalid or expired token: silently ignore
      req.user = null;
    }
  } else {
    req.user = null;
  }

  next();
}

module.exports = optionalAuth;
