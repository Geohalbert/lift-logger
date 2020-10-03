const functions = require("firebase-functions");
const admin = require("./admin");

const db = admin.database();

module.exports = functions.database
  .ref("/users/{uid}/workouts/{workoutId}")
  .onUpdate((change, context) => {
    let newStamp = new Date().getTime();
    let after = change.after.val();
    let updatedWorkout = Object.assign(after, { updatedAt: newStamp });
    const workoutId = context.params.workoutId;
    try {
      const snapshot = db.ref("workouts/" + workoutId).update(updatedWorkout);
      return snapshot;
    } catch (error) {
      console.log(error);
      return error;
    }
  });
