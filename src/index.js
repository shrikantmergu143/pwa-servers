const wsServer = require("./wsServer");
var express = require("express");
var ejs = require("ejs");
var app = express();
wsServer.start();

app.engine("html", ejs.__express);
app.set("engin", "html");

app.set("views", "./src/views");
app.get("/panel", function (req, res) {
  res.render("panel.html", { title: "hello" });
});
app.listen(3000, function () {
  console.log("post:", 3000);
});
