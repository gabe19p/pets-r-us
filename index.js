// ============================================
//  Title: Pets-R-Us Assignment
//  Author: Danial Purselley
//  Date: 19 June 2022
//  Modified By: Danial Purselley
//  Description: The program will simulate
//  a pets-r-us page for web-340. This is the
//  index javascript file to run the node
//  and express server instance.
// ===========================================

const express = require("express");
const path = require("path");

const app = express();

//  set the view engine to html
app.engine(".html", require("ejs").__express);

//  assign the views path for my html
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "html");

//  tell express that the public directory holds the site assets
app.use(express.static(__dirname + "/public")); // allows me to connect to my css + image files

//  index route for landing
app.get("/", (req, res) => {
  res.render("index");
});

//  grooming route via anchor link or direct paste
app.get("/grooming", (req, res) => {
  res.render("grooming"); //respond with grooming
});

//  boarding route via nav bar
app.get('/boarding', (req, res) => {
  res.render("boarding") //respond with boarding
})

//  training route via nav bar
app.get('/training', (req, res) => {
  res.render("training") //respond with boarding
})

//  incomplete route for the pages yet to be finished
app.get("/incomplete", (req, res) => {
  res.send("Page Incomplete");
});

//  send user back to homepage after submitting a contact request
app.get("/submit", (req, res) => {
  res.sendFile(path.join(__dirname + "/views/index.html")); //respond with index.html
});

//  set the server to listen on port 3000
app.listen(3000);
