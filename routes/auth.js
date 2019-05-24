//AKA LOGIN FILE

const config = require("config");
const jwt = require("jsonwebtoken");
const { User } = require("./../models/user.js");
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const Joi = require("joi");

//THIS IS A LOGIN MODULE

// const loggedIn = req.cookies["x-auth-token"];

// CREATE√ IN THIS CASE MEANS VALIDATE IF A USER EXIST AND CREDENTIAL ARE CORRECT AND GENERATE JWS------------------------------------------------------------------------------------------------------------------------------------------------
router.post("/", async (req, res) => {
  const { error } = validation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Invalid email or password.");

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send("Invalid email or password.");

  const token = user.generateAuthToken();

  res.cookie("x-auth-token", token);
  res.cookie("username", user.name);
  res.redirect("/dashboard");
  // console.log(config.get("jwtPrivateKey")); //niiiiiiiiice!!!!!
});

router.get("/logout", async (req, res) => {
  res.clearCookie("x-auth-token");
  res.clearCookie("username");
  res.redirect("/");
});
//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

function validation(req) {
  const schema = Joi.object().keys({
    email: Joi.string()
      .required()
      .min(6)
      .max(255)
      .email(),
    password: Joi.string()
      .required()
      .min(5)
      .max(255)
  });
  return Joi.validate(req, schema);
}

module.exports = router;
