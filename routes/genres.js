const admin = require("../middleware/admin.js");
const auth = require("../middleware/auth.js");
const { Genre, validation } = require("./../models/genre.js");
const express = require("express");
const router = express.Router();
// const logger = require("../middleware/logger.js"); // JUST A CUSTOM MIDDLEWARE CREATED TO LEARN
const mongoose = require("mongoose");

//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

//REST HANDLERS WITH CRUD------------------------------------------------------------------------------------------------------------------------------------------------
// CHECK ALL√------------------------------------------------------------------------------------------------------------------------------------------------
router.get("/", auth, async (req, res) => {
  const genres = await Genre.find().sort("name");
  res.render("list-genres", {
    title: "GENRES LIST",
    genres
  });
  // res.send("genres");
});
//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

// CHECK BY ID------------------------------------------------------------------------------------------------------------------------------------------------
router.get("/:id", auth, async (req, res) => {
  // try {
  const genre = await Genre.findById(req.params.id);
  res.send(genre);
  // }
  // catch (err) {
  //   res.status(404).send("The requested genre does not exist");
  // }
});
//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

// ADD√------------------------------------------------------------------------------------------------------------------------------------------------
router.post("/", [auth, admin], async (req, res) => {
  const { error } = validation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let genre = await Genre.findOne({ name: req.body.name });
  if (genre)
    return res.status(400).send("The genre is already on the database");

  genre = new Genre({
    name: req.body.name
  });

  await genre.save();
  res.redirect("/list-genres");
});

//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

// MODIFY√------------------------------------------------------------------------------------------------------------------------------------------------
router.put("/:id", [auth, admin], async (req, res) => {
  const { error } = validation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  try {
    let genre = await Genre.findById(req.params.id);
    genre.name = req.body.name;
    genre = await genre.save();
    res.send(genre);
  } catch (err) {
    res.status(404).send("The requested genre does not exist");
  }
});
//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

// DELETE√------------------------------------------------------------------------------------------------------------------------------------------------
router.delete("/:id", [auth, admin], async (req, res) => {
  //aggiungi , [auth, admin] per verifica token
  try {
    const genre = await Genre.findByIdAndRemove(req.params.id);
    if (!genre)
      return res.status(404).send("The requested genre does not exist");
    res.redirect("/");
  } catch (error) {
    return res.status(404).send("The requested genre does not exist");
  }
});

//DELETE BY NAME IN GUI

router.post("/deletebyname", [auth, admin], async (req, res) => {
  const loggedIn = req.cookies["x-auth-token"];
  try {
    let genre = await Genre.findOne({ name: req.body.name });
    const genres = await Genre.find().sort("name");
    if (!genre)
      return res.status(404).send("The requested genre does not exist");
    genre = await Genre.findOneAndRemove({ name: req.body.name }).exec();

    res.render("delete-genre", loggedIn);
  } catch (error) {
    return res.status(404).send("The requested genre does not exist");
  }
});

//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

module.exports = router;
