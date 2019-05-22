module.exports = function(req, res, next) {
  if (!req.user.isAdmin)
    return res.status(403).send("Accedd denied from admin middleware module");
  next();
};
