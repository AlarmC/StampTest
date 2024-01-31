require("dotenv").config({ path: "./.env" });
// const crypto = require("crypto-js");
const util = require("util");
const nanoid = require("nanoid");
const pbkdf2 = require("pbkdf2");
const bkfd2Password = require("pbkdf2-password");
const jwt_decode = require("jwt-decode");
const hasher = bkfd2Password();
const store = require("store");
const exp = require("constants");
const nodemailer = require("nodemailer");
const { env } = require("process");
// const passport = require('passport');
const createSalt = () => {
  //   const randomBytesPromise = util.promisify(crypto.randomBytes);

  const buf = nanoid(32);
  // crypto의 randomBytesPromise로 하면 쉽게 랜던값으로 추출 가능하나 , 정의되지 않은(현재 버전에서 사용 안된다는 글을 봄)
  // error로 계속 떠서 nanoid로 랜덤 값을 이용함

  return buf.toString("base64");
};
// exports.createHashedPassword = async (password) => {
//   const salt = await createSalt();
//   const pbkdf2Promise = util.promisify(crypto.pbkdf2);
//   const key = await pbkdf2Promise(password, salt, 104332, 64, "sha512");
//   const hashedPassword = key.toString("base64");

//   return { hashedPassword, salt };
// };

// 암호화 처리하는데 시간 걸리니까 비동기로 처리
// const createSalt = () => {
//   new Promise((resolve, reject) => {
//     crypto.randomBytes(64, (err, buf) => {
//       if (err) reject(err);
//       resolve(buf.toString("base64"));
//     });
//   });
// };

// exports.createHashedPassword = (parameters) => {
//   return new Promise((resolve, reject) => {
//     const salt = createSalt();
//     hasher(
//       {
//         password: parameters,
//       },
//       (err, password, salt, hash) => {
//         if (err) reject(err);
//         const result = {
//           salt, // 소금을 뿌리듯 입력 값에 salt 라는 특정 값을 붙힘
//           hash, //
//         };
//         resolve(result); // salt, 암호화된 hash 값을 보내준다.
//       }
//     );
//   });
// };
// exports.createHashedPassword = (parameters) => {
//   new Promise(async (resolve, reject) => {
//     const salt = createSalt();
//     pbkdf2.pbkdf2Sync(parameters, salt, 9999, 64, "sha512", (err, key) => {
//       if (err) {
//         reject(err);
//       } else {
//         const hash = key.toString("base64");
//         const result = {
//           salt, // 소금을 뿌리듯 입력 값에 salt 라는 특정 값을 붙힘
//           hash, //
//         };
//         resolve(result);
//       }
//     });
//   });
// };

exports.mailer = async (number, email) => {
  // let user_email = req.body.email; //받아온 email user_email에 초기화

  // 메일발송 함수

  const transporter = await nodemailer.createTransport({
    service: "gmail", //사용하고자 하는 서비스
    prot: 587,
    host: "smtp.gmlail.com",
    secure: false,
    requireTLS: true,
    auth: {
      user: process.env.REACT_APP_MAIL_ID, //gmail주소입력  //배포시 바꾸기
      pass: process.env.REACT_APP_MAIL_PASSWORD, //gmail패스워드 입력
    },
  });

  const mailOption = {
    from: process.env.REACT_APP_MAIL_ID, //보내는 주소 입력
    to: `${email}`, //위에서 선언해준 받는사람 이메일
    subject: "[퓨너스] 안녕하세요. 이메일 인증을 완료해주세요.", //메일 제목
    html: `<h1>안녕하세요. FUNERS CLASS입니다.</h1><br />
            이메일 인증을 완료해주세요<br />
            ${number}`,
  };

  try {
    await transporter.sendMail(mailOption);
    return "success";
  } catch (error) {
    return "error";
  }
};
// accessToekn /refreshToken 갱신
exports.accessTokenReissue = (token) => {
  // accesstoken이 있다면
  if (token.split(";")[0].indexOf("YJ_AUT") !== -1) {
    const decodeToken = utill.decryptionToken(token.replace("YJ_AUT=s%3A", ""));

    var userinfo = define.userinfo_funers;
    userinfo.ur_name = decodeToken.ur_name;
    userinfo.ur_email = decodeToken.ur_email;
    userinfo.no = decodeToken.no;

    // const tokenUpdate = updateToken();
    const token_access = jwt.sign(userinfo, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "1h",
    });
    const token_refresh = jwt.sign(userinfo, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: "2h",
    });

    res.cookie(process.env.ACCESSTOKEN_COOKIE_NAME, token.token_access, {
      httpOnly: true,
      signed: true,
    });
    res.cookie(process.env.REFRESHTOKEN_COOKIE_NAME, token.token_refresh, {
      httpOnly: true,
      signed: true,
    });
  } else {
    // 없다면 refreshtoken 검사
    if (token.split(";")[0].indexOf("YJ_REF") !== -1) {
      jwt_decode(token.replace("YJ_AUT=s%3A", ""));
      return "";
    } else {
      //없으면 로그아웃 및 권한 없음
      return "";
    }
  }
};

exports.decryptionAccessToken = (token) => {
  const decodeToken = jwt_decode(token);
  return decodeToken;
};
exports.decryptionRefreshToken = (token) => {
  const decodeToken = jwt_decode(token.replace("YJ_REF=s%3A", ""));
  return decodeToken;
};
exports.decryptionToken = (token) => {
  const decodeToken = jwt_decode(token);
  return decodeToken;
};
exports.createHashedPassword = (plainPassword) => {
  return new Promise((resolve, reject) => {
    const salt = createSalt(); // 소금 만들어서 대입
    let hash = pbkdf2.pbkdf2Sync(plainPassword, salt, 9999, 32, "sha512");
    hash = hash.toString("base64");
    if (hash !== "") {
      const result = {
        salt, // 소금을 뿌리듯 입력 값에 salt 라는 특정 값을 붙힘
        hash, //
      };
      resolve(result);
    } else {
      reject("에러");
    }
  });
};
exports.compareHashedPassword = (salt, plainPassword) => {
  return new Promise(async (resolve, reject) => {
    // conn = await db.pool.getConnection();
    // var sql_salt = `SELECT user_salt FROM lms_user WHERE user_email='${id}'`;
    // const salt = await conn.query(sql_salt);

    let hash = pbkdf2.pbkdf2Sync(plainPassword, salt, 9999, 32, "sha512");
    hash = hash.toString("base64");
    if (hash !== "") {
      const result = {
        salt, // 소금을 뿌리듯 입력 값에 salt 라는 특정 값을 붙힘
        hash, //
      };
      resolve(result);
    } else {
      reject("에러");
    }
  });
};
// exports.createHashedPassword = (plainPassword) => {
//   new Promise(async (resolve, reject) => {
//     // const salt = await createSalt(); // 소금 만들어서 대입
//     const salt = nanoid(64).toString("base64");
//     pbkdf2.pbkdf2Sync(plainPassword, salt, 9999, 64, "sha512", (err, key) => {
//       if (err) {
//         reject(err);
//       } else {
//         resolve({ password: key.toString("base64"), salt });
//       }
//     });
//   });
// };
exports.getCookie = function (req, cookie_name) {
  if (req.signedCookies[cookie_name] !== undefined) {
    return req.signedCookies[cookie_name];
  }
};
// exports.getCookie = function(req, cookie_name) {
//     if(req.cookies[cookie_name] !== undefined) {
//         return req.cookies[cookie_name];
//     }
// }

//디코딩 base64 ⇢ UTF8
exports.b64DecodeUnicode = function (str) {
  // Going backwards: from bytestream, to percent-encoding, to original string.
  return decodeURIComponent(
    atob(str)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );
};

exports.parseJwt = function (token) {
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace("-", "+").replace("_", "/");
  var rValue = b64DecodeUnicode(base64);
  return JSON.parse(rValue);
};

exports.date_check = function (token) {
  const expiryDate = new Date(token.exp * 1000);
  var date_current = new Date();

  if (date_current > expiryDate) return false; //만료됨
  else return true; //만료일 전
};

exports.create_message = function (message_type, msg1, msg2, msg3) {
  //초기화
  var messageinfo = define.messageinfo;
  messageinfo.state = "";
  messageinfo.message = "";
  messageinfo.message_data2 = ""; //category router
  messageinfo.message_data3 = ""; //category router

  //값 대입
  messageinfo.state = message_type;
  messageinfo.message = msg1;

  if (msg2 != null) {
    messageinfo.message_data2 = msg2;
  }
  if (msg3 != null) {
    messageinfo.message_data3 = msg3;
  }

  return messageinfo;
};

// exports.check_refreshToken = function(req, res, done) {
//     var getCookie_refreshToken = utill.getCookie(req, process.env.REFRESHTOKEN_COOKIE_NAME);
//     req.headers['authorization'] = 'Bearer '+ getCookie_refreshToken;

//     if (getCookie_refreshToken) {
//         passport.authenticate('jwtrefresh', { session: false }, (err, jwtPayload, messageinfo) => {
//             if (jwtPayload) {
//                 //토큰 유효
//             } else {
// 				var b = 0;
// 				var a =0;
//             }
//         });
//     }
// }
