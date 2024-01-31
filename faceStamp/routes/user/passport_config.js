require("dotenv").config({ path: __dirname + "/../../.env" });

const passport = require("passport"); //passport  = 여권이라는 이름과 같이 서버에서 사용자 인증하는 것
const { Strategy: LocalStrategy } = require("passport-local"); //passport의 인증 기능을 직접 구현시 사용
// const LocalStrategy = require("passport-local").Strategy; //이렇게 사용해도 무방
// const bcrypt = require("bcrypt"); //해쉬된 비밀번호를 비교하기 위해 사용
const user_db = require("./user_db.js");
const jwt = require("jsonwebtoken");
const passportConfig = { usernameField: "id", passwordField: "password" };
// const sns_passportConfig = {
//   usernameField: "email",
//   passwordField: "password",
// };
// 세션을 처리하는 방법
// 로그인을 성공했다는 사실을 세션 스토어 저장하는 기능
passport.serializeUser(function (user, done) {
  done(null, user);
});
// 방문할 때 마다 체크하는 것
passport.deserializeUser(function (user, done) {
  done(null, user);
});

// 아이디와 패스워드통해 로그인하는 전략으로 사용
passport.use(
  "local",
  new LocalStrategy(passportConfig, function (username, password, done) {
    // 사용자가 있는지 확인해주는 라우터
    user_db.signin(username, password, function (user, messageinfo) {
      if (messageinfo.state == process.env.result_ok) {
        let refresh_data = "2h";
        //토큰 생성
        //const token_access = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: (1000 * 60 * 60) / 1000});
        const token_access = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
          expiresIn: "1h",
        });
        const token_refresh = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {
          expiresIn: "2h",
        });

        //로그인 성공 시 리프레쉬토큰 DB저장
        user_db.update_token(
          user,
          token_refresh,
          function (user, messageinfo) {}
        );
        // 로그인의 성공 실패를 done을 통해 passport에게 알려줄 수 있다.
        return done(null, { token_access, token_refresh }, messageinfo);
      } else {
        return done(null, false, messageinfo);
      }
    });
  })
);

// passport.use(
//   "sns_local",
//   new LocalStrategy(sns_passportConfig, function (username, password, done) {
//     // 사용자가 있는지 확인해주는 라우터
//     user_db.sns_signin(username, password, function (user, messageinfo) {
//       if (messageinfo.state == process.env.result_ok) {
//         let refresh_data = "3h";
//         //토큰 생성
//         //const token_access = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: (1000 * 60 * 60) / 1000});
//         const token_access = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
//           expiresIn: "2h",
//         });
//         const token_refresh = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {
//           expiresIn: refresh_data,
//         });

//         //로그인 성공 시 리프레쉬토큰 DB저장
//         user_db.update_token(
//           username,
//           token_refresh,
//           function (user, messageinfo) {}
//         );
//         // 로그인의 성공 실패를 done을 통해 passport에게 알려줄 수 있다.
//         return done(null, { token_access, token_refresh }, messageinfo);
//       } else {
//         return done(null, false, messageinfo);
//       }
//     });
//   })
// );
module.exports = { passport };
