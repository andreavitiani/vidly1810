const express = require("express");
const router = express.Router();
const { Genre, validation } = require("./../models/genre.js");
// const { Genre, validation } = require("./../models/genre.js");
const admin = require("../middleware/admin.js");
const auth = require("../middleware/auth.js");

//ROUTING HOME--------------------------------------------------------------------------------------------------------
router.get("/", (req, res) => {
  const loggedIn = req.cookies["x-auth-token"];
  const username = req.cookies["username"];
  res.render("login", {
    title: "Vidly",
    loggedIn,
    username
  });
});

router.get("/profile", (req, res) => {
  const loggedIn = req.cookies["x-auth-token"];
  const username = req.cookies["username"];
  // const user = await User.find().sort("name");
  res.render("profile", {
    title: "Profile",
    loggedIn,
    username
  });
});

router.get("/login", (req, res) => {
  const loggedIn = req.cookies["x-auth-token"];
  const username = req.cookies["username"];
  res.render("login", {
    title: "LOGIN",
    loggedIn,
    username
  });
});

router.get("/dashboard", (req, res) => {
  const loggedIn = req.cookies["x-auth-token"];
  const username = req.cookies["username"];
  res.render("dashboard", {
    title: "DASHBOARD",
    loggedIn,
    username
  });
});

router.get("/list-genres", async (req, res) => {
  const loggedIn = req.cookies["x-auth-token"];
  const username = req.cookies["username"];
  const genres = await Genre.find().sort("name");
  res.render("list-genres", {
    genres,
    loggedIn,
    username
  });
});

// -----

router.get("/delete-genre", async (req, res) => {
  const loggedIn = req.cookies["x-auth-token"];
  const username = req.cookies["username"];
  res.render("delete-genre", {
    title: "DELETE A GENRE",
    loggedIn,
    username
  });
});

router.get("/add-new-genre", async (req, res) => {
  const loggedIn = req.cookies["x-auth-token"];
  const username = req.cookies["username"];
  res.render("add-new-genre", {
    title: "ADD A GENRE",
    loggedIn,
    username
  });
});

//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

module.exports = router;
