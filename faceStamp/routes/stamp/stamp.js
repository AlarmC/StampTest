require("dotenv").config({ path: __dirname + "/../../.env" });
const axios = require("axios");
//express router
const express = require("express");
const router = express.Router();
const passport = require("passport");
const stamp_db = require("./stamp_db.js");


router.post("/insert_stamp", (req, res, next) => {
  try {
    stamp_db.fileCheck(req, function (result) {
      stamp_db.insert_stamp(req, res, function (result) {
        var messageinfo = utill.create_message(process.env.result_ok, result);
        res.json({messageinfo});
      });
    });
  } catch (e) {
    var messageinfo = utill.create_message(
      process.env.result_error,
      e.message
    );
    res.json({messageinfo});
  }
});


router.post("/select_list", (req, res, next) => {
  try {
    stamp_db.select_list(req, res, function (result) {
      var messageinfo = utill.create_message(
        process.env.result_ok,
        result,
        result.length
      );
      res.json({ messageinfo });
    });
  } catch (e) {
    var messageinfo = utill.create_message(
      process.env.result_error,
      "[오류] " + e.message
    );
    res.json({ messageinfo });
  }
});

router.post("/send_list", (req, res, next) => {
  try {
    stamp_db.send_list(req, res, function (result) {
      var messageinfo = utill.create_message(
        process.env.result_ok,
        result,
        result.length
      );
      res.json({ messageinfo });
    });
  } catch (e) {
    var messageinfo = utill.create_message(
      process.env.result_error,
      "[오류] " + e.message
    );
    res.json({ messageinfo });
  }
});

router.post("/delete_image_list", (req, res, next) => {
  try {
    stamp_db.delete_image_list(req, res, function (result) {
      var messageinfo = utill.create_message(
        process.env.result_ok,
        result,
        result.length
      );
      res.json({ messageinfo });
    });
  } catch (e) {
    var messageinfo = utill.create_message(
      process.env.result_error,
      "[오류] " + e.message
    );
    res.json({ messageinfo });
  }
});

module.exports = router;
