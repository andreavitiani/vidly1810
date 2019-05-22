const auth = require("../middleware/auth.js");
const mongoose = require("mongoose");
const { Rental, validation } = require("./../models/rental.js");
const express = require("express");
const router = express.Router();
const { Movie } = require("./../models/movie");
const { Customers } = require("./../models/customer.js");
const Fawn = require("fawn"); // FAWN ALLOWS TO SIMULATE TRANSACTION (FROM SQL) IN NODE.JS THAT DOESNT HAVE THIS CONSTRUCT. THIS USE "TWO PHASE COMMITS" OF NODE UNDER THE HOOD FAWN HAS AN MPATH DEPENDENCY THAT HAVE A VULNERABILITY AND MPATH SHOULD BE UPDATE FROM THE DEVS
//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

//FAWN "TRANSACTION" SETUP

// Fawn.init(mongoose);

Fawn.init("mongodb://127.0.0.1:27017/vidly");

//CRUD

//CREATE  ----------attenzione---- se incricca se uno degli id non esiste sistemare con if(!movie) edif(!customer) in quanto try catch è gia implementale
router.post("/", async (req, res) => {
  //, auth
  const { error } = validation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  let customer;
  let movie;
  try {
    customer = await Customers.findById(req.body.customerId);
    if (!customer)
      return res.status(404).send("The requested costumer does not exist");
  } catch (error) {
    return res
      .status(400)
      .send("This customer ID is not present in the database");
  }
  try {
    movie = await Movie.findById(req.body.movieId);
    if (!movie)
      return res.status(404).send("The requested movie does not exist");
  } catch (error) {
    return res.status(400).send("This movie is not present in the database");
  }

  let rental = new Rental({
    customer: {
      _id: customer._id,
      name: customer.name,
      phone: customer.phone
    },
    movie: {
      _id: movie._id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate
    }
  });
  // console.log(rental);
  try {
    // console.log(rental);
    let task = Fawn.Task();
    task.save("rentals", rental);
    task.update(
      "movies",
      { _id: movie._id },
      {
        $inc: { numberInStock: -1 }
      }
    );
    task.run();
    res.send(rental);
  } catch (error) {
    res
      .status(500)
      .send("Ooops, something went wrong. (Internal server error)");
  }
});

//READ
router.get("/", async (req, res) => {
  const rentals = await Rental.find().sort("-dateOut");
  res.send(rentals);
});

module.exports = router;
