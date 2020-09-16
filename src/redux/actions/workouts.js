import firebase from "../../config/firebase";
import "firebase/auth";
import "firebase/database";

// define types

export const UPDATE_NAME = "UPDATE_NAME";
export const UPDATE_COMPLETE = "UPDATE_COMPLETE";
export const ADD_WORKOUT = "ADD_WORKOUT";
export const GET_WORKOUT = "GET_WORKOUT";
export const DELETE_WORKOUT = "DELETE_WORKOUT";
export const UPDATE_WORKOUT = "UPDATEE_WORKOUT";

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

export const getWorkout = wid => {
  return async (dispatch, getState) => {
    try {
      const workout = await db
        .collection("workouts")
        .doc(wid)
        .get();

      dispatch({ type: LOGIN, payload: user.data() });
    } catch (e) {
      console.log(e);
    }
  };
};

export const addWorkout = async workout => {
  return async (dispatch, getState) => {
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
          .child(this.state.currentUser.uid)
          .push().key;

        const stamp = new Date().getTime();
        const response = await firebase
          .database()
          .ref("workouts")
          .child(this.state.currentUser.uid)
          .child(key)
          .set({ name: workout, complete: false });
        this.props.addWorkout({ name: workout, complete: false, key: key });
      }
    } catch (error) {
      console.log(error);
    }
  };
};
