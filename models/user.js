const config = require("config");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const mongoose = require("mongoose");

//USER SCHEMA------------------------------------------------------------------------------------------------------------------
const userScheme = new mongoose.Schema({
  name: { type: String, required: 1, minlength: 5, maxlength: 50 },
  email: { type: String, required: 1, minlength: 5, maxlength: 255, unique: 1 },
  password: { type: String, required: 1, minlength: 5, maxlength: 1024 },
  isAdmin: Boolean
});

userScheme.methods.generateAuthToken = function() {
  const token = jwt.sign(
    { _id: this._id, isAdmin: this.isAdmin },
    config.get("jwtPrivateKey")
  );
  return token;
}; //what is this??? Instead of writing everytime an auth token you declare a function iside the mongoose schema object. This method will be called whenever you need to generate the token and it is easily mantainable and modifiable

const User = mongoose.model("users", userScheme);

function validation(user) {
  const schema = Joi.object().keys({
    name: Joi.string()
      .required()
      .min(5)
      .max(50),
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
  return Joi.validate(user, schema);
}

exports.validation = validation;
exports.User = User;
