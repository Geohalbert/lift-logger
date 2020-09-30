import firebase from "../../config/firebase";
import "firebase/auth";
import "firebase/database";

// define types

export const UPDATE_NAME = "UPDATE_NAME";
export const UPDATE_COMPLETE = "UPDATE_COMPLETE";
export const ADD_WORKOUT = "ADD_WORKOUT";
export const GET_WORKOUT = "GET_WORKOUT";
export const LOAD_WORKOUTS_FROM_SERVER = "LOAD_WORKOUTS_FROM_SERVER";
export const DELETE_WORKOUT = "DELETE_WORKOUT";
export const UPDATE_WORKOUT = "UPDATE_WORKOUT";

export const updateName = name => {
  return {
    type: UPDATE_NAME,
    payload: name
  };
};

export const updateComplete = complete => {
  return {
    type: UPDATE_COMPLETE,
    payload: complete
  };
};

export const getWorkout = async wid => {
  try {
    const workout = await db
      .collection("workouts")
      .doc(wid)
      .get();

    return { type: GET_WORKOUT, payload: workout };
  } catch (e) {
    console.log(e);
  }
};

export const loadWorkouts = async user => {
  const workouts = await firebase
    .database()
    .ref("users/" + user.uid)
    .child("workouts")
    .once("value");

  const workoutsArray = snapshotToArray(workouts);
  return {
    type: LOAD_WORKOUTS_FROM_SERVER,
    payload: workoutsArray.reverse()
  };
};

export const addWorkout = async (workoutName, currentUser) => {
  try {
    const snapshot = await firebase
      .database()
      .ref("workouts")
      .child(getcurrentUser.uid)
      .orderByChild("name")
      .equalTo(workout)
      .once("value");

    if (snapshot.exists()) {
      alert("unable to add as workout already exists");
    } else {
      const key = await firebase
        .database()
        .ref("workouts")
        .child(currentUser.uid)
        .push().key;

      const stamp = new Date().getTime();
      const workoutPayload = {
        uid: currentUser.uid,
        name: workoutName,
        complete: false,
        createdAt: stamp,
        updatedAt: stamp,
        exercises: {}
      };
      let updates = {};
      updates["/workouts/" + key] = workoutPayload;
      updates[
        "/users/" + currentUser.uid + "/workouts/" + key
      ] = workoutPayload;

      const response = await firebase
        .database()
        .ref()
        .update(updates);

      return {
        type: ADD_WORKOUT,
        response: response
      };
    }
  } catch (error) {
    console.log(error);
  }
};
