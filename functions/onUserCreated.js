const functions = require("firebase-functions");
const admin = require("./admin");

const db = admin.firestore();

module.exports = functions.auth.user().onCreate(user => {
  const userCollection = db.collection("users");
  var email = user.email;
  const stamp = new Date().getTime();
  return userCollection.doc(user.uid).set({
    email: email && email.toLowerCase ? email.toLowerCase() : email,
    uid: user.uid,
    createdAt: stamp,
    updatedAt: stamp,
    userWorkouts: []
  });
});
