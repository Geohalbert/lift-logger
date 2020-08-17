const functions = require("firebase-functions");
const admin = require("./admin");

const db = admin.database();

module.exports = functions.auth.user().onCreate(async user => {
  const email = user.email;
  const stamp = new Date().getTime();
  try {
    const snapshot = await db.ref("users/" + user.uid).set({
      email: email && email.toLowerCase ? email.toLowerCase() : email,
      uid: user.uid,
      createdAt: stamp,
      updatedAt: stamp,
      userWorkouts: []
    });
    return snapshot;
  } catch (error) {
    console.log(error);
    return error;
  }
});
