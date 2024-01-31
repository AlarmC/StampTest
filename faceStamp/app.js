var testenv = require("dotenv").config({
  path: __dirname + "/.env",
});

// global.isTest = false;
global.isTest = true;
// global.atob = require("atob"); //base64로 인코드, 디코드
global.utill = require("./utill.js");
global.define = require("./define.js");
global.db = require("./db.js");
global.server = null;

global.moe_partition_kit = [];

global.logger = require("./winston.js");

// var https = require("https");
var fs = require("fs");
// var blob = require('blob');

//express
const express = require("express");
const app = express();
const path = require("path");

//cookie (요청된 쿠키를 쉽게 추출할 수 있도록 도와주는 미들웨어 ex 쿠키 조회: req.cookies[cookie_name])
const cookieParser = require("cookie-parser");
app.use(cookieParser(process.env.cookieparser));

const bodyParser = require("body-parser");
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
// const port = 5000;

// app.listen(port, () => {
//   console.log(`Listening on port ${port}`);
// });

app.use(
  bodyParser.json({
    limit: "5000mb",
  })
);
app.use(
  bodyParser.urlencoded({
    limit: "5000mb",
    extended: false,
    parameterLimit: 5000000,
  })
);

app.use(
  express.json({
    limit: "5000mb",
  })
);
app.use(
  express.urlencoded({
    limit: "5000mb",
    extended: false,
    parameterLimit: 5000000,
  })
);

// //SSL을 사용하는 경우
var sslOptions = {};

logger.info("서버 오픈 전");
if (isTest) {
  const http = require('http');
  const hostname = "127.0.0.1";
  const http_port = 5000;

  const server = http.createServer(app);

  

  server.listen(http_port, hostname, () => {
    console.log(`서버 시작됨: http://${hostname}:${http_port}`);
  });


} else {

  const http = require('http');
  
  const server = http.createServer(app).listen(
    process.env.REACT_APP_PORT_HTTP,
    process.env.REACT_APP_HOSTNAME,
    () => {
      console.log(
        "start server: " +
          process.env.REACT_APP_HOSTNAME +
          " " +
          process.env.REACT_APP_PORT_HTTP
      );
    }
  );

  // app.listen(
  //   process.env.REACT_APP_PORT_HTTP,
  //   process.env.REACT_APP_HOSTNAME,
  //   () => {
  //     console.log(
  //       "start server: " +
  //         process.env.REACT_APP_HOSTNAME +
  //         " " +
  //         process.env.REACT_APP_PORT_HTTP
  //     );
  //   }
  // );
}

// view engine setup
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");
app.engine("html", require("ejs").renderFile);
// app.use(express.static(__dirname + "/views"));
app.use("/", express.static(__dirname + "/public"));

// app.use(express.static(path.join(__dirname, "public")));

app.use(express.static(path.join(__dirname, "/views/client/build")));
// app.use("/"express.static(path.join(__dirname, "/views/client/build")));
app.get("/", function (req, res) {
  logger.info("index.html 불러오기");
  // res.render("client/build/index.html");

  req.sendFile(path.join(__dirname, "/views/client/build/index.html"));
});

// if (isTest) {
//     app.get('/', function (req, res) {
//         var createObject = {
//             propertyA: 1,
//             propertyB: "string"
//         };
//         res.render('index.html', createObject);
//         //res.render()
//     });
// } else {
//     app.get('/', function (req, res) {
//         var createObject = {
//             propertyA: 1,
//             propertyB: "string"
//         };
//         res.render('index.html', createObject);
//     });

// }
// app.use(passport.initialize()); //passport를 사용하겠다.
// app.use(passport.session()); //우리의 passport는 내부적으로 세션에 쓰겠다.

// app.use(express.static(__dirname + '/views'));
// const socket_server = require('./socket_server.js');
const router_passport_config = require("./routes/user/passport_config.js");
// const router_jwt_config = require('./routes/user/jwt_config.js');

const router_user = require("./routes/user/user");
const router_stamp = require("./routes/stamp/stamp");
const { addAbortSignal } = require("stream");

app.use("/api", router_user);
app.use("/api", router_stamp);
app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "/views/client/build/index.html"));
});
