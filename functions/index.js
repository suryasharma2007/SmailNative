const { onCall } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");

admin.initializeApp();

exports.testFunction = onCall(async (request) => {
  return {
    success: true,
    message: "Smail Cloud Function is working!",
  };
});