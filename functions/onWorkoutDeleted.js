const functions = require("firebase-functions");
const admin = require("./admin");

const db = admin.database();

module.exports = functions.database
  .ref("/users/{uid}/workouts/{workoutId}")
  .onDelete((change, context) => {
    const workoutId = context.params.workoutId;
    try {
      const remove = db.ref("workouts/" + workoutId).remove();
      return remove;
    } catch (error) {
      console.log(error);
      return error;
    }
  });
