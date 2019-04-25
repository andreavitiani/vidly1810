const Joi = require("joi");
const mongoose = require("mongoose");

const userScheme = new mongoose.Schema({
  name: { type: String, required: 1, minlength: 5, maxlength: 40 },
  email: { type: String, required: 1, minlength: 5, maxlength: 40, unique: 1 },
  password: { type: String, required: 1, minlength: 8, maxlength: 40 }
});

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
      .max(50),
    //   .unique(),
    password: Joi.string()
      .required()
      .min(8)
      .max(50)
  });
  return Joi.validate(user, schema);
}

exports.validation = validation;
exports.User = User;
