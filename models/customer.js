const mongoose = require("mongoose");
const Joi = require("joi");

const Customers = mongoose.model(
  "customers", //here is the name of the collection
  new mongoose.Schema({
    name: { type: String, required: 1, minlength: 5, maxlength: 50 },
    isGold: { type: Boolean, default: false },
    phone: { type: String, required: 1, minlength: 5, maxlength: 50 }
  })
);

// VALIDATION WITH JOY------------------------------------------------------------------------------------------------------------------------------------------------
// ????????????DO I NEED IT?? HOW CAN COEXISTH WITH MONGOOSE VALDATION AND WHY???????
function validation(customer) {
  const schema = Joi.object().keys({
    name: Joi.string()
      .required()
      .min(5)
      .max(50),
    isGold: Joi.boolean(),
    phone: Joi.string()
      .required()
      .min(5)
      .max(50)
  });
  return Joi.validate(customer, schema);
}
// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

exports.Customers = Customers;
exports.validation = validation;
