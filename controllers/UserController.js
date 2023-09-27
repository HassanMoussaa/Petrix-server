const { Sequelize } = require("sequelize");
const Op = Sequelize.Op;
const Validator = require("fastest-validator");
const bcryptjs = require("bcryptjs");
const JWT = require("jsonwebtoken");

const {
  User,
  UserFollower,
  Like,
  Comment,
  Appointment,
  Post,
  Specialties,
  Review,
  UserType,
  DoctorLocations,
  FirebaseToken,
  Pet,
} = require("../models");

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
  const { id } = req.params;
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
      where: { id: id },
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
          include: {
            model: Like,
            as: "postLikes",
            attributes: ["userId", "postId"],
          },
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
      where: { followingId: id },
    });
    response.dataValues.followerCount = followerCount;

    const appointmentCount = await Appointment.count({
      where: { doctorId: id },
    });
    response.dataValues.appointmentCount = appointmentCount;

    const averageRate =
      response.doctorReviews.reduce((sum, review) => sum + review.rate, 0) /
      response.doctorReviews.length;
    response.dataValues.averageRate = averageRate;

    const check_if_followed = await UserFollower.findOne({
      where: { followerId: user_id, followingId: id },
    });

    let is_followed = false;
    if (check_if_followed) {
      is_followed = true;
    }
    response.dataValues.check_if_followed = is_followed;

    response.dataValues.posts.forEach((post) => {
      post.dataValues.is_liked = false;
      for (const postLike of post.dataValues.postLikes) {
        if (postLike.userId == user_id) {
          post.dataValues.is_liked = true;
          break;
        }
      }
    });

    res.send(response);
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong!",
      error: error.message,
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
    const createdComment = await Comment.create({
      body,
      postId,
      userId: user_id,
    });

    const response = await Comment.findOne({
      attributes: ["body", "userId", "createdAt", "id"],
      where: { id: createdComment.id },
      include: {
        model: User,
        as: "user",
        attributes: ["firstName", "lastName", "photoUrl"],
      },
    });

    return res.status(201).json({
      message: "Comment creation successful!",
      comment: response,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong!",
      error: error.message,
    });
  }
}

async function getPostComments(req, res) {
  const { postId } = req.params;

  try {
    const response = await Comment.findAll({
      attributes: ["body", "userId", "createdAt", "id"],
      where: { postId: postId },
      include: {
        model: User,
        as: "user",
        attributes: ["firstName", "lastName", "photoUrl"],
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
  const { breed, userTypeId } = req.query;

  try {
    let response = await User.findAll({
      attributes: [
        "id",
        "firstName",
        "lastName",
        "photoUrl",
        "country",
        "city",
      ],
      where: {
        [Op.or]: [
          { firstName: { [Op.like]: "%" + keyword + "%" } },
          { lastName: { [Op.like]: "%" + keyword + "%" } },
        ],
        id: { [Op.not]: user_id },
        userTypeId: userTypeId,
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

    if (breed) {
      response = response.filter((user) => {
        for (const speciality of user.dataValues.specialties) {
          if (speciality.speciality.toUpperCase() === breed.toUpperCase()) {
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
      error: error.message,
    });
  }
}

async function getTopDoctors(req, res) {
  try {
    const doctors = await User.findAll({
      where: { userTypeId: 2 },
      attributes: ["id", "firstName", "lastName", "photoUrl"],
      include: [
        {
          model: Review,
          as: "doctorReviews",
          attributes: ["rate"],
        },
      ],
    });

    const doctorsWithCounts = await Promise.all(
      doctors.map(async (doctor) => {
        const appointmentCount = await Appointment.count({
          where: { doctorId: doctor.id },
        });
        doctor.dataValues.appointmentCount = appointmentCount;

        const doctorReviews = doctor.doctorReviews || [];
        const averageRate =
          doctorReviews.reduce((sum, review) => sum + review.rate, 0) /
          (doctorReviews.length || 1);
        doctor.dataValues.averageRate = averageRate;
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

async function changeProfilePicture(req, res) {
  const id = req.userData.user_id;

  try {
    const user = await User.findOne({
      where: { id: id },
    });

    user.photoUrl = "http://127.0.0.1:8000/images/" + req.file.filename;

    const response = await user.save();

    res.send(response.photoUrl);
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong!",
      error: error,
    });
  }
}

async function saveNotificationToken(req, res) {
  const id = req.userData.user_id;

  const { notification_token } = req.body;

  try {
    const user = await FirebaseToken.create({
      user_id: id,
      token: notification_token,
    });

    const response = await user.save();

    res.send(response);
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong!",
      error: error,
    });
  }
}

async function getDoctorsNearYou(req, res) {
  const user_id = req.userData.user_id;
  let { lat, lng } = req.query;
  const latitude = parseFloat(lat);
  const longitude = parseFloat(lng);

  try {
    // const userLocationArray = userLocation.split(",").map(parseFloat);
    // const lat = userLocationArray[0];
    // const lng = userLocationArray[1];

    const earthCircumferenceKm = 40075;
    const maxDistanceKm = 40;

    const degreesPerKm = 360 / earthCircumferenceKm;
    const maxDistanceDegrees = maxDistanceKm * degreesPerKm;

    const doctors = await DoctorLocations.findAll({
      where: {
        latitude: {
          [Op.between]: [
            latitude - maxDistanceDegrees,
            latitude + maxDistanceDegrees,
          ],
        },
        longitude: {
          [Op.between]: [
            longitude - maxDistanceDegrees,
            longitude + maxDistanceDegrees,
          ],
        },
      },
      include: {
        model: User,
        as: "doctor",
        attributes: ["firstName", "lastName", "photoUrl"],
      },
    });

    res.json(doctors);
  } catch (error) {
    console.error("Error fetching doctors near location:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function savePet(req, res) {
  const id = req.userData.user_id;
  const { name, breed } = req.body;
  const photo_url = "http://127.0.0.1:8000/pet_pictures/" + req.file.filename;

  try {
    const response = await Pet.create({
      name,
      breed,
      photo_url,
      userId: id,
    });

    res.send({
      response: response,
      message: "Pet saved Successfully!",
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong!",
      error: error.message,
    });
  }
}

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
  getDoctorPost,
  getPostComments,
  changeProfilePicture,
  saveNotificationToken,
  getDoctorsNearYou,
  savePet,
};
