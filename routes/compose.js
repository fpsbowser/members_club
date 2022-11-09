var express = require("express");
var router = express.Router();
const Message = require("../models/message");
const { check, validationResult } = require("express-validator");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("compose-message", { title: "Compose" });
});

router.post(
  "/",
  // Validate and Sanitize
  check("title", "Title must be specified!").trim().isLength({ min: 1 }),
  check("message", "Message must be specified!").trim().isLength({ min: 1 }),
  (req, res, next) => {
    const errors = validationResult(req);
    const message = new Message({
      title: req.body.title,
      text: req.body.message,
      timestamp: new Date(),
      owner: req.user._id,
    });
    if (!errors.isEmpty()) {
      // there are errors - re-render
      res.render("compose-message", {
        title: "Sign Up",
        errors: errors.array(),
        message: message,
      });
    } else {
      // success
      message.save((err) => {
        if (err) {
          return next(err);
        }
        res.redirect("/");
      });
    }
  }
);

module.exports = router;
