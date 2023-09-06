const express = require("express");
const db = require("./models/index");
require("dotenv").config();

const doctorRoutes = require("./routes/DoctorRoutes");
const petOwnerRoutes = require("./routes/PetOwnerRoutes");
const userRoutes = require("./routes/UserRoutes");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/doctors", doctorRoutes);
app.use("/petOwners", petOwnerRoutes);
app.use("/users", userRoutes);
app.listen(8000, () => {
  console.log("Listening on Port 8000:");
});

// db.sequelize
//   .authenticate()
//   .then(() => {
//     console.log("Connected to the database.");

//   })
//   .catch((err) => {
//     console.error("Unable to connect to the database:", err);
//   });
