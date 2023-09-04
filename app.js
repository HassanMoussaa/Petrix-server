const express = require("express");
const db = require("./models/index"); 

// const userRoute = require("./routes/User");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use("/user", userRoute);

// Test the database connection before starting the server
db.sequelize
  .authenticate()
  .then(() => {
    console.log("Connected to the database.");
    
    // Start the server only if the database connection is successful
    app.listen(8000, () => {
      console.log("Listening on Port 8000:");
    });
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });
