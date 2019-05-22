const express = require("express");
const router = express.Router();
const { Genre, validation } = require("./../models/genre.js");
const admin = require("../middleware/admin.js");
const auth = require("../middleware/auth.js");

//ROUTING HOME--------------------------------------------------------------------------------------------------------
router.get("/", (req, res) => {
  res.render("index", {
    title: "My express app"
  });
});

router.get("/login", (req, res) => {
  res.render("login", {
    title: "LOGIN"
  });
});

router.get("/list-genres", async (req, res) => {
  const genres = await Genre.find().sort("name");
  res.render("list-genres", {
    genres
  });
});

// -----

router.get("/delete-genre", async (req, res) => {
  res.render("delete-genre", {
    title: "DELETE A GENRE"
  });
});

router.get("/add-new-genre", async (req, res) => {
  res.render("add-new-genre", {
    title: "ADD A GENRE"
  });
});

//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

module.exports = router;
