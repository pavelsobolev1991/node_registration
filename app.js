const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const app = express();
const mongoose = require("mongoose");
const passport = require("passport");
const flash = require("connect-flash");
const session = require("express-session");

app.engine("ejs", require("ejs-locals"));

//Passport config
require("./config/passport")(passport);

//DB config
const db = require("./config/keys").MongoURI;

//Connect to Mongo Data Base
mongoose
  .connect(db, { useUnifiedTopology: true, useNewUrlParser: true })
  .then(() => console.log("MondoDB Connected..."))
  .catch((err) => console.log("err"));

//EJS
app.use(expressLayouts);
app.set("view engine", "ejs");

//Bodyparser
//now we can get data from our form with request.body
app.use(express.urlencoded({ extended: false }));

//Express Session
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);

//Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables
app.use((req, res, next) =>{
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

//Routes
app.use('/', require('./routes/index'));
app.use("/users", require("./routes/users"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server started on port ${PORT}`));
