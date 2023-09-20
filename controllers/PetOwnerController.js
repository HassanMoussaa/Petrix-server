// const User = require("../models/user");
// const User = require("../models/user.js");
const { User, Pet, Appointment, Availability, Review } = require("../models");
const moment = require("moment");

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
  };
  console.log("Request Body:", req.body);
  const validation_response = v.validate(req.body, schema);

  const profile_picture =
    "http://127.0.0.1:8000/images/profile_pictures/default_profile_picture.jpg";

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
      photoUrl: profile_picture,
      userTypeId,
    });

    return res.status(201).json({
      message: "User created successfully!",
      user: newUser,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong!",
      error: error.message,
    });
  }
}

async function getmyProfile(req, res) {
  const user_id = req.userData.user_id;

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
      where: { id: user_id },
      include: "pets",
    });

    res.send(response);
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong!",
      error: error,
    });
  }
}

function getEndTime(start_time) {
  const startTimeParts = start_time.split(":");
  const date = new Date();
  date.setHours(
    parseInt(startTimeParts[0], 10),
    parseInt(startTimeParts[1], 10),
    parseInt(startTimeParts[2], 10)
  );
  date.setHours(date.getHours() + 1);

  // Format the end_time as "hh:mm:ss"
  const end_time = `${String(date.getHours()).padStart(2, "0")}:${String(
    date.getMinutes()
  ).padStart(2, "0")}:${String(date.getSeconds()).padStart(2, "0")}`;

  return end_time;
}

async function bookAppointment(req, res) {
  const user_id = req.userData.user_id;
  const { doctorId, petId, date, start_time } = req.body;

  try {
    const isAlreadyBooked = await Appointment.findAll({
      where: {
        date,
        doctorId,
        start_time,
        status: "accepted",
      },
    });
    console.log(req.body);

    if (isAlreadyBooked.length > 0) {
      return res.status(400).json({
        message: "Appointment already booked!",
      });
    }

    const newAppointment = await Appointment.create({
      date,
      petId,
      doctorId,
      petOwnerId: user_id,
      start_time,
      end_time: getEndTime(start_time),
    });
    return res.status(201).json({
      message: "Appointment created successfully!",
      Appointment: newAppointment,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong!",
      error: error.message,
    });
  }
}

function generateAvailableSlots(start_time, end_time) {
  const timeFormat = "HH:mm:ss";

  const startTime = moment(start_time, timeFormat);
  const endTime = moment(end_time, timeFormat);

  const availableSlots = [];

  const durationMinutes = 60; // 1 hour

  let currentTime = startTime.clone();
  while (currentTime.isBefore(endTime)) {
    const slot = {
      start: currentTime.format(timeFormat),
      end: currentTime.add(durationMinutes, "minutes").format(timeFormat),
    };
    availableSlots.push(slot);
  }
  return availableSlots;
}

async function filterAvailableSlots(availableSlots, date_obj, docId) {
  const filteredSlots = await Promise.all(
    availableSlots.map(async (slot) => {
      const appointment = await Appointment.findOne({
        where: {
          date: date_obj,
          doctorId: docId,
          status: "accepted",
          start_time: slot.start,
        },
      });

      if (!appointment) {
        return slot;
      }
    })
  );

  return filteredSlots.filter(Boolean);
}

async function getAvailableSlots(req, res) {
  const { docId, date } = req.query;

  const date_obj = new Date(date);

  try {
    const availibility = await Availability.findOne({
      attributes: ["start_time", "end_time"],
      where: { userId: docId, day: date_obj.getDay() },
    });

    const availableSlots = generateAvailableSlots(
      availibility.start_time,
      availibility.end_time
    );

    const filteredAvailableSlots = await filterAvailableSlots(
      availableSlots,
      date_obj,
      docId
    );

    res.status(200).json({ availableSlots: filteredAvailableSlots });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong!",
      error: error.message,
    });
  }
}

async function addReview(req, res) {
  const user_id = req.userData.user_id;
  const v = new Validator();
  const schema = {
    body: { type: "string", optional: false, min: 2 },
    rate: { type: "number", optional: false, max: 5 },
  };

  const validation_response = v.validate(req.body, schema);

  if (validation_response !== true) {
    return res.status(400).json({
      message: "Validation Failed!",
      errors: validation_response,
    });
  }

  const { body, rate } = req.body;
  const { doctor_id } = req.params;

  try {
    const createdReview = await Review.create({
      body,
      rate,
      doctor_id,
      petOwner_id: user_id,
    });

    const response = await Review.findOne({
      attributes: ["body", "rate", "createdAt", "id", "petOwner_id"],
      where: { id: createdReview.id },
      include: {
        model: User,
        as: "petOwner",
        attributes: ["firstName", "lastName", "photoUrl"],
      },
    });

    return res.status(201).json({
      message: "Review creation successful!",
      comment: response,
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
  getmyProfile,
  bookAppointment,
  getAvailableSlots,
  addReview,
};
