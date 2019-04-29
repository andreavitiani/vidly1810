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
  // user = new User({
  //   name: req.body.name,
  //   email: req.body.email,
  //   password: req.body.password
  // });

  user = new User(_.pick(req.body, ["name", "email", "password"]));
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  try {
    await user.save();
    // res.send(user); //this is wrong because it returns the password to the client
    // res.send({ name: user.name, email: user.email }); // this is correct because it returns no password to the client but there is the npm pkg Lodash that is better
    res.send(_.pick(user, ["_id", "name", "email"])); // lodash sintax
  } catch (error) {
    return res.status(400).send("This email is alredy registered...");
  }
});
//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

// READ√------------------------------------------------------------------------------------------------------------------------------------------------
router.get("/", async (req, res) => {
  const users = await Genre.find().sort("name");
  res.send(user);
});
//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

module.exports = router;
