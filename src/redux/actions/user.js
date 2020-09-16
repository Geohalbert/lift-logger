import firebase, { db } from "../config/firebase.js";

// define types

export const UPDATE_EMAIL = "UPDATE_EMAIL";
export const UPDATE_PASSWORD = "UPDATE_PASSWORD";
export const LOGIN = "LOGIN";
export const REGISTER = "REGISTER";

// actions

export const updateEmail = email => {
  return {
    type: UPDATE_EMAIL,
    payload: email
  };
};

export const updatePassword = password => {
  return {
    type: UPDATE_PASSWORD,
    payload: password
  };
};

export const login = () => {
  return async (dispatch, getState) => {
    try {
      const { email, password } = getState().user;
      const response = await firebase.auth().signInWithEmailAndPassword(
        email,
        password
      );

      dispatch(getUser(response.user.uid));
    } catch (e) {
      console.log(e);
    }
  };
};

export const getUser = uid => {
  return async (dispatch, getState) => {
    try {
      const user = await db
        .collection("users")
        .doc(uid)
        .get();

      dispatch({ type: LOGIN, payload: user.data() });
    } catch (e) {
      console.log(e);
    }
  };
};

export const register = () => {
  return async (dispatch, getState) => {
    try {
      const { email, password } = getState().user;
      const response = await firebase.auth().createUserWithEmailAndPassword(
        email,
        password
      );
      if (response.user.uid) {
        const user = {
          uid: response.user.uid,
          email: email
        };

        dispatch({ type: REGISTER, payload: user });
      }
    } catch (e) {
      console.log(e);
    }
  };
};
