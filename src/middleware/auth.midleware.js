const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    // validate
    const authHeader = req.header("Authorization");

    if (!authHeader) {
      return res.status(401).json({
        message: "Access denied. No token provided",
      });
    }
    // Extract token
    const token = authHeader.split(" ")[1];

    const decode = jwt.verify(token, "salait-system"); // ← FIXED
    req.user = decode;

    // ok allow
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid token",
    });
  }
};

module.exports = authMiddleware;
