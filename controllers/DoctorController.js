const {
  User,
  Specialties,
  Post,
  Availability,
  UserFollower,
  Appointment,
  UserType,
  Review,
  DoctorLocations,
} = require("../models");
const bcryptjs = require("bcryptjs");
const Validator = require("fastest-validator");
const appointment = require("../models/appointment");

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

  const profile_picture =
    "http://127.0.0.1:8000/images/profile_pictures/default_profile_picture.jpg";

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
      photoUrl: profile_picture,
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

async function getMyProfile(req, res) {
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
        "email",
      ],
      where: { id: user_id },
      // include: { all: true },
      include: [
        {
          model: Specialties,
          as: "specialties",
          attributes: ["id", "speciality"],
        },
        {
          model: UserType,
          as: "userType",
          attributes: ["id", "type"],
        },
        {
          model: Post,
          as: "posts",
          attributes: ["id", "title", "body", "createdAt"],
        },
        {
          model: Review,
          as: "doctorReviews",
          attributes: ["id", "body", "rate", "createdAt"],
          include: {
            model: User,
            as: "petOwner",
            attributes: ["id", "firstName", "lastName", "photoUrl"],
          },
        },
        {
          model: DoctorLocations,
          as: "clinicLocations",
          attributes: ["latitude", "longitude"],
        },
      ],
    });

    const followerCount = await UserFollower.count({
      where: { followingId: user_id },
    });
    response.dataValues.followerCount = followerCount;

    const appointmentCount = await Appointment.count({
      where: { doctorId: user_id },
    });
    response.dataValues.appointmentCount = appointmentCount;

    const averageRate =
      response.doctorReviews.reduce((sum, review) => sum + review.rate, 0) /
      response.doctorReviews.length;
    response.dataValues.averageRate = averageRate;

    res.send(response);
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong!",
      error: error.message,
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

    res.send(response);
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong!",
      error: error,
    });
  }
}

async function getDoctorPost(req, res) {
  const { postId } = req.params;
  try {
    const post = await Post.findOne({
      where: { id: postId },
    });

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    res.json(post);
  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(500).json({
      message: "Something went wrong!",
      error: error.message,
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
async function editDoctorPost(req, res) {
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
  const { id } = req.params;
  try {
    const updated_posts = await Post.update(
      { body, title },
      { where: { id, docId: doc_id } }
    );
    if (updated_posts[0] === 0) {
      return res.status(404).json({
        message: "post not found!",
      });
    }

    return res.status(201).json({
      message: "Post updated successful!",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong!",
      error: error.message,
    });
  }
}

async function getPendingAppointments(req, res) {
  const user_id = req.userData.user_id;
  try {
    const response = await Appointment.findAll({
      attributes: ["date", "id", "petOwnerId", "start_time"],
      where: { doctorId: user_id, status: "pending" },
      include: {
        model: User,
        as: "petOwner",
        attributes: ["firstName", "lastName"],
      },
    });

    res.send(response);
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong!",
      error: error,
    });
  }
}

async function getrejectedAppointments(req, res) {
  const user_id = req.userData.user_id;
  try {
    const response = await Appointment.findAll({
      attributes: ["date", "id", "petOwnerId", "start_time"],
      where: { doctorId: user_id, status: "rejected" },
      include: {
        model: User,
        as: "petOwner",
        attributes: ["firstName", "lastName"],
      },
    });

    res.send(response);
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong!",
      error: error,
    });
  }
}

async function acceptAppointment(req, res) {
  // const user_id = req.userData.user_id;
  const { appointmentId } = req.body;

  try {
    // const response = await Appointment.update(
    //   { status: "accepted" },
    //   { where: { id: appointmentId } }
    // );
    const acceptedAppointment = await Appointment.findOne({
      where: { id: appointmentId },
    });
    if (!acceptedAppointment) {
      return res.status(404).json({
        message: "Appointment not found!",
      });
    }

    acceptedAppointment.status = "accepted";
    acceptedAppointment.save();

    await Appointment.update(
      { status: "rejected" },
      {
        where: {
          date: acceptedAppointment.date,
          doctorId: acceptedAppointment.doctorId,
          start_time: acceptedAppointment.start_time,
          status: "pending",
        },
      }
    );

    return res.status(201).json({
      message: "Appointment accepted successfully!",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong!",
      error: error.message,
    });
  }
}
async function rejectAppointment(req, res) {
  // const user_id = req.userData.user_id;
  const { appointmentId } = req.body;

  try {
    const response = await Appointment.update(
      { status: "rejected" },
      { where: { id: appointmentId } }
    );
    if (response[0] === 0) {
      return res.status(404).json({
        message: "Appointment not found!",
      });
    }

    return res.status(201).json({
      message: "Appointment rejected successfully!",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong!",
      error: error.message,
    });
  }
}

async function getAcceptedAppointments(req, res) {
  const user_id = req.userData.user_id;
  try {
    const response = await Appointment.findAll({
      attributes: ["date", "id", "petOwnerId", "start_time"],
      where: { doctorId: user_id, status: "accepted" },
      include: {
        model: User,
        as: "petOwner",
        attributes: ["firstName", "lastName"],
      },
    });
    //get info of petOwner
    res.send(response);
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong!",
      error: error,
    });
  }
}

async function setAvailability(req, res) {
  const doc_id = req.userData.user_id;
  const { days, start_time, end_time } = req.body;

  try {
    const availabilityPromises = days.map(async (day) => {
      // You can create a new Availability row for each day here
      const availability = await Availability.create({
        UserId: doc_id,
        day: day, // Assuming each day is an integer representing the day of the week
        start_time: start_time,
        end_time: end_time,
      });

      return availability;
    });

    // Wait for all the availability rows to be created
    const availabilities = await Promise.all(availabilityPromises);

    return res.status(200).json({
      message: "Availability has been set for multiple days",
      availabilities: availabilities,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong!",
      error: error.message,
    });
  }
}

async function saveDoctorLocation(req, res) {
  const doc_id = req.userData.user_id;

  const { lat, lng } = req.body;

  try {
    await DoctorLocations.create({
      latitude: lat,
      longitude: lng,
      docId: doc_id,
    });

    return res.status(201).json({
      message: "clinic location saved successful!",
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
  getMyProfile,
  getDoctorPosts,
  createDoctorPost,
  editDoctorPost,
  getPendingAppointments,
  acceptAppointment,
  rejectAppointment,
  getAcceptedAppointments,
  setAvailability,
  getDoctorPost,
  saveDoctorLocation,
};
