const mongoose = require("mongoose");
const Joi = require("joi");

const genreSchema = new mongoose.Schema({
  name: { type: String, required: 1, minlength: 6, maxlength: 50 }
});

const Genre = mongoose.model("genre", genreSchema);

// VALIDATION WITH JOY------------------------------------------------------------------------------------------------------------------------------------------------
// ????????????DO I NEED IT?? HOW CAN COEXISTH WITH MONGOOSE VALDATION AND WHY???????
function validation(genre) {
  const schema = Joi.object().keys({
    name: Joi.string()
      .required()
      .min(5)
      .max(50)
  });
  return Joi.validate(genre, schema);
}
//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

exports.Genre = Genre;
exports.validation = validation;
exports.genreSchema = genreSchema;
