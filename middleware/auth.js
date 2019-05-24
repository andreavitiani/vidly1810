const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = function(req, res, next) {
  const token = req.cookies["x-auth-token"];
  const usermane = req.cookies["username"];
  if (!token) return res.status(401).redirect("/"); //token missing
  try {
    const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
    req.user = decoded;
    console.log(decoded);
    next();
  } catch (error) {
    res.status(400).redirect("/"); //token not valid
  }
};
