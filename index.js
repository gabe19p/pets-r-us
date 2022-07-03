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
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");

let User = require("./models/user");

const app = express();

mongoose.connect(
  "mongodb+srv://dgpurse:!Q%40W%23E%24R1q2w3e4r@buwebdev-cluster-1.078ar.mongodb.net/test"
);

app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(flash());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

//  set the view engine to html
app.engine(".html", require("ejs").__express);

//  assign the views path for my html
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "html");

//  tell express that the public directory holds the site assets
app.use(express.static(__dirname + "/public")); // allows me to connect to my css + image files

app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
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
app.get("/profile", (req, res) => {
  //  will find the list of users in the db and render them with the html
  User.find({}, function (err, users) {
    res.render("profile", {
      title: "My Account",
      userList: users, //  user list that is iterated in /profile.html
    });
  });
});

//  post route for after the user submits their account creation
app.post(
  "/profile",
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
    failureRedirect: "/profile",
  })
);

//  send user back to homepage after submitting a contact request
app.get("/submit", (req, res) => {
  res.render("index", {
    title: "Pets-R-Us",
  }); //respond with index.html
});

//  set the server to listen on port 3000
app.listen(3000);
