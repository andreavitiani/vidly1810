//DEPENDENCIES
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
let port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening to port ${port}`));
//APPLICATION LEVEL MIDDLEWARES
app.use(helmet());
if (app.get("env") === "development") {
  app.use(morgan("tiny"));
  debug("morgan enabled...");
}
//template engine middleware
app.set("view engine", "pug");
app.set("views", "./views"); //default value can be overwritten
//custom middleware
// app.use(logger);
app.use(authenticator);
//URL OR BODY parsers middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//static website middleware
app.use(express.static("public"));
//routing middleware //ARE THESE ROUTING LEVEL MIDDLEWARES?*************
app.use("/api/genres", genres);
app.use("/api/customers", customers);
app.use("/api/movies", movies);
app.use("/api/rentals", rentals);
app.use("/api/users", users);
app.use("/", home);

//CASINO NEL CONFIGURARE VARIABILI ENVIRONAMENTALI, DOVE SONO STOCCATE? IN QUALE FILE?******
//configuration using the config package dependency. you create a congig file with json files with specific names
// console.log(`Application name: ${config.get("name")}`);

// console.log(`Mail server name: ${config.get("mail.host")}`);
// console.log(`Mail password is: ${config.get("mail.password")}`);

// console.log(`Node environement is: ${process.env.NODE_ENV}`);
console.log(`app is in: ${app.get("env")}`);
