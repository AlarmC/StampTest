require("dotenv").config({ path: __dirname + "/../../.env" });

const jwt_decode = require("jwt-decode");
const jwt = require("jsonwebtoken");
var fs = require("fs");
const { get } = require("store");
exports.getlocalstorage = async function (req, res, done) {
  getObject = req.body;
  let conn;

  try {
    let userinfo = "";
    if (req.headers.cookie !== undefined) {
      if (req.headers.cookie.split(";")[0].indexOf("YJ_AUT") !== -1) {
        // req.headers.cookie.split(";")[0].replace("YJ_AUT=s%3A", "");
        const token = utill.decryptionAccessToken(
          req.headers.cookie.split(";")[0].replace("YJ_AUT=s%3A", "")
        );

        userinfo = define.userinfo_face;
        userinfo.ur_name = token.ur_name;
        userinfo.ur_email = token.ur_email;
        userinfo.no = token.no;
      }
    }
    done(userinfo);
  } catch (e) {
    done(null);
  } finally {
    if (conn) conn.release();
  }
};
exports.signin = function (id, password, done) {
  async function asyncFunction(id, password) {
    let conn;

    try {
      //DB접속
      conn = await db.pool.getConnection();

      var sql = `SELECT * FROM face_user WHERE user_id='${id}' AND user_pw='${password}'`;
      const rows = await conn.query(sql);
      
      if (rows.length > 0) {
        var userinfo = define.userinfo_face;
        userinfo.ur_id = rows[0].user_id;
        userinfo.ur_name = rows[0].user_name;
        userinfo.ur_email = rows[0].user_email;
        userinfo.no = rows[0].no;
        userinfo.ur_mobile = rows[0].user_phone;
        userinfo.ur_mode = rows[0].user_grade;

        var messageinfo = utill.create_message(
          process.env.result_ok,
          userinfo
        );
        done(userinfo, messageinfo); // 로그인 성공
        // console.log(`signin success`);
      } else {
        var messageinfo = utill.create_message(
          process.env.result_error,
          "사용자 아이디와 비밀번호를 확인하여 주시기 바랍니다."
        );
        done(null, messageinfo); // 로그인 성공
      }
      // if (salt.length > 0) {
      //   const hash_psassword = await utill.compareHashedPassword(
      //     salt[0].user_salt,
      //     password
      //   );
      //   var sql = `SELECT * FROM lms_user WHERE user_id='${id}' AND user_password='${hash_psassword.hash}'`;
      //   const rows = await conn.query(sql);

      // } else {
      //   var messageinfo = utill.create_message(
      //     process.env.result_error,
      //     "사용자 아이디와 비밀번호를 확인하여 주시기 바랍니다."
      //   );
      //   done(null, messageinfo); // 로그인 성공
      // }
    } catch (e) {
      var messageinfo = utill.create_message(
        process.env.result_error,
        "사용자 아이디와 비밀번호를 확인하여 주시기 바랍니다."
      );
      done(null, messageinfo); // 로그인 실패
      // console.log(`signin err`);
    } finally {
      if (conn) conn.release(); //release to pool
      // console.log(`conn del`);
    }
  }

  asyncFunction(id, password);
};

exports.update_token = function (user, token_refresh, done) {
  async function asyncFunction(id, token) {
    let conn;

    try {
      //DB접속
      conn = await db.pool.getConnection();
      var sql = `UPDATE face_user SET user_token='${token}' WHERE no='${user.no}'`;
      //const rows = await conn.query("SELECT * FROM yjsoft1.yj_member WHERE mb_id=? AND mb_password=?", [user_id, user_password]);
      const result = await conn.query(sql);

      if (result.affectedRows > 0) {
        var sql = `SELECT * from face_user WHERE no = '${user.no}'`;
        const rows = await conn.query(sql);
        var userinfo = define.userinfo_face;
        userinfo.ur_id = rows[0].user_id;
        userinfo.ur_name = rows[0].user_name;
        userinfo.ur_email = rows[0].user_email;
        userinfo.no = rows[0].no;
        userinfo.ur_mobile = rows[0].user_phone;
        userinfo.ur_mode = rows[0].user_grade;
        // userinfo.ur_image = rows[0].user_image;
        // userinfo.ur_type = rows[0].user_type;
        // userinfo.ur_nickname = rows[0].user_nickname;
        // userinfo_introduce = rows[0].user_introduce;

        var messageinfo = utill.create_message(
          process.env.result_ok,
          "사용자 정보 업데이트에 성공하였습니다."
        );
        done(userinfo, messageinfo); // 업데이트 성공
      } else {
        var messageinfo = utill.create_message(
          process.env.result_error,
          "사용자 정보 업데이트에 실패하였습니다."
        );
        done(userinfo, messageinfo); // 업데이트 성공
      }
    } catch (e) {
      var messageinfo = utill.create_message(
        process.env.result_error,
        "[업데이트 오류] " + e.message
      );
      done(null, messageinfo); // 업데이트 실패
    } finally {
      if (conn) conn.release(); //release to pool
    }
  }

  asyncFunction(user, token_refresh, function (user, message) {
    done(user, message);
  });
};

exports.signup_user = async function (req, res, done) {
  getObject = req.body;
  let conn;

  try {
    conn = await db.pool.getConnection();

    sql = `SELECT su_userid FROM sun_user WHERE su_userid ='${getObject.id}'`;
    const select_email = await conn.query(sql);

    let result_if = false;
    if (select_email[0] == undefined) {
      // const pbk_password = await utill.createHashedPassword(getObject.password);
      // sql = `INSERT INTO lms_user (user_name,user_id,user_email,user_password,user_salt,user_mobile,user_image,user_type,user_nickname,user_mode)
      //  VALUES ('${getObject.signName}','${getObject.email}','${getObject.email}','${pbk_password.hash}','${pbk_password.salt}','${getObject.mobile}','${getObject.image}','${getObject.type}','${getObject.nickname}','${getObject.mode}')`;
      // const result = await conn.query(sql);
      // result_if = true;
      // const pbk_password = await utill.createHashedPassword(getObject.password);
      sql = `INSERT INTO face_user (user_name, user_id, user_email, user_pw, user_phone)
       VALUES ('${getObject.signName}','${getObject.id}','${getObject.email}','${getObject.password}', '${getObject.hp}')`;
      const result = await conn.query(sql);
      result_if = true;
    }

    done(result_if);
  } catch (e) {
    done(null);
  } finally {
    if (conn) conn.release();
  }
};


exports.update_user = async function (req, res, done) {
  let getObject = req.body;
  let conn;
  try {
    conn = await db.pool.getConnection();

    let imageField = "";
    if(getObject.type) {
      imageField += `, user_email="${getObject.email}" , user_phone="${getObject.mobile}" `;
    } else {
      imageField += "";
    }
    var sql = `UPDATE face_user SET user_name="${getObject.name}" ${imageField} WHERE no=${getObject.no} `;
    const sqlUpdate = await conn.query(sql);
    if(sqlUpdate.affectedRows > 0){
      var sql = `SELECT * from face_user WHERE no=${getObject.no}`;
      const rows = await conn.query(sql);

      if(rows.length > 0){
        var userinfo = define.userinfo_face;
        userinfo.ur_id = rows[0].user_id;
        userinfo.ur_name = rows[0].user_name;
        userinfo.ur_email = rows[0].user_email;
        userinfo.no = rows[0].no;
        userinfo.ur_mobile = rows[0].user_phone;
        userinfo.ur_mode = rows[0].user_grade;
        done(userinfo);
      } else {
        done(null);
      }
    } else {
      done(null)
    }
  } catch (e) {
    done(null);
  } finally {
    if (conn) conn.release();
  }
};

exports.select_user = async function (req, res, done) {
  let getObject = req.body;
  let conn;

  try {
    conn = await db.pool.getConnection();

    var sql = `SELECT * FROM face_user WHERE no =${getObject.no}`;
    const rows = await conn.query(sql);
    if (rows.length > 0) {
      var userinfo = define.userinfo_face;
        userinfo.ur_id = rows[0].user_id;
        userinfo.ur_name = rows[0].user_name;
        userinfo.ur_email = rows[0].user_email;
        userinfo.no = rows[0].no;
        userinfo.ur_mobile = rows[0].user_phone;
        userinfo.ur_mode = rows[0].user_grade;

        var messageinfo = utill.create_message(
          process.env.result_ok,
          userinfo
        );
        done(userinfo, messageinfo); // 로그인 성공
    } else {
      var messageinfo = utill.create_message(
        process.env.result_error,

        "해당 유저 없음"
      );
      done(null, messageinfo);
    }
    
  } catch (e) {
    var messageinfo = utill.create_message(
      process.env.result_error,
      "오류 내용 : " + e.message
    );
  } finally {
    if (conn) conn.release();
  }
};

exports.select_charged_list = async function (req, res, done) {
  let conn;

  try {
    conn = await db.pool.getConnection();

    var sql = `SELECT SU.*, @ROWNUM:=@ROWNUM+1 AS ROWNUM FROM face_user SU , (SELECT @ROWNUM:=0) r WHERE user_grade = 2`;
    const rows = await conn.query(sql);
    if (rows.length > 0) {
      var messageinfo = utill.create_message(
        process.env.result_ok,

        "유저 목록 조회 성공"
      );
      done(rows, messageinfo);
    } else {
      var messageinfo = utill.create_message(
        process.env.result_ok,

        "유저 목록 없음"
      );
      done(rows, messageinfo);
    }
    
  } catch (e) {
    var messageinfo = utill.create_message(
      process.env.result_error,
      "오류 내용 : " + e.message
    );
  } finally {
    if (conn) conn.release();
  }
};

exports.select_user_list = async function (req, res, done) {
  let conn;

  try {
    conn = await db.pool.getConnection();

    var sql = `SELECT SU.*, @ROWNUM:=@ROWNUM+1 AS ROWNUM FROM sun_user SU , (SELECT @ROWNUM:=0) r`;
    const rows = await conn.query(sql);
    if (rows.length > 0) {
      var messageinfo = utill.create_message(
        process.env.result_ok,

        "유저 목록 조회 성공"
      );
      done(rows, messageinfo);
    } else {
      var messageinfo = utill.create_message(
        process.env.result_ok,

        "유저 목록 없음"
      );
      done(rows, messageinfo);
    }
    
  } catch (e) {
    var messageinfo = utill.create_message(
      process.env.result_error,
      "오류 내용 : " + e.message
    );
  } finally {
    if (conn) conn.release();
  }
};

exports.select_duplication_nickname = async function (req, res, done) {
  getObject = req.body;
  let conn;
  conn = await db.pool.getConnection();
  try {
    var sql = `SELECT user_nickname FROM lms_user WHERE user_nickname ='${getObject.user_nickname}'`;
    const rows = await conn.query(sql);
    if (rows.length > 0) {
      done(false);
    } else {
      done(true);
    }
  } catch (e) {
    done(null);
  } finally {
    if (conn) conn.release();
  }
};

// exports.update_user = async function (req, res, done) {
//   getObject = req.body;
//   let conn;
//   try {
//     conn = await db.pool.getConnection();
//     // let imageField = "";
//     // if (getObject.filename != "") {
//     //   imageField += ` user_image='${getObject.filename}', `;
//     // }

//     var sql = `UPDATE lms_user SET user_name='${getObject.name}',  user_nickname='${getObject.nickname}',
//     user_mobile='${getObject.mobile}' , user_image='${getObject.filename}' WHERE no=${getObject.no} `;

//     const rows = await conn.query(sql);

//     done(rows);
//   } catch (e) {
//     done(null);
//   } finally {
//     if (conn) conn.release();
//   }
// };

exports.tokenTest = async function (req, res, done) {
  getObject = req.body;
  let conn;

  try {
    const { exp } = utill.decryptionAccessToken(
      req.headers.cookie.split(";")[0].replace("YJ_AUT=s%3A", "")
    );
    if (Date.now() >= exp * 1000) {
      res.clearCookie(process.env.ACCESSTOKEN_COOKIE_NAME);
      // res.clearCookie(process.env.ACCESSTOKEN_COOKIE_NAME);
      done(true);
    } else {
      done(false);
    }
  } catch (e) {
    done(null);
  } finally {
    if (conn) conn.release();
  }
};

exports.tokenUpdate = async function (req, res, done) {
  let conn;

  try {
    //DB접속
    conn = await db.pool.getConnection();
    var sql = `SELECT * FROM face_user WHERE no='${req.refresh_decodeToken.no}'`;
    const rows = await conn.query(sql);

    // var sql = `SELECT * FROM lms_user WHERE user_token='${req.refreshToekn.replace(
    //   " YJ_REF=s%3A",
    //   ""
    // )}' AND no='${req.refresh_decodeToken.no}'`;
    // const rows = await conn.query(sql);

    if (rows.length > 0) {
      var userinfo = define.userinfo_face;
      userinfo.ur_id = rows[0].user_id;
      userinfo.ur_name = rows[0].user_name;
      userinfo.ur_email = rows[0].user_email;
      userinfo.no = rows[0].no;
      userinfo.ur_mobile = rows[0].user_phone;
      userinfo.ur_mode = rows[0].user_grade;

      const token_access = jwt.sign(userinfo, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "1h",
      });
      const token_refresh = jwt.sign(
        userinfo,
        process.env.REFRESH_TOKEN_SECRET,
        {
          expiresIn: "2h",
        }
      );
      done({ token_access, token_refresh }, userinfo);
    }
  } catch (e) {
    done(null);
  } finally {
    if (conn) conn.release();
  }
};

// exports.tokenUpdate = async function (req, res, done) {
//   try {
//     var userinfo = define.userinfo_funers;

//     //access 토큰 있으면
//     if (token.split(";")[0].indexOf("YJ_AUT") !== -1) {
//       const decodeToken = utill.decryptionToken(
//         token.replace("YJ_AUT=s%3A", "")
//       );

//       userinfo.ur_name = decodeToken.ur_name;
//       userinfo.ur_email = decodeToken.ur_email;
//       userinfo.no = decodeToken.no;

//       // const tokenUpdate = updateToken();
//       const token_access = jwt.sign(userinfo, process.env.ACCESS_TOKEN_SECRET, {
//         expiresIn: "1h",
//       });
//       const token_refresh = jwt.sign(
//         userinfo,
//         process.env.REFRESH_TOKEN_SECRET,
//         {
//           expiresIn: "2h",
//         }
//       );

//       res.cookie(process.env.ACCESSTOKEN_COOKIE_NAME, token.token_access, {
//         httpOnly: true,
//         signed: true,
//       });
//       res.cookie(process.env.REFRESHTOKEN_COOKIE_NAME, token.token_refresh, {
//         httpOnly: true,
//         signed: true,
//       });
//       done(true);
//     } else {
//       // 없다면 refreshtoken 검사
//       if (token.split(";")[0].indexOf("YJ_REF") !== -1) {
//         const decodeToken = utill.decryptionToken(
//           token.replace("YJ_AUT=s%3A", "")
//         );

//         userinfo.ur_name = decodeToken.ur_name;
//         userinfo.ur_email = decodeToken.ur_email;
//         userinfo.no = decodeToken.no;

//         // const tokenUpdate = updateToken();
//         const token_access = jwt.sign(
//           userinfo,
//           process.env.ACCESS_TOKEN_SECRET,
//           {
//             expiresIn: "1h",
//           }
//         );
//         const token_refresh = jwt.sign(
//           userinfo,
//           process.env.REFRESH_TOKEN_SECRET,
//           {
//             expiresIn: "2h",
//           }
//         );

//         res.cookie(process.env.ACCESSTOKEN_COOKIE_NAME, token.token_access, {
//           httpOnly: true,
//           signed: true,
//         });
//         res.cookie(process.env.REFRESHTOKEN_COOKIE_NAME, token.token_refresh, {
//           httpOnly: true,
//           signed: true,
//         });
//         done(true);
//       } else {
//         done(false);
//         //없으면 로그아웃 및 권한 없음
//         // return "";
//       }
//     }

//     done(true);
//   } catch (e) {
//     done(null);
//   } finally {
//     if (conn) conn.release();
//   }
// };

exports.fileCheck = function (req, done) {
  var getObject = req.body;

  for (var Field in getObject) {
    if (!getObject.hasOwnProperty(Field)) continue;

    if (Field == "image") {
      if (getObject[Field] != "") {
        var data_split = getObject[Field].split("file_name:");
        var regex = /^data:.+\/(.+);base64,(.*)$/;
        var matches = data_split[0].match(regex);
        var data = matches[2];
        var buffer = Buffer.from(data, "base64");

        // if (
        //   fs.existsSync(
        //     `${__dirname}/../../views/client/src/assets${data_split[3]}${data_split[1]}`
        //   )
        // ) {
        //   console.log("?");
        // }
        // if (
        //   fs.existsSync(
        //     `${__dirname}/../../views/client/src/assets${data_split[3]}314_undifined.jpg`
        //   )
        // ) {
        //   console.log("?");
        // }
        if (data_split[1] == data_split[2] || data_split[2] == "") {
          fs.writeFileSync(
            __dirname +
              "./../../public" +
              data_split[3] +
              data_split[1],
            buffer
          );
        }
      }
    }
  }
  done(true, "성공");
};

exports.delete_users = async function (req, res, done) {
  let conn;
  let getObject = req.body;

  try {
    conn = await db.pool.getConnection();

    var sql = `DELETE FROM face_user WHERE no in(${getObject})`;
    const rows = await conn.query(sql);

    const message = "삭제"
    done(message);

  } catch (e) {
    var messageinfo = utill.create_message(
      process.env.result_error,
      "오류 내용 : " + e.message
    );
  } finally {
    if (conn) conn.release();
  }
};
exports.insert_userinfo = async function (req, res, done) {
  let conn;
  let getObject = req.body;

  try {
    conn = await db.pool.getConnection();

    var sql = `SELECT user_id FROM face_user WHERE user_id ='${getObject.id}'`;
    const select_email = await conn.query(sql);
    if(select_email.length>0){
      const message = 0;
      done(message);
    } else {
      var sql = `INSERT INTO face_user (user_name, user_id, user_email, user_pw, user_phone, user_grade)
       VALUES ('${getObject.su_name}','${getObject.su_userid}','${getObject.su_email}','${getObject.su_password}', '${getObject.su_hp}', ${getObject.su_user_mode})`;
      
      const rows = await conn.query(sql);
      const message = rows.insertId;
      done(message);
    }

  } catch (e) {
    var messageinfo = utill.create_message(
      process.env.result_error,
      "오류 내용 : " + e.message
    );
  } finally {
    if (conn) conn.release();
  }
};

exports.update_user_info = async function (req, res, done) {
  let conn;
  let getObject = req.body;
  try {
    conn = await db.pool.getConnection();


    var sql = `UPDATE face_user SET user_id = "${getObject.su_userid}", user_name ="${getObject.su_name}", user_email ="${getObject.su_email}", user_phone ="${getObject.su_hp}",
     user_mode =${getObject.su_user_mode} WHERE no = ${getObject.su_no}`;

    const rows = await conn.query(sql);
    if(rows.affectedRows > 0){
      const message = "수정"
      done(message);
    } else {
      const message = "삭제"
      done(message);
    }


  } catch (e) {
    var messageinfo = utill.create_message(
      process.env.result_error,
      "오류 내용 : " + e.message
    );
  } finally {
    if (conn) conn.release();
  }
};