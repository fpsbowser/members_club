var express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
var router = express.Router();

passport.use(
  new LocalStrategy((username, password, done) => {
    User.findOne({ username: username }, (err, user) => {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }
      bcrypt.compare(password, user.password, (err, res) => {
        if (res) {
          return done(null, user);
        } else {
          return done(null, false, { message: "Incorrect password" });
        }
      });
    });
  })
);
passport.serializeUser(function (user, done) {
  done(null, user.id);
});
passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

router.get("/", function (req, res, next) {
  res.render("login-form", { title: "Login" });
});

router.post(
  "/",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login-form",
  })
);

module.exports = router;
