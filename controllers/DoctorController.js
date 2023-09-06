const { User, Specialties, Post } = require("../models");
const bcryptjs = require("bcryptjs");
const Validator = require("fastest-validator");

async function register(req, res) {
  const v = new Validator();
  const schema = {
    firstName: { type: "string", optional: false, min: 2, max: 50 },
    lastName: { type: "string", optional: false, min: 2, max: 50 },
    email: { type: "email", optional: false, max: 100 },
    password: { type: "string", optional: false, min: 6 },
    city: { type: "string", optional: true },
    country: { type: "string", optional: true },
    profile: { type: "string", optional: true },
    phone: { type: "string", optional: true },
    photoUrl: { type: "string", optional: true },
    specialties: {
      type: "array",
      items: {
        type: "number",
        positive: true,
        integer: true,
      },
      optional: true,
      min: 1,
      max: 4,
    },
    // clinicLocations: { type: 'array',items:"string", optional: true }, // Array of clinic locations
  };
  console.log("Request Body:", req.body);
  const validation_response = v.validate(req.body, schema);

  if (validation_response !== true) {
    return res.status(400).json({
      message: "Validation Failed!",
      errors: validation_response,
    });
  }

  const {
    firstName,
    lastName,
    email,
    password,
    city,
    country,
    profile,
    phone,
    photoUrl,
    specialties,
  } = req.body;

  try {
    const isEmailUsed = await User.findOne({ where: { email: email } });
    if (isEmailUsed) {
      return res.status(409).json({
        conflict: "Email",
        message: "Email already used!",
      });
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const userTypeId = 2;

    const doctor = await User.create({
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

    if (specialties) {
      await doctor.setSpecialties(specialties);
    }

    return res.status(201).json({
      message: "Doctor registration successful!",
      user: doctor,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong!",
      error: error.message,
    });
  }
}

async function getDoctorProfile(req, res) {
  const id = req.userData.user_id;

  try {
    const response = await User.findOne({
      attributes: [
        "id",
        "firstName",
        "lastName",
        "city",
        "country",
        "profile",
        "phone",
        "photoUrl",
      ],
      where: { id: id },
      include: { all: true },
    });

    res.send(response);
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong!",
      error: error,
    });
  }
}

async function getDoctorPosts(req, res) {
  const user_id = req.userData.user_id;
  try {
    const response = await Post.findAll({
      attributes: ["title", "body"],
      where: { docId: user_id },
    });
    console.log("hi", response);

    res.send(response);
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong!",
      error: error,
    });
  }
}

async function createDoctorPost(req, res) {
  const doc_id = req.userData.user_id;
  const v = new Validator();
  const schema = {
    title: { type: "string", optional: false, min: 2 },
    body: { type: "string", optional: false, min: 5 },
  };
  console.log("Request Body:", req.body);
  const validation_response = v.validate(req.body, schema);

  if (validation_response !== true) {
    return res.status(400).json({
      message: "Validation Failed!",
      errors: validation_response,
    });
  }
  const { title, body } = req.body;

  try {
    const post = await Post.create({
      title,
      body,
      docId: doc_id,
    });

    return res.status(201).json({
      message: "Post creation successful!",
      post: post,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong!",
      error: error.message,
    });
  }
}

module.exports = {
  register,
  getDoctorProfile,
  getDoctorPosts,
  createDoctorPost,
};
