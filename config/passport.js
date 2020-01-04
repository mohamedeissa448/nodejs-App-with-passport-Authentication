const localStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("../models/user");

module.exports = function(passport) {
  passport.use(
    new localStrategy({ usernameField: "email" }, (email, password, done) => {
      //Match user
      User.findOne({ email: email })
        .then(user => {
          //if no email matched in database
          if (!user) {
            done(null, false, { message: "this email is not registered!" });
          } else {
            //password in DB is hashed,but user enters password unhashed,so we compare
            // Load hash from your password DB.
            const hash = user.password;
            bcrypt.compare(password, hash, function(err, res) {
              if (err) throw err;
              if (res) {
                //passwords are matched
                return done(null, user);
              } else {
                return done(null, false, { message: "password is incorrect!" });
              }
            });
          }
        })
        .catch(error => next(error));
    })
  );
  //to support sessions
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(error, user) {
      done(error, user);
    });
  });
};
