const express = require("express");
const db = require("./models/index");
require("dotenv").config();

const doctorRoutes = require("./routes/DoctorRoutes");
const petOwnerRoutes = require("./routes/PetOwnerRoutes");
const userRoutes = require("./routes/UserRoutes");
const chatRoutes = require("./routes/ChatRoute");

const app = express();

const cors = require("cors");
app.use(cors());
app.options("*", cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/images", express.static("images/profile_pictures"));
app.use("/pet_pictures", express.static("images/pet_pictures"));

app.use("/doctors", doctorRoutes);
app.use("/petOwners", petOwnerRoutes);
app.use("/users", userRoutes);
app.use("/chat", chatRoutes);

app.listen(8000, () => {
  console.log("Listening on Port 8000:");
});
