//DEPENDENCIES
const methodOverride = require("method-override");
// const pug = require("pug");
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
const mongoose = require("mongoose");
const auth = require("./routes/auth.js");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

if (!config.get("jwtPrivateKey")) {
  console.log("FATAL ERROR: jwtPrivateKey is not defined...");
  process.exit(1);
}

const Fawn = require("fawn"); // FAWN ALLOWS TO SIMULATE TRANSACTION (FROM SQL) IN NODE.JS THAT DOESNT HAVE THIS CONSTRUCT. THIS USE "TWO PHASE COMMITS" OF NODE UNDER THE HOOD FAWN HAS AN MPATH DEPENDENCY THAT HAVE A VULNERABILITY AND MPATH SHOULD BE UPDATE FROM THE DEVS
// //^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

// //FAWN "TRANSACTION" SETUP-----------------------------------------------------------------------------------------------------------------------

Fawn.init(mongoose);

// MONGOOSE MONGODB SETTING UP------------------------------------------------------------------------------------------------------------------------------------------------
mongoose
  .connect("mongodb://localhost/vidly", { useNewUrlParser: true })
  .then(() => console.log("connected to mongo db"))
  .catch(err => console.error("Could not connect to mongo db", err));
//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

// const logger = require("./middleware/logger.js");
const authenticator = require("./middleware/authenticator.js");
//SERVER
const app = express();
let port = process.env.PORT || 3001;
app.listen(port, () => console.log(`listening to port ${port}`));
//APPLICATION LEVEL MIDDLEWARES
app.use(helmet());
// app.use(methodOverride("_method"));

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

// //MORGAN
// if (app.get("env") === "development") {
//   app.use(morgan("tiny"));
//   console.log("I am using morgan because I AM IN DEVELOPMENT MODE");
//   debug("morgan enabled...");
// }

// //template engine middleware-------------------------------------------------------------------------------------
app.set("view engine", "pug");
app.set("views", "./views"); // The view folder is the default value. Can be changed.

//custom middlewares-------------------------------------------------------------------------------------
// app.use(logger);
// app.use(authenticator);
//URL OR BODY parsers middlewares-------------------------------------------------------------------------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//static website middleware-------------------------------------------------------------------------------------
app.use("/public", express.static("public"));
//routing middleware //ARE THESE ROUTING LEVEL MIDDLEWARES?*************--------------------------------------------------------------------
app.use("/api/genres", genres);
app.use("/api/customers", customers);
app.use("/api/movies", movies);
app.use("/api/rentals", rentals);
app.use("/api/users", users);
app.use("/api/auth", auth);
app.use("/", home);

//CASINO NEL CONFIGURARE VARIABILI ENVIRONAMENTALI, DOVE SONO STOCCATE? IN QUALE FILE?****** "SONO STOCCATE IN PROCESS CHE È UN OGGETTO GLOBALE COME KEY VALUE PAIRS"
//configuration using the config package dependency. you create a congig file with json files with specific names instead of saving anv variables via cli or inside the source code

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
