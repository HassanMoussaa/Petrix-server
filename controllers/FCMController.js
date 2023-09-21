var admin = require("firebase-admin");
var serviceAccount = require("../fcm-auth.json");

const { FirebaseToken } = require("../models");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

async function sendNotification(req, res, next) {
  let { doctor_name, pet_owner_name, app_date, app_time } =
    req.notificationInfo;

  const user_id = req.userData.user_id;

  // setting the notification content
  let title = "New Appointment Request!";
  let body = `${pet_owner_name} requested an appointment on ${app_date} at ${app_time}!`;
  let query_tokens = await FirebaseToken.findAll({
    attributes: ["token"],
    where: { user_id: user_id },
  });

  const tokens = query_tokens?.map((tokenObj) => tokenObj.dataValues.token);

  console.log("TOKENS1:: ", t);

  let message = {
    tokens,
    notification: {
      title,
      body,
    },
  };

  await admin
    .messaging()
    .sendMulticast(message)
    .then((response) => {
      console.log("Notification sent:", response);
      res.json(response); // Send a response if needed
    })
    .catch((error) => {
      console.error("Error sending notification:", error);
      next(error); // Pass the error to the next middleware or handler
    });
}

module.exports = {
  sendNotification,
};
