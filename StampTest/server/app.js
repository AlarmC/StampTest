var testenv = require("dotenv").config({
  path: __dirname + "/.env",
});

global.isTest = true;
global.utill = require("./utill.js");


const express = require('express');
const app = express();
const path = require("path");

if(isTest){
  const http = require('http');
  const socketio = require('socket.io');
  const host = "localhost";
  const port = 5000;
  
  const server = http.createServer(app);

  const io = socketio(server, {
    cors: {
      origin: "*",
      credentials: true
    }
  });
  
  io.on('connection', (socket) => {
    console.log('연결됐습니다.');
  
    socket.on('message', ({name, message}) => {
      io.emit('message', ({name, message}))
    });
  
    socket.on('disconnect', () => {
      console.log("연결 끊김");
    } );
  });
  
  server.listen(port, host, () => {
    console.log(`서버 시작 http://${host}:${port}`);
  })
  
  app.get('/api/message', (req, res) => {
    res.json({ message: "Hello from the server!" });
  });
} else {
  const http = require('http');
  const socketio = require('socket.io');
  const host = process.env.HTTP_HOST_IP;
  const port = process.env.HTTP_HOST_PORT;
  
  const server = http.createServer(app);

  const io = socketio(server, {
    cors: {
      origin: "*",
      credentials: true
    }
  });
  
  io.on('connection', (socket) => {
    console.log('연결됐습니다.');
  
    socket.on('message', ({name, message}) => {
      io.emit('message', ({name, message}))
    });
  
    socket.on('disconnect', () => {
      console.log("연결 끊김");
    } );
  });
  
  server.listen(port, host, () => {
    console.log(`서버 시작 http://${host}:${port}`);
  })
  
  app.get('/api/message', (req, res) => {
    res.json({ message: "Hello from the server!" });
  });
}


// view engine setup
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");
app.engine("html", require("ejs").renderFile);
// app.use(express.static(__dirname + "/views"));
app.use("/", express.static(__dirname + "/public"));

// app.use(express.static(path.join(__dirname, "public")));

app.use(express.static(path.join(__dirname, "../client/build")));
// app.use("/"express.static(path.join(__dirname, "/views/client/build")));
app.get("/", function (req, res) {
  logger.info("index.html 불러오기");
  // res.render("client/build/index.html");

  req.sendFile(path.join(__dirname, "../client/build/index.html"));
});

app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
});