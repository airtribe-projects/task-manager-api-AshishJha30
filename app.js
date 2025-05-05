const express = require("express");
require("dotenv").config();
const taskRoutes = require("./src/routes/taskRoutes");
const homeRoute = require("./src/routes/homeRoute");
const errorHandler = require("./src/middleware/errorHandler");
const apiendpoint = process.env.ENDPOINT || "/api/v1";
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// Routes
app.use(`${apiendpoint}/`, homeRoute);
app.use(`${apiendpoint}/tasks`, taskRoutes);

app.use(errorHandler);

app.listen(PORT, (err) => {
  if (err) {
    console.log("Error in starting server", err);
  } else {
    console.log(`Server is running on port ${PORT}`);
  }
});


module.exports = app;
