const admin = require("firebase-admin");
const firebase = require("../firebase.json");

const firebaseAdminConfig = {
  credential: admin.credential.cert(firebase),
};

const firebaseAdminApp = admin.initializeApp(firebaseAdminConfig);

exports.firebaseAdminAuth = firebaseAdminApp.auth();
