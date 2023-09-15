const { Sequelize } = require("sequelize");
const Op = Sequelize.Op;
const Validator = require("fastest-validator");
const bcryptjs = require("bcryptjs");
const JWT = require("jsonwebtoken");

const { User, UserFollower, Like, Comment, Appointment } = require("../models");

async function login(req, res) {
  const v = new Validator();
  const schema = {
    email: { type: "email", optional: false, max: 100 },
    password: { type: "string", optional: false, min: 6 },
  };

  const validation_response = v.validate(req.body, schema);

  if (validation_response !== true) {
    return res.status(400).json({
      message: "Validation Failed!",
      errors: validation_response,
    });
  }

  const { email, password } = req.body;

  try {
    // checking if the email is associated with an account
    const user = await User.findOne({ where: { email: email } });

    if (user == null) {
      return res.status(401).json({
        message: "Invalid Credentials!",
      });
    } else {
      // comparing the inputted password with the password stored in the Database
      bcryptjs.compare(password, user.password, (err, result) => {
        if (result) {
          const userType = user.userTypeId;

          // signing the JWT Token
          const token = JWT.sign(
            {
              user_id: user.id,
              user_type: user.userTypeId,
            },
            process.env.JWT_KEY,
            (err, token) => {
              return res.json({
                message: "Authentication Successful!",
                token: token,
                user_type: userType,
                user: {
                  user_id: user.id,
                  firstName: user.firstName,
                  lastName: user.lastName,
                  user_profile_picture: user.photoUrl,
                  user_bio: user.profile,
                },
              });
            }
          );
        } else {
          return res.status(401).json({
            message: "Invalid Credentials!",
          });
        }
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong!",
      error: error,
    });
  }
}

async function followUser(req, res) {
  const user_id = req.userData.user_id;

  const { followed_user_id } = req.body;

  try {
    const response = await UserFollower.create({
      followerId: user_id,
      followingId: followed_user_id,
    });

    res.send({
      response: response,
      message: "User Followed Successfully!",
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong!",
      error: error,
    });
  }
}

async function unfollowUser(req, res) {
  const user_id = req.userData.user_id;

  const { unfollowed_user_id } = req.body;

  try {
    const response = await UserFollower.destroy({
      where: {
        followerId: user_id,
        followingId: unfollowed_user_id,
      },
    });

    res.send({
      response: response,
      message: "User unfollowed Successfully!",
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong!",
      error: error,
    });
  }
}

async function getDoctorProfile(req, res) {
  const { user_id: doc_id } = req.params;
  // const user_id = req.userData.user_id;

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
      where: { id: doc_id },
      include: { all: true },
    });

    const followerCount = await UserFollower.count({
      where: { followingId: doc_id },
    });
    response.dataValues.followerCount = followerCount;

    const appointmentCount = await Appointment.count({
      where: { doctorId: doc_id },
    });
    response.dataValues.appointmentCount = appointmentCount;

    res.send(response);
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong!",
      error: error,
    });
  }
}

async function getPetOwnerProfile(req, res) {
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
      // at the moment its only one argument we are searching for :"" , other: []
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

async function likePost(req, res) {
  const user_id = req.userData.user_id;
  const { post_id } = req.body;
  try {
    const response = await Like.create({
      userId: user_id,
      postId: post_id,
    });

    res.send({
      response: response,
      message: "User liked Successfully!",
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong!",
      error: error,
    });
  }
}

async function unlikePost(req, res) {
  const user_id = req.userData.user_id;
  const { post_id } = req.body;
  try {
    const response = await Like.destroy({
      where: {
        userId: user_id,
        postId: post_id,
      },
    });

    res.send({
      response: response,
      message: "User unliked Successfully!",
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong!",
      error: error,
    });
  }
}

async function createComment(req, res) {
  const user_id = req.userData.user_id;
  const v = new Validator();
  const schema = {
    body: { type: "string", optional: false, min: 2 },
  };

  const validation_response = v.validate(req.body, schema);

  if (validation_response !== true) {
    return res.status(400).json({
      message: "Validation Failed!",
      errors: validation_response,
    });
  }
  const { body, postId } = req.body;

  try {
    const comment = await Comment.create({
      body,
      postId,
      userId: user_id,
    });

    return res.status(201).json({
      message: "Comment creation successful!",
      comment: comment,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong!",
      error: error.message,
    });
  }
}

async function deleteComment(req, res) {
  const user_id = req.userData.user_id;
  const { id } = req.params;
  try {
    const response = await Comment.destroy({
      where: {
        id: id,
        userId: user_id,
      },
    });

    res.status(204).json();
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong!",
      error: error,
    });
  }
}

async function editComment(req, res) {
  const user_id = req.userData.user_id;
  const v = new Validator();
  const schema = {
    body: { type: "string", optional: false, min: 2 },
  };

  const validation_response = v.validate(req.body, schema);

  if (validation_response !== true) {
    return res.status(400).json({
      message: "Validation Failed!",
      errors: validation_response,
    });
  }
  const { body } = req.body;
  const { id } = req.params;

  try {
    const updated_comments = await Comment.update({ body }, { where: { id } });
    if (updated_comments[0] === 0) {
      return res.status(404).json({
        message: "Comment not found!",
      });
    }

    return res.status(204).json({
      message: "Comment update successful!",
      // comment: comment,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong!",
      error: error.message,
    });
  }
}

async function searchUsers(req, res) {
  const user_id = req.userData.user_id;
  const { keyword } = req.params;
  const { specialtyId } = req.body;

  try {
    let response = await User.findAll({
      attributes: ["id", "firstName", "lastName", "photoUrl"],
      where: {
        [Op.or]: [
          { firstName: { [Op.like]: "%" + keyword + "%" } },
          { lastName: { [Op.like]: "%" + keyword + "%" } },
        ],
        id: { [Op.not]: user_id },
      },
      include: ["follower", "specialties"],
    });

    response.forEach((user) => {
      user.dataValues.is_followed = false;
      for (const follower of user.dataValues.follower) {
        if (follower.followerId === user_id) {
          user.dataValues.is_followed = true;
          break;
        }
      }
    });

    if (specialtyId) {
      response = response.filter((user) => {
        for (const specialty of user.dataValues.specialties) {
          if (specialty.id === specialtyId) {
            return true;
          }
        }
        return false;
      });
    }

    res.send(response);
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong!",
      error: error,
    });
  }
}

async function getTopDoctors(req, res) {
  try {
    const doctors = await User.findAll({
      where: { userTypeId: 2 },
      attributes: ["id", "firstName", "lastName", "photoUrl"],
    });

    const doctorsWithCounts = await Promise.all(
      doctors.map(async (doctor) => {
        const appointmentCount = await Appointment.count({
          where: { doctorId: doctor.id },
        });
        doctor.dataValues.appointmentCount = appointmentCount;
        return doctor;
      })
    );

    const sortedDoctors = doctorsWithCounts.sort(
      (a, b) => b.dataValues.appointmentCount - a.dataValues.appointmentCount
    );

    const topDoctors = sortedDoctors.slice(0, 10);

    res.send(topDoctors);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      message: "Something went wrong!",
      error: error.message,
    });
  }
}

// async function getTopDoctors(req, res) {
//   try {
//     // Find the top 4 doctors with the highest number of appointments
//     const topDoctors = await User.findAll({
//       attributes: ["id", "firstName", "lastName", "photoUrl"],
//       include: [
//         {
//           model: Appointment,
//           as: "doctorAppointments",
//           attributes: [], // You can specify the attributes you want to include here if needed
//         },
//       ],
//       group: ["User.id"],
//       order: [[Sequelize.literal("COUNT(doctorAppointments.id)"), "DESC"]],
//       limit: 4,
//     });

//     // Add the appointment count to each doctor
//     for (const doctor of topDoctors) {
//       doctor.dataValues.appointmentCount = doctor.doctorAppointments.length;
//     }

//     res.send(topDoctors);
//   } catch (error) {
//     res.status(500).json({
//       message: "Something went wrong!",
//       error: error,
//     });
//   }
// }

module.exports = {
  login,
  followUser,
  unfollowUser,
  getDoctorProfile,
  getPetOwnerProfile,
  likePost,
  unlikePost,
  createComment,
  deleteComment,
  editComment,
  searchUsers,
  getTopDoctors,
};
