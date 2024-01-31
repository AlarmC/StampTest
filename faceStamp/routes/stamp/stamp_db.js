require("dotenv").config({ path: __dirname + "/../../.env" });

const jwt_decode = require("jwt-decode");
const jwt = require("jsonwebtoken");
var fs = require("fs");
const path = require('path');

exports.insert_stamp = async function (req, res, done) {
  let getObject = req.body;
  let conn;
  try {
    conn = await db.pool.getConnection();
    if(getObject.type == "quick"){
      var sql = `INSERT INTO face_image_list (image_name, image_producer, image_user, image_size, image_print_bool, image_type, image_style) VALUE 
        ("${getObject.file_name}","${getObject.user}", "${getObject.user}", ${getObject.size}, "${getObject.printBool}", "${getObject.type}", "${getObject.style}")`;
      const rows = await conn.query(sql);
      const message = rows.insertId;
      done(message);
    } else {
      var sql = `INSERT INTO face_image_list (image_name, image_producer, image_user, image_size, image_print_bool, image_type) VALUE 
        ("${getObject.file_name}","${getObject.user}", "${getObject.user}", ${getObject.size}, "${getObject.printBool}", "${getObject.type}")`;
      const rows = await conn.query(sql);
      const message = rows.insertId;
      done(message);
    }

  } catch (e) {
    done(null);
  } finally {
    if (conn) conn.release();
  }
};


exports.select_list = async function (req, res, done) {
  let getObject = req.body;
  let conn;

  try {
    conn = await db.pool.getConnection();

    var sql = `SELECT SU.*, @ROWNUM:=@ROWNUM+1 AS ROWNUM FROM face_image_list SU , (SELECT @ROWNUM:=0) r WHERE image_user = "${getObject.id}"`;
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

exports.send_list = async function (req, res, done) {
  let getObject = req.body;
  let conn;

  try {
    conn = await db.pool.getConnection();

    var sql = `SELECT SU.*, @ROWNUM:=@ROWNUM+1 AS ROWNUM FROM face_image_list SU , (SELECT @ROWNUM:=0) r WHERE no = ${getObject.list_no}`;
    const rows = await conn.query(sql);
    if (rows.length > 0) {
      var sql2 = `INSERT INTO face_image_list (image_name, image_producer, image_user, image_size, image_print_bool, image_type, image_style) VALUE 
      ("${rows[0].image_name}","${rows[0].image_producer}", "${getObject.user}", ${rows[0].image_size}, "true", "${rows[0].image_type}", "${rows[0].image_style}")`;
      const rows2 = await conn.query(sql2);
      done(rows2);
    } else {
      done(rows);
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

exports.delete_image_list = async function (req, res, done) {
  let getObject = req.body;
  let conn;

  try {
    conn = await db.pool.getConnection();
    var sql = `DELETE FROM face_image_list WHERE no = ${getObject.no}`;
    const rows = await conn.query(sql);
    done(rows);

  } catch (e) {
    var messageinfo = utill.create_message(
      process.env.result_error,
      "오류 내용 : " + e.message
    );
  } finally {
    if (conn) conn.release();
  }
};


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

        if (data_split[1] == data_split[2] || data_split[2] == "") {
          var folderPath = path.join(__dirname, "./../../public", data_split[3]);

          // 폴더가 없을 경우 생성
          if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath, { recursive: true });
          }

          var filePath = path.join(__dirname, "./../../public", data_split[3], data_split[1]);
          fs.writeFileSync(filePath, buffer);
        }
      }
    }
  }
  done(true, "성공");
};
