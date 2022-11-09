var express = require("express");
var router = express.Router();
const Message = require("../models/message");
const User = require("../models/user");
const { check, validationResult } = require("express-validator");

/* GET home page. */
router.get("/", function (req, res, next) {
  // query all messages and send to view
  Message.find({})
    .populate("owner")
    .exec(function (err, message_list) {
      if (err) {
        return next(err);
      }
      res.render("index", { title: "Home", messages: message_list });
    });
});

router.post("/", (req, res, next) => {
  Message.findByIdAndRemove(req.body.messageid, (err) => {
    if (err) {
      return next(err);
    } else {
      res.redirect("/");
    }
  });
});

router.post(
  "/admin",
  //Validate admin-passcode
  check("admin-passcode", "That is not the correct Admin passcode.").equals(
    process.env.ADMIN_PASSCODE
  ),
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.render("join", {
        title: "Join",
        errors: errors.array(),
      });
    } else {
      //Update user to admin
      User.findByIdAndUpdate(req.user._id, { isadmin: true }, function (err) {
        if (err) {
          return next(err);
        }
        res.redirect("/");
      });
    }
  }
);

router.get("/log-out", (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

module.exports = router;
