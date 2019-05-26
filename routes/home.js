const express = require("express");
const router = express.Router();
const { Genre } = require("./../models/genre.js");
const { Movie } = require("./../models/movie.js");
const admin = require("../middleware/admin.js");
const auth = require("../middleware/auth.js");

// router.use(function(req, res, next) {
//   const loggedIn = req.cookies["x-auth-token"];
//   if (!loggedIn) res.redirect("/");
//   next();
// });

//ROUTING HOME--------------------------------------------------------------------------------------------------------
router.get("/", (req, res) => {
  const loggedIn = req.cookies["x-auth-token"];
  if (!loggedIn) res.render("login");
  const username = req.cookies["username"];
  res.render("dashboard", {
    title: "Vidly",
    loggedIn,
    username
  });
});

router.get("/profile", auth, (req, res) => {
  const loggedIn = req.cookies["x-auth-token"];
  // if (!loggedIn) res.redirect("/");
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
  if (loggedIn) res.redirect("/");
  const username = req.cookies["username"];
  res.render("login", {
    title: "LOGIN",
    loggedIn,
    username
  });
});

router.get("/dashboard", auth, (req, res) => {
  // const loggedIn = req.cookies["x-auth-token"];
  // if (!loggedIn) res.redirect("/");
  const username = req.cookies["username"];
  res.render("dashboard", {
    title: "DASHBOARD",
    loggedIn,
    username
  });
});

router.get("/genres", auth, async (req, res) => {
  const loggedIn = req.cookies["x-auth-token"];
  if (!loggedIn) res.redirect("/");
  const username = req.cookies["username"];
  const genres = await Genre.find().sort("name");
  res.render("genres", {
    genres,
    loggedIn,
    username
  });
});

router.get("/movies", auth, async (req, res) => {
  const loggedIn = req.cookies["x-auth-token"];
  if (!loggedIn) res.redirect("/");
  const username = req.cookies["username"];
  const movies = await Movie.find().sort("name");
  const genres = await Genre.find().sort("name");
  // console.log(genre);

  res.render("movies", {
    movies,
    genres,
    loggedIn,
    username
  });
});

// router.get("/genres", auth, async (req, res) => {
//   const loggedIn = req.cookies["x-auth-token"];
//   if (!loggedIn) res.redirect("/");
//   const username = req.cookies["username"];
//   const genres = await Genre.find().sort("name");
//   res.render("genres", {
//     genres,
//     loggedIn,
//     username
//   });
// });
// -----

router.get("/delete-genre", auth, async (req, res) => {
  // const loggedIn = req.cookies["x-auth-token"];
  // if (!loggedIn) res.redirect("/");
  const username = req.cookies["username"];
  res.render("delete-genre", {
    title: "DELETE A GENRE",
    loggedIn,
    username
  });
});

router.get("/add-new-genre", auth, async (req, res) => {
  // const loggedIn = req.cookies["x-auth-token"];
  // if (!loggedIn) res.redirect("/");
  const username = req.cookies["username"];
  res.render("add-new-genre", {
    title: "ADD A GENRE",
    loggedIn,
    username
  });
});

//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

module.exports = router;
