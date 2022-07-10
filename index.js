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
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

app.get("/logout", function (req, res, next) {
  req.logOut(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/login");
  });
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    req.flash("info", "You must be logged in.");
    res.redirect("/register");
  }
}

//  send user back to homepage after submitting a contact request
app.get("/submit", (req, res) => {
  res.render("index", {
    title: "Pets-R-Us",
  }); //respond with index.html
});

//  set the server to listen on port 3000
app.listen(3000);

// let username = req.body.username;
//   let password = req.body.password;

//   User.find({ username: username }).then((user) => {
//     if (user) {
//       bcrypt.compare(password, user.password, function (err, result) {
//         if (err) {
//           flash("Incorrect Password");
//         }
//         if (result) {
//           flash("Login Successful");
//         }
//       });
//     } else {
//       flash("Username not found");
//     }
//   });

// initializePassport(passport, (email) => {
//   return User.find(() =>  === username);
// });

// (passport) => {
//   passport.use(
//     new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
//       //match user
//       User.findOne({ email: email })
//         .then((user) => {
//           if (!user) {
//             return done(null, false, {
//               message: "that email is not registered",
//             });
//           }
//           //match password
//           bcrypt.compare(password, user.password, (err, isMatch) => {
//             if (err) throw err;

//             if (isMatch) {
//               return done(null, user);
//             } else {
//               return done(null, false, { message: "pass incorrect" });
//             }
//           });
//         })
//         .catch((err) => {
//           console.log(err);
//         });
//     })
//   );
//   passport.serializeUser(function (user, done) {
//     done(null, user.id);
//   });

//   passport.deserializeUser(function (id, done) {
//     User.findById(id, function (err, user) {
//       done(err, user);
//     });
//   });
// };

// passport.authenticate("local", {
//   successRedirect: "/dashboard",
//   failureRedirect: "/users/login",
//   failureFlash: true,
// });
