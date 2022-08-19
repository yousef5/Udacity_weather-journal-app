// Setup empty JS object to act as endpoint for all routes
projectData = {};
const PORT = 8000;
// Require Express to run server and routes and cors and body parser
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
// Start up an instance of app
const app = express();
/* Middleware*/
//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// Cors for cross origin allowance
app.use(cors());
// Initialize the main project folder
app.use(express.static("website"));

//routes
//get data
app.get("/all", (req, res) => {
  res.status(200).send(projectData);
});

//post Data
app.post("/add", (req, res) => {
  projectData = req.body;
  res.status(201).send(projectData);
});

// Setup Server
app.listen(PORT, () => {
  console.log(`express server starting listen on port : ${PORT}`);
});
