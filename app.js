const express = require("express");
const db = require("./models/index"); 

const doctorRoutes = require("./routes/DoctorRoutes");
const petOwnerRoutes = require("./routes/PetOwnerRoutes");
const userRoutes = require("./routes/UserRoutes");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/doctors", doctorRoutes); // Example route path for doctors
app.use("/petOwners", petOwnerRoutes); // Example route path for pet owners
app.use("/users", userRoutes); // Example route path for common user routes


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
