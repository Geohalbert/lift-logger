const functions = require("firebase-functions");
const admin = require("./admin");

const db = admin.firestore();

module.exports = functions.auth.user().onCreate(user => {
  const workoutCollection = db.collection("workouts");
  const stamp = new Date().getTime();
  return workoutCollection.doc(user.uid).set({
    uid: user.uid,
    createdAt: stamp,
    updatedAt: stamp,
    completed: false,
    userExercises: []
  });
});
