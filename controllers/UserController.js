const { Sequelize } = require("sequelize");
const Op = Sequelize.Op;
const Validator = require("fastest-validator");
const bcryptjs = require("bcryptjs");
const JWT = require("jsonwebtoken");

const { User, UserFollower, Like, Comment } = require("../models");

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
          const is_pet_owner = user.userTypeId == 1;

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
                isPetOwner: is_pet_owner,
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

module.exports = {
  login,
  followUser,
  unfollowUser,
  getDoctorProfile,
  getPetOwnerProfile,
  likePost,
  unlikePost,
  createComment,
};
