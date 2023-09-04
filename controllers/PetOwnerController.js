const User = require("../models/user"); 

exports.register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      city,
      country,
      profile,
      phone,
      // photoUrl, 
    } = req.body;

   
    const userTypeId = 1;

    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password,
      city,
      country,
      profile,
      phone,
      //  photoUrl 
      userTypeId, 
    });

    // Return a response to the client
    res.status(201).json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred" });
  }
};
