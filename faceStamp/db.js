require("dotenv").config({
  path: __dirname + "/.env",
});

const mariadb = require("mariadb");
var fs = require("fs");
//crypto
// const cryptoJS = require("crypto-js");

// if (isTest == true) {
//     db_host_apply = process.env.db_host_debug;
// } else {

// }

const config = {
  host: process.env.REACT_APP_HOST,
  port: process.env.REACT_APP_PORT,
  user: process.env.REACT_APP_USER,
  password: process.env.REACT_APP_PASSWORD,
  database: process.env.REACT_APP_DATABASE,
  connectionLimit: process.env.REACT_APP_CONNECTION_LIMIT,
  supportBigNumbers: true,
  bigNumberInts: true,
};
exports.pool = mariadb.createPool(config);

var returnWhere = "";

exports.pool = mariadb.createPool(config);
// exports.db_change = async function(req,done){
// 	conn = await db.pool.getConnection();
// 	var getObject = req.body;

// 	sql = "SELECT mb_company FROM yj_member WHERE mb_id='"+getObject.id+"'";

// 	const result = await conn.query(sql);
// 	if(result.length==1){
// 		if(result[0].mb_company == "kit"){
// 			exports.pool = mariadb.createPool(config);
// 		}
// 		else{
// 			exports.pool = mariadb.createPool(config1);
// 		}
// 	}else{
// 		exports.pool = mariadb.createPool(config);
// 	}

// 	done(1);

// }

////////////
//SELECT
////////////
exports.select = function (req, res, sTable, done) {
  // var request = req.query;
  var request = req.body;
  getColumnNames(sTable, function (result_acolumns) {
    if (result_acolumns == null) {
      return;
    }

    var aColumns = result_acolumns;

    //Paging
    var sLimit = "";
    if (req.body.start != -1 && req.body.length != -1) {
      sLimit = "LIMIT " + req.body.start + ", " + req.body.length;
    }

    //Ordering
    if (req.body.order[0]) {
      var sOrder = "";
      var sCol = req.body.columns[req.body.order[0].column].data;
      var sDir = req.body.order[0].dir;
      sOrder = "ORDER BY " + sCol + " " + sDir;
    }

    //Filtering - all field
    var sWhere = "";
    if (req.body.search.value != "") {
      sWhere = "WHERE (";
      for (var i = 0; i < aColumns.length; i++) {
        sWhere +=
          aColumns[i] + " LIKE " + "'%" + req.body.search.value + "%'" + " OR ";
      }

      sWhere = sWhere.substring(0, sWhere.length - 4);
      sWhere += ")";
    }

    //Filtering - Individual field
    for (var i = 0; i < req.body.columns.length; i++) {
      if (
        req.body.columns[i].search.value &&
        req.body.columns[i].search.value != ""
      ) {
        if (sWhere == "") {
          sWhere = "WHERE ";
        } else {
          sWhere += " AND ";
        }
        sWhere +=
          " " +
          req.body.columns[i].data +
          " LIKE " +
          "'%" +
          req.body.columns[i].search.value +
          "%'" +
          " ";
      }
    }

    //Filtering - date range, customSearch
    if (req.body.customSearch && req.body.search.value == "") {
      // for(Field in req.body.customSearch)
      // {
      // 	if(!req.body.customSearch.hasOwnProperty(Field)) continue;
      // 	if(req.body.customSearch[Field]){
      // 		// if(sWhere == ""){
      // 		// 	sWhere += "where " + Field + " = '" + req.body.customSearch[Field] + "'";
      // 		// }else{
      // 		// 	sWhere += "AND " + Field + " = '" + req.body.customSearch[Field] + "'";
      // 		// }
      // 		if(Field == "cs_bt_name" || Field == "org_bt_no" || Field == "bt_name" || Field == "ur_bt_no"){
      // 			if(req.body.customSearch[Field].includes(",")){
      // 				var bt_name_split = req.body.customSearch[Field].split(", ");
      // 				for(var data of bt_name_split){
      // 					if(sWhere == "") {
      // 						sWhere = "WHERE (";
      // 					}
      // 					else {
      // 						sWhere += " OR ";
      // 					}
      // 					sWhere += " " + Field + " = '" + data + "'";
      // 				}
      // 				sWhere += ") ";
      // 			}
      // 			else{
      // 				if(sWhere == "") {
      // 					sWhere = "WHERE ";
      // 				}
      // 				else {
      // 					sWhere += " AND ";
      // 				}
      // 				sWhere += " " + Field + " = '" + req.body.customSearch[Field] + "'";
      // 			}
      // 		}
      // 		else if(Field.includes("search_start") || Field.includes("search_end")){
      // 			if (Field.includes("search_start") && req.body.customSearch[Field] != "") {
      // 				if(sWhere == "") {
      // 					sWhere = "WHERE ";
      // 				}
      // 				else {
      // 					sWhere += " AND ";
      // 				}
      // 				var fieldname = Field.replace('search_start_', '');
      // 				sWhere += fieldname + " BETWEEN '" + req.body.customSearch[Field];
      // 			} else if (Field.includes("search_end")) {
      // 				sWhere += "' AND DATE_ADD('" + req.body.customSearch[Field] + "', INTERVAL 1 DAY)";
      // 			}
      // 		}
      // 		else{
      // 			if(sWhere == "") {
      // 				sWhere = "WHERE ";
      // 			}
      // 			else {
      // 				sWhere += " AND ";
      // 			}
      // 			if(Field == "cs_org_name" || Field == "cs_ur_hp"){
      // 				sWhere += " " + Field + " LIKE " + "\'%" + req.body.customSearch[Field] + "%\'" + " ";
      // 			}
      // 			else if(Field == "cs_complete_dt" || Field == "cs_final_complete_dt" || Field == "cs_bf_name" || Field == "cs_kpss_reg_dt"){
      // 				// 관찰관리 리스트 처음 시작 조건
      // 				sWhere += " " + Field + " " + req.body.customSearch[Field] + " ";
      // 				sOrder = sOrder.replace("desc", "");
      // 			}
      // 			else if(Field == "bt_paper_end_dt"){
      // 				var split_bt_paper_end_dt = req.body.customSearch[Field].split(",");
      // 				if(split_bt_paper_end_dt[0] == "진행"){
      // 					sWhere += " " + Field + " > str_to_date('" + split_bt_paper_end_dt[1] + "','%Y-%m-%d') ";
      // 				}
      // 				else{
      // 					sWhere += " " + Field + " < str_to_date('" + split_bt_paper_end_dt[1] + "','%Y-%m-%d') ";
      // 				}
      // 			}
      // 			else{
      // 				sWhere += " " + Field + " = '" + req.body.customSearch[Field] + "'";
      // 			}
      // 		}
      // 	}
      // if (Field.includes("search_start")) {
      // 	if(sWhere == "") {
      // 		sWhere = "WHERE ";
      // 	}
      // 	else {
      // 		sWhere += " AND ";
      // 	}
      // 	var fieldname = Field.replace('search_start_', '');
      // 	sWhere += fieldname + " BETWEEN '" + req.body.customSearch[Field];
      // } else if (Field.includes("search_end")) {
      // 	sWhere += "' AND DATE_ADD('" + req.body.customSearch[Field] + "', INTERVAL 1 DAY)";
      // }
      // }
    }

    // 선택한 row의 고유번호가 있을 경우 (선택한 항목의 하위 내용만 보여줄 때)
    if (req.body.selectno) {
      for (Field in req.body.selectno) {
        if (!req.body.selectno.hasOwnProperty(Field)) continue;

        if (sWhere == "") {
          sWhere += "where " + Field + " = '" + req.body.selectno[Field] + "'";
        } else {
          sWhere += "AND " + Field + " = '" + req.body.selectno[Field] + "'";
        }
      }
    }

    var iFilteredTotal = {};
    var iTotal = {};
    var rResultTotal = {};
    var aResultTotal = {};

    // var getNo = 'null';
    // var field_name = "";

    // if(req.get("selectno")){
    // 	field_name = aColumns[1];
    // 	getNo = req.get("selectno");
    // }

    // if(getNo != 'null'){
    // 	if(sWhere == ""){
    // 		sWhere += "where " + field_name + " = '" + getNo + "'";
    // 	}else{
    // 		sWhere += "AND " + field_name + " = '" + getNo + "'";
    // 	}
    // }

    var sql =
      "SELECT SQL_CALC_FOUND_ROWS " +
      aColumns.join(",") +
      " FROM " +
      sTable +
      " " +
      sWhere +
      " " +
      sOrder +
      " " +
      sLimit +
      "";
    returnWhere = "";
    returnWhere = sWhere;
    getResult_dbRow(sTable, sql, function (result_1, FOUND_ROWS) {
      iFilteredTotal = FOUND_ROWS;
      sql = "SELECT COUNT(*) FROM " + sTable;

      getResult_dbRow(sTable, sql, function (result_3) {
        rResultTotal = result_3;
        aResultTotal = rResultTotal;
        iTotal = aResultTotal[0]["COUNT(*)"];

        //Output
        var output = {};

        output.iTotalRecords = iTotal;
        output.iTotalDisplayRecords = iFilteredTotal;
        output.where = returnWhere;
        output.aaData = [];

        var aRow = result_1;
        for (var i = 0; i < aRow.length; i++) {
          var jsonData = {};
          for (Field in aRow[i]) {
            if (!aRow[i].hasOwnProperty(Field)) continue;
            jsonData[Field] = aRow[i][Field];
          }
          output.aaData.push(jsonData);
        }

        output.sEcho = req.body.draw;
        if (request["sEcho"] == undefined) output.sEcho = 0;
        else output.sEcho = parseInt(request["sEcho"]);

        done(output);
      });
    });
  });
};

function getColumnNames(sTable, done) {
  aColumns = [];

  async function asyncFunction() {
    let conn;
    try {
      //DB접속
      conn = await db.pool.getConnection();
      var sql = "SHOW COLUMNS FROM " + sTable;
      const rows = await conn.query(sql);
      for (var i = 0; i < rows.length; i++) {
        aColumns.push(rows[i]["Field"]);
      }
      done(aColumns);
    } catch (e) {
      done(null); // 로그인 실패
    } finally {
      if (conn) conn.release(); //release to pool
    }
  }

  asyncFunction();
}

function getResult_dbRow(getTable, sql, done) {
  aColumns = [];

  const sTable = getTable;
  async function asyncFunction() {
    let conn;

    try {
      conn = await db.pool.getConnection();
      const rows = await conn.query(sql);

      sql = "SELECT FOUND_ROWS()";
      const rows_founds = await conn.query(sql);

      done(rows, rows_founds[0]["FOUND_ROWS()"]);
    } catch (e) {
      done(null);
    } finally {
      if (conn) conn.release();
    }
  }

  asyncFunction();
}

////////////
//INSERT
////////////
exports.insert = function (req, res, sTable, done) {
  async function asyncFunction(getInsertString) {
    let conn;
    try {
      //DB접속
      conn = await db.pool.getConnection();

      // var request = req.body;
      var sql = "INSERT INTO " + sTable + getInsertString;
      const rows = await conn.query(sql);
      done(rows);
    } catch (e) {
      done(null);
    } finally {
      if (conn) conn.release(); //release to pool
    }
  }

  var getInsertString = create_insert_string(req);

  asyncFunction(getInsertString);
};

function create_insert_string(req) {
  var getObject = req.body;

  //COLUMNS
  var comma = "";
  var insert_coulumns = " (";
  for (var Field in getObject) {
    if (!getObject.hasOwnProperty(Field)) continue;

    if (Field != "image") {
      //no 필드 제외
      if (Field === "	o") {
        continue;
      }

      if (Field === "ur_password") {
        if (getObject[Field] == "") {
          continue;
        }
      }

      if (Field != "table_name") {
        insert_coulumns += comma + Field;
        comma = ", ";
      }
    }
  }
  insert_coulumns += ") VALUES (";

  //VALUES
  comma = "";
  for (var Field in getObject) {
    if (!getObject.hasOwnProperty(Field)) continue;

    if (Field != "image") {
      //no 필드 제외
      if (Field === "no") {
        continue;
      }

      if (!getObject[Field]) {
        getObject[Field] = "";
      }

      if (Field === "ur_password") {
        if (getObject[Field] != "") {
          var hash = cryptoJS.SHA1(getObject[Field]);
          hash = hash.toString();
          insert_coulumns += comma + "'" + hash + "'";
        }
      } else {
        if (Field != "table_name") {
          insert_coulumns += comma + "'" + getObject[Field] + "'";
        }
      }

      // insert_coulumns += comma + "'" + getObject[Field] + "'";
      comma = ", ";
    }
  }
  insert_coulumns += ") ";

  return insert_coulumns;
}

////////////
//UPDATE
////////////
exports.update = function (req, res, sTable, done) {
  async function asyncFunction(getUpdateString) {
    let conn;
    try {
      //DB접속
      conn = await db.pool.getConnection();

      // var request = req.body;
      var sql = "UPDATE " + sTable + " SET " + getUpdateString;
      const rows = await conn.query(sql);
      done(rows);
    } catch (e) {
      done(null); // 로그인 실패
    } finally {
      if (conn) conn.release(); //release to pool
    }
  }

  var getUpdateString = create_update_string(req);

  asyncFunction(getUpdateString);
};

function create_update_string(req) {
  var getObject = req.body;

  //COLUMNS
  var comma = "";
  var update_columns = "";
  var where_string = "";
  //!현재 버전에서는 한개의 필드만 where 에 사용	(여러개의 리스트 삭제는 가능하지만 여러 필드를 where 절에 추가하는 구문 개발 안함)
  // for	(var i=0; i<getObject.length; i++) {
  for (var i = 0; i < 1; i++) {
    for (var Field in getObject) {
      if (!getObject.hasOwnProperty(Field)) continue;

      if (Field != "image") {
        //no 필드 제외 (where 절로 사용)
        if (Field === "no") {
          //continue;

          where_string = " WHERE " + Field + "=" + getObject[Field];
        }

        if (Field === "ur_password") {
          if (getObject[Field] != "") {
            update_columns += comma + Field;
            update_columns += "=";

            var hash = cryptoJS.SHA1(getObject[Field]);
            hash = hash.toString();

            update_columns += "'" + hash + "'";
            comma = ", ";
          }
        } else {
          if (Field != "table_name") {
            update_columns += comma + Field;
            update_columns += "=";
            update_columns += "'" + getObject[Field] + "'";
            comma = ", ";
          }
        }
      }
    }
  }
  update_columns += where_string;

  return update_columns;
}

////////////
//DELETE
////////////
exports.delete = function (req, res, sTable, done) {
  async function asyncFunction(getdeleteString) {
    let conn;
    try {
      //DB접속
      conn = await db.pool.getConnection();

      // var request = req.body;
      var sql = "DELETE FROM " + sTable + " WHERE " + getdeleteString;

      const rows = await conn.query(sql);
      done(rows);
    } catch (e) {
      done(null); // 로그인 실패
    } finally {
      if (conn) conn.release(); //release to pool
    }
  }

  var getDeleteString = create_delete_string(req);

  asyncFunction(getDeleteString);
};

function create_delete_string(req) {
  var getObject = req.body;

  //COLUMNS
  var delete_columns = "";
  //!현재 버전에서는 한개의 필드만 where 에 사용	(여러개의 리스트 삭제는 가능하지만 여러 필드를 where 절에 추가하는 구문 개발 안함)
  // for	(var i=0; i<getObject.length; i++) {
  for (var i = 0; i < 1; i++) {
    for (var Field in getObject[i]) {
      if (!getObject[i].hasOwnProperty(Field)) continue;

      if (Field != "image") {
        delete_columns += Field;
      }
    }
  }
  delete_columns += " In (";

  //VALUES
  var comma = "";
  for (var i = 0; i < getObject.length; i++) {
    for (var Field in getObject[i]) {
      if (!getObject[i].hasOwnProperty(Field)) continue;

      if (Field != "image") {
        delete_columns += comma + getObject[i][Field];
        comma = ", ";
      } else {
        if (
          fs.existsSync(
            __dirname + "/views/p9net-images/gallery/" + getObject[i][Field]
          )
        ) {
          fs.unlink(
            __dirname + "/views/p9net-images/gallery/" + getObject[i][Field],
            (err) => {}
          );
        }
      }
    }
  }
  delete_columns += ")";

  return delete_columns;
}

////////////
//fileCheck
////////////
exports.fileCheck = function (req, done) {
  var getObject = req.body;

  for (var Field in getObject) {
    if (!getObject.hasOwnProperty(Field)) continue;

    if (Field == "image") {
      if (getObject[Field] != "") {
        // data_split[0] : 암호화된 이미지 데이터
        // data_split[1] : 저장할 파일명
        // data_split[2] : 변경 전 파일명
        // data_split[3] : 저장할 경로
        var data_split = getObject[Field].split("file_name:");
        var regex = /^data:.+\/(.+);base64,(.*)$/;
        var matches = data_split[0].match(regex);
        var data = matches[2];
        var buffer = Buffer.from(data, "base64");

        if (data_split[1] == data_split[2] || data_split[2] == "") {
          fs.writeFileSync(
            __dirname + "/views" + data_split[3] + data_split[1],
            buffer
          );
        } else {
          // 해당 경로에 변경 전 파일명이 있는지 확인
          if (
            fs.existsSync(__dirname + "/views" + data_split[3] + data_split[2])
          ) {
            // 변경 전 파일이 있을 경우 삭제 후 저장
            fs.unlink(
              __dirname + "/views" + data_split[3] + data_split[2],
              (err) => {
                fs.writeFileSync(
                  __dirname + "/views" + data_split[3] + data_split[1],
                  buffer
                );
              }
            );
          } else {
            // 변경 전 파일이 없을 경우 현재 파일 저장
            fs.writeFileSync(
              __dirname + "/views" + data_split[3] + data_split[1],
              buffer
            );
          }
        }

        // if(data_split[2] != ""){
        // 	// 해당 경로에 변경 전 파일명이 있는지 확인
        // 	if(fs.existsSync(__dirname + '/views' + data_split[3] + data_split[2])){
        // 		// 있을 경우 삭제
        // 		fs.unlink(__dirname + '/views' + data_split[3] + data_split[2],(err)=>{
        // 			fs.writeFileSync(__dirname + '/views' + data_split[3] + data_split[1], buffer);
        // 		});

        // 	}
        // }
        // else{
        // 	fs.writeFileSync(__dirname + '/views' + data_split[3] + data_split[1], buffer);
        // }

        // fs.writeFileSync(__dirname + '/views' + data_split[3] + data_split[1], buffer);

        // // 해당 경로에 저장할 파일명이 있는지 확인
        // if(fs.existsSync(__dirname + '/views' + data_split[3] + data_split[1])){
        // 	// 있을 경우
        // 	done(false);
        // }
        // else{
        // 	// 없을 경우
        // 	fs.writeFileSync(__dirname + '/views' + data_split[3] + data_split[1], buffer);
        // }

        // // 변경 전 이미지 확인
        // if(data_split[2]){
        // 	// 해당 경로에 변경 전 파일명이 있는지 확인
        // 	if(fs.existsSync(__dirname + '/views' + data_split[3] + data_split[2])){
        // 		// 있을 경우 삭제
        // 		fs.unlink(__dirname + '/views' + data_split[3] + data_split[2],(err)=>{

        // 		});

        // 	}
        // }
      }
    }
  }
  done(true);
};

// require('dotenv').config({path: __dirname + '/.env'})

// const mariadb = require('mariadb');

// var db_host_apply = process.env.db_host;
// if (isTest == true) {
//     db_host_apply = process.env.db_host_debug;
// } else {

// }

// const config = {
//     host: db_host_apply,
//     port: process.env.db_port,
//     user: process.env.db_user,
//     password: process.env.db_password,
//     database: process.env.db_database,
//     connectionLimit: process.env.db_connection_limit
// };

// let pool = mariadb.createPool(config);

// module.exports = pool;
