const { check, validationResult } = require("express-validator");
var express = require("express");
const User = require("../models/user");
var router = express.Router();

/* GET signup form */
router.get("/", function (req, res, next) {
  res.render("join", { title: "Join" });
});

router.post(
  "/",
  //Validate passcode
  check("passcode", "That is not the correct Club passcode.").equals(
    process.env.PASSCODE
  ),
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.render("join", {
        title: "Join",
        errors: errors.array(),
      });
    } else {
      //Update user to member
      User.findByIdAndUpdate(req.user._id, { ismember: true }, function (err) {
        if (err) {
          return next(err);
        }
        res.redirect("/");
      });
    }
  }
);
module.exports = router;

//add admin passcode
