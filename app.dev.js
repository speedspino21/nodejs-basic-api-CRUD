"use strict";

var express = require("express");

var bodyParser = require("body-parser");

var path = require("path");

var fs = require("fs");

var app = express();
app.use(bodyParser.json());
app.get("/api/all", function (req, res) {
  res.setHeader("Content-Type", "application/json");
  fs.readFile(path.join(__dirname, "feed.json"), "utf8", function (err, json) {
    res.send(json);
  });
});
app.post("/api/add", function (req, res) {
  res.setHeader("Content-Type", "application/json");
  var postData = req.body;
  fs.readFile(path.join(__dirname, "feed.json"), "utf8", function (err, json) {
    var posts = JSON.parse(json);
    posts.push(postData);
    fs.writeFile(path.join(__dirname, "feed.json"), JSON.stringify(posts), function (e) {
      if (e) throw e;
      console.log("Wrote File");
      res.send({
        msg: "Wrote File"
      });
    });
  });
});
app.post("/api/update", function (req, res) {
  res.setHeader("Content-Type", "application/json");
  var newPost = req.body;
  fs.readFile(path.join(__dirname, "feed.json"), "utf8", function (err, json) {
    var posts = JSON.parse(json);
    posts.forEach(function (post) {
      if (post.id == newPost.id) {
        post.id = newPost.id;
        post.title = newPost.title;
        post.body = newPost.body;
      } else {
        console.log("ID doesn't match");
      }
    });
    fs.writeFile(path.join(__dirname, "feed.json"), JSON.stringify(posts), function (e) {
      if (e) throw e;
      console.log("Updated Post");
      res.send({
        msg: "Updated Post"
      });
    });
  });
});
app.post("/api/remove", function (req, res) {
  res.setHeader("Content-Type", "application/json");
  var postId = req.body.id;
  fs.readFile(path.join(__dirname, "feed.json"), "utf8", function (err, json) {
    var posts = JSON.parse(json);
    posts.forEach(function (post, i) {
      if (post.id == postId) {
        posts.splice(i, 1);
      } else {
        console.log("ID doesn't match");
      }
    });
    fs.writeFile(path.join(__dirname, "feed.json"), JSON.stringify(posts), function (e) {
      if (e) throw e;
      console.log("Removed Post");
      res.send({
        msg: "Removed Post"
      });
    });
  });
}); // Run the server

app.listen(3000, function (e) {
  if (e) throw e;
  console.log("Server has started on port 3000...");
});