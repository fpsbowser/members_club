const bcrypt = require("bcryptjs");
const User = require("../models/user");
const { check, validationResult } = require("express-validator");
var express = require("express");
var router = express.Router();

/* GET signup form */
router.get("/", function (req, res) {
  res.render("sign-up-form", { title: "Sign Up" });
});

router.post(
  "/",
  // Validate and Sanitize
  check("firstname", "Firstname must be specified!")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  check("lastname", "Lastname must be specified!")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  check("username", "Username must be specified!")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  check(
    "password",
    "Password must be at least 6 characters long and contain a lowercase, uppercase, and a number"
  )
    .trim()
    .isStrongPassword({
      minLength: 6,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 0,
    }),
  check("password-confirmation", "Passwords do not match!").custom(
    (value, { req }) => value === req.body.password
  ),
  (req, res, next) => {
    const errors = validationResult(req);
    const user = new User({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      username: req.body.username,
      password: req.body.password,
      ismember: false,
    });
    if (!errors.isEmpty()) {
      // there are errors - re-render
      res.render("sign-up-form", {
        title: "Sign Up",
        errors: errors.array(),
        user: user,
      });
    } else {
      bcrypt.hash(user.password, 10, (err, hashedPassword) => {
        if (err) {
          return next(err);
        }
        user.password = hashedPassword;
        user.save((err) => {
          if (err) {
            return next(err);
          }
          res.redirect("/login-form");
        });
      });
    }
  }
);

module.exports = router;
