const Joi = require("joi");
const mongoose = require("mongoose");

const rentalSchema = new mongoose.Schema({
  customer: {
    type: new mongoose.Schema({
      name: { type: String, max: 250, required: 1 },
      phone: { type: String, min: 5, max: 50, required: 1 }
    }),
    required: 1
  },
  movie: {
    type: new mongoose.Schema({
      title: {
        type: String,
        trim: 1,
        required: 1,
        minlength: 5,
        maxlength: 50
      },
      dailyRentalRate: { type: Number, required: 1, min: 0, max: 255 }
    }),
    required: 1
  },
  dateOut: { type: Date, required: 1, default: Date.now },
  dateReturned: { type: Date },
  rentalFee: { type: Number, min: 0 }
});

const Rental = mongoose.model("rentals", rentalSchema);

function validation(rentalBodyRequest) {
  const schema = Joi.object().keys({
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required()
  });

  return Joi.validate(rentalBodyRequest, schema);
}

exports.validation = validation;
exports.Rental = Rental;
