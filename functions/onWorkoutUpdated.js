const functions = require("firebase-functions");
const admin = require("./admin");

const db = admin.database();

module.exports = functions.database
  .ref("/users/{uid}/workouts/{workoutId}")
  .onUpdate((change, context) => {
    let after = change.after.val();
    const workoutId = context.params.workoutId;
    try {
      const snapshot = db.ref("workouts/" + workoutId).update(after);
      return snapshot;
    } catch (error) {
      console.log(error);
      return error;
    }
  });
