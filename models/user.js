const mongoose = require("mongoose");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const flash = require("connect-flash");

const SALT_FACTOR = 10; //  the hash amount, as directed by the book
const noop = function () {}; //  empty function for password hashing, also from the book

//  setting up the user format
const userSchema = mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  email: { type: String, required: true },
});

//  pre-save to hash the user's password
userSchema.pre("save", function (done) {
  let user = this; //  referencing the user

  //  hash the password
  bcrypt.genSalt(SALT_FACTOR, function (err, salt) {
    if (err) {
      return done(err); //  error handlers
    }
    bcrypt.hash(user.password, salt, noop, function (err, hashedPassword) {
      if (err) {
        return done(err); //  error handlers
      }
      user.password = hashedPassword;
      done();
    });
  });
});

//  checking the user's password
userSchema.methods.checkPassword = function (guess, done) {
  bcrypt.compare(guess, this.password, function (err, isMatch) {
    done(err, isMatch);
  });
};

userSchema.methods.name = function () {
  return this.username;
};

//  assigning the Schema to an exportable module
let User = mongoose.model("User", userSchema);
module.exports = User;
