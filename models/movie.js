const mongoose = require("mongoose");
const Joi = require("joi");

const { genreSchema } = require("./genre.js");

const Movie = mongoose.model(
  "movies",
  new mongoose.Schema({
    title: { type: String, trim: 1, required: 1, minlength: 5, maxlength: 50 },
    genre: { type: { genreSchema } },
    numberInStock: { type: Number, required: 1, min: 0, max: 255 },
    dailyRentalRate: { type: Number, required: 1, min: 0, max: 255 }
  })
);

// VALIDATION WITH JOY------------------------------------------------------------------------------------------------------------------------------------------------
// ????????????DO I NEED IT?? HOW CAN COEXISTH WITH MONGOOSE VALDATION AND WHY???????
function validation(movie) {
  const schema = Joi.object().keys({
    title: Joi.string()
      .required()
      .min(5)
      .max(50),
    // genre: Joi.string(),
    //   .required()
    //   .min(5)
    //   .max(50),
    genreId: Joi.objectId().required(),
    numberInStock: Joi.number()
      .min(0)
      .required(),
    dailyRentalRate: Joi.number()
      .min(0)
      .required()
  });
  return Joi.validate(movie, schema);
}
//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

// console.log(genreSchema.obj);

exports.Movie = Movie;
exports.validation = validation;
