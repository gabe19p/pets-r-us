const mongoose = require("mongoose");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const session = require("express-session");
const User = require("./user");
const flash = require("connect-flash");

module.exports = function () {
  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });
};

passport.use(
  "login",
  new LocalStrategy(function (username, password, done) {
    User.findOne({ username: username }, function (err, user) {
      if (err) {
        return done(err);
      }
      if (!user) {
        console.log("No user has that username!");
        return done(null, false, {
          message: "No user has that username!",
        });
      }
      user.checkPassword(password, function (err, isMatch) {
        if (err) {
          return done(err);
        }
        if (isMatch) {
          return done(null, user);
        } else {
          console.log("Invalid Password.");
          return done(null, false, { message: "Invalid Password." });
        }
      });
    });
  })
);

// all commented code below did not work

// function initialize(passport, getUserByUsername) {
//   const authenticateUser = (username, password, done) => {
//     const user = getUserByUsername(username);
//     if (user == null) {
//       return done(null, false, { message: "Username does not exist" });
//     }

//     try {
//       if (bcrypt.compare(password, user.password)) {
//         return done(null, user);
//       } else {
//         return done(null, false, { message: "Incorrect Password" });
//       }
//     } catch (e) {
//       return e;
//     }
//   };

//   passport.use(
//     new LocalStrategy({ usernameField: "username" }, authenticateUser)
//   );
//   passport.serializeUser((user, done) => {});
//   passport.deserializeUser((id, done) => {});
// }

// function (req, email, password, done) {
//     if (email) email = email.toLowerCase();

//     // asynchronous
//     process.nextTick(function () {
//       User.findOne({ email: email }, function (err, user) {
//         // if there are any errors, return the error
//         if (err) return done(err);

//         // if no user is found, return the message
//         if (!user)
//           return done(
//             null,
//             false,
//             req.flash("loginMessage", "No user found.")
//           );

//         if (!user.validPassword(password))
//           return done(
//             null,
//             false,
//             req.flash("loginMessage", "Oops! Wrong password.")
//           );
//         // all is well, return user
//         else return done(null, user);
//       });
//     });
//   },
