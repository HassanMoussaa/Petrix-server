const express = require("express");
const db = require("./models/index"); 

// const userRoute = require("./routes/User");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use("/user", userRoute);


db.sequelize
  .authenticate()
  .then(() => {
    console.log("Connected to the database.");
    
    
    app.listen(8000, () => {
      console.log("Listening on Port 8000:");
    });
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });
