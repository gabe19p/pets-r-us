const express = require("express");
const path = require("path");
const app = express();

app.get("/", (req, res) => {
  //get method
  res.sendFile(path.join(__dirname, "./views/index.html")); //respond with index
});

app.get("/grooming", (req, res) => {
  //get method
  res.sendFile(path.join(__dirname, "./views/grooming.html")); //respond with grooming
});

app.listen(3000);
