//DEPENDENCIES
const methodOverride = require("method-override");
const jwt = require("jsonwebtoken");
const debug = require("debug")("app:startup");
// const dbDebugger = require("debug")("app:db");
const config = require("config");
const helmet = require("helmet");
const morgan = require("morgan");
const genres = require("./routes/genres.js");
const customers = require("./routes/customers.js");
const movies = require("./routes/movies.js");
const rentals = require("./routes/rentals.js");
const users = require("./routes/users.js");
const home = require("./routes/home.js");
const express = require("express");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const auth = require("./routes/auth.js");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

if (!config.get("jwtPrivateKey")) {
  console.log("FATAL ERROR: jwtPrivateKey is not defined...");
  process.exit(1);
}
// MONGOOSE MONGODB SETTING----------------------------------------------------------------------
mongoose
  .connect("mongodb://localhost/vidly", { useNewUrlParser: true })
  .then(() => console.log("connected to mongo db"))
  .catch(err => console.error("Could not connect to mongo db", err));
//fawn
const Fawn = require("fawn");
Fawn.init(mongoose);

//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
//SERVER
const app = express();
let port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening to port ${port}`));
//APPLICATION LEVEL MIDDLEWARES
app.use(helmet());
// app.use(methodOverride("_method"));
app.use(cookieParser());
app.use(
  methodOverride(function(req, res) {
    if (req.body && typeof req.body === "object" && "_method" in req.body) {
      // look in urlencoded POST bodies and delete it
      var method = req.body._method;
      delete req.body._method;
      return method;
    }
  })
);
//debug
// //MORGAN
// if (app.get("env") === "development") {
//   app.use(morgan("tiny"));
//   console.log("I am using morgan because I AM IN DEVELOPMENT MODE");
//   debug("morgan enabled...");
// }
//template engine middleware-------------------------------------------------------------------------------------
app.set("view engine", "pug");
app.set("views", "./views"); // The view folder is the default value. Can be changed.
//static website middleware-------------------------------------------------------------------------------------
app.use("/public", express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//routing middleware--------------------------------------------------------------------
app.use("/api/genres", genres);
app.use("/api/customers", customers);
app.use("/api/movies", movies);
app.use("/api/rentals", rentals);
app.use("/api/users", users);
app.use("/api/auth", auth);
app.use("/", home);
// Handle 404
app.use(function(req, res) {
  const error = 404;
  res.status(404);
  // const token = req.cookies("x-aut-token");
  // console.log(req.cookies("x-aut-token"));
  // if (!token) res.redirect("/");
  res.render("error", { error: "page not found, 404" });
});
// Handle 500
app.use(function(error, req, res, next) {
  // const token = req.cookie("x-aut-token");
  // if (!token) res.redirect("/");
  // console.log(token);

  const error = 500;
  res.status(500);
  res.render("error", { error: 500 });
});

//DEBUG CONSOLE LOGS----------------------------------------------------------------------------------------------------------------------------------------
// console.log(`Application name: ${config.get("name")}`);
// console.log(`Mail server name: ${config.get("mail.host")}`);
// console.log(`Mail password is: ${config.get("mail.password")}`);
// const jwtpk = config.get("jwtPrivateKey");
// console.log(`Const jwtPrivateKey = ${jwtpk}`);
// console.log(`Has jwtPrivateKey = ${config.has("jwtPrivateKey")}`);
// console.log(`Value of jwtPrivateKey = "${config.get("jwtPrivateKey")}"`);
// console.log(`jwtPrivateKey typeof = ${typeof config.get("jwtPrivateKey")}`);
console.log(`The app is in: ${process.env.NODE_ENV}`);
