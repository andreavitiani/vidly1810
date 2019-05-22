const admin = require("../middleware/admin.js");
const auth = require("../middleware/auth.js");
const { Movie, validation } = require("./../models/movie.js");
const express = require("express");
const router = express.Router();
// const logger = require("../middleware/logger.js"); // JUST A CUSTOM MIDDLEWARE CREATED TO LEARN
const mongoose = require("mongoose");
const { Genre } = require("./../models/genre.js");

//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
// router.use(logger);

//REST HANDLERS WITH CRUD------------------------------------------------------------------------------------------------------------------------------------------------
// CHECK ALL√------------------------------------------------------------------------------------------------------------------------------------------------
router.get("/", async (req, res) => {
  const movies = await Movie.find().sort("name");
  res.send(movies);
});
//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

// CHECK BY ID------------------------------------------------------------------------------------------------------------------------------------------------
router.get("/:id", async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    res.send(movie);
  } catch (err) {
    res.status(404).send("The requested movie does not exist");
  }
});

//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

// ADD√------------------------------------------------------------------------------------------------------------------------------------------------
router.post("/", [auth, admin], async (req, res) => {
  // , auth
  const { error } = validation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  let genre;
  try {
    genre = await Genre.findById(req.body.genreId);
  } catch (err) {
    res.status(404).send("Invalid genre...");
  }

  let movie = new Movie({
    title: req.body.title,
    genre: { _id: genre.id, name: genre.name },
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate
  });
  movie = await movie.save();
  res.send(movie);
});
//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

// MODIFY√------------------------------------------------------------------------------------------------------------------------------------------------
router.put("/:id", [auth, admin], async (req, res) => {
  const { error } = validation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  try {
    let movie = await Movie.findById(req.params.id);
    movie.title = req.body.title;
    movie.genre = req.body.genre; //--------
    movie.numberInStock = req.body.numberInStock;
    movie.dailyRentalRate = req.body.dailyRentalRate;
    movie = await movie.save();
    res.send(movie);
  } catch (err) {
    res.status(404).send("The requested movie does not exist");
  }
});
//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

// DELETE√------------------------------------------------------------------------------------------------------------------------------------------------
router.delete("/:id", [auth, admin], async (req, res) => {
  const movie = await Movie.findByIdAndRemove(req.params.id);
  if (!movie) return res.status(404).send("The requested movie does not exist");
  res.send("The movie is deleted");
});
//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

// console.log(authorSchema);

module.exports = router;
