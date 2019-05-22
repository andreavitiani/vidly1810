const admin = require("../middleware/admin.js");
const auth = require("../middleware/auth.js");
const config = require("config");
const jwt = require("jsonwebtoken");
const { User, validation } = require("./../models/user.js");
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const _ = require("lodash");
const bcrypt = require("bcrypt");

// CREATE√------------------------------------------------------------------------------------------------------------------------------------------------
router.post("/", async (req, res) => {
  const { error } = validation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("This email is already registered.");

  user = new User(_.pick(req.body, ["name", "email", "password", "isAdmin"])); //loadash.pick method
  //PASSWORD ENCRYPTION THROUGH BCRYPT
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  const token = user.generateAuthToken();
  try {
    await user.save();
    res
      .header("x-auth-token", token) //send back to the client the token as an hearder element
      .send(_.pick(user, ["_id", "name", "email", "isAdmin"])); // lodash sintax. It is the underscore convention name for loadash.
  } catch (error) {
    return res.status(400).send("This email is alredy registered...");
  }
});
//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

// READ THE CURRENT USER√------------------------------------------------------------------------------------------------------------------------------------------------
router.get("/:me", [auth, admin], async (req, res) => {
  //, auth
  const user = await User.findById(req.user._id).select("-password");
  res.send(user);
});

//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

module.exports = router;
