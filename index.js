// ============================================
//  Title: Pets-R-Us Assignment
//  Author: Danial Purselley
//  Date: 19 June 2022
//  Modified By: Danial Purselley
//  Description: The program will simulate
//  a pets-r-us page for web-340. This is the
//  index javascript file to run the node
//  and express server instance.
// ===========================================

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const bodyParser = require("body-parser");
const passport = require("passport");
const validator = require("validator");
const bcrypt = require("bcrypt");
const passportConfig = require("./models/passport-config");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");
const session = require("express-session");
const LocalStrategy = require("passport-local").Strategy;
let User = require("./models/user");
let Appointment = require("./models/appointments");

const app = express();
passportConfig();
mongoose.connect(
  "mongodb+srv://dgpurse:!Q%40W%23E%24R1q2w3e4r@buwebdev-cluster-1.078ar.mongodb.net/test"
);

//  set the view engine to html
app.engine(".html", require("ejs").__express);
//  assign the views path for my html
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "html");

//  tell express that the public directory holds the site assets
app.use(express.static(__dirname + "/public")); // allows me to connect to my css + image files
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  // variable to show if user is logged in
  // this variable is called in header.ejs
  thisUser = res.locals.currentUser;
  res.locals.errors = req.flash("error");
  res.locals.infos = req.flash("info");
  next();
});

//  index route for landing
app.get("/", (req, res, next) => {
  User.find()
    .sort({ createdAt: "descending" })
    .exec(function (err, users) {
      if (err) {
        return next(err);
      }
      res.render("index", {
        title: "Pets-R-Us",
        users: users,
      });
    });
});

//  grooming route via anchor link or direct paste
app.get("/grooming", (req, res) => {
  res.render("grooming", {
    title: "Grooming",
  }); //respond with grooming
});

//  boarding route via nav bar
app.get("/boarding", (req, res) => {
  res.render("boarding", {
    title: "Boarding",
  }); //respond with boarding
});

//  training route via nav bar
app.get("/training", (req, res) => {
  res.render("training", {
    title: "Training",
  }); //respond with boarding
});

//  profile page route
app.get("/register", (req, res) => {
  //  will find the list of users in the db and render them with the html
  User.find({}, function (err, users) {
    res.render("register", {
      title: "My Account",
      userList: users, //  user list that is iterated in /profile.html
    });
  });
});

//  post route for after the user submits their account creation
app.post(
  "/register",
  function (req, res, next) {
    //  assigning variables for the user data
    let username = req.body.username;
    let password = req.body.password;
    let email = req.body.email;
    //  three options here, err/user for incorrect or duplicate name
    User.findOne({ username: username }, function (err, user) {
      if (err) {
        return next(err);
      }
      if (user) {
        req.flash("error", "User already exists");
        return res.redirect("/profile");
      } //  this will create the new user if no errors
      let newUser = new User({
        username: username,
        password: password,
        email: email,
      }); //  saving the user to the db
      newUser.save(next);
    });
  }, //  directing them back after authenticated
  passport.authenticate("", {
    successRedirect: "/",
    failureRedirect: "/register",
  })
);

//  logging in
app.get("/login", (req, res) => {
  User.find({}, function (err, users) {
    res.render("login", {
      title: "Log In",
    });
  });
});
app.post(
  "/login",
  passport.authenticate("login", {
    successRedirect: "/schedule",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

//  scheduling route
app.get("/schedule", (req, res) => {
  if (!thisUser) {
    res.redirect("/login");
  } else {
    res.render("schedule.html", {
      title: "Appointment Scheduling",
    });
  }
});
app.post("/schedule", (req, res, next) => {
  let username = thisUser;
  let firstName = req.body.firstName;
  let lastName = req.body.lastName;
  let email = req.body.email;
  let service = req.body.service;

  let appointment = new Appointment({
    userName: username,
    firstName: firstName,
    lastName: lastName,
    email: email,
    service: service,
  });

  Appointment.create(appointment, function (err, appointment) {
    if (err) {
      console.log(err);
    } else {
      appointment.save(next);
      res.redirect("/");
    }
  });
});

//  logout the user
app.get("/logout", function (req, res, next) {
  req.logOut(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/login");
  });
});

//  check authentication
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    req.flash("info", "You must be logged in.");
    res.redirect("/register");
  }
}

//  send user back to homepage after submitting a contact request (fake)
app.get("/submit", (req, res) => {
  res.render("index", {
    title: "Pets-R-Us",
  }); //respond with index.html
});

//  set the server to listen on port 3000
app.listen(3000);
