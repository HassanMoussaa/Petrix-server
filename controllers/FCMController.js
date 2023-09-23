var admin = require("firebase-admin");
var serviceAccount = require("../fcm-auth.json");

const { FirebaseToken } = require("../models");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

async function sendNotification(req, res, next) {
  let {
    doctor_name,
    pet_owner_name,
    app_date,
    app_time,
    doc_id,
    petOwner_id,
    notification_type,
  } = req.notificationInfo;

  let title = "";
  let body = "";
  let query_tokens = [];

  if (notification_type == "new_booking_notification") {
    title = "New Appointment Request!";
    body = `${pet_owner_name} requested an appointment on ${app_date} at ${app_time}!`;
    console.log("hi");
    query_tokens = await FirebaseToken.findAll({
      attributes: ["token"],
      where: { user_id: doc_id },
    });
  } else if (notification_type == "accepted_appointment_notification") {
    title = "Appointment Accepted!";
    body = `You appointment with Dr. ${doctor_name} on  ${app_date} at ${app_time} has been accepted!`;
    console.log("bye");
    query_tokens = await FirebaseToken.findAll({
      attributes: ["token"],
      where: { user_id: petOwner_id },
    });
  } else if (notification_type == "rejected_appointment_notification") {
    title = "Appointment Rejected!";
    body = `You appointment with Dr. ${doctor_name} on  ${app_date} at ${app_time} has been rejected!`;
    console.log("bye");
    query_tokens = await FirebaseToken.findAll({
      attributes: ["token"],
      where: { user_id: petOwner_id },
    });
  }

  const tokens = query_tokens?.map((tokenObj) => tokenObj.dataValues.token);

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
      res.json(response);
    })
    .catch((error) => {
      console.error("Error sending notification:", error);
      next(error);
    });
}

module.exports = {
  sendNotification,
};
