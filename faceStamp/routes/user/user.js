require("dotenv").config({ path: __dirname + "/../../.env" });
const axios = require("axios");
//express router
const express = require("express");
const router = express.Router();
const passport = require("passport");
const user_db = require("./user_db.js");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const jwt_decode = require("jwt-decode");

// const { SolapiMessageService } = require("solapi");
// const messageService = new SolapiMessageService(
//   process.env.REACT_APP_SOLAPI_KEY,
//   process.env.REACT_APP_SOLAPI_SECRET_KEY
// ); //배포시 바꾸기

router.post("/send_sms", async (req, res) => {
  const randomNumber = Math.floor(100000 + Math.random() * 900000);
  try {
    var result = await messageService.send({
      to: `${req.body.mobileNum}`,
      // from: "01050442109",
      from: process.env.REACT_APP_MOBILE,
      text: `[퓨너스 클래스] 인증번호는 ${randomNumber}입니다.`,
      country: "82", // 미국 국가번호, 국가번호 뒤에 추가로 번호가 붙는 국가들은 붙여서 기입해야 합니다. 예) 1 441 -> "1441"
    });
    var messageinfo = utill.create_message(process.env.result_ok, randomNumber);
    res.json({ messageinfo });
  } catch (e) {
    var messageinfo = utill.create_message(
      process.env.result_error,
      "[접속 오류] " + e.message
    );
    res.json({ messageinfo });
  }
});


router.post("/mail", (req, res) => {
  // const { yourname, youremail, yoursubject, yourmessage } = req.body.data;

  const randomNumber = Math.floor(100000 + Math.random() * 900000);

  utill
    .mailer(randomNumber, req.body.email)
    .then((response) => {
      if (response === "success") {
        var messageinfo = utill.create_message(
          process.env.result_ok,
          randomNumber
        );
        res.json({ messageinfo });
      } else {
        var messageinfo = utill.create_message(
          process.env.result_error,
          "실패"
        );
        res.json({ messageinfo });
      }
    })
    .catch((er) => {
      var messageinfo = utill.create_message(
        process.env.result_error,
        "[접속 오류] " + e.message
      );
      res.json({ messageinfo });
    });
});

// 로컬 스토리지 재생성(매페이지마다)
router.post("/getlocalstorage", (req, res, next) => {
  try {
    // req.headers.cookie.split(";")[0].replace("YJ_AUT=s%3A", "");

    user_db.getlocalstorage(req, res, function (result) {
      var messageinfo = utill.create_message(process.env.result_ok, result);
      res.json({ messageinfo });
    });
  } catch (e) {
    res.json("");
  }
});

// 로그인 폼에서 전송한 데이터를 passport가 받는 부분
router.post("/signin", (req, res, next) => {
  try {
    passport.authenticate("local", (err, token, messageinfo) => {
      // local? // 아이디와 패스워드통해 로그인하는 전략으로 사용
      if (messageinfo.state == process.env.result_ok) {
        //토큰을 쿠키에 저장 (생성된 쿠키는 만료일을 지정하지 않아서 브라우저 종료시 자동 삭제됨)
        // if (req.body.autologin === true) {
        res.cookie(process.env.ACCESSTOKEN_COOKIE_NAME, token.token_access, {
          httpOnly: true,
          signed: true,
        });
        res.cookie(process.env.REFRESHTOKEN_COOKIE_NAME, token.token_refresh, {
          httpOnly: true,
          signed: true,
        });
        // }
        // console.log(messageinfo);
        res.json({ messageinfo });
      } else {
        res.json({ messageinfo });
      }
    })(req, res, next);
  } catch (e) {
    var messageinfo = utill.create_message(
      process.env.result_error,
      "[접속 오류] " + e.message
    );
    res.json({ messageinfo });
  }
});

/*로그인 시나리오
1. 로그인을 하면 Access Token과 Refresh Token을 모두 발급
   - */
router.post("/signup_user", (req, res, next) => {
  try {
    //토큰 유효
    //업무 로직 시작
    user_db.signup_user(req, res, function (result) {
      if (result) {
        passport.authenticate("local", (err, token, messageinfo) => {
          // local? // 아이디와 패스워드통해 로그인하는 전략으로 사용
          if (messageinfo.state == process.env.result_ok) {
            //토큰을 쿠키에 저장 (생성된 쿠키는 만료일을 지정하지 않아서 브라우저 종료시 자동 삭제됨)

            res.cookie(
              process.env.ACCESSTOKEN_COOKIE_NAME,
              token.token_access,
              {
                httpOnly: true,
                signed: true,
              }
            );
            res.cookie(
              process.env.REFRESHTOKEN_COOKIE_NAME,
              token.token_refresh,
              {
                httpOnly: true,
                signed: true,
              }
            );
            res.json({ token, messageinfo });
          } else {
            res.json({ token, messageinfo });
          }
        })(req, res, next);
      } else {
        var messageinfo = utill.create_message(
          process.env.result_error,
          "등록된 이메일 계정입니다."
        ); //쿠키가 존재하지만 날짜가 만료된 경우 로그인 필요 메시지 전송
        res.json({
          messageinfo,
        });
      }
    });
  } catch (e) {
    var messageinfo = utill.create_message(process.env.result_error, e.message);
    res.json({
      messageinfo,
    });
  }
});

router.post("/update_user", (req, res, next) => {
  try {
    user_db.fileCheck(req, function (result) {
      user_db.update_user(req, res, function (result) {
        // console.log(result);
        if (result) {
          var messageinfo = utill.create_message(process.env.result_ok, result); //쿠키가 존재하지만 날짜가 만료된 경우 로그인 필요 메시지 전송
          // let user = result;
          res.json({
            messageinfo,
          });
        } else {
          var messageinfo = utill.create_message(
            process.env.result_error,
            "데이터 저장에 실패하였습니다."
          ); //쿠키가 존재하지만 날짜가 만료된 경우 로그인 필요 메시지 전송
          res.json({
            messageinfo,
          });
        }
      });
    });
  } catch (e) {
    var messageinfo = utill.create_message(process.env.result_error, e.message);
    res.json({
      messageinfo,
    });
  }
});

router.post("/select_user", (req, res, next) => {
  try {
    user_db.select_user(req, res, function (result) {
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

router.post("/select_charged_list", (req, res, next) => {
  try {
    user_db.select_charged_list(req, res, function (result) {
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

router.post("/select_user_list", (req, res, next) => {
  try {
    user_db.select_user_list(req, res, function (result) {
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

router.post("/select_duplication_nickname", (req, res, next) => {
  try {
    user_db.select_duplication_nickname(req, res, function (result) {
      if (result) {
        var messageinfo = utill.create_message(process.env.result_ok, result); //쿠키가 존재하지만 날짜가 만료된 경우 로그인 필요 메시지 전송
        res.json({
          messageinfo,
        });
      } else {
        var messageinfo = utill.create_message(
          process.env.result_error,
          e.message
        );
        res.json({
          messageinfo,
        });
      }
    });
  } catch (e) {
    var messageinfo = utill.create_message(process.env.result_error, e.message);
    res.json({
      messageinfo,
    });
  }
});
// 매페이지마다 accesstoken 만료시 refresh 토큰 여부 확인 -> 없으면 로그아웃
router.post("/tokenTest", (req, res, next) => {
  try {
    user_db.tokenTest(req, res, function (result) {
      var messageinfo = utill.create_message(process.env.result_ok, result);

      res.json({ messageinfo });
    });
  } catch (e) {
    var messageinfo = utill.create_message(process.env.result_error, e.message);
    res.json({
      messageinfo,
    });
  }
});
router.post("/tokenUpdate", (req, res, next) => {
  if (req.headers.cookie) {
    try {
      user_db.tokenUpdate(req, res, function (result) {
        var messageinfo = utill.create_message(process.env.result_ok, result);

        res.json({ messageinfo });
      });
    } catch (e) {
      var messageinfo = utill.create_message(
        process.env.result_error,
        e.message
      );
      res.json({
        messageinfo,
      });
    }
  }
});

router.post("/signout", (req, res, next) => {
  try {
    res.clearCookie(process.env.ACCESSTOKEN_COOKIE_NAME);
    res.clearCookie(process.env.REFRESHTOKEN_COOKIE_NAME);

    var messageinfo = utill.create_message(
      process.env.result_ok,
      "쿠키가 삭제되었습니다."
    );
    res.json({ messageinfo });
  } catch (e) {
    var messageinfo = utill.create_message(process.env.result_error, e.message);
    res.json({
      messageinfo,
    });
  }
});

router.post("/delete_users", (req, res, next) => {
  try {
    user_db.delete_users(req, res, function (result) {
      var messageinfo = utill.create_message(process.env.result_ok, result);
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

router.post("/insert_userinfo", (req, res, next) => {
  try {
    user_db.insert_userinfo(req, res, function (result) {
      var messageinfo = utill.create_message(process.env.result_ok, result);
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

router.post("/update_user_info", (req, res, next) => {
  try {
    user_db.fileCheck(req, function (result) {
      user_db.update_user_info(req, res, function (result) {
        var messageinfo = utill.create_message(process.env.result_ok, result);
        res.json({ messageinfo });
      });
    })
  } catch (e) {
    var messageinfo = utill.create_message(
      process.env.result_error,
      "[오류] " + e.message
    );
    res.json({ messageinfo });
  }
});

module.exports = router;
