const express = require("express");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const Router = express.Router();
const passport = require("passport");
//login
Router.route("/login")
  .get((req, res, next) => {
    res.render("login");
  })
  .post((req, res, next) => {
    passport.authenticate("local", {
      successRedirect: "/dashboard",
      failureRedirect: "/users/login",
      failureFlash: true
    })(req, res, next);
  });

//register
Router.route("/register")
  .get((req, res, next) => {
    res.render("register");
  })
  .post((req, res, next) => {
    console.log(req.body);
    let { name, email, password, password2: confirmPassword } = req.body;
    //check validation
    let errors = [];
    if (!name || !email || !password || !confirmPassword) {
      errors.push({ msg: "Please fill in all fields" });
    }
    if (password !== confirmPassword) {
      errors.push({ msg: "Passwords must match!" });
    }
    console.log("\n pass \n", password);
    if (password.length < 6) {
      errors.push({ msg: "Passwords length  must be 6 or more!" });
    }
    if (errors.length > 0) {
      res.render("register", {
        errors,
        name,
        email,
        password,
        password2: confirmPassword
      });
    } else {
      //check if user already registered
      User.findOne({ email: email })
        .then(user => {
          if (user) {
            //user already exist
            errors.push({ msg: "this email is already registered!" });
            res.render("register", {
              errors,
              name,
              email,
              password,
              password2: confirmPassword
            });
          } else {
            //encrypt password
            bcrypt.genSalt(10, (error, salt) =>
              bcrypt.hash(password, salt, (error, hash) => {
                if (error) throw error;
                //set password to hash
                password = hash;
                User.create({ name, email, password })
                  .then(user => {
                    console.log("passwwwwword ", password);
                    req.flash(
                      "success_msg",
                      "You are now registered and can log in"
                    );
                    res.redirect("/users/login");
                  })
                  .catch(error => next(err));
              })
            );
          }
        })
        .catch(error => next(err));
    }
  });
Router.route("/logout").get((req, res) => {
  req.logout();
  req.flash("success_msg", "You are logged out");
  res.redirect("/users/login");
});

module.exports = Router;
