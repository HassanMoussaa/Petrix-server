// const User = require("../models/user");
const User = require("../models/User.js");

const bcryptjs = require('bcryptjs');
const  Validator  = require("fastest-validator");

async function register(req, res) {
  const v = new Validator();
  const schema = {
    firstName: { type: 'string', optional: false, min: 2, max: 50 },
    lastName: { type: 'string', optional: false, min: 2, max: 50 },
    email: { type: 'email', optional: false, max: 100 },
    password: { type: 'string', optional: false, min: 6 },
    city: { type: 'string', optional: true },
    country: { type: 'string', optional: true },
    profile: { type: 'string', optional: true },
    phone: { type: 'string', optional: true },
    photoUrl: { type: 'string', optional: true },
  };
  console.log('Request Body:', req.body);
  const validation_response = v.validate(req.body, schema);

  if (validation_response !== true) {
    return res.status(400).json({
      message: 'Validation Failed!',
      errors: validation_response,
    });
  }

  const { firstName, lastName, email, password, city, country, profile, phone, photoUrl } = req.body;

  try {
    const isEmailUsed = await User.findOne({ where: { email: email } });
    if (isEmailUsed) {
      return res.status(409).json({
        conflict: 'Email',
        message: 'Email already used!',
      });
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

   
    const userTypeId = 1; 

    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      city,
      country,
      profile,
      phone,
      photoUrl,
      userTypeId,
    });

    return res.status(201).json({
      message: 'User created successfully!',
      user: newUser,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Something went wrong!',
      error: error.message,
    });
  }
}

module.exports = {
  register,
};
