const JWT = require("jsonwebtoken");

// check for a JWT token in the HTTP request & allowing only petOwner, based on user type in the Token Signature
function checkAuthPetOwner(req, res, next) {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded_token = JWT.verify(token, process.env.JWT_KEY);
    req.userData = decoded_token;

    if (req.userData.user_type == 1) {
      next();
    } else {
      throw "Unauthorized! PetOwner Only!";
    }
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or Expired Token!",
      error: error,
    });
  }
}

// check for a JWT token in the HTTP request & allowing only Doctors, based on user type in the Token Signature
function checkAuthDoctor(req, res, next) {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded_token = JWT.verify(token, process.env.JWT_KEY);
    req.userData = decoded_token;

    if (req.userData.user_type == 2) {
      next();
    } else {
      throw "Unauthorized! Doctors Only!";
    }
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or Expired Token!",
      error: error,
    });
  }
}

function checkAuth(req, res, next) {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded_token = JWT.verify(token, process.env.JWT_KEY);
    req.userData = decoded_token;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or Expired Token!",
      error: error,
    });
  }
}

module.exports = {
  checkAuthPetOwner,
  checkAuthDoctor,
  checkAuth,
};
